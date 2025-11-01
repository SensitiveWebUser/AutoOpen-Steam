import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONSTANTS = {
    DIST_DIR: path.join(__dirname, 'dist'),
    SRC_DIR: path.join(__dirname, 'src'),
    PACKAGE_JSON_PATH: path.join(__dirname, 'package.json'),
    MANIFEST_FILENAME: 'manifest.json',
    POPUP_HTML_FILENAME: 'popup.html',
    CONTENT_CSS_FILENAME: 'content.css',
    POPUP_CSS_FILENAME: 'popup.css',
    CONTENT_TS_FILENAME: 'content.ts',
    POPUP_TS_FILENAME: 'popup.ts',
    ICONS_DIR_NAME: 'icons',
    ICON_SIZES: [16, 32, 48, 128],
    ICON_FILENAME_PATTERN: (size: number) => `icon${size}.png`,
    ARG_PROD: '--prod',
    ARG_WATCH: '--watch',
    CHROME_TARGET: 'chrome96',
    BUILD_FORMAT: 'iife',
    LOG_LEVEL: 'info',
    JSON_INDENT: 2,
    ENCODING: 'utf8' as const,
    EXIT_CODE_ERROR: 1,
} as const;

const MESSAGES = {
    STATIC_FILES_COPIED: '✓ Static files copied',
    WATCHING: '👀 Watching for changes...',
    BUILD_COMPLETE: (mode: string) => `✓ Build complete (${mode})`,
    BUILD_FAILED: 'Build failed:',
} as const;

interface PackageJson {
    version: string;
    [key: string]: unknown;
}

interface Manifest {
    version: string;
    [key: string]: unknown;
}

interface BuildArgs {
    isProd: boolean;
    isWatch: boolean;
}

function parseArgs(): BuildArgs {
    const args = process.argv.slice(2);
    return {
        isProd: args.includes(CONSTANTS.ARG_PROD),
        isWatch: args.includes(CONSTANTS.ARG_WATCH),
    };
}

function cleanDistDirectory(): void {
    if (fs.existsSync(CONSTANTS.DIST_DIR)) {
        fs.rmSync(CONSTANTS.DIST_DIR, { recursive: true });
    }
    fs.mkdirSync(CONSTANTS.DIST_DIR, { recursive: true });
}

function getPackageVersion(): string {
    const packageJson = JSON.parse(
        fs.readFileSync(CONSTANTS.PACKAGE_JSON_PATH, CONSTANTS.ENCODING)
    ) as PackageJson;
    return packageJson.version;
}

function copyManifestWithVersion(version: string): void {
    const manifestPath = path.join(CONSTANTS.SRC_DIR, CONSTANTS.MANIFEST_FILENAME);
    const manifest = JSON.parse(
        fs.readFileSync(manifestPath, CONSTANTS.ENCODING)
    ) as Manifest;
    manifest.version = version;
    
    const distManifestPath = path.join(CONSTANTS.DIST_DIR, CONSTANTS.MANIFEST_FILENAME);
    fs.writeFileSync(distManifestPath, JSON.stringify(manifest, null, CONSTANTS.JSON_INDENT));
}

function copyHtmlFiles(): void {
    const files = [CONSTANTS.POPUP_HTML_FILENAME];
    files.forEach((filename) => {
        const srcPath = path.join(CONSTANTS.SRC_DIR, filename);
        const distPath = path.join(CONSTANTS.DIST_DIR, filename);
        fs.copyFileSync(srcPath, distPath);
    });
}

function copyCssFiles(): void {
    const files = [CONSTANTS.CONTENT_CSS_FILENAME, CONSTANTS.POPUP_CSS_FILENAME];
    files.forEach((filename) => {
        const srcPath = path.join(CONSTANTS.SRC_DIR, filename);
        const distPath = path.join(CONSTANTS.DIST_DIR, filename);
        fs.copyFileSync(srcPath, distPath);
    });
}

function copyIcons(): void {
    const distIconsDir = path.join(CONSTANTS.DIST_DIR, CONSTANTS.ICONS_DIR_NAME);
    if (!fs.existsSync(distIconsDir)) {
        fs.mkdirSync(distIconsDir, { recursive: true });
    }

    CONSTANTS.ICON_SIZES.forEach((size) => {
        const filename = CONSTANTS.ICON_FILENAME_PATTERN(size);
        const srcIcon = path.join(CONSTANTS.SRC_DIR, CONSTANTS.ICONS_DIR_NAME, filename);
        const distIcon = path.join(distIconsDir, filename);
        fs.copyFileSync(srcIcon, distIcon);
    });
}

function copyStaticFiles(): void {
    const version = getPackageVersion();
    copyManifestWithVersion(version);
    copyHtmlFiles();
    copyCssFiles();
    copyIcons();
    console.log(MESSAGES.STATIC_FILES_COPIED);
}

function createBuildConfig(args: BuildArgs): esbuild.BuildOptions {
    return {
        entryPoints: [
            path.join(CONSTANTS.SRC_DIR, CONSTANTS.CONTENT_TS_FILENAME),
            path.join(CONSTANTS.SRC_DIR, CONSTANTS.POPUP_TS_FILENAME),
        ],
        bundle: true,
        outdir: CONSTANTS.DIST_DIR,
        minify: args.isProd,
        sourcemap: !args.isProd,
        target: [CONSTANTS.CHROME_TARGET],
        format: CONSTANTS.BUILD_FORMAT,
        logLevel: CONSTANTS.LOG_LEVEL,
    };
}

async function runBuild(config: esbuild.BuildOptions, args: BuildArgs): Promise<void> {
    if (args.isWatch) {
        const context = await esbuild.context(config);
        await context.watch();
        console.log(MESSAGES.WATCHING);
    } else {
        await esbuild.build(config);
        const mode = args.isProd ? 'production' : 'development';
        console.log(MESSAGES.BUILD_COMPLETE(mode));
    }
}

async function build(): Promise<void> {
    try {
        const args = parseArgs();
        cleanDistDirectory();
        copyStaticFiles();
        
        const config = createBuildConfig(args);
        await runBuild(config, args);
    } catch (error) {
        console.error(MESSAGES.BUILD_FAILED, error);
        process.exit(CONSTANTS.EXIT_CODE_ERROR);
    }
}

build();
