import { execSync } from 'child_process';
import { existsSync } from 'fs';

const CONSTANTS = {
    EXCLUDED_FILES: ['package.json', 'src/manifest.json', 'pnpm-lock.yaml'],
    VERSION_FILES: ['package.json', 'src/manifest.json', 'pnpm-lock.yaml'],
    ENCODING: 'utf8' as const,
} as const;

const MESSAGES = {
    DETECTING: '📦 Checking for changes...',
    BUMPING: '📦 Changes detected, bumping minor version...',
    SUCCESS: '✅ Version bumped and added to commit',
    NO_CHANGES: '⏭️  No changes detected (version files only), skipping version bump',
} as const;

function getStagedFiles(): string[] {
    try {
        const output = execSync('git diff --cached --name-only --diff-filter=ACM', {
            encoding: CONSTANTS.ENCODING,
        });
        return output.trim().split('\n').filter(Boolean);
    } catch {
        return [];
    }
}

function hasNonVersionChanges(stagedFiles: string[]): boolean {
    return stagedFiles.some((file) => !(CONSTANTS.EXCLUDED_FILES as readonly string[]).includes(file));
}

function bumpVersion(): void {
    console.log(MESSAGES.BUMPING);

    execSync('pnpm version minor --no-git-tag-version', { stdio: 'inherit' });
    execSync('pnpm exec tsx scripts/version-bump.ts', { stdio: 'inherit' });

    const filesToAdd = CONSTANTS.VERSION_FILES.filter((file) => existsSync(file));
    if (filesToAdd.length > 0) {
        execSync(`git add ${filesToAdd.join(' ')}`, { stdio: 'inherit' });
    }

    console.log(MESSAGES.SUCCESS);
}

function preCommitHook(): void {
    const stagedFiles = getStagedFiles();

    if (stagedFiles.length === 0) {
        process.exit(0);
    }

    if (hasNonVersionChanges(stagedFiles)) {
        bumpVersion();
    } else {
        console.log(MESSAGES.NO_CHANGES);
    }
}

preCommitHook();
