# Third-party notices

This plugin is an unofficial, community project. It is not affiliated with,
endorsed by, or sponsored by DeepSeek.

## DeepSeek Harness

Parts of this plugin are derived from the DeepSeek Harness repository
(<https://github.com/deepseek-ai/deepseek-harness>), which is distributed under
the MIT License:

> MIT License
>
> Copyright (c) 2026 DeepSeek
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.

Derived or adapted files:

- `assets/breach-atlas.webp`: the whale frame atlas from
  `packages/client/ui-brand-official/src/client/assets/breach-atlas.webp`,
  redistributed unchanged.
- `src/client/whale/renderer.ts`, `src/client/whale/code-fill.ts`,
  `src/client/whale/artwork.ts`: the whale canvas renderer and code-lettering
  fill, adapted from `packages/client/ui-brand-official/src/client/home-whale/`
  to take runtime settings and to fix preview-scaling.

- `src/client/whale/fish-paths.ts`, `src/client/whale/WhaleMarkFish.tsx`,
  `src/client/whale/RunningMark.tsx` and the related module CSS: the running
  mark animation, derived from the fish paths and motion in
  `packages/client/ui-primitives/src/FishLogo.tsx` and
  `packages/client/ui-settings-general` / `ui-conversation` behaviour.

## Trademarks

DeepSeek, DeepSeek Harness, and their logos and artwork are trademarks or brand
assets of DeepSeek. The MIT License above grants copyright permissions only; it
does not grant any trademark rights. This plugin uses adapted artwork to
reproduce the DSH visual style, is labeled as unofficial, and must not be
presented as an official DeepSeek product or as endorsed by DeepSeek.

If you redistribute this plugin, keep this notice and the MIT copyright notice
above.
