import { registry } from "../core/registry.js";
import { createDebouncer, readDelay } from "../core/utils.js";

var NAV_KEYS = ["Enter", "ArrowDown", "ArrowUp", "Home", "End"];

/**
 * Combobox — searchable single-select dropdown.
 *
 * HTML structure:
 * ```html
 * <div data-cu-combobox>
 *   <button class="cu-combobox-trigger" data-cu-combobox-trigger>
 *     <span data-cu-combobox-value class="cu-combobox-trigger-placeholder">Select...</span>
 *   </button>
 *   <div class="cu-combobox-content" data-cu-combobox-content hidden>
 *     <input class="cu-combobox-input" data-cu-combobox-input placeholder="Search...">
 *     <ul data-cu-combobox-list>
 *       <li class="cu-combobox-item" data-cu-combobox-item>Option 1</li>
 *       <li class="cu-combobox-item cu-combobox-item-active" data-cu-combobox-item>Selected</li>
 *     </ul>
 *     <div data-cu-combobox-empty hidden>No results</div>
 *   </div>
 * </div>
 * ```
 * - `data-cu-combobox-value`: element that displays the selected value.
 * - `cu-combobox-trigger-placeholder`: class for placeholder styling (removed on selection).
 * - `cu-combobox-item-active`: marks the currently selected item.
 * - `data-cu-combobox-list`: optional wrapper for listbox ARIA role.
 * - `data-cu-combobox-debounce="300"`: optional, on the root. Delays filtering by N ms after typing
 *   (default: filter immediately). Clearing the query, arrow keys and Enter apply pending filtering at once.
 * - Fires `cu:combobox:search` ({ query }) whenever the applied query changes — hook remote search here.
 */
export function setupComboboxes() {
  document.querySelectorAll("[data-cu-combobox]").forEach(function (combobox) {
    if (combobox._cuInit) return;
    combobox._cuInit = true;

    var trigger = combobox.querySelector("[data-cu-combobox-trigger]");
    var content = combobox.querySelector("[data-cu-combobox-content]");
    var input = combobox.querySelector("[data-cu-combobox-input]");
    var empty = combobox.querySelector("[data-cu-combobox-empty]");
    var valueEl = combobox.querySelector("[data-cu-combobox-value]");

    // Dynamic items query — always returns fresh NodeList
    function getItems() {
      return combobox.querySelectorAll("[data-cu-combobox-item]");
    }

    // ARIA setup
    function syncItemsAria() {
      getItems().forEach(function (item) {
        item.setAttribute("role", "option");
        if (!item.hasAttribute("aria-selected")) {
          item.setAttribute("aria-selected", item.classList.contains("cu-combobox-item-active") ? "true" : "false");
        }
      });
    }
    if (trigger) {
      trigger.setAttribute("aria-haspopup", "listbox");
      trigger.setAttribute("aria-expanded", "false");
      // 未指定 type 的 <button> 在 <form> 內預設為 submit，開啟面板會送出表單
      if (trigger.tagName === "BUTTON" && !trigger.hasAttribute("type")) trigger.type = "button";
    }
    if (content) {
      var list = content.querySelector("[data-cu-combobox-list]") || content;
      list.setAttribute("role", "listbox");
    }
    syncItemsAria();

    function syncEmpty() {
      var visible = 0;
      getItems().forEach(function (item) {
        if (!item.hasAttribute("hidden")) visible++;
      });
      if (empty) empty.toggleAttribute("hidden", visible > 0);
    }

    trigger &&
      trigger.addEventListener("click", function () {
        // 不阻止冒泡：讓 document 級 handler 關閉其他已開啟的浮層（自身因 contains 判斷不受影響）
        var isHidden = content && content.hasAttribute("hidden");
        content && content.toggleAttribute("hidden");
        trigger.setAttribute("aria-expanded", String(isHidden));
        if (isHidden) {
          syncItemsAria();
          if (input) input.focus();
          syncEmpty();
        }
      });

    var lastQuery = "";
    function filterItems() {
      if (!combobox.isConnected) return;
      var query = input.value.toLowerCase();
      getItems().forEach(function (item) {
        var match = (item.textContent || "").toLowerCase().includes(query);
        item.toggleAttribute("hidden", !match);
        // 被過濾掉的項目不可保留鍵盤高亮，否則 Enter 會選到看不見的項目
        if (!match) item.classList.remove("cu-combobox-item-highlight");
      });
      syncEmpty();
      if (input.value !== lastQuery) {
        lastQuery = input.value;
        combobox.dispatchEvent(new CustomEvent("cu:combobox:search", {
          bubbles: true,
          detail: { query: input.value }
        }));
      }
    }
    var search = createDebouncer(filterItems);

    if (input) {
      input.addEventListener("input", function () {
        // 清空查詢（含關閉 / 選取後的重設）一律立即執行，避免重新開啟時看到過期結果
        search.run(input.value === "" ? 0 : readDelay(combobox, "data-cu-combobox-debounce"));
      });
      // 鍵盤導航 / Enter 前先套用待執行的過濾（document keydown handler 在冒泡階段才處理）
      input.addEventListener("keydown", function (e) {
        if (NAV_KEYS.indexOf(e.key) !== -1) search.flush();
      });
    }

    content &&
      content.addEventListener("click", function (e) {
        var item = e.target.closest("[data-cu-combobox-item]");
        if (!item) return;
        if (valueEl) {
          valueEl.textContent = item.textContent;
          valueEl.classList.remove("cu-combobox-trigger-placeholder");
        }
        getItems().forEach(function (i) {
          i.classList.remove("cu-combobox-item-active");
          i.setAttribute("aria-selected", "false");
        });
        item.classList.add("cu-combobox-item-active");
        item.setAttribute("aria-selected", "true");
        content.setAttribute("hidden", "");
        if (trigger) {
          trigger.setAttribute("aria-expanded", "false");
          trigger.focus(); // 焦點原本在已隱藏的搜尋框 / 選項內，移回 trigger 避免遺失
        }
        if (input) {
          input.value = "";
          input.dispatchEvent(new Event("input"));
        }
        combobox.dispatchEvent(new CustomEvent("cu:combobox:change", {
          bubbles: true,
          detail: { value: item.dataset.cuValue || item.textContent, item: item }
        }));
      });

    registry.comboboxes.push({ el: combobox, trigger: trigger, content: content, input: input, getItems: getItems, cancelSearch: search.cancel });
  });
}
