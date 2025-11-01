import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONSTANTS = {
    PACKAGE_JSON_PATH: path.join(__dirname, '..', 'package.json'),
    MANIFEST_PATH: path.join(__dirname, '..', 'src', 'manifest.json'),
    JSON_INDENT: 2,
    NEWLINE: '\n',
    ENCODING: 'utf8' as const,
} as const;

const MESSAGES = {
    SUCCESS: (version: string) => `✅ Updated manifest.json to version ${version}`,
} as const;

interface PackageJson {
    version: string;
    [key: string]: unknown;
}

interface Manifest {
    version: string;
    [key: string]: unknown;
}

function readPackageVersion(): string {
    const packageJson = JSON.parse(
        fs.readFileSync(CONSTANTS.PACKAGE_JSON_PATH, CONSTANTS.ENCODING)
    ) as PackageJson;
    return packageJson.version;
}

function updateManifestVersion(version: string): void {
    const manifest = JSON.parse(
        fs.readFileSync(CONSTANTS.MANIFEST_PATH, CONSTANTS.ENCODING)
    ) as Manifest;
    manifest.version = version;
    
    const manifestJson = JSON.stringify(manifest, null, CONSTANTS.JSON_INDENT) + CONSTANTS.NEWLINE;
    fs.writeFileSync(CONSTANTS.MANIFEST_PATH, manifestJson);
}

function syncVersions(): void {
    const version = readPackageVersion();
    updateManifestVersion(version);
    console.log(MESSAGES.SUCCESS(version));
}

syncVersions();
