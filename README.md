# AutoOpen Steam

[![CI](https://github.com/SensitiveWebUser/AutoOpen-Steam/actions/workflows/ci.yml/badge.svg)](https://github.com/SensitiveWebUser/AutoOpen-Steam/actions/workflows/ci.yml)
[![Release](https://github.com/SensitiveWebUser/AutoOpen-Steam/actions/workflows/release.yml/badge.svg)](https://github.com/SensitiveWebUser/AutoOpen-Steam/actions/workflows/release.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/github/v/release/SensitiveWebUser/AutoOpen-Steam)](https://github.com/SensitiveWebUser/AutoOpen-Steam/releases)

A lightweight Chromium extension that adds an "Open in Desktop App" button to Steam Workshop pages, allowing you to quickly open workshop items in the Steam desktop application.

## Features

- 🚀 Automatically adds "Open in Desktop App" button on Steam Workshop pages
- ⚙️ Global preference settings (Always open, Ask, or Disabled)
- 🎨 Styled to match Steam's native blue button from store pages
- 📦 Built with TypeScript, bundled to minified JavaScript
- ✨ Clean code with oxlint and prettier
- ♿ ARIA labels and accessibility support
- 🔄 Automated versioning and GitHub Actions CI/CD
- 📦 Production-ready packaging system

## Installation

### From Release (Recommended)

1. Download the latest `autoopen-steam-v*.zip` from [Releases](../../releases)
2. Extract the ZIP file
3. Open `chrome://extensions/` (or `edge://extensions/`)
4. Enable "Developer mode"
5. Click "Load unpacked"
6. Select the extracted folder

### Development

1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/SensitiveWebUser/AutoOpen-Steam.git
   cd AutoOpen-Steam
   pnpm install
   ```

2. **Build the extension:**
   ```bash
   pnpm run build
   ```

3. **Load in Chrome/Edge:**
   - Open `chrome://extensions/` (or `edge://extensions/`)
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

## Usage

1. Visit any Steam Workshop page (e.g., `steamcommunity.com/sharedfiles/filedetails/?id=...`)
2. Look for the blue "Open in Desktop App" button
3. Click to open the workshop item in Steam desktop app
4. Configure default behavior via the extension icon in your browser toolbar

## Configuration Options

- **Show Button (Ask Each Time)** - Shows button on every workshop page (default)
- **Always Open in Desktop App** - Automatically opens workshop items in Steam
- **Disabled** - Extension does nothing (completely disabled)

## Development

### Prerequisites

- Node.js 20+
- pnpm 9+

### Scripts

- `pnpm run build` - Build development version with sourcemaps
- `pnpm run build:prod` - Build production version (minified)
- `pnpm run watch` - Watch mode for development
- `pnpm run lint` - Run oxlint
- `pnpm run format` - Format code with prettier
- `pnpm run format:check` - Check code formatting
- `pnpm run clean` - Clean dist directory
- `pnpm run package` - Package extension as ZIP for distribution

### Version Management

**Automatic versioning** via pre-commit hook:
- Every commit with code changes automatically bumps the minor version
- Version files (package.json, manifest.json) are synced and added to the commit

**Manual version control**:
```bash
pnpm run version:patch  # 1.0.0 -> 1.0.1 (bug fixes)
pnpm run version:minor  # 1.0.0 -> 1.1.0 (new features)
pnpm run version:major  # 1.0.0 -> 2.0.0 (breaking changes)
```

### Release Process

The project uses automated versioning and releases:

1. **Automatic**: Every commit to `main` triggers a version bump and creates a release
2. **Manual**: Use version scripts for specific bumps:
   ```bash
   pnpm run version:patch  # Bug fixes
   pnpm run version:minor  # New features
   pnpm run version:major  # Breaking changes
   ```
3. Push to `main` or create a tag to trigger GitHub Actions release workflow

### Project Structure

```
src/
├── content.ts          # Content script injected into Steam pages
├── content.css         # Styles for injected button (Steam blue theme)
├── popup.ts            # Extension popup settings UI
├── popup.html          # Popup HTML (with ARIA labels)
├── popup.css           # Popup styles (with accessibility support)
├── manifest.json       # Extension manifest (v3)
└── icons/              # Extension icons
    ├── icon16.svg
    ├── icon48.svg
    └── icon128.svg

scripts/
├── package.js          # Packaging script for distribution
└── version-bump.js     # Automatic version syncing

.github/workflows/
├── ci.yml              # Continuous integration
└── release.yml         # Automated releases
```

## Technology Stack

- **TypeScript** - Type-safe JavaScript
- **esbuild** - Fast bundler and minifier
- **oxlint** - Fast linter
- **prettier** - Code formatter
- **pnpm** - Fast, disk space efficient package manager
- **GitHub Actions** - CI/CD automation
- **Chrome Extension Manifest V3**

## Steam Protocol

The extension uses the `steam://url/CommunityFilePage/[ID]` protocol to open workshop items in the Steam desktop application.

## Accessibility

- Full ARIA labels for screen readers
- Keyboard navigation support
- High contrast mode support
- Reduced motion support for animations

## Future Plans

- Support for additional Steam pages (store, community, inventory, etc.)
- i18n (internationalization) support
- Optional per-item preferences
- Keyboard shortcuts
- Steam protocol fallback messaging

## License

[MIT](LICENSE) © 2025 AutoOpen Steam Contributors

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Support

- 🐛 [Report a Bug](https://github.com/SensitiveWebUser/AutoOpen-Steam/issues/new?labels=bug)
- 💡 [Request a Feature](https://github.com/SensitiveWebUser/AutoOpen-Steam/issues/new?labels=enhancement)
- 📖 [Documentation](https://github.com/SensitiveWebUser/AutoOpen-Steam/wiki)

## Acknowledgments

- Steam team for the amazing platform
- All contributors who help improve this extension

