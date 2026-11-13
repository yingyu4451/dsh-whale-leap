/**
 * Registry-backed update check.
 *
 * The page asks the public npm registries for the latest published version and
 * compares it with the running build. Requests go through `fetch` from the
 * settings page, so the result reflects what a reinstall would download.
 */
import { PLUGIN_VERSION } from './version.js'

/** Published package name. */
export const PACKAGE_NAME = 'dsh-whale-leap'

/** Outcome of an update probe. */
export type UpdateStatus = 'idle' | 'checking' | 'latest' | 'available' | 'not-published' | 'failed'

/** Result of an update probe. */
export interface UpdateResult {
  /** Probe state. */
  status: UpdateStatus
  /** Latest published version, when one was found. */
  latest?: string
  /** Short diagnostic kept out of the UI copy. */
  error?: string
}

/** Registry endpoints tried in order; the mirror covers networks where npmjs lags or is blocked. */
const REGISTRIES: readonly string[] = [
  'https://registry.npmjs.org/dsh-whale-leap/latest',
  'https://registry.npmmirror.com/dsh-whale-leap/latest',
]

/** How long one registry may take before the next one is tried. */
const TIMEOUT_MS = 8000

/** Accept plain semver triples; published tags are always `x.y.z`. */
const VERSION_PATTERN = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/

/**
 * Compare two semver strings.
 * @param left - first version.
 * @param right - second version.
 * @returns negative when `left` is older, positive when newer, zero when equal.
 */
export function compareVersions(left: string, right: string): number {
  const [leftCore, leftPre] = left.split('-', 2)
  const [rightCore, rightPre] = right.split('-', 2)
  const leftParts = leftCore.split('.').map(Number)
  const rightParts = rightCore.split('.').map(Number)
  for (let index = 0; index < 3; index += 1) {
    const delta = (leftParts[index] ?? 0) - (rightParts[index] ?? 0)
    if (delta !== 0) return delta
  }
  if (leftPre === undefined && rightPre === undefined) return 0
  if (leftPre === undefined) return 1
  if (rightPre === undefined) return -1
  return leftPre.localeCompare(rightPre)
}

/**
 * Read one registry document.
 * @param url - registry `latest` endpoint.
 * @returns the published version, `undefined` when the package is not published, or a string error.
 */
async function probe(url: string): Promise<{ version?: string; missing?: boolean; error?: string }> {
  const controller = new AbortController()
  const timer = setTimeout(() => {
    controller.abort()
  }, TIMEOUT_MS)
  try {
    const response = await fetch(url, { signal: controller.signal, headers: { accept: 'application/json' } })
    if (response.status === 404) return { missing: true }
    if (!response.ok) return { error: `HTTP ${response.status}` }
    const body: unknown = await response.json()
    const version = typeof body === 'object' && body !== null ? (body as { version?: unknown }).version : undefined
    return typeof version === 'string' && VERSION_PATTERN.test(version) ? { version } : { error: 'Invalid registry document' }
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) }
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Ask the registries whether a newer build exists.
 * @param currentVersion - running build version; defaults to the compiled-in one.
 * @returns the probe result.
 */
export async function checkForUpdate(currentVersion: string = PLUGIN_VERSION): Promise<UpdateResult> {
  const errors: string[] = []
  let missing = 0
  for (const registry of REGISTRIES) {
    const result = await probe(registry)
    if (result.missing === true) {
      missing += 1
      continue
    }
    if (result.version === undefined) {
      errors.push(result.error ?? 'Unknown registry error')
      continue
    }
    return compareVersions(result.version, currentVersion) > 0
      ? { status: 'available', latest: result.version }
      : { status: 'latest', latest: result.version }
  }
  if (missing === REGISTRIES.length) return { status: 'not-published' }
  return { status: 'failed', error: errors.join('; ') }
}
