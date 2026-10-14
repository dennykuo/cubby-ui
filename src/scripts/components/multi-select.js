import { track, restore } from "../core/registry.js";
import { createDebouncer, genId, readDelay, setupComboboxAria } from "../core/utils.js";

var NAV_KEYS = ["Enter", "ArrowDown", "ArrowUp", "Home", "End"];

/**
 * Multi Select — searchable multi-selection dropdown with tag display.
 *
 * HTML structure:
 * ```html
 * <div class="cu-multi-select" data-cu-multi-select>
 *   <div class="cu-multi-select-control">
 *     <div class="cu-multi-select-tags" data-cu-multi-select-tags></div>
 *     <button type="button" class="cu-multi-select-trigger" data-cu-multi-select-trigger>
 *       <span class="cu-multi-select-placeholder" data-cu-multi-select-placeholder>Select...</span>
 *       <svg class="cu-multi-select-icon">…</svg>
 *     </button>
 *   </div>
 *   <div class="cu-multi-select-content" data-cu-multi-select-content hidden>
 *     <div class="cu-multi-select-search">
 *       <input class="cu-multi-select-input" data-cu-multi-select-input placeholder="Search...">
 *     </div>
 *     <div class="cu-multi-select-list" data-cu-multi-select-list>
 *       <div class="cu-multi-select-empty" data-cu-multi-select-empty hidden>No results</div>
 *       <div class="cu-multi-select-item" data-cu-multi-select-item data-cu-value="val1">Option 1</div>
 *     </div>
 *   </div>
 * </div>
 * ```
 * - `data-cu-value`: REQUIRED on each item for tag rendering. Value must be unique.
 * - `cu-multi-select-item-active`: pre-selected items at init time.
 * - Tags are auto-rendered in `data-cu-multi-select-tags`, a SIBLING of the trigger inside `cu-multi-select-control`
 *   (which draws the box): each tag's remove control is a real `<button type="button">`, so it must not be nested in
 *   the trigger button. Older markup with the tags container inside the trigger is restructured on init (the control
 *   wrapper is created and the placeholder moved into the trigger). Clicking empty space in the control opens the panel.
 * - Removing a tag from the keyboard moves focus to the next tag's remove button, or the trigger after the last one.
 * - The trigger keeps the placeholder text as its accessible name (via `aria-labelledby`) while tags hide it, unless it
 *   already has `aria-label` / `aria-labelledby` / a `<label for>`.
 * - `data-cu-multi-select-debounce="300"`: optional, on the root. Delays filtering by N ms after typing
 *   (default: filter immediately). Clearing the query, arrow keys and Enter apply pending filtering at once.
 * - Fires `cu:multiselect:search` ({ query }) whenever the applied query changes — hook remote search here.
 * - `data-cu-multi-select-remove-text="Remove {label}"`: optional, on the root. Accessible name template for
 *   the generated tag remove buttons; `{label}` is replaced with the item text (default "Remove {label}").
 * - ARIA: same combobox wiring as Combobox (search input, or the trigger when there is none, owns
 *   aria-activedescendant).
 */
export function setupMultiSelects() {
  document
    .querySelectorAll("[data-cu-multi-select]")
    .forEach(function (ms) {
      if (ms._cuInit) { restore("multiSelects", ms); return; }
      ms._cuInit = true;

      var trigger = /** @type {HTMLElement} */ (ms.querySelector("[data-cu-multi-select-trigger]"));
      var content = ms.querySelector("[data-cu-multi-select-content]");
      var input = /** @type {HTMLInputElement} */ (ms.querySelector("[data-cu-multi-select-input]"));
      var empty = ms.querySelector("[data-cu-multi-select-empty]");
      var tagsEl = ms.querySelector("[data-cu-multi-select-tags]");
      var placeholder = /** @type {HTMLElement} */ (ms.querySelector(
        "[data-cu-multi-select-placeholder]"
      ));
      var selected = new Set();

      // 舊版結構相容：標籤容器在 trigger <button> 內時，產生的移除按鈕會是巢狀互動元素（HTML 不允許，parser
      // 與輔助技術都無法正確處理）。把標籤容器移到 trigger 前方，與 trigger 一起包進 .cu-multi-select-control
      if (trigger && tagsEl && trigger.contains(tagsEl)) {
        var wrapper = trigger.parentElement;
        if (!wrapper.classList.contains("cu-multi-select-control")) {
          wrapper = document.createElement("div");
          wrapper.className = "cu-multi-select-control";
          trigger.parentElement.insertBefore(wrapper, trigger);
          wrapper.appendChild(trigger);
        }
        wrapper.insertBefore(tagsEl, trigger);
      }
      // placeholder 屬於 trigger（標籤容器由 JS 全權管理，渲染時會清空）
      if (trigger && placeholder && !trigger.contains(placeholder)) trigger.insertBefore(placeholder, trigger.firstChild);
      // 外框 = trigger 與標籤容器共同的父元素；若它也包住面板（沒有 control、直接放在根元素下）則不轉送點擊，
      // 否則點選項目也會被當成點擊 trigger 而關閉面板
      var parent = trigger && trigger.parentElement;
      var control = parent && tagsEl && parent.contains(tagsEl) && !(content && parent.contains(content)) ? parent : null;

      // Dynamic items query — always returns fresh NodeList
      function getItems() {
        return ms.querySelectorAll("[data-cu-multi-select-item]");
      }

      // ARIA setup
      function syncItemsAria() {
        getItems().forEach(function (item) {
          item.setAttribute("role", "option");
          if (!item.hasAttribute("aria-selected")) {
            item.setAttribute("aria-selected", item.classList.contains("cu-multi-select-item-active") ? "true" : "false");
          }
        });
      }
      if (trigger) {
        trigger.setAttribute("aria-haspopup", "listbox");
        trigger.setAttribute("aria-expanded", "false");
        // 未指定 type 的 <button> 在 <form> 內預設為 submit，開啟面板會送出表單
        if (trigger.tagName === "BUTTON" && !trigger.hasAttribute("type")) /** @type {HTMLButtonElement} */ (trigger).type = "button";
        // 選取後 placeholder 隱藏、trigger 只剩圖示：沒有其他命名來源時，以（隱藏的）placeholder 文字命名
        var labels = /** @type {HTMLButtonElement} */ (trigger).labels;
        if (placeholder && !trigger.hasAttribute("aria-label") && !trigger.hasAttribute("aria-labelledby") && !(labels && labels.length)) {
          if (!placeholder.id) placeholder.id = genId("cu-multi-select-placeholder");
          trigger.setAttribute("aria-labelledby", placeholder.id);
        }
      }
      if (content) {
        var list = content.querySelector("[data-cu-multi-select-list]") || content;
        list.setAttribute("role", "listbox");
        list.setAttribute("aria-multiselectable", "true");
        setupComboboxAria(trigger, input, content, list, "cu-multi-select-item-highlight", "cu-multi-select");
      }
      syncItemsAria();

      // Init from preset active items
      getItems().forEach(function (/** @type {HTMLElement} */ item) {
        if (item.classList.contains("cu-multi-select-item-active")) {
          selected.add(item.dataset.cuValue || "");
        }
      });

      function renderTags() {
        if (!tagsEl) return;
        // 清空（含標記中的空白文字節點），沒有標籤時 :empty 讓容器不佔空間
        tagsEl.textContent = "";
        if (selected.size === 0) {
          if (placeholder) placeholder.hidden = false;
        } else {
          if (placeholder) placeholder.hidden = true;
          selected.forEach(function (val) {
            // 逐一比對而非組 selector 字串：值含引號、反斜線時 querySelector 會拋錯
            /** @type {HTMLElement | null} */
            var item = null;
            getItems().forEach(function (/** @type {HTMLElement} */ i) {
              if (!item && (i.dataset.cuValue || "") === val) item = i;
            });
            if (!item) return;
            var tag = document.createElement("span");
            tag.className = "cu-multi-select-tag";
            tag.appendChild(document.createTextNode(item.textContent));
            var removeBtn = document.createElement("button");
            removeBtn.type = "button"; // 預設 submit：放在 <form> 內點擊會送出表單
            removeBtn.className = "cu-multi-select-tag-remove";
            removeBtn.setAttribute("data-cu-remove", val);
            removeBtn.textContent = "\u00d7";
            // 只有「×」時螢幕閱讀器會讀成 "times"；以 data-cu-multi-select-remove-text 模板（{label} 為項目文字）命名
            var label = (item.textContent || "").replace(/\s+/g, " ").trim();
            removeBtn.setAttribute("aria-label", (ms.getAttribute("data-cu-multi-select-remove-text") || "Remove {label}").split("{label}").join(label));
            removeBtn.addEventListener("click", function (e) {
              // 這裡必須阻止冒泡：handler 會把按鈕移出 DOM，冒泡到 document 時 contains() 會把它誤判為
              // 外部點擊而關閉面板；同時避免冒泡到 control 而開啟面板
              e.stopPropagation();
              var hadFocus = document.activeElement === removeBtn;
              var index = Array.from(selected).indexOf(val);
              selected.delete(val);
              item.classList.remove("cu-multi-select-item-active");
              item.setAttribute("aria-selected", "false");
              renderTags();
              // 按鈕已隨標籤移除：鍵盤使用者的焦點移到遞補位置的下一個標籤，最後一個之後為 trigger（Tab 順序的下一站）
              if (hadFocus) {
                var nextBtn = /** @type {HTMLElement} */ (tagsEl.querySelectorAll(".cu-multi-select-tag-remove")[index]);
                if (nextBtn) nextBtn.focus();
                else if (trigger) trigger.focus();
              }
              ms.dispatchEvent(new CustomEvent("cu:multiselect:change", {
                bubbles: true,
                detail: { selected: Array.from(selected) }
              }));
            });
            tag.appendChild(removeBtn);
            tagsEl.appendChild(tag);
          });
        }
      }

      function syncEmpty() {
        var visible = 0;
        getItems().forEach(function (item) {
          if (!item.hasAttribute("hidden")) visible++;
        });
        if (empty) empty.toggleAttribute("hidden", visible > 0);
      }

      // 預選項目（cu-multi-select-item-active）於初始化時渲染為標籤；沒有預選時也清掉標記中的空白
      renderTags();

      // 點擊外框的空白處（標籤之間、padding）等同點擊 trigger
      if (control) {
        control.addEventListener("click", function (e) {
          if (!trigger || trigger.contains(/** @type {Node} */ (e.target))) return;
          trigger.focus();
          trigger.click();
        });
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
        if (!ms.isConnected) return;
        var query = input.value.toLowerCase();
        getItems().forEach(function (item) {
          var match = (item.textContent || "")
            .toLowerCase()
            .includes(query);
          item.toggleAttribute("hidden", !match);
          // 被過濾掉的項目不可保留鍵盤高亮，否則 Enter 會選到看不見的項目
          if (!match) item.classList.remove("cu-multi-select-item-highlight");
        });
        syncEmpty();
        if (input.value !== lastQuery) {
          lastQuery = input.value;
          ms.dispatchEvent(new CustomEvent("cu:multiselect:search", {
            bubbles: true,
            detail: { query: input.value }
          }));
        }
      }
      var search = createDebouncer(filterItems);

      if (input) {
        input.addEventListener("input", function () {
          // 清空查詢（含關閉時的重設）一律立即執行，避免重新開啟時看到過期結果
          search.run(input.value === "" ? 0 : readDelay(ms, "data-cu-multi-select-debounce"));
        });
        // 鍵盤導航 / Enter 前先套用待執行的過濾（document keydown handler 在冒泡階段才處理）
        input.addEventListener("keydown", function (e) {
          if (NAV_KEYS.indexOf(e.key) !== -1) search.flush();
        });
      }

      content &&
        content.addEventListener("click", function (e) {
          var item = /** @type {HTMLElement} */ (/** @type {Element} */ (e.target).closest("[data-cu-multi-select-item]"));
          if (!item) return;
          var val = item.dataset.cuValue || "";
          if (selected.has(val)) {
            selected.delete(val);
            item.classList.remove("cu-multi-select-item-active");
            item.setAttribute("aria-selected", "false");
          } else {
            selected.add(val);
            item.classList.add("cu-multi-select-item-active");
            item.setAttribute("aria-selected", "true");
          }
          renderTags();
          ms.dispatchEvent(new CustomEvent("cu:multiselect:change", {
            bubbles: true,
            detail: { selected: Array.from(selected) }
          }));
        });

      track("multiSelects", { el: ms, trigger: trigger, content: content, input: input, getItems: getItems, cancelSearch: search.cancel });
    });
}
