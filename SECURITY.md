# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Model

ClauseGuard is designed with security in mind:

### No Network Access
- The extension makes **zero network requests**
- All processing happens locally in your browser
- No data is ever transmitted to external servers

### Minimal Permissions
- `storage`: Required to save user preferences
- `activeTab`: Required for manual "Scan This Page" functionality

### Content Script Isolation
- Results panel uses Shadow DOM to isolate styles
- No inline scripts in HTML pages
- No `eval()` or dynamic code execution
- No remote code loading

### Data Handling
- Page content is analyzed in-memory only
- No content is persisted beyond the current session
- Only user settings are stored (theme, sensitivity, domain lists)

## Reporting a Vulnerability

If you discover a security vulnerability in ClauseGuard, please report it responsibly:

### How to Report

1. **Do NOT** open a public GitHub issue for security vulnerabilities
2. Email the details to: [Create a private security advisory on GitHub]
3. Or use GitHub's private vulnerability reporting feature

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response Timeline

- **Acknowledgment:** Within 48 hours
- **Initial Assessment:** Within 1 week
- **Fix Timeline:** Depends on severity, typically within 2-4 weeks

### What Happens Next

1. We'll acknowledge receipt of your report
2. We'll investigate and assess the vulnerability
3. We'll develop and test a fix
4. We'll release a patched version
5. We'll publicly credit you (unless you prefer anonymity)

## Security Best Practices for Users

1. **Install from official sources only**
   - Chrome Web Store (recommended)
   - GitHub releases

2. **Review permissions**
   - ClauseGuard only requests `storage` and `activeTab`
   - Be suspicious if you see additional permission requests

3. **Keep updated**
   - Enable auto-updates in Chrome
   - Check for updates regularly if installed manually

4. **Verify the extension**
   - Check the extension ID matches the official one
   - Review the source code on GitHub if desired

## Known Security Considerations

### Content Script on All URLs

ClauseGuard's content script matches `<all_urls>` but:
- Execution is gated by user settings
- Default behavior scans only legal page types
- Users can restrict via denylist
- No data leaves the browser

### Third-Party Dependencies

ClauseGuard uses minimal dependencies:
- **Build time only:** TypeScript, esbuild (not bundled)
- **Runtime:** None (zero external dependencies)

## Acknowledgments

We thank the security research community for helping keep ClauseGuard safe.
