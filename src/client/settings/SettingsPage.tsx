/**
 * Settings page of the whale-leap plugin.
 *
 * Two tabs keep the page short: the background tab pairs a live whale preview
 * with its appearance controls, the running-icon tab pairs animated motion cards
 * with the mark size. Every control applies live and is disabled when the Host
 * reports the section as read-only.
 */
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { COLOR_MODES, INTERVAL_RANGE, MARK_LABEL_SIZE_RANGE, MARK_MOTIONS, MARK_OFFSET_RANGE, MARK_SIZE_RANGE, MARK_SWING_RANGE, OPACITY_RANGE, SIZE_RANGE } from '../../../shared/settings.js'
import type { WhaleColorMode, WhaleMarkMotion, WhaleSettingsState } from '../settings.js'
import type { Store } from '../store.js'
import type { LocaleKey } from '../i18n.js'
import { WHALE_ARTWORK } from '../whale/artwork.js'
import { attachPixelWhale, type PixelWhaleHandle } from '../whale/renderer.js'
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
  /** Enable or disable automatic appearances. */
  setAutoAppear: (enabled: boolean) => void
  /** Choose immediate playback on conversation switch. */
  setPlayOnSwitch: (enabled: boolean) => void
  /** Set the replay interval. */
  setInterval: (seconds: number) => void
  /** Replace the shipped running icon with the fish mark. */
  setReplaceMark: (enabled: boolean) => void
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

/** Replay cadence of the background preview stage. */
const PREVIEW_INTERVAL_MS = 4200

/** The preview stage draws a smaller scene than the real conversation background. */
const PREVIEW_SCALE = 0.5

/** Mark size rendered inside each motion card. */
const OPTION_FISH_SIZE = 34

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
function PreviewWhale({ settings }: { settings: WhaleSettingsState }) {
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
    const handle = attachPixelWhale(canvas, WHALE_ARTWORK, ATLAS_URL)
    whale.current = handle
    handle.prefetch()
    const current = latest.current
    handle.update({ ...WHALE_ARTWORK, activeOpacity: current.opacity, scale: current.size * PREVIEW_SCALE })
    handle.setAutoPlay(PREVIEW_INTERVAL_MS)
  }, [])

  const { opacity, size, colorMode, customColor } = settings
  useEffect(() => {
    whale.current?.update({ ...WHALE_ARTWORK, activeOpacity: opacity, scale: size * PREVIEW_SCALE })
  }, [opacity, size, colorMode, customColor])

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
  const disabled = !settings.writable
  const custom = settings.colorMode === 'custom'

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
  } else if (update.status === 'no-release') {
    updateNotice = t('noRelease')
  }

  return (
    <section className={css.section}>
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
            {update.status === 'checking' ? t('checking') : t('checkUpdate')}
          </button>
        </div>
        <p className={css.intro}>{t('intro')}</p>
        {(updateNotice !== '' || update.status === 'available') && (
          <div className={css.updateRow}>
            <span className={css.updateNotice} role="status" data-status={update.status}>
              {updateNotice}
            </span>
            {update.status === 'available' && update.latest !== undefined && (
              <a
                className={css.updateLink}
                href={update.url ?? RELEASES_URL}
                target="_blank"
                rel="noreferrer"
              >
                {t('viewVersion', { version: update.latest })}
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

      <div className={css.panel}>
        {tab === 'background' ? (
          <div
            id="whale-leap-panel-background"
            role="tabpanel"
            aria-labelledby="whale-leap-tab-background"
            className={css.tabPanel}
          >
            <div className={css.stage}>
              <PreviewWhale settings={settings} />
              <span className={css.stageHint}>{t('stageHint')}</span>
            </div>

            <Group title={t('groupAppearance')}>
              <Row
                stack
                label={t('color')}
                hint={t('colorHint')}
                control={
                  <span className={css.colorGroup}>
                    <ChoiceRow
                      label={t('color')}
                      value={settings.colorMode}
                      disabled={disabled}
                      options={COLOR_MODES.map(mode => ({ value: mode, label: t(mode === 'theme' ? 'colorTheme' : 'colorCustom') }))}
                      onChange={actions.setColorMode}
                    />
                    {custom && (
                      <span className={css.colorField}>
                        <input
                          className={css.colorInput}
                          type="color"
                          aria-label={t('colorCustom')}
                          value={settings.customColor}
                          disabled={disabled}
                          onChange={event => {
                            actions.setCustomColor(event.target.value)
                          }}
                        />
                        <span className={css.colorValue}>{settings.customColor.toUpperCase()}</span>
                      </span>
                    )}
                  </span>
                }
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
            </Group>

            <Group title={t('groupPlayback')}>
              <ToggleRow
                label={t('auto')}
                hint={t('autoHint')}
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
        ) : (
          <div
            id="whale-leap-panel-mark"
            role="tabpanel"
            aria-labelledby="whale-leap-tab-mark"
            className={css.tabPanel}
          >
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
                      />
                    </span>
                    <span
                      className={css.markRunningLabel}
                      style={{ fontSize: `${settings.markLabelSize}px` }}
                      data-running-label
                    >
                      {t('runningLabel')}
                    </span>
                  </span>
                </div>
              ) : (
                <span className={css.markStageOff}>{t('replaceMarkHint')}</span>
              )}
              {settings.replaceMark && <span className={css.stageHint}>{t('markPreviewHint')}</span>}
            </div>

            <Group title={t('groupIcon')}>
              <ToggleRow
                label={t('replaceMark')}
                hint={t('replaceMarkHint')}
                checked={settings.replaceMark}
                disabled={disabled}
                onChange={actions.setReplaceMark}
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
                disabled={disabled || !settings.replaceMark}
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
                disabled={disabled || !settings.replaceMark}
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
                disabled={disabled || !settings.replaceMark}
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
                disabled={disabled || !settings.replaceMark}
                onChange={actions.setMarkOffsetY}
              />
            </Group>

            <Group title={t('motion')}>
              <div className={css.motionGrid} role="group" aria-label={t('motion')}>
                {MARK_MOTIONS.map(motion => {
                  const selected = settings.markMotion === motion
                  return (
                    <button
                      key={motion}
                      type="button"
                      className={css.motionOption}
                      aria-pressed={selected}
                      disabled={disabled || !settings.replaceMark}
                      onClick={() => {
                        actions.setMarkMotion(motion)
                      }}
                    >
                      <span className={css.motionFish}>
                        <WhaleMarkFish size={OPTION_FISH_SIZE} motion={motion} swing={settings.markSwing} />
                      </span>
                      <span className={css.motionFooter}>
                        <span className={css.motionLabel}>{t(MOTION_LABELS[motion])}</span>
                        {selected && <span className={css.motionTick}>{t('selected')}</span>}
                      </span>
                    </button>
                  )
                })}
              </div>
              <p className={css.note}>{t('motionHint')}</p>

              <SliderRow
                id="whale-leap-mark-swing"
                label={t('swing')}
                hint={t('swingHint')}
                value={settings.markSwing}
                min={MARK_SWING_RANGE.min}
                max={MARK_SWING_RANGE.max}
                step={MARK_SWING_RANGE.step}
                display={`${Math.round(settings.markSwing * 100)}%`}
                disabled={disabled || !settings.replaceMark}
                onChange={actions.setMarkSwing}
              />
            </Group>
          </div>
        )}
      </div>
    </section>
  )
}


