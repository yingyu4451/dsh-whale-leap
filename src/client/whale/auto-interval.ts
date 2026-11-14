/**
 * Timing helper for the whale's automatic replays.
 *
 * Fixed mode waits exactly the configured interval. Random mode ignores the
 * configured interval and picks a fresh wait between five seconds and sixty
 * minutes, so the whale appears at irregular, human-feeling moments.
 */

/** Shortest wait random mode may produce, in milliseconds (five seconds). */
export const AUTO_RANDOM_MIN_MS = 5_000

/** Longest wait random mode may produce, in milliseconds (sixty minutes). */
export const AUTO_RANDOM_MAX_MS = 60 * 60_000

/**
 * Compute the wait before the next automatic replay.
 * @param intervalMs - user-configured interval in milliseconds (fixed mode only).
 * @param random - whether the wait is picked randomly from the five-second to sixty-minute range.
 * @param randomValue - random source in [0, 1); injectable for tests.
 * @returns wait in whole seconds, in milliseconds.
 */
export function nextAutoDelay(
  intervalMs: number,
  random: boolean,
  randomValue: () => number = Math.random,
): number {
  if (!random) return intervalMs
  const span = AUTO_RANDOM_MAX_MS - AUTO_RANDOM_MIN_MS
  const wait = AUTO_RANDOM_MIN_MS + randomValue() * span
  return Math.round(wait / 1000) * 1000
}
