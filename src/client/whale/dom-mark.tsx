/**
 * Mount the fish mark into the shipped running status on DSH builds that do not
 * expose the `conversation.chat.running.mark` slot.
 *
 * The app owns the status row; a client plugin cannot replace its icon through
 * React on those builds. This adapter hides the shipped tail and mounts the same
 * animated mark, rendered with its own React root, as the first child of the
 * row's content wrapper. It follows the same store snapshot as the slot path and
 * restores the shipped icon when the replacement switches off.
 */
import { type ReactElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import type { WhaleSettings } from '../settings.js'
import { WhaleMarkFish } from './WhaleMarkFish.js'

/** Marks the wrapper element this adapter mounts. */
const ROOT_ATTR = 'data-whale-leap-mark'

/** Marks the shipped icon element this adapter hides while it owns the mark. */
const HIDDEN_ATTR = 'data-whale-leap-mark-hidden'

/** The running status row the app renders. */
const ROW_SELECTOR = '[data-chat-running]'

/** Id of the style element that hides the shipped icon and inlines this adapter's wrapper. */
const STYLE_ID = 'whale-leap-dom-mark-style'

/** One mounted mark: its wrapper, React root, and the shipped icon it hides. */
interface MountedMark {
  readonly host: HTMLElement
  readonly root: Root
  readonly icon: Element
}

/** Controller shared by the plugin entry. */
export interface DomMarkController {
  /** Re-read the settings, mount, update, or remove marks as needed. */
  refresh(): void
  /** Remove every mounted mark, restore the shipped icons, and stop observing. */
  dispose(): void
}

/** Read the settings the mark should use, or `undefined` when it should not run. */
type ReadSettings = () => WhaleSettings | undefined

/**
 * Create and immediately install the DOM mark adapter.
 * @param read - settings reader; returns `undefined` while the replacement is off or the slot owns the mark.
 * @returns controller used to refresh and dispose the adapter.
 */
export function installDomMark(read: ReadSettings): DomMarkController {
  // Sans DOM (SSR render checks and headless smoke runs) there is nothing to mount.
  if (typeof document === 'undefined' || typeof document.createElement !== 'function'
    || typeof MutationObserver !== 'function' || typeof document.body === 'undefined') {
    return { refresh: () => {}, dispose: () => {} }
  }
  const mounted = new Map<HTMLElement, MountedMark>()
  let disposed = false
  let scheduled = false

  const clearMounted = (assigned: MountedMark): void => {
    assigned.host.remove()
    assigned.icon.removeAttribute(HIDDEN_ATTR)
    try {
      assigned.root.unmount()
    } catch (_error) {
      // The row was already torn down by the app; nothing left to unmount.
    }
  }

  const clearAll = (): void => {
    for (const assigned of mounted.values()) clearMounted(assigned)
    mounted.clear()
  }

  const markElement = (settings: WhaleSettings): ReactElement => (
    <WhaleMarkFish
      size={settings.markSize}
      motion={settings.markMotion}
      swing={settings.markSwing}
      offsetX={settings.markOffsetX}
      offsetY={settings.markOffsetY}
      color={settings.markColorMode === 'custom' ? settings.markColor : undefined}
    />
  )

  /** Mount into one row's content wrapper unless the row already carries a mark. */
  const mount = (content: HTMLElement, settings: WhaleSettings): MountedMark | undefined => {
    const icon = content.firstElementChild
    if (icon === null || icon.hasAttribute(HIDDEN_ATTR)) return undefined
    const style = document.getElementById(STYLE_ID) ?? document.createElement('style')
    if (style.id !== STYLE_ID) {
      style.id = STYLE_ID
      style.textContent = `[${HIDDEN_ATTR}] { display: none !important; }\n[${ROOT_ATTR}] { display: inline-flex; align-items: center; }`
      document.head.append(style)
    }
    const host = document.createElement('span')
    host.setAttribute(ROOT_ATTR, '')
    host.setAttribute('aria-hidden', 'true')
    icon.setAttribute(HIDDEN_ATTR, '')
    content.insertBefore(host, icon)
    const root = createRoot(host)
    root.render(markElement(settings))
    return { host, root, icon }
  }

  const scan = (): void => {
    if (disposed) return
    const settings = read()
    if (settings === undefined) {
      clearAll()
      return
    }
    for (const row of document.querySelectorAll(ROW_SELECTOR)) {
      const content = row.lastElementChild
      if (!(content instanceof HTMLElement)) continue
      const existing = mounted.get(content)
      if (existing !== undefined) {
        if (existing.host.isConnected) {
          existing.root.render(markElement(settings))
          continue
        }
        clearMounted(existing)
        mounted.delete(content)
      }
      const assigned = mount(content, settings)
      if (assigned !== undefined) mounted.set(content, assigned)
    }
    for (const [content, assigned] of mounted) {
      if (content.isConnected) continue
      clearMounted(assigned)
      mounted.delete(content)
    }
  }

  const schedule = (): void => {
    if (scheduled || disposed) return
    scheduled = true
    const run = (): void => {
      scheduled = false
      scan()
    }
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(run)
    else setTimeout(run, 16)
  }

  const observer = new MutationObserver(schedule)
  observer.observe(document.body, { childList: true, subtree: true })
  scan()

  return {
    refresh: schedule,
    dispose: () => {
      disposed = true
      observer.disconnect()
      clearAll()
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
