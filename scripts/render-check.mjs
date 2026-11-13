/**
 * Render smoke check: bundles the plugin components for Node with the same CSS
 * Modules and atlas handling as the real build, renders them to static markup,
 * and asserts the important landmarks survive.
 */
import { build } from 'esbuild'
import { mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { cssModules } from './css-modules.mjs'

const root = process.cwd()
const outfile = path.join(root, '.tmp/render-entry.mjs')
const manifest = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'))
await mkdir(path.dirname(outfile), { recursive: true })

await build({
  entryPoints: [path.join(root, 'scripts/render-entry.tsx')],
  outfile,
  bundle: true,
  format: 'esm',
  platform: 'node',
  jsx: 'automatic',
  external: ['react', 'react-dom', 'react-dom/server', 'react/jsx-runtime'],
  plugins: [cssModules()],
  define: { __WHALE_LEAP_VERSION__: JSON.stringify(manifest.version) },
  logLevel: 'silent',
})

globalThis.document = {
  createElement: () => ({ dataset: {}, style: { setProperty() {} }, textContent: '' }),
  head: { appendChild() {} },
}

const { check } = await import(pathToFileURL(outfile).href)
const { page, englishPage, markPage, englishMarkPage, mark, layer } = check()

const landmarks = {
  tabs: ['whale-leap-tab-background', 'whale-leap-tab-mark'].every(token => page.includes(token)),
  previewStage: page.includes('stageCanvas'),
  updateCheck: page.includes('checkUpdate'),
  updateButton: page.includes('updateButton'),
  idleUpdateRow: !page.includes('updateRow'),
  stackedRows: page.includes('rowStacked'),
  runningRow: markPage.includes('data-running-label'),
  runningLabel: markPage.includes('深度求索中'),
  englishRunningLabel: englishMarkPage.includes('Deep diving'),
  englishNav: englishPage.includes('Whale leap'),
  englishInk: englishPage.includes('Ink strength'),
  englishMarkTab: englishPage.includes('Running icon'),
  motionCards: ['swim', 'explore', 'hero', 'sway'].every(motion => markPage.includes(`data-motion=` + JSON.stringify(motion))),
  replaceSwitch: markPage.includes('role="switch"'),
  markPreview: markPage.includes('width:14px') && markPage.includes('height:14px'),
  markSizeSlider: markPage.includes('whale-leap-mark-size'),
  markLabelSizeSlider: markPage.includes('whale-leap-mark-label-size'),
  markSwingSlider: markPage.includes('whale-leap-mark-swing'),
  markOffsetSliders: markPage.includes('whale-leap-mark-offset-x') && markPage.includes('whale-leap-mark-offset-y'),
  englishOffset: englishMarkPage.includes('Horizontal position') && englishMarkPage.includes('Vertical position'),
  englishLabelSize: englishMarkPage.includes('Text size'),
  appearanceGroup: page.includes('groupAppearance') && page.includes('groupPlayback'),
  iconGroup: markPage.includes('任务图标'),
  motionGroup: markPage.includes('motionGrid'),
  englishSwing: englishMarkPage.includes('Swing amplitude'),
  markFish: mark.includes('data-motion="swim"'),
  heroLayer: layer.includes('data-whale-layer="hero"'),
  canvas: layer.includes('<canvas'),
  body: layer.includes('<p>body</p>'),
}

const failed = Object.entries(landmarks).filter(([, ok]) => !ok)
if (failed.length > 0) {
  console.error('Render check failed:', failed.map(([name]) => name).join(', '))
  console.error({ page: page.slice(0, 400), englishPage: englishPage.slice(0, 400), mark, layer })
  process.exitCode = 1
} else {
  console.log(JSON.stringify({
    ok: true,
    landmarks,
    pageBytes: page.length,
    englishBytes: englishPage.length,
    markBytes: mark.length,
    layerBytes: layer.length,
  }, null, 2))
}

