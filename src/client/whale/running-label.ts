/**
 * Style the shipped running-status label from the plugin's settings.
 *
 * The label sits beside the mark but outside the slot the plugin owns, so the
 * page cannot reach it through React props. One scoped stylesheet rule carries
 * the chosen size and color instead. Only `font-size` and `color` change: the
 * status row keeps its own fixed line height and padding, so a larger label
 * never moves the layout.
 */

/** Id of the style element this module owns. */
const STYLE_ID = 'whale-leap-running-label-style'

/**
 * The label is the last span inside the status row's content wrapper, after the
 * icon span that holds the mark slot.
 */
const LABEL_SELECTOR = '[data-chat-running] > span:last-child > span:last-child'

/** Label presentation the settings can change. */
export interface RunningLabelStyle {
  /** Label size in pixels. */
  size: number
  /** Custom label color; omitted follows the shipped running-status tone. */
  color?: string
}

/**
 * Install, update, or remove the running-label rule.
 * @param style - label size and optional color; omit to restore the shipped look.
 */
export function applyRunningLabelStyle(style: RunningLabelStyle | undefined): void {
  // Sans DOM (SSR render checks and headless smoke runs) there is no label to style.
  if (typeof document === 'undefined' || typeof document.getElementById !== 'function') return
  const existing = document.getElementById(STYLE_ID)
  if (style === undefined) {
    existing?.remove()
    return
  }
  const sheet = existing ?? document.createElement('style')
  if (existing === null) {
    sheet.id = STYLE_ID
    document.head.append(sheet)
  }
  const color = style.color === undefined ? '' : `; color: ${style.color}`
  sheet.textContent = `${LABEL_SELECTOR} { font-size: ${style.size}px${color}; }`
}
