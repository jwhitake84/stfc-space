import { sveltekit } from '@sveltejs/kit/vite';

import WindiCSS from 'vite-plugin-windicss';

// PWA Setup
import { pwaConfiguration } from './pwa-configuration.js';
import { VitePWA } from 'vite-plugin-pwa';

import jscc from 'rollup-plugin-jscc';

// Broken fucking shit
import { default as loadVersion } from 'vite-plugin-package-version';
import { default as EnvironmentPlugin } from 'vite-plugin-environment';

import GlobPlugin from 'vite-plugin-glob';

import { execSync } from 'child_process';

let commitHash;
try {
  commitHash = execSync('git rev-parse --short HEAD').toString().trim();
} catch (error) {
  commitHash = 'DEVELOPMENT';
}

export default {
  mode: process.env.MODE,
  build: {
    rollupOptions: {
      external: ['/_app/manifest.webmanifest', '/manifest.webmanifest'],
      output: {
        hoistTransitiveImports: false
      }
    },
    assetsInlineLimit: 1
  },
  plugins: [
    sveltekit(),
    VitePWA(pwaConfiguration),
    GlobPlugin({
      takeover: true
    }),
    loadVersion.default(),
    jscc({}),
    WindiCSS({
      attributify: true,
      scan: {
        dirs: ['src', 'node_modules/@radion/ui/package'],
        include: ['node_modules/@radion/ui/**/*.svlete']
      }
    }),
    EnvironmentPlugin(
      { 'GIT_BRANCH': 'local', 'JWT_SECRET': 'bG9jYWw=', 'GIT_REV_HASH': commitHash },
      { defineOn: 'import.meta.env' }
    )
  ]
};
