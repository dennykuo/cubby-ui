import { genId } from "./utils.js";

export function setupOverlay(config) {
  // Move focus into the dialog on open (WCAG 2.4.3): first focusable element,
  // unless the author already designated one via [autofocus].
  function focusInitial(dialog) {
    if (dialog.querySelector("[autofocus]")) return;
    var focusable = dialog.querySelector(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusable) requestAnimationFrame(function () { focusable.focus(); });
  }

  document
    .querySelectorAll("[" + config.triggerAttr + "]")
    .forEach(function (/** @type {HTMLElement} */ trigger) {
      if (trigger._cuInit) return;
      trigger._cuInit = true;

      trigger.addEventListener("click", function () {
        var id = trigger.getAttribute(config.triggerAttr);
        var dialog = /** @type {HTMLDialogElement} */ (document.getElementById(id));
        if (dialog && dialog.showModal) {
          dialog._cuTrigger = trigger;
          dialog.showModal();
          focusInitial(dialog);
        }
      });
    });

  document
    .querySelectorAll("[" + config.dialogAttr + "]")
    .forEach(function (/** @type {HTMLDialogElement} */ dialog) {
      if (dialog._cuInit) return;
      dialog._cuInit = true;

      // ARIA: override role (e.g. alertdialog)
      if (config.role) dialog.setAttribute("role", config.role);
      // ARIA: link dialog to its title element
      if (config.titleClass) {
        var title = dialog.querySelector("." + config.titleClass);
        if (title) {
          if (!title.id) title.id = genId(config.titleClass);
          dialog.setAttribute("aria-labelledby", title.id);
        }
      }
      // ARIA: link dialog to its description element
      if (config.descClass) {
        var desc = dialog.querySelector("." + config.descClass);
        if (desc) {
          if (!desc.id) desc.id = genId(config.descClass);
          dialog.setAttribute("aria-describedby", desc.id);
        }
      }

      config.closeAttrs.forEach(function (attr) {
        dialog.querySelectorAll("[" + attr + "]").forEach(function (btn) {
          btn.addEventListener("click", function () {
            dialog.close();
          });
        });
      });
      if (config.closeOnBackdrop) {
        dialog.addEventListener("click", function (e) {
          // Clicks on the dialog's own padding also target <dialog>, so only
          // treat it as a backdrop click when the pointer lands outside the
          // dialog box. Keyboard / synthetic clicks (detail 0) report 0,0 coords.
          if (e.target !== dialog || e.detail === 0) return;
          var rect = dialog.getBoundingClientRect();
          if (
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom
          ) {
            dialog.close();
          }
        });
      }

      // Restore focus to trigger element on close
      dialog.addEventListener("close", function () {
        var trigger = dialog._cuTrigger;
        if (trigger && typeof trigger.focus === "function") {
          trigger.focus();
          dialog._cuTrigger = null;
        }
      });
    });
}
