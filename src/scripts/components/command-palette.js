import { registry } from "../core/registry.js";
import { genId } from "../core/utils.js";

// ── Command Palette ───────────────────────────────────────────
export function setupCommandPalettes() {
  if (!document._cuCommandPaletteGlobal) {
    document._cuCommandPaletteGlobal = true;
    registry.cmdPaletteKeyHandler = function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        var palette = /** @type {HTMLDialogElement} */ (document.querySelector("[data-cu-command]"));
        if (!palette) return;
        e.preventDefault();
        if (palette.open) { palette.close(); } else {
          palette.showModal();
          var input = /** @type {HTMLInputElement} */ (palette.querySelector("[data-cu-command-input]"));
          if (input) input.focus();
        }
      }
    };
    document.addEventListener("keydown", registry.cmdPaletteKeyHandler);
  }

  document.querySelectorAll("[data-cu-command]").forEach(function (/** @type {HTMLDialogElement} */ palette) {
    if (palette._cuInit) return;
    palette._cuInit = true;

    var input = /** @type {HTMLInputElement} */ (palette.querySelector("[data-cu-command-input]"));
    var list = palette.querySelector("[data-cu-command-list]");
    var empty = /** @type {HTMLElement} */ (palette.querySelector("[data-cu-command-empty]"));
    var items = list ? Array.from(/** @type {NodeListOf<HTMLElement>} */ (list.querySelectorAll("[data-cu-command-item]"))) : [];

    // APG combobox + listbox：焦點留在輸入框，以 aria-activedescendant 指向選中（data-cu-command-active）項目；
    // 清單在 dialog 開啟期間一直顯示，所以 aria-expanded 固定為 true。
    // 項目可以是 <a href>（文檔站搜尋）：role="option" 只改語意，Enter 仍對選中項目 click() 導航
    if (list) {
      if (!list.id) list.id = genId("cu-command-list");
      list.setAttribute("role", "listbox");
      list.querySelectorAll("[data-cu-command-group]").forEach(function (group) {
        group.setAttribute("role", "group");
        var heading = group.querySelector(".cu-command-group-heading");
        if (heading && !group.hasAttribute("aria-label") && !group.hasAttribute("aria-labelledby")) {
          if (!heading.id) heading.id = genId("cu-command-group-heading");
          group.setAttribute("aria-labelledby", heading.id);
        }
      });
    }
    items.forEach(function (item) {
      if (!item.id) item.id = genId("cu-command-item");
      item.setAttribute("role", "option");
      item.setAttribute("aria-selected", item.hasAttribute("data-cu-command-active") ? "true" : "false");
    });
    if (input) {
      input.setAttribute("role", "combobox");
      input.setAttribute("aria-autocomplete", "list");
      input.setAttribute("aria-expanded", "true");
      if (list) input.setAttribute("aria-controls", list.id);
    }

    palette.addEventListener("click", function (e) { if (e.target === palette) palette.close(); });

    if (input) {
      input.addEventListener("input", function () {
        var query = input.value.toLowerCase().trim();
        var visibleCount = 0;
        var groups = list ? Array.from(/** @type {NodeListOf<HTMLElement>} */ (list.querySelectorAll("[data-cu-command-group]"))) : [];

        items.forEach(function (item) {
          var text = (item.getAttribute("data-cu-command-value") || item.textContent || "").toLowerCase();
          var match = !query || text.indexOf(query) !== -1;
          item.hidden = !match;
          if (match) visibleCount++;
        });

        groups.forEach(function (group) {
          var visibleItems = group.querySelectorAll("[data-cu-command-item]:not([hidden])");
          group.hidden = visibleItems.length === 0;
        });

        if (list) {
          var separators = list.querySelectorAll("[data-cu-command-separator]");
          separators.forEach(function (/** @type {HTMLElement} */ sep) {
            var prev = /** @type {HTMLElement} */ (sep.previousElementSibling);
            var next = /** @type {HTMLElement} */ (sep.nextElementSibling);
            sep.hidden = (prev && prev.hidden) || (next && next.hidden) || false;
          });
        }

        if (empty) empty.hidden = visibleCount > 0;

        setActive(list ? /** @type {HTMLElement} */ (list.querySelector("[data-cu-command-item]:not([hidden])")) : null);
      });
    }

    // 同一時間只有一個選中項目：同步 data-cu-command-active、aria-selected 與輸入框的 aria-activedescendant
    function setActive(active) {
      items.forEach(function (item) {
        item.toggleAttribute("data-cu-command-active", item === active);
        item.setAttribute("aria-selected", item === active ? "true" : "false");
      });
      if (!input) return;
      if (active) input.setAttribute("aria-activedescendant", active.id);
      else input.removeAttribute("aria-activedescendant");
    }

    function getVisibleItems() {
      return items.filter(function (item) { return !item.hidden; });
    }

    palette.addEventListener("keydown", function (e) {
      // Tab / Shift+Tab cycle through results just like ArrowDown / ArrowUp
      var isNext = e.key === "ArrowDown" || (e.key === "Tab" && !e.shiftKey);
      var isPrev = e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey);
      if (isNext || isPrev) {
        e.preventDefault();
        var visible = getVisibleItems();
        if (visible.length === 0) return;
        var activeIndex = -1;
        visible.forEach(function (item, i) { if (item.hasAttribute("data-cu-command-active")) activeIndex = i; });
        var nextIndex;
        if (isNext) { nextIndex = activeIndex < visible.length - 1 ? activeIndex + 1 : 0; }
        else { nextIndex = activeIndex > 0 ? activeIndex - 1 : visible.length - 1; }
        setActive(visible[nextIndex]);
        visible[nextIndex].scrollIntoView({ block: "nearest" });
      }
      if (e.key === "Enter") {
        var active = list ? /** @type {HTMLElement} */ (list.querySelector("[data-cu-command-item][data-cu-command-active]")) : null;
        if (active) { e.preventDefault(); active.click(); }
      }
    });

    items.forEach(function (item) {
      item.addEventListener("mouseenter", function () { setActive(item); });
      item.addEventListener("mouseleave", function () { if (item.hasAttribute("data-cu-command-active")) setActive(null); });
    });

    palette.addEventListener("close", function () {
      if (input) { input.value = ""; input.dispatchEvent(new Event("input")); }
    });
  });

  document.querySelectorAll("[data-cu-command-trigger]").forEach(function (trigger) {
    if (trigger._cuInit) return;
    trigger._cuInit = true;
    trigger.addEventListener("click", function () {
      var id = trigger.getAttribute("data-cu-command-trigger");
      var palette = /** @type {HTMLDialogElement} */ (document.getElementById(id));
      if (palette && palette.showModal) {
        palette.showModal();
        var input = /** @type {HTMLInputElement} */ (palette.querySelector("[data-cu-command-input]"));
        if (input) input.focus();
      }
    });
  });
}
