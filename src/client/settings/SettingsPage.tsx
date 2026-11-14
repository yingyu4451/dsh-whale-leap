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
import { BG_OFFSET_RANGE, COLOR_MODES, FRAME_MODES, INTERVAL_RANGE, MARK_LABEL_SIZE_RANGE, MARK_MOTIONS, MARK_OFFSET_RANGE, MARK_SIZE_RANGE, MARK_SWING_RANGE, OPACITY_RANGE, POD_SIZE_RANGE, POD_TIMINGS, SIZE_RANGE } from '../../../shared/settings.js'
import type { WhaleColorMode, WhaleFillStyle, WhaleMarkMotion, WhalePodTiming, WhaleSettingsState } from '../settings.js'
import type { Store } from '../store.js'
import type { LocaleKey } from '../i18n.js'
import { replayPeek, setPeekMode } from '../whale/peek.js'
import { FISH_LOGO_PATH, FISH_LOGO_VIEWBOX } from '../whale/fish-paths.js'
import { WhaleMarkFish } from '../whale/WhaleMarkFish.js'
import { RunningTail } from '../whale/RunningTail.js'
import { PLUGIN_VERSION } from '../version.js'
import { isDesktopShell } from '../platform.js'
import { RELEASES_URL, checkForUpdate, type UpdateResult } from '../update.js'
import type { UpgradeHandle } from '../upgrade.js'
import css from './settings.module.css'

/** Translation function handed in by the slot locale binding. */
type Translate = (key: LocaleKey, params?: Record<string, unknown>) => string

/** Tab identifiers of the live preview panel. */
type PeekTab = 'background' | 'mark'

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
  /** Randomize each wait around the replay interval. */
  setRandomInterval: (enabled: boolean) => void
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
  /** Pick a random visible position for every appearance. */
  setRandomPosition: (enabled: boolean) => void
  /** Enable or disable the multi-whale pod. */
  setPodEnabled: (enabled: boolean) => void
  /** Enable or disable depth-faded ink on far pod members. */
  setDepthInk: (enabled: boolean) => void
  /** Choose the pod entrance timing. */
  setPodTiming: (timing: WhalePodTiming) => void
  /** Set the farthest pod whale size. */
  setPodSizeMin: (scale: number) => void
  /** Set the nearest pod whale size. */
  setPodSizeMax: (scale: number) => void
  /** Restore every setting to its factory default. */
  reset: () => void
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
  /** In-place upgrade path; absent when the plugin manager is unavailable. */
  upgrade?: UpgradeHandle
}

/** Tabs of the floating live preview panel. */
const PEEK_TABS: readonly { value: PeekTab; label: LocaleKey }[] = [
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

/** Labels for the pod entrance timings. */
const POD_TIMING_LABELS: Record<WhalePodTiming, LocaleKey> = {
  together: 'podTimingTogether',
  random: 'podTimingRandom',
}

/**
 * Format a start offset for the slider value label.
 * @param px - offset in pixels.
 * @returns the signed pixel value, e.g. `+2.5px`, `0px`, `-1px`.
 */
function formatOffsetPx(px: number): string {
  const rounded = Number.isInteger(px) ? String(px) : px.toFixed(1)
  return `${px > 0 ? '+' : ''}${rounded}px`
}

/** One action rendered inside the floating upgrade status toast. */
interface UpgradeToastAction {
  label: string
  primary?: boolean
  onClick: () => void
}

/** Handle returned by `showUpgradeToast`. */
interface UpgradeToast {
  set(message: string, actions?: UpgradeToastAction[]): void
  close(): void
}

/**
 * A status toast that lives outside this component's tree.
 *
 * The plugin manager removes and reinstalls the profile package while the
 * upgrade runs, so the settings section may unmount before the result arrives.
 * A plain body-level element keeps the progress and the outcome visible.
 * @param message - initial message.
 * @returns toast handle.
 */
function showUpgradeToast(message: string): UpgradeToast {
  const host = document.createElement('div')
  host.dataset.whaleLeapUpgradeToast = ''
  host.setAttribute('role', 'status')
  host.style.cssText =
    'position:fixed;right:20px;bottom:24px;z-index:2147483000;display:flex;flex-direction:column;gap:10px;max-width:420px;padding:14px 16px;border-radius:12px;background:var(--dsw-alias-bg-elevated,#fff);color:var(--dsw-alias-label-primary,#111);border:1px solid var(--dsw-alias-border-secondary,rgba(0,0,0,.12));box-shadow:0 10px 30px rgba(0,0,0,.18);font-size:13px;line-height:1.5'
  const text = document.createElement('span')
  text.textContent = message
  const actions = document.createElement('div')
  actions.style.cssText = 'display:flex;gap:8px;justify-content:flex-end'
  host.append(text, actions)
  document.body.append(host)
  return {
    set(nextMessage: string, nextActions: UpgradeToastAction[] = []): void {
      text.textContent = nextMessage
      actions.replaceChildren(
        ...nextActions.map(action => {
          const button = document.createElement('button')
          button.type = 'button'
          button.textContent = action.label
          button.style.cssText = action.primary === true
            ? 'padding:5px 12px;border-radius:8px;border:none;background:var(--dsw-alias-bg-accent,#345ebe);color:var(--dsw-alias-label-inverse,#fff);font-size:12px;cursor:pointer'
            : 'padding:5px 12px;border-radius:8px;border:1px solid var(--dsw-alias-border-secondary,rgba(0,0,0,.16));background:transparent;color:inherit;font-size:12px;cursor:pointer'
          button.addEventListener('click', action.onClick)
          return button
        }),
      )
    },
    close(): void {
      host.remove()
    },
  }
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

/**
 * One row with minute and second dropdowns for the automatic replay interval.
 *
 * A dropdown of minutes plus seconds reads the interval directly instead of
 * squeezing a range into a slider, so long waits stay precise. With zero
 * minutes the seconds list starts at the minimum interval, keeping the stored
 * value valid.
 */
function IntervalRow(props: {
  id: string
  label: string
  hint?: string
  seconds: number
  disabled: boolean
  minuteUnit: string
  secondUnit: string
  onChange: (seconds: number) => void
}) {
  const total = Math.max(INTERVAL_RANGE.min, Math.min(INTERVAL_RANGE.max, Math.round(props.seconds)))
  const minutes = Math.floor(total / 60)
  const rest = total % 60
  const minuteOptions = Array.from({ length: Math.floor(INTERVAL_RANGE.max / 60) + 1 }, (_, index) => index)
  const secondOptions = Array.from({ length: 60 }, (_, index) => index)
    .filter(second => minutes > 0 || second >= INTERVAL_RANGE.min)
  return (
    <Row
      stack
      label={props.label}
      hint={props.hint}
      control={
        <span className={css.intervalFields}>
          <select
            id={props.id}
            className={css.intervalSelect}
            aria-label={`${props.label} ${props.minuteUnit}`}
            value={minutes}
            disabled={props.disabled}
            onChange={event => {
              const nextMinutes = Number(event.target.value)
              const nextRest = nextMinutes === 0 ? Math.max(INTERVAL_RANGE.min, rest) : rest
              props.onChange(nextMinutes * 60 + nextRest)
            }}
          >
            {minuteOptions.map(minute => (
              <option key={minute} value={minute}>{minute}</option>
            ))}
          </select>
          <span className={css.intervalUnit}>{props.minuteUnit}</span>
          <select
            className={css.intervalSelect}
            aria-label={`${props.label} ${props.secondUnit}`}
            value={rest}
            disabled={props.disabled}
            onChange={event => {
              props.onChange(minutes * 60 + Number(event.target.value))
            }}
          >
            {secondOptions.map(second => (
              <option key={second} value={second}>{second}</option>
            ))}
          </select>
          <span className={css.intervalUnit}>{props.secondUnit}</span>
        </span>
      }
    />
  )
}

/**
 * One row with a pair of sliders for the pod whale size range.
 *
 * Each slider carries a whale silhouette drawn at the size it produces, so the
 * far and near ends read at a glance. The low slider is the farthest pod member
 * and the high slider the nearest one, both as a share of one full scene width.
 * Each slider is bounded by the other value, so the range can never invert.
 */
function PodSizeRangeRow(props: {
  label: string
  hint: string
  farLabel: string
  nearLabel: string
  minLabel: string
  maxLabel: string
  min: number
  max: number
  disabled: boolean
  onMin: (scale: number) => void
  onMax: (scale: number) => void
}) {
  const fishSizes = [props.min, props.max]
  return (
    <Row
      stack
      label={props.label}
      hint={props.hint}
      control={
        <span className={css.sizeRange}>
          <span className={css.sizeField}>
            <span className={css.sizeFish} aria-hidden="true">
              <svg viewBox={`0 0 ${FISH_LOGO_VIEWBOX.width} ${FISH_LOGO_VIEWBOX.height}`} fill="none" style={{ width: Math.round(10 + 24 * fishSizes[0]) }}>
                <path d={FISH_LOGO_PATH} fill="currentColor" />
              </svg>
            </span>
            <span className={css.sizeLabel}>{props.farLabel}</span>
            <input
              type="range"
              className={css.slider}
              aria-label={props.minLabel}
              min={POD_SIZE_RANGE.min}
              max={props.max}
              step={POD_SIZE_RANGE.step}
              value={props.min}
              disabled={props.disabled}
              onChange={event => {
                props.onMin(Number(event.target.value))
              }}
            />
            <span className={`${css.sliderValue} ${css.sizeValue}`}>{Math.round(props.min * 100)}%</span>
          </span>
          <span className={css.sizeField}>
            <span className={css.sizeFish} aria-hidden="true">
              <svg viewBox={`0 0 ${FISH_LOGO_VIEWBOX.width} ${FISH_LOGO_VIEWBOX.height}`} fill="none" style={{ width: Math.round(10 + 24 * fishSizes[1]) }}>
                <path d={FISH_LOGO_PATH} fill="currentColor" />
              </svg>
            </span>
            <span className={css.sizeLabel}>{props.nearLabel}</span>
            <input
              type="range"
              className={css.slider}
              aria-label={props.maxLabel}
              min={props.min}
              max={POD_SIZE_RANGE.max}
              step={POD_SIZE_RANGE.step}
              value={props.max}
              disabled={props.disabled}
              onChange={event => {
                props.onMax(Number(event.target.value))
              }}
            />
            <span className={`${css.sliderValue} ${css.sizeValue}`}>{Math.round(props.max * 100)}%</span>
          </span>
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

/** One switch row, optionally owning dependent rows shown by the chevron button. */
function ToggleRow(props: {
  label: string
  hint: string
  checked: boolean
  disabled: boolean
  onChange: (checked: boolean) => void
  /** Expand control for a parent switch whose dependent rows can be previewed. */
  expand?: { open: boolean; label: string; onToggle: () => void }
}) {
  return (
    <Row
      label={props.label}
      hint={props.hint}
      control={
        <span className={css.rowControls}>
          {props.expand !== undefined && (
            <button
              type="button"
              className={props.expand.open ? `${css.expandButton} ${css.expandButtonOpen}` : css.expandButton}
              aria-expanded={props.expand.open}
              aria-label={props.expand.label}
              title={props.expand.label}
              onClick={props.expand.onToggle}
            >
              <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
                <path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
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
        </span>
      }
    />
  )
}

/**
 * Collapsible block holding the dependent rows of an accordion parent.
 *
 * The block stays mounted so its height can transition; while closed it is
 * inert and hidden from assistive technology.
 * @param props.open - whether the dependent rows are expanded.
 * @param props.children - dependent rows.
 * @returns the collapsible block.
 */
function AccordionBody({ open, children }: { open: boolean; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    ref.current?.toggleAttribute('inert', !open)
  }, [open])
  return (
    <div
      ref={ref}
      className={open ? `${css.accordion} ${css.accordionOpen}` : css.accordion}
      aria-hidden={!open}
    >
      <div className={css.accordionClip}>
        <div className={css.accordionBody}>{children}</div>
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
function PeekSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={css.peekSection}>
      <h3 className={css.peekSectionTitle}>
        <span>{title}</span>
      </h3>
      {children}
    </section>
  )
}

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
  const [openGroups, setOpenGroups] = useState<Record<string, boolean | undefined>>({})
  const bodyRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 })
  }, [tab])
  /**
   * Whether a parent row's dependent block is shown: it follows the parent
   * switch by default, while the chevron can preview the block either way.
   * @param key - accordion identity.
   * @param auto - open state implied by the parent switch.
   * @returns whether the dependent block renders.
   */
  const groupOpen = (key: string, auto: boolean): boolean => openGroups[key] ?? auto
  /**
   * Flip a parent row's dependent block and keep that choice until the parent
   * switch itself changes (which drops the manual override).
   * @param key - accordion identity.
   * @param auto - open state implied by the parent switch.
   */
  const toggleGroup = (key: string, auto: boolean): void => {
    setOpenGroups(previous => ({ ...previous, [key]: !(previous[key] ?? auto) }))
  }
  /**
   * Drop a manual override so the block follows its parent switch again.
   * @param key - accordion identity.
   */
  const clearGroup = (key: string): void => {
    setOpenGroups(previous => {
      if (previous[key] === undefined) return previous
      const next = { ...previous }
      delete next[key]
      return next
    })
  }
  const podOpen = groupOpen('pod', settings.podEnabled)
  const markOpen = groupOpen('mark', settings.replaceMark)
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
      <div className={css.peekBody} ref={bodyRef}>
        {tab === 'background' ? (
          <>
            <PeekSection title={t('tabPlayback')}>
              <div className={css.peekGroup}>
                <ToggleRow
                  label={t('auto')}
                  hint={settings.autoAppear ? t('autoHint') : t('autoOffHint')}
                  checked={settings.autoAppear}
                  disabled={disabled}
                  onChange={actions.setAutoAppear}
                />
                <ToggleRow
                  label={t('playOnSwitch')}
                  hint={t('playOnSwitchHint')}
                  checked={settings.playOnSwitch}
                  disabled={disabled || !settings.autoAppear}
                  onChange={actions.setPlayOnSwitch}
                />
                <IntervalRow
                  id="whale-leap-interval"
                  label={t('interval')}
                  hint={t('intervalHint')}
                  seconds={settings.intervalSeconds}
                  minuteUnit={t('minutesUnit')}
                  secondUnit={t('secondsUnit')}
                  disabled={disabled || !settings.autoAppear || settings.randomInterval}
                  onChange={actions.setInterval}
                />
                <ToggleRow
                  label={t('randomInterval')}
                  hint={t('randomIntervalHint')}
                  checked={settings.randomInterval}
                  disabled={disabled || !settings.autoAppear}
                  onChange={actions.setRandomInterval}
                />
              </div>
            </PeekSection>
            <PeekSection title={t('groupLook')}>
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
              </div>
            </PeekSection>
            <PeekSection title={t('groupAppear')}>
              <div className={css.peekGroup}>
                <ToggleRow
                  label={t('podEnabled')}
                  hint={t('podEnabledHint')}
                  checked={settings.podEnabled}
                  disabled={disabled}
                  expand={{
                    open: podOpen,
                    label: podOpen ? t('collapseChildren') : t('expandChildren'),
                    onToggle: () => {
                      toggleGroup('pod', settings.podEnabled)
                    },
                  }}
                  onChange={checked => {
                    clearGroup('pod')
                    actions.setPodEnabled(checked)
                  }}
                />
                <AccordionBody open={podOpen}>
                    <Row
                      stack
                      label={t('podTiming')}
                      hint={t('podTimingHint')}
                      control={
                        <ChoiceRow
                          label={t('podTiming')}
                          value={settings.podTiming}
                          disabled={disabled || !settings.podEnabled}
                          options={POD_TIMINGS.map(timing => ({
                            value: timing,
                            label: t(POD_TIMING_LABELS[timing]),
                          }))}
                          onChange={actions.setPodTiming}
                        />
                      }
                    />
                    <PodSizeRangeRow
                      label={t('podSizeRange')}
                      hint={t('podSizeRangeHint')}
                      farLabel={t('podSizeFar')}
                      nearLabel={t('podSizeNear')}
                      minLabel={t('podSizeMin')}
                      maxLabel={t('podSizeMax')}
                      min={settings.podSizeMin}
                      max={settings.podSizeMax}
                      disabled={disabled || !settings.podEnabled}
                      onMin={actions.setPodSizeMin}
                      onMax={actions.setPodSizeMax}
                    />
                    <ToggleRow
                      label={t('depthInk')}
                      hint={t('depthInkHint')}
                      checked={settings.depthInk}
                      disabled={disabled || !settings.podEnabled}
                      onChange={actions.setDepthInk}
                    />
                </AccordionBody>
                <ToggleRow
                  label={t('randomPosition')}
                  hint={t('randomPositionHint')}
                  checked={settings.randomPosition}
                  disabled={disabled}
                  onChange={actions.setRandomPosition}
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
                  disabled={disabled || settings.randomPosition}
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
                  disabled={disabled || settings.randomPosition}
                  onChange={actions.setBgOffsetY}
                />
              </div>
            </PeekSection>
            <PeekSection title={t('groupFill')}>
              <div className={css.peekGroup}>
            <FillStyleButtons
              t={t}
              styles={settings.fillStyles}
              disabled={disabled}
              onToggle={actions.setFillStyle}
            />
            <p className={css.note}>{t('fillStyleHint')}</p>
              </div>
            </PeekSection>
          </>
        ) : (
          <>
            <PeekSection title={t('tabMark')}>
              <div className={css.peekGroup}>
                <ToggleRow
                  label={t('replaceMark')}
                  hint={t('replaceMarkHint')}
                  checked={settings.replaceMark}
                  disabled={disabled}
                  expand={{
                    open: markOpen,
                    label: markOpen ? t('collapseChildren') : t('expandChildren'),
                    onToggle: () => {
                      toggleGroup('mark', settings.replaceMark)
                    },
                  }}
                  onChange={checked => {
                    clearGroup('mark')
                    actions.setReplaceMark(checked)
                  }}
                />
                <AccordionBody open={markOpen}>
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
                    <Row
                      stack
                      label={t('motionTitle')}
                      control={(
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
                      )}
                    />
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
                </AccordionBody>
              </div>
            </PeekSection>
          </>
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
  /** True while the surface is the blank home, whose composer sits centered. */
  hero: boolean
}

/**
 * Marks the home scroll body while preview docks its composer at the floor.
 * The stylesheet below mirrors what DSH's active phase already applies, so the
 * blank home looks like a started conversation without mutating React state.
 */
const HOME_PREVIEW_ATTRIBUTE = 'data-whale-leap-home-preview'

/** Layout the blank home is given for the duration of preview mode. */
const HOME_PREVIEW_CSS = `
[${HOME_PREVIEW_ATTRIBUTE}] {
  justify-content: flex-start !important;
}
[${HOME_PREVIEW_ATTRIBUTE}] > [data-composer-seat] {
  position: sticky;
  bottom: 0;
  margin-top: auto;
  z-index: 9;
  will-change: transform;
  overflow-anchor: none;
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--dsw-alias-bg-base) 0%, transparent) 0px,
    var(--dsw-alias-bg-base) 36px
  );
}
[${HOME_PREVIEW_ATTRIBUTE}] [class*="composerHero"] {
  padding-bottom: 0 !important;
}
`

/**
 * Hide the blank-home hero chrome (headline and workspace row), leaving only
 * the composer card the preview transcript should end at. Children owning a
 * hero slot are the chrome; the composer bar owns none, so it stays.
 * @param composer - the composer seat found on the home surface.
 * @returns the hidden elements with their previous inline display.
 */
function hideHeroComposerChrome(composer: HTMLElement): { element: HTMLElement; display: string }[] {
  const hidden: { element: HTMLElement; display: string }[] = []
  for (const stack of composer.querySelectorAll<HTMLElement>('[class*="composerStack"]')) {
    for (const child of [...stack.children]) {
      if (!(child instanceof HTMLElement)) continue
      const ownsHero = child.matches('[data-slot^="conversation.hero"]')
        || child.querySelector('[data-slot^="conversation.hero"]') !== null
      if (!ownsHero) continue
      hidden.push({ element: child, display: child.style.display })
      child.style.display = 'none'
    }
  }
  return hidden
}

/**
 * Read a pixel or clamp() width declaration without creating any DOM nodes.
 * @param value - computed custom-property value.
 * @returns the resolved pixel width, or 0 when the value is not a width.
 */
function parseChatWidth(value: string): number {
  const px = /^\s*(\d+(?:\.\d+)?)px\s*$/.exec(value)
  if (px !== null) return Number.parseFloat(px[1])
  const clamp = /^\s*clamp\(\s*([\d.]+)px\s*,\s*calc\(\s*([\d.]+)px\s*\*\s*([\d.]+)\s*\)\s*,\s*([\d.]+)px\s*\)\s*$/.exec(value)
  if (clamp === null) return 0
  const resolved = Number.parseFloat(clamp[2]) * Number.parseFloat(clamp[3])
  return Math.min(Number.parseFloat(clamp[4]), Math.max(Number.parseFloat(clamp[1]), resolved))
}

/**
 * Measure the conversation column width the real messages are laid out in.
 * Reads the same custom properties the shipped width handles publish; no probe
 * node is inserted, so syncing the preview never mutates the chat container.
 * @param scroll - the real conversation scroll container.
 * @returns the resolved chat content width in pixels.
 */
function measureChatWidth(scroll: HTMLElement): number {
  const userWidth = parseChatWidth(getComputedStyle(scroll).getPropertyValue('--dsh-chat-user-width'))
  if (userWidth > 0) return userWidth
  const content = scroll.querySelector<HTMLElement>('[data-conversation-content]')
  const owner = content ?? scroll
  const declared = parseChatWidth(getComputedStyle(owner).getPropertyValue('--dsh-chat-content-width'))
  if (declared > 0) return declared
  const width = owner.getBoundingClientRect().width
  if (width <= 0) return 0
  return Math.min(920, Math.max(680, width * 0.64))
}

/**
 * Find the conversation surface preview mode can borrow: a started transcript,
 * the blank home hero, or any composer-bearing conversation column. The blank
 * home keeps a scroll body and a composer seat too, so preview docks its
 * composer and shows the demo transcript there instead of doing nothing.
 * @returns the scroll container, session slot, composer seat, column width and surface kind.
 */
function findConversationThread(): ConversationThread | null {
  if (typeof document === 'undefined') return null
  const scroll = document.querySelector<HTMLElement>('[data-conversation-scroll]')
  if (scroll === null) return null
  const composer = scroll.querySelector<HTMLElement>('[data-composer-seat]')
  if (composer === null) return null
  const phase = scroll.closest<HTMLElement>('[data-phase]')?.getAttribute('data-phase')
  return {
    scroll,
    session: scroll.querySelector<HTMLElement>('[data-slot="conversation.session"]'),
    composer,
    width: measureChatWidth(scroll),
    hero: phase === 'hero',
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
          {settings.replaceMark ? (
            <WhaleMarkFish
              size={settings.markSize}
              motion={settings.markMotion}
              swing={settings.markSwing}
              offsetX={settings.markOffsetX}
              offsetY={settings.markOffsetY}
              color={settings.markColorMode === 'custom' ? settings.markColor : undefined}
            />
          ) : (
            <RunningTail />
          )}
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
  return (
    <div className={css.demoThread}>
      <p className={css.demoMeta}>{t('demoMeta')}</p>
      {exchanges.map((exchange, index) => (
        <div key={index} className={css.demoExchange}>
          <div className={css.demoUser}>{exchange.user}</div>
          <div className={css.demoReply}>{exchange.reply}</div>
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
export function SettingsPage({ t, state, actions, upgrade }: SettingsPageProps) {
  const [update, setUpdate] = useState<UpdateResult>({ status: 'idle' })
  const [upgradeState, setUpgradeState] = useState<{
    phase: 'idle' | 'running' | 'done' | 'failed'
    message?: string
  }>({ phase: 'idle' })
  const rootRef = useRef<HTMLElement | null>(null)
  const [peeking, setPeeking] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const resetTimer = useRef<number | undefined>(undefined)
  const overlayRef = useRef<{ element: HTMLElement; display: string } | null>(null)
  const live = useRef({ t, state, actions })
  live.current = { t, state, actions }

  useEffect(() => () => {
    if (resetTimer.current !== undefined) window.clearTimeout(resetTimer.current)
  }, [])

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
    let hiddenHeroChrome: { element: HTMLElement; display: string }[] = []
    let homeStyle: HTMLStyleElement | null = null
    let scrollTimer: number | null = null
    const syncTimers: number[] = []
    const widthObservers: MutationObserver[] = []
    let onResize: (() => void) | null = null
    const thread = findConversationThread()
    let savedScrollTop: number | null = null
    if (thread !== null) {
      // On the blank home the composer is centered in the hero stack. Give the
      // scroll body the same floor-docked composer a started conversation has
      // and drop the hero chrome, so the demo transcript follows the real layout.
      if (thread.hero) {
        homeStyle = document.createElement('style')
        homeStyle.dataset.whaleLeapPreview = ''
        homeStyle.textContent = HOME_PREVIEW_CSS
        document.head.append(homeStyle)
        thread.scroll.setAttribute(HOME_PREVIEW_ATTRIBUTE, '')
        if (thread.composer !== null) hiddenHeroChrome = hideHeroComposerChrome(thread.composer)
      }
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
      // Layout reads are coalesced into one animation frame and only written when
      // the measurements actually changed, so dragging a handle cannot queue a
      // stream of forced reflows.
      let lastWidth = 0
      let lastLeft = Number.NaN
      let lastDockWidth = Number.NaN
      let lastBottom = Number.NaN
      let syncQueued = false
      const applySync = (): void => {
        if (demoHost === null) return
        const width = measureChatWidth(thread.scroll)
        if (width > 0 && Math.abs(width - lastWidth) > 0.5) {
          lastWidth = width
          demoHost.style.width = `${width}px`
          demoHost.style.margin = '0 auto'
        }
        if (dockHost === null) return
        const column = demoHost.getBoundingClientRect()
        if (column.width <= 0) return
        const composer = thread.composer?.getBoundingClientRect()
        const gap = composer === undefined ? 0 : window.innerHeight - composer.top + 6
        const bottom = Math.max(24, gap)
        if (Math.abs(column.left - lastLeft) < 0.5 && Math.abs(column.width - lastDockWidth) < 0.5 && Math.abs(bottom - lastBottom) < 0.5) return
        lastLeft = column.left
        lastDockWidth = column.width
        lastBottom = bottom
        dockHost.style.left = `${column.left}px`
        dockHost.style.width = `${column.width}px`
        dockHost.style.bottom = `${bottom}px`
      }
      const syncWidth = (): void => {
        if (syncQueued) return
        syncQueued = true
        requestAnimationFrame(() => {
          syncQueued = false
          applySync()
        })
      }
      // Observers and resize fire on real changes; the timer is only a cheap
      // once-per-second safety net that reads style values, not the layout tree.
      syncTimers.push(window.setInterval(syncWidth, 1000))
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
      for (const entry of hiddenHeroChrome) entry.element.style.display = entry.display
      if (homeStyle !== null) homeStyle.remove()
      if (thread !== null) thread.scroll.removeAttribute(HOME_PREVIEW_ATTRIBUTE)
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
    setUpgradeState({ phase: 'idle' })
    setUpdate({ status: 'checking' })
    setUpdate(await checkForUpdate())
  }, [])

  // Installing replaces this very bundle: the manager removes the profile
  // package, installs the pinned release and lets HMR pick up the new build. The
  // settings section may unmount before the reply lands, so progress and the
  // outcome go into a body-level toast that survives the unmount.
  const installUpdate = useCallback(
    async (version: string): Promise<void> => {
      if (upgrade === undefined) return
      // Installing replaces this very bundle: the manager removes the profile
      // package, installs the pinned release and lets HMR pick up the new build.
      // The settings section (and its locale bindings) may be disposed before the
      // reply lands, so translate every label before the request and show the
      // outcome in a body-level toast that survives the unmount.
      const runningText = t('upgrading')
      const dismissLabel = t('upgradeDismiss')
      // The shell decides what must be restarted: `dsh web` in a browser, the
      // desktop app when this page is hosted by the DSH desktop shell.
      const restartText = t(isDesktopShell() ? 'upgradeRestartDesktop' : 'upgradeRestart', { version })
      const failedTemplate = t('upgradeFailed', { error: '__WHALE_UPGRADE_ERROR__' })
      const failureText = (message: string): string =>
        failedTemplate.replace('__WHALE_UPGRADE_ERROR__', message)
      const toast = showUpgradeToast(runningText)
      const dismiss = { label: dismissLabel, onClick: () => toast.close() }
      setUpgradeState({ phase: 'running' })
      let outcome
      try {
        outcome = await upgrade.install(version)
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        toast.set(failureText(message), [dismiss])
        setUpgradeState({ phase: 'failed', message })
        return
      }
      if (outcome.status === 'ok') {
        // The running host keeps serving the modules it resolved at startup, so
        // the refreshed page would still run the previous build: the new version
        // only loads after the hosting shell restarts.
        setUpgradeState({ phase: 'done', message: 'restart' })
        toast.set(restartText, [dismiss])
        return
      }
      const message = outcome.message ?? outcome.status
      toast.set(failureText(message), [dismiss])
      setUpgradeState({ phase: 'failed', message })
    },
    [t, upgrade],
  )

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
  const upgradeVersion = update.status === 'available' ? update.latest : undefined
  const canUpgrade = upgradeVersion !== undefined && upgrade !== undefined
  let upgradeNotice = updateNotice
  if (canUpgrade) {
    if (upgradeState.phase === 'running') {
      upgradeNotice = t('upgrading')
    } else if (upgradeState.phase === 'done') {
      upgradeNotice = t(isDesktopShell() ? 'upgradeRestartDesktop' : 'upgradeRestart', { version: upgradeVersion })
    } else if (upgradeState.phase === 'failed') {
      upgradeNotice = t('upgradeFailed', { error: upgradeState.message ?? upgradeState.phase })
    }
  }

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
            disabled={update.status === 'checking' || upgradeState.phase === 'running'}
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
        {canUpgrade ? (
          <div className={css.updateRow}>
            <span
              className={css.updateNotice}
              role="status"
              data-status={
                upgradeState.phase === 'running'
                  ? 'upgrading'
                  : upgradeState.phase === 'done'
                    ? 'upgraded'
                    : upgradeState.phase === 'failed'
                      ? 'failed'
                      : update.status
              }
            >
              {upgradeNotice}
            </span>
            {(upgradeState.phase === 'idle' || upgradeState.phase === 'failed') && (
              <button
                type="button"
                className={css.updateButton}
                onClick={() => {
                  void installUpdate(upgradeVersion ?? '')
                }}
              >
                {t('upgrade')}
              </button>
            )}
          </div>
        ) : (
          (updateNotice !== '' || canOpenReleases) && (
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
          )
        )}
      </header>
      </div>

      <div className={css.entryLayout}>
        <div className={css.entryCard} data-whale-leap-entry>
          <p className={css.entryHint}>{t('openPreviewHint')}</p>
          <div className={css.entryActions}>
            <button
              type="button"
              className={css.resetButton}
              data-confirm={confirmReset ? 'true' : undefined}
              onClick={() => {
                if (resetTimer.current !== undefined) window.clearTimeout(resetTimer.current)
                if (!confirmReset) {
                  setConfirmReset(true)
                  resetTimer.current = window.setTimeout(() => {
                    setConfirmReset(false)
                    resetTimer.current = undefined
                  }, 4000)
                  return
                }
                setConfirmReset(false)
                resetTimer.current = undefined
                actions.reset()
              }}
            >
              {confirmReset ? t('resetConfirm') : t('resetDefaults')}
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
      </div>
    </section>
  )
}


