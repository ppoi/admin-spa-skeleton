'use strict';

import path from 'node:path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import inject from '@rollup/plugin-inject';
import { defineConfig } from 'vite';
import mockmoon from './mock/vite-plugin.js';

export default defineConfig({
  plugins:[
    inject({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    svelte({}),
    mockmoon()
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname),
      "jQuery": "jquery" // see summernote#4296
    }
  },
  server: {
    strictPort: true
  }
});