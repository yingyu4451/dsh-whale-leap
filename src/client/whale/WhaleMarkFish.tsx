/** Animated fish mark for the running status and the settings previews. */
import { useEffect, useState, type CSSProperties } from 'react'
import type { WhaleMarkMotion } from '../settings.js'
import { FISH_LOGO_PATH, FISH_LOGO_VIEWBOX, FISH_SWIM_DOWN_PATH, FISH_SWIM_UP_PATH } from './fish-paths.js'
import css from './running-mark.module.css'

/** Props of {@link WhaleMarkFish}. */
export interface WhaleMarkFishProps {
  /** Box size in pixels. */
  size: number
  /** Motion preset. */
  motion: WhaleMarkMotion
  /** Horizontal swing amplitude multiplier; 1 keeps the authored amplitude. */
  swing?: number
  /** Horizontal start offset in pixels; negative moves left. */
  offsetX?: number
  /** Vertical start offset in pixels; negative moves up. */
  offsetY?: number
}

/**
 * Whether the user asked the system to reduce motion.
 * @returns true when motion should be suppressed.
 */
function prefersReducedMotion(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Fish silhouette that keeps swimming while rendered.
 * @param props.size - box size in pixels.
 * @param props.motion - motion preset.
 * @param props.swing - horizontal swing amplitude multiplier.
 * @param props.offsetX - horizontal start offset in pixels.
 * @param props.offsetY - vertical start offset in pixels.
 * @returns the animated mark.
 */
export function WhaleMarkFish({ size, motion, swing = 1, offsetX = 0, offsetY = 0 }: WhaleMarkFishProps) {
  const [swimming, setSwimming] = useState(() => !prefersReducedMotion())

  useEffect(() => {
    if (typeof matchMedia !== 'function') return
    const query = matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => {
      setSwimming(!query.matches)
    }
    sync()
    query.addEventListener('change', sync)
    return () => {
      query.removeEventListener('change', sync)
    }
  }, [])

  const values = `${FISH_LOGO_PATH};${FISH_SWIM_UP_PATH};${FISH_LOGO_PATH};${FISH_SWIM_DOWN_PATH};${FISH_LOGO_PATH}`
  const style: CSSProperties & Record<string, string | number> = {
    width: size,
    height: size,
    '--wl-swing': String(swing),
  }
  const offsetStyle: CSSProperties & Record<string, string> = {
    '--wl-offset-x': `${offsetX}px`,
    '--wl-offset-y': `${offsetY}px`,
  }

  return (
    <span className={css.offset} style={offsetStyle}>
      <span className={css.mark} data-motion={motion} style={style}>
        <svg
          className={css.svg}
          data-swimming={swimming ? '' : undefined}
          viewBox={`0 0 ${FISH_LOGO_VIEWBOX.width} ${FISH_LOGO_VIEWBOX.height}`}
          fill="none"
          aria-hidden="true"
        >
          <path d={FISH_LOGO_PATH} fill="currentColor">
            {swimming && (
              <animate
                attributeName="d"
                values={values}
                keyTimes="0;0.35;0.55;0.75;1"
                calcMode="spline"
                keySplines="0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1"
                dur="1.6s"
                repeatCount="indefinite"
              />
            )}
          </path>
        </svg>
      </span>
    </span>
  )
}
