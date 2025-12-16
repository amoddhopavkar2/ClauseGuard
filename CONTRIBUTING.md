# Contributing to ClauseGuard

Thank you for your interest in contributing to ClauseGuard! This document provides guidelines for contributing to the project.

## Code of Conduct

Please be respectful and constructive in all interactions. We welcome contributors of all experience levels.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Chrome browser (for testing)
- Git

### Development Setup

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
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

### Development Workflow

For development with auto-rebuild:
```bash
npm run watch
```

After making changes, reload the extension in Chrome to see updates.

## Project Structure

```
src/
├── background/          # Service worker
│   └── serviceWorker.ts
├── content/             # Content scripts
│   ├── contentScript.ts # Main entry point
│   ├── highlighter.ts   # DOM highlighting
│   ├── panel.ts         # Results panel UI
│   └── styles.css       # Highlight styles
├── shared/              # Shared code
│   ├── types.ts         # TypeScript types
│   ├── patterns.ts      # Detection patterns
│   └── utils.ts         # Utilities
├── popup/               # Extension popup
└── options/             # Settings page
```

## Making Changes

### Branching

- Create a feature branch from `main`
- Use descriptive branch names: `feature/add-pattern`, `fix/panel-theme`

### Code Style

- Follow the existing code style
- Run linting before committing:
  ```bash
  npm run lint
  ```
- Format code with Prettier:
  ```bash
  npm run format
  ```

### TypeScript

- Use strict typing where possible
- Add JSDoc comments for public functions
- Define types in `src/shared/types.ts`

### Adding New Patterns

To add new clause detection patterns:

1. Edit `src/shared/patterns.ts`
2. Add a new entry to the `CLAUSE_PATTERNS` array:
   ```typescript
   {
     id: 'unique-id',
     category: 'category-name',
     pattern: ci('regex pattern'),
     severity: 'critical' | 'high' | 'medium' | 'low',
     weight: 1-10,
     description: 'User-facing description',
     critical: true | false, // optional
   }
   ```
3. If adding a new category, update the `ClauseCategory` type in `types.ts`

### Testing

Before submitting a PR, test on:
- A long Terms of Service page (e.g., Google, Amazon)
- A Privacy Policy page
- A non-legal page (should not auto-scan by default)
- Single-page applications (test navigation detection)

Verify:
- No console errors
- No network requests (check Network tab)
- Dark mode works correctly
- Settings are saved and loaded properly

## Submitting Changes

### Pull Request Process

1. **Update documentation** if needed (README, CHANGELOG)
2. **Run checks:**
   ```bash
   npm run lint
   npm run build
   ```
3. **Create a PR** with:
   - Clear title describing the change
   - Description of what and why
   - Screenshots if UI changes
   - Link to related issues

### Commit Messages

Use clear, descriptive commit messages:
- `feat: add new arbitration pattern for JAMS`
- `fix: panel not updating on theme change`
- `docs: update installation instructions`
- `refactor: simplify highlight logic`

## Reporting Issues

When reporting bugs, please include:
- Chrome version
- Extension version
- Steps to reproduce
- Expected vs actual behavior
- Console errors (if any)
- URL of the page (if applicable)

## Feature Requests

Feature requests are welcome! Please:
- Check existing issues first
- Describe the use case
- Explain why it would benefit users

## Questions?

Open an issue with the "question" label or start a discussion.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
