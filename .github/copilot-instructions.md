# AutoOpen Steam - AI Coding Agent Instructions

## Project Overview
Chromium extension (Manifest V3) that adds an "Open in Desktop App" button to Steam Workshop pages. Built with TypeScript, bundled with esbuild, uses pnpm for package management.

## Architecture & Key Files

### Content Script Architecture (`src/content.ts`)
- **IIFE Pattern**: Entire content script wrapped in IIFE to prevent variable collisions when Steam's SPA dynamically loads pages
- **Initialization Guard**: Uses `window.__autoOpenSteamInitialized` flag to prevent duplicate initialization
- **MutationObserver**: Watches for Steam's SPA navigation to re-inject button when needed
- **URL Parsing**: Extracts workshop ID from `?id=` query parameter with regex validation (`/^\d+$/`)
- **Steam Protocol**: Uses `steam://url/CommunityFilePage/{ID}` to launch Steam desktop app

### Popup Settings (`src/popup.ts`)
- **PreferenceOption Type**: `'always' | 'disabled' | 'ask'` - shared type between content and popup
- **Chrome Storage Sync**: Preferences stored in `chrome.storage.sync` for cross-device sync
- **Version Display**: Reads version from `chrome.runtime.getManifest()` for UI display

### Build System (`build.js`)
- **Custom esbuild Pipeline**: Not using a bundler framework - direct esbuild API usage
- **Version Injection**: Reads `package.json` version and writes to `manifest.json` during build
- **Static File Copying**: Manually copies HTML, CSS, PNG icons from `src/` to `dist/`
- **Build Modes**: `--prod` (minified), `--watch` (dev), default (dev with sourcemaps)

## Development Workflow

### Commands (use these exact commands)
```bash
pnpm run build          # Dev build with sourcemaps
pnpm run build:prod     # Production build (minified, no sourcemaps)
pnpm run watch          # Watch mode for development
pnpm run lint           # oxlint (fast linter, all rules enabled)
pnpm run format         # Prettier (formats TS, HTML, CSS, JSON)
pnpm run clean          # Removes dist/ directory
```

### Version Management (Critical Workflow)
**Always use these scripts** - they sync `package.json` and `src/manifest.json`:
```bash
pnpm run version:patch  # Bug fixes (1.0.0 -> 1.0.1)
pnpm run version:minor  # New features (1.0.0 -> 1.1.0)
pnpm run version:major  # Breaking changes (1.0.0 -> 2.0.0)
```
**Do not manually edit version numbers** - `scripts/version-bump.ts` keeps them in sync.

### Release Process (Exact Steps)
1. `pnpm run version:patch` (or minor/major)
2. `pnpm run build:prod`
3. `pnpm run package` (creates ZIP in `releases/`)
4. `git add . && git commit -m "chore: release v{VERSION}"`
5. `git tag v{VERSION} && git push && git push --tags`
6. GitHub Actions (`release.yml`) auto-creates release with ZIP

## Code Conventions

### TypeScript Strictness
- **tsconfig.json**: All strict flags enabled (`noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`, etc.)
- **Target**: ES2020 with DOM types
- **Module**: ESNext (esbuild handles bundling)

### Linting
- **oxlint**: All rule categories enabled (`typescript`, `correctness`, `suspicious`, `perf`)
- **No ESLint**: Project uses oxlint for speed

### Styling
- **Steam UI Matching**: Button styles in `src/content.css` mimic Steam's native blue buttons
- **CSS Injection**: Content styles injected via `content_scripts.css` in manifest

### Chrome Extension Patterns
- **Manifest V3**: Uses `chrome.storage.sync` (not localStorage), `action` (not browser_action)
- **Content Script Matches**: Only runs on `steamcommunity.com/sharedfiles/filedetails/*` and `workshop/filedetails/*`
- **Permissions**: Only requests `storage` permission (minimal)
- **run_at**: `document_idle` to ensure page is fully loaded before injection

## Testing & Validation
- **No automated tests**: Manual testing workflow via "Load unpacked" in `chrome://extensions/`
- **CI Checks**: Lint + format check + production build must pass (see `.github/workflows/ci.yml`)
- **Test on Real Pages**: Always test on actual Steam Workshop pages (e.g., Skyrim, CS2 workshop items)

## Common Tasks

### Adding New Features
1. Implement in TypeScript (maintain strict type safety)
2. Update `README.md` if user-facing
3. Run `pnpm run format` before committing
4. Ensure `pnpm run build:prod` succeeds
5. Bump version using `version:*` scripts

### Modifying Build Process
- Edit `build.js` directly (no webpack/vite config)
- Always test both dev and prod builds
- PNG icons are copied directly from `src/icons/` to `dist/icons/`

### Debugging Content Script
- Add `console.log()` statements (sourcemaps enabled in dev mode)
- Check browser console on Steam Workshop pages
- Inspect `chrome.storage.sync` in DevTools → Application → Storage

### Icon Changes
- Replace PNG files in `src/icons/` (sizes: 16, 48, 128)
- Icons use Steam's color scheme: `#1b2838` (dark blue), `#66c0f4` (Steam blue)
- Build process copies PNG files directly to `dist/icons/`

## Dependencies & Tools
- **Runtime**: Chrome 96+ (target in esbuild config)
- **Build**: esbuild 0.25+, TypeScript 5.9+
- **Scripts**: tsx 4+ for running TypeScript scripts
- **Quality**: oxlint 1.25+, prettier 3.6+
- **Package Manager**: pnpm 9+ (uses `pnpm-lock.yaml`)
- **Types**: `@types/chrome` for extension APIs

## Gotchas & Edge Cases
- **Steam SPA Navigation**: Steam Workshop uses dynamic navigation - button re-injection needed via MutationObserver
- **Single CSS Selector**: Button injection uses `.workshopItemDetailsHeader` as the target container for button placement
- **Version Sync**: `build.js` copies version from package.json → manifest.json **at build time** (not at version bump time)
