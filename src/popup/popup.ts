/**
 * ClauseGuard Popup Script
 * Handles popup UI interactions
 */

import type { ScanResult, UserSettings, ClauseCategory } from '../shared/types';
import { CATEGORY_INFO } from '../shared/types';
import { loadSettings, getDomain } from '../shared/utils';

// DOM Elements
const statusSection = document.getElementById('status-section')!;
const domainSection = document.getElementById('domain-section')!;
const domainNameEl = document.getElementById('domain-name')!;
const domainToggle = document.getElementById('domain-toggle') as HTMLInputElement;
const scanBtn = document.getElementById('scan-btn')!;
const resultsSection = document.getElementById('results-section')!;
const resultsCounts = document.getElementById('results-counts')!;
const riskBadge = document.getElementById('risk-badge')!;
const legalIndicator = document.getElementById('legal-indicator')!;
const optionsLink = document.getElementById('options-link')!;

// State
let currentDomain = '';
let settings: UserSettings;

/**
 * Get the active tab
 */
async function getActiveTab(): Promise<chrome.tabs.Tab | null> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab || null;
}

/**
 * Update status message
 */
function updateStatus(icon: string, message: string, className: string = ''): void {
  statusSection.innerHTML = `
    <div class="status-message ${className}">
      <span class="status-icon">${icon}</span>
      <span>${message}</span>
    </div>
  `;
}

/**
 * Show loading state
 */
function showLoading(): void {
  statusSection.innerHTML = `
    <div class="status-loading">
      <div class="spinner"></div>
      <span>Loading...</span>
    </div>
  `;
}

/**
 * Render category counts
 */
function renderCounts(counts: Record<ClauseCategory, number>): void {
  const categories = Object.entries(counts)
    .filter(([_, count]) => count > 0)
    .map(([category, count]) => {
      const info = CATEGORY_INFO[category as ClauseCategory];
      return `
        <div class="count-badge">
          <span class="count-icon">${info.icon}</span>
          <span class="count-value">${count}</span>
        </div>
      `;
    })
    .join('');

  if (categories) {
    resultsCounts.innerHTML = categories;
  } else {
    resultsCounts.innerHTML = '<span style="color: #868e96; font-size: 12px;">No issues found</span>';
  }
}

/**
 * Display scan results
 */
function displayResults(result: ScanResult): void {
  resultsSection.style.display = 'block';

  // Update risk badge
  riskBadge.textContent = result.riskLevel.toUpperCase();
  riskBadge.className = `risk-badge risk-${result.riskLevel}`;

  // Render counts
  renderCounts(result.categoryCounts);
}

/**
 * Initialize popup
 */
async function initialize(): Promise<void> {
  showLoading();

  try {
    // Load settings
    settings = await loadSettings();

    // Get active tab
    const tab = await getActiveTab();
    if (!tab?.url) {
      updateStatus('⚠️', 'Cannot access this page', 'status-disabled');
      scanBtn.setAttribute('disabled', 'true');
      return;
    }

    // Check if it's a valid URL (not chrome://, etc.)
    const url = tab.url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      updateStatus('🚫', 'Cannot scan this page type', 'status-disabled');
      scanBtn.setAttribute('disabled', 'true');
      return;
    }

    // Get domain
    currentDomain = getDomain(url);
    domainNameEl.textContent = currentDomain;

    // Set up domain toggle
    const domainEnabled = settings.domainOverrides[currentDomain] ?? true;
    domainToggle.checked = domainEnabled;
    domainSection.style.display = 'flex';

    // Check if extension is globally enabled
    if (!settings.enabled) {
      updateStatus('⏸️', 'Extension is disabled', 'status-disabled');
      return;
    }

    // Get status from content script
    try {
      const response = await chrome.tabs.sendMessage(tab.id!, { type: 'GET_STATUS' });

      if (response?.success && response.data) {
        const { lastScanResult, isLegalPage, isScanning } = response.data;

        if (isScanning) {
          updateStatus('🔄', 'Scanning page...', 'status-scanning');
          scanBtn.setAttribute('disabled', 'true');
        } else if (lastScanResult) {
          displayResults(lastScanResult);
          statusSection.innerHTML = '';
        } else {
          statusSection.innerHTML = '';
        }

        // Show legal page indicator
        if (isLegalPage) {
          legalIndicator.style.display = 'flex';
        }
      } else {
        statusSection.innerHTML = '';
      }
    } catch {
      // Content script might not be loaded yet
      updateStatus('ℹ️', 'Click scan to analyze this page');
    }

  } catch (error) {
    console.error('ClauseGuard: Popup error:', error);
    updateStatus('❌', 'An error occurred');
  }
}

/**
 * Handle scan button click
 */
async function handleScan(): Promise<void> {
  const tab = await getActiveTab();
  if (!tab?.id) return;

  // Update UI
  scanBtn.setAttribute('disabled', 'true');
  updateStatus('🔄', 'Scanning page...', 'status-scanning');
  resultsSection.style.display = 'none';

  try {
    // Request scan from content script
    const response = await chrome.tabs.sendMessage(tab.id, { type: 'SCAN_NOW' });

    if (response?.success && response.result) {
      displayResults(response.result);
      statusSection.innerHTML = '';
    } else {
      updateStatus('❌', 'Scan failed - try refreshing the page');
    }
  } catch {
    updateStatus('❌', 'Could not connect to page. Try refreshing.');
  } finally {
    scanBtn.removeAttribute('disabled');
  }
}

/**
 * Handle domain toggle change
 */
async function handleDomainToggle(): Promise<void> {
  const enabled = domainToggle.checked;

  // Update settings
  await chrome.runtime.sendMessage({
    type: 'SET_DOMAIN_ENABLED',
    payload: {
      domain: currentDomain,
      enabled,
    },
  });

  // Refresh to apply change
  const tab = await getActiveTab();
  if (tab?.id) {
    chrome.tabs.reload(tab.id);
    window.close();
  }
}

/**
 * Open options page
 */
function openOptions(event: Event): void {
  event.preventDefault();
  chrome.runtime.openOptionsPage();
}

// Event listeners
scanBtn.addEventListener('click', handleScan);
domainToggle.addEventListener('change', handleDomainToggle);
optionsLink.addEventListener('click', openOptions);

// Initialize on load
document.addEventListener('DOMContentLoaded', initialize);
initialize();
