/**
 * ClauseGuard Shared Utilities
 * Common functions used across extension components
 */

import { UserSettings, DEFAULT_SETTINGS, RiskLevel, Sensitivity, SENSITIVITY_THRESHOLDS, ClauseMatch } from './types';
import { LEGAL_URL_KEYWORDS, LEGAL_TITLE_KEYWORDS } from './patterns';

/**
 * Load settings from chrome.storage.sync with fallback to local
 */
export async function loadSettings(): Promise<UserSettings> {
  try {
    // Try sync storage first
    const syncResult = await chrome.storage.sync.get('settings');
    if (syncResult.settings) {
      return { ...DEFAULT_SETTINGS, ...syncResult.settings };
    }

    // Fallback to local storage
    const localResult = await chrome.storage.local.get('settings');
    if (localResult.settings) {
      return { ...DEFAULT_SETTINGS, ...localResult.settings };
    }

    // Return defaults if nothing found
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error('ClauseGuard: Error loading settings:', error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Save settings to chrome.storage.sync with fallback to local
 */
export async function saveSettings(settings: Partial<UserSettings>): Promise<void> {
  const current = await loadSettings();
  const updated = { ...current, ...settings };

  try {
    await chrome.storage.sync.set({ settings: updated });
  } catch (error) {
    // Fallback to local if sync fails (e.g., quota exceeded)
    console.warn('ClauseGuard: Sync storage failed, using local:', error);
    await chrome.storage.local.set({ settings: updated });
  }
}

/**
 * Check if a URL contains legal page keywords
 */
function urlContainsLegalKeywords(url: string): boolean {
  const lowerUrl = url.toLowerCase();
  return LEGAL_URL_KEYWORDS.some(keyword => lowerUrl.includes(keyword));
}

/**
 * Check if title or H1 contains legal keywords
 */
function titleContainsLegalKeywords(title: string, h1Text?: string): boolean {
  const lowerTitle = title.toLowerCase();
  const lowerH1 = h1Text?.toLowerCase() || '';

  return LEGAL_TITLE_KEYWORDS.some(
    keyword => lowerTitle.includes(keyword) || lowerH1.includes(keyword)
  );
}

/**
 * Heuristic to determine if a page is likely a legal/TOS page
 */
export function isLikelyLegalPage(url: string, title: string, h1Text?: string): boolean {
  return urlContainsLegalKeywords(url) || titleContainsLegalKeywords(title, h1Text);
}

/**
 * Get the domain from a URL
 */
export function getDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return '';
  }
}

/**
 * Check if a domain matches a pattern (supports wildcards)
 * e.g., "*.example.com" matches "sub.example.com"
 */
export function domainMatches(domain: string, pattern: string): boolean {
  if (pattern.startsWith('*.')) {
    const baseDomain = pattern.slice(2);
    return domain === baseDomain || domain.endsWith('.' + baseDomain);
  }
  return domain === pattern;
}

/**
 * Check if a domain is in the allowlist
 */
export function isAllowlisted(domain: string, allowlist: string[]): boolean {
  return allowlist.some(pattern => domainMatches(domain, pattern));
}

/**
 * Check if a domain is in the denylist
 */
export function isDenylisted(domain: string, denylist: string[]): boolean {
  return denylist.some(pattern => domainMatches(domain, pattern));
}

/**
 * Calculate risk level from score and matches
 */
export function calculateRiskLevel(
  score: number,
  matches: ClauseMatch[],
  sensitivity: Sensitivity
): RiskLevel {
  const thresholds = SENSITIVITY_THRESHOLDS[sensitivity];

  // Check for critical patterns
  const hasCritical = matches.some(m => m.severity === 'critical');

  if (score >= thresholds.high || hasCritical) {
    return 'high';
  }
  if (score >= thresholds.medium) {
    return 'medium';
  }
  return 'low';
}

/**
 * Extract an excerpt around a match (240-400 chars)
 */
export function extractExcerpt(
  text: string,
  matchStart: number,
  matchEnd: number,
  targetLength: number = 320
): string {
  const matchLength = matchEnd - matchStart;
  const contextLength = Math.max(0, targetLength - matchLength);
  const contextBefore = Math.floor(contextLength / 2);
  const contextAfter = contextLength - contextBefore;

  let start = Math.max(0, matchStart - contextBefore);
  let end = Math.min(text.length, matchEnd + contextAfter);

  // Try to start at a word boundary
  if (start > 0) {
    const spaceIndex = text.lastIndexOf(' ', start + 20);
    if (spaceIndex > start - 30 && spaceIndex > 0) {
      start = spaceIndex + 1;
    }
  }

  // Try to end at a word boundary
  if (end < text.length) {
    const spaceIndex = text.indexOf(' ', end - 20);
    if (spaceIndex !== -1 && spaceIndex < end + 30) {
      end = spaceIndex;
    }
  }

  let excerpt = text.slice(start, end);

  // Add ellipsis if truncated
  if (start > 0) {
    excerpt = '...' + excerpt;
  }
  if (end < text.length) {
    excerpt = excerpt + '...';
  }

  return excerpt;
}

/**
 * Generate a unique ID for matches
 */
export function generateMatchId(): string {
  return 'cg-' + Math.random().toString(36).slice(2, 11);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

/**
 * Escape HTML for safe rendering
 */
export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}
