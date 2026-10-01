import { registry } from "../core/registry.js";
import { genId } from "../core/utils.js";

/**
 * Tabs — show/hide content panels based on trigger clicks.
 *
 * HTML structure:
 * ```html
 * <div data-cu-tabs>
 *   <div class="cu-tabs-list">
 *     <button class="cu-tabs-trigger cu-tabs-trigger-active" data-cu-tabs-trigger="tab1">Tab 1</button>
 *     <button class="cu-tabs-trigger" data-cu-tabs-trigger="tab2">Tab 2</button>
 *   </div>
 *   <div class="cu-tabs-content" data-cu-tabs-content="tab1">Panel 1</div>
 *   <div class="cu-tabs-content" data-cu-tabs-content="tab2" hidden>Panel 2</div>
 * </div>
 * ```
 * - Active tab: add `cu-tabs-trigger-active` to trigger; do NOT add `hidden` to its panel.
 * - All other panels: add `hidden` attribute.
 * - Pills variant: add `cu-tabs-list-pills` to the list element.
 */
export function setupTabs() {
  document.querySelectorAll("[data-cu-tabs]").forEach(function (tabs) {
    if (tabs._cuInit) return;
    tabs._cuInit = true;

    var triggers = tabs.querySelectorAll("[data-cu-tabs-trigger]");
    var contents = /** @type {NodeListOf<HTMLElement>} */ (tabs.querySelectorAll("[data-cu-tabs-content]"));

    // ARIA: set tablist role on list container
    var tabList = tabs.querySelector(".cu-tabs-list");
    if (tabList && !tabList.getAttribute("role")) tabList.setAttribute("role", "tablist");

    triggers.forEach(function (trigger) {
      var value = trigger.getAttribute("data-cu-tabs-trigger");
      if (!trigger.id) trigger.id = genId("cu-tab");
      if (!trigger.getAttribute("role")) trigger.setAttribute("role", "tab");
      trigger.setAttribute("aria-selected", trigger.classList.contains("cu-tabs-trigger-active") ? "true" : "false");

      // Link trigger ↔ panel
      contents.forEach(function (c) {
        if (c.getAttribute("data-cu-tabs-content") === value) {
          if (!c.id) c.id = genId("cu-tabpanel");
          if (!c.getAttribute("role")) c.setAttribute("role", "tabpanel");
          trigger.setAttribute("aria-controls", c.id);
          c.setAttribute("aria-labelledby", trigger.id);
        }
      });

      trigger.addEventListener("click", function (e) {
        // Ignore clicks on the close button
        if (/** @type {Element} */ (e.target).closest("[data-cu-tabs-close]")) return;
        triggers.forEach(function (t) {
          t.classList.remove("cu-tabs-trigger-active");
          t.setAttribute("aria-selected", "false");
        });
        trigger.classList.add("cu-tabs-trigger-active");
        trigger.setAttribute("aria-selected", "true");
        contents.forEach(function (c) {
          c.hidden = c.getAttribute("data-cu-tabs-content") !== value;
        });
      });
    });

    // Closable tabs: handle close button clicks
    tabs.querySelectorAll("[data-cu-tabs-close]").forEach(function (closeBtn) {
      closeBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        var trigger = closeBtn.closest("[data-cu-tabs-trigger]");
        if (!trigger) return;
        var value = trigger.getAttribute("data-cu-tabs-trigger");
        var wasActive = trigger.classList.contains("cu-tabs-trigger-active");

        // Remove trigger and corresponding content
        trigger.remove();
        contents.forEach(function (c) {
          if (c.getAttribute("data-cu-tabs-content") === value) c.remove();
        });

        // If closed tab was active, activate first remaining trigger
        if (wasActive) {
          var remaining = /** @type {NodeListOf<HTMLElement>} */ (tabs.querySelectorAll("[data-cu-tabs-trigger]"));
          if (remaining.length > 0) remaining[0].click();
        }

        tabs.dispatchEvent(new CustomEvent("cu:tabs:close", { detail: { value: value } }));
      });
    });

    registry.tabs.push({ el: tabs });
  });

  // Scrollable tabs
  document.querySelectorAll("[data-cu-tabs-scrollable]").forEach(function (wrapper) {
    if (wrapper._cuInit) return;
    wrapper._cuInit = true;

    var list = wrapper.querySelector(".cu-tabs-list");
    var btnStart = /** @type {HTMLElement} */ (wrapper.querySelector("[data-cu-tabs-scroll-start]"));
    var btnEnd = /** @type {HTMLElement} */ (wrapper.querySelector("[data-cu-tabs-scroll-end]"));
    if (!list) return;

    function updateArrows() {
      if (btnStart) btnStart.hidden = list.scrollLeft <= 0;
      if (btnEnd) btnEnd.hidden = list.scrollLeft + list.clientWidth >= list.scrollWidth - 1;
    }

    if (btnStart) btnStart.addEventListener("click", function () {
      list.scrollBy({ left: -200, behavior: "smooth" });
    });
    if (btnEnd) btnEnd.addEventListener("click", function () {
      list.scrollBy({ left: 200, behavior: "smooth" });
    });

    list.addEventListener("scroll", updateArrows);
    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(updateArrows).observe(list);
    }
    updateArrows();
  });
}
