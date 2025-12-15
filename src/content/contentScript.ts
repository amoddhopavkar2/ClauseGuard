/**
 * ClauseGuard Content Script
 * Main entry point for page scanning and highlighting
 * Handles page detection, scanning, and communication with background script
 */

import type {
  ClauseMatch,
  ScanResult,
  UserSettings,
  ClauseCategory,
  Message
} from '../shared/types';
import { DEFAULT_SETTINGS } from '../shared/types';
import { CLAUSE_PATTERNS } from '../shared/patterns';
import {
  loadSettings,
  isLikelyLegalPage,
  getDomain,
  isAllowlisted,
  isDenylisted,
  calculateRiskLevel,
  extractExcerpt,
  generateMatchId,
  debounce
} from '../shared/utils';
import {
  getTextNodes,
  highlightMatches,
  removeAllHighlights,
  scrollToHighlight,
  addHighlightClickHandlers
} from './highlighter';
import {
  showPanel,
  hidePanel,
  showScanning,
  updateProgress,
  focusExcerpt,
  isPanelVisible
} from './panel';

// State
let currentSettings: UserSettings = DEFAULT_SETTINGS;
let lastScanResult: ScanResult | null = null;
let isScanning = false;
let hasInitialized = false;

/**
 * Scan page for clause matches
 * Processes text nodes in batches to avoid blocking the main thread
 */
async function scanPage(forceScan: boolean = false): Promise<ScanResult> {
  const startTime = performance.now();
  const url = window.location.href;
  const title = document.title;
  const h1 = document.querySelector('h1')?.textContent || '';

  // Check if we should scan
  const domain = getDomain(url);
  const isLegal = isLikelyLegalPage(url, title, h1);

  // Check domain overrides
  const domainEnabled = currentSettings.domainOverrides[domain];
  if (domainEnabled === false) {
    return createEmptyResult(url, title, isLegal, startTime);
  }

  // Check denylist
  if (isDenylisted(domain, currentSettings.denylist)) {
    return createEmptyResult(url, title, isLegal, startTime);
  }

  // Skip if not a legal page and setting requires legal pages (unless force scanning or allowlisted)
  if (!forceScan && currentSettings.onlyLegalPages && !isLegal) {
    if (!isAllowlisted(domain, currentSettings.allowlist)) {
      return createEmptyResult(url, title, isLegal, startTime);
    }
  }

  // Get text nodes to scan
  const textNodes = getTextNodes(currentSettings.skipElements);
  const totalNodes = textNodes.length;
  const matches: ClauseMatch[] = [];

  // Track matches per paragraph to cap repeated patterns
  const matchCountByPattern = new Map<string, number>();
  const maxMatchesPerPattern = 5;

  // Process text nodes in batches
  const batchSize = 50;
  let processedNodes = 0;

  const processBatch = async (startIndex: number): Promise<void> => {
    return new Promise((resolve) => {
      const callback = () => {
        const endIndex = Math.min(startIndex + batchSize, totalNodes);

        for (let i = startIndex; i < endIndex; i++) {
          const textNode = textNodes[i];
          const text = textNode.textContent || '';

          if (text.length < 10) continue; // Skip very short text

          // Check each pattern
          for (const pattern of CLAUSE_PATTERNS) {
            // Skip if we've found too many of this pattern
            const patternCount = matchCountByPattern.get(pattern.id) || 0;
            if (patternCount >= maxMatchesPerPattern) continue;

            // Reset lastIndex for global patterns
            pattern.pattern.lastIndex = 0;

            let match: RegExpExecArray | null;
            while ((match = pattern.pattern.exec(text)) !== null) {
              // Double-check pattern count
              const currentCount = matchCountByPattern.get(pattern.id) || 0;
              if (currentCount >= maxMatchesPerPattern) break;

              const matchId = generateMatchId();
              const matchStart = match.index;
              const matchEnd = matchStart + match[0].length;

              const clauseMatch: ClauseMatch = {
                id: matchId,
                patternId: pattern.id,
                category: pattern.category,
                severity: pattern.severity,
                weight: pattern.weight,
                excerpt: extractExcerpt(text, matchStart, matchEnd),
                matchedText: match[0],
                startOffset: matchStart,
                endOffset: matchEnd,
                textNodeIndex: i,
                highlighted: false,
                description: pattern.description,
              };

              matches.push(clauseMatch);
              matchCountByPattern.set(pattern.id, currentCount + 1);

              // Prevent infinite loop with zero-length matches
              if (match[0].length === 0) {
                pattern.pattern.lastIndex++;
              }
            }
          }

          processedNodes++;
        }

        // Update progress
        const percentage = (processedNodes / totalNodes) * 100;
        updateProgress(percentage);

        resolve();
      };

      // Use requestIdleCallback if available
      if ('requestIdleCallback' in window) {
        requestIdleCallback(callback, { timeout: 50 });
      } else {
        setTimeout(callback, 0);
      }
    });
  };

  // Process all batches
  for (let i = 0; i < totalNodes; i += batchSize) {
    await processBatch(i);
  }

  // Calculate category counts
  const categoryCounts: Record<ClauseCategory, number> = {
    'arbitration': 0,
    'auto-renew': 0,
    'data-sharing': 0,
    'data-retention': 0,
    'unilateral-changes': 0,
    'liability': 0,
    'governing-law': 0,
  };

  for (const match of matches) {
    categoryCounts[match.category]++;
  }

  // Calculate total score
  const totalScore = matches.reduce((sum, m) => sum + m.weight, 0);

  // Calculate risk level
  const riskLevel = calculateRiskLevel(totalScore, matches, currentSettings.sensitivity);

  const result: ScanResult = {
    pageUrl: url,
    pageTitle: title,
    timestamp: Date.now(),
    isLegalPage: isLegal,
    riskLevel,
    totalScore,
    matches,
    categoryCounts,
    scanDurationMs: performance.now() - startTime,
  };

  return result;
}

/**
 * Create an empty scan result
 */
function createEmptyResult(
  url: string,
  title: string,
  isLegal: boolean,
  startTime: number
): ScanResult {
  return {
    pageUrl: url,
    pageTitle: title,
    timestamp: Date.now(),
    isLegalPage: isLegal,
    riskLevel: 'low',
    totalScore: 0,
    matches: [],
    categoryCounts: {
      'arbitration': 0,
      'auto-renew': 0,
      'data-sharing': 0,
      'data-retention': 0,
      'unilateral-changes': 0,
      'liability': 0,
      'governing-law': 0,
    },
    scanDurationMs: performance.now() - startTime,
  };
}

/**
 * Run the full scan and display results
 */
async function runScan(forceScan: boolean = false): Promise<void> {
  if (isScanning) return;

  isScanning = true;

  // Show scanning indicator
  showScanning(currentSettings);

  // Remove previous highlights
  removeAllHighlights();

  try {
    // Perform scan
    const result = await scanPage(forceScan);
    lastScanResult = result;

    // Get fresh text nodes for highlighting (after clearing old highlights)
    const textNodes = getTextNodes(currentSettings.skipElements);

    // Apply highlights
    if (result.matches.length > 0) {
      await highlightMatches(result.matches, textNodes, currentSettings, (processed, total) => {
        updateProgress(50 + (processed / total) * 50);
      });
    }

    // Show panel with results
    showPanel(result, currentSettings, {
      onRescan: () => runScan(true),
      onClose: () => {
        removeAllHighlights();
      },
    });

    // Notify background script
    chrome.runtime.sendMessage({
      type: 'SCAN_COMPLETE',
      payload: result,
    });

  } catch (error) {
    console.error('ClauseGuard: Scan error:', error);
  } finally {
    isScanning = false;
  }
}

/**
 * Handle highlight clicks - focus the excerpt in panel
 */
function handleHighlightClick(matchId: string, _category: ClauseCategory): void {
  if (!isPanelVisible()) {
    showPanel(lastScanResult, currentSettings, {
      onRescan: () => runScan(true),
      onClose: () => {
        removeAllHighlights();
      },
    });
  }
  focusExcerpt(matchId);
}

/**
 * Handle messages from popup/background
 */
function handleMessage(
  message: Message,
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response: unknown) => void
): boolean {
  switch (message.type) {
    case 'SCAN_NOW':
      runScan(true).then(() => {
        sendResponse({ success: true, result: lastScanResult });
      });
      return true; // Will respond async

    case 'GET_STATUS':
      sendResponse({
        success: true,
        data: {
          isScanning,
          lastScanResult,
          isLegalPage: isLikelyLegalPage(
            window.location.href,
            document.title,
            document.querySelector('h1')?.textContent || ''
          ),
        },
      });
      return false;

    default:
      return false;
  }
}

/**
 * Handle SPA navigation
 */
const handleNavigation = debounce(async () => {
  // Check if we should auto-scan on this page
  currentSettings = await loadSettings();

  if (!currentSettings.enabled) return;

  const domain = getDomain(window.location.href);
  const domainEnabled = currentSettings.domainOverrides[domain];

  if (domainEnabled === false) return;
  if (isDenylisted(domain, currentSettings.denylist)) return;

  const isLegal = isLikelyLegalPage(
    window.location.href,
    document.title,
    document.querySelector('h1')?.textContent || ''
  );

  // Auto-scan if it's a legal page or we're set to scan all pages
  if (isLegal || !currentSettings.onlyLegalPages || isAllowlisted(domain, currentSettings.allowlist)) {
    // Clear previous results
    removeAllHighlights();
    hidePanel();
    lastScanResult = null;

    // Run new scan
    await runScan(false);
  }
}, 500);

/**
 * Initialize the content script
 */
async function initialize(): Promise<void> {
  if (hasInitialized) return;
  hasInitialized = true;

  // Load settings
  currentSettings = await loadSettings();

  // Check if extension is enabled
  if (!currentSettings.enabled) {
    console.log('ClauseGuard: Extension disabled');
    return;
  }

  // Add click handler for highlights
  addHighlightClickHandlers(handleHighlightClick);

  // Set up message listener
  chrome.runtime.onMessage.addListener(handleMessage);

  // Set up navigation listeners for SPAs
  window.addEventListener('popstate', handleNavigation);

  // Override pushState and replaceState for SPA detection
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    handleNavigation();
  };

  history.replaceState = function (...args) {
    originalReplaceState.apply(this, args);
    handleNavigation();
  };

  // Check if we should auto-scan this page
  const domain = getDomain(window.location.href);
  const domainEnabled = currentSettings.domainOverrides[domain];

  if (domainEnabled === false) {
    console.log('ClauseGuard: Domain disabled');
    return;
  }

  if (isDenylisted(domain, currentSettings.denylist)) {
    console.log('ClauseGuard: Domain denylisted');
    return;
  }

  const isLegal = isLikelyLegalPage(
    window.location.href,
    document.title,
    document.querySelector('h1')?.textContent || ''
  );

  // Auto-scan if appropriate
  if (isLegal || !currentSettings.onlyLegalPages || isAllowlisted(domain, currentSettings.allowlist)) {
    // Wait a bit for the page to fully render
    setTimeout(() => runScan(false), 500);
  }

  console.log('ClauseGuard: Initialized', { isLegal, domain });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
