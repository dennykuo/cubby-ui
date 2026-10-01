import { registry } from "../core/registry.js";

// Input Clearable
/**
 * Input Clearable — shows a clear button when input has value.
 *
 * HTML structure:
 *   <div class="cu-input-icon-wrapper" data-cu-input-clearable>
 *     <input class="cu-input cu-input-clearable" placeholder="Search..." />
 *     <button type="button" class="cu-input-clear" data-cu-input-clear aria-label="Clear">
 *       <svg>...</svg>
 *     </button>
 *   </div>
 */
export function setupInputClearables() {
  document.querySelectorAll("[data-cu-input-clearable]").forEach(function (el) {
    if (el._cuInit) return;
    el._cuInit = true;

    var input = /** @type {HTMLInputElement} */ (el.querySelector(".cu-input-clearable, input"));
    var btn = /** @type {HTMLElement} */ (el.querySelector("[data-cu-input-clear]"));
    if (!input || !btn) return;

    function toggle() {
      if (input.value.length > 0) {
        btn.style.opacity = "0.7";
        btn.style.pointerEvents = "auto";
      } else {
        btn.style.opacity = "0";
        btn.style.pointerEvents = "none";
      }
    }

    input.addEventListener("input", toggle);
    btn.addEventListener("click", function () {
      input.value = "";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.focus();
    });

    toggle();
    registry.inputClearables.push({ el: el });
  });
}
