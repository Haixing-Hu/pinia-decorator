/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import * as esbuild from 'esbuild'

async function bundle(format) {
  const minify = (process.env.NODE_ENV === 'production');
  const outfilePrefix = `./dist/pinia-decorator.${format}`;
  const outfile = (minify ? `${outfilePrefix}.min.js` : `${outfilePrefix}.js`);
  await esbuild.build({
    entryPoints: ['./src/index.js'],
    outfile,
    format,
    bundle: true,
    sourcemap: 'linked',
    minify,
    external: ['pinia', '@haixing_hu/vue3-class-component'],
    drop: ['debugger', 'console'],
  });
}

bundle('cjs');
bundle('esm');
