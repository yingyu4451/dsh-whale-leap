# Whale leap

[English](README.en.md) · [Chinese](README.md)

Whale leap adds a swimming whale to the DeepSeek Harness web client:

- **Background whale** — a dotted (or code-lettered) whale drifts behind the blank home; in started conversations it can appear on switch only, on the interval only, both, or not at all. Consecutive appearances alternate through the enabled fill styles (dots and code fill by default). Random position picks a new spot each time and draws 2–3 whales together, spread apart without overlapping; farther whales use lighter ink, and their entrance can be simultaneous or randomized, with a configurable farthest-to-nearest size range. Clicking blank conversation space replays it. The frame atlas ships inside the plugin bundle and works offline.
- **Running-status mark** — the fish left of “Deep diving” can replace the shipped icon with a switch; it keeps swimming, offers four motion presets, and its icon color and status-label color can follow the theme or be picked. Its size (8–28 px), label text size (11–20 px), swing amplitude (50 %–200 %) and independent horizontal/vertical start offsets are adjusted in the Live preview panel, while the preview mirrors the real status row (hairline divider, 28 px row) and shows the status label.
- **Settings page** — the page keeps only the playback group, a preview canvas per tab, and one Live preview entry; every appearance control lives in the floating preview panel, grouped into Background and Running icon tabs. The interface follows the DeepSeek Harness language, and strings ship in Chinese, English, Japanese, Spanish, French, German, Russian, and Portuguese.

## Install

1. Open **Plugins** in the DeepSeek Harness web client.
2. Choose **Add plugin** and enter this directory: `C:\Users\Y\Desktop\dsh project\whale-leap`.
3. Restart `dsh web` once. The Host loads the package the first time it appears in the profile, so the new settings section does not exist until that restart. Refresh the page after it.
4. Open **Settings › Whale leap**.

**Updating an installed copy.** Pull or edit this directory, then run `pnpm run build`. The Harness replaces a changed client bundle in open pages on its own (the web app mounts the client HMR chain), so the updated settings UI appears without a restart or a manual refresh. Restart `dsh web` only when the Host half changed — `index.js`, the settings schema, `cordis.patch.yml`, or the package metadata under `locale/` — because the Host reads those at startup. When the plugin was installed from a folder, the profile keeps a directory copy: copy the rebuilt package over `%USERPROFILE%\.dsh\profiles\web\node_modules\dsh-whale-leap` (or remove and re-add it in Plugins) before restarting.

The settings header shows the running version and a **Check for updates** button. The check queries the GitHub release API and jsDelivr's tag mirror in parallel, preferring the release result and falling back to the mirror (not bound by the GitHub API quota). When a newer version exists it offers an **Upgrade** button: the version's tag is resolved to a commit, the DSH plugin manager reinstalls Whale leap at that commit (with automatic rollback on failure), and `dsh web` must be restarted afterwards to load the new build. If the plugin manager is unavailable or the probe fails, the release-page link is kept as a fallback, and the reason (GitHub rate limit, network, or timeout) is reported plainly.

## Settings

The settings page keeps only the playback controls, a preview canvas above each tab, and one Live preview entry. Every appearance control lives in the floating preview panel, so the page does not duplicate them. The header, tabs, and preview stay pinned as one block with spacing between them and a blank gap under the preview, so scrolled content never squeezes between them.

### Background

The page shows only the Playback group:

| Option | Meaning |
| --- | --- |
| Show in conversations | Whether the whale appears on its own after a conversation starts. |
| Appear when switching conversations | When off, entering a conversation waits for the next interval instead of playing at once. |
| Appearance interval | 5–300 s between automatic replays. |

The preview canvas replays with the current settings; Replay restarts it, and Live preview hides the settings dialog and keeps the whale playing on a loop in the real conversation. The panel's Background tab holds every background appearance control:

| Option | Meaning |
| --- | --- |
| Color | Follow the theme or pick an ink color. |
| Background size | Scale of the painted scene, 50 %–150 %. |
| Horizontal position | Start offset −200 to +200 px; negative moves left. |
| Vertical position | Start offset −200 to +200 px; negative moves up. |
| Ink strength | 10 %–100 %; 60 % keeps the authored look, 100 % pushes faint dots to solid black. |
| Fill style | Side-by-side buttons for dots, code fill, glyphs, binary tokens, and hatching; multiple can be enabled, enabled styles alternate in order, and at least one stays on. |
| Random position | Picks a new spot each appearance and keeps the whole breach on screen; each appearance then draws 2–3 whales. |
| Multiple whales | With random position on, each appearance draws 2–3 whales, spread apart without overlapping or crowding. |
| Distance ink | Farther whales use lighter ink so the pod reads with depth; turn it off to use one ink level. |
| Entrance | Together (all leap at once) or random times (each picks its own start). |
| Size range | Farthest-to-nearest pod whale sizes, 20 %–100 %; farther whales are smaller. |

### Running icon tab

The page keeps only the preview that mirrors the real status row (hairline divider, 28 px row, blue-tinted label) and the Live preview entry. The panel's Running icon tab holds: replace the running icon, icon color, text color, icon size (8–28 px), text size (11–20 px, glyphs only), horizontal/vertical position (−12 to +12 px each), motion (Swimming, Explore, Home swim, Gentle sway), and swing amplitude (50 %–200 %; Home swim ignores it). A custom text color also re-mixes the shimmer highlight.

Press Esc or Back to settings to restore the dialog.

## Behavior and limits

- Web client only. It registers `conversation.hero.frame`, `conversation.chat.running.mark`, and `settings.section`, so it needs `ui-conversation`, `ui-chat`, and `ui-settings`.
- The running icon prefers the `conversation.chat.running.mark` slot; on official builds that do not declare it, a DOM adapter mounts the same mark into the status row and hides the shipped icon, so Web and Desktop both work and turning the switch off restores the original.
- Settings are workspace-scoped and stored in the section namespace `whale-leap`.
- Reduced motion: all playback and sway stop; the mark stays static.
- Each appearance — on a conversation switch or on the interval — cycles through the enabled fill styles; a single playback never switches. When several whales appear together, non-dot fills mask each whale by its own silhouette on an offscreen canvas before compositing, so pod members never erase one another or leave clipped seams.
- Swing amplitude affects Swimming, Explore, and Gentle sway only; Home swim always keeps the home page's own amplitude.
- The background size and start offsets also preview live in the conversation: release a slider to hide the settings, then keep dragging the floating bar's sliders.
- Code lettering scales with the background scene width, so the settings preview keeps the same relative text size as the real conversation background instead of oversized glyphs.
- The canvas backing store is capped at five million pixels and reused across layout passes, so large high-DPI windows do not allocate tens of megabytes.
- **The built-in brand package paints no whale.** It only registers sidebar artwork; this plugin owns the background and running-mark slots, so there is nothing to double up. Builds that declare `conversation.chat.running.mark` get the slot replacement; on official builds without it, the DOM adapter mounts the mark and hides the shipped icon.
- **The atlas ships with the plugin.** `assets/breach-atlas.webp` is redistributed under the MIT License and embedded as a data URL at build time, so the background whale renders offline and on packaged Desktop builds whose official brand package lives inside an asar archive that plain file reads cannot reach.
- The renderer, code fill, and running-mark motion are adapted from DeepSeek Harness source under its MIT license; see [`THIRD-PARTY-NOTICES.md`](THIRD-PARTY-NOTICES.md). Redistribution must keep that notice.

## Credits

The renderer, code fill, fish paths, and running-mark motion are adapted from [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (MIT License, Copyright (c) 2026 DeepSeek). The whale frame atlas comes from the same repository and is redistributed under the MIT License. See [`THIRD-PARTY-NOTICES.md`](THIRD-PARTY-NOTICES.md) for the full license text and the list of derived files. This plugin is unofficial, not affiliated with or endorsed by DeepSeek. The MIT license grants copyright permissions only; it grants no trademark rights in the DeepSeek name, logo, or artwork.

## Build

```powershell
pnpm install        # esbuild, react, and the Host's schemastery dev copy
pnpm run build      # writes lib/client.js as a ModuleLoader artifact
pnpm run check      # build + smoke + render + Host route checks
```

`lib/client.js` embeds the frame atlas as a webp data URL (about 252 KB of base64). The Host half (`index.js`) only imports `@deepseek-ai/schemastery` from the running profile and registers the settings page. The browser bundle embeds `package.json`'s version for the update check.

## Releases

GitHub is the release source of truth. The settings page compares against the newest release (or tag) of this repository.

1. Bump the version: `pnpm run release:patch` (or `release:minor` / `release:major`). It updates `package.json`, commits, and creates the `vX.Y.Z` tag.
2. Push the commit and the tag: `git push --follow-tags`.
3. Publish the GitHub release for that tag: `gh release create vX.Y.Z --title "vX.Y.Z" --notes "…"`. The update check reads this release, so publishing it is what tells installed copies that a new build exists.

npm remains optional and manual: the workflow in [`.github/workflows/publish.yml`](.github/workflows/publish.yml) is `workflow_dispatch` only and needs a configured npm trusted publisher before it can publish.

## Layout

```text
index.js                     Host half: Config schema and settings.configure
shared/settings.js           Field names, bounds, defaults shared by both halves
src/client/index.tsx         Client entry: three slot registrations
src/client/atlas.ts          Data URL of the bundled frame atlas
src/client/store.ts          Settings runtime (mirror + debounced writes)
src/client/i18n.ts           Eight locale dictionaries for the settings page
src/client/settings/         Settings page and its module CSS
src/client/whale/            Whale canvas, renderer, code fill, fish mark, paths
src/client/update.ts         GitHub release check
src/client/upgrade.ts        In-place upgrade (tag → commit, reinstall via the plugin manager)
locale/*.json                Plugin Manager title/description/detail metadata
docs/DETAIL.md               Plugin detail page document
```

---

[![](https://img.shields.io/badge/powered_by-dsh-4D6BFE?style=flat-square&logo=deepseek&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)
