/**
 * Render smoke check entry: renders every plugin component to static markup.
 *
 * Effects and refs do not run during server rendering, which is exactly the
 * shape we want: a crash here means the component tree itself is broken. The
 * page and the live preview are rendered twice — with the authored Chinese
 * dictionary and with the English dictionary — so the check proves both locales
 * produce real copy.
 */
import { renderToStaticMarkup } from 'react-dom/server'
import { DEFAULT_SETTINGS } from '../shared/settings.js'
import { DICTIONARIES } from '../src/client/i18n.js'
import { createStore } from '../src/client/store.js'
import { INITIAL_SETTINGS, type WhaleSettingsState } from '../src/client/settings.js'
import { PeekBar, SettingsPage, type SettingsPageActions } from '../src/client/settings/SettingsPage.js'
import { RunningMark } from '../src/client/whale/RunningMark.js'
import { WhaleLayer } from '../src/client/whale/WhaleLayer.js'

/** Placeholder translation that exercises the templates without a locale service. */
const identity = (key: string) => key

/** Resolve `{name}` placeholders against one dictionary. */
function translate(dictionary: Record<string, string>): (key: string, params?: Record<string, unknown>) => string {
  return (key, params) => {
    const template = dictionary[key] ?? key
    if (params === undefined) return template
    return template.replace(/\{(\w+)\}/gu, (_match, name: string) => String(params[name] ?? `{${name}}`))
  }
}

const actions = new Proxy({}, { get: () => () => {} }) as unknown as SettingsPageActions

/**
 * Render the settings entry page and the live preview in both tabs and both
 * locales, plus the running mark and the background layer.
 * @returns markup of each component plus the initial state.
 */
export function check(): {
  page: string
  englishPage: string
  peekPage: string
  englishPeekPage: string
  peekMarkPage: string
  englishPeekMarkPage: string
  mark: string
  layer: string
  initial: WhaleSettingsState
} {
  const state = createStore<WhaleSettingsState>({ ...DEFAULT_SETTINGS, writable: true })
  const page = renderToStaticMarkup(<SettingsPage t={identity} state={state} actions={actions} />)
  const englishPage = renderToStaticMarkup(
    <SettingsPage t={translate(DICTIONARIES.en)} state={state} actions={actions} />,
  )
  const peekPage = renderToStaticMarkup(<PeekBar t={identity} state={state} actions={actions} onReturn={() => undefined} />)
  const englishPeekPage = renderToStaticMarkup(
    <PeekBar t={translate(DICTIONARIES.en)} state={state} actions={actions} onReturn={() => undefined} />,
  )
  const peekMarkPage = renderToStaticMarkup(
    <PeekBar t={translate(DICTIONARIES.zh)} state={state} actions={actions} onReturn={() => undefined} initialTab="mark" />,
  )
  const englishPeekMarkPage = renderToStaticMarkup(
    <PeekBar t={translate(DICTIONARIES.en)} state={state} actions={actions} onReturn={() => undefined} initialTab="mark" />,
  )
  const mark = renderToStaticMarkup(<RunningMark state={state} />)
  const layer = renderToStaticMarkup(
    <WhaleLayer hero state={state}>
      <p>body</p>
    </WhaleLayer>,
  )
  return { page, englishPage, peekPage, englishPeekPage, peekMarkPage, englishPeekMarkPage, mark, layer, initial: INITIAL_SETTINGS }
}
