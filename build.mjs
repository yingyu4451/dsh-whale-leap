/**
 * Build the browser half of whale-leap into a ModuleLoader artifact.
 *
 * The monorepo preset depends on the checkout's tsc pipeline and module table,
 * so this standalone plugin uses esbuild with three small shims: CSS Modules are
 * scoped and injected as one style tag, the atlas is embedded as a data URL, and
 * the output is wrapped in the `window.__ModuleLoader__.load` factory the client
 * runtime expects. Only React stays external.
 */
import { build } from 'esbuild'
import { mkdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { cssModules } from './scripts/css-modules.mjs'

const root = process.cwd()
const outdir = path.join(root, 'lib')
const packageName = '@local/whale-leap'

await rm(outdir, { recursive: true, force: true })
await mkdir(outdir, { recursive: true })

await build({
  entryPoints: [path.join(root, 'src/client/index.tsx')],
  outfile: path.join(outdir, 'client.js'),
  bundle: true,
  format: 'cjs',
  platform: 'browser',
  target: ['es2022'],
  jsx: 'automatic',
  loader: { '.webp': 'dataurl' },
  external: ['react', 'react/jsx-runtime'],
  plugins: [cssModules()],
  banner: {
    js: `window.__ModuleLoader__.load({ id: ${JSON.stringify(packageName)}, factory: (require) => {\nvar module = { exports: {} };\nvar exports = module.exports;\n`,
  },
  footer: {
    js: `\nreturn module.exports;\n} });\n`,
  },
  logLevel: 'info',
})
