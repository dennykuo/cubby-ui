import { registry } from "../core/registry.js";
import { genId } from "../core/utils.js";

/**
 * Popover — click-triggered floating content panel.
 *
 * HTML structure:
 * ```html
 * <div data-cu-popover>
 *   <button data-cu-popover-trigger>Info</button>
 *   <div class="cu-popover-content" data-cu-popover-content hidden>
 *     Content here
 *   </div>
 * </div>
 * ```
 * - Add `hidden` to content initially.
 * - Sizes: default | cu-popover-content-sm (w-56) | cu-popover-content-lg (w-96)
 * - Closes on outside click or Escape key.
 * - ARIA: aria-haspopup="dialog" + aria-expanded + aria-controls auto-set.
 */
export function setupPopovers() {
  document.querySelectorAll("[data-cu-popover]").forEach(function (popover) {
    if (popover._cuInit) return;
    popover._cuInit = true;

    var trigger = popover.querySelector("[data-cu-popover-trigger]");
    var content = popover.querySelector("[data-cu-popover-content]");
    if (!trigger || !content) return;

    // ARIA setup
    if (!content.id) content.id = genId("cu-popover");
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-controls", content.id);

    content.setAttribute("hidden", "");
    trigger.addEventListener("click", function () {
      content.toggleAttribute("hidden");
      trigger.setAttribute("aria-expanded", String(!content.hasAttribute("hidden")));
    });
    registry.popovers.push({ el: popover, trigger: trigger, content: content });
  });
}
