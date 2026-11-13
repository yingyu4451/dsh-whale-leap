/** Cached glyph textures clipped by the same frames that drive the dotted whale. */
import type { WhaleArtwork } from './artwork.ts'

/**
 * The masked glyphs cover far less area than filled dots, so the textures are
 * drawn heavier and denser to read as dark as the dotted fill at the same ink
 * strength. The mask is also lifted because most atlas cells are faint.
 */
const LETTERING_SCALE = 1.43
const LETTERING_WEIGHT = 700
const LETTERING_PASSES = 3
const LINE_STEP = 1
const WORD_GAP_MIN = 0.1
const MASK_GAIN = 2.2

/**
 * Scene width the authored font size was designed for. Textures keeps their
 * relative weight when the scene is drawn smaller (settings preview stages) or
 * larger (wide conversation panes) by scaling the em size with this ratio.
 */
const REFERENCE_WIDTH = 1200

/** Textures that the whale can paint instead of dots. */
export type WhaleTextureMode = 'code' | 'glyphs' | 'binary' | 'lines'

/** Character pool for the ASCII-style texture. */
const GLYPHS = '01<>[]{}/\\|+=*#@%&$'

/** Token pool for the binary texture. */
const BINARY_TOKENS = ['0', '1', '01', '10', '101', '010']

/** Per-texture glyph metrics: size multiplier, weight, passes, and row/gap rhythm. */
const TEXTURES: Record<Exclude<WhaleTextureMode, 'lines'>, {
  scale: number
  weight: number
  passes: number
  lineStep: number
  gapMin: number
  gapRand: number
}> = {
  code: { scale: LETTERING_SCALE, weight: LETTERING_WEIGHT, passes: LETTERING_PASSES, lineStep: LINE_STEP, gapMin: WORD_GAP_MIN, gapRand: 0.65 },
  glyphs: { scale: 1.15, weight: 600, passes: 3, lineStep: 1, gapMin: 0.04, gapRand: 0.22 },
  binary: { scale: 1.05, weight: 600, passes: 3, lineStep: 1.05, gapMin: 0.3, gapRand: 0.6 },
}

interface CodeFill {
  resize(canvas: HTMLCanvasElement, width: number): void
  paint(ctx: CanvasRenderingContext2D, pixels: Uint8ClampedArray, frame: number,
    left: number, top: number, width: number, level: number): void
  dispose(): void
}

/**
 * Allocate one texture and its alpha matte for a home attachment.
 * @param options - authored labels, ink color, and font size.
 * @param atlas - bundled frame geometry; green stores opacity.
 * @param mode - texture to draw: code lines, ASCII glyphs, binary tokens, or hatching.
 * @returns a drawing cache, or undefined when Canvas 2D is unavailable.
 */
export function createCodeFill(
  options: WhaleArtwork, atlas: { width: number; height: number; columns: number; frames: number },
  mode: WhaleTextureMode,
): CodeFill | undefined {
  const texture = document.createElement('canvas')
  const mask = document.createElement('canvas')
  const ink = texture.getContext('2d')
  const matte = mask.getContext('2d')
  if (ink === null || matte === null) return undefined
  mask.width = atlas.width
  mask.height = atlas.height
  const alpha = matte.createImageData(atlas.width, atlas.height)
  const stride = atlas.width * atlas.columns

  function opacity(pixels: Uint8ClampedArray, frame: number, x: number, y: number): number {
    const offsetX = (frame % atlas.columns) * atlas.width
    const offsetY = Math.floor(frame / atlas.columns) * atlas.height
    return pixels[((offsetY + y) * stride + offsetX + x) * 4 + 1] as number
  }

  function randomFactory(): () => number {
    let seed = 0x9e3779b9
    return () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
      return seed / 0x1_0000_0000
    }
  }

  return {
    resize(canvas: HTMLCanvasElement, width: number): void {
      const height = width * atlas.height / atlas.width
      const dpr = Math.min(devicePixelRatio, 2)
      texture.width = Math.ceil(width * dpr)
      texture.height = Math.ceil(height * dpr)
      ink.setTransform(dpr, 0, 0, dpr, 0, 0)
      const style = getComputedStyle(canvas)
      const color = style.getPropertyValue('--home-whale-code-ink')
      ink.fillStyle = color
      ink.strokeStyle = color
      const random = randomFactory()
      if (mode === 'lines') {
        // Diagonal hatching reads as engraved contour lines once the frame matte clips it.
        const size = options.fontSize * (width / REFERENCE_WIDTH)
        const gap = Math.max(6, size * 2.2)
        ink.lineWidth = Math.max(1, size * 0.22)
        ink.lineCap = 'round'
        ink.beginPath()
        for (let start = -height; start < width + height; start += gap) {
          ink.moveTo(start, 0)
          ink.lineTo(start + height, height)
        }
        ink.stroke()
        return
      }
      const metrics = TEXTURES[mode]
      const size = options.fontSize * metrics.scale * (width / REFERENCE_WIDTH)
      ink.font = `${metrics.weight} ${size}px ${style.fontFamily}`
      ink.textBaseline = 'middle'
      const rows: { text: string; x: number; y: number }[] = []
      for (let y = size; y < height; y += size * metrics.lineStep) {
        for (let x = -random() * size * 8; x < width;) {
          const text = mode === 'code'
            ? options.phrases[Math.floor(random() * options.phrases.length)] as string
            : mode === 'binary'
              ? BINARY_TOKENS[Math.floor(random() * BINARY_TOKENS.length)] as string
              : GLYPHS[Math.floor(random() * GLYPHS.length)] as string
          const room = ink.measureText(text).width
          rows.push({ text, x, y })
          x += room + size * (metrics.gapMin + random() * metrics.gapRand)
        }
      }
      for (let pass = 0; pass < metrics.passes; pass++) {
        for (const row of rows) {
          ink.fillText(row.text, row.x, row.y)
        }
      }
      ink.globalAlpha = 1
    },

    paint(ctx: CanvasRenderingContext2D, pixels: Uint8ClampedArray, frame: number,
      left: number, top: number, width: number, level: number): void {
      for (let y = 0; y < atlas.height; y++) {
        for (let x = 0; x < atlas.width; x++) {
          alpha.data[(y * atlas.width + x) * 4 + 3] = Math.min(255, opacity(pixels, frame, x, y) * MASK_GAIN)
        }
      }
      matte.putImageData(alpha, 0, 0)
      const height = width * atlas.height / atlas.width
      ctx.globalAlpha = level
      ctx.drawImage(texture, left, top, width, height)
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'destination-in'
      ctx.drawImage(mask, left, top, width, height)
      ctx.globalCompositeOperation = 'source-over'
    },

    dispose(): void {
      texture.width = texture.height = mask.width = mask.height = 0
    },
  }
}
