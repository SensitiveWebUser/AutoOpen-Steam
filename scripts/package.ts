import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONSTANTS = {
    DIST_DIR: path.join(__dirname, '..', 'dist'),
    RELEASE_DIR: path.join(__dirname, '..', 'releases'),
    PACKAGE_JSON_PATH: path.join(__dirname, '..', 'package.json'),
    EXTENSION_NAME: 'autoopen-steam',
    ZIP_EXTENSION: '.zip',
    VERSION_PREFIX: 'v',
    BYTES_PER_KB: 1024,
    BYTES_PER_MB: 1024 * 1024,
    DECIMAL_PLACES: 2,
    PLATFORM_WINDOWS: 'win32',
    EXIT_CODE_ERROR: 1,
} as const;

const MESSAGES = {
    ERROR_DIST_NOT_FOUND: '❌ dist folder not found. Run "pnpm build:prod" first.',
    PACKAGING: (version: string) => `📦 Packaging extension v${version}...`,
    SUCCESS: (zipName: string) => `✅ Package created: ${zipName}`,
    SIZE: (sizeMB: string) => `📊 Size: ${sizeMB} MB`,
    LOCATION: (zipPath: string) => `📁 Location: ${zipPath}`,
    ERROR_PACKAGING: (message: string) => `❌ Packaging failed: ${message}`,
} as const;

function ensureDistExists(): void {
    if (!fs.existsSync(CONSTANTS.DIST_DIR)) {
        console.error(MESSAGES.ERROR_DIST_NOT_FOUND);
        process.exit(CONSTANTS.EXIT_CODE_ERROR);
    }
}

function ensureReleaseDir(): void {
    if (!fs.existsSync(CONSTANTS.RELEASE_DIR)) {
        fs.mkdirSync(CONSTANTS.RELEASE_DIR, { recursive: true });
    }
}

function getVersion(): string {
    const packageJson = JSON.parse(fs.readFileSync(CONSTANTS.PACKAGE_JSON_PATH, 'utf8'));
    return packageJson.version;
}

function getZipPaths(version: string): { name: string; path: string } {
    const zipName = `${CONSTANTS.EXTENSION_NAME}-${CONSTANTS.VERSION_PREFIX}${version}${CONSTANTS.ZIP_EXTENSION}`;
    const zipPath = path.join(CONSTANTS.RELEASE_DIR, zipName);
    return { name: zipName, path: zipPath };
}

function removeOldZip(zipPath: string): void {
    if (fs.existsSync(zipPath)) {
        fs.unlinkSync(zipPath);
    }
}

function createZip(zipPath: string): void {
    if (process.platform === CONSTANTS.PLATFORM_WINDOWS) {
        const psCommand = `Compress-Archive -Path "${CONSTANTS.DIST_DIR}\\*" -DestinationPath "${zipPath}" -Force`;
        execSync(`powershell -Command "${psCommand}"`, { stdio: 'inherit' });
    } else {
        execSync(`cd "${CONSTANTS.DIST_DIR}" && zip -r "${zipPath}" .`, { stdio: 'inherit' });
    }
}

function getZipSize(zipPath: string): string {
    const stats = fs.statSync(zipPath);
    return (stats.size / CONSTANTS.BYTES_PER_MB).toFixed(CONSTANTS.DECIMAL_PLACES);
}

function packageExtension(): void {
    ensureDistExists();
    ensureReleaseDir();

    const version = getVersion();
    const { name: zipName, path: zipPath } = getZipPaths(version);

    removeOldZip(zipPath);
    console.log(MESSAGES.PACKAGING(version));

    try {
        createZip(zipPath);
        const sizeMB = getZipSize(zipPath);

        console.log(MESSAGES.SUCCESS(zipName));
        console.log(MESSAGES.SIZE(sizeMB));
        console.log(MESSAGES.LOCATION(zipPath));
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(MESSAGES.ERROR_PACKAGING(message));
        process.exit(CONSTANTS.EXIT_CODE_ERROR);
    }
}

packageExtension();
