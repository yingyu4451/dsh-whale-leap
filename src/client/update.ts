/**
 * GitHub-release-backed update check.
 *
 * The settings page asks the public GitHub API for the latest release tag and
 * compares it with the running build. The repository is the single source of
 * truth for releases; npm publishing is optional and does not drive updates.
 */
import { PLUGIN_VERSION } from './version.js'

/** GitHub repository that publishes the plugin's releases. */
export const REPOSITORY = 'yingyu4451/dsh-whale-leap'

/** Human-readable releases page, also the download target for a newer build. */
export const RELEASES_URL = `https://github.com/${REPOSITORY}/releases`

/** Outcome of an update probe. */
export type UpdateStatus = 'idle' | 'checking' | 'latest' | 'available' | 'no-release' | 'failed'

/** Result of an update probe. */
export interface UpdateResult {
  /** Probe state. */
  status: UpdateStatus
  /** Latest released version, when one was found. */
  latest?: string
  /** Release page that carries the build, when one was found. */
  url?: string
  /** Short diagnostic kept out of the UI copy. */
  error?: string
}

/** GitHub API base of the repository. */
const API = `https://api.github.com/repos/${REPOSITORY}`

/** How long one API request may take. */
const TIMEOUT_MS = 8000

/** Accept plain semver triples; release tags are `v`-prefixed versions. */
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

/** One GitHub API document, or the reason it could not be read. */
interface Probe {
  body?: unknown
  /** The requested resource does not exist (an empty repository). */
  missing?: boolean
  error?: string
}

/**
 * Read one GitHub API document.
 * @param url - endpoint returning JSON.
 * @returns the parsed body, a missing marker, or a short error.
 */
async function probe(url: string): Promise<Probe> {
  const controller = new AbortController()
  const timer = setTimeout(() => {
    controller.abort()
  }, TIMEOUT_MS)
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { accept: 'application/vnd.github+json' },
    })
    if (response.status === 404) return { missing: true }
    if (!response.ok) return { error: `HTTP ${response.status}` }
    return { body: await response.json() }
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) }
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Normalize a release or tag name into a version.
 * @param tag - name such as `v0.4.2` or `0.4.2`.
 * @returns the version, or `undefined` when the tag is not a version.
 */
function tagVersion(tag: string): string | undefined {
  const version = tag.replace(/^v/iu, '')
  return VERSION_PATTERN.test(version) ? version : undefined
}

/**
 * Read the newest release, falling back to the newest version tag.
 * @returns version and release URL, a missing marker, or a short error.
 */
async function latestRelease(): Promise<{ version?: string; url?: string; missing?: boolean; error?: string }> {
  const release = await probe(`${API}/releases/latest`)
  if (release.missing !== true && release.error === undefined) {
    const body = release.body
    const tag = typeof body === 'object' && body !== null ? (body as { tag_name?: unknown; html_url?: unknown }) : undefined
    const version = typeof tag?.tag_name === 'string' ? tagVersion(tag.tag_name) : undefined
    if (version === undefined) return { error: 'Invalid release document' }
    return {
      version,
      url: typeof tag.html_url === 'string' ? tag.html_url : RELEASES_URL,
    }
  }
  if (release.error !== undefined) return { error: release.error }

  // No release yet: tags still identify a published build.
  const tags = await probe(`${API}/tags?per_page=30`)
  if (tags.missing === true) return { missing: true }
  if (tags.error !== undefined) return { error: tags.error }
  if (!Array.isArray(tags.body)) return { error: 'Invalid tag document' }
  let best: string | undefined
  for (const entry of tags.body) {
    const name = typeof entry === 'object' && entry !== null ? (entry as { name?: unknown }).name : undefined
    const version = typeof name === 'string' ? tagVersion(name) : undefined
    if (version !== undefined && (best === undefined || compareVersions(version, best) > 0)) best = version
  }
  if (best === undefined) return { missing: true }
  return { version: best, url: `${RELEASES_URL}/tag/v${best}` }
}

/**
 * Ask GitHub whether a newer build exists.
 * @param currentVersion - running build version; defaults to the compiled-in one.
 * @returns the probe result.
 */
export async function checkForUpdate(currentVersion: string = PLUGIN_VERSION): Promise<UpdateResult> {
  const result = await latestRelease()
  if (result.missing === true) return { status: 'no-release' }
  if (result.version === undefined) return { status: 'failed', error: result.error ?? 'Unknown release error' }
  return compareVersions(result.version, currentVersion) > 0
    ? { status: 'available', latest: result.version, url: result.url }
    : { status: 'latest', latest: result.version, url: result.url }
}
