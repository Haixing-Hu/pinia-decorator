/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import babel from '@haixing_hu/vite-plugin-babel';

export default defineConfig({
  plugins: [
    vue({
      script: {
        babelParserPlugins: ['decorators'], // enable decorators support
      },
    }),
    babel(),                                // must after the vue plugin
  ],
  test: {
    environment: 'happy-dom',
    coverage: {
      provider: 'istanbul',
    },
  },
});
