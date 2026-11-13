/**
 * Style the shipped running-status label from the plugin's settings.
 *
 * The label sits beside the mark but outside the slot the plugin owns, so the
 * page cannot reach it through React props. One scoped stylesheet rule carries
 * the chosen size instead. Only `font-size` changes: the status row keeps its
 * own fixed line height and padding, so a larger label never moves the layout.
 */

/** Id of the style element this module owns. */
const STYLE_ID = 'whale-leap-running-label-size'

/**
 * The label is the last span inside the status row's content wrapper, after the
 * icon span that holds the mark slot.
 */
const LABEL_SELECTOR = '[data-chat-running] > span:last-child > span:last-child'

/**
 * Install, update, or remove the running-label size rule.
 * @param px - label size in pixels; omit to restore the shipped size.
 */
export function applyRunningLabelSize(px: number | undefined): void {
  // Sans DOM (SSR render checks and headless smoke runs) there is no label to size.
  if (typeof document === 'undefined' || typeof document.getElementById !== 'function') return
  const existing = document.getElementById(STYLE_ID)
  if (px === undefined) {
    existing?.remove()
    return
  }
  const sheet = existing ?? document.createElement('style')
  if (existing === null) {
    sheet.id = STYLE_ID
    document.head.append(sheet)
  }
  sheet.textContent = `${LABEL_SELECTOR} { font-size: ${px}px; }`
}
