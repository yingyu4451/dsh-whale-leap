/** Running-status fish mark: settings-driven size, motion, offsets, and color. */
import { useSyncExternalStore } from 'react'
import type { Store } from '../store.js'
import type { WhaleSettingsState } from '../settings.js'
import { WhaleMarkFish } from './WhaleMarkFish.js'

/** Props of {@link RunningMark}. */
export interface RunningMarkProps {
  /** Live whale settings. */
  state: Store<WhaleSettingsState>
}

/**
 * Fish mark shown left of the running Turn label.
 * @param props.state - live whale settings.
 * @returns the animated mark.
 */
export function RunningMark({ state }: RunningMarkProps) {
  const settings = useSyncExternalStore(state.subscribe, state.getSnapshot, state.getSnapshot)
  return (
    <WhaleMarkFish
      size={settings.markSize}
      motion={settings.markMotion}
      swing={settings.markSwing}
      offsetX={settings.markOffsetX}
      offsetY={settings.markOffsetY}
      color={settings.markColorMode === 'custom' ? settings.markColor : undefined}
    />
  )
}
