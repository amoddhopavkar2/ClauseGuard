/**
 * ClauseGuard Options Page Script
 * Manages extension settings
 */

import type { UserSettings, ClauseCategory, Sensitivity } from '../shared/types';
import { DEFAULT_SETTINGS } from '../shared/types';
import { loadSettings, saveSettings } from '../shared/utils';

// DOM Elements
const enabledToggle = document.getElementById('setting-enabled') as HTMLInputElement;
const onlyLegalToggle = document.getElementById('setting-only-legal') as HTMLInputElement;
const sensitivitySelect = document.getElementById('setting-sensitivity') as HTMLSelectElement;
const resetColorsBtn = document.getElementById('reset-colors')!;
const allowlistContainer = document.getElementById('allowlist')!;
const allowlistInput = document.getElementById('allowlist-input') as HTMLInputElement;
const allowlistAddBtn = document.getElementById('allowlist-add')!;
const denylistContainer = document.getElementById('denylist')!;
const denylistInput = document.getElementById('denylist-input') as HTMLInputElement;
const denylistAddBtn = document.getElementById('denylist-add')!;
const toast = document.getElementById('toast')!;

// Color input elements by category
const colorInputs: Record<ClauseCategory, HTMLInputElement> = {
  'arbitration': document.getElementById('color-arbitration') as HTMLInputElement,
  'auto-renew': document.getElementById('color-auto-renew') as HTMLInputElement,
  'data-sharing': document.getElementById('color-data-sharing') as HTMLInputElement,
  'data-retention': document.getElementById('color-data-retention') as HTMLInputElement,
  'unilateral-changes': document.getElementById('color-unilateral-changes') as HTMLInputElement,
  'liability': document.getElementById('color-liability') as HTMLInputElement,
  'governing-law': document.getElementById('color-governing-law') as HTMLInputElement,
};

// Current settings
let currentSettings: UserSettings;

/**
 * Show toast notification
 */
function showToast(message: string = 'Settings saved'): void {
  const toastMessage = toast.querySelector('.toast-message');
  if (toastMessage) {
    toastMessage.textContent = message;
  }

  toast.classList.add('visible');

  setTimeout(() => {
    toast.classList.remove('visible');
  }, 2000);
}

/**
 * Save current settings
 */
async function save(): Promise<void> {
  await saveSettings(currentSettings);
  showToast();
}

/**
 * Render domain list
 */
function renderDomainList(
  container: HTMLElement,
  domains: string[],
  onRemove: (domain: string) => void
): void {
  if (domains.length === 0) {
    container.innerHTML = '<span style="color: #868e96; font-size: 13px;">No domains added</span>';
    return;
  }

  container.innerHTML = domains
    .map(
      (domain) => `
      <span class="domain-tag" data-domain="${domain}">
        ${domain}
        <button class="domain-remove" data-domain="${domain}" title="Remove">×</button>
      </span>
    `
    )
    .join('');

  // Add event listeners
  container.querySelectorAll('.domain-remove').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const domain = (e.currentTarget as HTMLElement).dataset.domain;
      if (domain) {
        onRemove(domain);
      }
    });
  });
}

/**
 * Validate domain input
 */
function isValidDomain(domain: string): boolean {
  // Allow wildcards like *.example.com
  const pattern = /^(\*\.)?([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  return pattern.test(domain) || /^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/.test(domain);
}

/**
 * Add domain to allowlist
 */
function addToAllowlist(): void {
  const domain = allowlistInput.value.trim().toLowerCase();

  if (!domain) return;

  if (!isValidDomain(domain)) {
    alert('Please enter a valid domain (e.g., example.com or *.example.com)');
    return;
  }

  if (currentSettings.allowlist.includes(domain)) {
    alert('This domain is already in the allowlist');
    return;
  }

  currentSettings.allowlist.push(domain);
  allowlistInput.value = '';

  renderDomainList(allowlistContainer, currentSettings.allowlist, removeFromAllowlist);
  save();
}

/**
 * Remove domain from allowlist
 */
function removeFromAllowlist(domain: string): void {
  currentSettings.allowlist = currentSettings.allowlist.filter((d) => d !== domain);
  renderDomainList(allowlistContainer, currentSettings.allowlist, removeFromAllowlist);
  save();
}

/**
 * Add domain to denylist
 */
function addToDenylist(): void {
  const domain = denylistInput.value.trim().toLowerCase();

  if (!domain) return;

  if (!isValidDomain(domain)) {
    alert('Please enter a valid domain (e.g., example.com or *.example.com)');
    return;
  }

  if (currentSettings.denylist.includes(domain)) {
    alert('This domain is already in the denylist');
    return;
  }

  currentSettings.denylist.push(domain);
  denylistInput.value = '';

  renderDomainList(denylistContainer, currentSettings.denylist, removeFromDenylist);
  save();
}

/**
 * Remove domain from denylist
 */
function removeFromDenylist(domain: string): void {
  currentSettings.denylist = currentSettings.denylist.filter((d) => d !== domain);
  renderDomainList(denylistContainer, currentSettings.denylist, removeFromDenylist);
  save();
}

/**
 * Reset colors to defaults
 */
function resetColors(): void {
  currentSettings.highlightColors = { ...DEFAULT_SETTINGS.highlightColors };

  // Update inputs
  Object.entries(colorInputs).forEach(([category, input]) => {
    input.value = currentSettings.highlightColors[category as ClauseCategory];
  });

  save();
}

/**
 * Initialize options page
 */
async function initialize(): Promise<void> {
  // Load settings
  currentSettings = await loadSettings();

  // Set toggle values
  enabledToggle.checked = currentSettings.enabled;
  onlyLegalToggle.checked = currentSettings.onlyLegalPages;
  sensitivitySelect.value = currentSettings.sensitivity;

  // Set color values
  Object.entries(colorInputs).forEach(([category, input]) => {
    input.value = currentSettings.highlightColors[category as ClauseCategory];
  });

  // Render domain lists
  renderDomainList(allowlistContainer, currentSettings.allowlist, removeFromAllowlist);
  renderDomainList(denylistContainer, currentSettings.denylist, removeFromDenylist);

  // Add event listeners
  enabledToggle.addEventListener('change', () => {
    currentSettings.enabled = enabledToggle.checked;
    save();
  });

  onlyLegalToggle.addEventListener('change', () => {
    currentSettings.onlyLegalPages = onlyLegalToggle.checked;
    save();
  });

  sensitivitySelect.addEventListener('change', () => {
    currentSettings.sensitivity = sensitivitySelect.value as Sensitivity;
    save();
  });

  // Color input listeners
  Object.entries(colorInputs).forEach(([category, input]) => {
    input.addEventListener('change', () => {
      currentSettings.highlightColors[category as ClauseCategory] = input.value;
      save();
    });
  });

  // Button listeners
  resetColorsBtn.addEventListener('click', resetColors);
  allowlistAddBtn.addEventListener('click', addToAllowlist);
  denylistAddBtn.addEventListener('click', addToDenylist);

  // Enter key for domain inputs
  allowlistInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addToAllowlist();
    }
  });

  denylistInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addToDenylist();
    }
  });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initialize);
initialize();
