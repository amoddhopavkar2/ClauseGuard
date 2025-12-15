/**
 * ClauseGuard Highlighter
 * Handles highlighting matched clauses in the DOM
 * Uses TreeWalker for efficient text node traversal
 * Processes in batches to avoid blocking the main thread
 */

import type { ClauseMatch, UserSettings, ClauseCategory } from '../shared/types';

// CSS class names
const HIGHLIGHT_CLASS = 'cg-highlight';
const HIGHLIGHT_ACTIVE_CLASS = 'cg-highlight-active';

// Map to track highlighted elements by match ID
const highlightElements = new Map<string, HTMLElement[]>();

/**
 * Create a highlight wrapper element
 */
function createHighlightElement(
  match: ClauseMatch,
  settings: UserSettings
): HTMLElement {
  const mark = document.createElement('mark');
  mark.className = `${HIGHLIGHT_CLASS} cg-cat-${match.category}`;
  mark.dataset.cgId = match.id;
  mark.dataset.cgCategory = match.category;
  mark.style.backgroundColor = settings.highlightColors[match.category] || '#ffff00';
  mark.style.color = 'inherit';
  mark.style.padding = '0 2px';
  mark.style.borderRadius = '2px';
  mark.style.cursor = 'pointer';
  return mark;
}

/**
 * Check if a node should be skipped during scanning
 */
function shouldSkipNode(node: Node, skipElements: string[]): boolean {
  let current: Node | null = node;

  while (current && current !== document.body) {
    if (current.nodeType === Node.ELEMENT_NODE) {
      const element = current as HTMLElement;
      const tagName = element.tagName.toLowerCase();

      // Skip configured elements
      if (skipElements.includes(tagName)) {
        return true;
      }

      // Skip hidden elements
      if (element.hidden || element.style.display === 'none') {
        return true;
      }

      // Skip our own panel and highlights
      if (element.id === 'clauseguard-panel' || element.classList.contains(HIGHLIGHT_CLASS)) {
        return true;
      }

      // Skip shadow roots we created
      if (element.shadowRoot && element.id === 'clauseguard-root') {
        return true;
      }
    }

    current = current.parentNode;
  }

  return false;
}

/**
 * Get all text nodes in the document for scanning
 */
export function getTextNodes(skipElements: string[]): Text[] {
  const textNodes: Text[] = [];
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        // Skip empty or whitespace-only nodes
        if (!node.textContent || !node.textContent.trim()) {
          return NodeFilter.FILTER_REJECT;
        }

        // Skip configured elements
        if (shouldSkipNode(node, skipElements)) {
          return NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_ACCEPT;
      },
    }
  );

  let node: Text | null;
  while ((node = walker.nextNode() as Text | null)) {
    textNodes.push(node);
  }

  return textNodes;
}

/**
 * Wrap matched text in a text node with highlight element
 * Returns the new elements created
 */
function wrapTextMatch(
  textNode: Text,
  match: ClauseMatch,
  settings: UserSettings
): HTMLElement | null {
  const text = textNode.textContent || '';
  const matchStart = match.startOffset;
  const matchEnd = match.endOffset;

  // Validate offsets
  if (matchStart < 0 || matchEnd > text.length || matchStart >= matchEnd) {
    console.warn('ClauseGuard: Invalid match offsets', { matchStart, matchEnd, textLength: text.length });
    return null;
  }

  try {
    // Create a range for the match
    const range = document.createRange();
    range.setStart(textNode, matchStart);
    range.setEnd(textNode, matchEnd);

    // Create highlight element
    const highlight = createHighlightElement(match, settings);

    // Surround the range with our highlight
    range.surroundContents(highlight);

    // Track the element
    if (!highlightElements.has(match.id)) {
      highlightElements.set(match.id, []);
    }
    highlightElements.get(match.id)!.push(highlight);

    return highlight;
  } catch (error) {
    // This can happen if the range spans multiple elements
    console.warn('ClauseGuard: Could not highlight match:', error);
    return null;
  }
}

/**
 * Process matches for a batch of text nodes
 * Uses requestIdleCallback for non-blocking processing
 */
export async function highlightMatches(
  matches: ClauseMatch[],
  textNodes: Text[],
  settings: UserSettings,
  onProgress?: (processed: number, total: number) => void
): Promise<void> {
  // Group matches by text node index
  const matchesByNode = new Map<number, ClauseMatch[]>();

  for (const match of matches) {
    if (!matchesByNode.has(match.textNodeIndex)) {
      matchesByNode.set(match.textNodeIndex, []);
    }
    matchesByNode.get(match.textNodeIndex)!.push(match);
  }

  // Sort matches within each node by position (reverse order for safe insertion)
  for (const nodeMatches of matchesByNode.values()) {
    nodeMatches.sort((a, b) => b.startOffset - a.startOffset);
  }

  // Process in batches
  const batchSize = 10;
  const nodeIndices = Array.from(matchesByNode.keys()).sort((a, b) => b - a);
  let processed = 0;

  const processBatch = (startIndex: number): Promise<void> => {
    return new Promise((resolve) => {
      const callback = () => {
        const endIndex = Math.min(startIndex + batchSize, nodeIndices.length);

        for (let i = startIndex; i < endIndex; i++) {
          const nodeIndex = nodeIndices[i];
          const nodeMatches = matchesByNode.get(nodeIndex)!;
          const textNode = textNodes[nodeIndex];

          if (!textNode || !textNode.parentNode) continue;

          // Process matches for this node (in reverse order)
          for (const match of nodeMatches) {
            wrapTextMatch(textNode, match, settings);
            match.highlighted = true;
          }

          processed++;
        }

        if (onProgress) {
          onProgress(processed, nodeIndices.length);
        }

        resolve();
      };

      // Use requestIdleCallback if available, otherwise setTimeout
      if ('requestIdleCallback' in window) {
        requestIdleCallback(callback, { timeout: 100 });
      } else {
        setTimeout(callback, 0);
      }
    });
  };

  // Process all batches
  for (let i = 0; i < nodeIndices.length; i += batchSize) {
    await processBatch(i);
  }
}

/**
 * Remove all highlights from the document
 */
export function removeAllHighlights(): void {
  // Remove all highlight elements
  const highlights = document.querySelectorAll(`.${HIGHLIGHT_CLASS}`);

  highlights.forEach((highlight) => {
    const parent = highlight.parentNode;
    if (parent) {
      // Replace highlight with its text content
      const textNode = document.createTextNode(highlight.textContent || '');
      parent.replaceChild(textNode, highlight);
      // Normalize to merge adjacent text nodes
      parent.normalize();
    }
  });

  // Clear tracking map
  highlightElements.clear();
}

/**
 * Scroll to and flash a specific highlight
 */
export function scrollToHighlight(matchId: string): void {
  const elements = highlightElements.get(matchId);
  if (!elements || elements.length === 0) {
    // Try finding by data attribute as fallback
    const element = document.querySelector(`[data-cg-id="${matchId}"]`);
    if (element) {
      scrollAndFlash(element as HTMLElement);
    }
    return;
  }

  scrollAndFlash(elements[0]);
}

/**
 * Helper to scroll to element and flash it
 */
function scrollAndFlash(element: HTMLElement): void {
  // Scroll into view with some offset
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  });

  // Add active class for flash effect
  element.classList.add(HIGHLIGHT_ACTIVE_CLASS);

  // Remove after animation
  setTimeout(() => {
    element.classList.remove(HIGHLIGHT_ACTIVE_CLASS);
  }, 2000);
}

/**
 * Get highlight element by match ID
 */
export function getHighlightElement(matchId: string): HTMLElement | null {
  const elements = highlightElements.get(matchId);
  return elements?.[0] || null;
}

/**
 * Add click handlers to all highlights
 */
export function addHighlightClickHandlers(
  onHighlightClick: (matchId: string, category: ClauseCategory) => void
): void {
  document.body.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains(HIGHLIGHT_CLASS)) {
      const matchId = target.dataset.cgId;
      const category = target.dataset.cgCategory as ClauseCategory;
      if (matchId && category) {
        onHighlightClick(matchId, category);
      }
    }
  });
}
