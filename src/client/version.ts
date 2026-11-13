/**
 * Plugin version compiled into the browser artifact.
 *
 * The build replaces `__WHALE_LEAP_VERSION__` with the version from
 * package.json, so the settings page can show and compare it without shipping
 * the whole manifest to the browser.
 */
declare const __WHALE_LEAP_VERSION__: string

/** Current plugin version. */
export const PLUGIN_VERSION: string = typeof __WHALE_LEAP_VERSION__ === 'string' ? __WHALE_LEAP_VERSION__ : '0.0.0'
