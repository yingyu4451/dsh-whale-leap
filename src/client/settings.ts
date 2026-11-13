/**
 * Browser-side view of the durable settings section.
 *
 * Values and bounds come from the shared module the Host schema also reads, so
 * the form and the renderer cannot drift apart. The Host validates writes; this
 * module only names them.
 */
import { DEFAULT_SETTINGS } from '../../shared/settings.js'

/** Ink source: the theme's text tone, or a user-picked color. */
export type WhaleColorMode = 'theme' | 'custom'

/** Painting the whale shows: alternating frames, dots, or code lettering. */
export type WhaleFrameMode = 'alternate' | 'pixels' | 'code' | 'glyphs' | 'binary' | 'lines'

/** Running-mark motion presets. */
export type WhaleMarkMotion = 'swim' | 'explore' | 'hero' | 'sway'

/** Durable settings section of the plugin. */
export interface WhaleSettings {
  /** Ink source. */
  colorMode: WhaleColorMode
  /** Lowercase custom ink color. */
  customColor: string
  /** Background scene size multiplier. */
  size: number
  /** Ink strength response; the renderer squares it against a design gain. */
  opacity: number
  /** Painting the whale shows: alternating frames, dots, or code lettering. */
  frameMode: WhaleFrameMode
  /** Whether the whale reappears on its own in a started conversation. */
  autoAppear: boolean
  /** Whether entering a conversation replays the whale at once. */
  playOnSwitch: boolean
  /** Seconds between automatic replays. */
  intervalSeconds: number
  /** Whether the plugin's fish replaces the shipped running mark. */
  replaceMark: boolean
  /** Background scene horizontal start offset in pixels. */
  bgOffsetX: number
  /** Background scene vertical start offset in pixels. */
  bgOffsetY: number
  /** Running mark color source. */
  markColorMode: WhaleColorMode
  /** Lowercase custom running mark color. */
  markColor: string
  /** Running status label color source. */
  labelColorMode: WhaleColorMode
  /** Lowercase custom running status label color. */
  labelColor: string
  /** Running mark size in pixels. */
  markSize: number
  /** Running status label size in pixels. */
  markLabelSize: number
  /** Running mark horizontal swing amplitude multiplier. */
  markSwing: number
  /** Running mark horizontal start offset in pixels. */
  markOffsetX: number
  /** Running mark vertical start offset in pixels. */
  markOffsetY: number
  /** Running mark motion preset. */
  markMotion: WhaleMarkMotion
}

/** Live settings plus whether the durable document accepts writes. */
export interface WhaleSettingsState extends WhaleSettings {
  /** False while the settings document is read-only. */
  writable: boolean
}

/** Initial store value before the settings document resolves. */
export const INITIAL_SETTINGS: WhaleSettingsState = { ...DEFAULT_SETTINGS, writable: false }
