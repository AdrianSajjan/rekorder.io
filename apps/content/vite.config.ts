/// <reference types='vitest' />

import react from '@vitejs/plugin-react';

import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/content',
  server: {
    port: 4400,
    host: 'localhost',
  },
  preview: {
    port: 4400,
    host: 'localhost',
  },
  define: {
    'process.env': {},
  },
  plugins: [
    react({
      babel: {
        plugins: ['styled-jsx/babel'],
      },
    }),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
  ],
  build: {
    outDir: '../../dist/apps/content',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: 'src/main.tsx',
      name: 'content',
    },
    rollupOptions: {
      output: {
        entryFileNames: `content-script.js`,
      },
    },
  },
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/content',
      provider: 'v8',
    },
  },
});
