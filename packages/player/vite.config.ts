/// <reference types='vitest' />

import * as path from 'path';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/player',
  plugins: [
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
    }),
  ],
  worker: {
    plugins: () => [nxViteTsPaths()],
  },
  build: {
    outDir: '../../dist/packages/player',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: 'src/index.ts',
      name: 'player',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: [],
    },
  },
});
