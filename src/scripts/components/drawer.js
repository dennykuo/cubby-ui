import { setupOverlay } from "../core/overlay.js";

/**
 * Drawer — side panel using native <dialog>.
 *
 * HTML structure:
 * ```html
 * <button data-cu-drawer-trigger="drawer-id">Open</button>
 * <dialog id="drawer-id" class="cu-drawer cu-drawer-right" data-cu-drawer>
 *   <div class="cu-drawer-header">
 *     <h2 class="cu-drawer-title">Title</h2>
 *     <button data-cu-drawer-close>✕</button>
 *   </div>
 *   <div class="cu-drawer-content">Content</div>
 *   <div class="cu-drawer-footer">
 *     <button data-cu-drawer-close>Close</button>
 *   </div>
 * </dialog>
 * ```
 * Directions: cu-drawer-right (default) | cu-drawer-left | cu-drawer-top | cu-drawer-bottom
 * Closes on backdrop click. Focus returns to trigger on close.
 * `data-cu-drawer` on the <dialog> is required: without it the trigger still opens it, but close buttons,
 * backdrop click, the aria-labelledby / aria-describedby links and focus return are not wired up.
 */
export function setupDrawers() {
  setupOverlay({
    triggerAttr: "data-cu-drawer-trigger",
    dialogAttr: "data-cu-drawer",
    closeAttrs: ["data-cu-drawer-close"],
    closeOnBackdrop: true,
    titleClass: "cu-drawer-title",
    descClass: "cu-drawer-description",
  });
}
