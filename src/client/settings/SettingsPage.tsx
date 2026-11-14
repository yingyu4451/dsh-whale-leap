/**
 * Settings page of the whale-leap plugin.
 *
 * The page is only an entry point: every appearance and playback control lives
 * in the floating {@link PeekBar}, which is opened by the 实时预览 button and
 * lets the background and running icon be tuned against the real conversation.
 * Controls are disabled when the Host reports the section as read-only.
 */
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { BG_OFFSET_RANGE, COLOR_MODES, FRAME_MODES, INTERVAL_RANGE, MARK_LABEL_SIZE_RANGE, MARK_MOTIONS, MARK_OFFSET_RANGE, MARK_SIZE_RANGE, MARK_SWING_RANGE, OPACITY_RANGE, SIZE_RANGE } from '../../../shared/settings.js'
import type { WhaleColorMode, WhaleFillStyle, WhaleMarkMotion, WhaleSettingsState } from '../settings.js'
import type { Store } from '../store.js'
import type { LocaleKey } from '../i18n.js'
import { replayPeek, setPeekMode } from '../whale/peek.js'
import { WhaleMarkFish } from '../whale/WhaleMarkFish.js'
import { PLUGIN_VERSION } from '../version.js'
import { RELEASES_URL, checkForUpdate, type UpdateResult } from '../update.js'
import css from './settings.module.css'

/** Translation function handed in by the slot locale binding. */
type Translate = (key: LocaleKey, params?: Record<string, unknown>) => string

/** Tab identifiers of the live preview panel. */
type PeekTab = 'background' | 'mark' | 'playback'

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
}

/** Tabs of the floating live preview panel. */
const PEEK_TABS: readonly { value: PeekTab; label: LocaleKey }[] = [
  { value: 'background', label: 'tabBackground' },
  { value: 'mark', label: 'tabMark' },
  { value: 'playback', label: 'tabPlayback' },
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

/**
 * Edge fraction of the rendered scene that the atlas frames keep sparse
 * particles in. Random placement targets the inner part so the whale itself
 * stays visible while the canvas edges only clip stray particles.
 */
const WHALE_INSET = 0.2

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
 * Pick a random background offset that keeps the whole whale scene visible.
 *
 * The range mirrors the renderer's fit math (`scene = clamp(...) * size` and the
 * offset unit `width / 1000`), so any pick keeps the whale's core inside the
 * canvas instead of letting the animation clip at an edge. The atlas frames
 * carry sparse edge particles, so the fit targets the inner `WHALE_INSET` of the
 * scene rather than its exact bounding box (which is always canvas-sized).
 * @param settings - live whale settings.
 * @returns offsets in settings units, or null when no conversation canvas is mounted.
 */
function randomBackgroundOffset(settings: WhaleSettingsState): { x: number; y: number } | null {
  if (typeof document === 'undefined') return null
  const canvas = document.querySelector<HTMLCanvasElement>('[data-whale-layer] canvas')
  if (canvas === null) return null
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  if (width <= 0 || height <= 0) return null
  const sceneWidth = Math.min(Math.max(width * 0.94, 720), height * 1.6, 1120) * 1.12 * settings.size
  const sceneHeight = sceneWidth * 0.5625
  const baseLeft = (width - sceneWidth) / 2
  const baseTop = height * 0.43 - sceneHeight / 2
  const unit = width / 1000
  const inset = WHALE_INSET
  const coreWidth = sceneWidth * (1 - inset * 2)
  const coreHeight = sceneHeight * (1 - inset * 2)
  const fit = (min: number, max: number): number => {
    if (max < min) return Math.round((min + max) / 2)
    return Math.round(min + Math.random() * (max - min))
  }
  const x = fit((-baseLeft - inset * sceneWidth) / unit, (width - baseLeft - inset * sceneWidth - coreWidth) / unit)
  const y = fit((-baseTop - inset * sceneHeight) / unit, (height - baseTop - inset * sceneHeight - coreHeight) / unit)
  const clamp = (value: number): number => Math.max(BG_OFFSET_RANGE.min, Math.min(BG_OFFSET_RANGE.max, value))
  return { x: clamp(x), y: clamp(y) }
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
  initialTab?: PeekTab
}) {
  const settings = useSyncExternalStore(state.subscribe, state.getSnapshot, state.getSnapshot)
  const disabled = !settings.writable
  const markDisabled = disabled || !settings.replaceMark
  const [tab, setTab] = useState<PeekTab>(initialTab)
  return (
    <div className={css.peekBar} role="dialog" aria-label={t('peekTitle')} title={t('peekHint')}>
      <div className={css.peekHead}>
        <span className={css.peekTitle}>{t('peekTitle')}</span>
        <div className={css.peekTabs} role="tablist" aria-label={t('nav')}>
          {PEEK_TABS.map(item => (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={tab === item.value}
              className={tab === item.value ? css.peekTabActive : css.peekTab}
              onClick={() => {
                setTab(item.value)
              }}
            >
              {t(item.label)}
            </button>
          ))}
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
            <Row
              label={t('bgPosition')}
              hint={t('bgPositionHint')}
              control={
                <button
                  type="button"
                  className={css.randomButton}
                  disabled={disabled}
                  onClick={() => {
                    const next = randomBackgroundOffset(settings)
                    if (next === null) return
                    actions.setBgOffsetX(next.x)
                    actions.setBgOffsetY(next.y)
                  }}
                >
                  {t('randomPosition')}
                </button>
              }
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
        ) : tab === 'mark' ? (
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
        ) : (
          <div className={css.peekGroup}>
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
 * The real conversation elements reused by preview mode.
 */
interface ConversationThread {
  scroll: HTMLElement
  session: HTMLElement | null
  composer: HTMLElement | null
  width: number
}

/**
 * Measure the conversation column width the real messages are laid out in.
 * @param scroll - the real conversation scroll container.
 * @returns the resolved chat content width in pixels.
 */
function measureChatWidth(scroll: HTMLElement): number {
  const probe = document.createElement('div')
  probe.style.cssText = 'position:absolute;left:-9999px;visibility:hidden;width:var(--dsh-chat-content-width);'
  scroll.append(probe)
  const width = probe.getBoundingClientRect().width
  probe.remove()
  return width
}

/**
 * Find the real conversation transcript so preview mode can temporarily show
 * demo messages in place of the saved ones. Returns null on the home screen.
 * @returns the scroll container, session slot, composer seat and column width.
 */
function findConversationThread(): ConversationThread | null {
  if (typeof document === 'undefined') return null
  const scroll = document.querySelector<HTMLElement>('[data-conversation-scroll]')
  if (scroll === null) return null
  const tabs = [...document.querySelectorAll('[role="tablist"]')]
  const isConversation = tabs.some((tab) => (tab.textContent ?? '').includes('对话'))
  if (!isConversation) return null
  return {
    scroll,
    session: scroll.querySelector<HTMLElement>('[data-slot="conversation.session"]'),
    composer: scroll.querySelector<HTMLElement>('[data-composer-seat]'),
    width: measureChatWidth(scroll),
  }
}

/**
 * Render the running label with DSH's two-layer shimmer sweep.
 * Mirrors the shipped `TextShimmer`: the decorative copy rides a moving mask so
 * the highlight is clipped to the glyphs while the real copy stays selectable.
 * @param props.t - locale-bound translator.
 * @param props.settings - live whale settings.
 * @returns the shimmering running label.
 */
/** Elapsed seconds for the simulated running row; restarts every minute of preview. */
function useElapsedSeconds(): number {
  const [seconds, setSeconds] = useState(1)
  useEffect(() => {
    const timer = window.setInterval(() => { setSeconds(value => value + 1) }, 1000)
    return () => { window.clearInterval(timer) }
  }, [])
  return seconds
}

function DemoRunningLabel({ t, settings, seconds }: { t: Translate; settings: WhaleSettingsState; seconds: number }) {
  const text = t('runningElapsed', { seconds })
  const custom = settings.labelColorMode === 'custom' ? settings.labelColor : undefined
  const shimmer = custom === undefined
    ? 'var(--dsw-alias-label-deep-diving-shimmer)'
    : `color-mix(in srgb, ${custom} 55%, var(--dsw-alias-label-primary))`
  return (
    <span className={css.demoLabel} style={{ fontSize: settings.markLabelSize, color: custom }} data-demo-label data-running-label>
      <span className={css.demoLabelContent}>{text}</span>
      <span className={css.demoLabelDecoration} aria-hidden="true">
        <span className={css.demoLabelSweep} style={{ color: shimmer }}>
          <span className={css.demoLabelHighlight}>{text}</span>
        </span>
      </span>
    </span>
  )
}

function DemoRunningRow({ t, state }: { t: Translate; state: Store<WhaleSettingsState> }) {
  const settings = useSyncExternalStore(state.subscribe, state.getSnapshot, state.getSnapshot)
  const seconds = useElapsedSeconds()
  return (
    <div className={css.demoRunning} data-demo-running>
      <span className={css.demoRunningDivider} data-demo-divider aria-hidden="true" />
      <span className={css.demoRunningContent} data-demo-content>
        <span className={css.demoRunningIcon}>
          <WhaleMarkFish
            size={settings.markSize}
            motion={settings.markMotion}
            swing={settings.markSwing}
            offsetX={settings.markOffsetX}
            offsetY={settings.markOffsetY}
            color={settings.markColorMode === 'custom' ? settings.markColor : undefined}
          />
        </span>
        <DemoRunningLabel t={t} settings={settings} seconds={seconds} />
      </span>
    </div>
  )
}

/**
 * Demo messages shown inside the real conversation transcript during preview.
 * @param props.t - locale-bound translator.
 * @returns the demo thread.
 */
function DemoTranscript({ t }: { t: Translate }) {
  const exchanges = [
    { user: t('demoUser1'), reply: t('demoReply1') },
    { user: t('demoUser2'), reply: t('demoReply2') },
    { user: t('demoUser3'), reply: t('demoReply3') },
  ]
  const cards = [
    { title: t('demoImage1Title'), desc: t('demoImage1Desc') },
    { title: t('demoImage2Title'), desc: t('demoImage2Desc') },
  ]
  return (
    <div className={css.demoThread}>
      <p className={css.demoMeta}>{t('demoMeta')}</p>
      {exchanges.map((exchange, index) => (
        <div key={index} className={css.demoExchange}>
          <div className={css.demoUser}>{exchange.user}</div>
          <div className={css.demoReply}>{exchange.reply}</div>
          {index === exchanges.length - 1 && (
            <div className={css.demoCards}>
              {cards.map((card) => (
                <div key={card.title} className={css.demoCard} data-demo-card>
                  <span className={css.demoCardThumb} aria-hidden="true">
                    <svg viewBox="0 0 20 20" className={css.demoCardThumbIcon}>
                      <path d="M3 4.5h14v11H3z" fill="none" stroke="currentColor" strokeWidth="1.4" />
                      <path d="M3 13l4.2-4 3.4 3 2.6-2.4L17 13" fill="none" stroke="currentColor" strokeWidth="1.4" />
                      <circle cx="13.4" cy="7.4" r="1.3" fill="currentColor" />
                    </svg>
                  </span>
                  <span className={css.demoCardBody}>
                    <span className={css.demoCardTitle}>{card.title}</span>
                    <span className={css.demoCardDesc}>{card.desc}</span>
                  </span>
                  <span className={css.demoCardActions} aria-hidden="true">
                    <span className={css.demoCardAction}>{'↧'}</span>
                    <span className={css.demoCardAction}>{'⋮'}</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/**
 * Plugin settings page.
 * @param props.t - locale-bound translator.
 * @param props.state - live whale settings.
 * @param props.actions - write callbacks.
 * @returns the page.
 */
export function SettingsPage({ t, state, actions }: SettingsPageProps) {
  const [update, setUpdate] = useState<UpdateResult>({ status: 'idle' })
  const rootRef = useRef<HTMLElement | null>(null)
  const [peeking, setPeeking] = useState(false)
  const overlayRef = useRef<{ element: HTMLElement; display: string } | null>(null)
  const live = useRef({ t, state, actions })
  live.current = { t, state, actions }

  useEffect(() => {
    if (!peeking) return
    const overlay = findSettingsOverlay(rootRef.current)
    if (overlay !== null) {
      overlayRef.current = { element: overlay, display: overlay.style.display }
      overlay.style.display = 'none'
    }
    let demoHost: HTMLDivElement | null = null
    let demoRoot: Root | null = null
    let dockHost: HTMLDivElement | null = null
    let dockRoot: Root | null = null
    let hiddenSession: { element: HTMLElement; display: string } | null = null
    let scrollTimer: number | null = null
    const syncTimers: number[] = []
    const widthObservers: MutationObserver[] = []
    let onResize: (() => void) | null = null
    const thread = findConversationThread()
    let savedScrollTop: number | null = null
    if (thread !== null) {
      savedScrollTop = thread.scroll.scrollTop
      if (thread.session !== null) {
        hiddenSession = { element: thread.session, display: thread.session.style.display }
        thread.session.style.display = 'none'
      }
      demoHost = document.createElement('div')
      demoHost.className = css.demoHost
      if (thread.width > 0) {
        demoHost.style.width = `${thread.width}px`
        demoHost.style.margin = '0 auto'
      }
      if (thread.composer !== null) thread.scroll.insertBefore(demoHost, thread.composer)
      else thread.scroll.append(demoHost)
      demoRoot = createRoot(demoHost)
      demoRoot.render(<DemoTranscript t={live.current.t} />)
      // The running row is pinned above the composer instead of scrolling with
      // the demo transcript, the way the tail of a live conversation follows.
      dockHost = document.createElement('div')
      dockHost.className = css.demoRunningDock
      document.body.append(dockHost)
      dockRoot = createRoot(dockHost)
      dockRoot.render(<DemoRunningRow t={live.current.t} state={live.current.state} />)
      // DSH keeps the transcript pinned to the newest row; scroll the demo back
      // to its first message once React has committed the rows.
      const toTop = (): void => { thread.scroll.scrollTop = 0 }
      requestAnimationFrame(() => { requestAnimationFrame(toTop) })
      scrollTimer = window.setTimeout(toTop, 80)
      // The chat column can change width (window resize, width handles), and the
      // composer follows it. Mirror the measured column width into the demo host
      // and keep the running dock aligned to the column above the composer.
      const syncDock = (): void => {
        if (dockHost === null || demoHost === null) return
        const column = demoHost.getBoundingClientRect()
        if (column.width <= 0) return
        dockHost.style.left = `${column.left}px`
        dockHost.style.width = `${column.width}px`
        const composer = thread.composer?.getBoundingClientRect()
        const gap = composer === undefined ? 0 : window.innerHeight - composer.top + 6
        dockHost.style.bottom = `${Math.max(24, gap)}px`
      }
      const syncWidth = (): void => {
        if (demoHost === null) return
        const width = measureChatWidth(thread.scroll)
        if (width <= 0) return
        demoHost.style.width = `${width}px`
        demoHost.style.margin = '0 auto'
        syncDock()
      }
      const widthTimer = window.setInterval(syncWidth, 250)
      syncTimers.push(widthTimer)
      syncTimers.push(window.setTimeout(syncWidth, 120))
      // Width handles and ResizeObserver publish the width through inline style
      // custom properties on the conversation shell; mirror those updates at once.
      let shell: HTMLElement | null = thread.scroll.parentElement
      for (let depth = 0; depth < 4 && shell !== null && shell !== document.body; depth += 1) {
        const observer = new MutationObserver(syncWidth)
        observer.observe(shell, { attributes: true, attributeFilter: ['style'] })
        widthObservers.push(observer)
        shell = shell.parentElement
      }
      onResize = syncWidth
      window.addEventListener('resize', onResize)
    }
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    root.render(
      <PeekBar
        t={live.current.t}
        state={live.current.state}
        actions={live.current.actions}
        onReturn={() => {
          setPeeking(false)
        }}
      />,
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
      if (scrollTimer !== null) window.clearTimeout(scrollTimer)
      for (const timer of syncTimers) {
        window.clearInterval(timer)
        window.clearTimeout(timer)
      }
      for (const observer of widthObservers) observer.disconnect()
      if (onResize !== null) window.removeEventListener('resize', onResize)
      window.removeEventListener('keydown', onKey, true)
      setPeekMode(false)
      dockRoot?.unmount()
      dockHost?.remove()
      demoRoot?.unmount()
      demoHost?.remove()
      if (hiddenSession !== null) hiddenSession.element.style.display = hiddenSession.display
      if (savedScrollTop !== null && thread !== null) thread.scroll.scrollTop = savedScrollTop
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
      </div>

      <div className={css.entryCard} data-whale-leap-entry>
        <p className={css.entryHint}>{t('openPreviewHint')}</p>
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
    </section>
  )
}


