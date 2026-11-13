/** Alternating dot and code breaches sharing one bundled animation atlas. */
import type { WhaleArtwork } from './artwork.ts'
import { createCodeFill, type WhaleTextureMode } from './code-fill.ts'

// Geometry of assets/breach-atlas.webp: 137 frames at 192 × 108 cells, in twelve columns.
const ATLAS = { width: 192, height: 108, columns: 12, frames: 137 } as const

/** Ink response: the squared strength keeps the authored default subtle while the top of the range turns faint dots solid. */
const INK_GAIN = 1.5

/** Decoded atlas pixels per URL, so a remount reuses the one expensive decode. */
const atlasCache = new Map<string, Uint8ClampedArray>()

/**
 * Phase of the next playback, shared across renderer attachments.
 *
 * Each conversation switch mounts a new decoration; a per-attachment phase
 * would make every switch start on the same fill. Keeping it module-wide lets
 * consecutive appearances alternate between dots and code frames.
 */
let nextFill: 'pixels' | 'code' = 'pixels'

/** Playback phase source: the whole page, or this attachment only. */
export type WhaleFillPhase = 'shared' | 'local'

/** Which painting the whale should show: alternate frames, dots, or code lettering. */
export type WhaleFrameMode = 'alternate' | 'pixels' | 'code' | 'glyphs' | 'binary' | 'lines'

/**
 * Backing-store budget. Large / high-DPI windows would otherwise allocate and
 * composite tens of megabytes of transparent canvas for sparse dots; the
 * decoration caps the buffer instead and keeps the CSS box unchanged.
 */
const MAX_CANVAS_PIXELS = 5_000_000

/** Forget cached atlas decodes; tests use this to keep each atlas load observable. */
export function clearAtlasCache(): void {
  atlasCache.clear()
}

/** Control of one attached whale decoration. */
export interface PixelWhaleHandle {
  /** Request one playback; ignored while playing, failed, hidden, or under reduced motion. */
  play: () => void
  /** Decode the atlas ahead of the first replay, so switching conversations does not pay for it. */
  prefetch: () => void
  /** Swap the artwork (scale and ink opacity) and repaint without re-decoding the atlas. */
  update: (options: WhaleArtwork) => void
  /** Force the dots or code painting, or resume alternating between them. */
  setFrameMode: (mode: WhaleFrameMode) => void
  /**
   * Enable or disable time-driven replays.
   * @param intervalMs - delay between replays, or undefined to stop them.
   * @param playNow - whether enabling also replays once immediately.
   */
  setAutoPlay: (intervalMs: number | undefined, playNow?: boolean) => void
  /** Release frame work, atlas pixels, and observers; late atlas loads are ignored. */
  dispose: () => void
}

const NO_WHALE: PixelWhaleHandle = {
  play: () => {},
  prefetch: () => {},
  update: () => {},
  setFrameMode: () => {},
  setAutoPlay: () => {},
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
  let left = 0
  let top = 0
  let fill: WhaleFrameMode = 'code'
  let localFill: 'pixels' | 'code' = 'pixels'
  let frameMode: WhaleFrameMode = 'alternate'
  let code: ReturnType<typeof createCodeFill> | undefined
  let codeMode: WhaleTextureMode | undefined
  let autoInterval: number | undefined
  let autoTimer: ReturnType<typeof setInterval> | undefined

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

  function paint(now: number): void {
    clear()
    if (pixels === undefined || started === undefined) return
    const progress = (now - started) / artwork.rippleDurationMs
    if (progress >= 1) {
      started = undefined
      return
    }
    const index = Math.floor(progress * ATLAS.frames)
    const offsetX = (index % ATLAS.columns) * ATLAS.width
    const offsetY = Math.floor(index / ATLAS.columns) * ATLAS.height
    const stride = ATLAS.width * ATLAS.columns
    const cell = sceneWidth / ATLAS.width
    const fade = Math.min(1, progress * 15, (1 - progress) * 10)
    if (fill !== 'pixels' && code !== undefined) {
      // The code fill boosts its own coverage and mask, so the strength maps
      // linearly here; the dotted fill squares it to keep the same response.
      code.paint(ctx, pixels, index, left, top, sceneWidth, artwork.activeOpacity * fade)
      return
    }
    for (let y = 0; y < ATLAS.height; y++) {
      for (let x = 0; x < ATLAS.width; x++) {
        const offset = ((offsetY + y) * stride + offsetX + x) * 4
        const alpha = (pixels[offset + 1] as number) / 255
        if (alpha < 0.015) continue
        ctx.globalAlpha = Math.min(1, alpha * artwork.activeOpacity * artwork.activeOpacity * INK_GAIN * fade)
        ctx.beginPath()
        ctx.arc(left + (x + 0.5) * cell, top + (y + 0.5) * cell, (pixels[offset] as number) / 255 * cell, 0, Math.PI * 2)
        ctx.fill()
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
    const requested = Math.min(devicePixelRatio, 2)
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
      && nextSceneWidth === sceneWidth && nextOffsetX === lastOffsetX && nextOffsetY === lastOffsetY) return
    lastColor = nextColor
    lastWidth = width
    lastHeight = height
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
    const sceneHeight = sceneWidth * ATLAS.height / ATLAS.width
    left = (width - sceneWidth) / 2 + nextOffsetX
    top = height * 0.43 - sceneHeight / 2 + nextOffsetY
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

  function ensureTexture(mode: WhaleFrameMode): boolean {
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
    const playing = frameMode === 'alternate' ? (phase === 'local' ? localFill : nextFill) : frameMode
    if (frameMode === 'alternate') {
      if (phase === 'local') localFill = playing === 'pixels' ? 'code' : 'pixels'
      else nextFill = playing === 'pixels' ? 'code' : 'pixels'
    }
    if (!ensureTexture(playing)) return
    fill = playing
    canvas.dataset.whaleFill = playing
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
    if (cached !== undefined) { pixels = cached; return }
    if (loading) return
    loading = true
    image.src = atlasUrl
  }

  function update(next: WhaleArtwork): void {
    if (disposed) return
    artwork = next
    resize()
  }

  function setFrameMode(mode: WhaleFrameMode): void {
    if (frameMode === mode) return
    frameMode = mode
    // A forced texture only takes effect on the next playback; end the current
    // one so a settings change swaps the painting immediately.
    if (started !== undefined) {
      started = undefined
      clear()
    }
  }

  function setAutoPlay(intervalMs: number | undefined, playNow = true): void {
    if (disposed) return
    const next = intervalMs === undefined || intervalMs <= 0 ? undefined : intervalMs
    if (autoTimer !== undefined) {
      clearInterval(autoTimer)
      autoTimer = undefined
    }
    const enabling = next !== undefined && autoInterval === undefined
    autoInterval = next
    if (next === undefined) return
    if (enabling && playNow) play()
    autoTimer = setInterval(play, next)
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
    if (autoTimer !== undefined) {
      clearInterval(autoTimer)
      autoTimer = undefined
    }
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
  return { play, prefetch, update, setAutoPlay, setFrameMode, dispose }
}
