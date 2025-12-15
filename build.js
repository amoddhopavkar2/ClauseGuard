import * as esbuild from 'esbuild';
import { copyFileSync, mkdirSync, existsSync, cpSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const isWatch = process.argv.includes('--watch');

// Ensure dist directory exists
if (!existsSync('dist')) {
  mkdirSync('dist', { recursive: true });
}

// Common build options
const commonOptions = {
  bundle: true,
  minify: !isWatch,
  sourcemap: isWatch,
  target: ['chrome100'],
  logLevel: 'info',
};

// Build configurations for each entry point
const builds = [
  {
    entryPoints: ['src/background/serviceWorker.ts'],
    outfile: 'dist/background/serviceWorker.js',
    format: 'esm',
  },
  {
    entryPoints: ['src/content/contentScript.ts'],
    outfile: 'dist/content/contentScript.js',
    format: 'iife',
  },
  {
    entryPoints: ['src/popup/popup.ts'],
    outfile: 'dist/popup/popup.js',
    format: 'iife',
  },
  {
    entryPoints: ['src/options/options.ts'],
    outfile: 'dist/options/options.js',
    format: 'iife',
  },
];

// Copy static files
function copyStaticFiles() {
  // Ensure directories exist
  ['dist/popup', 'dist/options', 'dist/content', 'dist/assets'].forEach(dir => {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  });

  // Copy HTML files
  copyFileSync('src/popup/popup.html', 'dist/popup/popup.html');
  copyFileSync('src/options/options.html', 'dist/options/options.html');

  // Copy CSS files
  copyFileSync('src/content/styles.css', 'dist/content/styles.css');
  copyFileSync('src/popup/popup.css', 'dist/popup/popup.css');
  copyFileSync('src/options/options.css', 'dist/options/options.css');

  // Copy manifest
  copyFileSync('src/manifest.json', 'dist/manifest.json');

  // Copy icons if they exist
  if (existsSync('src/assets')) {
    cpSync('src/assets', 'dist/assets', { recursive: true });
  }

  console.log('Static files copied.');
}

async function build() {
  try {
    if (isWatch) {
      // Create contexts for watching
      const contexts = await Promise.all(
        builds.map(config =>
          esbuild.context({ ...commonOptions, ...config })
        )
      );

      // Start watching all contexts
      await Promise.all(contexts.map(ctx => ctx.watch()));

      copyStaticFiles();
      console.log('Watching for changes...');

      // Keep process alive
      process.on('SIGINT', async () => {
        await Promise.all(contexts.map(ctx => ctx.dispose()));
        process.exit(0);
      });
    } else {
      // One-time build
      await Promise.all(
        builds.map(config =>
          esbuild.build({ ...commonOptions, ...config })
        )
      );

      copyStaticFiles();
      console.log('Build complete!');
    }
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
