/**
 * Background whale layer for the blank home and started conversations.
 *
 * The `conversation.hero.frame` contract hands this component the scroll body
 * as children. On the blank home the canvas paints through the isolated root;
 * in a started conversation it wraps the body in its own isolating layer so the
 * negative-z canvas stays behind the transcript.
 */
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type MouseEvent, type ReactNode } from 'react'
import { WHALE_ARTWORK } from './artwork.js'
import { attachPixelWhale, type PixelWhaleHandle } from './renderer.js'
import { ATLAS_URL } from '../atlas.js'
import { PEEK_EVENT, PEEK_INTERVAL_MS, PEEK_PLAY_EVENT } from './peek.js'
import type { Store } from '../store.js'
import type { WhaleSettingsState } from '../settings.js'
import css from './whale.module.css'

/** Elements that keep a click from triggering a replay. */
const CONTROLS = 'button, a, input, textarea, select, label, [contenteditable], [role="button"], [role="dialog"], [role="menu"], [role="listbox"], [data-composer-card]'

/** Inline canvas variables for the custom ink source. */
interface CanvasPresentation {
  color?: string
  '--home-whale-code-ink'?: string
}

/** Props of {@link WhaleLayer}. */
export interface WhaleLayerProps {
  /** True while the body is the blank home. */
  hero: boolean
  /** Conversation scroll body. */
  children?: ReactNode
  /** Live whale settings. */
  state: Store<WhaleSettingsState>
}

/**
 * Whether a click lands on blank conversation space.
 * @param event - click event inside the layer.
 * @returns true when the click should replay the whale.
 */
function isBlankClick(event: MouseEvent<HTMLDivElement>): boolean {
  if (event.button !== 0) return false
  const frame = event.currentTarget
  const target = event.target
  if (!(target instanceof Element) || !frame.contains(target)) return false
  if (target.closest(CONTROLS) !== null) return false
  const selection = document.getSelection()
  return !(selection !== null && !selection.isCollapsed && frame.contains(selection.anchorNode))
}

/**
 * Ink presentation variables for the current settings.
 * @param state - live settings.
 * @returns inline canvas styles.
 */
function canvasPresentation(state: WhaleSettingsState): CanvasPresentation {
  if (state.colorMode !== 'custom') return {}
  return { color: state.customColor, '--home-whale-code-ink': state.customColor }
}

/**
 * Whale background layer wrapping the conversation body.
 * @param props.hero - true on the blank home.
 * @param props.children - body to wrap.
 * @param props.state - live whale settings.
 * @returns the layer.
 */
export function WhaleLayer({ hero, children, state }: WhaleLayerProps) {
  const settings = useSyncExternalStore(state.subscribe, state.getSnapshot, state.getSnapshot)
  const whale = useRef<PixelWhaleHandle | undefined>(undefined)
  const canvasRef = useCallback((canvas: HTMLCanvasElement | null) => {
    whale.current?.dispose()
    if (canvas === null) {
      whale.current = undefined
      return
    }
    const handle = attachPixelWhale(canvas, WHALE_ARTWORK, ATLAS_URL)
    whale.current = handle
    handle.prefetch()
  }, [])

  const { opacity, size, colorMode, customColor, fillStyles, bgOffsetX, bgOffsetY, randomPosition, podEnabled, depthInk, podTiming, podSizeMin, podSizeMax } = settings
  useEffect(() => {
    whale.current?.update({ ...WHALE_ARTWORK, activeOpacity: opacity, scale: size, offsetX: bgOffsetX, offsetY: bgOffsetY })
  }, [opacity, size, colorMode, customColor, bgOffsetX, bgOffsetY])

  const fillStyleKey = fillStyles.join(',')
  useEffect(() => {
    whale.current?.setFillStyles(fillStyles)
  }, [fillStyleKey])

  useEffect(() => {
    whale.current?.setPodOptions({ enabled: podEnabled, depthInk, timing: podTiming, sizeMin: podSizeMin, sizeMax: podSizeMax })
  }, [podEnabled, depthInk, podTiming, podSizeMin, podSizeMax])

  const [peek, setPeek] = useState(false)
  useEffect(() => {
    const onPeek = (event: Event): void => {
      const detail = (event as CustomEvent<{ active?: boolean }>).detail
      setPeek(detail?.active === true)
    }
    window.addEventListener(PEEK_EVENT, onPeek)
    return () => {
      window.removeEventListener(PEEK_EVENT, onPeek)
    }
  }, [])

  useEffect(() => {
    whale.current?.setPreview(peek)
    if (!peek) return
    whale.current?.play()
    const replay = (): void => {
      whale.current?.play()
    }
    window.addEventListener(PEEK_PLAY_EVENT, replay)
    const timer = setInterval(replay, PEEK_INTERVAL_MS)
    return () => {
      window.removeEventListener(PEEK_PLAY_EVENT, replay)
      clearInterval(timer)
    }
  }, [peek])

  // In the live preview the blank home is staged like a started conversation,
  // so random mode must reach the hero layer there too.
  useEffect(() => {
    whale.current?.setRandomPosition(randomPosition && (!hero || peek))
  }, [randomPosition, hero, peek])

  const { autoAppear, intervalSeconds, playOnSwitch, randomInterval } = settings
  useEffect(() => {
    whale.current?.setAutoPlay(
      autoAppear && !hero ? intervalSeconds * 1000 : undefined,
      playOnSwitch,
      randomInterval,
    )
  }, [autoAppear, intervalSeconds, playOnSwitch, randomInterval, hero])

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    if (isBlankClick(event)) whale.current?.play()
  }

  const draws = hero || autoAppear || peek
  return (
    <div
      className={hero || (!autoAppear && !peek) ? css.layer : css.autoLayer}
      data-whale-layer={hero ? 'hero' : autoAppear ? 'auto' : 'plain'}
      onClick={onClick}
    >
      {draws && (
        <canvas
          ref={canvasRef}
          className={css.canvas}
          data-whale-ink={settings.colorMode === 'custom' ? 'custom' : undefined}
          style={canvasPresentation(settings) as CSSProperties}
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  )
}
