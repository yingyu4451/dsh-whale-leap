/**
 * Build the browser half of whale-leap into a ModuleLoader artifact.
 *
 * The monorepo preset depends on the checkout's tsc pipeline and module table,
 * so this standalone plugin uses esbuild with two small shims: CSS Modules are
 * scoped and injected as one style tag, and the output is wrapped in the
 * `window.__ModuleLoader__.load` factory the client runtime expects. Only React
 * stays external; the frame atlas ships inside the bundle as a data URL so the
 * background whale works offline and on packaged builds whose brand package is
 * not readable from disk.
 */
import { build } from 'esbuild'
import { mkdir, readFile, rm } from 'node:fs/promises'
import path from 'node:path'
import { cssModules } from './scripts/css-modules.mjs'

const root = process.cwd()
const outdir = path.join(root, 'lib')
const manifest = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'))
const packageName = manifest.name
const version = manifest.version

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
  external: ['react', 'react/jsx-runtime', 'react-dom/client'],
  loader: { '.webp': 'dataurl' },
  plugins: [cssModules()],
  define: { __WHALE_LEAP_VERSION__: JSON.stringify(version) },
  banner: {
    js: `window.__ModuleLoader__.load({ id: ${JSON.stringify(packageName)}, factory: (require) => {\nvar module = { exports: {} };\nvar exports = module.exports;\n`,
  },
  footer: {
    js: `\nreturn module.exports;\n} });\n`,
  },
  logLevel: 'info',
})
