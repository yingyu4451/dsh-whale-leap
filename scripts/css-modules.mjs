/**
 * esbuild plugin that scopes CSS Modules class names and injects one style tag.
 *
 * The plugin has no runtime dependencies, so both the production build and the
 * render smoke check share exactly the same stylesheet behavior.
 */

/** Scope class names per CSS file and inject the stylesheet once at import. */
export function cssModules() {
  return {
    name: 'whale-leap-css-modules',
    setup(build) {
      build.onLoad({ filter: /\.module\.css$/ }, async args => {
        const { createHash } = await import('node:crypto')
        const { readFile } = await import('node:fs/promises')
        const source = await readFile(args.path, 'utf8')
        const suffix = `_${createHash('sha1').update(source).digest('hex').slice(0, 7)}`
        const mapping = {}
        const scoped = source.replace(/\.([A-Za-z_][\w-]*)/g, (match, name) => {
          mapping[name] = `${name}${suffix}`
          return `.${name}${suffix}`
        })
        const contents = `const css = ${JSON.stringify(mapping)}
const sheet = document.createElement('style')
sheet.dataset.pluginCss = 'whale-leap'
sheet.textContent = ${JSON.stringify(scoped)}
document.head.appendChild(sheet)
export default css
`
        return { contents, loader: 'js' }
      })
    },
  }
}
