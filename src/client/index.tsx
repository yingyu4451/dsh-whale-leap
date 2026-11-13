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
import { RunningMark } from './whale/RunningMark.js'
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
  inject(name: string, factory: () => unknown): void
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
    setAutoAppear: enabled => {
      runtime.setAutoAppear(enabled)
    },
    setPlayOnSwitch: enabled => {
      runtime.setPlayOnSwitch(enabled)
    },
    setInterval: seconds => {
      runtime.setInterval(seconds)
    },
    setMarkSize: px => {
      runtime.setMarkSize(px)
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

  ctx.slots.inject('conversation.chat.running.mark', () =>
    ctx.slots.register({ name: 'conversation.chat.running.mark', id: 'whale-leap', inject: state }, RunningMark),
  )

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
