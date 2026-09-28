import { registry } from "../core/registry.js";

/**
 * Dropzone — drag-and-drop file upload area.
 *
 * HTML structure:
 * ```html
 * <div class="cu-dropzone" data-cu-dropzone>
 *   <input type="file" data-cu-dropzone-input class="sr-only" multiple>
 *   <p>Drop files here or click to upload</p>
 * </div>
 * ```
 * - Click on zone triggers the hidden file input.
 * - Drag over: adds `cu-dropzone-active` class.
 * - Drop: assigns dropped files to input.files and dispatches "change" event.
 * - REQUIRED: `data-cu-dropzone-input` on the `<input type="file">` element.
 */
export function setupDropzones() {
  document.querySelectorAll("[data-cu-dropzone]").forEach(function (zone) {
    if (zone._cuInit) return;
    zone._cuInit = true;

    var input = zone.querySelector("[data-cu-dropzone-input]");
    if (!input) return;

    zone.addEventListener("click", function () {
      input.click();
    });

    zone.addEventListener("dragenter", function (e) {
      e.preventDefault();
      zone.classList.add("cu-dropzone-active");
    });

    zone.addEventListener("dragover", function (e) {
      e.preventDefault();
      zone.classList.add("cu-dropzone-active");
    });

    zone.addEventListener("dragleave", function () {
      zone.classList.remove("cu-dropzone-active");
    });

    zone.addEventListener("drop", function (e) {
      e.preventDefault();
      zone.classList.remove("cu-dropzone-active");
      var files = e.dataTransfer && e.dataTransfer.files;
      if (files && files.length) {
        input.files = files;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });

    registry.dropzones.push({ el: zone });
  });
}
