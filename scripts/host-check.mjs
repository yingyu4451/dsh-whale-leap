/**
 * Host smoke check: imports the Host half with a fake Cordis context and
 * asserts the settings schema and the official-atlas route.
 *
 * The route resolves the atlas through the client-module registry, so the
 * check installs a tiny fixture package that mimics the official brand
 * package's `lib/client.js` + `lib/assets/breach-atlas-<rev>.webp` layout.
 */
import { mkdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const fixture = path.join(root, '.tmp', 'brand-package')
const revision = '0123456789ab'
const atlasBytes = Buffer.from(`RIFF${String(24).padStart(4, '0')}WEBPVP8 fixture-whale-atlas`, 'utf8')

await rm(fixture, { recursive: true, force: true })
await mkdir(path.join(fixture, 'lib', 'assets'), { recursive: true })
await writeFile(path.join(fixture, 'lib', 'client.js'), '')
await writeFile(path.join(fixture, 'lib', 'assets', `breach-atlas-${revision}.webp`), atlasBytes)

const host = await import(pathToFileURL(path.join(root, 'index.js')).href)

/**
 * Build one fake plugin context.
 * @param clientPath - result of `clientModules.clientPath`, or undefined.
 * @returns the context plus captured route registrations and cleanups.
 */
function bench(clientPath) {
  const routes = []
  const cleanups = []
  const configured = []
  const child = {
    effect(setup) {
      const cleanup = setup()
      if (typeof cleanup === 'function') cleanups.push(cleanup)
      return cleanup
    },
    settings: {
      configure(presentation, fiber) {
        configured.push({ presentation, fiber })
      },
    },
    webServer: {
      register(route) {
        routes.push(route)
        return () => {}
      },
    },
    clientModules: {
      clientPath() {
        return clientPath
      },
    },
  }
  const ctx = {
    fiber: 'fake-fiber',
    inject(names, callback) {
      callback(child)
    },
  }
  host.apply(ctx, {})
  return { routes, cleanups, configured }
}

const failures = []
const expect = (condition, message) => {
  if (!condition) failures.push(message)
}

expect(typeof host.apply === 'function', 'apply is exported')
const schema = JSON.stringify(host.Config.toJSON())
expect(host.Config !== undefined, 'Config is exported')
for (const field of ['colorMode', 'customColor', 'size', 'opacity', 'frameMode', 'autoAppear', 'playOnSwitch', 'intervalSeconds', 'replaceMark', 'markColorMode', 'markColor', 'labelColorMode', 'labelColor', 'markSize', 'markLabelSize', 'markSwing', 'markOffsetX', 'markOffsetY', 'markMotion']) {
  expect(schema.includes(`"${field}"`), `schema contains ${field}`)
}
expect(schema.includes('"volatile":true'), 'schema marks fields volatile')

const positive = bench(path.join(fixture, 'lib', 'client.js'))
expect(positive.configured.length === 1, 'settings page configured once')
expect(positive.routes.length === 1, 'atlas route registered once')
const route = positive.routes[0]
expect(route?.kind === 'exact', 'atlas route is exact')
expect(route?.path === host.ATLAS_ROUTE, 'atlas route uses the published path')
expect(typeof route?.resource === 'function', 'atlas route exposes a resource')

if (route !== undefined) {
  const get = await route.resource(new Request(`http://127.0.0.1:3080${route.path}`, { method: 'GET' }))
  const body = Buffer.from(await get.arrayBuffer())
  expect(get.status === 200, 'GET returns 200')
  expect(get.headers.get('content-type') === 'image/webp', 'GET serves webp')
  expect(body.equals(atlasBytes), 'GET returns the installed atlas bytes')

  const head = await route.resource(new Request(`http://127.0.0.1:3080${route.path}`, { method: 'HEAD' }))
  expect(head.status === 200, 'HEAD returns 200')
  expect(head.headers.get('content-type') === 'image/webp', 'HEAD serves webp headers')
  expect((await head.arrayBuffer()).byteLength === 0, 'HEAD carries no body')
}

const missing = bench(undefined)
expect(missing.routes.length === 1, 'route still registers without the brand package')
const missingResponse = await missing.routes[0].resource(new Request('http://127.0.0.1:3080/whale-leap/assets/atlas.webp'))
expect(
  missingResponse.status === 404,
  `missing brand artwork returns 404 (got ${missingResponse.status}: ${await missingResponse.text()})`,
)

for (const cleanup of [...positive.cleanups, ...missing.cleanups]) {
  if (typeof cleanup === 'function') cleanup()
}

if (failures.length > 0) {
  console.error('Host check failed:', failures.join('; '))
  process.exitCode = 1
} else {
  console.log(JSON.stringify({ ok: true, routePath: host.ATLAS_ROUTE, bytes: atlasBytes.byteLength }, null, 2))
}
