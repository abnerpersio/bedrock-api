require('esbuild').build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.js',
  platform: 'node',
  bundle: true,
  logLevel: 'info',
  target: 'node16',
});
