import { registry } from "../core/registry.js";

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
 */
export function setupComboboxes() {
  document.querySelectorAll("[data-cu-combobox]").forEach(function (combobox) {
    if (combobox._cuInit) return;
    combobox._cuInit = true;

    var trigger = combobox.querySelector("[data-cu-combobox-trigger]");
    var content = combobox.querySelector("[data-cu-combobox-content]");
    var input = /** @type {HTMLInputElement} */ (combobox.querySelector("[data-cu-combobox-input]"));
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
      trigger.addEventListener("click", function (e) {
        e.stopPropagation();
        var isHidden = content && content.hasAttribute("hidden");
        content && content.toggleAttribute("hidden");
        trigger.setAttribute("aria-expanded", String(isHidden));
        if (isHidden) {
          syncItemsAria();
          if (input) input.focus();
          syncEmpty();
        }
      });

    input &&
      input.addEventListener("input", function () {
        var query = input.value.toLowerCase();
        getItems().forEach(function (item) {
          var match = (item.textContent || "").toLowerCase().includes(query);
          item.toggleAttribute("hidden", !match);
        });
        syncEmpty();
      });

    content &&
      content.addEventListener("click", function (e) {
        var item = /** @type {HTMLElement} */ (/** @type {Element} */ (e.target).closest("[data-cu-combobox-item]"));
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
        if (trigger) trigger.setAttribute("aria-expanded", "false");
        if (input) {
          input.value = "";
          input.dispatchEvent(new Event("input"));
        }
        combobox.dispatchEvent(new CustomEvent("cu:combobox:change", {
          bubbles: true,
          detail: { value: item.dataset.cuValue || item.textContent, item: item }
        }));
      });

    registry.comboboxes.push({ el: combobox, trigger: trigger, content: content, input: input, getItems: getItems });
  });
}
