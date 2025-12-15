/**
 * ClauseGuard Background Service Worker
 * Handles messaging between popup/options and content scripts
 * Stores tab state in memory
 */

import type {
  TabState,
  ScanResult,
  Message,
  ScanCompleteMessage,
  SetDomainEnabledMessage,
  UserSettings
} from '../shared/types';
import { loadSettings, saveSettings } from '../shared/utils';

// In-memory storage for tab states
const tabStates = new Map<number, TabState>();

/**
 * Get or create tab state
 */
function getTabState(tabId: number): TabState {
  if (!tabStates.has(tabId)) {
    tabStates.set(tabId, {
      tabId,
      url: '',
      scanResult: null,
      isScanning: false,
    });
  }
  return tabStates.get(tabId)!;
}

/**
 * Update tab state with scan result
 */
function updateTabState(tabId: number, result: ScanResult): void {
  const state = getTabState(tabId);
  state.scanResult = result;
  state.isScanning = false;
  state.url = result.pageUrl;
}

/**
 * Clean up tab state when tab is closed
 */
chrome.tabs.onRemoved.addListener((tabId) => {
  tabStates.delete(tabId);
});

/**
 * Handle URL changes in tabs
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url) {
    const state = getTabState(tabId);
    // Clear previous results if URL changed
    if (state.url !== changeInfo.url) {
      state.scanResult = null;
      state.isScanning = false;
      state.url = changeInfo.url;
    }
  }
});

/**
 * Message handler
 */
chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
  // Handle async responses
  const handleAsync = async () => {
    try {
      switch (message.type) {
        case 'GET_STATUS': {
          const tabId = sender.tab?.id;
          if (tabId !== undefined) {
            const state = getTabState(tabId);
            return { success: true, data: state };
          }
          return { success: false, error: 'No tab ID' };
        }

        case 'SCAN_NOW': {
          // Forward to content script
          const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
          if (tabs[0]?.id) {
            const tabId = tabs[0].id;
            const state = getTabState(tabId);
            state.isScanning = true;

            try {
              const response = await chrome.tabs.sendMessage(tabId, { type: 'SCAN_NOW' });
              return response;
            } catch (error) {
              state.isScanning = false;
              return { success: false, error: 'Content script not ready' };
            }
          }
          return { success: false, error: 'No active tab' };
        }

        case 'SCAN_COMPLETE': {
          const { payload } = message as ScanCompleteMessage;
          const tabId = sender.tab?.id;
          if (tabId !== undefined && payload) {
            updateTabState(tabId, payload);
          }
          return { success: true };
        }

        case 'SET_DOMAIN_ENABLED': {
          const { payload } = message as SetDomainEnabledMessage;
          if (payload) {
            const settings = await loadSettings();
            settings.domainOverrides[payload.domain] = payload.enabled;
            await saveSettings(settings);
            return { success: true };
          }
          return { success: false, error: 'Invalid payload' };
        }

        case 'GET_SETTINGS': {
          const settings = await loadSettings();
          return { success: true, data: settings };
        }

        case 'UPDATE_SETTINGS': {
          const payload = (message as { payload: Partial<UserSettings> }).payload;
          if (payload) {
            await saveSettings(payload);
            return { success: true };
          }
          return { success: false, error: 'Invalid payload' };
        }

        default:
          return { success: false, error: 'Unknown message type' };
      }
    } catch (error) {
      console.error('ClauseGuard: Error handling message:', error);
      return { success: false, error: String(error) };
    }
  };

  // Return true to indicate we'll respond asynchronously
  handleAsync().then(sendResponse);
  return true;
});

/**
 * Handle extension installation/update
 */
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    // Initialize with default settings
    const settings = await loadSettings();
    await saveSettings(settings);
    console.log('ClauseGuard: Extension installed with default settings');
  } else if (details.reason === 'update') {
    // Merge any new default settings
    const settings = await loadSettings();
    await saveSettings(settings);
    console.log('ClauseGuard: Extension updated');
  }
});

// Log that service worker is running
console.log('ClauseGuard: Service worker started');
