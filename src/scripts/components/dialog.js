import { setupOverlay } from "../core/overlay.js";

/**
 * Dialog — modal dialog using native <dialog>.
 *
 * HTML structure:
 * ```html
 * <button data-cu-dialog-trigger="dialog-id">Open</button>
 * <dialog id="dialog-id" class="cu-dialog cu-dialog-md">
 *   <div class="cu-dialog-header">
 *     <h2 class="cu-dialog-title">Title</h2>
 *     <p class="cu-dialog-description">Description</p>
 *   </div>
 *   <div class="cu-dialog-footer">
 *     <button data-cu-dialog-close>Cancel</button>
 *     <button>Confirm</button>
 *   </div>
 * </dialog>
 * ```
 * Sizes: cu-dialog-sm | cu-dialog-md (default) | cu-dialog-xl | cu-dialog-full
 * Closes on backdrop click. Focus returns to trigger on close.
 */
export function setupDialogs() {
  setupOverlay({
    triggerAttr: "data-cu-dialog-trigger",
    dialogAttr: "data-cu-dialog",
    closeAttrs: ["data-cu-dialog-close"],
    closeOnBackdrop: true,
    titleClass: "cu-dialog-title",
    descClass: "cu-dialog-description",
  });
}
