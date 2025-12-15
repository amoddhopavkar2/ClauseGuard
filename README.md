# ClauseGuard

A Chrome Extension (Manifest V3) that detects and highlights risky clauses in Terms of Service and Privacy Policy pages. Works fully offline with no data collection.

## Features

- **Automatic Detection**: Identifies likely legal pages (Terms, Privacy Policy, etc.) based on URL and page content
- **Clause Scanning**: Detects potentially concerning clauses across 7 categories:
  - Arbitration / Waiver (high risk)
  - Auto-Renewal / Billing (high risk)
  - Data Sharing / Selling (high risk)
  - Data Retention (medium-high risk)
  - Unilateral Changes (medium risk)
  - Liability Limitation (medium risk)
  - Governing Law / Venue (low-medium risk)
- **Visual Highlighting**: Matched clauses are highlighted inline with category-specific colors
- **Risk Summary Panel**: Floating side panel showing:
  - Overall risk level (Low / Medium / High)
  - Issue counts by category
  - Clickable excerpts that scroll to highlights
- **Customizable**: Configure highlight colors, sensitivity levels, and domain allow/deny lists
- **SPA Support**: Detects navigation changes and rescans automatically

## Privacy Guarantees

ClauseGuard is designed with privacy as a core principle:

- **100% Offline**: All scanning and analysis happens locally in your browser
- **No Network Requests**: The extension makes zero network calls
- **No Data Collection**: No analytics, tracking, or telemetry
- **No External Services**: No third-party APIs or services
- **Local Storage Only**: Settings sync via Chrome's built-in sync (if enabled) or local storage

## Scoring Algorithm

### Pattern Weights

Each detected pattern has an assigned weight based on its potential impact:
- **Critical patterns** (weight 9-10): Binding arbitration, class action waivers, jury trial waivers, selling personal data
- **High severity** (weight 6-8): Auto-renewal, data sharing with third parties, retention policies
- **Medium severity** (weight 4-5): Unilateral changes, liability limits, indemnification
- **Low severity** (weight 2-3): Governing law, venue specifications

### Risk Level Calculation

The risk level is determined by the total score and sensitivity setting:

| Sensitivity | High Risk Threshold | Medium Risk Threshold |
|-------------|--------------------|-----------------------|
| Strict      | ≥ 15               | ≥ 8                   |
| Normal      | ≥ 25               | ≥ 12                  |
| Lenient     | ≥ 40               | ≥ 20                  |

Additionally, any **critical pattern** (e.g., binding arbitration + class action waiver) immediately triggers a **High Risk** rating regardless of score.

### Match Capping

To prevent score inflation from repetitive text:
- Maximum 5 matches per pattern per page
- Matches are deduplicated by text node to avoid double-counting

## Installation

### From Source

1. **Clone or download** this repository

2. **Install dependencies**:
   ```bash
   cd ClauseGuard
   npm install
   ```

3. **Build the extension**:
   ```bash
   npm run build
   ```

4. **Load in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist` folder

### Development

For development with auto-rebuild:
```bash
npm run watch
```

Then reload the extension in Chrome after making changes.

## Usage

### Automatic Scanning

When you visit a page that appears to be a Terms of Service or Privacy Policy (based on URL keywords or page title), ClauseGuard will automatically:
1. Scan the page content for risky clauses
2. Highlight detected patterns with color-coded marks
3. Display a summary panel on the right side

### Manual Scanning

Click the ClauseGuard icon in your browser toolbar to:
- Toggle the extension for the current domain
- Manually trigger a scan with "Scan This Page"
- View the last scan results

### Interacting with Results

- **Click any highlight** on the page to open the panel and focus that excerpt
- **Click an excerpt** in the panel to scroll to and flash the highlight
- **Rescan** using the refresh button in the panel header
- **Close** the panel with the × button (highlights remain visible)

## Configuration

Access the Options page via the popup or `chrome://extensions`:

### General Settings

- **Enable ClauseGuard**: Global on/off toggle
- **Only scan legal pages**: When enabled, only auto-scans pages detected as legal documents
- **Sensitivity**: Adjust risk thresholds (Strict / Normal / Lenient)

### Highlight Colors

Customize the highlight color for each category to suit your preference.

### Domain Lists

- **Allowlist**: Always scan pages on these domains (even when "only legal pages" is enabled)
- **Denylist**: Never scan pages on these domains

Supports wildcard domains like `*.example.com`.

## Technical Details

### Architecture

```
src/
├── background/
│   └── serviceWorker.ts   # Message handling, tab state management
├── content/
│   ├── contentScript.ts   # Main entry, page detection, scanning
│   ├── highlighter.ts     # DOM manipulation, text wrapping
│   ├── panel.ts           # Shadow DOM panel UI
│   └── styles.css         # Highlight styles
├── shared/
│   ├── types.ts           # TypeScript types
│   ├── patterns.ts        # Clause detection patterns
│   └── utils.ts           # Shared utilities
├── popup/
│   └── ...                # Extension popup UI
├── options/
│   └── ...                # Settings page
└── manifest.json
```

### Performance

- **Non-blocking scanning**: Uses `requestIdleCallback` (with setTimeout fallback) to process text nodes in batches
- **Efficient DOM traversal**: TreeWalker API for text node selection
- **Shadow DOM isolation**: Panel styles don't affect or get affected by host page
- **Minimal reflows**: Highlights are applied in batches with position-based sorting

### Permissions

Minimal permissions required:
- `storage`: Save user settings
- `activeTab`: Scan current tab on user request

Content script runs on `<all_urls>` but gates execution based on:
1. User's enabled setting
2. Domain allow/deny lists
3. Legal page detection (if setting enabled)

## Browser Support

- Chrome 100+
- Edge 100+ (Chromium-based)
- Other Chromium-based browsers with Manifest V3 support

## License

MIT License - See LICENSE file for details.

## Disclaimer

ClauseGuard is a tool to help highlight potentially concerning clauses in legal documents. It is not a substitute for professional legal advice. The patterns and risk assessments are heuristics and may not capture all relevant issues or context. Always read legal documents carefully and consult a lawyer for important decisions.
