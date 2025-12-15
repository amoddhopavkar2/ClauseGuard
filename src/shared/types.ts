/**
 * ClauseGuard Type Definitions
 * All types used across the extension
 */

// Severity levels for clause categories
export type Severity = 'critical' | 'high' | 'medium' | 'low';

// Clause categories
export type ClauseCategory =
  | 'arbitration'
  | 'auto-renew'
  | 'data-sharing'
  | 'data-retention'
  | 'unilateral-changes'
  | 'liability'
  | 'governing-law';

// Risk label levels
export type RiskLevel = 'low' | 'medium' | 'high';

// Sensitivity settings
export type Sensitivity = 'strict' | 'normal' | 'lenient';

// A single pattern definition
export interface ClausePattern {
  id: string;
  category: ClauseCategory;
  pattern: RegExp;
  severity: Severity;
  weight: number;
  description: string;
  // If true, presence of this pattern alone can trigger high risk
  critical?: boolean;
}

// A matched clause found in the document
export interface ClauseMatch {
  id: string;
  patternId: string;
  category: ClauseCategory;
  severity: Severity;
  weight: number;
  excerpt: string; // ~240-400 chars around the match
  matchedText: string; // The actual matched text
  startOffset: number; // Position in the text node
  endOffset: number;
  textNodeIndex: number; // Index of the text node in our processed list
  highlighted: boolean; // Whether it's been highlighted in DOM
  description: string;
}

// Results from scanning a page
export interface ScanResult {
  pageUrl: string;
  pageTitle: string;
  timestamp: number;
  isLegalPage: boolean;
  riskLevel: RiskLevel;
  totalScore: number;
  matches: ClauseMatch[];
  categoryCounts: Record<ClauseCategory, number>;
  scanDurationMs: number;
}

// User settings stored in chrome.storage
export interface UserSettings {
  // Global enable/disable
  enabled: boolean;
  // Only scan pages that appear to be legal/TOS pages
  onlyLegalPages: boolean;
  // Sensitivity level affects thresholds
  sensitivity: Sensitivity;
  // Custom highlight colors per category
  highlightColors: Record<ClauseCategory, string>;
  // Domains to always scan
  allowlist: string[];
  // Domains to never scan
  denylist: string[];
  // Per-domain overrides (domain -> enabled)
  domainOverrides: Record<string, boolean>;
  // Skip scanning inside these elements (tag names, lowercase)
  skipElements: string[];
}

// Default settings
export const DEFAULT_SETTINGS: UserSettings = {
  enabled: true,
  onlyLegalPages: true,
  sensitivity: 'normal',
  highlightColors: {
    'arbitration': '#ff6b6b',
    'auto-renew': '#ffa94d',
    'data-sharing': '#ff8787',
    'data-retention': '#ffd43b',
    'unilateral-changes': '#69db7c',
    'liability': '#74c0fc',
    'governing-law': '#b197fc',
  },
  allowlist: [],
  denylist: [],
  domainOverrides: {},
  skipElements: ['script', 'style', 'noscript', 'textarea', 'input', 'code', 'pre', 'svg'],
};

// Messages between components
export type MessageType =
  | 'SCAN_NOW'
  | 'GET_STATUS'
  | 'SET_DOMAIN_ENABLED'
  | 'SCAN_COMPLETE'
  | 'SCAN_PROGRESS'
  | 'GET_SETTINGS'
  | 'UPDATE_SETTINGS';

export interface Message {
  type: MessageType;
  payload?: unknown;
}

export interface ScanNowMessage extends Message {
  type: 'SCAN_NOW';
}

export interface GetStatusMessage extends Message {
  type: 'GET_STATUS';
}

export interface SetDomainEnabledMessage extends Message {
  type: 'SET_DOMAIN_ENABLED';
  payload: {
    domain: string;
    enabled: boolean;
  };
}

export interface ScanCompleteMessage extends Message {
  type: 'SCAN_COMPLETE';
  payload: ScanResult;
}

export interface ScanProgressMessage extends Message {
  type: 'SCAN_PROGRESS';
  payload: {
    processed: number;
    total: number;
    percentage: number;
  };
}

export interface GetSettingsMessage extends Message {
  type: 'GET_SETTINGS';
}

export interface UpdateSettingsMessage extends Message {
  type: 'UPDATE_SETTINGS';
  payload: Partial<UserSettings>;
}

// Tab state stored in service worker memory
export interface TabState {
  tabId: number;
  url: string;
  scanResult: ScanResult | null;
  isScanning: boolean;
}

// Risk thresholds for different sensitivity levels
export interface RiskThresholds {
  high: number;
  medium: number;
}

export const SENSITIVITY_THRESHOLDS: Record<Sensitivity, RiskThresholds> = {
  strict: { high: 15, medium: 8 },
  normal: { high: 25, medium: 12 },
  lenient: { high: 40, medium: 20 },
};

// Category metadata for display
export const CATEGORY_INFO: Record<ClauseCategory, { label: string; icon: string }> = {
  'arbitration': { label: 'Arbitration / Waiver', icon: '⚖️' },
  'auto-renew': { label: 'Auto-Renewal / Billing', icon: '💳' },
  'data-sharing': { label: 'Data Sharing', icon: '📤' },
  'data-retention': { label: 'Data Retention', icon: '💾' },
  'unilateral-changes': { label: 'Unilateral Changes', icon: '📝' },
  'liability': { label: 'Liability Limits', icon: '🛡️' },
  'governing-law': { label: 'Governing Law', icon: '🏛️' },
};

// Severity display info
export const SEVERITY_INFO: Record<Severity, { label: string; color: string }> = {
  critical: { label: 'Critical', color: '#c92a2a' },
  high: { label: 'High', color: '#e03131' },
  medium: { label: 'Medium', color: '#f59f00' },
  low: { label: 'Low', color: '#40c057' },
};
