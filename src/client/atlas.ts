/**
 * Browser reference to the frame atlas published by the plugin's Host half.
 *
 * App-owned routes are document-relative (the same convention the client
 * module registry uses for `plugins/…` references), so this resolves under any
 * shell document mount. The Host route reads the installed official brand
 * package artwork; the plugin tarball carries no copy.
 */
export const ATLAS_URL = 'whale-leap/assets/atlas.webp'
