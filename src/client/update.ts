/**
 * GitHub-release-backed update check.
 *
 * The settings page asks the public GitHub API for the latest release tag and
 * compares it with the running build. The repository is the single source of
 * truth for releases; npm publishing is optional and does not drive updates.
 *
 * The API and jsDelivr's tag mirror are queried in parallel: the release API
 * answers immediately and authoritatively, while the mirror is not bound by the
 * unauthenticated API quota and can stand in when the API is rate-limited or
 * unreachable.
 */
import { PLUGIN_VERSION } from './version.js'

/** GitHub repository that publishes the plugin's releases. */
export const REPOSITORY = 'yingyu4451/dsh-whale-leap'

/** Human-readable releases page, also the download target for a newer build. */
export const RELEASES_URL = `https://github.com/${REPOSITORY}/releases`

/** Outcome of an update probe. */
export type UpdateStatus =
  | 'idle'
  | 'checking'
  | 'latest'
  | 'available'
  | 'no-release'
  | 'failed'
  | 'rate-limited'
  | 'network'
  | 'timeout'

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

/** jsDelivr's tag listing for the repository; not subject to the GitHub API quota. */
const MIRROR = `https://data.jsdelivr.com/v1/package/gh/${REPOSITORY}`

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
  /** Short diagnostic kept out of the UI copy. */
  error?: string
  /** Failure category used to explain the result to the user. */
  kind?: 'rate-limited' | 'network' | 'timeout' | 'http'
}

/**
 * Read one GitHub API document, retrying once on a transient transport failure.
 * @param url - endpoint returning JSON.
 * @param attempt - retry counter for transient failures.
 * @returns the parsed body, a missing marker, or a short error.
 */
async function probe(url: string, attempt = 0): Promise<Probe> {
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
    if (response.status === 403 || response.status === 429) {
      return { error: `HTTP ${response.status}`, kind: 'rate-limited' }
    }
    if (!response.ok) return { error: `HTTP ${response.status}`, kind: 'http' }
    return { body: await response.json() }
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'AbortError'
    const kind = timedOut ? 'timeout' : 'network'
    if (attempt === 0) {
      await new Promise(resolve => setTimeout(resolve, 600))
      return probe(url, attempt + 1)
    }
    return { error: error instanceof Error ? error.message : String(error), kind }
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
async function latestRelease(): Promise<{
  version?: string
  url?: string
  missing?: boolean
  error?: string
  kind?: 'rate-limited' | 'network' | 'timeout' | 'http'
}> {
  const release = await probe(`${API}/releases/latest`)
  if (release.missing !== true && release.error === undefined) {
    const body = release.body
    const tag = typeof body === 'object' && body !== null ? (body as { tag_name?: unknown; html_url?: unknown }) : undefined
    const version = typeof tag?.tag_name === 'string' ? tagVersion(tag.tag_name) : undefined
    if (version === undefined) return { error: 'Invalid release document', kind: 'http' }
    return {
      version,
      url: typeof tag.html_url === 'string' ? tag.html_url : RELEASES_URL,
    }
  }
  if (release.error !== undefined) return { error: release.error, kind: release.kind }

  // No release yet: tags still identify a published build.
  const tags = await probe(`${API}/tags?per_page=30`)
  if (tags.missing === true) return { missing: true }
  if (tags.error !== undefined) return { error: tags.error, kind: tags.kind }
  if (!Array.isArray(tags.body)) return { error: 'Invalid tag document', kind: 'http' }
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
 * Read the newest tag from jsDelivr, which mirrors the repository's git tags
 * without the unauthenticated GitHub API quota.
 * @returns the newest version and its release page, or an empty object.
 */
async function mirrorRelease(): Promise<{ version?: string; url?: string }> {
  const controller = new AbortController()
  const timer = setTimeout(() => {
    controller.abort()
  }, TIMEOUT_MS)
  try {
    const response = await fetch(MIRROR, { signal: controller.signal, headers: { accept: 'application/json' } })
    if (!response.ok) return {}
    const body = await response.json()
    const versions = typeof body === 'object' && body !== null ? (body as { versions?: unknown }).versions : undefined
    if (!Array.isArray(versions)) return {}
    let best: string | undefined
    for (const entry of versions) {
      const version = typeof entry === 'string' ? tagVersion(entry) : undefined
      if (version !== undefined && (best === undefined || compareVersions(version, best) > 0)) best = version
    }
    if (best === undefined) return {}
    return { version: best, url: `${RELEASES_URL}/tag/v${best}` }
  } catch {
    return {}
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Resolve a released version tag to the commit a pinned install can target.
 *
 * The plugin manager installs Git bundles only from a spec pinned to a full
 * commit, so an upgrade needs the commit behind the release tag rather than the
 * movable tag name. GitHub resolves refs through the commits API.
 * @param version - release version such as `0.9.3`.
 * @returns the full commit SHA, or `undefined` when the tag is unknown.
 */
export async function resolveTagCommit(version: string): Promise<string | undefined> {
  if (!VERSION_PATTERN.test(version)) return undefined
  for (const ref of [`v${version}`, version]) {
    const commit = await probe(`${API}/commits/${encodeURIComponent(ref)}`)
    if (commit.missing === true) continue
    if (commit.error !== undefined) throw new Error(commit.error)
    const document = commit.body
    const sha = typeof document === 'object' && document !== null ? (document as { sha?: unknown }).sha : undefined
    if (typeof sha === 'string' && /^[0-9a-f]{40}$/iu.test(sha)) return sha
  }
  return undefined
}

/**
 * Ask GitHub whether a newer build exists.
 *
 * Both sources are queried in parallel. The release API wins when it answers so
 * a fresh release is reported immediately; the jsDelivr mirror covers the case
 * where the API is rate-limited or unreachable, and may lag behind by a few
 * minutes after a brand-new tag is published.
 * @param currentVersion - running build version; defaults to the compiled-in one.
 * @returns the probe result.
 */
export async function checkForUpdate(currentVersion: string = PLUGIN_VERSION): Promise<UpdateResult> {
  const [api, mirror] = await Promise.all([latestRelease(), mirrorRelease()])
  let result: { version: string; url?: string }
  if (api.version !== undefined) {
    result = { version: api.version, url: api.url }
  } else if (mirror.version !== undefined) {
    result = mirror
  } else if (api.missing === true) {
    return { status: 'no-release' }
  } else {
    const status = api.kind === 'rate-limited' || api.kind === 'network' || api.kind === 'timeout'
      ? api.kind
      : 'failed'
    return { status, error: api.error ?? 'Unknown release error' }
  }
  return compareVersions(result.version, currentVersion) > 0
    ? { status: 'available', latest: result.version, url: result.url }
    : { status: 'latest', latest: result.version, url: result.url }
}
