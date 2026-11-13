/** Artwork choices for the official home whale. */

/** Visual parameters shared by the dot and code fills. */
export interface WhaleArtwork {
  /**
   * Ink strength response, multiplied by each frame's water and highlight
   * attenuation; the renderer squares it against a design gain.
   */
  activeOpacity: number
  /** Word size in CSS pixels. */
  fontSize: number
  /** Authored artwork content, drawn verbatim as complete terms or sentences. */
  phrases: readonly string[]
  /** Maximum canvas redraw frequency. */
  frameRate: number
  /** One click's total lifetime in milliseconds. */
  rippleDurationMs: number
  /** Drawing-area multiplier, applied to the authored scene size. */
  scale: number
  /** Horizontal start offset in CSS pixels, measured against a 1000 px wide scene. */
  offsetX: number
  /** Vertical start offset in CSS pixels, measured against a 1000 px wide scene. */
  offsetY: number
}

/** The authored artwork. Opacity and scale are user settings; the rest is part of the design. */
export const WHALE_ARTWORK: WhaleArtwork = {
  activeOpacity: 0.65,
  fontSize: 7,
  phrases: [
    '// Everything is a plugin', 'ctx.plugin(Agent)', 'await agent.run()',
    'ctx.on("turn/end", next)', 'const tools = ctx.tools', 'await session.append(event)',
    'return next()', 'ctx.effect(() => dispose)', 'const { skills } = ctx',
    'yield tool.result', 'type Context = Harness', 'MCP.connect()',
    'useSession()', 'const workspace = cwd', 'await runtime.start()', '// Creator Mode',
  ],
  frameRate: 24,
  rippleDurationMs: 5700,
  scale: 1,
  offsetX: 0,
  offsetY: 0,
}
