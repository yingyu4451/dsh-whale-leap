# Whale leap

Whale leap is a local DeepSeek Harness plugin that adds a swimming whale to the web client.

## What it adds

- A whale canvas behind the blank home. With **Show in conversations** enabled it also paints behind started conversations, replaying on a configurable interval. Each appearance alternates through the enabled fill styles (dots and code fill by default). Clicking blank conversation space replays it once.
- A swimming fish mark left of the running Turn label. A switch decides whether it replaces the shipped whale tail; the fish uses the same silhouette as the blank home, at a size of 8–28 px with a swing amplitude of 50 %–200 %, both the icon color and the status-label color can follow the theme or be picked, and the running-label size of 11–20 px never changes the row's height or padding. Independent horizontal and vertical start offsets, four motion presets, and a live preview that mirrors the real conversation status row complete it; these appearance controls live in the Live preview panel.
- A settings section, **Settings › Whale leap**, whose page keeps only the preview canvas, playback group, and one Live preview entry; every appearance control lives in the floating preview panel, grouped into Background and Running icon tabs; the panel uses a stronger frosted surface, border, and shadow so it never blends into the page.
- A version line and **Check for updates** in the settings header: it queries the GitHub release API and the jsDelivr tag mirror in parallel, preferring the release result and falling back to the mirror (no GitHub API quota). When a newer build exists, an **Upgrade** button resolves the release tag to its commit and hands the swap to the DSH plugin manager (remove, then install that commit; a failed install is rolled back to the previous spec). Restart `dsh web` after the upgrade to load the new version. The release-page link remains as the fallback when the plugin manager is unavailable or the probe fails/rate-limits.

## Use

1. In the web client, open **Plugins** and choose **Add plugin**, then give the directory `C:\Users\Y\Desktop\dsh project\whale-leap`.
2. Restart `dsh web` once: the Host loads the package and its settings schema at startup. After the restart, refresh the page.
3. Open Settings › Whale leap and adjust the options; changes apply live.

## Behavior

- The settings page keeps only the playback controls, a preview canvas per tab, and one Live preview entry; every appearance control lives in the floating preview panel, grouped into Background and Running icon tabs; the panel uses a stronger frosted surface, border, and shadow so it never blends into the page. The header, tabs, and preview stay pinned as one block with spacing and a blank gap below the preview.
- Live preview hides the settings dialog, keeps the whale looping in the real conversation, and shows a floating panel. On the blank home it first stages a simulated conversation (demo turns, the composer, and the running Turn row) in the real conversation column, so the appearance can be tuned before a session exists. Its Background tab holds Appearance (color, background size 50 %–150 %, ink strength 10 %–100 %; 60 % keeps the authored look, 100 % saturates faint dots to solid black), Arrival (Multiple whales, Entrance, Size range, Distance ink, Random position, plus horizontal/vertical start offsets −200 to +200 px each when the position is fixed), and fill style; the Running icon tab holds replace, icon color, text color, icon size (8–28 px), label size (11–20 px, glyphs only), horizontal/vertical position (−12 to +12 px each), motion (Swimming, Explore, Home swim, Gentle sway), and swing amplitude (50 %–200 %). Esc or Back to settings restores the dialog.
- Multiple whales (on by default) draws one to three whales at once, independent of the position switch: with Random position on they land in separate spots that never overlap or crowd, and with it off they line up as a fixed formation centered in the scene while the horizontal/vertical offsets shift the whole group. Turning Multiple whales off shows a single whale whose spot follows Random position (or the fixed offsets when random is off). Entrance chooses whether the pod leaps all at once or each whale picks its own random start time; Distance ink (on by default) makes farther whales lighter (nearest 100 % ink, farthest about 55 %), and turning it off gives the whole pod one ink; Size range sets the farthest-to-nearest pod whale sizes with two sliders (20 %–100 %, default 34 %–68 %). Dependent rows use accordions: children auto-expand while the parent switch is on and collapse when it is off; the chevron next to the parent opens them on demand, with the children disabled while the parent is off.
- Fill styles are side-by-side multi-select buttons (dots, code fill, ASCII glyphs, binary tokens, diagonal hatching); enabled styles alternate in order and at least one must stay on. A custom text color also re-mixes the shimmer highlight so the moving sweep follows it.
- Show in conversations controls whether the whale appears on its own; Appear when switching conversations decides whether entering a conversation plays immediately or waits for the next interval. The interval is picked with minute and second dropdowns (5 s–59 min 59 s); Random interval is off by default — when off, appearances follow the configured interval exactly; when on, the configured interval is the upper bound, each wait lands between 0.5x and the configured interval, and the interval dropdowns are disabled until Random interval is turned off again.
- The preview canvas replays with the current settings; Replay restarts it, and appearance changes replay it automatically.
- The running-icon preview mirrors the real status row (hairline divider, 28 px row, blue-tinted label), and a custom text color re-mixes the shimmer highlight.
- Swing amplitude scales only Swimming, Explore, and Gentle sway; Home swim keeps the home page's own amplitude.
- The code-lettered fill scales its lettering with the background scene width, so previews and narrow panes keep the authored text proportion.
- Reduced motion: playback and sway stop; the mark stays static.
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

