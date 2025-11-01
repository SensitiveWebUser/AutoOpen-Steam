const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const isProd = args.includes('--prod');
const isWatch = args.includes('--watch');

const distDir = path.join(__dirname, 'dist');
const srcDir = path.join(__dirname, 'src');
const packageJson = require('./package.json');

// Clean dist directory
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy static files
function copyStaticFiles() {
    // Copy and update manifest with current version
    const manifest = JSON.parse(fs.readFileSync(path.join(srcDir, 'manifest.json'), 'utf8'));
    manifest.version = packageJson.version;
    fs.writeFileSync(path.join(distDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

    // Copy HTML
    fs.copyFileSync(path.join(srcDir, 'popup.html'), path.join(distDir, 'popup.html'));

    // Copy CSS
    fs.copyFileSync(path.join(srcDir, 'content.css'), path.join(distDir, 'content.css'));
    fs.copyFileSync(path.join(srcDir, 'popup.css'), path.join(distDir, 'popup.css'));

    // Copy PNG icons
    const iconsDir = path.join(distDir, 'icons');
    if (!fs.existsSync(iconsDir)) {
        fs.mkdirSync(iconsDir, { recursive: true });
    }

    const iconSizes = [16, 48, 128];
    iconSizes.forEach((size) => {
        const srcIcon = path.join(srcDir, 'icons', `icon${size}.png`);
        const distIcon = path.join(iconsDir, `icon${size}.png`);
        fs.copyFileSync(srcIcon, distIcon);
    });

    console.log('✓ Static files copied');
}

// Build configuration
const buildConfig = {
    entryPoints: [
        path.join(srcDir, 'content.ts'),
        path.join(srcDir, 'popup.ts'),
    ],
    bundle: true,
    outdir: distDir,
    minify: isProd,
    sourcemap: !isProd,
    target: ['chrome96'],
    format: 'iife',
    logLevel: 'info',
};

async function build() {
    try {
        copyStaticFiles();

        if (isWatch) {
            const context = await esbuild.context(buildConfig);
            await context.watch();
            console.log('👀 Watching for changes...');
        } else {
            await esbuild.build(buildConfig);
            console.log(`✓ Build complete (${isProd ? 'production' : 'development'})`);
        }
    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

build();
