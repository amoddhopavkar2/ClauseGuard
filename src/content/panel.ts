/**
 * ClauseGuard Panel
 * Right-side floating panel showing scan results
 * Uses Shadow DOM to isolate styles from the host page
 */

import type { ScanResult, ClauseMatch, ClauseCategory, RiskLevel, UserSettings } from '../shared/types';
import { CATEGORY_INFO, SEVERITY_INFO } from '../shared/types';
import { scrollToHighlight } from './highlighter';
import { escapeHtml, truncate } from '../shared/utils';

// Panel container reference
let panelRoot: HTMLElement | null = null;
let shadowRoot: ShadowRoot | null = null;

/**
 * Panel CSS styles
 */
const PANEL_STYLES = `
  :host {
    all: initial;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  }

  * {
    box-sizing: border-box;
  }

  .cg-panel {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 360px;
    max-height: calc(100vh - 40px);
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 2147483647;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-size: 14px;
    line-height: 1.5;
    color: #1a1a1a;
  }

  .cg-panel.collapsed {
    max-height: none;
    height: auto;
  }

  .cg-panel.collapsed .cg-panel-body {
    display: none;
  }

  .cg-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    flex-shrink: 0;
  }

  .cg-header-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .cg-logo {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -0.3px;
  }

  .cg-risk-pill {
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .cg-risk-low {
    background: rgba(64, 192, 87, 0.9);
    color: white;
  }

  .cg-risk-medium {
    background: rgba(245, 159, 0, 0.9);
    color: white;
  }

  .cg-risk-high {
    background: rgba(224, 49, 49, 0.9);
    color: white;
  }

  .cg-header-right {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .cg-btn {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    transition: background 0.2s;
  }

  .cg-btn:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .cg-panel-body {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex: 1;
    min-height: 0;
  }

  .cg-summary {
    padding: 12px 16px;
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
    flex-shrink: 0;
  }

  .cg-summary-title {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #868e96;
    margin-bottom: 8px;
  }

  .cg-category-counts {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .cg-category-badge {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    background: white;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    font-size: 12px;
  }

  .cg-category-icon {
    font-size: 12px;
  }

  .cg-category-count {
    font-weight: 600;
    color: #495057;
  }

  .cg-excerpts {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
  }

  .cg-excerpt-item {
    padding: 10px 12px;
    background: #f8f9fa;
    border-radius: 8px;
    margin-bottom: 8px;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
    border-left: 3px solid transparent;
  }

  .cg-excerpt-item:hover {
    background: #e9ecef;
    transform: translateX(2px);
  }

  .cg-excerpt-item:last-child {
    margin-bottom: 0;
  }

  .cg-excerpt-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
  }

  .cg-excerpt-category {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .cg-excerpt-severity {
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 600;
  }

  .cg-severity-critical {
    background: #c92a2a;
    color: white;
  }

  .cg-severity-high {
    background: #e03131;
    color: white;
  }

  .cg-severity-medium {
    background: #f59f00;
    color: white;
  }

  .cg-severity-low {
    background: #40c057;
    color: white;
  }

  .cg-excerpt-text {
    font-size: 12px;
    color: #495057;
    line-height: 1.6;
    word-break: break-word;
  }

  .cg-excerpt-match {
    background: rgba(255, 235, 59, 0.4);
    padding: 0 2px;
    border-radius: 2px;
    font-weight: 500;
  }

  .cg-progress {
    padding: 16px;
    text-align: center;
  }

  .cg-progress-bar {
    height: 4px;
    background: #e9ecef;
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .cg-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #667eea, #764ba2);
    transition: width 0.3s ease;
  }

  .cg-progress-text {
    font-size: 12px;
    color: #868e96;
  }

  .cg-empty {
    padding: 24px 16px;
    text-align: center;
    color: #868e96;
  }

  .cg-empty-icon {
    font-size: 32px;
    margin-bottom: 8px;
  }

  .cg-empty-text {
    font-size: 13px;
  }

  .cg-footer {
    padding: 10px 16px;
    background: #f8f9fa;
    border-top: 1px solid #e9ecef;
    font-size: 11px;
    color: #868e96;
    text-align: center;
    flex-shrink: 0;
  }

  .cg-score {
    font-weight: 600;
    color: #495057;
  }

  /* Scrollbar styling */
  .cg-excerpts::-webkit-scrollbar {
    width: 6px;
  }

  .cg-excerpts::-webkit-scrollbar-track {
    background: transparent;
  }

  .cg-excerpts::-webkit-scrollbar-thumb {
    background: #ced4da;
    border-radius: 3px;
  }

  .cg-excerpts::-webkit-scrollbar-thumb:hover {
    background: #adb5bd;
  }
`;

/**
 * Create the panel container with shadow DOM
 */
function createPanelContainer(): void {
  if (panelRoot) return;

  panelRoot = document.createElement('div');
  panelRoot.id = 'clauseguard-root';
  shadowRoot = panelRoot.attachShadow({ mode: 'closed' });

  // Add styles
  const styleEl = document.createElement('style');
  styleEl.textContent = PANEL_STYLES;
  shadowRoot.appendChild(styleEl);

  // Add to document
  document.documentElement.appendChild(panelRoot);
}

/**
 * Get risk level CSS class
 */
function getRiskClass(level: RiskLevel): string {
  return `cg-risk-${level}`;
}

/**
 * Render category counts section
 */
function renderCategoryCounts(counts: Record<ClauseCategory, number>): string {
  const categories = Object.entries(counts)
    .filter(([_, count]) => count > 0)
    .map(([category, count]) => {
      const info = CATEGORY_INFO[category as ClauseCategory];
      return `
        <div class="cg-category-badge">
          <span class="cg-category-icon">${info.icon}</span>
          <span class="cg-category-count">${count}</span>
        </div>
      `;
    })
    .join('');

  return categories || '<span style="color: #868e96; font-size: 12px;">No issues found</span>';
}

/**
 * Render excerpt with highlighted match
 */
function renderExcerptText(match: ClauseMatch): string {
  const excerpt = escapeHtml(match.excerpt);
  const matchedText = escapeHtml(match.matchedText);

  // Highlight the matched text in the excerpt
  const highlightedExcerpt = excerpt.replace(
    new RegExp(matchedText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'),
    `<span class="cg-excerpt-match">$&</span>`
  );

  return highlightedExcerpt;
}

/**
 * Render excerpts list
 */
function renderExcerpts(
  matches: ClauseMatch[],
  settings: UserSettings,
  maxItems: number = 10
): string {
  if (matches.length === 0) {
    return `
      <div class="cg-empty">
        <div class="cg-empty-icon">✓</div>
        <div class="cg-empty-text">No risky clauses detected</div>
      </div>
    `;
  }

  // Sort by severity (critical > high > medium > low) then by weight
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const sortedMatches = [...matches]
    .sort((a, b) => {
      const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
      return severityDiff !== 0 ? severityDiff : b.weight - a.weight;
    })
    .slice(0, maxItems);

  return sortedMatches
    .map((match) => {
      const categoryInfo = CATEGORY_INFO[match.category];
      const severityInfo = SEVERITY_INFO[match.severity];
      const borderColor = settings.highlightColors[match.category] || '#667eea';

      return `
        <div class="cg-excerpt-item" data-match-id="${match.id}" style="border-left-color: ${borderColor};">
          <div class="cg-excerpt-header">
            <span class="cg-excerpt-category">
              ${categoryInfo.icon} ${categoryInfo.label}
            </span>
            <span class="cg-excerpt-severity cg-severity-${match.severity}">
              ${severityInfo.label}
            </span>
          </div>
          <div class="cg-excerpt-text">
            ${renderExcerptText(match)}
          </div>
        </div>
      `;
    })
    .join('');
}

/**
 * Render progress indicator
 */
function renderProgress(percentage: number): string {
  return `
    <div class="cg-progress">
      <div class="cg-progress-bar">
        <div class="cg-progress-fill" style="width: ${percentage}%"></div>
      </div>
      <div class="cg-progress-text">Scanning... ${Math.round(percentage)}%</div>
    </div>
  `;
}

/**
 * Render the full panel content
 */
function renderPanel(result: ScanResult | null, settings: UserSettings, isScanning: boolean = false): string {
  const riskLevel = result?.riskLevel || 'low';
  const riskClass = getRiskClass(riskLevel);

  return `
    <div class="cg-panel" id="cg-panel-container">
      <div class="cg-header">
        <div class="cg-header-left">
          <span class="cg-logo">ClauseGuard</span>
          ${result ? `<span class="cg-risk-pill ${riskClass}">${riskLevel.toUpperCase()} RISK</span>` : ''}
        </div>
        <div class="cg-header-right">
          <button class="cg-btn" id="cg-btn-rescan" title="Rescan">↻</button>
          <button class="cg-btn" id="cg-btn-collapse" title="Collapse">−</button>
          <button class="cg-btn" id="cg-btn-close" title="Close">×</button>
        </div>
      </div>
      <div class="cg-panel-body">
        ${isScanning ? renderProgress(0) : ''}
        ${!isScanning && result ? `
          <div class="cg-summary">
            <div class="cg-summary-title">Issues by Category</div>
            <div class="cg-category-counts">
              ${renderCategoryCounts(result.categoryCounts)}
            </div>
          </div>
          <div class="cg-excerpts" id="cg-excerpts-list">
            ${renderExcerpts(result.matches, settings)}
          </div>
          <div class="cg-footer">
            Risk Score: <span class="cg-score">${result.totalScore}</span> •
            ${result.matches.length} issue${result.matches.length === 1 ? '' : 's'} found
          </div>
        ` : ''}
        ${!isScanning && !result ? `
          <div class="cg-empty">
            <div class="cg-empty-icon">🔍</div>
            <div class="cg-empty-text">Click rescan to analyze this page</div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

/**
 * Show the panel
 */
export function showPanel(
  result: ScanResult | null,
  settings: UserSettings,
  callbacks: {
    onRescan: () => void;
    onClose: () => void;
  }
): void {
  createPanelContainer();
  if (!shadowRoot) return;

  // Clear existing content (except styles)
  const styleEl = shadowRoot.querySelector('style');
  shadowRoot.innerHTML = '';
  if (styleEl) {
    shadowRoot.appendChild(styleEl);
  }

  // Create panel content
  const contentEl = document.createElement('div');
  contentEl.innerHTML = renderPanel(result, settings);
  shadowRoot.appendChild(contentEl);

  // Add event listeners
  const closeBtn = shadowRoot.getElementById('cg-btn-close');
  const collapseBtn = shadowRoot.getElementById('cg-btn-collapse');
  const rescanBtn = shadowRoot.getElementById('cg-btn-rescan');
  const excerptsList = shadowRoot.getElementById('cg-excerpts-list');
  const panelContainer = shadowRoot.getElementById('cg-panel-container');

  closeBtn?.addEventListener('click', () => {
    hidePanel();
    callbacks.onClose();
  });

  collapseBtn?.addEventListener('click', () => {
    panelContainer?.classList.toggle('collapsed');
    if (collapseBtn) {
      collapseBtn.textContent = panelContainer?.classList.contains('collapsed') ? '+' : '−';
    }
  });

  rescanBtn?.addEventListener('click', () => {
    callbacks.onRescan();
  });

  // Add click handlers for excerpts
  excerptsList?.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const excerptItem = target.closest('.cg-excerpt-item') as HTMLElement;
    if (excerptItem) {
      const matchId = excerptItem.dataset.matchId;
      if (matchId) {
        scrollToHighlight(matchId);
      }
    }
  });
}

/**
 * Update panel with scan progress
 */
export function updateProgress(percentage: number): void {
  if (!shadowRoot) return;

  const progressFill = shadowRoot.querySelector('.cg-progress-fill') as HTMLElement;
  const progressText = shadowRoot.querySelector('.cg-progress-text');

  if (progressFill) {
    progressFill.style.width = `${percentage}%`;
  }
  if (progressText) {
    progressText.textContent = `Scanning... ${Math.round(percentage)}%`;
  }
}

/**
 * Show scanning state
 */
export function showScanning(settings: UserSettings): void {
  createPanelContainer();
  if (!shadowRoot) return;

  const styleEl = shadowRoot.querySelector('style');
  shadowRoot.innerHTML = '';
  if (styleEl) {
    shadowRoot.appendChild(styleEl);
  }

  const contentEl = document.createElement('div');
  contentEl.innerHTML = renderPanel(null, settings, true);
  shadowRoot.appendChild(contentEl);
}

/**
 * Hide the panel
 */
export function hidePanel(): void {
  if (panelRoot) {
    panelRoot.remove();
    panelRoot = null;
    shadowRoot = null;
  }
}

/**
 * Check if panel is visible
 */
export function isPanelVisible(): boolean {
  return panelRoot !== null && document.documentElement.contains(panelRoot);
}

/**
 * Focus an excerpt in the panel
 */
export function focusExcerpt(matchId: string): void {
  if (!shadowRoot) return;

  const excerptItem = shadowRoot.querySelector(`[data-match-id="${matchId}"]`) as HTMLElement;
  if (excerptItem) {
    excerptItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    excerptItem.style.background = '#dee2e6';
    setTimeout(() => {
      excerptItem.style.background = '';
    }, 1500);
  }
}
