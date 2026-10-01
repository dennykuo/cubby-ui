import { registry } from "../core/registry.js";

// Tour / Spotlight
/**
 * Tour — multi-step guided tour with spotlight highlighting.
 *
 * HTML structure (programmatic — no static HTML needed):
 *   CubbyUI managed via data-cu-tour on a container.
 *
 * Usage:
 *   <div data-cu-tour data-cu-tour-steps='[{"target":"#btn","title":"Click here","description":"This is a button."}]'>
 *   </div>
 *
 * Step format: { target: CSS selector, title, description, placement?: top|bottom|left|right }
 */
export function setupTours() {
  document.querySelectorAll("[data-cu-tour]").forEach(function (el) {
    if (el._cuInit) return;
    el._cuInit = true;

    var stepsAttr = el.getAttribute("data-cu-tour-steps");
    if (!stepsAttr) return;
    var steps;
    try { steps = JSON.parse(stepsAttr); } catch (_) { return; }
    if (!steps.length) return;

    var overlay = null;
    var tooltip = null;
    var spotlight = null;
    var currentTarget = null;

    function show(index) {
      var step = steps[index];
      var targetEl = document.querySelector(step.target);
      if (!targetEl) return;

      currentTarget = targetEl;
      targetEl.classList.add("cu-tour-target");

      if (!overlay) {
        overlay = document.createElement("div");
        overlay.className = "cu-tour-overlay";
        overlay.style.background = "transparent";
        document.body.appendChild(overlay);

        spotlight = document.createElement("div");
        spotlight.className = "cu-tour-spotlight";
        overlay.appendChild(spotlight);

        tooltip = document.createElement("div");
        tooltip.className = "cu-tour-tooltip";
        document.body.appendChild(tooltip);
      }

      var rect = targetEl.getBoundingClientRect();
      var pad = 8;
      spotlight.style.top = (rect.top + window.scrollY - pad) + "px";
      spotlight.style.left = (rect.left + window.scrollX - pad) + "px";
      spotlight.style.width = (rect.width + pad * 2) + "px";
      spotlight.style.height = (rect.height + pad * 2) + "px";

      var placement = step.placement || "bottom";
      while (tooltip.firstChild) tooltip.removeChild(tooltip.firstChild);

      var titleEl = document.createElement("div");
      titleEl.className = "cu-tour-tooltip-title";
      titleEl.textContent = step.title || "";
      tooltip.appendChild(titleEl);

      if (step.description) {
        var descEl = document.createElement("div");
        descEl.className = "cu-tour-tooltip-description";
        descEl.textContent = step.description;
        tooltip.appendChild(descEl);
      }

      var footer = document.createElement("div");
      footer.className = "cu-tour-tooltip-footer";

      var progress = document.createElement("div");
      progress.className = "cu-tour-tooltip-progress";
      progress.textContent = (index + 1) + " / " + steps.length;
      footer.appendChild(progress);

      var actions = document.createElement("div");
      actions.className = "cu-tour-tooltip-actions";

      if (index > 0) {
        var prevBtn = document.createElement("button");
        prevBtn.className = "cu-button cu-button-ghost cu-button-sm";
        prevBtn.textContent = "Back";
        prevBtn.addEventListener("click", function () { clearTarget(); show(index - 1); });
        actions.appendChild(prevBtn);
      }

      if (index < steps.length - 1) {
        var nextBtn = document.createElement("button");
        nextBtn.className = "cu-button cu-button-default cu-button-sm";
        nextBtn.textContent = "Next";
        nextBtn.addEventListener("click", function () { clearTarget(); show(index + 1); });
        actions.appendChild(nextBtn);
      } else {
        var doneBtn = document.createElement("button");
        doneBtn.className = "cu-button cu-button-default cu-button-sm";
        doneBtn.textContent = "Done";
        doneBtn.addEventListener("click", function () { close(); });
        actions.appendChild(doneBtn);
      }

      footer.appendChild(actions);
      tooltip.appendChild(footer);

      // Position tooltip
      var tRect = tooltip.getBoundingClientRect();
      if (placement === "bottom") {
        tooltip.style.top = (rect.bottom + window.scrollY + 12) + "px";
        tooltip.style.left = (rect.left + window.scrollX + rect.width / 2 - tRect.width / 2) + "px";
      } else if (placement === "top") {
        tooltip.style.top = (rect.top + window.scrollY - tRect.height - 12) + "px";
        tooltip.style.left = (rect.left + window.scrollX + rect.width / 2 - tRect.width / 2) + "px";
      } else if (placement === "left") {
        tooltip.style.top = (rect.top + window.scrollY + rect.height / 2 - tRect.height / 2) + "px";
        tooltip.style.left = (rect.left + window.scrollX - tRect.width - 12) + "px";
      } else {
        tooltip.style.top = (rect.top + window.scrollY + rect.height / 2 - tRect.height / 2) + "px";
        tooltip.style.left = (rect.right + window.scrollX + 12) + "px";
      }
    }

    function clearTarget() {
      if (currentTarget) {
        currentTarget.classList.remove("cu-tour-target");
        currentTarget = null;
      }
    }

    function close() {
      clearTarget();
      if (overlay && overlay.parentNode) overlay.remove();
      if (tooltip && tooltip.parentNode) tooltip.remove();
      overlay = null; tooltip = null; spotlight = null;
      el.dispatchEvent(new CustomEvent("cu:tour:complete", { bubbles: true }));
    }

    // Auto-start if data-cu-tour-auto is present
    if (el.hasAttribute("data-cu-tour-auto")) {
      show(0);
    }

    // Allow programmatic start via el.dispatchEvent(new Event("cu:tour:start"))
    el.addEventListener("cu:tour:start", function () { show(0); });

    registry.tours.push({ el: el, close: close });
  });
}
