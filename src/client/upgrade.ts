/**
 * In-place upgrade through the DSH plugin manager.
 *
 * The settings page shows the version of the running build. When a newer release
 * exists, upgrading should not be a manual GitHub download: the profile's plugin
 * manager already knows how to remove the bundle and install another pinned
 * build, reloads the client through HMR, and rolls back to the previous spec when
 * the new install fails. This module wraps that remote API for the plugin.
 *
 * Every manager call resolves a typert `RemoteResult` envelope, so a call never
 * throws for a business failure; it reports `ok: false` with a failure code.
 */
import { REPOSITORY, resolveTagCommit } from './update.js'

/** Package name of this plugin inside the DSH profile. */
export const PACKAGE_NAME = 'dsh-whale-leap'

/** Install prefix a pinned release is fetched from. */
export const GIT_SPEC = `github:${REPOSITORY}`

/** Short failure detail kept out of the user-facing sentence. */
type Failure = { code?: string; message?: string; diagnostic?: string }

/** One plugin-manager reply envelope. */
export type RemoteResult<T> = { ok: true; value: T } | { ok: false; error: Failure }

/** One entry of `listBundles`. */
export interface UpgradeBundle {
  /** Package name. */
  name?: string
  /** Manifest version. */
  version?: string
  /** Installed install spec. */
  source?: string
  /** Whether the manager offers its own update path for the bundle. */
  update?: 'registry' | 'git'
  /** Whether the bundle is installed and enabled. */
  enabled?: boolean
}

/** Result of one plugin-manager mutation. */
export interface UpgradeChange {
  /** Whether the profile actually changed. */
  changed?: boolean
  /** How the running host applied the change. */
  application?: 'applied' | 'restart-required' | 'overridden' | 'failed' | 'cancelled'
  /** Why a change failed or was refused. */
  error?: Failure
  /** Why a restart is needed. */
  restartReason?: string
}

/** Result of the manager's own update path. */
export interface UpgradeUpdate {
  /** Outcome of the target install. */
  result?: UpgradeChange
  /** Outcome of restoring the previous spec after a failure. */
  restore?: UpgradeChange
  /** Step the update stopped at. */
  failedAt?: string
}

/** The plugin-manager methods this module calls. */
export interface UpgradeManager {
  listBundles: () => Promise<RemoteResult<readonly UpgradeBundle[]>>
  updateBundle: (
    name: string,
    version: string,
    options: { spec?: string; registry?: string; requestId?: string },
  ) => Promise<RemoteResult<UpgradeUpdate>>
  removeBundle: (name: string) => Promise<RemoteResult<UpgradeChange>>
  installBundle: (
    spec: string,
    options: { enabled?: boolean; requestId?: string; expected?: { name: string; version: string } },
  ) => Promise<RemoteResult<UpgradeChange>>
}

/** Resolves a released version tag to the commit a pinned install targets. */
export type CommitResolver = (version: string) => Promise<string | undefined>

/** How one upgrade attempt ended. */
export interface UpgradeOutcome {
  /** `ok` when the new build is installed, `unsupported` without a manager. */
  status: 'ok' | 'failed' | 'unsupported'
  /** Version the attempt targeted. */
  version: string
  /** Manager application state of a successful change. */
  application?: UpgradeChange['application']
  /** True when the new build needs a `dsh web` restart (not just a reload). */
  restart?: boolean
  /** True when a failed install was followed by a restore attempt. */
  restored?: boolean
  /** Short diagnostic for the settings page. */
  message?: string
}

/** Inputs of {@link runUpgrade}. */
export interface UpgradeOptions {
  /** Override commit resolution (tests). */
  resolveCommit?: CommitResolver
  /** Request id used to correlate install progress (tests). */
  requestId?: string
  /** Spec restored after a failed install; defaults to the installed spec. */
  previousSpec?: string
}

/** The 升级 button's entry point. */
export interface UpgradeHandle {
  /** Install `version` in place. */
  install: (version: string) => Promise<UpgradeOutcome>
}

/** The commit a pinned install wants: a full SHA is the only stable ref. */
const FULL_COMMIT = /^[0-9a-f]{40}$/iu

/** Create a fresh request id; the manager echoes it on progress events. */
function createRequestId(): string {
  const cryptoApi = globalThis.crypto
  if (cryptoApi !== undefined && typeof cryptoApi.randomUUID === 'function') return cryptoApi.randomUUID()
  return `upgrade-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`
}

/**
 * Short failure reason of a change, if it failed.
 * @param change - manager reply.
 * @returns a reason, or `undefined` when the change applied.
 */
function changeFailure(change: UpgradeChange | undefined): string | undefined {
  if (change === undefined) return 'empty-result'
  if (change.error !== undefined) return change.error.code ?? change.error.message ?? 'error'
  if (change.application === 'failed' || change.application === 'cancelled') return change.application
  return undefined
}

/**
 * Build the failure outcome.
 * @param version - targeted version.
 * @param message - short diagnostic.
 * @param restored - whether the previous spec was reinstalled.
 * @returns the outcome.
 */
function failure(version: string, message: string, restored?: boolean): UpgradeOutcome {
  return { status: 'failed', version, message, restored }
}

/**
 * Remove the installed bundle and install a pinned build, restoring the previous
 * spec when the replacement fails.
 * @param manager - plugin manager.
 * @param spec - pinned install spec of the new build.
 * @param version - targeted version.
 * @param previousSpec - spec restored after a failed install.
 * @param requestId - install correlation id.
 * @returns the outcome.
 */
async function reinstall(
  manager: UpgradeManager,
  spec: string,
  version: string,
  previousSpec: string,
  requestId: string,
): Promise<UpgradeOutcome> {
  const removed = await manager.removeBundle(PACKAGE_NAME)
  if (!removed.ok) return failure(version, removed.error.code ?? 'remove-failed')
  const removeFailure = changeFailure(removed.value)
  if (removeFailure !== undefined) return failure(version, removeFailure)

  const installed = await manager.installBundle(spec, {
    enabled: true,
    requestId,
    expected: { name: PACKAGE_NAME, version },
  })
  if (installed.ok) {
    const installFailure = changeFailure(installed.value)
    if (installFailure === undefined) {
      return {
        status: 'ok',
        version,
        application: installed.value.application,
        restart: installed.value.application === 'restart-required',
      }
    }
    const restored = await restore(manager, previousSpec)
    return failure(version, installFailure, restored)
  }
  const restored = await restore(manager, previousSpec)
  return failure(version, installed.error.code ?? 'install-failed', restored)
}

/**
 * Put the previous install spec back after a failed replacement.
 * @param manager - plugin manager.
 * @param spec - previous install spec.
 * @returns whether the restore reported a usable bundle.
 */
async function restore(manager: UpgradeManager, spec: string): Promise<boolean> {
  try {
    const restored = await manager.installBundle(spec, { enabled: true })
    return restored.ok && changeFailure(restored.value) === undefined
  } catch {
    return false
  }
}

/**
 * Install a released version in place.
 * @param manager - plugin manager, or `undefined` when the manager is unavailable.
 * @param version - version to install (a release/tag version).
 * @param options - commit resolver and request id overrides.
 * @returns the outcome of the attempt.
 */
export async function runUpgrade(
  manager: UpgradeManager | undefined,
  version: string,
  options: UpgradeOptions = {},
): Promise<UpgradeOutcome> {
  if (manager === undefined) return { status: 'unsupported', version }
  if (typeof version !== 'string' || version === '') return failure(version, 'invalid-version')
  const resolve = options.resolveCommit ?? resolveTagCommit
  const requestId = options.requestId ?? createRequestId()

  let bundle: UpgradeBundle | undefined
  try {
    const listed = await manager.listBundles()
    if (!listed.ok) return failure(version, listed.error.code ?? 'list-failed')
    bundle = listed.value.find(entry => entry.name === PACKAGE_NAME)
  } catch (error) {
    return failure(version, error instanceof Error ? error.message : 'list-failed')
  }
  if (bundle === undefined) return failure(version, 'not-installed')

  let commit: string | undefined
  try {
    commit = await resolve(version)
  } catch (error) {
    return failure(version, error instanceof Error ? error.message : 'resolve-failed')
  }
  if (commit === undefined || !FULL_COMMIT.test(commit)) return failure(version, 'commit-unresolved')
  const spec = `${GIT_SPEC}#${commit.toLowerCase()}`
  const previousSpec = options.previousSpec ?? bundle.source ?? GIT_SPEC

  // A pinned Git install is update-eligible: let the manager run its own
  // rollback-aware path. Anything else (our unpinned GitHub install) has to be
  // replaced by hand because the manager refuses to update an unpinned source.
  if (bundle.update === 'git') {
    try {
      const updated = await manager.updateBundle(PACKAGE_NAME, version, { spec, requestId })
      if (!updated.ok) return failure(version, updated.error.code ?? 'update-failed')
      const outcome = updated.value
      if (outcome.restore !== undefined) {
        return failure(version, changeFailure(outcome.result) ?? 'update-rolled-back', true)
      }
      const updateFailure = changeFailure(outcome.result)
      if (updateFailure !== undefined) return failure(version, updateFailure)
      return {
        status: 'ok',
        version,
        application: outcome.result?.application,
        restart: outcome.result?.application === 'restart-required',
      }
    } catch (error) {
      return failure(version, error instanceof Error ? error.message : 'update-failed')
    }
  }

  try {
    return await reinstall(manager, spec, version, previousSpec, requestId)
  } catch (error) {
    const restored = await restore(manager, previousSpec)
    return failure(version, error instanceof Error ? error.message : 'install-failed', restored)
  }
}

/**
 * Build the controller the settings page holds on to.
 * @param manager - resolves the plugin-manager remote service, or `undefined`.
 * @param resolveCommit - optional commit resolver override (tests).
 * @returns the upgrade entry point.
 */
export function createUpgradeController(
  manager: () => UpgradeManager | undefined,
  resolveCommit?: CommitResolver,
): UpgradeHandle {
  return {
    install: version => runUpgrade(manager(), version, resolveCommit === undefined ? {} : { resolveCommit }),
  }
}
