import { registry } from "../core/registry.js";
import { genId } from "../core/utils.js";

// ── Command Palette ───────────────────────────────────────────
/**
 * Command Palette — keyboard-driven command search in a native <dialog>.
 *
 * HTML structure:
 * ```html
 * <button data-cu-command-trigger="cmd">Open</button>
 * <dialog id="cmd" class="cu-command" data-cu-command>
 *   <div class="cu-command-input-wrapper">
 *     <input class="cu-command-input" data-cu-command-input placeholder="Search...">
 *   </div>
 *   <div class="cu-command-list" data-cu-command-list>
 *     <div class="cu-command-group" data-cu-command-group>
 *       <div class="cu-command-group-heading">Files</div>
 *       <button class="cu-command-item" data-cu-command-item data-cu-command-value="new file">New File</button>
 *     </div>
 *     <div class="cu-command-separator" data-cu-command-separator></div>
 *     <div class="cu-command-empty" data-cu-command-empty hidden>No results.</div>
 *   </div>
 * </dialog>
 * ```
 * - Opens with the trigger or Ctrl/Cmd+K (first palette on the page); Arrow / Tab keys move, Enter clicks the item.
 * - Items are queried on demand: items added to / removed from the list later (e.g. remote results) are filtered,
 *   navigable and get their ARIA immediately (MutationObserver); `CubbyUI.refresh()` re-syncs them as well.
 */
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
    // 已初始化：重新同步動態加入的項目（CubbyUI.refresh() / init() 會走到這裡）
    if (palette._cuInit) { if (palette._cuCommandSync) palette._cuCommandSync(); return; }
    palette._cuInit = true;

    var input = /** @type {HTMLInputElement} */ (palette.querySelector("[data-cu-command-input]"));
    var list = /** @type {HTMLElement} */ (palette.querySelector("[data-cu-command-list]"));
    var empty = /** @type {HTMLElement} */ (palette.querySelector("[data-cu-command-empty]"));
    /** @type {HTMLElement | null} */
    var activeItem = null;

    // 項目每次即時查詢（不在初始化時收集一次）：之後新增 / 移除的項目同樣能篩選、鍵盤導航與滑鼠選中
    function getItems() {
      return list ? /** @type {HTMLElement[]} */ (Array.from(list.querySelectorAll("[data-cu-command-item]"))) : [];
    }

    // APG combobox + listbox：焦點留在輸入框，以 aria-activedescendant 指向選中（data-cu-command-active）項目；
    // 清單在 dialog 開啟期間一直顯示，所以 aria-expanded 固定為 true。
    // 項目可以是 <a href>（文檔站搜尋）：role="option" 只改語意，Enter 仍對選中項目 click() 導航
    if (list) {
      if (!list.id) list.id = genId("cu-command-list");
      list.setAttribute("role", "listbox");
    }
    if (input) {
      input.setAttribute("role", "combobox");
      input.setAttribute("aria-autocomplete", "list");
      input.setAttribute("aria-expanded", "true");
      if (list) input.setAttribute("aria-controls", list.id);
    }

    // 分組與項目的 ARIA；初始化、清單內容變動與 refresh() 時套用到新加入的元素
    function syncAria() {
      if (!list) return;
      list.querySelectorAll("[data-cu-command-group]").forEach(function (group) {
        group.setAttribute("role", "group");
        var heading = group.querySelector(".cu-command-group-heading");
        if (heading && !group.hasAttribute("aria-label") && !group.hasAttribute("aria-labelledby")) {
          if (!heading.id) heading.id = genId("cu-command-group-heading");
          group.setAttribute("aria-labelledby", heading.id);
        }
      });
      getItems().forEach(function (item) {
        if (!item.id) item.id = genId("cu-command-item");
        item.setAttribute("role", "option");
        item.setAttribute("aria-selected", item.hasAttribute("data-cu-command-active") ? "true" : "false");
        if (item.hasAttribute("data-cu-command-active")) activeItem = item;
      });
    }
    syncAria();

    palette.addEventListener("click", function (e) { if (e.target === palette) palette.close(); });

    // 依目前查詢篩選項目、隱藏空分組與相鄰的分隔線、切換無結果提示。
    // 查詢改變時（resetActive）選中第一個可見項目；清單內容變動時保留仍可見的選中項目
    function applyFilter(resetActive) {
      var query = input ? input.value.toLowerCase().trim() : "";
      var visible = [];

      getItems().forEach(function (item) {
        var text = (item.getAttribute("data-cu-command-value") || item.textContent || "").toLowerCase();
        var match = !query || text.indexOf(query) !== -1;
        item.hidden = !match;
        if (match) visible.push(item);
      });

      if (list) {
        list.querySelectorAll("[data-cu-command-group]").forEach(function (/** @type {HTMLElement} */ group) {
          group.hidden = group.querySelectorAll("[data-cu-command-item]:not([hidden])").length === 0;
        });
        list.querySelectorAll("[data-cu-command-separator]").forEach(function (/** @type {HTMLElement} */ sep) {
          var prev = /** @type {HTMLElement} */ (sep.previousElementSibling);
          var next = /** @type {HTMLElement} */ (sep.nextElementSibling);
          sep.hidden = (prev && prev.hidden) || (next && next.hidden) || false;
        });
      }

      if (empty) empty.hidden = visible.length > 0;

      if (!resetActive && activeItem && !activeItem.hidden && list && list.contains(activeItem)) setActive(activeItem);
      // 查詢改變，或原本的選中項目被移除 / 篩掉：改選第一個可見項目；原本沒有選中項目則維持沒有
      else setActive(resetActive || activeItem ? visible[0] || null : null);
    }

    if (input) {
      input.addEventListener("input", function () { applyFilter(true); });
    }

    // 同一時間只有一個選中項目：同步 data-cu-command-active、aria-selected 與輸入框的 aria-activedescendant
    function setActive(active) {
      activeItem = active;
      getItems().forEach(function (item) {
        item.toggleAttribute("data-cu-command-active", item === active);
        item.setAttribute("aria-selected", item === active ? "true" : "false");
      });
      if (!input) return;
      if (active) input.setAttribute("aria-activedescendant", active.id);
      else input.removeAttribute("aria-activedescendant");
    }

    function getVisibleItems() {
      return getItems().filter(function (item) { return !item.hidden; });
    }

    palette.addEventListener("keydown", function (e) {
      // Tab / Shift+Tab cycle through results just like ArrowDown / ArrowUp
      var isNext = e.key === "ArrowDown" || (e.key === "Tab" && !e.shiftKey);
      var isPrev = e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey);
      if (isNext || isPrev) {
        e.preventDefault();
        var visible = getVisibleItems();
        if (visible.length === 0) return;
        var activeIndex = visible.indexOf(/** @type {HTMLElement} */ (activeItem));
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

    // 滑鼠選中以事件委派處理，動態加入的項目不需個別綁定
    if (list) {
      list.addEventListener("mouseover", function (e) {
        var item = /** @type {HTMLElement} */ (/** @type {Element} */ (e.target).closest("[data-cu-command-item]"));
        if (item && item !== activeItem && list.contains(item)) setActive(item);
      });
      list.addEventListener("mouseout", function (e) {
        var item = /** @type {Element} */ (e.target).closest("[data-cu-command-item]");
        var to = /** @type {Node | null} */ (e.relatedTarget);
        if (item && item === activeItem && !(to && item.contains(to))) setActive(null);
      });
    }

    function sync() {
      syncAria();
      applyFilter(false);
    }
    palette._cuCommandSync = sync;
    // 清單內容變動（新增 / 移除項目、分組）時立即同步；只觀察 childList，篩選與選中只改屬性，不會自我觸發
    if (list) new MutationObserver(sync).observe(list, { childList: true, subtree: true });

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
