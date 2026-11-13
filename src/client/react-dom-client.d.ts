/**
 * Minimal type surface for the platform-provided `react-dom/client` module.
 * @types/react-dom is not installed in this standalone plugin.
 */
declare module 'react-dom/client' {
  import type { ReactNode } from 'react'

  /** Root rendered into one container. */
  export interface Root {
    /** Render or update the tree under this root. */
    render(children: ReactNode): void
    /** Tear the root down and detach it from its container. */
    unmount(): void
  }

  /** Create a React root inside the given container. */
  export function createRoot(container: Element | DocumentFragment): Root
}
