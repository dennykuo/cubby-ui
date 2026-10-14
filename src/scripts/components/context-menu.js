import { track, restore, registry } from "../core/registry.js";
import { navigateItems, trackActiveDescendant } from "../core/utils.js";

var ITEM_SELECTOR = ".cu-dropdown-item";
var HIGHLIGHT = "cu-dropdown-item-highlight";

/**
 * 關閉右鍵選單（外部點擊、項目點擊、Escape、Tab、捲動）。焦點在選單內時還給開啟前的元素，
 * 該元素已移除或不可聚焦（例如滑鼠右鍵時焦點在 body）時改回容器。
 * @param {{ el: HTMLElement, content: HTMLElement, returnFocus?: HTMLElement | null }} cm registry.contextMenus 的登記資料
 */
export function closeContextMenu(cm) {
  var content = cm.content;
  if (!content || content.hasAttribute("hidden")) return;
  var hadFocus = content.contains(document.activeElement);
  content.setAttribute("hidden", "");
  content.querySelectorAll("." + HIGHLIGHT).forEach(function (item) {
    item.classList.remove(HIGHLIGHT);
  });
  if (!hadFocus) return;
  var target = cm.returnFocus;
  if (!target || !target.isConnected || target === document.body || content.contains(target)) target = cm.el;
  target.focus({ preventScroll: true });
}

// ── Context Menu ──────────────────────────────────────────────
/**
 * Context Menu — custom menu opened by right-click or from the keyboard.
 *
 * HTML structure:
 * ```html
 * <div class="cu-context-menu" data-cu-context-menu aria-label="File actions">
 *   <div>Right-click here</div>
 *   <div class="cu-context-menu-content" data-cu-context-menu-content hidden>
 *     <button class="cu-dropdown-item">Cut</button>
 *     <div class="cu-dropdown-separator"></div>
 *     <button class="cu-dropdown-item">Delete</button>
 *   </div>
 * </div>
 * ```
 * - The container becomes focusable (`tabindex="0"`) unless it already has a `tabindex` (use `-1` to opt out when
 *   focusable children should receive the shortcut instead). Shift+F10 or the ContextMenu key on the container (or
 *   anything focused inside it) opens the menu at the focused element and highlights the first item.
 * - Menu: `role="menu"` (focused, `aria-activedescendant` → highlighted item), `cu-dropdown-item` → `role="menuitem"`,
 *   `cu-dropdown-separator` → `role="separator"`. Arrow Up / Down (wrap), Home / End move the highlight
 *   (`cu-dropdown-item-highlight`), Enter / Space click it, Escape / Tab close. Focus returns to where it was.
 * - Closes on outside click, item click, Escape, scroll or right-click outside.
 */
export function setupContextMenus() {
  document.querySelectorAll("[data-cu-context-menu]").forEach(function (/** @type {HTMLElement} */ container) {
    if (container._cuInit) {
      restore("contextMenus", container);
      return;
    }
    container._cuInit = true;

    var content = /** @type {HTMLElement} */ (container.querySelector("[data-cu-context-menu-content]"));
    if (!content) return;

    /** @type {{ el: HTMLElement, content: HTMLElement, returnFocus: HTMLElement | null }} */
    var entry = { el: container, content: content, returnFocus: null };

    // 只有可聚焦的容器能接收 Shift+F10 / ContextMenu 鍵；原生可聚焦元素的 tabIndex 為 0
    if (!container.hasAttribute("tabindex") && container.tabIndex < 0) container.tabIndex = 0;
    content.setAttribute("role", "menu");
    content.tabIndex = -1;

    // 項目即時查詢並補上 ARIA（選單內容可能在初始化後才變動）
    function getItems() {
      content.querySelectorAll(".cu-dropdown-separator").forEach(function (sep) {
        sep.setAttribute("role", "separator");
      });
      var items = content.querySelectorAll(ITEM_SELECTOR);
      items.forEach(function (item) {
        if (!item.hasAttribute("role")) item.setAttribute("role", "menuitem");
      });
      return items;
    }
    getItems();
    trackActiveDescendant(content, content, HIGHLIGHT, "cu-context-menu-item");

    function setHighlight(item) {
      getItems().forEach(function (i) {
        i.classList.toggle(HIGHLIGHT, i === item);
      });
    }

    function open(x, y, viaKeyboard) {
      registry.contextMenus.forEach(function (cm) {
        if (cm.el !== container) closeContextMenu(cm);
      });
      // 已開啟時再次右鍵只重新定位，保留最初的返回焦點
      if (!content.contains(document.activeElement))
        entry.returnFocus = /** @type {HTMLElement} */ (document.activeElement);
      content.removeAttribute("hidden");
      var rect = content.getBoundingClientRect();
      var vw = window.innerWidth;
      var vh = window.innerHeight;
      if (x + rect.width > vw) x = vw - rect.width - 4;
      if (y + rect.height > vh) y = vh - rect.height - 4;
      if (x < 0) x = 4;
      if (y < 0) y = 4;
      content.style.left = x + "px";
      content.style.top = y + "px";
      // 焦點移到選單，方向鍵 / Enter 才能操作（滑鼠開啟時不預先高亮，與原生選單相同）
      content.focus({ preventScroll: true });
      var items = getItems();
      setHighlight(null);
      if (viaKeyboard) navigateItems(items, "Home", HIGHLIGHT);
    }

    // 鍵盤開啟後瀏覽器可能再派發原生 contextmenu 事件（例如 ContextMenu 鍵的 keyup），忽略這一次
    var suppressNative = false;

    container.addEventListener("contextmenu", function (e) {
      e.preventDefault();
      if (suppressNative) return;
      open(e.clientX, e.clientY, false);
    });

    container.addEventListener("keydown", function (e) {
      if (content.contains(/** @type {Node} */ (e.target))) return;
      if (e.key !== "ContextMenu" && !(e.key === "F10" && e.shiftKey)) return;
      e.preventDefault();
      suppressNative = true;
      // 開在聚焦元素的中心（與瀏覽器以鍵盤開啟原生右鍵選單的位置相同）
      var anchor = /** @type {Element} */ (e.target).getBoundingClientRect();
      open(anchor.left + anchor.width / 2, anchor.top + anchor.height / 2, true);
    });
    container.addEventListener("keyup", function (e) {
      if (e.key === "ContextMenu" || e.key === "F10")
        setTimeout(function () {
          suppressNative = false;
        }, 0);
    });

    content.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Home" || e.key === "End") {
        e.preventDefault(); // 也避免捲動頁面（捲動會關閉選單）
        navigateItems(getItems(), e.key, HIGHLIGHT);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        var active = /** @type {HTMLElement} */ (content.querySelector("." + HIGHLIGHT));
        if (active) active.click(); // click 冒泡到 document 時由 delegated handler 關閉選單並歸還焦點
      } else if (e.key === "Tab") {
        e.preventDefault();
        closeContextMenu(entry);
      }
    });

    // 滑鼠移入時高亮跟隨，避免鍵盤高亮與 hover 同時出現在不同項目
    content.addEventListener("mouseover", function (e) {
      var item = /** @type {Element} */ (e.target).closest(ITEM_SELECTOR);
      if (item && content.contains(item) && !item.classList.contains(HIGHLIGHT)) setHighlight(item);
    });

    // 全域關閉(click/contextmenu/keydown/scroll)由 setupDocumentListeners 的
    // delegated handler 統一處理(遍歷 registry.contextMenus),避免每實例累積 document listener
    track("contextMenus", entry);
  });
}
