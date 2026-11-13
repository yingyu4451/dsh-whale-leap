/**
 * Inlined whale frame atlas.
 *
 * The webp is bundled by esbuild as a data URL, so the decoration works without
 * a Host route, offline, and on packaged builds whose official brand package
 * lives inside an asar archive that plain file reads cannot reach.
 */
import atlasUrl from '../../assets/breach-atlas.webp'

export const ATLAS_URL = atlasUrl
