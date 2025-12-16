# Changelog

All notable changes to ClauseGuard will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-16

### Added

- **Dark Mode Support**
  - New Appearance settings section with theme selector
  - Three theme options: System (default), Light, Dark
  - System theme follows OS/browser preference automatically
  - Live theme updates without reload when system preference changes
  - Theme-aware panel and highlight colors
  - Theme selector in popup for quick access

- **Clause Detection**
  - 7 risk categories: Arbitration, Auto-Renewal, Data Sharing, Data Retention, Unilateral Changes, Liability, Governing Law
  - 40+ detection patterns with severity weighting
  - Critical pattern detection for immediate high-risk flags
  - Pattern match capping to prevent score inflation

- **User Interface**
  - Floating results panel with Shadow DOM isolation
  - Inline text highlighting with category-specific colors
  - Click-to-scroll from panel excerpts to highlights
  - Collapsible panel with rescan functionality
  - Risk level badges (Low/Medium/High)

- **Settings**
  - Global enable/disable toggle
  - Legal pages only mode (auto-detects Terms/Privacy pages)
  - Sensitivity levels (Strict/Normal/Lenient)
  - Customizable highlight colors per category
  - Domain allowlist and denylist with wildcard support

- **Privacy**
  - 100% offline operation
  - Zero network requests
  - No analytics or tracking
  - Local storage only via Chrome's storage API

- **Developer Experience**
  - TypeScript with strict mode
  - ESLint and Prettier configuration
  - esbuild for fast builds
  - Watch mode for development

### Technical Details

- Manifest V3 compliant
- Minimal permissions (storage, activeTab)
- Content script with idle execution
- SPA navigation detection
- Non-blocking batch processing with requestIdleCallback

---

## [Unreleased]

### Planned
- Additional clause patterns
- Export scan report functionality
- Localization support
- Firefox compatibility
