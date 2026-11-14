/**
 * Timing helper for the whale's automatic replays.
 *
 * The fixed mode waits exactly the configured interval. The random mode treats
 * the configured interval as the upper bound and returns a wait between half and
 * the full interval, so consecutive appearances never feel metronomic while the
 * whale still shows up at least as often as configured. A short floor keeps the
 * smallest configured interval from firing in a burst.
 */

/** Shortest wait random mode may produce, in milliseconds. */
export const AUTO_RANDOM_FLOOR_MS = 400

/**
 * Compute the wait before the next automatic replay.
 * @param intervalMs - user-configured interval in milliseconds (also the random upper bound).
 * @param random - whether the wait should vary below the interval.
 * @param randomValue - random source in [0, 1); injectable for tests.
 * @returns wait in milliseconds before the next replay.
 */
export function nextAutoDelay(
  intervalMs: number,
  random: boolean,
  randomValue: () => number = Math.random,
): number {
  if (!random) return intervalMs
  return Math.max(AUTO_RANDOM_FLOOR_MS, intervalMs * (0.5 + randomValue() * 0.5))
}
