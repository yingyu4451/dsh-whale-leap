/**
 * Background whale layer for the blank home and started conversations.
 *
 * The `conversation.hero.frame` contract hands this component the scroll body
 * as children. On the blank home the canvas paints through the isolated root;
 * in a started conversation it wraps the body in its own isolating layer so the
 * negative-z canvas stays behind the transcript.
 */
import { useCallback, useEffect, useRef, useSyncExternalStore, type CSSProperties, type MouseEvent, type ReactNode } from 'react'
import { WHALE_ARTWORK } from './artwork.js'
import { attachPixelWhale, type PixelWhaleHandle } from './renderer.js'
import { ATLAS_URL } from '../atlas.js'
import type { Store } from '../store.js'
import type { WhaleAppearMode, WhaleSettingsState } from '../settings.js'
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

/** Whether an appearance mode also replays on the auto interval. */
function isTimed(mode: WhaleAppearMode): boolean {
  return mode === 'all' || mode === 'timed'
}

/** Whether an appearance mode replays as soon as a conversation opens. */
function isSwitched(mode: WhaleAppearMode): boolean {
  return mode === 'all' || mode === 'switch'
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
  const played = useRef(false)
  const lastMode = useRef<WhaleAppearMode | undefined>(undefined)
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

  const { opacity, size, colorMode, customColor } = settings
  useEffect(() => {
    whale.current?.update({ ...WHALE_ARTWORK, activeOpacity: opacity, scale: size })
  }, [opacity, size, colorMode, customColor])

  const { appearMode, intervalSeconds } = settings
  useEffect(() => {
    whale.current?.setAutoPlay(isTimed(appearMode) && !hero ? intervalSeconds * 1000 : undefined, false)
    if (hero || !isSwitched(appearMode)) {
      lastMode.current = appearMode
      return
    }
    if (played.current && lastMode.current === appearMode) return
    played.current = true
    lastMode.current = appearMode
    whale.current?.play()
  }, [appearMode, intervalSeconds, hero])

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    if (isBlankClick(event)) whale.current?.play()
  }

  const visible = hero || appearMode !== 'off'
  return (
    <div
      className={hero || !visible ? css.layer : css.autoLayer}
      data-whale-layer={hero ? 'hero' : appearMode === 'off' ? 'plain' : appearMode}
      onClick={onClick}
    >
      {visible && (
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
