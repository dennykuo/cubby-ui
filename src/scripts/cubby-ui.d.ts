/**
 * Cubby UI — Interactive component scripts
 * Framework-agnostic, vanilla JS (UMD)
 */
export interface CubbyUI {
  /** Initialize all interactive components. Auto-called on DOMContentLoaded. Safe to call repeatedly for dynamically added elements. */
  init(): void;
  /** Clear all internal tracking arrays. Use with SPA route transitions. */
  destroy(): void;
  /** Remove stale references for detached elements and re-run init(). Use after dynamic content updates. */
  refresh(): void;
}

declare const cubbyUI: CubbyUI;
export default cubbyUI;

declare global {
  interface Window {
    CubbyUI: CubbyUI;
  }
}
