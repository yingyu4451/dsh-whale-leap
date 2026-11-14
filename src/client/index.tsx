/**
 * Browser entry of the whale-leap plugin.
 *
 * Registers three things with the running app: the background whale on the
 * conversation frame, the fish mark left of the running status, and the settings
 * page. Every registration shares one settings runtime so the page and the
 * artwork never disagree.
 */
import { DICTIONARIES } from './i18n.js'
import { SettingsPage, type SettingsPageActions } from './settings/SettingsPage.js'
import { installDomMark } from './whale/dom-mark.js'
import { RunningMark } from './whale/RunningMark.js'
import { applyRunningLabelStyle } from './whale/running-label.js'
import { WhaleLayer } from './whale/WhaleLayer.js'
import { WhaleSettingsRuntime, type RuntimeContextLike, type SettingsFormLike } from './store.js'
import { SETTINGS_NAMESPACE } from '../../shared/settings.js'
import type { LocaleKey } from './i18n.js'

/** Locale namespace of the visible strings. */
const LOCALE_NS = 'settings.whaleLeap'

/** Slots the plugin fills. */
export const inject = ['slots', 'locale', 'configForms']

/** Settings section key used by the app registry. */
interface ClientLocale {
  register(ns: string, dictionaries: Record<string, Record<string, string>>): () => void
  bind(ns: string): (key: LocaleKey, params?: Record<string, unknown>) => string
}

/** Slots service slice. */
interface ClientSlots {
  inject(name: string, factory: () => unknown): () => void
  register(options: Record<string, unknown>, component: unknown): unknown
}

/** Client context slice used here. */
interface ClientContext extends RuntimeContextLike {
  configForms: { get(id: string): SettingsFormLike }
  locale: ClientLocale
  slots: ClientSlots
}

/** Bridge the runtime setters to the settings page actions. */
function pageActions(runtime: WhaleSettingsRuntime): SettingsPageActions {
  return {
    setColorMode: mode => {
      runtime.setColorMode(mode)
    },
    setCustomColor: color => {
      runtime.setCustomColor(color)
    },
    setSize: size => {
      runtime.setSize(size)
    },
    setOpacity: opacity => {
      runtime.setOpacity(opacity)
    },
    setFillStyle: (style, enabled) => {
      runtime.setFillStyle(style, enabled)
    },
    setAutoAppear: enabled => {
      runtime.setAutoAppear(enabled)
    },
    setPlayOnSwitch: enabled => {
      runtime.setPlayOnSwitch(enabled)
    },
    setInterval: seconds => {
      runtime.setInterval(seconds)
    },
    setReplaceMark: enabled => {
      runtime.setReplaceMark(enabled)
    },
    setBgOffsetX: px => {
      runtime.setBgOffsetX(px)
    },
    setBgOffsetY: px => {
      runtime.setBgOffsetY(px)
    },
    setMarkColorMode: mode => {
      runtime.setMarkColorMode(mode)
    },
    setMarkColor: color => {
      runtime.setMarkColor(color)
    },
    setLabelColorMode: mode => {
      runtime.setLabelColorMode(mode)
    },
    setLabelColor: color => {
      runtime.setLabelColor(color)
    },
    setMarkSize: px => {
      runtime.setMarkSize(px)
    },
    setMarkLabelSize: px => {
      runtime.setMarkLabelSize(px)
    },
    setMarkSwing: amplitude => {
      runtime.setMarkSwing(amplitude)
    },
    setMarkOffsetX: px => {
      runtime.setMarkOffsetX(px)
    },
    setMarkOffsetY: px => {
      runtime.setMarkOffsetY(px)
    },
    setMarkMotion: motion => {
      runtime.setMarkMotion(motion)
    },
  }
}

/**
 * Register the plugin.
 * @param ctx - client context.
 */
export function apply(ctx: ClientContext): void {
  const runtime = new WhaleSettingsRuntime(ctx, ctx.configForms.get(SETTINGS_NAMESPACE))
  const state = (): { state: WhaleSettingsRuntime['store'] } => ({ state: runtime.store })
  const actions = pageActions(runtime)

  ctx.effect(() => ctx.locale.register(LOCALE_NS, DICTIONARIES), 'whale-leap: dictionaries')

  ctx.slots.inject('conversation.hero.frame', () =>
    ctx.slots.register({ name: 'conversation.hero.frame', id: 'whale-leap', inject: state }, WhaleLayer),
  )

  // The mark slot is filled only while the switch is on; disposing the
  // registration hands the slot back to the shipped whale tail.
  let releaseMark: (() => void) | undefined
  // True once the app exposes (and the plugin fills) the running-mark slot.
  let slotOwned = false
  // Builds without that slot keep the shipped icon in the row; the adapter then
  // mounts the same mark through its own React root. It stays inert when the
  // slot owns the mark, so the two paths never render twice.
  const domMark = installDomMark(() => {
    if (slotOwned) return undefined
    const snapshot = runtime.store.getSnapshot()
    return snapshot.replaceMark ? snapshot : undefined
  })
  const syncMark = (): void => {
    const enabled = runtime.store.getSnapshot().replaceMark
    if (enabled && releaseMark === undefined) {
      releaseMark = ctx.slots.inject('conversation.chat.running.mark', () => {
        slotOwned = true
        domMark.refresh()
        return ctx.slots.register(
          { name: 'conversation.chat.running.mark', id: 'whale-leap', inject: state },
          RunningMark,
        )
      })
    } else if (!enabled && releaseMark !== undefined) {
      releaseMark()
      releaseMark = undefined
      slotOwned = false
    }
    domMark.refresh()
  }
  ctx.effect(() => {
    const stopWatching = runtime.store.subscribe(syncMark)
    syncMark()
    return () => {
      stopWatching()
      releaseMark?.()
      releaseMark = undefined
      slotOwned = false
      domMark.dispose()
    }
  }, 'whale-leap: running mark registration')

  // The label beside the mark belongs to the running status, not to the slot,
  // so it is styled through one scoped rule that follows the same switch.
  ctx.effect(() => {
    const syncLabel = (): void => {
      const snapshot = runtime.store.getSnapshot()
      if (!snapshot.replaceMark) {
        applyRunningLabelStyle(undefined)
        return
      }
      applyRunningLabelStyle({
        size: snapshot.markLabelSize,
        color: snapshot.labelColorMode === 'custom' ? snapshot.labelColor : undefined,
      })
    }
    const stopWatching = runtime.store.subscribe(syncLabel)
    syncLabel()
    return () => {
      stopWatching()
      applyRunningLabelStyle(undefined)
    }
  }, 'whale-leap: running label style')

  ctx.slots.inject('settings.section', () =>
    ctx.slots.register(
      {
        name: 'settings.section',
        id: 'whale-leap',
        order: 30,
        label: () => ctx.locale.bind(LOCALE_NS)('nav'),
        locale: LOCALE_NS,
        inject: () => ({ state: runtime.store, actions }),
      },
      SettingsPage,
    ),
  )
}
