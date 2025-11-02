# AutoOpen Steam - AI Coding Agent Instructions

## Project Overview
Chromium extension (Manifest V3) that adds "Open in Desktop App" button to Steam Workshop pages. TypeScript codebase using esbuild for bundling, pnpm for package management, automated versioning via git hooks, and GitHub Actions CI/CD.

## Architecture & Key Files

### Content Script Architecture (`src/content.ts`)
- **IIFE Pattern**: Entire script wrapped in IIFE to prevent variable collisions in Steam's SPA environment
- **Initialization Guard**: `window.__autoOpenSteamInitialized` flag prevents duplicate initialization
- **MutationObserver**: Watches DOM for Steam SPA navigation and re-injects button when needed
- **URL Parsing**: Extracts workshop ID from `?id=` query parameter with regex validation (`/^\d+$/`)
- **Steam Protocol**: Uses `steam://url/CommunityFilePage/{ID}` to launch desktop app
- **CONSTANTS Pattern**: All magic values extracted to top-level CONSTANTS object

### Popup Settings (`src/popup.ts`)
- **PreferenceOption Type**: `'always' | 'disabled' | 'ask'` shared between content and popup
- **Chrome Storage Sync**: Preferences in `chrome.storage.sync` for cross-device sync
- **Version Display**: Reads from `chrome.runtime.getManifest()` for UI display
- **CONSTANTS Pattern**: Storage keys, DOM IDs, preference options all defined in CONSTANTS

### Build System (`build.ts`)
- **Custom esbuild Pipeline**: Direct esbuild API usage (no bundler framework)
- **Version Injection**: Reads `package.json` version and writes to `src/manifest.json` during build
- **Static File Copying**: Manually copies HTML, CSS, PNG icons from `src/` to `dist/`
- **TypeScript**: Build script in TypeScript, executed via tsx
- **Build Modes**: `--prod` (minified, no sourcemaps), `--watch` (dev mode), default (dev with sourcemaps)
- **Single-Purpose Functions**: Clean architecture with parseArgs(), cleanDistDirectory(), copyStaticFiles(), etc.

## Development Workflow

### Commands (use these exact commands)
```bash
pnpm run build          # Dev build with sourcemaps
pnpm run build:prod     # Production build (minified, no sourcemaps)
pnpm run watch          # Watch mode for development
pnpm run lint           # oxlint (fast linter, all rules enabled)
pnpm run format         # Prettier (formats TS, HTML, CSS only - excludes JSON)
pnpm run format:check   # Check formatting without modifying files
pnpm run clean          # Removes dist/ directory
pnpm run package        # Create distribution ZIP (releases/autoopen-steam-v{VERSION}.zip)
```

### Pre-commit Hook Workflow (Critical)
**Location**: `scripts/pre-commit.ts` (executed via husky `.husky/pre-commit`)

**Execution Order**:
1. Detects staged files via `git diff --cached --name-only`
2. Runs `pnpm run lint` - blocks commit if linting fails
3. Runs `pnpm run format:check` - blocks commit if formatting fails
4. If non-version files changed: runs `pnpm run version:patch` and adds version files to commit
5. If only version files changed: skips version bump

**Note**: Hook is cross-platform Node.js implementation, not bash script

### Version Management (Automated)
**Automatic**: Pre-commit hook bumps patch version on every commit with code changes
**Manual Override**: Use these scripts for specific version bumps:
```bash
pnpm run version:patch  # Bug fixes (1.0.0 -> 1.0.1)
pnpm run version:minor  # New features (1.0.0 -> 1.1.0)
pnpm run version:major  # Breaking changes (1.0.0 -> 2.0.0)
```
**Note**: Version scripts update both `package.json` and `src/manifest.json` via `scripts/version-bump.ts`

### Release Process (Exact Steps)
1. Make changes and commit (pre-commit hook auto-bumps version)
2. Push to `main` branch
3. GitHub Actions automatically:
   - Runs quality checks via reusable `quality.yml` (lint, format check, build)
   - Packages extension as ZIP via `scripts/package.ts`
   - Creates GitHub release with ZIP attached
4. **Manual tag release**: Create tag `v{VERSION}` and push to trigger same process

## Code Conventions

### Clean Code Pattern (Applied Throughout)
- **CONSTANTS Objects**: All magic values (strings, numbers, selectors, messages) extracted to top-level CONSTANTS
- **Example** (`src/content.ts`): `CONSTANTS.BUTTON_ID`, `CONSTANTS.STORAGE_KEY_PREFERENCE`, `CONSTANTS.STEAM_PROTOCOL_URL`
- **Single-Purpose Functions**: Each function does one thing (e.g., `getWorkshopId()`, `createButton()`, `insertButtonIntoDOM()`)
- **TypeScript Interfaces**: All data structures typed (`PackageJson`, `Manifest`, `PreferenceOption`)

### VSCode Configuration
- **Settings**: `.vscode/settings.json` configures format-on-save for TS/JS/HTML/CSS only
- **JSON Files**: Format-on-save disabled for JSON to prevent manifest/package.json auto-format conflicts
- **Prettier**: Used for code formatting (TS, JS, HTML, CSS) - JSON explicitly excluded from format scripts
- **oxlint**: Used for linting (configured in `oxlint.json`)
- **Recommended Extensions**: Prettier and oxc-vscode (see `.vscode/extensions.json`)

### TypeScript Strictness
- **tsconfig.json**: All strict flags enabled (`noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`, `noFallthroughCasesInSwitch`)
- **Target**: ES2020 with DOM types
- **Module**: ESNext (esbuild handles bundling)

### Linting
- **oxlint**: All rule categories enabled (`typescript`, `correctness`, `suspicious`, `perf`)
- **No ESLint**: Project uses oxlint for speed

### Styling
- **CSS Custom Properties**: All values (colors, spacing, transitions) defined in `:root` variables
- **Steam UI Matching**: Button styles in `src/content.css` mimic Steam's native blue buttons
- **CSS Injection**: Content styles injected via `content_scripts.css` in manifest

### Chrome Extension Patterns
- **Manifest V3**: Uses `chrome.storage.sync` (not localStorage), `action` (not browser_action)
- **Content Script Matches**: Only runs on `steamcommunity.com/sharedfiles/filedetails/*` and `workshop/filedetails/*`
- **Permissions**: Only requests `storage` permission (minimal)
- **run_at**: `document_idle` to ensure page is fully loaded before injection

## Testing & Validation
- **No automated tests**: Manual testing workflow via "Load unpacked" in `chrome://extensions/`
- **CI Workflows**:
  - `quality.yml` - Reusable workflow for lint, format check, and build
  - `ci.yml` - Runs quality checks on pushes to main/develop and PRs
  - `release.yml` - Runs quality checks, then packages and creates GitHub release
- **All workflows**: Lint + format check + production build must pass
- **Test on Real Pages**: Always test on actual Steam Workshop pages (e.g., Skyrim, CS2 workshop items)

## Common Tasks

### Adding New Features
1. Implement in TypeScript (maintain strict type safety)
2. Extract all magic values to CONSTANTS object
3. Update `README.md` if user-facing
4. Run `pnpm run format` before committing
5. Ensure `pnpm run build:prod` succeeds
6. Pre-commit hook will auto-bump version

### Modifying Build Process
- Edit `build.ts` directly (no webpack/vite config)
- Always test both dev and prod builds
- PNG icons are copied directly from `src/icons/` to `dist/icons/`
- Build script uses TypeScript with clean code patterns (CONSTANTS, single-purpose functions)

### Debugging Content Script
- Add `console.log()` statements (sourcemaps enabled in dev mode)
- Check browser console on Steam Workshop pages
- Inspect `chrome.storage.sync` in DevTools → Application → Storage

### Icon Changes
- Replace PNG files in `src/icons/` (sizes: 16, 32, 48, 128)
- Icons use Steam's color scheme: `#1b2838` (dark blue), `#66c0f4` (Steam blue)
- Build process copies PNG files directly to `dist/icons/`

## Dependencies & Tools
- **Runtime**: Chrome 96+ (target in esbuild config)
- **Build**: esbuild 0.25+, TypeScript 5.9+
- **Scripts**: tsx 4+ for running TypeScript scripts
- **Quality**: oxlint 1.25+, prettier 3.6+
- **Package Manager**: pnpm 9+ (uses `pnpm-lock.yaml`)
- **Git Hooks**: husky 9+ (`.husky/pre-commit`)
- **Types**: `@types/chrome` for extension APIs

## Gotchas & Edge Cases
- **Steam SPA Navigation**: Steam Workshop uses dynamic navigation - button re-injection needed via MutationObserver
- **Single CSS Selector**: Button injection uses `.workshopItemDetailsHeader` as the target container for button placement
- **Version Sync**: `build.ts` copies version from package.json → manifest.json **at build time** (not at version bump time)
- **JSON Formatting**: JSON files excluded from format scripts to prevent manifest corruption - manual editing only
- **Pre-commit Hook**: Runs lint/format checks BEFORE version bump - commit blocked if checks fail
- **Cross-Platform Scripts**: All scripts use Node.js APIs (not shell commands) for Windows/Linux/Mac compatibility
