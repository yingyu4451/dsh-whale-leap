/**
 * Runtime shell detection.
 *
 * The plugin runs in the shared Web UI, which is served either by `dsh web` or
 * by the DSH desktop shell (Electron). The two shells need different wording
 * when an update asks for a restart, so the settings page reads this helper.
 *
 * The desktop preload exposes `window.dshDesktop` on every page it owns and
 * marks `<html data-platform>`; plain `dsh web` sets neither.
 */

/** True when the page is hosted by the DSH desktop shell rather than `dsh web`. */
export function isDesktopShell(): boolean {
  if (typeof window === 'undefined') return false
  const desktop = (window as { dshDesktop?: unknown }).dshDesktop
  if (desktop !== undefined && desktop !== null) return true
  if (typeof document === 'undefined') return false
  return document.documentElement.dataset.platform !== undefined
}
