/// <reference types='vitest' />

import react from '@vitejs/plugin-react';

import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig({
  root: __dirname,
  base: '/build/',
  cacheDir: '../../node_modules/.vite/apps/permissions',
  server: {
    port: 4200,
    host: 'localhost',
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  plugins: [react(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
  define: {
    'process.env': {},
  },
  build: {
    outDir: '../../dist/apps/permissions',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      input: 'permissions.html',
      output: {
        entryFileNames: `permissions.js`,
      },
    },
  },
});
