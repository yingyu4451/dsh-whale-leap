# Whale leap

Whale leap is a local DeepSeek Harness plugin that adds a swimming whale to the web client.

## What it adds

- A whale canvas behind the blank home. With **Show in conversations** enabled it also paints behind started conversations, replaying on a configurable interval. Each appearance alternates between the dotted and code-lettered frames. Clicking blank conversation space replays it once.
- A swimming fish mark left of the running Turn label. A switch decides whether it replaces the shipped whale tail; the fish uses the same silhouette as the blank home, at a size of 8–28 px with a swing amplitude of 50 %–200 %, both the icon color and the status-label color can follow the theme or be picked, and the running-label size of 11–20 px never changes the row's height or padding. Independent horizontal and vertical start offsets, four motion presets, a Replay control, and a live preview that mirrors the real conversation status row complete it.
- A settings section, **Settings › Whale leap**, split into a Background tab and a Running icon tab; each tab groups its controls under Appearance, Playback, Display, or Motion headings.
- A version line and **Check for updates** in the settings header: it queries the GitHub release API and the jsDelivr tag mirror in parallel, preferring the release result and falling back to the mirror (no GitHub API quota), links the newer release, and reports plainly when nothing has been released.

## Use

1. In the web client, open **Plugins** and choose **Add plugin**, then give the directory `C:\Users\Y\Desktop\dsh project\whale-leap`.
2. Restart `dsh web` once: the Host loads the package and its settings schema at startup. After the restart, refresh the page.
3. Open Settings › Whale leap and adjust the options; changes apply live.

## Behavior

- Color: follow the theme text tone or pick a custom ink color.
- Background size: 50 %–150 % of the authored scene. Horizontal and vertical start offsets move the scene by –200 to +200 px each. The Live preview button hides the settings dialog, keeps the whale looping in the real conversation, and floats a compact bar that switches between background (size and offsets) and running icon (size, label size, and offsets); Esc or Back to settings restores the dialog. Ink strength: 10 %–100 %; the source atlas keeps dots faint, so 60 % preserves the authored look and 100 % saturates them into solid black. Fill styles (dots, code fill, ASCII glyphs, binary tokens, and diagonal hatching) each have an independent switch; enabled styles alternate in display order and at least one must stay on.
- Show in conversations: the whale appears on its own after a conversation starts. **Appear when switching conversations** decides whether entering a conversation plays immediately or waits for the next interval. The interval is 5–300 s.
- The header, tabs, and preview are one sticky block with spacing between them and below the preview, so scrolling content never slides between them.
- Running icon: **Replace the running icon** toggles the fish against the shipped whale tail. Choose Swimming, Explore, Home swim, or Gentle sway; every card animates its own preset, the stage above mirrors the real conversation status row (hairline divider above a 28 px row, blue-tinted label (the same deep-diving blue as the real row when following the theme)), keeps its full height while pinned below the header and tabs, and shows the mark at the exact configured size while you drag the sliders; the selected card shows a text badge as well as a highlight. The label follows the interface language. **Icon color** and **Text color** each follow the theme or use a custom picker; a custom text color also re-mixes the shimmer highlight so the moving sweep follows it. **Text size** (11–20 px) changes the running-status label only, keeping the row's height and padding fixed. **Swing amplitude** (50 %–200 %) scales only Swimming, Explore, and Gentle sway; Home swim keeps the home page's own amplitude. **Horizontal position** and **Vertical position** shift the mark's start point independently by −12 to +12 px each.
- The settings page groups controls by topic: a small heading sits above the card that holds the rows.
- The code-lettered fill scales its lettering with the background scene width, so previews and narrow panes keep the authored text proportion.
- Reduced motion: playback and sway stop; the mark stays static.
- Each appearance — on a conversation switch or on the interval — alternates between the dotted and code-lettered frames; one playback never switches.
- The background canvas caps its backing store at five million pixels and reuses the buffer across layout passes.

## Limits

- Web client only; it needs the `ui-conversation`, `ui-chat`, and `ui-settings` client packages.
- Settings are workspace-scoped and stored in the settings namespace `whale-leap`.
- The built-in brand package no longer paints any whale; it only supplies sidebar artwork, so this plugin does not overlap with it. Builds that declare `conversation.chat.running.mark` get the slot replacement; on official builds without it, a DOM adapter mounts the same mark and hides the shipped icon.
- The frame atlas (`assets/breach-atlas.webp`) is redistributed under the MIT License and embedded as a data URL in `lib/client.js`; the background whale therefore needs no Host route, works offline, and also works on packaged Desktop builds whose brand package sits inside an asar archive.
- The settings page follows the DeepSeek Harness interface language (Chinese, English, Japanese, Spanish, French, German, Russian, Portuguese).

## Build

```powershell
pnpm install
pnpm run build
```

This writes `lib/client.js`, a ModuleLoader artifact that embeds the frame atlas as a webp data URL. The Host half (`index.js`) only imports `@deepseek-ai/schemastery` from the running profile and registers the settings page.
