import { registry } from "../core/registry.js";

// Toggle Group
/**
 * Toggle Group — switchable button group (single or multiple selection).
 *
 * HTML structure:
 *   <div data-cu-toggle-group>
 *     <button class="cu-toggle-group-item cu-toggle-group-item-active">A</button>
 *     <button class="cu-toggle-group-item">B</button>
 *   </div>
 *
 * Multiple mode:
 *   <div data-cu-toggle-group data-cu-toggle-group-multiple>
 */
export function setupToggleGroups() {
  document.querySelectorAll("[data-cu-toggle-group]").forEach(function (el) {
    if (el._cuInit) return;
    el._cuInit = true;
    var isMultiple = el.hasAttribute("data-cu-toggle-group-multiple");

    el.addEventListener("click", function (e) {
      var item = /** @type {HTMLButtonElement} */ (/** @type {Element} */ (e.target).closest(".cu-toggle-group-item"));
      if (!item || item.disabled) return;

      if (isMultiple) {
        item.classList.toggle("cu-toggle-group-item-active");
        item.setAttribute("aria-pressed", item.classList.contains("cu-toggle-group-item-active") ? "true" : "false");
      } else {
        el.querySelectorAll(".cu-toggle-group-item").forEach(function (btn) {
          btn.classList.remove("cu-toggle-group-item-active");
          btn.setAttribute("aria-pressed", "false");
        });
        item.classList.add("cu-toggle-group-item-active");
        item.setAttribute("aria-pressed", "true");
      }

      el.dispatchEvent(new CustomEvent("cu:toggle-group:change", {
        detail: {
          value: isMultiple
            ? Array.from(el.querySelectorAll(".cu-toggle-group-item-active")).map(function (b) { return b.textContent.trim(); })
            : item.textContent.trim()
        },
        bubbles: true
      }));
    });

    registry.toggleGroups.push({ el: el });
  });
}
