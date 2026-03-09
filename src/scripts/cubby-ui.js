/**
 * Cubby UI — Interactive component scripts
 * Framework-agnostic, vanilla JS (UMD)
 */
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.CubbyUI = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // --- Delegated event listener tracking ---
  var _dropdowns = [];
  var _comboboxes = [];
  var _multiSelects = [];
  var _popovers = [];
  var _menubars = [];
  var _tabs = [];
  var _numberInputs = [];
  var _dropzones = [];
  var _transferLists = [];
  var _mobileNavs = [];
  var _docListenersReady = false;

  // Shared keyboard navigation helper for floating panels
  function navigateItems(items, key, highlightClass) {
    var visible = [];
    items.forEach(function (item) {
      if (!item.hasAttribute("hidden") && !item.hasAttribute("disabled") && !item.classList.contains("pointer-events-none")) visible.push(item);
    });
    if (visible.length === 0) return;

    var current = -1;
    for (var i = 0; i < visible.length; i++) {
      if (visible[i].classList.contains(highlightClass)) {
        current = i;
        break;
      }
    }

    var next;
    if (key === "Home") {
      next = 0;
    } else if (key === "End") {
      next = visible.length - 1;
    } else if (key === "ArrowDown") {
      next = current < visible.length - 1 ? current + 1 : 0;
    } else {
      next = current > 0 ? current - 1 : visible.length - 1;
    }

    if (current >= 0) visible[current].classList.remove(highlightClass);
    visible[next].classList.add(highlightClass);
    visible[next].scrollIntoView({ block: "nearest" });
  }

  function setupDocumentListeners() {
    if (_docListenersReady) return;
    _docListenersReady = true;

    document.addEventListener("click", function (e) {
      _dropdowns.forEach(function (d) {
        if (!d.el.contains(e.target) && d.content) {
          d.content.setAttribute("hidden", "");
          if (d.trigger) d.trigger.setAttribute("aria-expanded", "false");
        }
      });
      _comboboxes.forEach(function (c) {
        if (!c.el.contains(e.target)) {
          if (c.content) c.content.setAttribute("hidden", "");
          if (c.trigger) c.trigger.setAttribute("aria-expanded", "false");
          if (c.input) {
            c.input.value = "";
            c.input.dispatchEvent(new Event("input"));
          }
        }
      });
      _multiSelects.forEach(function (ms) {
        if (!ms.el.contains(e.target)) {
          if (ms.content) ms.content.setAttribute("hidden", "");
          if (ms.trigger) ms.trigger.setAttribute("aria-expanded", "false");
          if (ms.input) {
            ms.input.value = "";
            ms.input.dispatchEvent(new Event("input"));
          }
        }
      });
      _popovers.forEach(function (p) {
        if (!p.el.contains(e.target)) {
          p.content.setAttribute("hidden", "");
          if (p.trigger) p.trigger.setAttribute("aria-expanded", "false");
        }
      });
      _menubars.forEach(function (b) {
        if (!b.el.contains(e.target)) {
          b.menus.forEach(function (m) {
            var mc = m.querySelector("[data-cu-menubar-content]");
            var mt = m.querySelector("[data-cu-menubar-trigger]");
            if (mc) mc.setAttribute("hidden", "");
            if (mt) mt.setAttribute("aria-expanded", "false");
          });
        }
      });
    });

    document.addEventListener("keydown", function (e) {
      // --- Escape: close all floating panels ---
      if (e.key === "Escape") {
        _dropdowns.forEach(function (d) {
          if (d.content && !d.content.hasAttribute("hidden")) {
            d.content.setAttribute("hidden", "");
            if (d.trigger) d.trigger.setAttribute("aria-expanded", "false");
          }
        });
        _comboboxes.forEach(function (c) {
          if (c.content && !c.content.hasAttribute("hidden")) {
            c.content.setAttribute("hidden", "");
            if (c.trigger) c.trigger.setAttribute("aria-expanded", "false");
            if (c.input) {
              c.input.value = "";
              c.input.dispatchEvent(new Event("input"));
            }
          }
        });
        _multiSelects.forEach(function (ms) {
          if (ms.content && !ms.content.hasAttribute("hidden")) {
            ms.content.setAttribute("hidden", "");
            if (ms.trigger) ms.trigger.setAttribute("aria-expanded", "false");
            if (ms.input) {
              ms.input.value = "";
              ms.input.dispatchEvent(new Event("input"));
            }
          }
        });
        _popovers.forEach(function (p) {
          if (!p.content.hasAttribute("hidden")) {
            p.content.setAttribute("hidden", "");
            if (p.trigger) p.trigger.setAttribute("aria-expanded", "false");
          }
        });
        _mobileNavs.forEach(function (mn) {
          if (mn.panel.hasAttribute("data-cu-mobile-nav-open")) {
            closeMobileNav(mn);
          }
        });
        return;
      }

      // --- Arrow / Home / End / Enter: navigate items in open floating panels ---
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Home" || e.key === "End" || e.key === "Enter") {
        // Dropdown
        _dropdowns.forEach(function (d) {
          if (!d.content || d.content.hasAttribute("hidden")) return;
          var items = d.content.querySelectorAll(".cu-dropdown-item:not([hidden])");
          if (items.length === 0) return;
          if (e.key === "Enter") {
            var active = d.content.querySelector(".cu-dropdown-item-highlight");
            if (active) { active.click(); e.preventDefault(); }
            return;
          }
          e.preventDefault();
          navigateItems(items, e.key, "cu-dropdown-item-highlight");
        });

        // Combobox
        _comboboxes.forEach(function (c) {
          if (!c.content || c.content.hasAttribute("hidden")) return;
          var items = c.getItems();
          if (!items || items.length === 0) return;
          if (e.key === "Enter") {
            var active = c.content.querySelector(".cu-combobox-item-highlight");
            if (active) { active.click(); e.preventDefault(); }
            return;
          }
          e.preventDefault();
          navigateItems(items, e.key, "cu-combobox-item-highlight");
        });

        // Multi Select
        _multiSelects.forEach(function (ms) {
          if (!ms.content || ms.content.hasAttribute("hidden")) return;
          var items = ms.getItems();
          if (!items || items.length === 0) return;
          if (e.key === "Enter") {
            var active = ms.content.querySelector(".cu-multi-select-item-highlight");
            if (active) { active.click(); e.preventDefault(); }
            return;
          }
          e.preventDefault();
          navigateItems(items, e.key, "cu-multi-select-item-highlight");
        });
      }
    });
  }

  function genId(prefix) {
    return prefix + "-" + Math.random().toString(36).slice(2, 9);
  }

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
  function setupTabs() {
    document.querySelectorAll("[data-cu-tabs]").forEach(function (tabs) {
      if (tabs._cuInit) return;
      tabs._cuInit = true;

      var triggers = tabs.querySelectorAll("[data-cu-tabs-trigger]");
      var contents = tabs.querySelectorAll("[data-cu-tabs-content]");

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

        trigger.addEventListener("click", function () {
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
      _tabs.push({ el: tabs });
    });
  }

  /**
   * Dropdown Menu — click-triggered floating menu panel.
   *
   * HTML structure:
   * ```html
   * <div data-cu-dropdown>
   *   <button data-cu-dropdown-trigger>Options</button>
   *   <div class="cu-dropdown-content" data-cu-dropdown-content hidden>
   *     <div class="cu-dropdown-label">Label</div>
   *     <button class="cu-dropdown-item">Item</button>
   *     <div class="cu-dropdown-separator"></div>
   *     <button class="cu-dropdown-item">Item 2</button>
   *   </div>
   * </div>
   * ```
   * - Add `hidden` to content element initially.
   * - Closes on outside click or Escape key.
   * - Arrow / Home / End keys navigate items; Enter activates highlighted item.
   */
  function setupDropdowns() {
    document.querySelectorAll("[data-cu-dropdown]").forEach(function (dropdown) {
      if (dropdown._cuInit) return;
      dropdown._cuInit = true;

      var trigger = dropdown.querySelector("[data-cu-dropdown-trigger]");
      var content = dropdown.querySelector("[data-cu-dropdown-content]");

      // ARIA setup
      if (trigger) {
        trigger.setAttribute("aria-haspopup", "menu");
        trigger.setAttribute("aria-expanded", "false");
      }
      if (content) {
        content.setAttribute("role", "menu");
        content.querySelectorAll(".cu-dropdown-item").forEach(function (item) {
          item.setAttribute("role", "menuitem");
        });
      }

      trigger &&
        trigger.addEventListener("click", function (e) {
          e.stopPropagation();
          if (content) {
            content.toggleAttribute("hidden");
            trigger.setAttribute("aria-expanded", String(!content.hasAttribute("hidden")));
          }
        });
      _dropdowns.push({ el: dropdown, trigger: trigger, content: content });
    });
  }

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
  function setupComboboxes() {
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

      _comboboxes.push({ el: combobox, trigger: trigger, content: content, input: input, getItems: getItems });
    });
  }

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
  function setupMultiSelects() {
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

        _multiSelects.push({ el: ms, trigger: trigger, content: content, input: input, getItems: getItems });
      });
  }

  // Round to step precision to avoid floating-point drift (e.g. 0.1 + 0.2)
  function roundToStep(value, step) {
    if (step >= 1) return Math.round(value / step) * step;
    var decimals = (String(step).split(".")[1] || "").length;
    return Number(value.toFixed(decimals));
  }

  function clampValue(value, min, max) {
    if (value < min) return min;
    if (value > max) return max;
    return value;
  }

  /**
   * Number Input — increment/decrement buttons for a numeric input field.
   *
   * HTML structure:
   * ```html
   * <div class="cu-number-input" data-cu-number-input>
   *   <button data-cu-number-decrement>−</button>
   *   <input type="number" data-cu-number-field min="0" max="100" step="1" value="0">
   *   <button data-cu-number-increment>+</button>
   * </div>
   * ```
   * - Uses native `<input type="number">` min/max/step attributes.
   * - On blur, sanitizes input: non-numeric → 0, then clamps and rounds to step.
   * - ARIA: adds role="spinbutton" + aria-valuemin/max/now automatically.
   */
  function setupNumberInputs() {
    document
      .querySelectorAll("[data-cu-number-input]")
      .forEach(function (container) {
        if (container._cuInit) return;
        container._cuInit = true;

        var field = container.querySelector("[data-cu-number-field]");
        var decrement = container.querySelector("[data-cu-number-decrement]");
        var increment = container.querySelector("[data-cu-number-increment]");
        if (!field) return;

        var getStep = function () { return Number(field.step) || 1; };
        var getMin = function () { return field.min !== "" ? Number(field.min) : -Infinity; };
        var getMax = function () { return field.max !== "" ? Number(field.max) : Infinity; };

        // ARIA: spinbutton semantics
        field.setAttribute("role", "spinbutton");
        if (field.min !== "") field.setAttribute("aria-valuemin", field.min);
        if (field.max !== "") field.setAttribute("aria-valuemax", field.max);
        field.setAttribute("aria-valuenow", field.value);
        field.addEventListener("input", function () {
          field.setAttribute("aria-valuenow", field.value);
        });

        decrement &&
          decrement.addEventListener("click", function () {
            var current = Number(field.value) || 0;
            var next = roundToStep(current - getStep(), getStep());
            if (next >= getMin()) {
              field.value = next;
              field.dispatchEvent(new Event("input", { bubbles: true }));
            }
          });

        increment &&
          increment.addEventListener("click", function () {
            var current = Number(field.value) || 0;
            var next = roundToStep(current + getStep(), getStep());
            if (next <= getMax()) {
              field.value = next;
              field.dispatchEvent(new Event("input", { bubbles: true }));
            }
          });

        // Sanitize manual input on blur: filter non-numeric, clamp to min/max, round to step
        field.addEventListener("change", function () {
          var raw = field.value.trim();
          if (raw === "" || isNaN(Number(raw))) {
            field.value = clampValue(0, getMin(), getMax());
          } else {
            field.value = clampValue(roundToStep(Number(raw), getStep()), getMin(), getMax());
          }
          field.dispatchEvent(new Event("input", { bubbles: true }));
        });

        _numberInputs.push({ el: container });
      });
  }

  /**
   * Dropzone — drag-and-drop file upload area.
   *
   * HTML structure:
   * ```html
   * <div class="cu-dropzone" data-cu-dropzone>
   *   <input type="file" data-cu-dropzone-input class="sr-only" multiple>
   *   <p>Drop files here or click to upload</p>
   * </div>
   * ```
   * - Click on zone triggers the hidden file input.
   * - Drag over: adds `cu-dropzone-active` class.
   * - Drop: assigns dropped files to input.files and dispatches "change" event.
   * - REQUIRED: `data-cu-dropzone-input` on the `<input type="file">` element.
   */
  function setupDropzones() {
    document.querySelectorAll("[data-cu-dropzone]").forEach(function (zone) {
      if (zone._cuInit) return;
      zone._cuInit = true;

      var input = zone.querySelector("[data-cu-dropzone-input]");
      if (!input) return;

      zone.addEventListener("click", function () {
        input.click();
      });

      zone.addEventListener("dragenter", function (e) {
        e.preventDefault();
        zone.classList.add("cu-dropzone-active");
      });

      zone.addEventListener("dragover", function (e) {
        e.preventDefault();
        zone.classList.add("cu-dropzone-active");
      });

      zone.addEventListener("dragleave", function () {
        zone.classList.remove("cu-dropzone-active");
      });

      zone.addEventListener("drop", function (e) {
        e.preventDefault();
        zone.classList.remove("cu-dropzone-active");
        var files = e.dataTransfer && e.dataTransfer.files;
        if (files && files.length) {
          input.files = files;
          input.dispatchEvent(new Event("change", { bubbles: true }));
        }
      });

      _dropzones.push({ el: zone });
    });
  }

  /**
   * Transfer List — move items between two panels using checkboxes.
   *
   * HTML structure:
   * ```html
   * <div data-cu-transfer-list>
   *   <div data-cu-transfer-panel="left">
   *     <input data-cu-transfer-search="left" type="search" placeholder="Filter...">
   *     <input type="checkbox" data-cu-transfer-check-all="left">
   *     <span data-cu-transfer-count="left"></span>
   *     <ul class="cu-transfer-list-content">
   *       <li class="cu-transfer-list-item">
   *         <input type="checkbox" data-cu-transfer-check data-cu-value="item1">
   *         <span>Item 1</span>
   *       </li>
   *     </ul>
   *   </div>
   *   <div>
   *     <button data-cu-transfer-to-right>→</button>
   *     <button data-cu-transfer-to-left>←</button>
   *   </div>
   *   <div data-cu-transfer-panel="right"><!-- same structure --></div>
   * </div>
   * ```
   * - `data-cu-transfer-check-all`, `data-cu-transfer-count`, `data-cu-transfer-search`:
   *   values must be "left" or "right" matching their panel.
   * - `data-cu-value` on each checkbox item: identifies which item to move.
   * - `cu-transfer-list-item-checked`: toggled automatically based on checkbox state.
   */
  function setupTransferLists() {
    document
      .querySelectorAll("[data-cu-transfer-list]")
      .forEach(function (container) {
        if (container._cuInit) return;
        container._cuInit = true;

        var leftPanel = container.querySelector(
          '[data-cu-transfer-panel="left"]'
        );
        var rightPanel = container.querySelector(
          '[data-cu-transfer-panel="right"]'
        );
        var toRight = container.querySelector("[data-cu-transfer-to-right]");
        var toLeft = container.querySelector("[data-cu-transfer-to-left]");
        if (!leftPanel || !rightPanel) return;

        function getChecked(panel) {
          return panel.querySelectorAll("[data-cu-transfer-check]:checked");
        }

        function getAllItems(panel) {
          return panel.querySelectorAll(".cu-transfer-list-item");
        }

        function updateCount(panel) {
          var side = panel.dataset.cuTransferPanel;
          var all = getAllItems(panel);
          var checked = getChecked(panel);
          var countEl = container.querySelector(
            '[data-cu-transfer-count="' + side + '"]'
          );
          if (countEl)
            countEl.textContent = checked.length + "/" + all.length;
        }

        function updateButtons() {
          if (toRight) toRight.disabled = getChecked(leftPanel).length === 0;
          if (toLeft) toLeft.disabled = getChecked(rightPanel).length === 0;
        }

        function updateCheckAll(panel) {
          var side = panel.dataset.cuTransferPanel;
          var all = getAllItems(panel);
          var checked = getChecked(panel);
          var checkAll = container.querySelector(
            '[data-cu-transfer-check-all="' + side + '"]'
          );
          if (checkAll) {
            checkAll.checked =
              all.length > 0 && checked.length === all.length;
            checkAll.indeterminate =
              checked.length > 0 && checked.length < all.length;
          }
        }

        function bindPanel(panel) {
          panel.addEventListener("change", function (e) {
            if (e.target.matches("[data-cu-transfer-check]")) {
              var item = e.target.closest(".cu-transfer-list-item");
              item &&
                item.classList.toggle(
                  "cu-transfer-list-item-checked",
                  e.target.checked
                );
              updateCount(panel);
              updateButtons();
              updateCheckAll(panel);
            }
          });

          var side = panel.dataset.cuTransferPanel;
          var checkAll = container.querySelector(
            '[data-cu-transfer-check-all="' + side + '"]'
          );
          checkAll &&
            checkAll.addEventListener("change", function () {
              var items = getAllItems(panel);
              items.forEach(function (item) {
                var cb = item.querySelector("[data-cu-transfer-check]");
                if (cb) {
                  cb.checked = checkAll.checked;
                  item.classList.toggle(
                    "cu-transfer-list-item-checked",
                    checkAll.checked
                  );
                }
              });
              updateCount(panel);
              updateButtons();
            });

          // Search filtering
          var searchInput = container.querySelector(
            '[data-cu-transfer-search="' + side + '"]'
          );
          searchInput &&
            searchInput.addEventListener("input", function () {
              var query = searchInput.value.toLowerCase();
              var items = getAllItems(panel);
              items.forEach(function (item) {
                var span = item.querySelector("span");
                var text = (span ? span.textContent : "").toLowerCase();
                item.toggleAttribute("hidden", !text.includes(query));
              });
            });
        }

        function moveItems(fromPanel, toPanel) {
          var checked = getChecked(fromPanel);
          var content = toPanel.querySelector(".cu-transfer-list-content");
          checked.forEach(function (cb) {
            var item = cb.closest(".cu-transfer-list-item");
            cb.checked = false;
            item && item.classList.remove("cu-transfer-list-item-checked");
            item && item.removeAttribute("hidden");
            content && item && content.appendChild(item);
          });
          updateCount(fromPanel);
          updateCount(toPanel);
          updateButtons();
          updateCheckAll(fromPanel);
          updateCheckAll(toPanel);
        }

        toRight &&
          toRight.addEventListener("click", function () {
            moveItems(leftPanel, rightPanel);
          });
        toLeft &&
          toLeft.addEventListener("click", function () {
            moveItems(rightPanel, leftPanel);
          });

        bindPanel(leftPanel);
        bindPanel(rightPanel);
        updateCount(leftPanel);
        updateCount(rightPanel);

        _transferLists.push({ el: container });
      });
  }

  /**
   * Generic overlay initializer — shared logic for Dialog, Drawer, Alert Dialog.
   *
   * @param {Object} config
   * @param {string} config.triggerAttr     - data attribute on trigger element (value = dialog id)
   * @param {string} config.dialogAttr      - data attribute on <dialog> element
   * @param {string[]} config.closeAttrs    - data attributes that close the dialog when clicked
   * @param {boolean} config.closeOnBackdrop - whether clicking outside closes the dialog
   * @param {string} [config.titleClass]    - class of title element for aria-labelledby
   * @param {string} [config.descClass]     - class of description element for aria-describedby
   * @param {string} [config.role]          - ARIA role override (e.g. "alertdialog")
   *
   * Uses native <dialog> element with showModal() for proper focus trap and backdrop.
   * Focus is restored to the trigger element when dialog closes.
   */
  // --- Mobile Nav helpers ---
  function closeMobileNav(mn) {
    mn.panel.removeAttribute("data-cu-mobile-nav-open");
    mn.backdrop.removeAttribute("data-cu-mobile-nav-open");
    mn.trigger.setAttribute("aria-expanded", "false");
    // Only restore scroll if we locked it (skip for absolute-positioned demo panels)
    if (getComputedStyle(mn.panel).position !== "absolute") {
      document.body.style.overflow = "";
    }
    mn.trigger.focus();
  }

  /**
   * Mobile Navigation — slide-in panel for mobile header navigation.
   *
   * HTML structure:
   * ```html
   * <header class="cu-header">
   *   <div class="cu-header-inner">
   *     <button data-cu-mobile-nav-trigger="main-nav" aria-label="Open menu" aria-expanded="false">☰</button>
   *     <div class="cu-header-brand">Brand</div>
   *     <div class="cu-header-nav">
   *       <nav class="cu-nav">
   *         <a class="cu-nav-item" href="#">Home</a>
   *       </nav>
   *     </div>
   *   </div>
   * </header>
   * <div id="main-nav" class="cu-header-mobile-backdrop" data-cu-mobile-nav></div>
   * <nav id="main-nav-panel" class="cu-header-mobile-nav"
   *      data-cu-mobile-nav-panel="main-nav" data-cu-mobile-nav-clone
   *      role="dialog" aria-modal="true" aria-label="Navigation menu">
   *   <div class="cu-header-mobile-header">
   *     <span>Brand</span>
   *     <button data-cu-mobile-nav-close class="cu-header-mobile-close" aria-label="Close menu">✕</button>
   *   </div>
   *   <div class="cu-header-mobile-content"></div>
   * </nav>
   * ```
   * Add `data-cu-mobile-nav-clone` to auto-clone desktop nav into the panel.
   */
  function setupMobileNav() {
    document.querySelectorAll("[data-cu-mobile-nav-trigger]").forEach(function (trigger) {
      if (trigger._cuInit) return;
      trigger._cuInit = true;

      var backdropId = trigger.getAttribute("data-cu-mobile-nav-trigger");
      var backdrop = document.getElementById(backdropId);
      var panel = document.querySelector("[data-cu-mobile-nav-panel='" + backdropId + "']");
      if (!backdrop || !panel) return;

      // Auto-clone desktop nav if panel has data-cu-mobile-nav-clone
      if (panel.hasAttribute("data-cu-mobile-nav-clone")) {
        var content = panel.querySelector(".cu-header-mobile-content");
        if (content && content.children.length === 0) {
          var header = trigger.closest(".cu-header");
          if (header) {
            var desktopNav = header.querySelector(".cu-header-nav");
            if (desktopNav) {
              var clone = desktopNav.cloneNode(true);
              // Convert to vertical mobile nav
              clone.classList.remove("cu-header-nav");
              clone.classList.remove("hidden");
              clone.removeAttribute("class");
              var navEl = clone.querySelector(".cu-nav");
              if (navEl) {
                navEl.classList.add("cu-nav-vertical");
                content.appendChild(navEl);
              } else {
                // The clone itself might be the nav wrapper
                var items = clone.querySelectorAll(".cu-nav-item");
                if (items.length > 0) {
                  var newNav = document.createElement("nav");
                  newNav.className = "cu-nav cu-nav-vertical";
                  items.forEach(function (item) {
                    newNav.appendChild(item.cloneNode(true));
                  });
                  content.appendChild(newNav);
                }
              }
            }
          }
        }
      }

      var closeBtn = panel.querySelector("[data-cu-mobile-nav-close]");

      var mn = { trigger: trigger, backdrop: backdrop, panel: panel, el: trigger };
      _mobileNavs.push(mn);

      trigger.addEventListener("click", function () {
        panel.setAttribute("data-cu-mobile-nav-open", "");
        backdrop.setAttribute("data-cu-mobile-nav-open", "");
        trigger.setAttribute("aria-expanded", "true");
        // Skip scroll lock when panel is absolutely positioned (e.g. inside a demo preview)
        if (getComputedStyle(panel).position !== "absolute") {
          document.body.style.overflow = "hidden";
        }
        if (closeBtn) closeBtn.focus({ preventScroll: true });
      });

      if (closeBtn) {
        closeBtn.addEventListener("click", function () {
          closeMobileNav(mn);
        });
      }

      backdrop.addEventListener("click", function () {
        closeMobileNav(mn);
      });
    });
  }

  function setupOverlay(config) {
    document
      .querySelectorAll("[" + config.triggerAttr + "]")
      .forEach(function (trigger) {
        if (trigger._cuInit) return;
        trigger._cuInit = true;

        trigger.addEventListener("click", function () {
          var id = trigger.getAttribute(config.triggerAttr);
          var dialog = document.getElementById(id);
          if (dialog && dialog.showModal) {
            dialog._cuTrigger = trigger;
            dialog.showModal();
          }
        });
      });

    document
      .querySelectorAll("[" + config.dialogAttr + "]")
      .forEach(function (dialog) {
        if (dialog._cuInit) return;
        dialog._cuInit = true;

        // ARIA: override role (e.g. alertdialog)
        if (config.role) dialog.setAttribute("role", config.role);
        // ARIA: link dialog to its title element
        if (config.titleClass) {
          var title = dialog.querySelector("." + config.titleClass);
          if (title) {
            if (!title.id) title.id = genId(config.titleClass);
            dialog.setAttribute("aria-labelledby", title.id);
          }
        }
        // ARIA: link dialog to its description element
        if (config.descClass) {
          var desc = dialog.querySelector("." + config.descClass);
          if (desc) {
            if (!desc.id) desc.id = genId(config.descClass);
            dialog.setAttribute("aria-describedby", desc.id);
          }
        }

        config.closeAttrs.forEach(function (attr) {
          dialog.querySelectorAll("[" + attr + "]").forEach(function (btn) {
            btn.addEventListener("click", function () {
              dialog.close();
            });
          });
        });
        if (config.closeOnBackdrop) {
          dialog.addEventListener("click", function (e) {
            if (e.target === dialog) dialog.close();
          });
        }

        // Restore focus to trigger element on close
        dialog.addEventListener("close", function () {
          var trigger = dialog._cuTrigger;
          if (trigger && typeof trigger.focus === "function") {
            trigger.focus();
            dialog._cuTrigger = null;
          }
        });
      });
  }

  /**
   * Dialog — modal dialog using native <dialog>.
   *
   * HTML structure:
   * ```html
   * <button data-cu-dialog-trigger="dialog-id">Open</button>
   * <dialog id="dialog-id" class="cu-dialog cu-dialog-md">
   *   <div class="cu-dialog-header">
   *     <h2 class="cu-dialog-title">Title</h2>
   *     <p class="cu-dialog-description">Description</p>
   *   </div>
   *   <div class="cu-dialog-footer">
   *     <button data-cu-dialog-close>Cancel</button>
   *     <button>Confirm</button>
   *   </div>
   * </dialog>
   * ```
   * Sizes: cu-dialog-sm | cu-dialog-md (default) | cu-dialog-xl | cu-dialog-full
   * Closes on backdrop click. Focus returns to trigger on close.
   */
  function setupDialogs() {
    setupOverlay({
      triggerAttr: "data-cu-dialog-trigger",
      dialogAttr: "data-cu-dialog",
      closeAttrs: ["data-cu-dialog-close"],
      closeOnBackdrop: true,
      titleClass: "cu-dialog-title",
      descClass: "cu-dialog-description",
    });
  }

  /**
   * Drawer — side panel using native <dialog>.
   *
   * HTML structure:
   * ```html
   * <button data-cu-drawer-trigger="drawer-id">Open</button>
   * <dialog id="drawer-id" class="cu-drawer cu-drawer-right">
   *   <div class="cu-drawer-header">
   *     <h2 class="cu-drawer-title">Title</h2>
   *     <button data-cu-drawer-close>✕</button>
   *   </div>
   *   <div class="cu-drawer-content">Content</div>
   *   <div class="cu-drawer-footer">
   *     <button data-cu-drawer-close>Close</button>
   *   </div>
   * </dialog>
   * ```
   * Directions: cu-drawer-right (default) | cu-drawer-left | cu-drawer-top | cu-drawer-bottom
   * Closes on backdrop click. Focus returns to trigger on close.
   */
  function setupDrawers() {
    setupOverlay({
      triggerAttr: "data-cu-drawer-trigger",
      dialogAttr: "data-cu-drawer",
      closeAttrs: ["data-cu-drawer-close"],
      closeOnBackdrop: true,
      titleClass: "cu-drawer-title",
      descClass: "cu-drawer-description",
    });
  }

  /**
   * Alert Dialog — blocking confirmation dialog using native <dialog>.
   *
   * HTML structure:
   * ```html
   * <button data-cu-alert-dialog-trigger="confirm-id">Delete</button>
   * <dialog id="confirm-id" class="cu-alert-dialog">
   *   <div class="cu-alert-dialog-header">
   *     <h2 class="cu-alert-dialog-title">Are you sure?</h2>
   *     <p class="cu-alert-dialog-description">This cannot be undone.</p>
   *   </div>
   *   <div class="cu-alert-dialog-footer">
   *     <button data-cu-alert-dialog-cancel>Cancel</button>
   *     <button data-cu-alert-dialog-action>Confirm</button>
   *   </div>
   * </dialog>
   * ```
   * IMPORTANT: Does NOT close on backdrop click (by design, prevents accidental dismissal).
   * Only data-cu-alert-dialog-cancel and data-cu-alert-dialog-action close the dialog.
   * ARIA role="alertdialog" is set automatically.
   */
  function setupAlertDialogs() {
    setupOverlay({
      triggerAttr: "data-cu-alert-dialog-trigger",
      dialogAttr: "data-cu-alert-dialog",
      closeAttrs: ["data-cu-alert-dialog-cancel", "data-cu-alert-dialog-action"],
      closeOnBackdrop: false,
      titleClass: "cu-alert-dialog-title",
      descClass: "cu-alert-dialog-description",
      role: "alertdialog",
    });
  }

  function dismissToast(toast) {
    if (toast._cuDismissing) return;
    toast._cuDismissing = true;
    toast.classList.remove("cu-toast-enter");
    toast.classList.add("cu-toast-exit");
    toast.addEventListener("animationend", function () {
      toast.remove();
    }, { once: true });
  }

  /**
   * Toast — auto-dismissing notification triggered by button click.
   *
   * Trigger HTML:
   * ```html
   * <button
   *   data-cu-toast-trigger
   *   data-cu-toast-title="Title text"
   *   data-cu-toast-description="Optional description"
   *   data-cu-toast-variant="success"
   *   data-cu-toast-duration="4000">
   *   Click me
   * </button>
   * ```
   *
   * Variants: default | destructive | success | warning | info
   * Duration: milliseconds before auto-dismiss (default: 5000)
   *
   * Optional explicit container (auto-created at bottom-right if not present):
   * ```html
   * <div class="cu-toast-container cu-toast-container-bottom-right"
   *   data-cu-toast-container
   *   data-cu-toast-max="5">
   * </div>
   * ```
   * Container positions: bottom-right | bottom-left | top-right | top-left | top-center | bottom-center
   * Max stack: data-cu-toast-max (default 5) — oldest toast auto-dismissed when exceeded.
   *
   * Toast content is built with DOM API (no innerHTML) to prevent XSS.
   */
  function setupToasts() {
    // Ensure container exists
    var container = document.querySelector("[data-cu-toast-container]");
    if (!container) {
      container = document.createElement("div");
      container.className = "cu-toast-container cu-toast-container-bottom-right";
      container.setAttribute("data-cu-toast-container", "");
      container.setAttribute("role", "region");
      container.setAttribute("aria-label", "Notifications");
      document.body.appendChild(container);
    }

    document
      .querySelectorAll("[data-cu-toast-trigger]")
      .forEach(function (trigger) {
        if (trigger._cuInit) return;
        trigger._cuInit = true;

        trigger.addEventListener("click", function () {
          var c = document.querySelector("[data-cu-toast-container]");
          if (!c) return;
          var title = trigger.getAttribute("data-cu-toast-title") || "";
          var desc = trigger.getAttribute("data-cu-toast-description") || "";
          var variant =
            trigger.getAttribute("data-cu-toast-variant") || "default";
          var toast = document.createElement("div");
          toast.className = "cu-toast cu-toast-" + variant + " cu-toast-enter";
          if (variant === "destructive") {
            toast.setAttribute("role", "alert");
            toast.setAttribute("aria-live", "assertive");
          } else {
            toast.setAttribute("role", "status");
            toast.setAttribute("aria-live", "polite");
          }

          var body = document.createElement("div");
          body.className = "cu-toast-body";
          var titleEl = document.createElement("div");
          titleEl.className = "cu-toast-title";
          titleEl.textContent = title;
          body.appendChild(titleEl);
          if (desc) {
            var descEl = document.createElement("div");
            descEl.className = "cu-toast-description";
            descEl.textContent = desc;
            body.appendChild(descEl);
          }
          toast.appendChild(body);

          var closeBtn = document.createElement("button");
          closeBtn.className = "cu-toast-close";
          closeBtn.setAttribute("data-cu-toast-close", "");
          var svgNS = "http://www.w3.org/2000/svg";
          var svg = document.createElementNS(svgNS, "svg");
          svg.setAttribute("width", "14");
          svg.setAttribute("height", "14");
          svg.setAttribute("viewBox", "0 0 24 24");
          svg.setAttribute("fill", "none");
          svg.setAttribute("stroke", "currentColor");
          svg.setAttribute("stroke-width", "2");
          svg.setAttribute("stroke-linecap", "round");
          svg.setAttribute("stroke-linejoin", "round");
          var path1 = document.createElementNS(svgNS, "path");
          path1.setAttribute("d", "M18 6 6 18");
          var path2 = document.createElementNS(svgNS, "path");
          path2.setAttribute("d", "m6 6 12 12");
          svg.appendChild(path1);
          svg.appendChild(path2);
          closeBtn.appendChild(svg);
          toast.appendChild(closeBtn);

          c.appendChild(toast);

          // Stack limit: dismiss oldest toasts when exceeding max (default 5)
          var maxToasts = parseInt(c.getAttribute("data-cu-toast-max"), 10) || 5;
          var existing = c.querySelectorAll(".cu-toast:not(.cu-toast-exit)");
          if (existing.length > maxToasts) {
            for (var ti = 0; ti < existing.length - maxToasts; ti++) {
              dismissToast(existing[ti]);
            }
          }

          var duration = parseInt(trigger.getAttribute("data-cu-toast-duration"), 10) || 5000;
          var timer = setTimeout(function () {
            dismissToast(toast);
          }, duration);
          closeBtn.addEventListener("click", function () {
            clearTimeout(timer);
            dismissToast(toast);
          });
        });
      });
  }

  /**
   * Popover — click-triggered floating content panel.
   *
   * HTML structure:
   * ```html
   * <div data-cu-popover>
   *   <button data-cu-popover-trigger>Info</button>
   *   <div class="cu-popover-content" data-cu-popover-content hidden>
   *     Content here
   *   </div>
   * </div>
   * ```
   * - Add `hidden` to content initially.
   * - Sizes: default | cu-popover-content-sm (w-56) | cu-popover-content-lg (w-96)
   * - Closes on outside click or Escape key.
   * - ARIA: aria-haspopup="dialog" + aria-expanded + aria-controls auto-set.
   */
  function setupPopovers() {
    document.querySelectorAll("[data-cu-popover]").forEach(function (popover) {
      if (popover._cuInit) return;
      popover._cuInit = true;

      var trigger = popover.querySelector("[data-cu-popover-trigger]");
      var content = popover.querySelector("[data-cu-popover-content]");
      if (!trigger || !content) return;

      // ARIA setup
      if (!content.id) content.id = genId("cu-popover");
      trigger.setAttribute("aria-haspopup", "dialog");
      trigger.setAttribute("aria-expanded", "false");
      trigger.setAttribute("aria-controls", content.id);

      content.setAttribute("hidden", "");
      trigger.addEventListener("click", function () {
        content.toggleAttribute("hidden");
        trigger.setAttribute("aria-expanded", String(!content.hasAttribute("hidden")));
      });
      _popovers.push({ el: popover, trigger: trigger, content: content });
    });
  }

  /**
   * Menubar — top-level application menu bar with sub-menus.
   *
   * HTML structure:
   * ```html
   * <div class="cu-menubar" data-cu-menubar>
   *   <div class="cu-menubar-menu" data-cu-menubar-menu>
   *     <button class="cu-menubar-trigger" data-cu-menubar-trigger>File</button>
   *     <div class="cu-menubar-content" data-cu-menubar-content hidden>
   *       <button class="cu-menubar-item">New</button>
   *       <div class="cu-menubar-separator"></div>
   *       <button class="cu-menubar-item">
   *         Save <span class="cu-menubar-shortcut">⌘S</span>
   *       </button>
   *     </div>
   *   </div>
   *   <!-- More data-cu-menubar-menu elements... -->
   * </div>
   * ```
   * - Add `hidden` to each content element initially.
   * - Hovering another trigger while one menu is open auto-switches.
   * - Closes on outside click or Escape key.
   */
  function setupMenubars() {
    document.querySelectorAll("[data-cu-menubar]").forEach(function (bar) {
      if (bar._cuInit) return;
      bar._cuInit = true;

      var menus = bar.querySelectorAll("[data-cu-menubar-menu]");
      menus.forEach(function (menu) {
        var trigger = menu.querySelector("[data-cu-menubar-trigger]");
        var content = menu.querySelector("[data-cu-menubar-content]");

        if (trigger) {
          trigger.addEventListener("click", function () {
            var open = content && !content.hasAttribute("hidden");
            // Close all menus in this bar
            menus.forEach(function (m) {
              var mc = m.querySelector("[data-cu-menubar-content]");
              var mt = m.querySelector("[data-cu-menubar-trigger]");
              if (mc) mc.setAttribute("hidden", "");
              if (mt) mt.setAttribute("aria-expanded", "false");
            });
            if (!open && content) {
              content.removeAttribute("hidden");
              trigger.setAttribute("aria-expanded", "true");
            }
          });

          // Hover to switch while one is open
          trigger.addEventListener("mouseenter", function () {
            var anyOpen = bar.querySelector(
              "[data-cu-menubar-content]:not([hidden])"
            );
            if (anyOpen && anyOpen !== content) {
              menus.forEach(function (m) {
                var mc = m.querySelector("[data-cu-menubar-content]");
                var mt = m.querySelector("[data-cu-menubar-trigger]");
                if (mc) mc.setAttribute("hidden", "");
                if (mt) mt.setAttribute("aria-expanded", "false");
              });
              if (content) {
                content.removeAttribute("hidden");
                trigger.setAttribute("aria-expanded", "true");
              }
            }
          });
        }
      });

      _menubars.push({ el: bar, menus: menus });
    });
  }

  function init() {
    setupDocumentListeners();
    setupTabs();
    setupDropdowns();
    setupComboboxes();
    setupMultiSelects();
    setupNumberInputs();
    setupDropzones();
    setupTransferLists();
    setupDialogs();
    setupDrawers();
    setupAlertDialogs();
    setupToasts();
    setupPopovers();
    setupMenubars();
    setupMobileNav();
  }

  function destroy() {
    _dropdowns = [];
    _comboboxes = [];
    _multiSelects = [];
    _popovers = [];
    _menubars = [];
    _tabs = [];
    _numberInputs = [];
    _dropzones = [];
    _transferLists = [];
    _mobileNavs = [];
  }

  function refresh() {
    var inBody = function (o) { return document.body.contains(o.el); };
    _dropdowns = _dropdowns.filter(inBody);
    _comboboxes = _comboboxes.filter(inBody);
    _multiSelects = _multiSelects.filter(inBody);
    _popovers = _popovers.filter(inBody);
    _menubars = _menubars.filter(inBody);
    _tabs = _tabs.filter(inBody);
    _numberInputs = _numberInputs.filter(inBody);
    _dropzones = _dropzones.filter(inBody);
    _transferLists = _transferLists.filter(inBody);
    _mobileNavs = _mobileNavs.filter(inBody);
    init();
  }

  // Auto-init
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  }

  return { init: init, destroy: destroy, refresh: refresh };
});
