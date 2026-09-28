import { registry } from "../core/registry.js";

/**
 * Dropdown Menu — click-triggered floating menu panel.
 *
 * HTML structure:
 * ```html
 * <div data-cu-dropdown>
 *   <button data-cu-dropdown-trigger>Options</button>
 *   <div class="cu-dropdown-content" data-cu-dropdown-content hidden>
 *     <div class="cu-dropdown-label">Label</div>
 *     <button class="cu-dropdown-item">Item</button>
 *     <div class="cu-dropdown-separator"></div>
 *     <button class="cu-dropdown-item">Item 2</button>
 *   </div>
 * </div>
 * ```
 * - Add `hidden` to content element initially.
 * - Closes on outside click or Escape key.
 * - Arrow / Home / End keys navigate items; Enter activates highlighted item.
 */
export function setupDropdowns() {
  document.querySelectorAll("[data-cu-dropdown]").forEach(function (dropdown) {
    if (dropdown._cuInit) return;
    dropdown._cuInit = true;

    var trigger = dropdown.querySelector("[data-cu-dropdown-trigger]");
    var content = dropdown.querySelector("[data-cu-dropdown-content]");

    // ARIA setup
    if (trigger) {
      trigger.setAttribute("aria-haspopup", "menu");
      trigger.setAttribute("aria-expanded", "false");
    }
    if (content) {
      content.setAttribute("role", "menu");
      content.querySelectorAll(".cu-dropdown-item").forEach(function (item) {
        item.setAttribute("role", "menuitem");
      });
    }

    trigger &&
      trigger.addEventListener("click", function (e) {
        e.stopPropagation();
        if (content) {
          content.toggleAttribute("hidden");
          trigger.setAttribute("aria-expanded", String(!content.hasAttribute("hidden")));
        }
      });
    registry.dropdowns.push({ el: dropdown, trigger: trigger, content: content });
  });
}
