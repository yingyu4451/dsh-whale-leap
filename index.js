/**
 * Host half of the Whale leap bundle.
 *
 * Declares the durable settings schema shown under Settings › Whale leap and
 * asks the settings service to present it as a page. The browser half owns every
 * visual and reads the section through the mirrored config form.
 */
import z from '@deepseek-ai/schemastery'
import {
  COLOR_MODES,
  CUSTOM_COLOR_PATTERN,
  DEFAULT_SETTINGS,
  INTERVAL_RANGE,
  MARK_MOTIONS,
  MARK_SIZE_RANGE,
  OPACITY_RANGE,
  SIZE_RANGE,
} from './shared/settings.js'

/**
 * Host-side configuration shape; every field is live so edits apply without a
 * page reload.
 */
export const Config = z.object({
  /** Ink source: theme text tone or a custom pick. */
  colorMode: z.union([...COLOR_MODES]).default(DEFAULT_SETTINGS.colorMode).volatile(),
  /** Lowercase custom ink color. */
  customColor: z.string().pattern(CUSTOM_COLOR_PATTERN).default(DEFAULT_SETTINGS.customColor).volatile(),
  /** Background scene size multiplier. */
  size: z.number().step(SIZE_RANGE.step).min(SIZE_RANGE.min).max(SIZE_RANGE.max).default(DEFAULT_SETTINGS.size).volatile(),
  /** Ink strength response; the renderer squares it against a design gain. */
  opacity: z.number().step(OPACITY_RANGE.step).min(OPACITY_RANGE.min).max(OPACITY_RANGE.max).default(DEFAULT_SETTINGS.opacity).volatile(),
  /** Whether the whale reappears on its own in a started conversation. */
  autoAppear: z.boolean().default(DEFAULT_SETTINGS.autoAppear).volatile(),
  /** Whether entering a conversation replays the whale at once. */
  playOnSwitch: z.boolean().default(DEFAULT_SETTINGS.playOnSwitch).volatile(),
  /** Seconds between automatic replays. */
  intervalSeconds: z.number().step(INTERVAL_RANGE.step).min(INTERVAL_RANGE.min).max(INTERVAL_RANGE.max).default(DEFAULT_SETTINGS.intervalSeconds).volatile(),
  /** Running mark size in pixels. */
  markSize: z.number().step(MARK_SIZE_RANGE.step).min(MARK_SIZE_RANGE.min).max(MARK_SIZE_RANGE.max).default(DEFAULT_SETTINGS.markSize).volatile(),
  /** Running mark motion preset. */
  markMotion: z.union([...MARK_MOTIONS]).default(DEFAULT_SETTINGS.markMotion).volatile(),
})

/**
 * Activate the Host half: present this plugin's settings page under its own
 * namespace.
 * @param ctx - Host plugin context.
 * @param _config - validated row config; values are read through the settings document.
 */
export function apply(ctx, _config) {
  ctx.inject(['settings'], (child) => {
    child.effect(() => child.settings.configure({ auto: false }, ctx.fiber))
  })
}
