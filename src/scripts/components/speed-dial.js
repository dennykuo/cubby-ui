import { registry } from "../core/registry.js";

// Speed Dial
/**
 * Speed Dial — floating action button with expandable actions.
 *
 * HTML structure:
 *   <div class="cu-speed-dial cu-speed-dial-bottom-right" data-cu-speed-dial>
 *     <div class="cu-speed-dial-actions" data-cu-speed-dial-actions>
 *       <div class="cu-speed-dial-action">...</div>
 *     </div>
 *     <button class="cu-speed-dial-trigger" data-cu-speed-dial-trigger>+</button>
 *   </div>
 */
export function setupSpeedDials() {
  document.querySelectorAll("[data-cu-speed-dial]").forEach(function (el) {
    if (el._cuInit) return;
    el._cuInit = true;

    var trigger = el.querySelector("[data-cu-speed-dial-trigger]");
    var actions = el.querySelector("[data-cu-speed-dial-actions]");
    if (!trigger || !actions) return;

    trigger.addEventListener("click", function () {
      var isOpen = actions.hasAttribute("data-cu-open");
      if (isOpen) {
        actions.removeAttribute("data-cu-open");
        trigger.setAttribute("aria-expanded", "false");
      } else {
        actions.setAttribute("data-cu-open", "");
        trigger.setAttribute("aria-expanded", "true");
      }
    });

    registry.speedDials.push({ el: el, trigger: trigger, actions: actions });
  });
}
