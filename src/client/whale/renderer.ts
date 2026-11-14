/** Alternating dot and code breaches sharing one bundled animation atlas. */
import type { WhaleFillStyle, WhalePodTiming } from '../settings.ts'
import { nextAutoDelay } from './auto-interval.ts'
import type { WhaleArtwork } from './artwork.ts'
import { createCodeFill, type WhaleTextureMode } from './code-fill.ts'

// Geometry of assets/breach-atlas.webp: 137 frames at 192 × 108 cells, in twelve columns.
const ATLAS = { width: 192, height: 108, columns: 12, frames: 137 } as const

/** Ink response: the squared strength keeps the authored default subtle while the top of the range turns faint dots solid. */
const INK_GAIN = 1.5

/**
 * Ink density of the farthest pod member relative to the nearest one. Depth
 * also scales the drawing, but a distant whale needs a lighter ink body as
 * well so the pod reads as one scene with distance instead of one flat image.
 */
const DEPTH_INK_FLOOR = 0.34

/** Ink density multiplier of a scene: 1 is the nearest whale, 0 the horizon. */
function depthInk(depth: number): number {
  return DEPTH_INK_FLOOR + (1 - DEPTH_INK_FLOOR) * depth
}

/** A pod appearance draws one to three whales, chosen at random each time. */
const POD_MIN = 1
const POD_MAX = 3

/** Number of whales in the next pod appearance. */
function podCount(): number {
  return POD_MIN + Math.floor(Math.random() * (POD_MAX - POD_MIN + 1))
}

/** Least distance kept between the measured drawing boxes of two pod members, in CSS pixels. */
const POD_GAP_MIN = 28

/** Axis-aligned rectangle in canvas CSS pixels, used to keep pod members apart. */
interface PodRect {
  x0: number
  y0: number
  x1: number
  y1: number
}

/** True when two rectangles keep at least `gap` pixels on at least one axis. */
function separated(a: PodRect, b: PodRect, gap: number): boolean {
  if (Math.max(a.x0 - b.x1, b.x0 - a.x1) >= gap) return true
  return Math.max(a.y0 - b.y1, b.y0 - a.y1) >= gap
}

/** Decoded atlas pixels per URL, so a remount reuses the one expensive decode. */
const atlasCache = new Map<string, Uint8ClampedArray>()

/**
 * Index of the next playback's texture, shared across renderer attachments.
 *
 * Each conversation switch mounts a new decoration; a per-attachment index
 * would make every switch start on the same fill. Keeping it module-wide lets
 * consecutive appearances walk the enabled textures in display order.
 */
let nextStyle = 0

/** Playback phase source: the whole page, or this attachment only. */
export type WhaleFillPhase = 'shared' | 'local'

/** Ink textures the renderer can paint; the settings list chooses which ones participate. */
export type { WhaleFillStyle } from '../settings.ts'

/**
 * Backing-store budget. Large / high-DPI windows would otherwise allocate and
 * composite tens of megabytes of transparent canvas for sparse dots; the
 * decoration caps the buffer instead and keeps the CSS box unchanged.
 */
const MAX_CANVAS_PIXELS = 5_000_000

/**
 * Resolution cap while the live preview keeps replaying the whale. The preview
 * loop runs far more often than normal playback; trimming the buffer keeps the
 * preview from competing with the chat UI on high-DPI screens.
 */
const PREVIEW_DPR_CAP = 1.25

/** Forget cached atlas decodes; tests use this to keep each atlas load observable. */
export function clearAtlasCache(): void {
  atlasCache.clear()
}

/**
 * One whale of a pod appearance.
 *
 * All lengths are in CSS pixels of the canvas. Depth selects both the drawing
 * scale (through {@link WhaleScene.width}) and the ink density, and the delay
 * staggers the pod so the whales do not leap in lockstep.
 */
interface WhaleScene {
  /** Scene left edge inside the canvas. */
  left: number
  /** Scene top edge inside the canvas. */
  top: number
  /** Scene width; the height follows the atlas aspect ratio. */
  width: number
  /** Distance of the whale, from 0 (horizon) to 1 (nearest). */
  depth: number
  /** Milliseconds after the pod starts before this whale begins its leap. */
  delay: number
}

/**
 * The solid-body bounds of the atlas across all frames, normalized to the cell.
 *
 * A raw union includes the thin water splash that touches the cell edge in a
 * few frames; using it makes the safe interval empty on typical canvases, so
 * each column and row must hold a minimum amount of opaque content before it
 * counts toward the box.
 */
interface WhaleBox {
  x0: number
  y0: number
  x1: number
  y1: number
}

/** Composition of one random pod appearance. */
export interface WhalePodOptions {
  /** Whether a random appearance lays out a pod instead of one whale. */
  enabled: boolean
  /** Whether farther pod members use lighter ink. */
  depthInk: boolean
  /** Whether the pod leaps at once or each whale picks its own start time. */
  timing: WhalePodTiming
  /** Farthest pod whale scale, as a fraction of one full scene width. */
  sizeMin: number
  /** Nearest pod whale scale, as a fraction of one full scene width. */
  sizeMax: number
}

/** Control of one attached whale decoration. */
export interface PixelWhaleHandle {
  /** Request one playback; ignored while playing, failed, hidden, or under reduced motion. */
  play: () => void
  /** Decode the atlas ahead of the first replay, so switching conversations does not pay for it. */
  prefetch: () => void
  /** Swap the artwork (scale and ink opacity) and repaint without re-decoding the atlas. */
  update: (options: WhaleArtwork) => void
  /** Replace the enabled texture list; playback walks it in display order. */
  setFillStyles: (styles: WhaleFillStyle[]) => void
  /**
   * Enable or disable time-driven replays.
   * @param intervalMs - delay between replays, or undefined to stop them.
   * @param playNow - whether enabling also replays once immediately.
   * @param random - whether each wait varies between half and one-and-a-half intervals.
   */
  setAutoPlay: (intervalMs: number | undefined, playNow?: boolean, random?: boolean) => void
  /**
   * Cap the render resolution while the settings preview loops the whale.
   * @param active - whether preview rendering is active.
   */
  setPreview: (active: boolean) => void
  /**
   * Randomize the scene before every playback.
   *
   * Random mode lays out a random position; when the pod switch is on it draws
   * two or three whales, spaced apart, with depth-dependent ink and a
   * configurable entrance timing.
   * @param enabled - whether every playback lays out a new random arrangement.
   */
  setRandomPosition: (enabled: boolean) => void
  /**
   * Configure the random-appearance composition.
   * @param options - pod switch, depth-ink switch, entrance timing, and pod size range.
   */
  setPodOptions: (options: WhalePodOptions) => void
  /** Release frame work, atlas pixels, and observers; late atlas loads are ignored. */
  dispose: () => void
}

const NO_WHALE: PixelWhaleHandle = {
  play: () => {},
  prefetch: () => {},
  update: () => {},
  setFillStyles: () => {},
  setAutoPlay: () => {},
  setPreview: () => {},
  setRandomPosition: () => {},
  setPodOptions: () => {},
  dispose: () => {},
}

/**
 * Bind one noninteractive, initially transparent home decoration.
 * Missing Canvas support returns a no-op handle, so home stays usable without decoration.
 * An atlas failure stops decoration and logs a reload action.
 * @param canvas - presentation-owned output, with its neutral color supplied by CSS.
 * @param options - artwork opacity, scale, lettering, frame rate, and duration.
 * @param atlasUrl - URL of the packaged frame atlas, loaded once on the first eligible playback.
 * @param phase - playback phase source; the settings preview uses 'local' so it never advances the page sequence.
 * @returns the playback trigger and its teardown.
 */
export function attachPixelWhale(canvas: HTMLCanvasElement, options: WhaleArtwork, atlasUrl: string, phase: WhaleFillPhase = 'shared'): PixelWhaleHandle {
  const context = canvas.getContext('2d')
  if (context === null) return NO_WHALE
  const ctx = context
  const image = new Image()
  const media = matchMedia('(prefers-reduced-motion: reduce)')
  let artwork = options
  let pixels: Uint8ClampedArray | undefined
  let scenes: WhaleScene[] = []
  let started: number | undefined
  let loading = false
  let wanted = false
  let disposed = false
  let failed = false
  let visible = true
  let frame = 0
  let layoutFrame = 0
  let last = -Infinity
  let width = 0
  let height = 0
  let lastWidth = -1
  let lastHeight = -1
  let lastColor = ''
  let sceneWidth = 0
  let lastSceneWidth = -1
  let lastOffsetX = Number.NaN
  let lastOffsetY = Number.NaN
  let dprCap: number | undefined
  let lastDpr = 0
  let fill: WhaleFillStyle = 'code'
  let localStyle = 0
  let styles: WhaleFillStyle[] = ['pixels', 'code']
  let code: ReturnType<typeof createCodeFill> | undefined
  let codeMode: WhaleTextureMode | undefined
  let autoInterval: number | undefined
  let autoRandom = false
  let autoTimer: ReturnType<typeof setTimeout> | undefined
  let randomMode = false
  let podEnabled = true
  let depthInkOn = true
  let podTiming: WhalePodTiming = 'random'
  let podSizeMin = 0.34
  let podSizeMax = 0.68
  let whaleBox: WhaleBox | undefined

  const moving = () => !media.matches
  const drawable = () => !disposed && !document.hidden && visible && width > 0 && height > 0

  function clear(): void {
    ctx.clearRect(0, 0, width, height)
  }

  function stop(): void {
    cancelAnimationFrame(frame)
    frame = 0
    started = undefined
    clear()
  }

  function fail(error: unknown): void {
    if (disposed) return
    failed = true
    stop()
    console.warn('Home whale animation is unavailable; home remains usable. Reload the page to retry.', error)
  }

  /** Delay of the last pod member in milliseconds. */
  function finalDelay(): number {
    let delay = 0
    for (const scene of scenes) {
      if (scene.delay > delay) delay = scene.delay
    }
    return delay
  }

  function paint(now: number): void {
    clear()
    if (pixels === undefined || started === undefined) return
    const elapsed = now - started
    const duration = artwork.rippleDurationMs
    if (elapsed >= duration + finalDelay()) {
      started = undefined
      return
    }
    const stride = ATLAS.width * ATLAS.columns
    for (const scene of scenes) {
      const local = elapsed - scene.delay
      if (local <= 0) continue
      const progress = local / duration
      if (progress >= 1) continue
      const index = Math.min(ATLAS.frames - 1, Math.floor(progress * ATLAS.frames))
      const offsetX = (index % ATLAS.columns) * ATLAS.width
      const offsetY = Math.floor(index / ATLAS.columns) * ATLAS.height
      const cell = scene.width / ATLAS.width
      const ink = depthInkOn ? depthInk(scene.depth) : 1
      const fade = Math.min(1, progress * 15, (1 - progress) * 10)
      if (fill !== 'pixels' && code !== undefined) {
        // The code fill boosts its own coverage and mask, so the strength maps
        // linearly here; the dotted fill squares it to keep the same response.
        code.paint(ctx, pixels, index, scene.left, scene.top, scene.width, artwork.activeOpacity * fade * ink, whaleBox)
        continue
      }
      for (let y = 0; y < ATLAS.height; y++) {
        for (let x = 0; x < ATLAS.width; x++) {
          const offset = ((offsetY + y) * stride + offsetX + x) * 4
          const alpha = (pixels[offset + 1] as number) / 255
          if (alpha < 0.015) continue
          ctx.globalAlpha = Math.min(1, alpha * artwork.activeOpacity * artwork.activeOpacity * INK_GAIN * fade * ink)
          ctx.beginPath()
          ctx.arc(scene.left + (x + 0.5) * cell, scene.top + (y + 0.5) * cell, (pixels[offset] as number) / 255 * cell, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }
    ctx.globalAlpha = 1
  }

  function tick(now: number): void {
    frame = 0
    if (!drawable()) return
    if (!moving()) { stop(); return }
    if (now - last + 0.5 >= 1000 / artwork.frameRate) {
      paint(now)
      last = now
    }
    if (started !== undefined) frame = requestAnimationFrame(tick)
  }

  function resume(): void {
    cancelAnimationFrame(frame)
    frame = 0
    if (disposed) return
    if (!moving()) { stop(); return }
    if (!drawable()) return
    paint(performance.now())
    last = performance.now()
    if (started !== undefined) frame = requestAnimationFrame(tick)
  }

  function resize(): void {
    width = canvas.clientWidth
    height = canvas.clientHeight
    const requested = Math.min(devicePixelRatio, dprCap ?? 2)
    // Cap the buffer, not the layout: sparse dots lose nothing visible, while a
    // 4K window stops allocating and compositing a full-resolution layer.
    const dpr = Math.min(requested, Math.sqrt(MAX_CANVAS_PIXELS / Math.max(1, width * height)))
    const pixelWidth = Math.round(width * dpr)
    const pixelHeight = Math.round(height * dpr)
    const nextSceneWidth = Math.min(Math.max(width * 0.94, 720), height * 1.6, 1120) * 1.12 * artwork.scale
    const nextColor = getComputedStyle(canvas).color
    const offsetScale = width / 1000
    const nextOffsetX = artwork.offsetX * offsetScale
    const nextOffsetY = artwork.offsetY * offsetScale
    // ResizeObserver + theme mutation fire on unrelated attribute churn; layout,
    // ink, and scale unchanged means there is nothing to redraw.
    if (width === lastWidth && height === lastHeight && nextColor === lastColor
      && nextSceneWidth === sceneWidth && nextOffsetX === lastOffsetX && nextOffsetY === lastOffsetY
      && dpr === lastDpr) return
    lastColor = nextColor
    lastWidth = width
    lastHeight = height
    lastDpr = dpr
    lastSceneWidth = nextSceneWidth
    lastOffsetX = nextOffsetX
    lastOffsetY = nextOffsetY
    // Reallocating the backing buffer clears it and is the expensive part of a layout pass.
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth
      canvas.height = pixelHeight
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = nextColor
    sceneWidth = nextSceneWidth
    scenes = layScenes()
    if (code !== undefined && sceneWidth > 0) code.resize(canvas, sceneWidth)
    resume()
  }

  // Layout redraws all code lettering, so bursts of size or theme changes collapse into one frame.
  function scheduleResize(): void {
    if (disposed || layoutFrame !== 0) return
    layoutFrame = requestAnimationFrame(() => {
      layoutFrame = 0
      resize()
    })
  }

  /**
   * Normalized bounds of the solid whale across the whole frame set.
   * @param source - decoded atlas pixels.
   * @returns the normalized bounding box of the whale body.
   */
  function measureWhaleBox(source: Uint8ClampedArray): WhaleBox {
    const minAlpha = 0.3
    const minCount = 16
    let minX = ATLAS.width
    let minY = ATLAS.height
    let maxX = -1
    let maxY = -1
    const stride = ATLAS.width * ATLAS.columns
    const columns = new Uint16Array(ATLAS.width)
    const rows = new Uint16Array(ATLAS.height)
    for (let index = 0; index < ATLAS.frames; index++) {
      columns.fill(0)
      rows.fill(0)
      const offsetX = (index % ATLAS.columns) * ATLAS.width
      const offsetY = Math.floor(index / ATLAS.columns) * ATLAS.height
      for (let y = 0; y < ATLAS.height; y++) {
        for (let x = 0; x < ATLAS.width; x++) {
          if ((source[((offsetY + y) * stride + offsetX + x) * 4 + 1] as number) / 255 < minAlpha) continue
          columns[x] = (columns[x] as number) + 1
          rows[y] = (rows[y] as number) + 1
        }
      }
      for (let x = 0; x < ATLAS.width; x++) {
        if ((columns[x] as number) < minCount) continue
        if (x < minX) minX = x
        if (x > maxX) maxX = x
      }
      for (let y = 0; y < ATLAS.height; y++) {
        if ((rows[y] as number) < minCount) continue
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
    if (maxX < minX || maxY < minY) return { x0: 0, y0: 0, x1: 1, y1: 1 }
    return { x0: minX / ATLAS.width, y0: minY / ATLAS.height, x1: (maxX + 1) / ATLAS.width, y1: (maxY + 1) / ATLAS.height }
  }

  /**
   * Place the single, slider-positioned scene.
   * @returns the scene the artwork offsets describe.
   */
  function placeFromArtwork(): WhaleScene[] {
    if (sceneWidth <= 0 || width <= 0 || height <= 0) return []
    const unit = width / 1000
    const sceneHeight = sceneWidth * ATLAS.height / ATLAS.width
    return [{
      left: (width - sceneWidth) / 2 + artwork.offsetX * unit,
      top: height * 0.43 - sceneHeight / 2 + artwork.offsetY * unit,
      width: sceneWidth,
      depth: 1,
      delay: 0,
    }]
  }

  /**
   * Size of every pod member, from the nearest (first) to the farthest.
   *
   * The configured range maps the nearest whale to `podSizeMax` and the farthest
   * one to `podSizeMin`; a single whale keeps the nearest size.
   * @param total - number of whales in the appearance.
   * @returns one scale factor per whale, in near-to-far order.
   */
  function podScales(total: number): number[] {
    const span = Math.max(0, podSizeMax - podSizeMin)
    if (total <= 1) return [podSizeMax]
    return Array.from({ length: total }, (_, rank) => podSizeMin + span * (1 - rank / (total - 1)))
  }

  /**
   * Put one whale of the given scene width anywhere the whole drawing stays
   * on the canvas.
   * @param sceneW - scene width of this whale.
   * @returns one randomly placed scene.
   */
  function placeRandomScene(sceneW: number): WhaleScene[] {
    if (whaleBox === undefined || sceneW <= 0 || width <= 0 || height <= 0) return []
    const sceneHeight = sceneW * ATLAS.height / ATLAS.width
    const marginX = Math.max(16, width * 0.02)
    const marginTop = height * 0.08
    const marginBottom = height * 0.07
    const minLeft = marginX - whaleBox.x0 * sceneW
    const maxLeft = width - marginX - whaleBox.x1 * sceneW
    const minTop = marginTop - whaleBox.y0 * sceneHeight
    const maxTop = height - marginBottom - whaleBox.y1 * sceneHeight
    return [{
      left: maxLeft > minLeft ? minLeft + Math.random() * (maxLeft - minLeft) : (width - sceneW) / 2,
      top: maxTop > minTop ? minTop + Math.random() * (maxTop - minTop) : height * 0.43 - sceneHeight / 2,
      width: sceneW,
      depth: 1,
      delay: 0,
    }]
  }

  /**
   * Place the single whale of a random appearance that is not a pod.
   * @returns one scene anywhere the whole drawing stays inside the canvas.
   */
  function placeRandom(): WhaleScene[] {
    return placeRandomScene(sceneWidth)
  }

  /**
   * Lay out the pod at a fixed formation anchored at the artwork offsets.
   *
   * Used when the pod is enabled but the random-position switch is off: the
   * composition stays the same for every appearance, while the pod size, size
   * range, depth ink, and entrance timing still apply. One to three whales are
   * drawn, stacked from the nearest at the bottom to the farthest at the top,
   * with the outer ones drifting slightly sideways so it does not read as one
   * column.
   * @returns the scenes of the fixed pod, empty before the atlas bounds exist.
   */
  function placeFixedPod(): WhaleScene[] {
    if (whaleBox === undefined || sceneWidth <= 0 || width <= 0 || height <= 0) return []
    const box = whaleBox
    const boxWidth = Math.max(0.04, box.x1 - box.x0)
    const boxHeight = Math.max(0.05, box.y1 - box.y0)
    const aspect = ATLAS.height / ATLAS.width
    const total = podCount()
    const distanceGap = Math.max(POD_GAP_MIN, width * 0.06)
    const marginX = Math.max(16, width * 0.02)
    const marginTop = height * 0.08
    const marginBottom = height * 0.07
    const unit = width / 1000
    const anchorX = width / 2 + artwork.offsetX * unit
    const anchorY = height * 0.43 + artwork.offsetY * unit
    const scaleFactors = podScales(total)
    const depthFactors = [1, 0.62, 0.34]
    const xFactors = [0, -0.14, 0.12]
    const delays = planDelays(total)
    const widths = scaleFactors.map(scale => Math.max(150, sceneWidth * scale))
    const heights = widths.map(value => value * aspect)
    const rectHeights = heights.map(value => boxHeight * value)
    const available = Math.max(80, height - marginTop - marginBottom)
    const stackHeight = () => rectHeights.reduce((sum, value) => sum + value, 0) + distanceGap * (total - 1)
    // Shrink the whole formation uniformly when the configured sizes cannot stack.
    let fit = Math.min(1, available / Math.max(1, stackHeight()))
    for (let round = 0; round < 6 && fit < 1; round++) {
      for (let index = 0; index < total; index++) {
        widths[index] = Math.max(150, (widths[index] as number) * fit)
        heights[index] = (widths[index] as number) * aspect
        rectHeights[index] = boxHeight * (heights[index] as number)
      }
      fit = Math.min(1, available / Math.max(1, stackHeight()))
    }
    const stack = stackHeight()
    const cursor = Math.max(marginTop, Math.min(anchorY - stack / 2, height - marginBottom - stack))
    const scenes: WhaleScene[] = []
    let top = cursor
    for (let rank = total - 1; rank >= 0; rank--) {
      const sceneW = widths[rank] as number
      const sceneH = heights[rank] as number
      const rectW = boxWidth * sceneW
      const wantedLeft = anchorX + (xFactors[rank] as number) * width - rectW / 2
      const left = Math.max(marginX, Math.min(wantedLeft, width - marginX - rectW))
      scenes[rank] = {
        left: left - box.x0 * sceneW,
        top: top - box.y0 * sceneH,
        width: sceneW,
        depth: depthFactors[rank] as number,
        delay: delays[rank] as number,
      }
      top += (rectHeights[rank] as number) + distanceGap
    }
    return scenes
  }

  /**
   * Lay out the scenes for the current switches.
   *
   * A single whale follows the sliders or a random spot; an enabled pod keeps
   * working with the random-position switch off by using a fixed formation.
   * @returns the scenes of the current appearance.
   */
  function layScenes(): WhaleScene[] {
    if (!podEnabled) return randomMode ? placeRandom() : placeFromArtwork()
    return randomMode ? planPod() : placeFixedPod()
  }

  /**
   * Delay of every pod member relative to the first frame of the pod.
   * @param total - number of whales in the pod.
   * @returns all-zero delays when the pod leaps together, otherwise one
   *   distinct random start time per whale, in scene order.
   */
  function planDelays(total: number): number[] {
    if (podTiming === 'together') return new Array<number>(total).fill(0)
    const span = artwork.rippleDurationMs * 0.4
    const spacing = artwork.rippleDurationMs * 0.1
    const delays: number[] = []
    for (let index = 0; index < total; index++) {
      let delay = Math.random() * span
      // Keep the starts clearly apart, so the pod reads as separate entrances
      // instead of a near-simultaneous fallback.
      for (let attempt = 0; attempt < 20; attempt++) {
        if (delays.every((known) => Math.abs(known - delay) >= spacing)) break
        delay = Math.random() * span
      }
      delays.push(delay)
    }
    return delays
  }

  /**
   * Lay out one pod appearance.
   *
   * One to three whales are chosen at random with decreasing scale and depth.
   * The nearest whale claims the lower band of the canvas first and each farther
   * one is rejected until its measured drawing box keeps a clear gap from every
   * whale already placed, so the pod neither overlaps nor crowds. On dense
   * viewports the placement falls back to a compact vertical stack.
   * @returns the scenes to paint; empty before the atlas bounds are known.
   */
  function planPod(): WhaleScene[] {
    if (whaleBox === undefined || sceneWidth <= 0 || width <= 0 || height <= 0) return []
    const total = podCount()
    if (total === 1) return placeRandomScene(Math.max(150, sceneWidth * podSizeMax))
    const box = whaleBox
    const boxWidth = Math.max(0.04, box.x1 - box.x0)
    const boxHeight = Math.max(0.05, box.y1 - box.y0)
    const aspect = ATLAS.height / ATLAS.width
    const distanceGap = Math.max(POD_GAP_MIN, width * 0.06)
    const marginX = Math.max(16, width * 0.02)
    const marginTop = height * 0.08
    const marginBottom = height * 0.07
    // Band centers of the measured drawing box, nearest at the bottom: the depth
    // order is also the vertical order, so far whales sit above the near ones.
    const bandFactors = total === 3 ? [0.64, 0.4, 0.2] : [0.62, 0.3]
    const depthFactors = total === 3
      ? [1, 0.6 + Math.random() * 0.12, 0.3 + Math.random() * 0.14]
      : [1, 0.4 + Math.random() * 0.16]
    // Sizes walk from the user's maximum at the nearest whale to the minimum at
    // the farthest one, so the range keeps reading as one consistent depth cue.
    const scaleFactors = podScales(total)
    const delays = planDelays(total)
    const placed: { rect: PodRect; scene: WhaleScene }[] = []
    for (let index = 0; index < total; index++) {
      const sceneW = Math.max(150, sceneWidth * (scaleFactors[index] as number))
      const sceneH = sceneW * aspect
      const rectW = boxWidth * sceneW
      const rectH = boxHeight * sceneH
      const centerY = marginTop + (height - marginTop - marginBottom) * (bandFactors[index] as number)
      const scene: WhaleScene = {
        left: 0,
        top: 0,
        width: sceneW,
        depth: depthFactors[index] as number,
        delay: delays[index] as number,
      }
      let found = false
      for (let attempt = 0; attempt < 120 && !found; attempt++) {
        const centerX = marginX + rectW / 2 + Math.random() * Math.max(0, width - marginX * 2 - rectW)
        const jitterY = centerY + (Math.random() - 0.5) * height * (index === 0 ? 0.05 : 0.1)
        const rect: PodRect = {
          x0: centerX - rectW / 2,
          y0: jitterY - rectH / 2,
          x1: centerX + rectW / 2,
          y1: jitterY + rectH / 2,
        }
        if (rect.y0 < 0 || rect.y1 > height) continue
        if (!placed.every((entry) => separated(entry.rect, rect, distanceGap))) continue
        scene.left = rect.x0 - box.x0 * sceneW
        scene.top = rect.y0 - box.y0 * sceneH
        placed.push({ rect, scene })
        found = true
      }
      if (!found) {
        // Dense viewport: fall back to a compact vertical stack under the pod.
        const last = placed[placed.length - 1]
        const startY = last === undefined ? marginTop : last.rect.y1 + distanceGap
        scene.left = (width - sceneW) / 2
        scene.top = startY - box.y0 * sceneH
        placed.push({
          rect: { x0: scene.left + box.x0 * sceneW, y0: startY, x1: scene.left + box.x1 * sceneW, y1: startY + rectH },
          scene,
        })
      }
    }
    return placed.map((entry) => entry.scene)
  }

  function ensureTexture(mode: WhaleFillStyle): boolean {
    if (mode === 'pixels') return true
    const textureMode = mode as WhaleTextureMode
    if (code !== undefined && codeMode === textureMode) return true
    if (code !== undefined) {
      code.dispose()
      code = undefined
    }
    code = createCodeFill(artwork, ATLAS, textureMode)
    codeMode = textureMode
    if (code === undefined) {
      fail(new Error('Home whale texture Canvas context is unavailable'))
      return false
    }
    if (sceneWidth > 0) code.resize(canvas, sceneWidth)
    return true
  }

  function begin(): void {
    if (!moving() || !drawable()) return
    const enabled = styles.length > 0 ? styles : ['pixels', 'code'] as WhaleFillStyle[]
    const cursor = phase === 'local' ? localStyle : nextStyle
    const playing = enabled[cursor % enabled.length] as WhaleFillStyle
    if (phase === 'local') localStyle = cursor + 1
    else nextStyle = cursor + 1
    if (!ensureTexture(playing)) return
    fill = playing
    canvas.dataset.whaleFill = playing
    scenes = layScenes()
    started = performance.now()
    resume()
  }

  image.onload = () => {
    if (disposed) return
    const source = document.createElement('canvas')
    source.width = image.naturalWidth
    source.height = image.naturalHeight
    try {
      if (source.width !== ATLAS.width * ATLAS.columns
        || source.height !== ATLAS.height * Math.ceil(ATLAS.frames / ATLAS.columns)) {
        throw new Error('Home whale atlas dimensions do not match its frame geometry')
      }
      const reader = source.getContext('2d')
      if (reader === null) { fail(new Error('Home whale atlas Canvas context is unavailable')); return }
      reader.drawImage(image, 0, 0)
      pixels = reader.getImageData(0, 0, source.width, source.height).data
      whaleBox = measureWhaleBox(pixels)
      atlasCache.set(atlasUrl, pixels)
    } catch (error) {
      fail(error)
      return
    } finally {
      source.width = source.height = 0
      image.removeAttribute('src')
    }
    loading = false
    if (!wanted) return
    wanted = false
    begin()
  }
  image.onerror = () => { fail(new Error('Home whale atlas could not be decoded')) }

  function play(): void {
    if (failed || !moving() || !drawable() || started !== undefined) return
    if (pixels !== undefined) { begin(); return }
    if (loading) { wanted = true; return }
    loading = true
    wanted = true
    image.src = atlasUrl
  }

  function prefetch(): void {
    if (disposed || failed || pixels !== undefined || !moving()) return
    const cached = atlasCache.get(atlasUrl)
    if (cached !== undefined) {
      pixels = cached
      whaleBox = measureWhaleBox(cached)
      return
    }
    if (loading) return
    loading = true
    image.src = atlasUrl
  }

  function update(next: WhaleArtwork): void {
    if (disposed) return
    artwork = next
    resize()
  }

  function setFillStyles(next: WhaleFillStyle[]): void {
    const filtered = next.filter(style => style === 'pixels' || style === 'code' || style === 'glyphs' || style === 'binary' || style === 'lines')
    const normalized = filtered.length > 0 ? filtered : ['pixels'] as WhaleFillStyle[]
    if (normalized.length === styles.length && normalized.every((style, index) => style === styles[index])) return
    styles = normalized
    // The change takes effect on the next playback; end the current one so a
    // settings change swaps the painting immediately.
    if (started !== undefined) {
      started = undefined
      clear()
    }
  }

  function clearAutoTimer(): void {
    if (autoTimer !== undefined) {
      clearTimeout(autoTimer)
      autoTimer = undefined
    }
  }

  function scheduleAutoPlay(): void {
    clearAutoTimer()
    const base = autoInterval
    if (base === undefined) return
    // Random mode keeps the configured interval as the average and varies each
    // wait between half and one-and-a-half intervals, so replays never feel
    // metronomic. The helper enforces a short floor against burst firing.
    const wait = nextAutoDelay(base, autoRandom)
    autoTimer = setTimeout(() => {
      autoTimer = undefined
      if (disposed || autoInterval === undefined) return
      play()
      scheduleAutoPlay()
    }, wait)
  }

  function setAutoPlay(intervalMs: number | undefined, playNow = true, random = false): void {
    if (disposed) return
    const next = intervalMs === undefined || intervalMs <= 0 ? undefined : intervalMs
    clearAutoTimer()
    const enabling = next !== undefined && autoInterval === undefined
    autoInterval = next
    autoRandom = random
    if (next === undefined) return
    if (enabling && playNow) play()
    scheduleAutoPlay()
  }

  function setPreview(active: boolean): void {
    if (disposed) return
    const next = active ? PREVIEW_DPR_CAP : undefined
    if (dprCap === next) return
    dprCap = next
    scheduleResize()
  }

  function setRandomPosition(enabled: boolean): void {
    if (disposed || randomMode === enabled) return
    randomMode = enabled
    scenes = layScenes()
    // Toggling the switch should show the new arrangement right away instead of
    // waiting for the next automatic appearance; play() also decodes the atlas.
    if (started === undefined && moving() && drawable()) play()
    else resume()
  }

  function setPodOptions(options: WhalePodOptions): void {
    if (disposed) return
    const layoutChanged = options.enabled !== podEnabled
      || options.timing !== podTiming
      || options.sizeMin !== podSizeMin
      || options.sizeMax !== podSizeMax
    podEnabled = options.enabled
    depthInkOn = options.depthInk
    podTiming = options.timing
    podSizeMin = options.sizeMin
    podSizeMax = options.sizeMax
    if (started !== undefined && !layoutChanged) {
      // Only the ink changed: repaint the live frame without restarting the leap.
      paint(performance.now())
      return
    }
    if (started === undefined && !layoutChanged) return
    // Re-lay the pod and replay at once, so a switch change is visible now
    // instead of on the next automatic appearance.
    started = undefined
    scenes = layScenes()
    clear()
    // play() also triggers the atlas decode, so a switch flipped before the
    // first appearance still shows the new layout right away.
    if (moving() && drawable()) play()
    else resume()
  }

  const sizeObserver = new ResizeObserver(scheduleResize)
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false
    resume()
  })
  const themeObserver = new MutationObserver(scheduleResize)
  sizeObserver.observe(canvas)
  visibilityObserver.observe(canvas)
  themeObserver.observe(document.body, { attributes: true, attributeFilter: ['data-ds-dark-theme', 'style'] })
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-ds-theme-source', 'style'] })
  document.addEventListener('visibilitychange', resume)
  media.addEventListener('change', resume)
  resize()
  const dispose = (): void => {
    disposed = true
    stop()
    scenes = []
    clearAutoTimer()
    autoInterval = undefined
    cancelAnimationFrame(layoutFrame)
    layoutFrame = 0
    image.onload = image.onerror = null
    image.removeAttribute('src')
    pixels = undefined
    code?.dispose()
    code = undefined
    sizeObserver.disconnect()
    visibilityObserver.disconnect()
    themeObserver.disconnect()
    document.removeEventListener('visibilitychange', resume)
    media.removeEventListener('change', resume)
  }
  return { play, prefetch, update, setAutoPlay, setFillStyles, setPreview, setRandomPosition, setPodOptions, dispose }
}
