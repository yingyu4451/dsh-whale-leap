# Whale leap

Whale leap is a local DeepSeek Harness plugin that adds a swimming whale to the web client.

## What it adds

- A whale canvas behind the blank home. With **Show in conversations** enabled it also paints behind started conversations, replaying on a configurable interval. Clicking blank conversation space replays it once.
- A swimming fish mark left of the running Turn label. A switch decides whether it replaces the shipped whale tail; the fish uses the same silhouette as the blank home, at a size of 8–28 px, with four motion presets and a live size preview.
- A settings section, **Settings › Whale leap**, split into a Background tab and a Running icon tab.
- A version line and **Check for updates** in the settings header: it reads the latest published version from npmjs (npmmirror fallback), links the newer release, and reports plainly when the package is not published yet.

## Use

1. In the web client, open **Plugins** and choose **Add plugin**, then give the directory `C:\Users\Y\Desktop\dsh project\whale-leap`.
2. Restart `dsh web` once: the Host loads the package and its settings schema at startup. After the restart, refresh the page.
3. Open Settings › 鲸跃 / Whale leap and adjust the options; changes apply live.

## Behavior

- Color: follow the theme text tone or pick a custom ink color.
- Background size: 50 %–150 % of the authored scene. Ink strength: 10 %–100 %; the source atlas keeps dots faint, so 60 % preserves the authored look and 100 % saturates them into solid black.
- Show in conversations: the whale appears on its own after a conversation starts. **Appear when switching conversations** decides whether entering a conversation plays immediately or waits for the next interval. The interval is 5–300 s.
- Running icon: **Replace the running icon** toggles the fish against the shipped whale tail. Choose Swimming, Explore, Home swim, or Gentle sway; every card animates its own preset, the stage above shows the mark at the exact configured size while you drag the slider, and the selected card shows a text badge as well as a highlight.
- The code-lettered fill scales its lettering with the background scene width, so previews and narrow panes keep the authored text proportion.
- Reduced motion: playback and sway stop; the mark stays static.
- The background canvas caps its backing store at five million pixels and reuses the buffer across layout passes.

## Limits

- Web client only; it needs the `ui-conversation`, `ui-chat`, and `ui-settings` client packages.
- Settings are workspace-scoped and stored in the settings namespace `whale-leap`.
- The built-in brand package no longer paints any whale; it only supplies sidebar artwork, so this plugin does not overlap with it. Requires a DSH build declaring `conversation.chat.running.mark`.
- Whale artwork is derived from DeepSeek Harness brand assets and is intended for this local plugin.

## Build

```powershell
pnpm install
pnpm run build
```

This writes `lib/client.js`, a ModuleLoader artifact with the atlas embedded as a data URL. The Host half is plain ESM (`index.js`) and imports `@deepseek-ai/schemastery` from the running profile.
