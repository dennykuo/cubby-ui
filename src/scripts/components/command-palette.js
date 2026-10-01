import { registry } from "../core/registry.js";

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

        clearActive();
        var firstVisible = list ? list.querySelector("[data-cu-command-item]:not([hidden])") : null;
        if (firstVisible) firstVisible.setAttribute("data-cu-command-active", "");
      });
    }

    function clearActive() {
      items.forEach(function (item) { item.removeAttribute("data-cu-command-active"); });
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
        clearActive();
        var nextIndex;
        if (isNext) { nextIndex = activeIndex < visible.length - 1 ? activeIndex + 1 : 0; }
        else { nextIndex = activeIndex > 0 ? activeIndex - 1 : visible.length - 1; }
        visible[nextIndex].setAttribute("data-cu-command-active", "");
        visible[nextIndex].scrollIntoView({ block: "nearest" });
      }
      if (e.key === "Enter") {
        var active = list ? /** @type {HTMLElement} */ (list.querySelector("[data-cu-command-item][data-cu-command-active]")) : null;
        if (active) { e.preventDefault(); active.click(); }
      }
    });

    items.forEach(function (item) {
      item.addEventListener("mouseenter", function () { clearActive(); item.setAttribute("data-cu-command-active", ""); });
      item.addEventListener("mouseleave", function () { item.removeAttribute("data-cu-command-active"); });
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
