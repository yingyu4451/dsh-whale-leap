/**
 * Smoke-check the built ModuleLoader artifact without a browser.
 *
 * Loads lib/client.js with stubbed browser globals and React, then calls the
 * exported apply() to confirm it registers the expected slots and locale.
 */
import { readFile } from 'node:fs/promises'

const source = await readFile(new URL('../lib/client.js', import.meta.url), 'utf8')

const react = {
  useState: value => [typeof value === 'function' ? value() : value, () => {}],
  useRef: value => ({ current: value }),
  useCallback: callback => callback,
  useEffect: () => {},
  useSyncExternalStore: (subscribe, getSnapshot) => getSnapshot(),
  createElement: () => null,
  Fragment: Symbol('Fragment'),
}
const jsxRuntime = { jsx: type => ({ type }), jsxs: type => ({ type }), Fragment: react.Fragment }

const styles = []
const documentStub = {
  createElement: () => ({ dataset: {}, style: { setProperty() {} }, textContent: '' }),
  head: { appendChild: element => styles.push(element) },
  getSelection: () => null,
  addEventListener() {},
  removeEventListener() {},
}

let artifact = null
const windowStub = {
  __ModuleLoader__: {
    load({ id, factory }) {
      artifact = { id, exports: factory(name => (name === 'react' ? react : name === 'react/jsx-runtime' ? jsxRuntime : (() => { throw new Error(`unexpected require ${name}`) })())) }
    },
  },
}

globalThis.window = windowStub
globalThis.document = documentStub
globalThis.matchMedia = () => ({ matches: false, matchesState: false, addEventListener() {}, removeEventListener() {} })

await import(new URL('../lib/client.js', import.meta.url).href)

const registrations = []
const effects = []
const localeNamespaces = []
let namespace = null
const ctx = {
  effect(setup) {
    effects.push(setup())
  },
  configForms: {
    get(id) {
      namespace = id
      return {
        getSnapshot: () => ({ value: { autoAppear: true, markSize: 18 }, writable: true }),
        subscribe: () => () => {},
        set: async () => true,
      }
    },
  },
  locale: {
    register(ns, dictionaries) {
      localeNamespaces.push([ns, Object.keys(dictionaries).length])
      return () => {}
    },
    bind() {
      return key => key
    },
  },
  slots: {
    inject(_name, factory) {
      factory()
    },
    register(options) {
      registrations.push(options)
      return options
    },
  },
}

artifact.exports.apply(ctx)

const report = {
  moduleId: artifact.id,
  exports: Object.keys(artifact.exports),
  namespace,
  registrations: registrations.map(item => ({ name: item.name, id: item.id, order: item.order, locale: item.locale })),
  localeNamespaces,
  styleSheets: styles.length,
  effectCleanups: effects.map(effect => typeof effect),
}

console.log(JSON.stringify(report, null, 2))
