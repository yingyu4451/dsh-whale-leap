/**
 * Render smoke check entry: renders every plugin component to static markup.
 *
 * Effects and refs do not run during server rendering, which is exactly the
 * shape we want: a crash here means the component tree itself is broken.
 */
import { renderToStaticMarkup } from 'react-dom/server'
import { DEFAULT_SETTINGS } from '../shared/settings.js'
import { createStore } from '../src/client/store.js'
import { INITIAL_SETTINGS, type WhaleSettingsState } from '../src/client/settings.js'
import { SettingsPage, type SettingsPageActions } from '../src/client/settings/SettingsPage.js'
import { RunningMark } from '../src/client/whale/RunningMark.js'
import { WhaleLayer } from '../src/client/whale/WhaleLayer.js'

const t = (key: string) => key
const actions = new Proxy({}, { get: () => () => {} }) as unknown as SettingsPageActions

/**
 * Render both settings tabs, the running mark, and the background layer.
 * @returns markup of each component.
 */
export function check(): {
  page: string
  markPage: string
  mark: string
  layer: string
  initial: WhaleSettingsState
} {
  const state = createStore<WhaleSettingsState>({ ...DEFAULT_SETTINGS, writable: true })
  const page = renderToStaticMarkup(<SettingsPage t={t} state={state} actions={actions} />)
  const markPage = renderToStaticMarkup(
    <SettingsPage t={t} state={state} actions={actions} initialTab="mark" />,
  )
  const mark = renderToStaticMarkup(<RunningMark state={state} />)
  const layer = renderToStaticMarkup(
    <WhaleLayer hero state={state}>
      <p>body</p>
    </WhaleLayer>,
  )
  return { page, markPage, mark, layer, initial: INITIAL_SETTINGS }
}
