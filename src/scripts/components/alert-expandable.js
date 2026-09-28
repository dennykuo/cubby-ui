import { registry } from "../core/registry.js";

// Alert Expandable
/**
 * Alert Expandable — toggle extra content in an alert.
 *
 * HTML structure:
 *   <div class="cu-alert cu-alert-info" data-cu-alert-expandable>
 *     <div>
 *       <h5 class="cu-alert-title">Title</h5>
 *       <p class="cu-alert-description">Summary</p>
 *       <button class="cu-alert-expand-trigger" data-cu-alert-expand-trigger aria-expanded="false">
 *         Show more <svg>...</svg>
 *       </button>
 *     </div>
 *     <div class="cu-alert-expandable-content" data-cu-alert-expandable-content>
 *       <div>Expanded details...</div>
 *     </div>
 *   </div>
 */
export function setupAlertExpandables() {
  document.querySelectorAll("[data-cu-alert-expandable]").forEach(function (el) {
    if (el._cuInit) return;
    el._cuInit = true;

    var trigger = el.querySelector("[data-cu-alert-expand-trigger]");
    var content = el.querySelector("[data-cu-alert-expandable-content]");
    if (!trigger || !content) return;

    trigger.addEventListener("click", function () {
      var expanded = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!expanded));
      if (expanded) {
        content.removeAttribute("data-cu-expanded");
      } else {
        content.setAttribute("data-cu-expanded", "");
      }
    });

    registry.alertExpandables.push({ el: el });
  });
}
