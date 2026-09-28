import { registry } from "../core/registry.js";

/**
 * Multi Select — searchable multi-selection dropdown with tag display.
 *
 * HTML structure:
 * ```html
 * <div data-cu-multi-select>
 *   <div class="cu-multi-select-trigger" data-cu-multi-select-trigger>
 *     <div data-cu-multi-select-tags>
 *       <span data-cu-multi-select-placeholder>Select...</span>
 *     </div>
 *   </div>
 *   <div class="cu-multi-select-content" data-cu-multi-select-content hidden>
 *     <input class="cu-multi-select-input" data-cu-multi-select-input placeholder="Search...">
 *     <ul data-cu-multi-select-list>
 *       <li class="cu-multi-select-item" data-cu-multi-select-item data-cu-value="val1">Option 1</li>
 *     </ul>
 *     <div data-cu-multi-select-empty hidden>No results</div>
 *   </div>
 * </div>
 * ```
 * - `data-cu-value`: REQUIRED on each item for tag rendering. Value must be unique.
 * - `cu-multi-select-item-active`: pre-selected items at init time.
 * - Tags are auto-rendered in `data-cu-multi-select-tags` container.
 */
export function setupMultiSelects() {
  document
    .querySelectorAll("[data-cu-multi-select]")
    .forEach(function (ms) {
      if (ms._cuInit) return;
      ms._cuInit = true;

      var trigger = ms.querySelector("[data-cu-multi-select-trigger]");
      var content = ms.querySelector("[data-cu-multi-select-content]");
      var input = ms.querySelector("[data-cu-multi-select-input]");
      var empty = ms.querySelector("[data-cu-multi-select-empty]");
      var tagsEl = ms.querySelector("[data-cu-multi-select-tags]");
      var placeholder = ms.querySelector(
        "[data-cu-multi-select-placeholder]"
      );
      var selected = new Set();

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
      }
      if (content) {
        var list = content.querySelector("[data-cu-multi-select-list]") || content;
        list.setAttribute("role", "listbox");
        list.setAttribute("aria-multiselectable", "true");
      }
      syncItemsAria();

      // Init from preset active items
      getItems().forEach(function (item) {
        if (item.classList.contains("cu-multi-select-item-active")) {
          selected.add(item.dataset.cuValue || "");
        }
      });

      function renderTags() {
        if (!tagsEl) return;
        tagsEl
          .querySelectorAll(".cu-multi-select-tag")
          .forEach(function (t) {
            t.remove();
          });
        if (selected.size === 0) {
          if (placeholder) placeholder.hidden = false;
        } else {
          if (placeholder) placeholder.hidden = true;
          selected.forEach(function (val) {
            var item = ms.querySelector('[data-cu-value="' + val + '"]');
            if (!item) return;
            var tag = document.createElement("span");
            tag.className = "cu-multi-select-tag";
            tag.appendChild(document.createTextNode(item.textContent));
            var removeBtn = document.createElement("button");
            removeBtn.className = "cu-multi-select-tag-remove";
            removeBtn.setAttribute("data-cu-remove", val);
            removeBtn.textContent = "\u00d7";
            removeBtn.addEventListener("click", function (e) {
              e.stopPropagation();
              selected.delete(val);
              item.classList.remove("cu-multi-select-item-active");
              item.setAttribute("aria-selected", "false");
              renderTags();
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

      if (input) {
        input.addEventListener("input", function () {
          var query = input.value.toLowerCase();
          getItems().forEach(function (item) {
            var match = (item.textContent || "")
              .toLowerCase()
              .includes(query);
            item.toggleAttribute("hidden", !match);
          });
          syncEmpty();
        });
      }

      content &&
        content.addEventListener("click", function (e) {
          var item = e.target.closest("[data-cu-multi-select-item]");
          if (!item) return;
          e.stopPropagation();
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

      registry.multiSelects.push({ el: ms, trigger: trigger, content: content, input: input, getItems: getItems });
    });
}
