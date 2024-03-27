'use strict';

import path from 'node:path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import inject from '@rollup/plugin-inject';
import { defineConfig, loadEnv } from 'vite';
import mockmoon from './mock/vite-plugin.js';

export default defineConfig(({mode})=>{
  let env = loadEnv(mode, path.resolve(__dirname), '');
  return {
    plugins:[
      inject({
        $: 'jquery',
        jQuery: 'jquery',
      }),
      svelte({}),
      mockmoon()
    ],
    base: env.VITE_SPA_BASE_URL,
    build: {
      target: 'es2022',
      assetsInlineLimit: 0
    },
    resolve: {
      alias: {
        '~': path.resolve(__dirname)
      }
    },
    server: {
      strictPort: true
    }
  };
});
