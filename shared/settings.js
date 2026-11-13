/**
 * Durable settings section shared by the Host schema and the browser runtime.
 *
 * The module stays free of schemastery imports: the Host validates the section,
 * while the browser only mirrors typed values through the settings service.
 */

/** Settings section namespace; equals the bundle row id declared in the Loader patch. */
export const SETTINGS_NAMESPACE = 'whale-leap'

/** Field holding the whale ink source: theme tone or a user color. */
export const COLOR_MODE_FIELD = 'colorMode'

/** Field holding the lowercase custom ink color. */
export const CUSTOM_COLOR_FIELD = 'customColor'

/** Field holding the background scene size multiplier. */
export const SIZE_FIELD = 'size'

/** Field holding the ink strength response. */
export const OPACITY_FIELD = 'opacity'

/** Field holding whether the whale reappears on its own in a started conversation. */
export const AUTO_APPEAR_FIELD = 'autoAppear'

/** Field holding whether entering a conversation replays the whale at once. */
export const PLAY_ON_SWITCH_FIELD = 'playOnSwitch'

/** Field holding seconds between automatic replays. */
export const INTERVAL_FIELD = 'intervalSeconds'

/** Field holding the running mark size in pixels. */
export const MARK_SIZE_FIELD = 'markSize'

/** Field holding the running mark motion preset. */
export const MARK_MOTION_FIELD = 'markMotion'

/** Ink source choices. */
export const COLOR_MODES = ['theme', 'custom']

/** Background size multiplier bounds. */
export const SIZE_RANGE = { min: 0.5, max: 1.5, step: 0.05 }

/** Ink strength bounds; the renderer squares the value against a design gain. */
export const OPACITY_RANGE = { min: 0.1, max: 1, step: 0.05 }

/** Auto-replay interval bounds in seconds. */
export const INTERVAL_RANGE = { min: 5, max: 300, step: 5 }

/** Running mark size bounds in pixels. */
export const MARK_SIZE_RANGE = { min: 8, max: 28, step: 1 }

/** Accepted running-mark motion presets, in display order. */
export const MARK_MOTIONS = ['swim', 'explore', 'hero', 'sway']

/** Accepted lowercase custom colors. */
export const CUSTOM_COLOR_PATTERN = /^#[0-9a-f]{6}$/

/** Factory defaults for every section field. */
export const DEFAULT_SETTINGS = {
  colorMode: 'theme',
  customColor: '#7d9bff',
  size: 1,
  opacity: 0.6,
  autoAppear: false,
  playOnSwitch: true,
  intervalSeconds: 30,
  markSize: 14,
  markMotion: 'swim',
}
