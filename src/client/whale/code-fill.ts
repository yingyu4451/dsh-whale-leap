/** Cached code lettering clipped by the same frames that drive the dotted whale. */
import type { WhaleArtwork } from './artwork.ts'

/**
 * The masked glyphs cover far less area than filled dots, so the lettering is
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
 * Scene width the authored font size was designed for. Lettering keeps its
 * relative weight when the scene is drawn smaller (settings preview stages) or
 * larger (wide conversation panes) by scaling the em size with this ratio.
 */
const REFERENCE_WIDTH = 1200

interface CodeFill {
  resize(canvas: HTMLCanvasElement, width: number): void
  paint(ctx: CanvasRenderingContext2D, pixels: Uint8ClampedArray, frame: number,
    left: number, top: number, width: number, level: number): void
  dispose(): void
}

/**
 * Allocate lettering and alpha canvases for one home attachment.
 * @param options - authored code phrases and font size.
 * @param atlas - bundled frame geometry; green stores opacity.
 * @returns a drawing cache, or undefined when Canvas 2D is unavailable.
 */
export function createCodeFill(
  options: WhaleArtwork, atlas: { width: number; height: number; columns: number; frames: number },
): CodeFill | undefined {
  const lettering = document.createElement('canvas')
  const mask = document.createElement('canvas')
  const ink = lettering.getContext('2d')
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

  return {
    resize(canvas: HTMLCanvasElement, width: number): void {
      const height = width * atlas.height / atlas.width
      const dpr = Math.min(devicePixelRatio, 2)
      lettering.width = Math.ceil(width * dpr)
      lettering.height = Math.ceil(height * dpr)
      ink.setTransform(dpr, 0, 0, dpr, 0, 0)
      const style = getComputedStyle(canvas)
      ink.fillStyle = style.getPropertyValue('--home-whale-code-ink')
      const size = options.fontSize * LETTERING_SCALE * (width / REFERENCE_WIDTH)
      ink.font = `${LETTERING_WEIGHT} ${size}px ${style.fontFamily}`
      ink.textBaseline = 'middle'
      let seed = 0x9e3779b9
      const random = () => {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
        return seed / 0x1_0000_0000
      }
      const words: { text: string; x: number; y: number }[] = []
      for (let y = size; y < height; y += size * LINE_STEP) {
        for (let x = -random() * size * 10; x < width;) {
          const text = options.phrases[Math.floor(random() * options.phrases.length)] as string
          const room = ink.measureText(text).width
          words.push({ text, x, y })
          x += room + size * (WORD_GAP_MIN + random() * 0.65)
        }
      }
      for (let pass = 0; pass < LETTERING_PASSES; pass++) {
        for (const word of words) {
          ink.fillText(word.text, word.x, word.y)
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
      ctx.drawImage(lettering, left, top, width, height)
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'destination-in'
      ctx.drawImage(mask, left, top, width, height)
      ctx.globalCompositeOperation = 'source-over'
    },

    dispose(): void {
      lettering.width = lettering.height = mask.width = mask.height = 0
    },
  }
}
