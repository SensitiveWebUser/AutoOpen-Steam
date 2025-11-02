# Contributing to AutoOpen Steam

First off, thank you for considering contributing to AutoOpen Steam! It's people like you that make this extension better for everyone.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include screenshots if relevant**
- **Include your browser version and OS**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any similar features in other extensions**

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Install dependencies**: `pnpm install`
3. **Make your changes** following our coding standards
4. **Test your changes**: Load the extension in your browser and test thoroughly
5. **Ensure quality checks pass**:
   ```bash
   pnpm run lint
   pnpm run format
   pnpm run build:prod
   ```
6. **Commit your changes** (the pre-commit hook will auto-format and bump version)
7. **Push to your fork** and submit a pull request

## Development Setup

### Prerequisites

- Node.js 20+
- pnpm 9+
- A Chromium-based browser (Chrome, Edge, Brave, etc.)

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/your-username/AutoOpen-Steam.git
cd AutoOpen-Steam

# Install dependencies
pnpm install

# Build for development
pnpm run build

# Watch mode for active development
pnpm run watch
```

### Loading the Extension

1. Open `chrome://extensions/` (or `edge://extensions/`)
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist` folder

### Testing

- Test on actual Steam Workshop pages
- Try different Steam games (Skyrim, CS2, Dota 2, etc.)
- Test all configuration options (Ask, Always, Disabled)
- Verify button appearance matches Steam's style
- Check keyboard navigation and accessibility

## Coding Standards

### TypeScript

- Use TypeScript strict mode (already configured)
- Define interfaces for all data structures
- Extract magic values into CONSTANTS objects
- Write small, single-purpose functions
- Use descriptive variable and function names

### Code Style

- **Linting**: Code is linted with oxlint (all rules enabled)
- **Formatting**: Code is formatted with Prettier
- **Pre-commit hooks**: Automatically run lint and format checks
- **No magic values**: Extract constants to CONSTANTS objects
- **Clean code principles**: DRY, SOLID, KISS

### Commit Messages

Write clear, concise commit messages using present tense action verbs:

**Format:**
```
Fixed [issue] / Updated [component] / Added [feature]

Optional detailed list of changes:
- Change 1
- Change 2
- Change 3
```

**Guidelines:**
- Use action verbs: Fixed, Updated, Added, Removed, Refactored, Improved, etc.
- Keep the first line short (50-72 characters)
- Add detailed bullet points only when necessary
- Be specific about what changed

**Examples:**
```
Fixed button not appearing on workshop pages

Updated popup UI with better accessibility

- Added ARIA labels
- Improved keyboard navigation
- Fixed color contrast issues

Added support for Steam collections
```

## Project Structure

```
src/
├── content.ts          # Content script (injected into Steam pages)
├── content.css         # Button styles
├── popup.ts            # Extension popup logic
├── popup.html          # Popup UI
├── popup.css           # Popup styles
├── manifest.json       # Extension manifest
└── icons/              # Extension icons

scripts/
├── package.ts          # Packaging for distribution
├── version-bump.ts     # Version synchronization
└── pre-commit.ts       # Pre-commit hook logic

.github/workflows/
├── quality.yml         # Reusable quality checks
├── ci.yml              # Continuous integration
└── release.yml         # Automated releases
```

## Architecture Patterns

### Content Script

- Wrapped in IIFE to prevent variable collisions
- Initialization guard to prevent duplicate runs
- MutationObserver for Steam's SPA navigation
- Constants for all selectors and messages

### Build System

- TypeScript files compiled with esbuild
- Custom build script (build.ts) with clear separation
- Automatic version injection from package.json
- PNG icons copied directly (no conversion)

### Version Management

- Pre-commit hook auto-bumps minor version
- Manual version scripts for patch/major bumps
- Syncs package.json and manifest.json automatically

## Quality Checks

All PRs must pass:

1. **Lint**: `pnpm run lint` (oxlint)
2. **Format**: `pnpm run format:check` (prettier)
3. **Build**: `pnpm run build:prod` (production build)

These are automatically checked in CI and by pre-commit hooks.

## Release Process

Releases are automated:

1. Commit to `main` triggers quality checks
2. If checks pass, extension is packaged as ZIP
3. GitHub release is created with ZIP attached
4. Release notes are auto-generated from commits

## Questions?

Feel free to:
- Open an issue for discussion
- Ask questions in pull request comments
- Reach out to maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
