# ClauseGuard

A Chrome Extension that detects and highlights risky clauses in Terms of Service and Privacy Policy pages. Works fully offline with no data collection.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-green.svg)](#installation)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-orange.svg)](src/manifest.json)

## What It Does

ClauseGuard helps you understand legal documents by:
- **Highlighting risky clauses** directly in the page text
- **Showing a risk summary panel** with severity levels (Low/Medium/High)
- **Categorizing issues** across 7 key areas of concern
- **Providing excerpts** you can click to jump to the highlighted text

![Screenshot placeholder - Panel showing risk summary](docs/screenshots/panel-light.png)
![Screenshot placeholder - Highlighted text on page](docs/screenshots/highlights.png)

## Features

- **Automatic Detection**: Identifies legal pages based on URL and content
- **7 Risk Categories**:
  - Arbitration / Class Action Waivers (High Risk)
  - Auto-Renewal / Billing (High Risk)
  - Data Sharing / Selling (High Risk)
  - Data Retention (Medium-High Risk)
  - Unilateral Changes (Medium Risk)
  - Liability Limitation (Medium Risk)
  - Governing Law / Venue (Low-Medium Risk)
- **Visual Highlighting**: Color-coded highlights with customizable colors
- **Risk Scoring**: Weighted pattern matching with configurable sensitivity
- **Dark Mode**: System, Light, or Dark theme with live switching
- **SPA Support**: Detects navigation changes and rescans automatically

## How It Works

1. **Page Detection**: When you visit a page, ClauseGuard checks if it's likely a legal document (Terms, Privacy Policy, etc.) based on URL keywords and page title
2. **Pattern Matching**: The page text is scanned against 40+ regex patterns that detect concerning legal language
3. **Scoring**: Each match is weighted by severity. Critical patterns (like binding arbitration + class action waiver) can instantly trigger a High Risk rating
4. **Display**: Matched text is highlighted inline, and a summary panel appears showing all findings

All processing happens **locally in your browser**. No data is ever sent anywhere.

## Privacy

**ClauseGuard is a privacy-first extension:**

- **100% Offline**: All scanning and analysis happens locally
- **No Network Requests**: Zero external connections
- **No Data Collection**: No analytics, tracking, or telemetry
- **No External Services**: No third-party APIs
- **Local Storage Only**: Settings sync via Chrome's built-in storage

See [PRIVACY.md](PRIVACY.md) for the full privacy policy.

## Permissions Explained

| Permission | Why It's Needed |
|------------|-----------------|
| `storage` | Save your settings (theme, sensitivity, domain lists) |
| `activeTab` | Allow manual "Scan This Page" from the popup |

### Why `<all_urls>` Content Script?

The content script runs on all URLs to detect legal pages automatically. However:
- **Gated execution**: Only runs based on your settings
- **Default behavior**: Only scans pages detected as legal documents
- **User control**: Configure with allowlist/denylist
- **No data exfiltration**: Nothing ever leaves your browser

## Installation

### Chrome Web Store (Recommended)

Coming soon - [Chrome Web Store Link](#)

### From Source

1. **Clone the repository:**
   ```bash
   git clone https://github.com/amoddhopavkar2/ClauseGuard.git
   cd ClauseGuard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the extension:**
   ```bash
   npm run build
   ```

4. **Load in Chrome:**
   - Open `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist` folder

## Configuration

Access settings via the popup (gear icon) or `chrome://extensions` → ClauseGuard → Options.

### Appearance

| Setting | Options | Description |
|---------|---------|-------------|
| Theme | System (default), Light, Dark | Controls panel and UI appearance |

### General Settings

| Setting | Default | Description |
|---------|---------|-------------|
| Enable ClauseGuard | On | Global on/off toggle |
| Only scan legal pages | On | Auto-scan only Terms/Privacy pages |
| Sensitivity | Normal | Strict/Normal/Lenient risk thresholds |

### Sensitivity Thresholds

| Sensitivity | High Risk | Medium Risk |
|-------------|-----------|-------------|
| Strict | ≥ 15 | ≥ 8 |
| Normal | ≥ 25 | ≥ 12 |
| Lenient | ≥ 40 | ≥ 20 |

### Domain Lists

- **Allowlist**: Always scan pages on these domains
- **Denylist**: Never scan pages on these domains
- Supports wildcards: `*.example.com`

### Highlight Colors

Customize the highlight color for each category to suit your preference.

## Usage

### Automatic Scanning

When you visit a page detected as a legal document, ClauseGuard will:
1. Scan the page content
2. Highlight detected patterns
3. Display a summary panel

### Manual Scanning

1. Click the ClauseGuard icon in your toolbar
2. Click "Scan This Page"
3. View results in the panel

### Interacting with Results

- **Click a highlight** on the page to focus it in the panel
- **Click an excerpt** in the panel to scroll to that highlight
- **Rescan** using the ↻ button
- **Close** the panel with × (highlights remain visible)

## Limitations & Disclaimer

**ClauseGuard is NOT a substitute for legal advice.**

- Detection is based on pattern matching heuristics
- False positives and false negatives are possible
- Context and nuance may be missed
- Legal implications vary by jurisdiction
- Always read important documents carefully
- Consult a lawyer for significant legal decisions

## Development

### Setup

```bash
npm install
npm run build    # Production build
npm run watch    # Development with auto-rebuild
npm run lint     # Run ESLint
npm run format   # Format with Prettier
```

### Project Structure

```
src/
├── background/          # Service worker
│   └── serviceWorker.ts
├── content/             # Content scripts
│   ├── contentScript.ts # Main entry, scanning logic
│   ├── highlighter.ts   # DOM manipulation
│   ├── panel.ts         # Results panel (Shadow DOM)
│   └── styles.css       # Highlight styles
├── shared/              # Shared code
│   ├── types.ts         # TypeScript types
│   ├── patterns.ts      # Detection patterns
│   └── utils.ts         # Utilities
├── popup/               # Extension popup
│   └── ...
├── options/             # Settings page
│   └── ...
├── assets/              # Icons
└── manifest.json
```

### Adding Patterns

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to add new detection patterns.

## Manual Test Plan

Before release, test on:

- [ ] Long Terms page (Google, Amazon, Uber)
- [ ] Privacy Policy (Facebook, TikTok)
- [ ] Non-legal page (should not auto-scan)
- [ ] SPA navigation (single-page app route changes)
- [ ] Dark mode toggle (system, light, dark)
- [ ] Settings persistence (reload, restart)
- [ ] No console errors
- [ ] No network requests (check DevTools Network tab)

## Roadmap

- [ ] More detection patterns
- [ ] Export report functionality
- [ ] Localization (i18n)
- [ ] Firefox support
- [ ] Pattern customization

## Browser Support

- Chrome 100+
- Edge 100+ (Chromium-based)
- Other Chromium browsers with Manifest V3 support

## License

[MIT License](LICENSE) - See LICENSE file for details.

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Security

See [SECURITY.md](SECURITY.md) for reporting vulnerabilities.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.
