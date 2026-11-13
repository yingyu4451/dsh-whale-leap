/**
 * Host smoke check: imports the Host half with a fake Cordis context and
 * asserts the settings schema plus the one-time settings-page registration.
 *
 * The browser bundle now carries the frame atlas as a data URL, so the Host
 * half owns no web route and must work with a context that only exposes
 * `settings`.
 */
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const host = await import(pathToFileURL(path.join(root, 'index.js')).href)

/**
 * Build one fake plugin context exposing only the settings service.
 * @returns the captured configure calls and effect cleanups.
 */
function bench() {
  const configured = []
  const cleanups = []
  const child = {
    settings: {
      configure(presentation, fiber) {
        configured.push({ presentation, fiber })
      },
    },
    effect(setup) {
      const cleanup = setup()
      if (typeof cleanup === 'function') cleanups.push(cleanup)
      return cleanup
    },
  }
  const injections = []
  const ctx = {
    fiber: 'fake-fiber',
    inject(names, callback) {
      injections.push(names)
      callback(child)
    },
  }
  host.apply(ctx, {})
  return { configured, cleanups, injections }
}

const failures = []
const expect = (condition, message) => {
  if (!condition) failures.push(message)
}

expect(typeof host.apply === 'function', 'apply is exported')
expect(host.Config !== undefined, 'Config is exported')

const schema = JSON.stringify(host.Config.toJSON())
for (const field of ['colorMode', 'customColor', 'size', 'opacity', 'frameMode', 'autoAppear', 'playOnSwitch', 'intervalSeconds', 'replaceMark', 'bgOffsetX', 'bgOffsetY', 'markColorMode', 'markColor', 'labelColorMode', 'labelColor', 'markSize', 'markLabelSize', 'markSwing', 'markOffsetX', 'markOffsetY', 'markMotion']) {
  expect(schema.includes(`"${field}"`), `schema contains ${field}`)
}
expect(schema.includes('"volatile":true'), 'schema marks fields volatile')
for (const mode of ['alternate', 'pixels', 'code', 'glyphs', 'binary', 'lines']) {
  expect(schema.includes(`"${mode}"`), `frame mode includes ${mode}`)
}

const benchResult = bench()
expect(benchResult.injections.length === 1, 'apply injects the settings service once')
expect(JSON.stringify(benchResult.injections[0]) === JSON.stringify(['settings']), 'apply injects only settings')
expect(benchResult.configured.length === 1, 'settings page configured once')
expect(benchResult.configured[0].presentation.auto === false, 'settings page registers automatically')
expect(benchResult.configured[0].fiber === 'fake-fiber', 'settings page binds the plugin fiber')

for (const cleanup of benchResult.cleanups) {
  if (typeof cleanup === 'function') cleanup()
}

if (failures.length > 0) {
  console.error('Host check failed:', failures.join('; '))
  process.exitCode = 1
} else {
  console.log(JSON.stringify({ ok: true, fields: 21, frameModes: 6 }, null, 2))
}
