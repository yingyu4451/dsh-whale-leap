/**
 * Host half of the Whale leap bundle.
 *
 * Declares the durable settings schema shown under Settings › Whale leap and
 * asks the settings service to present it as a page. It also publishes the
 * official brand package's frame atlas under the plugin's own route, so the
 * browser half reads that artwork at runtime instead of redistributing a copy
 * in the package tarball.
 */
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import z from '@deepseek-ai/schemastery'
import {
  COLOR_MODES,
  CUSTOM_COLOR_PATTERN,
  DEFAULT_SETTINGS,
  FRAME_MODES,
  INTERVAL_RANGE,
  MARK_LABEL_SIZE_RANGE,
  MARK_MOTIONS,
  MARK_OFFSET_RANGE,
  MARK_SIZE_RANGE,
  MARK_SWING_RANGE,
  OPACITY_RANGE,
  SIZE_RANGE,
} from './shared/settings.js'

/** Package that owns the official whale artwork. */
const BRAND_PACKAGE = '@deepseek-ai/dsh-client-ui-brand-official'

/** Exact Host route that serves the atlas bytes to the browser half. */
export const ATLAS_ROUTE = '/whale-leap/assets/atlas.webp'

/** Revisioned file name the official build emits under `lib/assets/`. */
const ATLAS_FILE = /^breach-atlas-[0-9a-f]{12}\.webp$/u

/**
 * Locate the installed brand package's atlas file.
 *
 * The client-module registry knows where the active brand bundle lives, which
 * also covers a checkout whose package is resolved outside this plugin's
 * `node_modules`. The bundle always sits in `lib/`, next to the revisioned
 * artwork the brand build emits under `lib/assets/`.
 * @param clientModules - client module registry service, or undefined before it mounts.
 * @returns the atlas path, or undefined when the brand bundle is not mounted.
 */
async function resolveAtlas(clientModules) {
  const clientPath = clientModules?.clientPath?.(BRAND_PACKAGE)
  if (typeof clientPath !== 'string') return undefined
  const directory = path.join(path.dirname(clientPath), 'assets')
  const names = await readdir(directory).catch(() => [])
  const atlas = names.find(name => ATLAS_FILE.test(name))
  return atlas === undefined ? undefined : path.join(directory, atlas)
}

/**
 * Answer one atlas request from the installed official artwork.
 * @param clientModules - client module registry service.
 * @param request - the GET or HEAD request for {@link ATLAS_ROUTE}.
 * @returns the webp bytes, or a 404 when the brand package is not installed.
 */
async function serveAtlas(clientModules, request) {
  const file = await resolveAtlas(clientModules)
  if (file === undefined) {
    return new Response('Whale leap: the official brand package artwork is unavailable.', {
      status: 404,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    })
  }
  const bytes = await readFile(file)
  const headers = {
    'content-type': 'image/webp',
    'content-length': String(bytes.byteLength),
    'cache-control': 'no-cache',
    'x-content-type-options': 'nosniff',
  }
  return request.method === 'HEAD'
    ? new Response(null, { status: 200, headers })
    : new Response(bytes, { status: 200, headers })
}

/**
 * Host-side configuration shape; every field is live so edits apply without a
 * page reload.
 */
export const Config = z.object({
  /** Ink source: theme text tone or a custom pick. */
  colorMode: z.union([...COLOR_MODES]).default(DEFAULT_SETTINGS.colorMode).volatile(),
  /** Lowercase custom ink color. */
  customColor: z.string().pattern(CUSTOM_COLOR_PATTERN).default(DEFAULT_SETTINGS.customColor).volatile(),
  /** Background scene size multiplier. */
  size: z.number().step(SIZE_RANGE.step).min(SIZE_RANGE.min).max(SIZE_RANGE.max).default(DEFAULT_SETTINGS.size).volatile(),
  /** Ink strength response; the renderer squares it against a design gain. */
  opacity: z.number().step(OPACITY_RANGE.step).min(OPACITY_RANGE.min).max(OPACITY_RANGE.max).default(DEFAULT_SETTINGS.opacity).volatile(),
  /** Which painting the whale shows: alternating frames, dots, or code lettering. */
  frameMode: z.union([...FRAME_MODES]).default(DEFAULT_SETTINGS.frameMode).volatile(),
  /** Whether the whale reappears on its own in a started conversation. */
  autoAppear: z.boolean().default(DEFAULT_SETTINGS.autoAppear).volatile(),
  /** Whether entering a conversation replays the whale at once. */
  playOnSwitch: z.boolean().default(DEFAULT_SETTINGS.playOnSwitch).volatile(),
  /** Seconds between automatic replays. */
  intervalSeconds: z.number().step(INTERVAL_RANGE.step).min(INTERVAL_RANGE.min).max(INTERVAL_RANGE.max).default(DEFAULT_SETTINGS.intervalSeconds).volatile(),
  /** Whether the plugin's fish replaces the shipped running mark. */
  replaceMark: z.boolean().default(DEFAULT_SETTINGS.replaceMark).volatile(),
  /** Running mark color source: theme tone or a custom pick. */
  markColorMode: z.union([...COLOR_MODES]).default(DEFAULT_SETTINGS.markColorMode).volatile(),
  /** Lowercase custom running mark color. */
  markColor: z.string().pattern(CUSTOM_COLOR_PATTERN).default(DEFAULT_SETTINGS.markColor).volatile(),
  /** Running status label color source: theme tone or a custom pick. */
  labelColorMode: z.union([...COLOR_MODES]).default(DEFAULT_SETTINGS.labelColorMode).volatile(),
  /** Lowercase custom running status label color. */
  labelColor: z.string().pattern(CUSTOM_COLOR_PATTERN).default(DEFAULT_SETTINGS.labelColor).volatile(),
  /** Running mark size in pixels. */
  markSize: z.number().step(MARK_SIZE_RANGE.step).min(MARK_SIZE_RANGE.min).max(MARK_SIZE_RANGE.max).default(DEFAULT_SETTINGS.markSize).volatile(),
  /** Running status label size in pixels. */
  markLabelSize: z.number().step(MARK_LABEL_SIZE_RANGE.step).min(MARK_LABEL_SIZE_RANGE.min).max(MARK_LABEL_SIZE_RANGE.max).default(DEFAULT_SETTINGS.markLabelSize).volatile(),
  /** Running mark swing amplitude multiplier. */
  markSwing: z.number().step(MARK_SWING_RANGE.step).min(MARK_SWING_RANGE.min).max(MARK_SWING_RANGE.max).default(DEFAULT_SETTINGS.markSwing).volatile(),
  /** Running mark horizontal start offset in pixels. */
  markOffsetX: z.number().step(MARK_OFFSET_RANGE.step).min(MARK_OFFSET_RANGE.min).max(MARK_OFFSET_RANGE.max).default(DEFAULT_SETTINGS.markOffsetX).volatile(),
  /** Running mark vertical start offset in pixels. */
  markOffsetY: z.number().step(MARK_OFFSET_RANGE.step).min(MARK_OFFSET_RANGE.min).max(MARK_OFFSET_RANGE.max).default(DEFAULT_SETTINGS.markOffsetY).volatile(),
  /** Running mark motion preset. */
  markMotion: z.union([...MARK_MOTIONS]).default(DEFAULT_SETTINGS.markMotion).volatile(),
})

/**
 * Activate the Host half: present this plugin's settings page under its own
 * namespace and publish the official frame atlas route.
 * @param ctx - Host plugin context.
 * @param _config - validated row config; values are read through the settings document.
 */
export function apply(ctx, _config) {
  ctx.inject(['settings'], (child) => {
    child.effect(() => child.settings.configure({ auto: false }, ctx.fiber))
  })
  ctx.inject(['webServer', 'clientModules'], (child) => {
    child.effect(
      () => child.webServer.register({
        kind: 'exact',
        path: ATLAS_ROUTE,
        resource: request => serveAtlas(child.clientModules, request),
      }),
      'whale-leap: official atlas route',
    )
  })
}
