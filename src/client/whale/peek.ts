/**
 * Temporary "watch in the conversation" mode shared by the settings page and
 * the background layer.
 *
 * The settings page hides its dialog and broadcasts this event; the conversation
 * layer then keeps the whale visible and replays it on a loop until the page
 * either restores the dialog or unmounts.
 */

/** Window event telling background layers whether preview mode is active. */
export const PEEK_EVENT = 'whale-leap:peek'

/** Window event requesting one more playback while preview mode is active. */
export const PEEK_PLAY_EVENT = 'whale-leap:peek-play'

/**
 * Minimum pause between forced replays while preview mode is active. The preview
 * replays on its own schedule, so a longer pause keeps the background canvas
 * from competing with the chat UI while the user drags controls.
 */
export const PEEK_INTERVAL_MS = 8000

/**
 * Broadcast the preview-mode state to every mounted background layer.
 * @param active - whether the conversation should keep playing the whale.
 */
export function setPeekMode(active: boolean): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent<{ active: boolean }>(PEEK_EVENT, { detail: { active } }))
}

/** Ask every mounted background layer to replay the whale once. */
export function replayPeek(): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(PEEK_PLAY_EVENT))
}
