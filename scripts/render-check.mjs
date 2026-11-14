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
const { page, englishPage, peekPage, englishPeekPage, peekMarkPage, englishPeekMarkPage, mark, layer } = check()

const landmarks = {
  entryPoint: page.includes('data-whale-leap-entry') && page.includes('livePreview'),
  englishEntry: englishPage.includes('Appearance and playback controls live in the live preview'),
  noPageStage: !page.includes('stageCanvas') && !page.includes('markSim'),
  noPageTabs: !page.includes('whale-leap-tab-'),
  noPagePlayback: !page.includes('groupPlayback'),
  updateCheck: page.includes('checkUpdate'),
  updateButton: page.includes('updateButton'),
  idleUpdateRow: !page.includes('updateRow'),
  peekTabs: peekPage.includes('tabBackground') && peekPage.includes('tabMark'),
  playbackSection: peekPage.includes('tabPlayback') && peekPage.includes('role="switch"'),
  englishPlaybackSection: englishPeekPage.includes('Show in conversations') && englishPeekPage.includes('role="switch"'),
  randomPosition: peekPage.includes('randomPosition') && peekPage.includes('bgPositionHint'),
  englishRandomPosition: englishPeekPage.includes('Random position'),
  backgroundGroups: ['groupLook', 'groupPosition', 'groupFill'].every(key => peekPage.includes(key)),
  markGroups: ['尺寸', '动画'].every(label => peekMarkPage.includes(label)),
  englishGroups: ['Size', 'Animation'].every(label => englishPeekMarkPage.includes(label)),
  englishNav: englishPage.includes('Whale leap'),
  englishInk: englishPeekPage.includes('Ink strength'),
  englishMarkTab: englishPeekPage.includes('Running icon'),
  motionCards: ['游动', '探索', '首页游动', '左右轻摆'].every(motion => peekMarkPage.includes(motion)),
  replaceSwitch: peekMarkPage.includes('role="switch"'),
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
  replayButton: peekPage.includes('peekReplay'),
  livePreviewButton: page.includes('stageLive'),
  englishLivePreview: englishPage.includes('Live preview'),
  bgOffsetSliders: peekPage.includes('whale-leap-bg-offset-x') && peekPage.includes('whale-leap-bg-offset-y'),
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

