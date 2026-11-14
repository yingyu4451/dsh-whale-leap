/**
 * Settings page of the whale-leap plugin.
 *
 * The page keeps only playback controls plus a preview stage per tab; every
 * appearance control lives in the floating {@link PeekBar}, which is opened by
 * the 实时预览 button and lets the background and running icon be tuned against
 * the real conversation. Controls are disabled when the Host reports the
 * section as read-only.
 */
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { BG_OFFSET_RANGE, COLOR_MODES, FRAME_MODES, INTERVAL_RANGE, MARK_LABEL_SIZE_RANGE, MARK_MOTIONS, MARK_OFFSET_RANGE, MARK_SIZE_RANGE, MARK_SWING_RANGE, OPACITY_RANGE, SIZE_RANGE } from '../../../shared/settings.js'
import type { WhaleColorMode, WhaleFillStyle, WhaleMarkMotion, WhaleSettingsState } from '../settings.js'
import type { Store } from '../store.js'
import type { LocaleKey } from '../i18n.js'
import { WHALE_ARTWORK } from '../whale/artwork.js'
import { attachPixelWhale, type PixelWhaleHandle } from '../whale/renderer.js'
import { PEEK_INTERVAL_MS, PEEK_PLAY_EVENT, replayPeek, setPeekMode } from '../whale/peek.js'
import { WhaleMarkFish } from '../whale/WhaleMarkFish.js'
import { PLUGIN_VERSION } from '../version.js'
import { RELEASES_URL, checkForUpdate, type UpdateResult } from '../update.js'
import { ATLAS_URL } from '../atlas.js'
import css from './settings.module.css'

/** Translation function handed in by the slot locale binding. */
type Translate = (key: LocaleKey, params?: Record<string, unknown>) => string

/** Settings tab identifiers. */
export type Tab = 'background' | 'mark'

/** Write callbacks the page calls on user input. */
export interface SettingsPageActions {
  /** Switch the ink source. */
  setColorMode: (mode: WhaleColorMode) => void
  /** Pick a custom ink color. */
  setCustomColor: (color: string) => void
  /** Resize the background scene. */
  setSize: (size: number) => void
  /** Change the ink strength response. */
  setOpacity: (opacity: number) => void
  /** Choose which painting the whale shows. */
  setFillStyle: (style: WhaleFillStyle, enabled: boolean) => void
  /** Enable automatic replays in a started conversation. */
  setAutoAppear: (enabled: boolean) => void
  /** Replay at once when a conversation is entered. */
  setPlayOnSwitch: (enabled: boolean) => void
  /** Set the replay interval. */
  setInterval: (seconds: number) => void
  /** Replace the shipped running icon with the fish mark. */
  setReplaceMark: (enabled: boolean) => void
  /** Switch the running mark color source. */
  setMarkColorMode: (mode: WhaleColorMode) => void
  /** Pick a custom running mark color. */
  setMarkColor: (color: string) => void
  /** Switch the running status label color source. */
  setLabelColorMode: (mode: WhaleColorMode) => void
  /** Pick a custom running status label color. */
  setLabelColor: (color: string) => void
  /** Set the running mark size. */
  setMarkSize: (px: number) => void
  /** Set the running status label size. */
  setMarkLabelSize: (px: number) => void
  /** Scale the horizontal swing of the animated mark. */
  setMarkSwing: (amplitude: number) => void
  /** Set the animated mark's horizontal start offset. */
  setMarkOffsetX: (px: number) => void
  /** Set the animated mark's vertical start offset. */
  setMarkOffsetY: (px: number) => void
  /** Move the background scene horizontally. */
  setBgOffsetX: (px: number) => void
  /** Move the background scene vertically. */
  setBgOffsetY: (px: number) => void
  /** Choose the running mark motion. */
  setMarkMotion: (motion: WhaleMarkMotion) => void
}

/** Props of {@link SettingsPage}. */
export interface SettingsPageProps {
  /** Close the settings page. */
  close?: () => void
  /** Locale-bound translator. */
  t: Translate
  /** Live whale settings. */
  state: Store<WhaleSettingsState>
  /** Write callbacks. */
  actions: SettingsPageActions
  /** Tab shown first; the settings host always opens the background tab. */
  initialTab?: Tab
}

/** Settings tabs. */
const TABS: readonly { value: Tab; label: LocaleKey }[] = [
  { value: 'background', label: 'tabBackground' },
  { value: 'mark', label: 'tabMark' },
]

/** Labels for the motion presets. */
const MOTION_LABELS: Record<WhaleMarkMotion, LocaleKey> = {
  swim: 'motionSwim',
  explore: 'motionExplore',
  hero: 'motionHero',
  sway: 'motionSway',
}

/** Labels for the selectable ink textures. */
const FRAME_LABELS: Record<WhaleFillStyle, LocaleKey> = {
  pixels: 'frameDots',
  code: 'frameCode',
  glyphs: 'frameGlyphs',
  binary: 'frameBinary',
  lines: 'frameLines',
}

/** Replay cadence of the background preview stage. */
const PREVIEW_INTERVAL_MS = 4200

/** The preview stage draws a smaller scene than the real conversation background. */
const PREVIEW_SCALE = 0.8

/**
 * Format a start offset for the slider value label.
 * @param px - offset in pixels.
 * @returns the signed pixel value, e.g. `+2.5px`, `0px`, `-1px`.
 */
function formatOffsetPx(px: number): string {
  const rounded = Number.isInteger(px) ? String(px) : px.toFixed(1)
  return `${px > 0 ? '+' : ''}${rounded}px`
}

/** One labelled settings row. */
function Row({ label, hint, control, stack = false }: {
  label: string
  hint?: string
  control: ReactNode
  /** Stack the control under the label at very narrow widths. */
  stack?: boolean
}) {
  return (
    <div className={stack ? `${css.row} ${css.rowStacked}` : css.row}>
      <div className={css.rowText}>
        <span className={css.label}>{label}</span>
        {hint !== undefined && <span className={css.hint}>{hint}</span>}
      </div>
      <div className={css.control}>{control}</div>
    </div>
  )
}

/** One titled group of related settings. */
function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={css.group} aria-label={title}>
      <h3 className={css.groupTitle}>{title}</h3>
      <div className={css.card}>{children}</div>
    </section>
  )
}

/** One slider row. */
function SliderRow(props: {
  id: string
  label: string
  hint?: string
  value: number
  min: number
  max: number
  step: number
  display: string
  disabled: boolean
  onChange: (value: number) => void
}) {
  return (
    <Row
      stack
      label={props.label}
      hint={props.hint}
      control={
        <span className={css.sliderField}>
          <input
            id={props.id}
            type="range"
            className={css.slider}
            min={props.min}
            max={props.max}
            step={props.step}
            value={props.value}
            disabled={props.disabled}
            onChange={event => {
              props.onChange(Number(event.target.value))
            }}
          />
          <span className={css.sliderValue}>{props.display}</span>
        </span>
      }
    />
  )
}

/** One segmented choice row. */
function ChoiceRow<Value extends string>(props: {
  label: string
  value: Value
  options: readonly { value: Value; label: string }[]
  disabled: boolean
  onChange: (value: Value) => void
}) {
  return (
    <div className={css.choice} role="group" aria-label={props.label}>
      {props.options.map(option => (
        <button
          key={option.value}
          type="button"
          className={props.value === option.value ? css.choiceSelected : css.choiceButton}
          aria-pressed={props.value === option.value}
          disabled={props.disabled}
          onClick={() => {
            props.onChange(option.value)
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

/** One color-source row: theme/custom choice plus the picker for a custom pick. */
function ColorPickerRow(props: {
  id: string
  label: string
  hint: string
  themeLabel: string
  customLabel: string
  mode: WhaleColorMode
  color: string
  disabled: boolean
  onMode: (mode: WhaleColorMode) => void
  onColor: (color: string) => void
}) {
  return (
    <Row
      stack
      label={props.label}
      hint={props.hint}
      control={
        <span className={css.colorGroup} id={props.id}>
          <ChoiceRow
            label={props.label}
            value={props.mode}
            disabled={props.disabled}
            options={COLOR_MODES.map(mode => ({ value: mode, label: mode === 'theme' ? props.themeLabel : props.customLabel }))}
            onChange={props.onMode}
          />
          {props.mode === 'custom' && (
            <span className={css.colorField}>
              <input
                id={`${props.id}-picker`}
                className={css.colorInput}
                type="color"
                aria-label={props.customLabel}
                value={props.color}
                disabled={props.disabled}
                onChange={event => {
                  props.onColor(event.target.value)
                }}
              />
              <span className={css.colorValue}>{props.color.toUpperCase()}</span>
            </span>
          )}
        </span>
      }
    />
  )
}

/** One switch row. */
function ToggleRow(props: { label: string; hint: string; checked: boolean; disabled: boolean; onChange: (checked: boolean) => void }) {
  return (
    <Row
      label={props.label}
      hint={props.hint}
      control={
        <button
          type="button"
          role="switch"
          aria-checked={props.checked}
          aria-label={props.label}
          disabled={props.disabled}
          className={css.switch}
          onClick={() => {
            props.onChange(!props.checked)
          }}
        >
          <span className={css.switchThumb} />
        </button>
      }
    />
  )
}

/**
 * Live background preview: a real whale canvas that replays on a fixed cadence.
 * @param props.settings - live settings.
 * @returns the preview canvas.
 */
function PreviewWhale({ settings, replayToken }: { settings: WhaleSettingsState; replayToken: number }) {
  const whale = useRef<PixelWhaleHandle | undefined>(undefined)
  const node = useRef<HTMLCanvasElement | null>(null)
  const latest = useRef(settings)
  latest.current = settings

  const canvasRef = useCallback((canvas: HTMLCanvasElement | null) => {
    whale.current?.dispose()
    node.current = canvas
    if (canvas === null) {
      whale.current = undefined
      return
    }
    const handle = attachPixelWhale(canvas, WHALE_ARTWORK, ATLAS_URL, 'local')
    whale.current = handle
    handle.prefetch()
    const current = latest.current
    handle.update({ ...WHALE_ARTWORK, activeOpacity: current.opacity, scale: current.size * PREVIEW_SCALE, offsetX: current.bgOffsetX, offsetY: current.bgOffsetY })
    handle.setFillStyles(current.fillStyles)
    handle.setAutoPlay(PREVIEW_INTERVAL_MS)
  }, [])

  const { opacity, size, colorMode, customColor, fillStyles, bgOffsetX, bgOffsetY } = settings
  useEffect(() => {
    const handle = whale.current
    if (handle === undefined) return
    handle.update({ ...WHALE_ARTWORK, activeOpacity: opacity, scale: size * PREVIEW_SCALE, offsetX: bgOffsetX, offsetY: bgOffsetY })
    handle.play()
  }, [opacity, size, colorMode, customColor, bgOffsetX, bgOffsetY])

  const fillStyleKey = fillStyles.join(',')
  useEffect(() => {
    const handle = whale.current
    if (handle === undefined) return
    handle.setFillStyles(fillStyles)
    handle.play()
  }, [fillStyleKey])

  useEffect(() => {
    if (replayToken === 0) return
    whale.current?.play()
  }, [replayToken])

  useEffect(() => {
    const canvas = node.current
    if (canvas === null) return
    const custom = colorMode === 'custom'
    canvas.style.color = custom ? customColor : ''
    canvas.style.setProperty('--home-whale-code-ink', custom ? customColor : '')
  }, [colorMode, customColor])

  return <canvas ref={canvasRef} className={css.stageCanvas} aria-hidden="true" />
}

/**
 * Simulated conversation shown while the live preview is open. It draws a mock
 * chat window over the current page so appearance changes can be judged in a
 * conversation-like context; no real conversation data is read or modified.
 * @param props.t - locale-bound translator.
 * @param props.state - live whale settings.
 * @returns the simulated scene.
 */
function SimConversation({ t, state }: { t: Translate; state: Store<WhaleSettingsState> }) {
  const settings = useSyncExternalStore(state.subscribe, state.getSnapshot, state.getSnapshot)
  const whale = useRef<PixelWhaleHandle | undefined>(undefined)
  const node = useRef<HTMLCanvasElement | null>(null)
  const latest = useRef(settings)
  latest.current = settings

  const canvasRef = useCallback((canvas: HTMLCanvasElement | null) => {
    whale.current?.dispose()
    node.current = canvas
    if (canvas === null) {
      whale.current = undefined
      return
    }
    const handle = attachPixelWhale(canvas, WHALE_ARTWORK, ATLAS_URL, 'local')
    whale.current = handle
    handle.prefetch()
    const current = latest.current
    handle.update({ ...WHALE_ARTWORK, activeOpacity: current.opacity, scale: current.size, offsetX: current.bgOffsetX, offsetY: current.bgOffsetY })
    handle.setFillStyles(current.fillStyles)
    handle.setAutoPlay(PREVIEW_INTERVAL_MS)
  }, [])

  const { opacity, size, colorMode, customColor, fillStyles, bgOffsetX, bgOffsetY } = settings
  useEffect(() => {
    whale.current?.update({ ...WHALE_ARTWORK, activeOpacity: opacity, scale: size, offsetX: bgOffsetX, offsetY: bgOffsetY })
  }, [opacity, size, bgOffsetX, bgOffsetY])

  const fillStyleKey = fillStyles.join(',')
  useEffect(() => {
    whale.current?.setFillStyles(fillStyles)
  }, [fillStyleKey])

  useEffect(() => {
    const canvas = node.current
    if (canvas === null) return
    const custom = colorMode === 'custom'
    canvas.style.color = custom ? customColor : ''
    canvas.style.setProperty('--home-whale-code-ink', custom ? customColor : '')
  }, [colorMode, customColor])

  useEffect(() => {
    const replay = (): void => {
      whale.current?.play()
    }
    window.addEventListener(PEEK_PLAY_EVENT, replay)
    return () => {
      window.removeEventListener(PEEK_PLAY_EVENT, replay)
    }
  }, [])

  return (
    <div className={css.simScene} aria-hidden="true">
      <div className={css.simWindow}>
        <canvas ref={canvasRef} className={css.simCanvas} />
        <div className={css.simChrome}>
          <span className={css.simDots} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className={css.simTitle}>{t('simTitle')}</span>
        </div>
        <div className={css.simChat}>
          <div className={css.simUser}>{t('simUser')}</div>
          <div className={css.simReply}>{t('simReply')}</div>
          <div className={css.simRunning}>
            <span className={css.simRunningIcon} aria-hidden="true" />
            {t('runningLabel')}
          </div>
          <div className={css.simComposer}>
            <span className={css.simComposerText}>{t('simPlaceholder')}</span>
            <span className={css.simComposerSend} aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Multi-select fill-style buttons. Every enabled style takes part in the
 * playback rotation, and the last enabled style cannot be switched off.
 * @param props.t - locale-bound translator.
 * @param props.styles - enabled fill styles.
 * @param props.disabled - whether the whole control is read-only.
 * @param props.onToggle - enable or disable one style.
 * @returns the button row.
 */
function FillStyleButtons({ t, styles, disabled, onToggle }: {
  t: Translate
  styles: WhaleFillStyle[]
  disabled: boolean
  onToggle: (style: WhaleFillStyle, enabled: boolean) => void
}) {
  return (
    <div className={css.choice} role="group" aria-label={t('fillStyle')}>
      {FRAME_MODES.map(style => {
        const selected = styles.includes(style)
        return (
          <button
            key={style}
            type="button"
            className={selected ? `${css.choiceButton} ${css.choiceButtonActive}` : css.choiceButton}
            aria-pressed={selected}
            disabled={disabled || (selected && styles.length === 1)}
            onClick={() => {
              onToggle(style, !selected)
            }}
          >
            {t(FRAME_LABELS[style])}
          </button>
        )
      })}
    </div>
  )
}

/**
 * Floating appearance panel shown while the settings dialog is hidden, so the
 * background and running icon can be tuned against the real conversation.
 * @param props.t - locale-bound translator.
 * @param props.state - live whale settings.
 * @param props.actions - write callbacks.
 * @param props.onReturn - restore the settings dialog.
 * @param props.initialTab - tab rendered first (used by the render smoke check).
 * @returns the floating bar.
 */
export function PeekBar({ t, state, actions, onReturn, initialTab = 'background' }: {
  t: Translate
  state: Store<WhaleSettingsState>
  actions: SettingsPageActions
  onReturn: () => void
  initialTab?: 'background' | 'mark'
}) {
  const settings = useSyncExternalStore(state.subscribe, state.getSnapshot, state.getSnapshot)
  const disabled = !settings.writable
  const markDisabled = disabled || !settings.replaceMark
  const [tab, setTab] = useState<'background' | 'mark'>(initialTab)
  return (
    <div className={css.peekBar} role="dialog" aria-label={t('peekTitle')} title={t('peekHint')}>
      <div className={css.peekHead}>
        <span className={css.peekTitle}>{t('peekTitle')}</span>
        <div className={css.peekTabs} role="tablist" aria-label={t('nav')}>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'background'}
            className={tab === 'background' ? css.peekTabActive : css.peekTab}
            onClick={() => {
              setTab('background')
            }}
          >
            {t('tabBackground')}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'mark'}
            className={tab === 'mark' ? css.peekTabActive : css.peekTab}
            onClick={() => {
              setTab('mark')
            }}
          >
            {t('tabMark')}
          </button>
        </div>
        <button type="button" className={css.peekReplay} onClick={replayPeek}>
          {t('replay')}
        </button>
        <button type="button" className={css.peekReturn} onClick={onReturn}>
          {t('peekReturn')}
        </button>
      </div>
      <div className={css.peekBody}>
        {tab === 'background' ? (
          <div className={css.peekGroup}>
            <ColorPickerRow
              id="whale-leap-custom-color"
              label={t('color')}
              hint={t('colorHint')}
              themeLabel={t('colorTheme')}
              customLabel={t('colorCustom')}
              mode={settings.colorMode}
              color={settings.customColor}
              disabled={disabled}
              onMode={actions.setColorMode}
              onColor={actions.setCustomColor}
            />
            <SliderRow
              id="whale-leap-size"
              label={t('size')}
              hint={t('sizeHint')}
              value={settings.size}
              min={SIZE_RANGE.min}
              max={SIZE_RANGE.max}
              step={SIZE_RANGE.step}
              display={`${Math.round(settings.size * 100)}%`}
              disabled={disabled}
              onChange={actions.setSize}
            />
            <SliderRow
              id="whale-leap-strength"
              label={t('strength')}
              hint={t('strengthHint')}
              value={settings.opacity}
              min={OPACITY_RANGE.min}
              max={OPACITY_RANGE.max}
              step={OPACITY_RANGE.step}
              display={`${Math.round(settings.opacity * 100)}%`}
              disabled={disabled}
              onChange={actions.setOpacity}
            />
            <SliderRow
              id="whale-leap-bg-offset-x"
              label={t('bgOffsetX')}
              hint={t('bgOffsetXHint')}
              value={settings.bgOffsetX}
              min={BG_OFFSET_RANGE.min}
              max={BG_OFFSET_RANGE.max}
              step={BG_OFFSET_RANGE.step}
              display={formatOffsetPx(settings.bgOffsetX)}
              disabled={disabled}
              onChange={actions.setBgOffsetX}
            />
            <SliderRow
              id="whale-leap-bg-offset-y"
              label={t('bgOffsetY')}
              hint={t('bgOffsetYHint')}
              value={settings.bgOffsetY}
              min={BG_OFFSET_RANGE.min}
              max={BG_OFFSET_RANGE.max}
              step={BG_OFFSET_RANGE.step}
              display={formatOffsetPx(settings.bgOffsetY)}
              disabled={disabled}
              onChange={actions.setBgOffsetY}
            />
            <div className={css.subTitle}>{t('fillStyle')}</div>
            <FillStyleButtons
              t={t}
              styles={settings.fillStyles}
              disabled={disabled}
              onToggle={actions.setFillStyle}
            />
            <p className={css.note}>{t('fillStyleHint')}</p>
          </div>
        ) : (
          <div className={css.peekGroup}>
            <ToggleRow
              label={t('replaceMark')}
              hint={t('replaceMarkHint')}
              checked={settings.replaceMark}
              disabled={disabled}
              onChange={actions.setReplaceMark}
            />
            <ColorPickerRow
              id="whale-leap-mark-color"
              label={t('markColor')}
              hint={t('markColorHint')}
              themeLabel={t('colorTheme')}
              customLabel={t('colorCustom')}
              mode={settings.markColorMode}
              color={settings.markColor}
              disabled={markDisabled}
              onMode={actions.setMarkColorMode}
              onColor={actions.setMarkColor}
            />
            <ColorPickerRow
              id="whale-leap-label-color"
              label={t('labelColor')}
              hint={t('labelColorHint')}
              themeLabel={t('colorTheme')}
              customLabel={t('colorCustom')}
              mode={settings.labelColorMode}
              color={settings.labelColor}
              disabled={markDisabled}
              onMode={actions.setLabelColorMode}
              onColor={actions.setLabelColor}
            />
            <SliderRow
              id="whale-leap-mark-size"
              label={t('markSize')}
              hint={t('markSizeHint')}
              value={settings.markSize}
              min={MARK_SIZE_RANGE.min}
              max={MARK_SIZE_RANGE.max}
              step={MARK_SIZE_RANGE.step}
              display={`${settings.markSize}px`}
              disabled={markDisabled}
              onChange={actions.setMarkSize}
            />
            <SliderRow
              id="whale-leap-mark-label-size"
              label={t('labelSize')}
              hint={t('labelSizeHint')}
              value={settings.markLabelSize}
              min={MARK_LABEL_SIZE_RANGE.min}
              max={MARK_LABEL_SIZE_RANGE.max}
              step={MARK_LABEL_SIZE_RANGE.step}
              display={`${settings.markLabelSize}px`}
              disabled={markDisabled}
              onChange={actions.setMarkLabelSize}
            />
            <SliderRow
              id="whale-leap-mark-offset-x"
              label={t('offsetX')}
              hint={t('offsetXHint')}
              value={settings.markOffsetX}
              min={MARK_OFFSET_RANGE.min}
              max={MARK_OFFSET_RANGE.max}
              step={MARK_OFFSET_RANGE.step}
              display={formatOffsetPx(settings.markOffsetX)}
              disabled={markDisabled}
              onChange={actions.setMarkOffsetX}
            />
            <SliderRow
              id="whale-leap-mark-offset-y"
              label={t('offsetY')}
              hint={t('offsetYHint')}
              value={settings.markOffsetY}
              min={MARK_OFFSET_RANGE.min}
              max={MARK_OFFSET_RANGE.max}
              step={MARK_OFFSET_RANGE.step}
              display={formatOffsetPx(settings.markOffsetY)}
              disabled={markDisabled}
              onChange={actions.setMarkOffsetY}
            />
            <div className={css.subTitle}>{t('motion')}</div>
            <div className={css.choice} role="group" aria-label={t('motion')}>
              {MARK_MOTIONS.map(motion => {
                const selected = settings.markMotion === motion
                return (
                  <button
                    key={motion}
                    type="button"
                    className={selected ? `${css.choiceButton} ${css.choiceButtonActive}` : css.choiceButton}
                    aria-pressed={selected}
                    disabled={markDisabled}
                    onClick={() => {
                      actions.setMarkMotion(motion)
                    }}
                  >
                    {t(MOTION_LABELS[motion])}
                  </button>
                )
              })}
            </div>
            <SliderRow
              id="whale-leap-mark-swing"
              label={t('swing')}
              hint={t('swingHint')}
              value={settings.markSwing}
              min={MARK_SWING_RANGE.min}
              max={MARK_SWING_RANGE.max}
              step={MARK_SWING_RANGE.step}
              display={`${Math.round(settings.markSwing * 100)}%`}
              disabled={markDisabled || settings.markMotion === 'hero'}
              onChange={actions.setMarkSwing}
            />
            <p className={css.note}>{t('motionHint')}</p>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Find the fixed overlay that hosts the settings dialog, so preview mode can
 * hide it without hiding the conversation behind it.
 * @param start - the plugin settings section.
 * @returns the overlay element, or the dialog itself when no full-size overlay exists.
 */
function findSettingsOverlay(start: HTMLElement | null): HTMLElement | null {
  if (start === null || typeof window === 'undefined') return null
  let dialog: HTMLElement | null = null
  let overlay: HTMLElement | null = null
  let node: HTMLElement | null = start
  while (node !== null && node !== document.body) {
    if (node.getAttribute('role') === 'dialog') dialog = node
    const style = getComputedStyle(node)
    if (style.position === 'fixed') {
      const box = node.getBoundingClientRect()
      if (box.width >= window.innerWidth * 0.9 && box.height >= window.innerHeight * 0.5) overlay = node
    }
    node = node.parentElement
  }
  return overlay ?? dialog
}

/**
 * Plugin settings page.
 * @param props.t - locale-bound translator.
 * @param props.state - live whale settings.
 * @param props.actions - write callbacks.
 * @returns the page.
 */
export function SettingsPage({ t, state, actions, initialTab = 'background' }: SettingsPageProps) {
  const settings = useSyncExternalStore(state.subscribe, state.getSnapshot, state.getSnapshot)
  const [tab, setTab] = useState<Tab>(initialTab)
  const [update, setUpdate] = useState<UpdateResult>({ status: 'idle' })
  const [replayToken, setReplayToken] = useState(0)
  const rootRef = useRef<HTMLElement | null>(null)
  const [peeking, setPeeking] = useState(false)
  const overlayRef = useRef<{ element: HTMLElement; display: string } | null>(null)
  const live = useRef({ t, state, actions })
  live.current = { t, state, actions }
  const disabled = !settings.writable

  useEffect(() => {
    if (!peeking) return
    const overlay = findSettingsOverlay(rootRef.current)
    if (overlay !== null) {
      overlayRef.current = { element: overlay, display: overlay.style.display }
      overlay.style.display = 'none'
    }
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    root.render(
      <>
        <SimConversation t={live.current.t} state={live.current.state} />
        <PeekBar
          t={live.current.t}
          state={live.current.state}
          actions={live.current.actions}
          onReturn={() => {
            setPeeking(false)
          }}
        />
      </>,
    )
    setPeekMode(true)
    const onKey = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      event.stopImmediatePropagation()
      setPeeking(false)
    }
    window.addEventListener('keydown', onKey, true)
    const safety = window.setTimeout(() => {
      setPeeking(false)
    }, 120000)
    return () => {
      window.clearTimeout(safety)
      window.removeEventListener('keydown', onKey, true)
      setPeekMode(false)
      root.unmount()
      host.remove()
      const hidden = overlayRef.current
      if (hidden !== null) {
        hidden.element.style.display = hidden.display
        overlayRef.current = null
      }
    }
  }, [peeking])

  const checkForUpdates = useCallback(async (): Promise<void> => {
    setUpdate({ status: 'checking' })
    setUpdate(await checkForUpdate())
  }, [])

  let updateNotice = ''
  if (update.status === 'latest' && update.latest !== undefined) {
    updateNotice = t('upToDate', { version: update.latest })
  } else if (update.status === 'available' && update.latest !== undefined) {
    updateNotice = t('updateAvailable', { version: update.latest })
  } else if (update.status === 'failed') {
    updateNotice = t('updateFailed')
  } else if (update.status === 'rate-limited') {
    updateNotice = t('updateRateLimited')
  } else if (update.status === 'network') {
    updateNotice = t('updateNetwork')
  } else if (update.status === 'timeout') {
    updateNotice = t('updateTimeout')
  } else if (update.status === 'no-release') {
    updateNotice = t('noRelease')
  }
  const canOpenReleases =
    update.status === 'available' ||
    update.status === 'failed' ||
    update.status === 'rate-limited' ||
    update.status === 'network' ||
    update.status === 'timeout'

  return (
    <section className={css.section} ref={rootRef} data-whale-leap-settings>
      <div className={css.stickyTop}>
        <header className={css.header}>
        <div className={css.headerTop}>
          <h2 className={css.title}>{t('nav')}</h2>
          <span className={css.version}>{t('version', { version: PLUGIN_VERSION })}</span>
          <button
            type="button"
            className={css.updateButton}
            disabled={update.status === 'checking'}
            onClick={() => {
              void checkForUpdates()
            }}
          >
            {update.status === 'checking' ? (
              <>
                <span className={css.updateSpinner} aria-hidden="true" />
                {t('checking')}
              </>
            ) : (
              t('checkUpdate')
            )}
          </button>
        </div>
        <p className={css.intro}>{t('intro')}</p>
        {(updateNotice !== '' || canOpenReleases) && (
          <div className={css.updateRow}>
            <span className={css.updateNotice} role="status" data-status={update.status}>
              {updateNotice}
            </span>
            {canOpenReleases && (
              <a
                className={css.updateLink}
                href={update.url ?? RELEASES_URL}
                target="_blank"
                rel="noreferrer"
              >
                {t('viewVersion')}
              </a>
            )}
          </div>
        )}
      </header>

      <div className={css.tabs} role="tablist" aria-label={t('nav')}>
        {TABS.map(item => (
          <button
            key={item.value}
            type="button"
            role="tab"
            id={`whale-leap-tab-${item.value}`}
            aria-selected={tab === item.value}
            aria-controls={`whale-leap-panel-${item.value}`}
            className={tab === item.value ? css.tabSelected : css.tab}
            onClick={() => {
              setTab(item.value)
            }}
          >
            {t(item.label)}
          </button>
        ))}
      </div>

      {tab === 'background' ? (
        <div className={css.stage}>
          <PreviewWhale settings={settings} replayToken={replayToken} />
          <div className={css.stageActions}>
            <button
              type="button"
              className={css.stageReplay}
              onClick={() => {
                setReplayToken(token => token + 1)
              }}
            >
              {t('replay')}
            </button>
            <button
              type="button"
              className={css.stageLive}
              onClick={() => {
                setPeeking(true)
              }}
            >
              {t('livePreview')}
            </button>
          </div>
        </div>
      ) : (
        <div className={css.markStage}>
          {settings.replaceMark ? (
            <div className={css.markSim}>
              <span className={css.markSimDivider} aria-hidden="true" />
              <span className={css.markSimContent}>
                <span className={css.markIcon}>
                  <WhaleMarkFish
                    size={settings.markSize}
                    motion={settings.markMotion}
                    swing={settings.markSwing}
                    offsetX={settings.markOffsetX}
                    offsetY={settings.markOffsetY}
                    color={settings.markColorMode === 'custom' ? settings.markColor : undefined}
                  />
                </span>
                <span
                  className={css.markRunningLabel}
                  style={{
                    fontSize: `${settings.markLabelSize}px`,
                    color: settings.labelColorMode === 'custom' ? settings.labelColor : undefined,
                  }}
                  data-running-label
                >
                  {t('runningLabel')}
                </span>
              </span>
            </div>
          ) : (
            <span className={css.markStageOff}>{t('markStageOff')}</span>
          )}
          <div className={css.stageActions}>
            <button
              type="button"
              className={css.stageLive}
              onClick={() => {
                setPeeking(true)
              }}
            >
              {t('livePreview')}
            </button>
          </div>
          {settings.replaceMark && <span className={css.stageHint}>{t('markPreviewHint')}</span>}
        </div>
      )}
      </div>

      <div className={css.panel}>
        <Group title={t('groupPlayback')}>
          <ToggleRow
            label={t('auto')}
            hint={settings.autoAppear ? t('autoHint') : t('autoOffHint')}
            checked={settings.autoAppear}
            disabled={disabled}
            onChange={actions.setAutoAppear}
          />

          {settings.autoAppear && (
            <>
              <ToggleRow
                label={t('playOnSwitch')}
                hint={t('playOnSwitchHint')}
                checked={settings.playOnSwitch}
                disabled={disabled}
                onChange={actions.setPlayOnSwitch}
              />

              <SliderRow
                id="whale-leap-interval"
                label={t('interval')}
                hint={t('intervalHint')}
                value={settings.intervalSeconds}
                min={INTERVAL_RANGE.min}
                max={INTERVAL_RANGE.max}
                step={INTERVAL_RANGE.step}
                display={t('intervalSeconds', { seconds: settings.intervalSeconds })}
                disabled={disabled}
                onChange={actions.setInterval}
              />
            </>
          )}
        </Group>
      </div>
    </section>
  )
}


