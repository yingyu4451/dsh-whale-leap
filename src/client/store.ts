/**
 * Whale settings state and its write path.
 *
 * The durable section lives on the Host; this module mirrors it into a tiny
 * observable store that both the settings page and the two artwork slots read.
 * Discrete choices commit at once, sliders coalesce for {@link WRITE_DELAY_MS}.
 */
import { DEFAULT_SETTINGS, CUSTOM_COLOR_PATTERN, INTERVAL_RANGE, MARK_LABEL_SIZE_RANGE, MARK_OFFSET_RANGE, MARK_SIZE_RANGE, MARK_SWING_RANGE, OPACITY_RANGE, SIZE_RANGE } from '../../shared/settings.js'
import { INITIAL_SETTINGS, type WhaleColorMode, type WhaleMarkMotion, type WhaleSettings, type WhaleSettingsState } from './settings.js'

/** Delay that batches slider writes into one durable update. */
export const WRITE_DELAY_MS = 150

/** Numeric bounds of a slider setting. */
interface Bounds {
  min: number
  max: number
  step: number
}

/** Minimal observable snapshot store. */
export interface Store<T> {
  /** Current value. */
  getSnapshot(): T
  /** Subscribe to replacements; returns the unsubscribe function. */
  subscribe(listener: () => void): () => void
  /** Replace the whole value. */
  set(next: T): void
  /** Shallow-merge a patch into the current value. */
  update(mutator: (draft: T) => void): void
}

/**
 * Create a snapshot store.
 * @param initial - starting value.
 * @returns the store.
 */
export function createStore<T>(initial: T): Store<T> {
  let value = initial
  const listeners = new Set<() => void>()
  return {
    getSnapshot: () => value,
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    set(next) {
      value = next
      for (const listener of listeners) listener()
    },
    update(mutator) {
      const draft = { ...value }
      mutator(draft)
      value = draft
      for (const listener of listeners) listener()
    },
  }
}

/** The slice of the settings mirror this module needs. */
export interface SettingsFormLike {
  getSnapshot(): { value?: unknown; writable: boolean }
  subscribe(listener: () => void): () => void
  set(field: string, value: unknown): Promise<boolean>
}

/** The slice of the client context this module needs. */
export interface RuntimeContextLike {
  effect(setup: () => (() => void) | void, label?: string): void
}

/**
 * Clamp a requested number into a setting's bounds.
 * @param value - requested value.
 * @param bounds - accepted bounds.
 * @returns the clamped value.
 */
function clamp(value: number, bounds: Bounds): number {
  if (Number.isNaN(value)) return bounds.min
  return Math.min(bounds.max, Math.max(bounds.min, value))
}

/** Mirror the durable whale section into a store and write user edits back. */
export class WhaleSettingsRuntime {
  /** Live settings shared with slots and the settings page. */
  readonly store = createStore<WhaleSettingsState>(INITIAL_SETTINGS)
  private pending = 0
  private readonly queued = new Map<string, unknown>()
  private timer: ReturnType<typeof setTimeout> | undefined
  private disposed = false

  /**
   * Create the runtime and start mirroring the durable section.
   * @param ctx - client context providing effect cleanup.
   * @param host - settings form of the plugin namespace.
   */
  constructor(
    private readonly ctx: RuntimeContextLike,
    private readonly host: SettingsFormLike,
  ) {
    ctx.effect(() => {
      const off = host.subscribe(() => {
        this.adopt()
      })
      this.adopt()
      return () => {
        off()
        this.dispose()
      }
    }, 'whale-leap: settings adoption')
  }

  /**
   * Switch the ink source.
   * @param mode - next color source.
   */
  setColorMode(mode: WhaleColorMode): void {
    this.patch({ colorMode: mode })
    this.commit('colorMode', mode)
  }

  /**
   * Pick a custom ink color.
   * @param color - lowercase '#rrggbb' color.
   */
  setCustomColor(color: string): void {
    if (!CUSTOM_COLOR_PATTERN.test(color)) return
    this.patch({ customColor: color })
    this.schedule('customColor', color)
  }

  /**
   * Resize the background scene.
   * @param size - requested multiplier.
   */
  setSize(size: number): void {
    const next = clamp(size, SIZE_RANGE)
    this.patch({ size: next })
    this.schedule('size', next)
  }

  /**
   * Change the ink strength response.
   * @param opacity - requested response.
   */
  setOpacity(opacity: number): void {
    const next = clamp(opacity, OPACITY_RANGE)
    this.patch({ opacity: next })
    this.schedule('opacity', next)
  }

  /**
   * Enable or disable automatic replays in a started conversation.
   * @param enabled - whether the whale reappears on its own.
   */
  setAutoAppear(enabled: boolean): void {
    this.patch({ autoAppear: enabled })
    this.commit('autoAppear', enabled)
  }

  /**
   * Enable or disable replaying as soon as a conversation is entered.
   * @param enabled - whether entering a conversation plays at once.
   */
  setPlayOnSwitch(enabled: boolean): void {
    this.patch({ playOnSwitch: enabled })
    this.commit('playOnSwitch', enabled)
  }

  /**
   * Set the automatic replay interval.
   * @param seconds - requested interval.
   */
  setInterval(seconds: number): void {
    const next = clamp(seconds, INTERVAL_RANGE)
    this.patch({ intervalSeconds: next })
    this.schedule('intervalSeconds', next)
  }

  /**
   * Enable or disable replacing the shipped running mark.
   * @param enabled - whether the plugin's fish takes the mark's place.
   */
  setReplaceMark(enabled: boolean): void {
    this.patch({ replaceMark: enabled })
    this.commit('replaceMark', enabled)
  }

  /**
   * Switch the running mark color source.
   * @param mode - next color source.
   */
  setMarkColorMode(mode: WhaleColorMode): void {
    this.patch({ markColorMode: mode })
    this.commit('markColorMode', mode)
  }

  /**
   * Pick a custom running mark color.
   * @param color - lowercase '#rrggbb' color.
   */
  setMarkColor(color: string): void {
    if (!CUSTOM_COLOR_PATTERN.test(color)) return
    this.patch({ markColor: color })
    this.schedule('markColor', color)
  }

  /**
   * Switch the running status label color source.
   * @param mode - next color source.
   */
  setLabelColorMode(mode: WhaleColorMode): void {
    this.patch({ labelColorMode: mode })
    this.commit('labelColorMode', mode)
  }

  /**
   * Pick a custom running status label color.
   * @param color - lowercase '#rrggbb' color.
   */
  setLabelColor(color: string): void {
    if (!CUSTOM_COLOR_PATTERN.test(color)) return
    this.patch({ labelColor: color })
    this.schedule('labelColor', color)
  }

  /**
   * Set the running mark's size.
   * @param px - requested icon size in pixels.
   */
  setMarkSize(px: number): void {
    const next = clamp(px, MARK_SIZE_RANGE)
    this.patch({ markSize: next })
    this.schedule('markSize', next)
  }

  /**
   * Set the running status label size.
   *
   * The label keeps the row's fixed line height, so a larger size never grows
   * the padding around it.
   * @param px - requested label size in pixels.
   */
  setMarkLabelSize(px: number): void {
    const next = clamp(px, MARK_LABEL_SIZE_RANGE)
    this.patch({ markLabelSize: next })
    this.schedule('markLabelSize', next)
  }

  /**
   * Set the running mark's swing amplitude.
   * @param amplitude - requested multiplier.
   */
  setMarkSwing(amplitude: number): void {
    const next = clamp(amplitude, MARK_SWING_RANGE)
    this.patch({ markSwing: next })
    this.schedule('markSwing', next)
  }

  /**
   * Set the running mark's horizontal start offset.
   * @param px - requested offset in pixels.
   */
  setMarkOffsetX(px: number): void {
    const next = clamp(px, MARK_OFFSET_RANGE)
    this.patch({ markOffsetX: next })
    this.schedule('markOffsetX', next)
  }

  /**
   * Set the running mark's vertical start offset.
   * @param px - requested offset in pixels.
   */
  setMarkOffsetY(px: number): void {
    const next = clamp(px, MARK_OFFSET_RANGE)
    this.patch({ markOffsetY: next })
    this.schedule('markOffsetY', next)
  }

  /**
   * Choose the running mark's motion preset.
   * @param motion - accepted preset.
   */
  setMarkMotion(motion: WhaleMarkMotion): void {
    this.patch({ markMotion: motion })
    this.commit('markMotion', motion)
  }

  /** Stop pending work. */
  dispose(): void {
    this.disposed = true
    this.queued.clear()
    if (this.timer !== undefined) {
      clearTimeout(this.timer)
      this.timer = undefined
    }
  }

  /** Adopt the durable section unless local edits or a flush are in flight. */
  private adopt(): void {
    if (this.disposed || this.pending > 0 || this.timer !== undefined) return
    const snapshot = this.host.getSnapshot()
    if (snapshot.value === undefined) return
    const section = snapshot.value as Partial<WhaleSettings>
    this.store.set({ ...DEFAULT_SETTINGS, ...section, writable: snapshot.writable })
  }

  /**
   * Replace live values without waiting for the durable round trip.
   * @param patch - fields to overwrite.
   */
  private patch(patch: Partial<WhaleSettings>): void {
    this.store.update(draft => {
      Object.assign(draft, patch)
    })
  }

  /**
   * Write one field after the current reads settle.
   * @param field - section field name.
   * @param value - next value.
   */
  private commit(field: string, value: unknown): void {
    if (this.disposed || !this.store.getSnapshot().writable) return
    this.pending += 1
    void this.host.set(field, value).finally(() => {
      this.pending -= 1
      this.adopt()
    })
  }

  /**
   * Queue a slider write and flush it after the debounce window.
   * @param field - section field name.
   * @param value - next value.
   */
  private schedule(field: string, value: unknown): void {
    if (this.disposed || !this.store.getSnapshot().writable) return
    this.queued.set(field, value)
    if (this.timer !== undefined) clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.flush()
    }, WRITE_DELAY_MS)
  }

  /** Commit every queued slider write in input order. */
  private flush(): void {
    this.timer = undefined
    const entries = [...this.queued]
    this.queued.clear()
    for (const [field, value] of entries) this.commit(field, value)
  }
}

