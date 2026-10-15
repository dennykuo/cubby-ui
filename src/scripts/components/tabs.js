import { track, restore } from "../core/registry.js";
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
 * - Closable: put `<span class="cu-tabs-trigger-close" data-cu-tabs-close aria-hidden="true">×</span>` inside the trigger.
 *   A tab's content is presentational to assistive tech, so the close icon is a mouse-only target (JS forces
 *   aria-hidden and drops role / tabindex from older markup); from the keyboard, Delete (or Backspace) closes the
 *   focused closable tab (APG Tabs), announced via `aria-keyshortcuts="Delete"`. Closing moves focus — and, if the
 *   closed tab was active, selection — to the following tab (the previous one when it was last).
 *   Fires `cu:tabs:close` ({ value }).
 * - Keyboard (APG Tabs, automatic activation): only the selected tab is in the Tab order (roving tabindex);
 *   Arrow keys move focus and select the next / previous tab (wrapping; Left / Right are swapped in RTL),
 *   Home / End jump to the first / last tab. Disabled tabs (`disabled` / `aria-disabled="true"`) are skipped.
 *   A list laid out as a column (e.g. `cu-tabs-list-vertical`, also when it switches at a breakpoint) uses
 *   Up / Down instead, and `aria-orientation` follows the current layout.
 */
export function setupTabs() {
  document.querySelectorAll("[data-cu-tabs]").forEach(function (tabs) {
    if (tabs._cuInit) {
      restore("tabs", tabs);
      return;
    }
    tabs._cuInit = true;

    var triggers = /** @type {NodeListOf<HTMLElement>} */ (tabs.querySelectorAll("[data-cu-tabs-trigger]"));
    var contents = /** @type {NodeListOf<HTMLElement>} */ (tabs.querySelectorAll("[data-cu-tabs-content]"));

    // ARIA: set tablist role on list container
    var tabList = /** @type {HTMLElement} */ (tabs.querySelector(".cu-tabs-list"));
    if (tabList && !tabList.getAttribute("role")) tabList.setAttribute("role", "tablist");

    // 只取屬於這個 tabs 的 trigger（排除巢狀 tabs），即時查詢以涵蓋已關閉的 tab
    function ownTriggers() {
      return /** @type {HTMLElement[]} */ (Array.from(tabs.querySelectorAll("[data-cu-tabs-trigger]"))).filter(
        function (t) {
          return t.closest("[data-cu-tabs]") === tabs;
        },
      );
    }

    function isDisabled(t) {
      return /** @type {HTMLButtonElement} */ (t).disabled || t.getAttribute("aria-disabled") === "true";
    }

    // roving tabindex：只有選取中的 tab（沒有時為第一個可用 tab）是 Tab 停駐點
    function syncTabindex() {
      var all = ownTriggers();
      var active = all.filter(function (t) {
        return t.classList.contains("cu-tabs-trigger-active") && !isDisabled(t);
      })[0];
      if (!active) {
        active = all.filter(function (t) {
          return !isDisabled(t);
        })[0];
      }
      all.forEach(function (t) {
        t.setAttribute("tabindex", t === active ? "0" : "-1");
      });
    }

    // 版面方向依清單實際的 flex-direction 判斷（cu-tabs-list-vertical 可能在斷點切換）
    function isVertical() {
      return !!tabList && getComputedStyle(tabList).flexDirection.indexOf("column") === 0;
    }

    function syncOrientation() {
      if (tabList) tabList.setAttribute("aria-orientation", isVertical() ? "vertical" : "horizontal");
    }

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

      // 關閉圖示在 role="tab" 內（子元素對輔助技術為 presentational），不能是可聚焦的按鈕：
      // 改為純滑鼠目標，鍵盤以 Delete / Backspace 關閉
      var closeIcon = trigger.querySelector("[data-cu-tabs-close]");
      if (closeIcon) {
        closeIcon.removeAttribute("role");
        closeIcon.removeAttribute("tabindex");
        closeIcon.setAttribute("aria-hidden", "true");
        trigger.setAttribute("aria-keyshortcuts", "Delete");
        trigger.addEventListener("keydown", function (e) {
          if (e.key !== "Delete" && e.key !== "Backspace") return;
          e.preventDefault();
          closeTab(trigger);
        });
      }

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
        syncTabindex();
      });
    });

    syncTabindex();
    syncOrientation();

    // 方向鍵 / Home / End：移動焦點並選取（APG 自動啟用）
    (tabList || tabs).addEventListener("keydown", function (/** @type {KeyboardEvent} */ e) {
      var current = /** @type {Element} */ (e.target).closest("[data-cu-tabs-trigger]");
      if (!current || current.closest("[data-cu-tabs]") !== tabs) return;
      var vertical = isVertical();
      syncOrientation();
      var rtl = !vertical && !!tabList && getComputedStyle(tabList).direction === "rtl";
      var nextKey = vertical ? "ArrowDown" : rtl ? "ArrowLeft" : "ArrowRight";
      var prevKey = vertical ? "ArrowUp" : rtl ? "ArrowRight" : "ArrowLeft";
      if (e.key !== nextKey && e.key !== prevKey && e.key !== "Home" && e.key !== "End") return;

      var items = ownTriggers().filter(function (t) {
        return !isDisabled(t);
      });
      if (!items.length) return;
      var index = items.indexOf(/** @type {HTMLElement} */ (current));
      var target;
      if (e.key === "Home") target = items[0];
      else if (e.key === "End") target = items[items.length - 1];
      else if (e.key === nextKey) target = items[(index + 1) % items.length];
      else target = items[(index - 1 + items.length) % items.length];

      e.preventDefault();
      target.focus();
      if (!target.classList.contains("cu-tabs-trigger-active")) target.click();
    });

    // 移除 tab 與對應 panel；焦點（原本在被關閉的 tab 上時）與選取（關閉的是啟用中的 tab 時）
    // 移到後一個 tab，沒有則前一個
    function closeTab(trigger) {
      var value = trigger.getAttribute("data-cu-tabs-trigger");
      var wasActive = trigger.classList.contains("cu-tabs-trigger-active");
      var hadFocus = trigger.contains(document.activeElement);
      var current = /** @type {HTMLElement[]} */ (Array.from(tabs.querySelectorAll("[data-cu-tabs-trigger]")));
      var index = current.indexOf(trigger);
      var next = current[index + 1] || current[index - 1] || null;

      trigger.remove();
      contents.forEach(function (c) {
        if (c.getAttribute("data-cu-tabs-content") === value) c.remove();
      });

      if (next && wasActive) next.click();
      if (next && hadFocus) next.focus();
      syncTabindex();

      tabs.dispatchEvent(new CustomEvent("cu:tabs:close", { detail: { value: value } }));
    }

    // Closable tabs: handle close button clicks
    tabs.querySelectorAll("[data-cu-tabs-close]").forEach(function (closeBtn) {
      // 不阻止冒泡：trigger 的 click handler 會忽略來自關閉按鈕的點擊，document 級 handler 仍能關閉其他浮層
      closeBtn.addEventListener("click", function () {
        var trigger = closeBtn.closest("[data-cu-tabs-trigger]");
        if (trigger) closeTab(trigger);
      });
    });

    track("tabs", { el: tabs });
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

    if (btnStart)
      btnStart.addEventListener("click", function () {
        list.scrollBy({ left: -200, behavior: "smooth" });
      });
    if (btnEnd)
      btnEnd.addEventListener("click", function () {
        list.scrollBy({ left: 200, behavior: "smooth" });
      });

    list.addEventListener("scroll", updateArrows);
    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(updateArrows).observe(list);
    }
    updateArrows();
  });
}
