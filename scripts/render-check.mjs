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
  loader: { '.webp': 'dataurl' },
  define: { __WHALE_LEAP_VERSION__: JSON.stringify(manifest.version) },
  logLevel: 'silent',
})

globalThis.document = {
  createElement: () => ({ dataset: {}, style: { setProperty() {} }, textContent: '' }),
  head: { appendChild() {} },
}

const { check } = await import(pathToFileURL(outfile).href)
const { page, englishPage, markPage, englishMarkPage, peekPage, englishPeekPage, peekMarkPage, englishPeekMarkPage, mark, layer } = check()

const landmarks = {
  tabs: ['whale-leap-tab-background', 'whale-leap-tab-mark'].every(token => page.includes(token)),
  previewStage: page.includes('stageCanvas'),
  updateCheck: page.includes('checkUpdate'),
  updateButton: page.includes('updateButton'),
  idleUpdateRow: !page.includes('updateRow'),
  playbackOnly: page.includes('groupPlayback') && !page.includes('groupAppearance'),
  runningRow: markPage.includes('data-running-label'),
  runningLabel: markPage.includes('深度求索中'),
  englishRunningLabel: englishMarkPage.includes('Deep diving'),
  englishNav: englishPage.includes('Whale leap'),
  englishInk: englishPeekPage.includes('Ink strength'),
  englishMarkTab: englishPage.includes('Running icon'),
  motionCards: ['游动', '探索', '首页游动', '左右轻摆'].every(motion => peekMarkPage.includes(motion)),
  replaceSwitch: peekMarkPage.includes('role="switch"'),
  markStageDivider: markPage.includes('markSimDivider'),
  markSizeSlider: peekMarkPage.includes('whale-leap-mark-size'),
  markLabelSizeSlider: peekMarkPage.includes('whale-leap-mark-label-size'),
  markSwingSlider: peekMarkPage.includes('whale-leap-mark-swing'),
  markOffsetSliders: peekMarkPage.includes('whale-leap-mark-offset-x') && peekMarkPage.includes('whale-leap-mark-offset-y'),
  englishOffset: englishPeekMarkPage.includes('Horizontal position') && englishPeekMarkPage.includes('Vertical position'),
  englishLabelSize: englishPeekMarkPage.includes('Text size'),
  iconGroup: peekMarkPage.includes('任务图标'),
  motionGroup: peekMarkPage.includes('aria-label="动画"'),
  englishSwing: englishPeekMarkPage.includes('Swing amplitude'),
  fillStyleSwitches: ['frameDots', 'frameCode', 'frameGlyphs', 'frameBinary', 'frameLines'].every(key => peekPage.includes(key)),
  englishFillStyle: englishPeekPage.includes('Fill style'),
  autoToggle: (page.includes('autoHint') || page.includes('autoOffHint')) && page.includes('role="switch"'),
  replayButton: page.includes('stageReplay'),
  livePreviewButton: page.includes('livePreview'),
  englishLivePreview: englishPage.includes('Live preview'),
  bgOffsetSliders: peekPage.includes('whale-leap-bg-offset-x') && peekPage.includes('whale-leap-bg-offset-y'),
  englishAutoToggle: englishPage.includes('Show in conversations') && page.includes('role="switch"'),
  markColorRows: peekMarkPage.includes('whale-leap-mark-color') && peekMarkPage.includes('whale-leap-label-color'),
  englishColors: englishPeekMarkPage.includes('Icon color') && englishPeekMarkPage.includes('Text color'),
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

