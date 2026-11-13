# Whale leap

[English](README.en.md) · [Chinese](README.md)

Whale leap adds a swimming whale to the DeepSeek Harness web client:

- **Background whale** — a dotted (or code-lettered) whale drifts behind the blank home; in started conversations it can appear on switch only, on the interval only, both, or not at all. Consecutive appearances alternate between the dotted and code-lettered frames. Clicking blank conversation space replays it. The frame atlas is read at runtime from the installed official brand package; this repository redistributes no artwork.
- **Running-status mark** — the fish left of “Deep diving” can replace the shipped icon with a switch; it keeps swimming, offers four motion presets, and its icon color and status-label color can follow the theme or be picked. Its size (8–28 px), label text size (11–20 px), swing amplitude (50 %–200 %) and independent horizontal/vertical start offsets have a live preview that mirrors the real status row (hairline divider, 28 px row) and shows the status label.
- **Settings page** — everything above lives under Settings › Whale leap. The top tab bar switches between Background and Running icon; the interface follows the DeepSeek Harness language, and strings ship in Chinese, English, Japanese, Spanish, French, German, Russian, and Portuguese.

## Install

1. Open **Plugins** in the DeepSeek Harness web client.
2. Choose **Add plugin** and enter this directory: `C:\Users\Y\Desktop\dsh project\whale-leap`.
3. Restart `dsh web` once. The Host loads the package the first time it appears in the profile, so the new settings section does not exist until that restart. Refresh the page after it.
4. Open **Settings › Whale leap**.

**Updating an installed copy.** Pull or edit this directory, then run `pnpm run build`. The Harness replaces a changed client bundle in open pages on its own (the web app mounts the client HMR chain), so the updated settings UI appears without a restart or a manual refresh. Restart `dsh web` only when the Host half changed — `index.js`, the settings schema, `cordis.patch.yml`, or the package metadata under `locale/` — because the Host reads those at startup. When the plugin was installed from a folder, the profile keeps a directory copy: copy the rebuilt package over `%USERPROFILE%\.dsh\profiles\web\node_modules\dsh-whale-leap` (or remove and re-add it in Plugins) before restarting.

The settings header shows the running version and a **Check for updates** button. The check reads the latest release from GitHub — the repository's `releases/latest` endpoint, then its tags when no release exists yet — compares it with the installed build, links the release page when a newer version exists, and reports plainly when nothing has been released or the probe fails, including the reason (GitHub rate limit, network, or timeout) plus a link to the releases page.

## Settings

Tabs sit in a full-width bar above the panel; the selected tab is a filled segment. Each tab groups its controls by topic: a small group title sits above the card that holds the rows.

### Background tab

**Appearance**

| Control | Meaning |
| --- | --- |
| Color | Follow the theme's text tone, or pick a custom ink color. |
| Background size | Scale of the painted scene (50 %–150 %). |
| Ink strength | 10 %–100 % response. The atlas keeps most dots faint; 60 % preserves the authored look and 100 % saturates them into solid black. |
| Frame mode | Dots, code lettering, or alternate between both (the default). |

**Playback**

| Control | Meaning |
| --- | --- |
| Show in conversations | Whether the whale reappears by itself in started conversations. |
| Appear when switching conversations | When off, entering a conversation waits for the next interval instead of playing at once. |
| Appearance interval | 5–300 s between automatic replays. |

A live preview canvas sits above the controls and replays with the current settings; a Replay button at its bottom-right restarts it, appearance changes replay it automatically, and while you scroll, the header and tabs stay pinned while the preview keeps its full height below them, so neither the preview nor anything above it is hidden.

### Running icon tab

**Running icon**

**Replace the running icon** switches the fish in place of the shipped whale tail; when off, the default icon returns. The stage above the choices mirrors the real conversation status row — a hairline divider above a 28 px row with the blue-tinted label — stays pinned while the settings list scrolls, and shows the selected motion at the exact configured size, so the label follows the interface language. Both the icon color and the status-label color can follow the theme or use a custom picker; a custom label color also re-mixes the shimmer highlight token, so the moving sweep follows it. The size slider sets the mark's box, 8–28 px; text size sets the status label, 11–20 px, changing only the glyph size while the row keeps its height and padding; horizontal and vertical position shift the mark's start point by −12 to +12 px each.

**Motion**

The motion cards each preview their own preset, and the selected card carries a text badge, not just a highlight. The swing amplitude slider scales the horizontal travel of Swimming, Explore, and Gentle sway from 50 % to 200 %; Home swim keeps the exact home-page amplitude.

## Behavior and limits

- Web client only. It registers `conversation.hero.frame`, `conversation.chat.running.mark`, and `settings.section`, so it needs `ui-conversation`, `ui-chat`, and `ui-settings`.
- The running icon prefers the `conversation.chat.running.mark` slot; on official builds that do not declare it, a DOM adapter mounts the same mark into the status row and hides the shipped icon, so Web and Desktop both work and turning the switch off restores the original.
- Settings are workspace-scoped and stored in the section namespace `whale-leap`.
- Reduced motion: all playback and sway stop; the mark stays static.
- Each appearance — on a conversation switch or on the interval — alternates between the dotted and code-lettered frames; a single playback never switches.
- Swing amplitude affects Swimming, Explore, and Gentle sway only; Home swim always keeps the home page's own amplitude.
- Code lettering scales with the background scene width, so the settings preview keeps the same relative text size as the real conversation background instead of oversized glyphs.
- The canvas backing store is capped at five million pixels and reused across layout passes, so large high-DPI windows do not allocate tens of megabytes.
- **The built-in brand package paints no whale.** It only registers sidebar artwork; this plugin owns the background and running-mark slots, so there is nothing to double up. Builds that declare `conversation.chat.running.mark` get the slot replacement; on official builds without it, the DOM adapter mounts the mark and hides the shipped icon.
- **The atlas is read at runtime, not shipped.** The Host half serves `@deepseek-ai/dsh-client-ui-brand-official`'s installed `lib/assets/breach-atlas-*.webp` on `/whale-leap/assets/atlas.webp`; standard Web and Desktop builds install that package. When it is missing, the background whale stays absent and the rest of the plugin keeps working.
- The renderer, code fill, and running-mark motion are adapted from DeepSeek Harness source under its MIT license; see [`THIRD-PARTY-NOTICES.md`](THIRD-PARTY-NOTICES.md). Redistribution must keep that notice.

## Credits

The renderer, code fill, fish paths, and running-mark motion are adapted from [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (MIT License, Copyright (c) 2026 DeepSeek). The whale frame atlas is not redistributed: the plugin reads it from the installed official brand package at runtime. See [`THIRD-PARTY-NOTICES.md`](THIRD-PARTY-NOTICES.md) for the full license text and the list of derived files. This plugin is unofficial, not affiliated with or endorsed by DeepSeek. The MIT license grants copyright permissions only; it grants no trademark rights in the DeepSeek name, logo, or artwork.

## Build

```powershell
pnpm install        # esbuild, react, and the Host's schemastery dev copy
pnpm run build      # writes lib/client.js as a ModuleLoader artifact
pnpm run check      # build + smoke + render + Host route checks
```

`lib/client.js` contains no bitmap. The Host half (`index.js`) imports `@deepseek-ai/schemastery` from the running profile and serves the official atlas bytes on `/whale-leap/assets/atlas.webp`. The browser bundle embeds `package.json`'s version for the update check.

## Releases

GitHub is the release source of truth. The settings page compares against the newest release (or tag) of this repository.

1. Bump the version: `pnpm run release:patch` (or `release:minor` / `release:major`). It updates `package.json`, commits, and creates the `vX.Y.Z` tag.
2. Push the commit and the tag: `git push --follow-tags`.
3. Publish the GitHub release for that tag: `gh release create vX.Y.Z --title "vX.Y.Z" --notes "…"`. The update check reads this release, so publishing it is what tells installed copies that a new build exists.

npm remains optional and manual: the workflow in [`.github/workflows/publish.yml`](.github/workflows/publish.yml) is `workflow_dispatch` only and needs a configured npm trusted publisher before it can publish.

## Layout

```text
index.js                     Host half: Config schema, settings.configure, atlas route
shared/settings.js           Field names, bounds, defaults shared by both halves
src/client/index.tsx         Client entry: three slot registrations
src/client/atlas.ts          Document-relative URL of the Host atlas route
src/client/store.ts          Settings runtime (mirror + debounced writes)
src/client/i18n.ts           Eight locale dictionaries for the settings page
src/client/settings/         Settings page and its module CSS
src/client/whale/            Whale canvas, renderer, code fill, fish mark, paths
src/client/update.ts         GitHub release check
locale/*.json                Plugin Manager title/description/detail metadata
docs/DETAIL.md               Plugin detail page document
```

---

[![](https://img.shields.io/badge/powered_by-dsh-4D6BFE?style=flat-square&logo=deepseek&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)
