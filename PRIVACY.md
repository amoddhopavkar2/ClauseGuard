# Privacy Policy

**Effective Date:** December 2024

## Overview

ClauseGuard is designed with privacy as a core principle. This extension operates entirely locally on your device and does not collect, transmit, or store any personal data on external servers.

## Data Collection

**ClauseGuard does NOT collect:**
- Personal information
- Browsing history
- Page content
- Search queries
- Any form of analytics or telemetry
- Crash reports
- Usage statistics

## Data Processing

All data processing occurs **locally** within your browser:
- Page content is analyzed in real-time on your device
- Pattern matching and risk scoring happen entirely client-side
- No data ever leaves your browser

## Data Storage

ClauseGuard stores only your preferences locally:
- Extension enabled/disabled state
- Theme preference (system/light/dark)
- Sensitivity level setting
- Custom highlight colors
- Domain allowlist/denylist

This data is stored using Chrome's built-in `chrome.storage.sync` API (synced across your Chrome instances if you're signed in) or `chrome.storage.local` (device-only) as a fallback. No external servers are involved.

## Network Requests

**ClauseGuard makes ZERO network requests.**

The extension:
- Does not connect to any external servers
- Does not load remote resources
- Does not use analytics services
- Does not include any third-party SDKs or libraries that phone home

You can verify this by:
1. Opening Chrome DevTools (F12)
2. Going to the Network tab
3. Navigating to any page with ClauseGuard enabled
4. Observing that no requests are made by the extension

## Permissions Explained

ClauseGuard requests minimal permissions:

| Permission | Purpose |
|------------|---------|
| `storage` | Save your settings (theme, sensitivity, domain lists) locally |
| `activeTab` | Allow manual scanning of the current page when you click "Scan This Page" |

### Why `<all_urls>` Content Script Matching?

The content script matches `<all_urls>` to enable automatic detection of legal pages across any website. However:
- Execution is **gated** by your settings (enabled toggle, legal page detection, domain lists)
- By default, only pages detected as legal documents (Terms of Service, Privacy Policies, etc.) are scanned
- You can restrict scanning further using the denylist
- No data is ever sent anywhere regardless of which pages are matched

## Third-Party Services

ClauseGuard uses **no third-party services**:
- No Google Analytics
- No Firebase
- No Sentry
- No external APIs
- No CDN resources

## Children's Privacy

ClauseGuard does not knowingly collect any information from anyone, including children under the age of 13.

## Changes to This Policy

Any changes to this privacy policy will be reflected in this document and the extension's changelog. Since ClauseGuard collects no data, significant privacy policy changes are unlikely.

## Contact

For questions about this privacy policy or the extension, please:
- Open an issue on [GitHub](https://github.com/amoddhopavkar2/ClauseGuard/issues)

## Summary

**ClauseGuard is a privacy-respecting extension that:**
- Processes all data locally
- Makes no network requests
- Collects no personal information
- Uses no analytics or tracking
- Stores only your preferences using Chrome's built-in storage
