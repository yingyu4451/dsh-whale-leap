# Whale leap

Whale leap adds a swimming whale to the DeepSeek Harness web client:

- **Background whale** — a dotted (or code-lettered) whale drifts behind the blank home and, when enabled, behind started conversations. Clicking blank conversation space replays it.
- **Running-status mark** — the fish left of “深度求索中” can replace the shipped icon with a switch; it keeps swimming, offers four motion presets, and its size (8–28 px) has a live preview.
- **Settings page** — everything above lives under Settings › 鲸跃, in two tabs.

## Install

1. Open **Plugins** in the DeepSeek Harness web client.
2. Choose **Add plugin** and enter this directory: `C:\Users\Y\Desktop\dsh project\whale-leap`.
3. Restart `dsh web` once. The Host loads the package the first time it appears in the profile, so the new settings section does not exist until that restart. Refresh the page after it.
4. Open **Settings › 鲸跃**.

**Updating an installed copy.** Pull or edit this directory, run `pnpm run build`, then restart `dsh web` once more. The Host reads the settings schema only at startup, so new fields (for example the running-icon switch) do not persist until that restart.

The plugin is a local, private bundle (`dsh-whale-leap`); nothing is published to a registry. Repository: [yingyu4451/dsh-whale-leap](https://github.com/yingyu4451/dsh-whale-leap).

## Settings

### Background tab

| Control | Meaning |
| --- | --- |
| Color | Follow the theme's text tone, or pick a custom ink color. |
| Background size | Scale of the painted scene (50 %–150 %). |
| Ink strength | 10 %–100 % response. The atlas keeps most dots faint; 60 % preserves the authored look and 100 % saturates them into solid black. |
| Show in conversations | Whether the whale reappears by itself in started conversations. |
| Appear when switching conversations | When off, entering a conversation waits for the next interval instead of playing at once. |
| Appearance interval | 5–300 s between automatic replays. |

A live preview canvas sits above the controls and replays with the current settings.

### Running icon tab

**Replace the running icon** switches the fish in place of the shipped whale tail; when off, the default icon returns. The stage above the choices shows the selected motion at the exact configured size, so dragging the size slider previews the real mark while you adjust it. The motion cards below the switch each preview their own preset, and the selected card carries a text badge, not just a highlight. The size slider sets the mark's box, 8–28 px.

## Behavior and limits

- Web client only. It registers `conversation.hero.frame`, `conversation.chat.running.mark`, and `settings.section`, so it needs `ui-conversation`, `ui-chat`, and `ui-settings`.
- Settings are workspace-scoped and stored in the section namespace `whale-leap`.
- Reduced motion: all playback and sway stop; the mark stays static.
- Code lettering scales with the background scene width, so the settings preview keeps the same relative text size as the real conversation background instead of oversized glyphs.
- The canvas backing store is capped at five million pixels and reused across layout passes, so large high-DPI windows do not allocate tens of megabytes.
- **The built-in brand package paints no whale.** It only registers sidebar artwork; this plugin owns the background and running-mark slots, so there is nothing to double up. It does require a DSH build that declares `conversation.chat.running.mark` (current checkout).
- The whale artwork is derived from DeepSeek Harness brand assets and is meant for this local plugin only.

## Build

```powershell
pnpm install        # pulls esbuild only
pnpm run build      # writes lib/client.js as a ModuleLoader artifact
```

`lib/client.js` embeds the atlas as a data URL. The Host half is plain ESM (`index.js`) importing `@deepseek-ai/schemastery` from the running profile.

## Layout

```text
index.js                     Host half: Config schema + settings.configure
shared/settings.js           Field names, bounds, defaults shared by both halves
src/client/index.tsx         Client entry: three slot registrations
src/client/store.ts          Settings runtime (mirror + debounced writes)
src/client/settings/         Settings page and its module CSS
src/client/whale/            Whale canvas, renderer, code fill, fish mark, paths
assets/breach-atlas.webp     Frame atlas (137 frames, 12 columns)
locale/*.json                Plugin Manager title/description/detail metadata
docs/DETAIL.md               Plugin detail page document
```


