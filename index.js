/**
 * Host half of the Whale leap bundle.
 *
 * Declares the durable settings schema shown under Settings › Whale leap and
 * asks the settings service to present it as a page. The browser half carries
 * its own copy of the frame atlas, so this half registers no web routes.
 */
import z from '@deepseek-ai/schemastery'
import {
  BG_OFFSET_RANGE,
  COLOR_MODES,
  CUSTOM_COLOR_PATTERN,
  DEFAULT_SETTINGS,
  DEFAULT_FILL_STYLES,
  FRAME_MODES,
  INTERVAL_RANGE,
  MARK_LABEL_SIZE_RANGE,
  MARK_MOTIONS,
  MARK_OFFSET_RANGE,
  MARK_SIZE_RANGE,
  MARK_SWING_RANGE,
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
  /** Which painting the whale shows: alternating frames, dots, lettering, or an alternate texture. */
  fillStyles: z.array(z.union([...FRAME_MODES])).min(1).default([...DEFAULT_FILL_STYLES]).volatile(),
  /** Whether the whale reappears on its own in a started conversation. */
  autoAppear: z.boolean().default(DEFAULT_SETTINGS.autoAppear).volatile(),
  /** Whether entering a conversation replays the whale at once. */
  playOnSwitch: z.boolean().default(DEFAULT_SETTINGS.playOnSwitch).volatile(),
  /** Seconds between automatic replays. */
  intervalSeconds: z.number().step(INTERVAL_RANGE.step).min(INTERVAL_RANGE.min).max(INTERVAL_RANGE.max).default(DEFAULT_SETTINGS.intervalSeconds).volatile(),
  /** Whether the plugin's fish replaces the shipped running mark. */
  replaceMark: z.boolean().default(DEFAULT_SETTINGS.replaceMark).volatile(),
  /** Background scene horizontal start offset in pixels. */
  bgOffsetX: z.number().step(BG_OFFSET_RANGE.step).min(BG_OFFSET_RANGE.min).max(BG_OFFSET_RANGE.max).default(DEFAULT_SETTINGS.bgOffsetX).volatile(),
  /** Background scene vertical start offset in pixels. */
  bgOffsetY: z.number().step(BG_OFFSET_RANGE.step).min(BG_OFFSET_RANGE.min).max(BG_OFFSET_RANGE.max).default(DEFAULT_SETTINGS.bgOffsetY).volatile(),
  /** Running mark color source: theme tone or a custom pick. */
  markColorMode: z.union([...COLOR_MODES]).default(DEFAULT_SETTINGS.markColorMode).volatile(),
  /** Lowercase custom running mark color. */
  markColor: z.string().pattern(CUSTOM_COLOR_PATTERN).default(DEFAULT_SETTINGS.markColor).volatile(),
  /** Running status label color source: theme tone or a custom pick. */
  labelColorMode: z.union([...COLOR_MODES]).default(DEFAULT_SETTINGS.labelColorMode).volatile(),
  /** Lowercase custom running status label color. */
  labelColor: z.string().pattern(CUSTOM_COLOR_PATTERN).default(DEFAULT_SETTINGS.labelColor).volatile(),
  /** Running mark size in pixels. */
  markSize: z.number().step(MARK_SIZE_RANGE.step).min(MARK_SIZE_RANGE.min).max(MARK_SIZE_RANGE.max).default(DEFAULT_SETTINGS.markSize).volatile(),
  /** Running status label size in pixels. */
  markLabelSize: z.number().step(MARK_LABEL_SIZE_RANGE.step).min(MARK_LABEL_SIZE_RANGE.min).max(MARK_LABEL_SIZE_RANGE.max).default(DEFAULT_SETTINGS.markLabelSize).volatile(),
  /** Running mark swing amplitude multiplier. */
  markSwing: z.number().step(MARK_SWING_RANGE.step).min(MARK_SWING_RANGE.min).max(MARK_SWING_RANGE.max).default(DEFAULT_SETTINGS.markSwing).volatile(),
  /** Running mark horizontal start offset in pixels. */
  markOffsetX: z.number().step(MARK_OFFSET_RANGE.step).min(MARK_OFFSET_RANGE.min).max(MARK_OFFSET_RANGE.max).default(DEFAULT_SETTINGS.markOffsetX).volatile(),
  /** Running mark vertical start offset in pixels. */
  markOffsetY: z.number().step(MARK_OFFSET_RANGE.step).min(MARK_OFFSET_RANGE.min).max(MARK_OFFSET_RANGE.max).default(DEFAULT_SETTINGS.markOffsetY).volatile(),
  /** Running mark motion preset. */
  markMotion: z.union([...MARK_MOTIONS]).default(DEFAULT_SETTINGS.markMotion).volatile(),
})

/**
 * Activate the Host half: present this plugin's settings page under its own
 * namespace. The browser half owns all rendering, including the bundled atlas.
 * @param ctx - Host plugin context.
 * @param _config - validated row config; values are read through the settings document.
 */
export function apply(ctx, _config) {
  ctx.inject(['settings'], (child) => {
    child.effect(() => child.settings.configure({ auto: false }, ctx.fiber))
  })
}
