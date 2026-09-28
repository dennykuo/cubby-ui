import { setupOverlay } from "../core/overlay.js";

/**
 * Alert Dialog — blocking confirmation dialog using native <dialog>.
 *
 * HTML structure:
 * ```html
 * <button data-cu-alert-dialog-trigger="confirm-id">Delete</button>
 * <dialog id="confirm-id" class="cu-alert-dialog">
 *   <div class="cu-alert-dialog-header">
 *     <h2 class="cu-alert-dialog-title">Are you sure?</h2>
 *     <p class="cu-alert-dialog-description">This cannot be undone.</p>
 *   </div>
 *   <div class="cu-alert-dialog-footer">
 *     <button data-cu-alert-dialog-cancel>Cancel</button>
 *     <button data-cu-alert-dialog-action>Confirm</button>
 *   </div>
 * </dialog>
 * ```
 * IMPORTANT: Does NOT close on backdrop click (by design, prevents accidental dismissal).
 * Only data-cu-alert-dialog-cancel and data-cu-alert-dialog-action close the dialog.
 * ARIA role="alertdialog" is set automatically.
 */
export function setupAlertDialogs() {
  setupOverlay({
    triggerAttr: "data-cu-alert-dialog-trigger",
    dialogAttr: "data-cu-alert-dialog",
    closeAttrs: ["data-cu-alert-dialog-cancel", "data-cu-alert-dialog-action"],
    closeOnBackdrop: false,
    titleClass: "cu-alert-dialog-title",
    descClass: "cu-alert-dialog-description",
    role: "alertdialog",
  });
}
