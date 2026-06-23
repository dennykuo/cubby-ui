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
  var _tagInputs = [];
  var _sortableLists = [];
  var _toggleGroups = [];
  var _ratings = [];
  var _countdowns = [];
  var _imageCompares = [];
  var _speedDials = [];
  var _backToTops = [];
  var _kanbans = [];
  var _tours = [];
  var _inputClearables = [];
  var _alertExpandables = [];
  var _dataTableExpandables = [];
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
      _speedDials.forEach(function (sd) {
        if (!sd.el.contains(e.target) && sd.actions && sd.actions.hasAttribute("data-cu-open")) {
          sd.actions.removeAttribute("data-cu-open");
          if (sd.trigger) sd.trigger.setAttribute("aria-expanded", "false");
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
        _speedDials.forEach(function (sd) {
          if (sd.actions && sd.actions.hasAttribute("data-cu-open")) {
            sd.actions.removeAttribute("data-cu-open");
            if (sd.trigger) sd.trigger.setAttribute("aria-expanded", "false");
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

        trigger.addEventListener("click", function (e) {
          // Ignore clicks on the close button
          if (e.target.closest("[data-cu-tabs-close]")) return;
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

      // Closable tabs: handle close button clicks
      tabs.querySelectorAll("[data-cu-tabs-close]").forEach(function (closeBtn) {
        closeBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          var trigger = closeBtn.closest("[data-cu-tabs-trigger]");
          if (!trigger) return;
          var value = trigger.getAttribute("data-cu-tabs-trigger");
          var wasActive = trigger.classList.contains("cu-tabs-trigger-active");

          // Remove trigger and corresponding content
          trigger.remove();
          contents.forEach(function (c) {
            if (c.getAttribute("data-cu-tabs-content") === value) c.remove();
          });

          // If closed tab was active, activate first remaining trigger
          if (wasActive) {
            var remaining = tabs.querySelectorAll("[data-cu-tabs-trigger]");
            if (remaining.length > 0) remaining[0].click();
          }

          tabs.dispatchEvent(new CustomEvent("cu:tabs:close", { detail: { value: value } }));
        });
      });

      _tabs.push({ el: tabs });
    });

    // Scrollable tabs
    document.querySelectorAll("[data-cu-tabs-scrollable]").forEach(function (wrapper) {
      if (wrapper._cuInit) return;
      wrapper._cuInit = true;

      var list = wrapper.querySelector(".cu-tabs-list");
      var btnStart = wrapper.querySelector("[data-cu-tabs-scroll-start]");
      var btnEnd = wrapper.querySelector("[data-cu-tabs-scroll-end]");
      if (!list) return;

      function updateArrows() {
        if (btnStart) btnStart.hidden = list.scrollLeft <= 0;
        if (btnEnd) btnEnd.hidden = list.scrollLeft + list.clientWidth >= list.scrollWidth - 1;
      }

      if (btnStart) btnStart.addEventListener("click", function () {
        list.scrollBy({ left: -200, behavior: "smooth" });
      });
      if (btnEnd) btnEnd.addEventListener("click", function () {
        list.scrollBy({ left: 200, behavior: "smooth" });
      });

      list.addEventListener("scroll", updateArrows);
      if (typeof ResizeObserver !== "undefined") {
        new ResizeObserver(updateArrows).observe(list);
      }
      updateArrows();
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
        // Drop the FOUC-guard `hidden` attribute (UA-hidden until CSS loads) so
        // the panel re-enters the a11y tree; the closed state is governed by the
        // CSS display:none from here on.
        panel.removeAttribute("hidden");
        backdrop.removeAttribute("hidden");
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

  function ensureToastContainer() {
    var container = document.querySelector("[data-cu-toast-container]");
    if (!container) {
      container = document.createElement("div");
      container.className = "cu-toast-container cu-toast-container-bottom-right";
      container.setAttribute("data-cu-toast-container", "");
      container.setAttribute("role", "region");
      container.setAttribute("aria-label", "Notifications");
      document.body.appendChild(container);
    }
    return container;
  }

  function createToastEl(opts) {
    var title = opts.title || "";
    var desc = opts.description || "";
    var variant = opts.variant || "default";

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

    var svgNS = "http://www.w3.org/2000/svg";
    var closeBtn = document.createElement("button");
    closeBtn.className = "cu-toast-close";
    closeBtn.setAttribute("data-cu-toast-close", "");
    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "14");
    svg.setAttribute("height", "14");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    var p1 = document.createElementNS(svgNS, "path");
    p1.setAttribute("d", "M18 6 6 18");
    var p2 = document.createElementNS(svgNS, "path");
    p2.setAttribute("d", "m6 6 12 12");
    svg.appendChild(p1);
    svg.appendChild(p2);
    closeBtn.appendChild(svg);
    toast.appendChild(closeBtn);

    return { toast: toast, body: body, titleEl: titleEl, closeBtn: closeBtn };
  }

  /** Programmatic toast API */
  var toastAPI = {
    show: function (opts) {
      var c = ensureToastContainer();
      var result = createToastEl(opts);
      c.appendChild(result.toast);

      var maxToasts = parseInt(c.getAttribute("data-cu-toast-max"), 10) || 5;
      var existing = c.querySelectorAll(".cu-toast:not(.cu-toast-exit)");
      if (existing.length > maxToasts) {
        for (var ti = 0; ti < existing.length - maxToasts; ti++) {
          dismissToast(existing[ti]);
        }
      }

      var duration = (opts.duration !== undefined) ? opts.duration : 5000;
      var timer;
      if (duration > 0) {
        timer = setTimeout(function () { dismissToast(result.toast); }, duration);
      }
      result.closeBtn.addEventListener("click", function () {
        if (timer) clearTimeout(timer);
        dismissToast(result.toast);
      });

      return result.toast;
    },
    promise: function (promise, opts) {
      var loadingOpts = typeof opts.loading === "string" ? { title: opts.loading } : opts.loading;
      loadingOpts.duration = 0;
      loadingOpts.variant = loadingOpts.variant || "default";
      var el = toastAPI.show(loadingOpts);

      return promise.then(function (result) {
        var successOpts = typeof opts.success === "function" ? opts.success(result) : opts.success;
        successOpts = typeof successOpts === "string" ? { title: successOpts } : successOpts;
        var variant = successOpts.variant || "success";
        // Update existing toast
        el.className = "cu-toast cu-toast-" + variant + " cu-toast-enter";
        var titleEl = el.querySelector(".cu-toast-title");
        if (titleEl) titleEl.textContent = successOpts.title || "";
        var descEl = el.querySelector(".cu-toast-description");
        if (successOpts.description) {
          if (!descEl) {
            descEl = document.createElement("div");
            descEl.className = "cu-toast-description";
            el.querySelector(".cu-toast-body").appendChild(descEl);
          }
          descEl.textContent = successOpts.description;
        } else if (descEl) {
          descEl.remove();
        }
        setTimeout(function () { dismissToast(el); }, successOpts.duration || 5000);
        return result;
      }).catch(function (err) {
        var errorOpts = typeof opts.error === "function" ? opts.error(err) : opts.error;
        errorOpts = typeof errorOpts === "string" ? { title: errorOpts } : errorOpts;
        var variant = errorOpts.variant || "destructive";
        el.className = "cu-toast cu-toast-" + variant + " cu-toast-enter";
        var titleEl = el.querySelector(".cu-toast-title");
        if (titleEl) titleEl.textContent = errorOpts.title || "";
        var descEl = el.querySelector(".cu-toast-description");
        if (errorOpts.description) {
          if (!descEl) {
            descEl = document.createElement("div");
            descEl.className = "cu-toast-description";
            el.querySelector(".cu-toast-body").appendChild(descEl);
          }
          descEl.textContent = errorOpts.description;
        } else if (descEl) {
          descEl.remove();
        }
        setTimeout(function () { dismissToast(el); }, errorOpts.duration || 5000);
        throw err;
      });
    }
  };

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
    ensureToastContainer();

    document
      .querySelectorAll("[data-cu-toast-trigger]")
      .forEach(function (trigger) {
        if (trigger._cuInit) return;
        trigger._cuInit = true;

        trigger.addEventListener("click", function () {
          var title = trigger.getAttribute("data-cu-toast-title") || "";
          var desc = trigger.getAttribute("data-cu-toast-description") || "";
          var variant = trigger.getAttribute("data-cu-toast-variant") || "default";
          var duration = parseInt(trigger.getAttribute("data-cu-toast-duration"), 10) || 5000;
          toastAPI.show({ title: title, description: desc, variant: variant, duration: duration });
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

  // ── Password Input ──────────────────────────────────────────────
  function setupPasswordInputs() {
    document.querySelectorAll("[data-cu-password-input]").forEach(function (container) {
      if (container._cuInit) return;
      container._cuInit = true;

      var field = container.querySelector(".cu-password-input-field");
      var toggle = container.querySelector("[data-cu-password-toggle]");
      var iconShow = container.querySelector("[data-cu-password-icon-show]");
      var iconHide = container.querySelector("[data-cu-password-icon-hide]");
      if (!field || !toggle) return;

      toggle.addEventListener("click", function () {
        var isPassword = field.type === "password";
        field.type = isPassword ? "text" : "password";
        if (iconShow) iconShow.style.display = isPassword ? "none" : "";
        if (iconHide) iconHide.style.display = isPassword ? "" : "none";
      });
    });
  }

  // ── Segmented Control ─────────────────────────────────────────
  function setupSegmentedControls() {
    document.querySelectorAll("[data-cu-segmented]").forEach(function (control) {
      if (control._cuInit) return;
      control._cuInit = true;

      var inputs = control.querySelectorAll(".cu-segmented-input");

      if (inputs.length) {
        // Radio input mode
        function updateActive() {
          inputs.forEach(function (input) {
            var label = input.nextElementSibling;
            if (label && label.classList.contains("cu-segmented-item")) {
              label.classList.toggle("cu-segmented-item-active", input.checked);
            }
          });
        }

        inputs.forEach(function (input) {
          input.addEventListener("change", updateActive);
        });

        updateActive();
      } else {
        // Button mode
        var buttons = control.querySelectorAll(".cu-segmented-item");
        buttons.forEach(function (btn) {
          btn.addEventListener("click", function () {
            buttons.forEach(function (b) {
              b.classList.remove("cu-segmented-item-active");
            });
            btn.classList.add("cu-segmented-item-active");
          });
        });
      }
    });
  }

  // ── Pin Input ─────────────────────────────────────────────────
  function setupPinInputs() {
    document.querySelectorAll("[data-cu-pin-input]").forEach(function (container) {
      if (container._cuInit) return;
      container._cuInit = true;

      var fields = container.querySelectorAll(".cu-pin-input-field");
      var isNumeric = container.getAttribute("data-cu-pin-input-type") === "numeric";

      fields.forEach(function (field, index) {
        field.addEventListener("input", function () {
          var value = field.value;
          if (isNumeric) value = value.replace(/[^0-9]/g, "");
          field.value = value.slice(0, 1);
          if (field.value && index < fields.length - 1) {
            fields[index + 1].focus();
          }
        });

        field.addEventListener("keydown", function (e) {
          if (e.key === "Backspace" && !field.value && index > 0) {
            fields[index - 1].focus();
          }
        });

        field.addEventListener("paste", function (e) {
          e.preventDefault();
          var paste = (e.clipboardData || window.clipboardData).getData("text");
          if (isNumeric) paste = paste.replace(/[^0-9]/g, "");
          for (var i = 0; i < fields.length; i++) {
            fields[i].value = paste[i] || "";
          }
          var lastFilled = Math.min(paste.length, fields.length) - 1;
          if (lastFilled >= 0) {
            fields[Math.min(lastFilled + 1, fields.length - 1)].focus();
          }
        });
      });
    });
  }

  // ── Checkbox Group ────────────────────────────────────────────
  function setupCheckboxGroups() {
    document.querySelectorAll("[data-cu-checkbox-group]").forEach(function (group) {
      if (group._cuInit) return;
      group._cuInit = true;

      var selectAll = group.querySelector("[data-cu-checkbox-group-selectall]");
      if (!selectAll) return;

      var items = group.querySelectorAll("[data-cu-checkbox-group-item]");

      function updateSelectAll() {
        var total = items.length;
        var checked = 0;
        items.forEach(function (cb) { if (cb.checked) checked++; });
        selectAll.checked = checked === total;
        selectAll.indeterminate = checked > 0 && checked < total;
      }

      selectAll.addEventListener("change", function () {
        var state = selectAll.checked;
        items.forEach(function (cb) { if (!cb.disabled) cb.checked = state; });
      });

      items.forEach(function (cb) {
        cb.addEventListener("change", updateSelectAll);
      });

      updateSelectAll();
    });
  }

  // ── Code Block ────────────────────────────────────────────────
  function setupCodeBlocks() {
    document.querySelectorAll("[data-cu-code-block]").forEach(function (block) {
      if (block._cuInit) return;
      block._cuInit = true;

      var btn = block.querySelector("[data-cu-code-block-copy]");
      if (!btn) return;

      btn.addEventListener("click", function () {
        var pre = block.querySelector(".cu-code-block-pre");
        if (!pre) return;

        var text = pre.textContent || "";
        navigator.clipboard.writeText(text).then(function () {
          var label = btn.querySelector("[data-cu-code-block-label]");
          btn.setAttribute("data-cu-copied", "");
          if (label) label.textContent = "Copied!";

          setTimeout(function () {
            btn.removeAttribute("data-cu-copied");
            if (label) label.textContent = "Copy";
          }, 2000);
        });
      });
    });
  }

  // ── Carousel ──────────────────────────────────────────────────
  function setupCarousels() {
    document.querySelectorAll("[data-cu-carousel]").forEach(function (carousel) {
      if (carousel._cuInit) return;
      carousel._cuInit = true;

      var viewport = carousel.querySelector("[data-cu-carousel-viewport]");
      var prevBtn = carousel.querySelector("[data-cu-carousel-prev]");
      var nextBtn = carousel.querySelector("[data-cu-carousel-next]");
      var dots = carousel.querySelectorAll("[data-cu-carousel-dot]");
      if (!viewport) return;

      var slides = viewport.querySelectorAll("[data-cu-carousel-slide]");
      if (!slides.length) return;

      function getSlideWidth() { return slides[0].offsetWidth; }

      function getCurrentIndex() {
        return Math.round(viewport.scrollLeft / getSlideWidth());
      }

      function updateState() {
        var index = getCurrentIndex();
        var visibleSlides = Math.round(viewport.offsetWidth / getSlideWidth());
        var maxScrollIndex = Math.max(0, slides.length - visibleSlides);

        if (prevBtn) prevBtn.disabled = index <= 0;
        if (nextBtn) nextBtn.disabled = index >= maxScrollIndex;

        dots.forEach(function (dot, i) {
          dot.classList.toggle("cu-carousel-dot-active", i === index);
        });
      }

      function scrollToIndex(index) {
        viewport.scrollTo({ left: index * getSlideWidth(), behavior: "smooth" });
      }

      if (prevBtn) {
        prevBtn.addEventListener("click", function () {
          var index = getCurrentIndex();
          if (index > 0) scrollToIndex(index - 1);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener("click", function () {
          var index = getCurrentIndex();
          var visibleSlides = Math.round(viewport.offsetWidth / getSlideWidth());
          var maxScrollIndex = Math.max(0, slides.length - visibleSlides);
          if (index < maxScrollIndex) scrollToIndex(index + 1);
        });
      }

      dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () { scrollToIndex(i); });
      });

      var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) {
        var origScrollTo = viewport.scrollTo.bind(viewport);
        viewport.scrollTo = function (opts) {
          origScrollTo({ left: opts.left, behavior: "auto" });
        };
      }

      viewport.addEventListener("scroll", updateState);
      updateState();
    });
  }

  // ── Context Menu ──────────────────────────────────────────────
  function setupContextMenus() {
    document.querySelectorAll("[data-cu-context-menu]").forEach(function (container) {
      if (container._cuInit) return;
      container._cuInit = true;

      var content = container.querySelector("[data-cu-context-menu-content]");
      if (!content) return;

      container.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        document.querySelectorAll("[data-cu-context-menu-content]").forEach(function (c) {
          if (c !== content) c.setAttribute("hidden", "");
        });
        content.removeAttribute("hidden");
        var x = e.clientX;
        var y = e.clientY;
        var rect = content.getBoundingClientRect();
        var vw = window.innerWidth;
        var vh = window.innerHeight;
        if (x + rect.width > vw) x = vw - rect.width - 4;
        if (y + rect.height > vh) y = vh - rect.height - 4;
        if (x < 0) x = 4;
        if (y < 0) y = 4;
        content.style.left = x + "px";
        content.style.top = y + "px";
      });

      document.addEventListener("click", function () { content.setAttribute("hidden", ""); });
      document.addEventListener("contextmenu", function (e) {
        if (!container.contains(e.target)) content.setAttribute("hidden", "");
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") content.setAttribute("hidden", "");
      });
      document.addEventListener("scroll", function () { content.setAttribute("hidden", ""); });
    });
  }

  // ── Resizable Panels ─────────────────────────────────────────
  function setupResizables() {
    document.querySelectorAll("[data-cu-resizable]").forEach(function (container) {
      if (container._cuResizableInit) return;
      container._cuResizableInit = true;

      var panels = Array.from(container.querySelectorAll(":scope > [data-cu-resizable-panel]"));
      var handles = Array.from(container.querySelectorAll(":scope > [data-cu-resizable-handle]"));
      var isVertical = container.classList.contains("cu-resizable-vertical");

      if (panels.length < 2 || handles.length < 1) return;

      var defaultSize = 100 / panels.length;
      panels.forEach(function (panel) {
        if (!panel.style.flexGrow || panel.style.flexGrow === "0") {
          panel.style.flexGrow = String(defaultSize);
        }
      });

      function applyConstraints(panel, value, total) {
        var minSize = parseFloat(panel.dataset.cuMinSize);
        var maxSize = parseFloat(panel.dataset.cuMaxSize);
        if (!isNaN(minSize)) { var minGrow = (minSize / 100) * total; if (value < minGrow) value = minGrow; }
        if (!isNaN(maxSize)) { var maxGrow = (maxSize / 100) * total; if (value > maxGrow) value = maxGrow; }
        if (value < 0) value = 0;
        return value;
      }

      function startResize(startX, startY, handle, handleIndex) {
        var prevPanel = panels[handleIndex];
        var nextPanel = panels[handleIndex + 1];
        if (!prevPanel || !nextPanel) return;

        var containerRect = container.getBoundingClientRect();
        var containerSize = isVertical ? containerRect.height : containerRect.width;
        var totalHandleSize = 0;
        handles.forEach(function (h) { totalHandleSize += isVertical ? h.offsetHeight : h.offsetWidth; });
        var availableSize = containerSize - totalHandleSize;
        if (availableSize <= 0) return;

        var startPos = isVertical ? startY : startX;
        var prevGrow = parseFloat(prevPanel.style.flexGrow) || defaultSize;
        var nextGrow = parseFloat(nextPanel.style.flexGrow) || defaultSize;
        var totalGrow = prevGrow + nextGrow;
        var allGrow = 0;
        panels.forEach(function (p) { allGrow += parseFloat(p.style.flexGrow) || defaultSize; });

        handle.setAttribute("data-cu-resizing", "");
        document.body.style.cursor = isVertical ? "row-resize" : "col-resize";
        document.body.style.userSelect = "none";
        document.body.style.webkitUserSelect = "none";

        function onMove(clientX, clientY) {
          var currentPos = isVertical ? clientY : clientX;
          var delta = currentPos - startPos;
          var deltaGrow = (delta / availableSize) * allGrow;
          var newPrevGrow = applyConstraints(prevPanel, prevGrow + deltaGrow, totalGrow);
          var newNextGrow = totalGrow - newPrevGrow;
          newNextGrow = applyConstraints(nextPanel, newNextGrow, totalGrow);
          newPrevGrow = totalGrow - newNextGrow;
          prevPanel.style.flexGrow = String(newPrevGrow);
          nextPanel.style.flexGrow = String(newNextGrow);
        }

        function onMouseMove(e) { onMove(e.clientX, e.clientY); }
        function onTouchMove(e) { if (e.touches.length === 1) onMove(e.touches[0].clientX, e.touches[0].clientY); }
        function onEnd() {
          handle.removeAttribute("data-cu-resizing");
          document.body.style.cursor = "";
          document.body.style.userSelect = "";
          document.body.style.webkitUserSelect = "";
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onEnd);
          document.removeEventListener("touchmove", onTouchMove);
          document.removeEventListener("touchend", onEnd);
        }

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onEnd);
        document.addEventListener("touchmove", onTouchMove, { passive: false });
        document.addEventListener("touchend", onEnd);
      }

      handles.forEach(function (handle, i) {
        handle.addEventListener("mousedown", function (e) { e.preventDefault(); startResize(e.clientX, e.clientY, handle, i); });
        handle.addEventListener("touchstart", function (e) {
          if (e.touches.length !== 1) return;
          e.preventDefault();
          startResize(e.touches[0].clientX, e.touches[0].clientY, handle, i);
        }, { passive: false });

        handle.addEventListener("keydown", function (e) {
          var step = 5;
          var delta = 0;
          if (!isVertical && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
            delta = e.key === "ArrowLeft" ? -step : step;
          } else if (isVertical && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
            delta = e.key === "ArrowUp" ? -step : step;
          }
          if (delta === 0) return;
          e.preventDefault();
          var prevPanel = panels[i];
          var nextPanel = panels[i + 1];
          if (!prevPanel || !nextPanel) return;
          var prevGrow = parseFloat(prevPanel.style.flexGrow) || defaultSize;
          var nextGrow = parseFloat(nextPanel.style.flexGrow) || defaultSize;
          var total = prevGrow + nextGrow;
          var newPrev = applyConstraints(prevPanel, prevGrow + delta, total);
          var newNext = total - newPrev;
          newNext = applyConstraints(nextPanel, newNext, total);
          newPrev = total - newNext;
          prevPanel.style.flexGrow = String(newPrev);
          nextPanel.style.flexGrow = String(newNext);
        });
      });
    });
  }

  // ── Command Palette ───────────────────────────────────────────
  function setupCommandPalettes() {
    if (!document._cuCommandPaletteGlobal) {
      document._cuCommandPaletteGlobal = true;
      document.addEventListener("keydown", function (e) {
        if ((e.metaKey || e.ctrlKey) && e.key === "k") {
          var palette = document.querySelector("[data-cu-command]");
          if (!palette) return;
          e.preventDefault();
          if (palette.open) { palette.close(); } else {
            palette.showModal();
            var input = palette.querySelector("[data-cu-command-input]");
            if (input) input.focus();
          }
        }
      });
    }

    document.querySelectorAll("[data-cu-command]").forEach(function (palette) {
      if (palette._cuInit) return;
      palette._cuInit = true;

      var input = palette.querySelector("[data-cu-command-input]");
      var list = palette.querySelector("[data-cu-command-list]");
      var empty = palette.querySelector("[data-cu-command-empty]");
      var items = list ? Array.from(list.querySelectorAll("[data-cu-command-item]")) : [];

      palette.addEventListener("click", function (e) { if (e.target === palette) palette.close(); });

      if (input) {
        input.addEventListener("input", function () {
          var query = input.value.toLowerCase().trim();
          var visibleCount = 0;
          var groups = list ? Array.from(list.querySelectorAll("[data-cu-command-group]")) : [];

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
            separators.forEach(function (sep) {
              var prev = sep.previousElementSibling;
              var next = sep.nextElementSibling;
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
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          var visible = getVisibleItems();
          if (visible.length === 0) return;
          var activeIndex = -1;
          visible.forEach(function (item, i) { if (item.hasAttribute("data-cu-command-active")) activeIndex = i; });
          clearActive();
          var nextIndex;
          if (e.key === "ArrowDown") { nextIndex = activeIndex < visible.length - 1 ? activeIndex + 1 : 0; }
          else { nextIndex = activeIndex > 0 ? activeIndex - 1 : visible.length - 1; }
          visible[nextIndex].setAttribute("data-cu-command-active", "");
          visible[nextIndex].scrollIntoView({ block: "nearest" });
        }
        if (e.key === "Enter") {
          var active = list ? list.querySelector("[data-cu-command-item][data-cu-command-active]") : null;
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
        var palette = document.getElementById(id);
        if (palette && palette.showModal) {
          palette.showModal();
          var input = palette.querySelector("[data-cu-command-input]");
          if (input) input.focus();
        }
      });
    });
  }

  // ── Date Picker / Calendar helpers ────────────────────────────
  function toISODate(date) {
    var y = date.getFullYear();
    var m = String(date.getMonth() + 1).padStart(2, "0");
    var d = String(date.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + d;
  }

  function formatDate(date) {
    var y = date.getFullYear();
    var m = String(date.getMonth() + 1).padStart(2, "0");
    var d = String(date.getDate()).padStart(2, "0");
    return y + "/" + m + "/" + d;
  }

  function initCalendar(calendar, onSelect) {
    var header = calendar.querySelector("[data-cu-calendar-title]");
    var prevBtn = calendar.querySelector("[data-cu-calendar-prev]");
    var nextBtn = calendar.querySelector("[data-cu-calendar-next]");
    var grid = calendar.querySelector("[data-cu-calendar-grid]");
    if (!header || !grid) return;

    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var currentMonth = today.getMonth();
    var currentYear = today.getFullYear();

    if (calendar._cuSelectedDate) {
      currentMonth = calendar._cuSelectedDate.getMonth();
      currentYear = calendar._cuSelectedDate.getFullYear();
    }

    var selectedDate = calendar._cuSelectedDate || null;
    var minDate = null;
    var maxDate = null;
    var minAttr = calendar.getAttribute("data-cu-calendar-min");
    var maxAttr = calendar.getAttribute("data-cu-calendar-max");
    if (minAttr) { var mp = minAttr.split("-"); minDate = new Date(parseInt(mp[0]), parseInt(mp[1]) - 1, parseInt(mp[2])); minDate.setHours(0, 0, 0, 0); }
    if (maxAttr) { var xp = maxAttr.split("-"); maxDate = new Date(parseInt(xp[0]), parseInt(xp[1]) - 1, parseInt(xp[2])); maxDate.setHours(0, 0, 0, 0); }

    function render() {
      var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      header.textContent = monthNames[currentMonth] + " " + currentYear;

      if (prevBtn) {
        if (minDate) { var prevMonth = new Date(currentYear, currentMonth, 0); prevBtn.disabled = prevMonth < minDate; } else { prevBtn.disabled = false; }
      }
      if (nextBtn) {
        if (maxDate) { var nextMonthFirst = new Date(currentYear, currentMonth + 1, 1); nextBtn.disabled = nextMonthFirst > maxDate; } else { nextBtn.disabled = false; }
      }

      grid.innerHTML = "";
      var firstDay = new Date(currentYear, currentMonth, 1).getDay();
      var daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      var daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

      for (var p = firstDay - 1; p >= 0; p--) { grid.appendChild(createDayButton(daysInPrevMonth - p, currentMonth - 1, currentYear, true)); }
      for (var d = 1; d <= daysInMonth; d++) { grid.appendChild(createDayButton(d, currentMonth, currentYear, false)); }
      var totalCells = grid.children.length;
      var remaining = totalCells <= 35 ? 35 - totalCells : 42 - totalCells;
      for (var n = 1; n <= remaining; n++) { grid.appendChild(createDayButton(n, currentMonth + 1, currentYear, true)); }
    }

    function createDayButton(day, month, year, isOutside) {
      var date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);
      var btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = day;
      var classes = ["cu-calendar-day"];
      var isToday = date.getTime() === today.getTime();
      var isSelected = selectedDate && date.getTime() === selectedDate.getTime();
      if (isOutside) classes.push("cu-calendar-day-outside");
      if (isToday && !isSelected) classes.push("cu-calendar-day-today");
      if (isSelected) classes.push("cu-calendar-day-selected");
      var isDisabled = false;
      if (minDate && date < minDate) isDisabled = true;
      if (maxDate && date > maxDate) isDisabled = true;
      if (isDisabled) { classes.push("cu-calendar-day-disabled"); btn.disabled = true; }
      btn.className = classes.join(" ");
      if (!isDisabled) {
        btn.addEventListener("click", function () {
          selectedDate = date;
          calendar._cuSelectedDate = date;
          if (isOutside) { currentMonth = date.getMonth(); currentYear = date.getFullYear(); }
          render();
          if (onSelect) onSelect(date);
        });
      }
      return btn;
    }

    if (prevBtn) { prevBtn.addEventListener("click", function () { currentMonth--; if (currentMonth < 0) { currentMonth = 11; currentYear--; } render(); }); }
    if (nextBtn) { nextBtn.addEventListener("click", function () { currentMonth++; if (currentMonth > 11) { currentMonth = 0; currentYear++; } render(); }); }

    grid.addEventListener("keydown", function (e) {
      var focused = document.activeElement;
      if (!focused || !grid.contains(focused)) return;
      var buttons = Array.from(grid.querySelectorAll(".cu-calendar-day:not(.cu-calendar-day-disabled)"));
      var idx = buttons.indexOf(focused);
      if (idx === -1) return;
      var newIdx = idx;
      if (e.key === "ArrowRight") { e.preventDefault(); newIdx = idx + 1; }
      else if (e.key === "ArrowLeft") { e.preventDefault(); newIdx = idx - 1; }
      else if (e.key === "ArrowDown") { e.preventDefault(); newIdx = idx + 7; }
      else if (e.key === "ArrowUp") { e.preventDefault(); newIdx = idx - 7; }
      else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); focused.click(); return; }
      if (newIdx >= 0 && newIdx < buttons.length) { buttons[newIdx].focus(); }
      else if (newIdx < 0 && prevBtn && !prevBtn.disabled) {
        prevBtn.click();
        setTimeout(function () { var nb = Array.from(grid.querySelectorAll(".cu-calendar-day:not(.cu-calendar-day-disabled)")); if (nb.length) nb[nb.length - 1].focus(); }, 0);
      } else if (newIdx >= buttons.length && nextBtn && !nextBtn.disabled) {
        nextBtn.click();
        setTimeout(function () { var nb = Array.from(grid.querySelectorAll(".cu-calendar-day:not(.cu-calendar-day-disabled)")); if (nb.length) nb[0].focus(); }, 0);
      }
    });

    calendar._cuRender = render;
    render();
  }

  // ── Date Picker ───────────────────────────────────────────────
  function setupDatePickers() {
    document.querySelectorAll("[data-cu-calendar]").forEach(function (calendar) {
      if (calendar._cuInit) return;
      calendar._cuInit = true;
      initCalendar(calendar, null);
    });

    document.querySelectorAll("[data-cu-date-picker]").forEach(function (picker) {
      if (picker._cuInit) return;
      picker._cuInit = true;

      var trigger = picker.querySelector("[data-cu-date-picker-trigger]");
      var content = picker.querySelector("[data-cu-date-picker-content]");
      var calendar = picker.querySelector("[data-cu-calendar]");
      var valueEl = picker.querySelector("[data-cu-date-picker-value]");
      var hiddenInput = picker.querySelector("input[data-cu-date-picker-input]");
      if (!trigger || !content || !calendar) return;

      content.style.display = "none";
      if (calendar._cuInit) calendar._cuInit = false;

      initCalendar(calendar, function (date) {
        var formatted = formatDate(date);
        if (valueEl) { valueEl.textContent = formatted; valueEl.classList.remove("cu-date-picker-trigger-placeholder"); }
        if (hiddenInput) hiddenInput.value = toISODate(date);
        content.style.display = "none";
      });

      if (hiddenInput && hiddenInput.value) {
        var parts = hiddenInput.value.split("-");
        if (parts.length === 3) {
          var initDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
          if (!isNaN(initDate.getTime())) {
            if (valueEl) { valueEl.textContent = formatDate(initDate); valueEl.classList.remove("cu-date-picker-trigger-placeholder"); }
            calendar._cuSelectedDate = initDate;
          }
        }
      }

      trigger.addEventListener("click", function (e) {
        e.stopPropagation();
        var isHidden = content.style.display === "none";
        content.style.display = isHidden ? "" : "none";
        if (isHidden && calendar._cuRender) calendar._cuRender();
      });

      document.addEventListener("click", function (e) { if (!picker.contains(e.target)) content.style.display = "none"; });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") content.style.display = "none"; });
    });
  }

  // ── Color Picker ──────────────────────────────────────────────
  function setupColorPickers() {
    function hsvToRgb(h, s, v) {
      h = h / 360;
      var i = Math.floor(h * 6), f = h * 6 - i;
      var p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s);
      var r, g, b;
      switch (i % 6) {
        case 0: r = v; g = t; b = p; break; case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break; case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break; case 5: r = v; g = p; b = q; break;
      }
      return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    function rgbToHex(r, g, b) {
      return "#" + [r, g, b].map(function (c) { return c.toString(16).padStart(2, "0"); }).join("");
    }

    function hexToRgb(hex) {
      hex = hex.replace("#", "");
      if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
    }

    function rgbToHsv(r, g, b) {
      r /= 255; g /= 255; b /= 255;
      var max = Math.max(r, g, b), min = Math.min(r, g, b);
      var h, s, v = max, d = max - min;
      s = max === 0 ? 0 : d / max;
      if (max === min) { h = 0; } else {
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      return [h * 360, s, v];
    }

    document.querySelectorAll("[data-cu-color-picker]").forEach(function (picker) {
      if (picker._cuInit) return;
      picker._cuInit = true;

      var satPanel = picker.querySelector("[data-cu-color-picker-saturation]");
      var satPointer = picker.querySelector("[data-cu-color-picker-saturation-pointer]");
      var hueBar = picker.querySelector("[data-cu-color-picker-hue]");
      var huePointer = picker.querySelector("[data-cu-color-picker-hue-pointer]");
      var preview = picker.querySelector("[data-cu-color-picker-preview]");
      var hexInput = picker.querySelector("[data-cu-color-picker-input]");
      var hiddenInput = picker.querySelector("[data-cu-color-picker-hidden]");
      var swatches = picker.querySelectorAll("[data-cu-color-picker-swatch]");
      if (!satPanel || !hueBar) return;

      var state = { h: 0, s: 1, v: 1 };
      var initValue = (hiddenInput && hiddenInput.value) || picker.dataset.cuColorPickerValue || "#ff0000";
      if (/^#[0-9a-fA-F]{3,6}$/.test(initValue)) {
        var rgb = hexToRgb(initValue);
        var hsv = rgbToHsv(rgb[0], rgb[1], rgb[2]);
        state.h = hsv[0]; state.s = hsv[1]; state.v = hsv[2];
      }

      function update() {
        var rgb = hsvToRgb(state.h, state.s, state.v);
        var hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
        var pureRgb = hsvToRgb(state.h, 1, 1);
        satPanel.style.backgroundColor = rgbToHex(pureRgb[0], pureRgb[1], pureRgb[2]);
        if (satPointer) { satPointer.style.left = (state.s * 100) + "%"; satPointer.style.top = ((1 - state.v) * 100) + "%"; }
        if (huePointer) huePointer.style.left = (state.h / 360 * 100) + "%";
        if (preview) preview.style.backgroundColor = hex;
        if (hexInput && document.activeElement !== hexInput) hexInput.value = hex;
        if (hiddenInput) hiddenInput.value = hex;
      }

      function makeDragHandler(onDrag) {
        return function (e) {
          e.preventDefault();
          var onMove = function (e2) {
            var clientX = e2.touches ? e2.touches[0].clientX : e2.clientX;
            var clientY = e2.touches ? e2.touches[0].clientY : e2.clientY;
            onDrag(clientX, clientY);
          };
          var onUp = function () {
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onUp);
            document.removeEventListener("touchmove", onMove);
            document.removeEventListener("touchend", onUp);
            document.body.style.userSelect = "";
          };
          document.body.style.userSelect = "none";
          document.addEventListener("mousemove", onMove);
          document.addEventListener("mouseup", onUp);
          document.addEventListener("touchmove", onMove, { passive: false });
          document.addEventListener("touchend", onUp);
          onMove(e);
        };
      }

      var onSatDrag = makeDragHandler(function (clientX, clientY) {
        var rect = satPanel.getBoundingClientRect();
        state.s = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        state.v = Math.max(0, Math.min(1, 1 - (clientY - rect.top) / rect.height));
        update();
      });
      satPanel.addEventListener("mousedown", onSatDrag);
      satPanel.addEventListener("touchstart", onSatDrag, { passive: false });

      var onHueDrag = makeDragHandler(function (clientX) {
        var rect = hueBar.getBoundingClientRect();
        state.h = Math.max(0, Math.min(360, (clientX - rect.left) / rect.width * 360));
        update();
      });
      hueBar.addEventListener("mousedown", onHueDrag);
      hueBar.addEventListener("touchstart", onHueDrag, { passive: false });

      if (hexInput) {
        hexInput.addEventListener("input", function () {
          var val = hexInput.value.trim();
          if (/^#[0-9a-fA-F]{6}$/.test(val)) {
            var rgb = hexToRgb(val);
            var hsv = rgbToHsv(rgb[0], rgb[1], rgb[2]);
            state.h = hsv[0]; state.s = hsv[1]; state.v = hsv[2];
            update();
          }
        });
      }

      swatches.forEach(function (swatch) {
        swatch.addEventListener("click", function () {
          var color = swatch.dataset.cuColorPickerSwatch;
          if (color && /^#[0-9a-fA-F]{3,6}$/.test(color)) {
            var rgb = hexToRgb(color);
            var hsv = rgbToHsv(rgb[0], rgb[1], rgb[2]);
            state.h = hsv[0]; state.s = hsv[1]; state.v = hsv[2];
            update();
          }
        });
      });

      update();
    });
  }

  // ───────────────────────────────────────────────
  // Toggle Group
  // ───────────────────────────────────────────────
  /**
   * Toggle Group — switchable button group (single or multiple selection).
   *
   * HTML structure:
   *   <div data-cu-toggle-group>
   *     <button class="cu-toggle-group-item cu-toggle-group-item-active">A</button>
   *     <button class="cu-toggle-group-item">B</button>
   *   </div>
   *
   * Multiple mode:
   *   <div data-cu-toggle-group data-cu-toggle-group-multiple>
   */
  function setupToggleGroups() {
    document.querySelectorAll("[data-cu-toggle-group]").forEach(function (el) {
      if (el._cuInit) return;
      el._cuInit = true;
      var isMultiple = el.hasAttribute("data-cu-toggle-group-multiple");

      el.addEventListener("click", function (e) {
        var item = e.target.closest(".cu-toggle-group-item");
        if (!item || item.disabled) return;

        if (isMultiple) {
          item.classList.toggle("cu-toggle-group-item-active");
          item.setAttribute("aria-pressed", item.classList.contains("cu-toggle-group-item-active") ? "true" : "false");
        } else {
          el.querySelectorAll(".cu-toggle-group-item").forEach(function (btn) {
            btn.classList.remove("cu-toggle-group-item-active");
            btn.setAttribute("aria-pressed", "false");
          });
          item.classList.add("cu-toggle-group-item-active");
          item.setAttribute("aria-pressed", "true");
        }

        el.dispatchEvent(new CustomEvent("cu:toggle-group:change", {
          detail: {
            value: isMultiple
              ? Array.from(el.querySelectorAll(".cu-toggle-group-item-active")).map(function (b) { return b.textContent.trim(); })
              : item.textContent.trim()
          },
          bubbles: true
        }));
      });

      _toggleGroups.push({ el: el });
    });
  }

  // ───────────────────────────────────────────────
  // Rating
  // ───────────────────────────────────────────────
  /**
   * Rating — interactive star rating.
   *
   * HTML structure:
   *   <div class="cu-rating" data-cu-rating data-cu-rating-value="0" data-cu-rating-max="5">
   *     <span class="cu-rating-item" data-cu-rating-star="1">★</span>
   *     ...
   *   </div>
   */
  function setupRatings() {
    document.querySelectorAll("[data-cu-rating]").forEach(function (el) {
      if (el._cuInit) return;
      el._cuInit = true;
      if (el.classList.contains("cu-rating-readonly") || el.classList.contains("cu-rating-disabled")) return;

      var stars = el.querySelectorAll("[data-cu-rating-star]");

      function updateStars(value) {
        stars.forEach(function (star) {
          var v = parseInt(star.getAttribute("data-cu-rating-star"), 10);
          if (v <= value) {
            star.classList.add("cu-rating-item-active");
            star.classList.remove("cu-rating-item-half");
          } else {
            star.classList.remove("cu-rating-item-active");
            star.classList.remove("cu-rating-item-half");
          }
        });
      }

      el.addEventListener("mouseover", function (e) {
        var star = e.target.closest("[data-cu-rating-star]");
        if (!star) return;
        var v = parseInt(star.getAttribute("data-cu-rating-star"), 10);
        updateStars(v);
      });

      el.addEventListener("mouseleave", function () {
        var current = parseInt(el.getAttribute("data-cu-rating-value") || "0", 10);
        updateStars(current);
      });

      el.addEventListener("click", function (e) {
        var star = e.target.closest("[data-cu-rating-star]");
        if (!star) return;
        var v = parseInt(star.getAttribute("data-cu-rating-star"), 10);
        el.setAttribute("data-cu-rating-value", v);
        updateStars(v);
        el.dispatchEvent(new CustomEvent("cu:rating:change", { detail: { value: v }, bubbles: true }));
      });

      _ratings.push({ el: el });
    });
  }

  // ───────────────────────────────────────────────
  // Tag Input
  // ───────────────────────────────────────────────
  /**
   * Tag Input — add/remove tags with keyboard.
   *
   * HTML structure:
   *   <div class="cu-tag-input" data-cu-tag-input>
   *     <span class="cu-tag-input-tag">Tag <button class="cu-tag-input-tag-remove">&times;</button></span>
   *     <input class="cu-tag-input-field" data-cu-tag-input-field placeholder="Add tag..." />
   *   </div>
   */
  function setupTagInputs() {
    document.querySelectorAll("[data-cu-tag-input]").forEach(function (el) {
      if (el._cuInit) return;
      el._cuInit = true;
      var field = el.querySelector("[data-cu-tag-input-field]");
      if (!field) return;

      var maxTags = parseInt(el.getAttribute("data-cu-tag-max") || "0", 10) || Infinity;

      function createTag(text) {
        var tag = document.createElement("span");
        tag.className = "cu-tag-input-tag";
        tag.setAttribute("data-cu-tag-value", text);
        tag.textContent = text;

        var removeBtn = document.createElement("button");
        removeBtn.className = "cu-tag-input-tag-remove";
        removeBtn.setAttribute("type", "button");
        removeBtn.setAttribute("aria-label", "Remove " + text);
        var svgNs = "http://www.w3.org/2000/svg";
        var svg = document.createElementNS(svgNs, "svg");
        svg.setAttribute("width", "10");
        svg.setAttribute("height", "10");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-width", "2.5");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");
        var line1 = document.createElementNS(svgNs, "line");
        line1.setAttribute("x1", "18"); line1.setAttribute("y1", "6");
        line1.setAttribute("x2", "6"); line1.setAttribute("y2", "18");
        var line2 = document.createElementNS(svgNs, "line");
        line2.setAttribute("x1", "6"); line2.setAttribute("y1", "6");
        line2.setAttribute("x2", "18"); line2.setAttribute("y2", "18");
        svg.appendChild(line1);
        svg.appendChild(line2);
        removeBtn.appendChild(svg);
        removeBtn.addEventListener("click", function () {
          tag.remove();
          dispatchChange();
        });
        tag.appendChild(removeBtn);
        return tag;
      }

      function getTags() {
        return Array.from(el.querySelectorAll(".cu-tag-input-tag")).map(function (t) { return t.getAttribute("data-cu-tag-value"); });
      }

      function dispatchChange() {
        el.dispatchEvent(new CustomEvent("cu:tag-input:change", { detail: { tags: getTags() }, bubbles: true }));
      }

      function addTag(text) {
        text = text.trim();
        if (!text) return;
        var tags = getTags();
        if (tags.length >= maxTags) return;
        if (tags.indexOf(text) !== -1) return; // no duplicates
        el.insertBefore(createTag(text), field);
        field.value = "";
        dispatchChange();
      }

      field.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          addTag(field.value);
        } else if (e.key === "Backspace" && !field.value) {
          var lastTag = el.querySelector(".cu-tag-input-tag:last-of-type");
          if (lastTag) {
            lastTag.remove();
            dispatchChange();
          }
        }
      });

      // Wire up existing remove buttons
      el.querySelectorAll(".cu-tag-input-tag-remove").forEach(function (btn) {
        btn.addEventListener("click", function () {
          btn.closest(".cu-tag-input-tag").remove();
          dispatchChange();
        });
      });

      // Add data-cu-tag-value to existing tags if missing
      el.querySelectorAll(".cu-tag-input-tag").forEach(function (tag) {
        if (!tag.hasAttribute("data-cu-tag-value")) {
          var removeBtn = tag.querySelector(".cu-tag-input-tag-remove");
          var text = removeBtn ? tag.textContent.replace(removeBtn.textContent, "").trim() : tag.textContent.trim();
          tag.setAttribute("data-cu-tag-value", text);
        }
      });

      _tagInputs.push({ el: el });
    });
  }

  // ───────────────────────────────────────────────
  // Sortable List
  // ───────────────────────────────────────────────
  /**
   * Sortable List — drag-and-drop reorderable list.
   *
   * HTML structure:
   *   <div class="cu-sortable-list" data-cu-sortable-list>
   *     <div class="cu-sortable-item" data-cu-sortable-item draggable="true">
   *       <span class="cu-sortable-handle" data-cu-sortable-handle>⠿</span>
   *       <div class="cu-sortable-content">Item 1</div>
   *     </div>
   *   </div>
   */
  function setupSortableLists() {
    document.querySelectorAll("[data-cu-sortable-list]").forEach(function (el) {
      if (el._cuInit) return;
      el._cuInit = true;

      var draggedItem = null;
      var placeholder = null;

      function getItems() {
        return Array.from(el.querySelectorAll("[data-cu-sortable-item]"));
      }

      el.addEventListener("dragstart", function (e) {
        var item = e.target.closest("[data-cu-sortable-item]");
        if (!item || item.classList.contains("cu-sortable-item-disabled")) {
          e.preventDefault();
          return;
        }
        draggedItem = item;
        setTimeout(function () {
          item.classList.add("cu-sortable-item-dragging");
        }, 0);
        e.dataTransfer.effectAllowed = "move";
      });

      var rafPending = false;
      el.addEventListener("dragover", function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (rafPending) return;
        rafPending = true;
        var clientY = e.clientY;
        requestAnimationFrame(function () {
          rafPending = false;
          if (!draggedItem) return;
          var afterElement = getDragAfterElement(el, clientY);
          if (!placeholder) {
            placeholder = document.createElement("div");
            placeholder.className = "cu-sortable-placeholder";
            placeholder.style.height = draggedItem.offsetHeight + "px";
          }
          if (afterElement) {
            el.insertBefore(placeholder, afterElement);
          } else {
            el.appendChild(placeholder);
          }
        });
      });

      el.addEventListener("dragend", function () {
        if (draggedItem) {
          draggedItem.classList.remove("cu-sortable-item-dragging");
          if (placeholder && placeholder.parentNode) {
            el.insertBefore(draggedItem, placeholder);
            placeholder.remove();
          }
          draggedItem = null;
          placeholder = null;

          el.dispatchEvent(new CustomEvent("cu:sortable:change", {
            detail: {
              order: getItems().map(function (item, i) {
                var content = item.querySelector(".cu-sortable-content");
                return { index: i, text: content ? content.textContent.trim() : "" };
              })
            },
            bubbles: true
          }));
        }
      });

      el.addEventListener("drop", function (e) {
        e.preventDefault();
      });

      function getDragAfterElement(container, y) {
        var items = Array.from(container.querySelectorAll("[data-cu-sortable-item]:not(.cu-sortable-item-dragging)"));
        return items.reduce(function (closest, child) {
          var box = child.getBoundingClientRect();
          var offset = y - box.top - box.height / 2;
          if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
          }
          return closest;
        }, { offset: Number.NEGATIVE_INFINITY }).element;
      }

      _sortableLists.push({ el: el });
    });
  }

  // ───────────────────────────────────────────────
  // Countdown
  // ───────────────────────────────────────────────
  /**
   * Countdown — timer counting down to a target date.
   *
   * HTML structure:
   *   <div data-cu-countdown data-cu-countdown-target="2026-12-31T00:00:00">
   *     <div class="cu-countdown-segment"><span class="cu-countdown-value" data-cu-countdown-days>00</span><span class="cu-countdown-label">Days</span></div>
   *     <span class="cu-countdown-separator">:</span>
   *     <div class="cu-countdown-segment"><span class="cu-countdown-value" data-cu-countdown-hours>00</span><span class="cu-countdown-label">Hours</span></div>
   *     ...
   *   </div>
   */
  function setupCountdowns() {
    document.querySelectorAll("[data-cu-countdown]").forEach(function (el) {
      if (el._cuInit) return;
      el._cuInit = true;

      var target = el.getAttribute("data-cu-countdown-target");
      if (!target) return;
      var targetDate = new Date(target).getTime();

      var daysEl = el.querySelector("[data-cu-countdown-days]");
      var hoursEl = el.querySelector("[data-cu-countdown-hours]");
      var minutesEl = el.querySelector("[data-cu-countdown-minutes]");
      var secondsEl = el.querySelector("[data-cu-countdown-seconds]");

      function pad(n) { return n < 10 ? "0" + n : "" + n; }

      function update() {
        var now = Date.now();
        var diff = Math.max(0, targetDate - now);
        var d = Math.floor(diff / 86400000);
        var h = Math.floor((diff % 86400000) / 3600000);
        var m = Math.floor((diff % 3600000) / 60000);
        var s = Math.floor((diff % 60000) / 1000);

        if (daysEl) daysEl.textContent = pad(d);
        if (hoursEl) hoursEl.textContent = pad(h);
        if (minutesEl) minutesEl.textContent = pad(m);
        if (secondsEl) secondsEl.textContent = pad(s);

        if (diff === 0) {
          el.classList.add("cu-countdown-complete");
          el.dispatchEvent(new CustomEvent("cu:countdown:complete", { bubbles: true }));
          return;
        }
        entry.timer = setTimeout(update, 1000);
      }

      var entry = { el: el, timer: 0 };
      entry.timer = setTimeout(update, 0);
      _countdowns.push(entry);
    });
  }

  // ───────────────────────────────────────────────
  // Image Compare
  // ───────────────────────────────────────────────
  /**
   * Image Compare — before/after slider comparison.
   *
   * HTML structure:
   *   <div class="cu-image-compare" data-cu-image-compare>
   *     <img class="cu-image-compare-after" src="after.jpg" />
   *     <img class="cu-image-compare-before" src="before.jpg" />
   *     <div class="cu-image-compare-handle">
   *       <div class="cu-image-compare-handle-line"></div>
   *       <div class="cu-image-compare-handle-grip">⇔</div>
   *     </div>
   *   </div>
   */
  function setupImageCompares() {
    document.querySelectorAll("[data-cu-image-compare]").forEach(function (el) {
      if (el._cuInit) return;
      el._cuInit = true;

      var isDragging = false;
      var isVertical = el.classList.contains("cu-image-compare-vertical");

      function setPosition(percent) {
        percent = Math.max(0, Math.min(100, percent));
        el.style.setProperty("--cu-compare-position", percent + "%");
      }

      function getPercent(e) {
        var rect = el.getBoundingClientRect();
        var clientPos = e.touches ? e.touches[0] : e;
        if (isVertical) {
          return ((clientPos.clientY - rect.top) / rect.height) * 100;
        }
        return ((clientPos.clientX - rect.left) / rect.width) * 100;
      }

      el.addEventListener("mousedown", function (e) {
        isDragging = true;
        setPosition(getPercent(e));
        e.preventDefault();
      });
      el.addEventListener("touchstart", function (e) {
        isDragging = true;
        setPosition(getPercent(e));
      }, { passive: true });

      function onMouseMove(e) { if (!isDragging) return; setPosition(getPercent(e)); }
      function onTouchMove(e) { if (!isDragging) return; e.preventDefault(); setPosition(getPercent(e)); }
      function onMouseUp() { isDragging = false; }
      function onTouchEnd() { isDragging = false; }

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("touchmove", onTouchMove, { passive: false });
      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("touchend", onTouchEnd);

      setPosition(50);
      _imageCompares.push({ el: el, cleanup: function () {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("touchmove", onTouchMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.removeEventListener("touchend", onTouchEnd);
      } });
    });
  }

  // ───────────────────────────────────────────────
  // Speed Dial
  // ───────────────────────────────────────────────
  /**
   * Speed Dial — floating action button with expandable actions.
   *
   * HTML structure:
   *   <div class="cu-speed-dial cu-speed-dial-bottom-right" data-cu-speed-dial>
   *     <div class="cu-speed-dial-actions" data-cu-speed-dial-actions>
   *       <div class="cu-speed-dial-action">...</div>
   *     </div>
   *     <button class="cu-speed-dial-trigger" data-cu-speed-dial-trigger>+</button>
   *   </div>
   */
  function setupSpeedDials() {
    document.querySelectorAll("[data-cu-speed-dial]").forEach(function (el) {
      if (el._cuInit) return;
      el._cuInit = true;

      var trigger = el.querySelector("[data-cu-speed-dial-trigger]");
      var actions = el.querySelector("[data-cu-speed-dial-actions]");
      if (!trigger || !actions) return;

      trigger.addEventListener("click", function () {
        var isOpen = actions.hasAttribute("data-cu-open");
        if (isOpen) {
          actions.removeAttribute("data-cu-open");
          trigger.setAttribute("aria-expanded", "false");
        } else {
          actions.setAttribute("data-cu-open", "");
          trigger.setAttribute("aria-expanded", "true");
        }
      });

      _speedDials.push({ el: el, trigger: trigger, actions: actions });
    });
  }

  // ───────────────────────────────────────────────
  // Back to Top
  // ───────────────────────────────────────────────
  /**
   * Back to Top — scroll-to-top button that appears after scrolling.
   *
   * HTML structure:
   *   <button class="cu-back-to-top" data-cu-back-to-top data-cu-back-to-top-threshold="300">↑</button>
   */
  function setupBackToTops() {
    document.querySelectorAll("[data-cu-back-to-top]").forEach(function (el) {
      if (el._cuInit) return;
      el._cuInit = true;

      var threshold = parseInt(el.getAttribute("data-cu-back-to-top-threshold") || "300", 10);

      function onScroll() {
        if (window.scrollY > threshold) {
          el.setAttribute("data-cu-visible", "");
        } else {
          el.removeAttribute("data-cu-visible");
        }
      }

      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();

      el.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

      _backToTops.push({ el: el, cleanup: function () {
        window.removeEventListener("scroll", onScroll);
      } });
    });
  }

  // ───────────────────────────────────────────────
  // Kanban Board
  // ───────────────────────────────────────────────
  /**
   * Kanban Board — drag-and-drop cards between columns.
   *
   * HTML structure:
   *   <div class="cu-kanban" data-cu-kanban>
   *     <div class="cu-kanban-column" data-cu-kanban-column>
   *       <div class="cu-kanban-column-header">...</div>
   *       <div class="cu-kanban-column-body" data-cu-kanban-column-body>
   *         <div class="cu-kanban-card" data-cu-kanban-card draggable="true">...</div>
   *       </div>
   *     </div>
   *   </div>
   */
  function setupKanbans() {
    document.querySelectorAll("[data-cu-kanban]").forEach(function (el) {
      if (el._cuInit) return;
      el._cuInit = true;

      var draggedCard = null;

      el.addEventListener("dragstart", function (e) {
        var card = e.target.closest("[data-cu-kanban-card]");
        if (!card) return;
        draggedCard = card;
        setTimeout(function () { card.classList.add("cu-kanban-card-dragging"); }, 0);
        e.dataTransfer.effectAllowed = "move";
      });

      el.addEventListener("dragover", function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        var body = e.target.closest("[data-cu-kanban-column-body]");
        if (body && !body.classList.contains("cu-kanban-column-body-dragover")) {
          el.querySelectorAll("[data-cu-kanban-column-body]").forEach(function (b) {
            b.classList.remove("cu-kanban-column-body-dragover");
          });
          body.classList.add("cu-kanban-column-body-dragover");
        }
      });

      el.addEventListener("dragleave", function (e) {
        var body = e.target.closest("[data-cu-kanban-column-body]");
        if (body && !body.contains(e.relatedTarget)) {
          body.classList.remove("cu-kanban-column-body-dragover");
        }
      });

      el.addEventListener("drop", function (e) {
        e.preventDefault();
        var body = e.target.closest("[data-cu-kanban-column-body]");
        if (body && draggedCard) {
          body.appendChild(draggedCard);
          body.classList.remove("cu-kanban-column-body-dragover");

          // Update counts
          el.querySelectorAll("[data-cu-kanban-column]").forEach(function (col) {
            var count = col.querySelector(".cu-kanban-column-count");
            var colBody = col.querySelector("[data-cu-kanban-column-body]");
            if (count && colBody) {
              count.textContent = colBody.querySelectorAll("[data-cu-kanban-card]").length;
            }
          });

          el.dispatchEvent(new CustomEvent("cu:kanban:change", {
            detail: {
              card: draggedCard,
              column: body.closest("[data-cu-kanban-column]")
            },
            bubbles: true
          }));
        }
      });

      el.addEventListener("dragend", function () {
        if (draggedCard) {
          draggedCard.classList.remove("cu-kanban-card-dragging");
          draggedCard = null;
        }
        el.querySelectorAll("[data-cu-kanban-column-body]").forEach(function (b) {
          b.classList.remove("cu-kanban-column-body-dragover");
        });
      });

      _kanbans.push({ el: el });
    });
  }

  // ───────────────────────────────────────────────
  // Tour / Spotlight
  // ───────────────────────────────────────────────
  /**
   * Tour — multi-step guided tour with spotlight highlighting.
   *
   * HTML structure (programmatic — no static HTML needed):
   *   CubbyUI managed via data-cu-tour on a container.
   *
   * Usage:
   *   <div data-cu-tour data-cu-tour-steps='[{"target":"#btn","title":"Click here","description":"This is a button."}]'>
   *   </div>
   *
   * Step format: { target: CSS selector, title, description, placement?: top|bottom|left|right }
   */
  function setupTours() {
    document.querySelectorAll("[data-cu-tour]").forEach(function (el) {
      if (el._cuInit) return;
      el._cuInit = true;

      var stepsAttr = el.getAttribute("data-cu-tour-steps");
      if (!stepsAttr) return;
      var steps;
      try { steps = JSON.parse(stepsAttr); } catch (_) { return; }
      if (!steps.length) return;

      var currentStep = 0;
      var overlay = null;
      var tooltip = null;
      var spotlight = null;
      var currentTarget = null;

      function show(index) {
        currentStep = index;
        var step = steps[index];
        var targetEl = document.querySelector(step.target);
        if (!targetEl) return;

        currentTarget = targetEl;
        targetEl.classList.add("cu-tour-target");

        if (!overlay) {
          overlay = document.createElement("div");
          overlay.className = "cu-tour-overlay";
          overlay.style.background = "transparent";
          document.body.appendChild(overlay);

          spotlight = document.createElement("div");
          spotlight.className = "cu-tour-spotlight";
          overlay.appendChild(spotlight);

          tooltip = document.createElement("div");
          tooltip.className = "cu-tour-tooltip";
          document.body.appendChild(tooltip);
        }

        var rect = targetEl.getBoundingClientRect();
        var pad = 8;
        spotlight.style.top = (rect.top + window.scrollY - pad) + "px";
        spotlight.style.left = (rect.left + window.scrollX - pad) + "px";
        spotlight.style.width = (rect.width + pad * 2) + "px";
        spotlight.style.height = (rect.height + pad * 2) + "px";

        var placement = step.placement || "bottom";
        while (tooltip.firstChild) tooltip.removeChild(tooltip.firstChild);

        var titleEl = document.createElement("div");
        titleEl.className = "cu-tour-tooltip-title";
        titleEl.textContent = step.title || "";
        tooltip.appendChild(titleEl);

        if (step.description) {
          var descEl = document.createElement("div");
          descEl.className = "cu-tour-tooltip-description";
          descEl.textContent = step.description;
          tooltip.appendChild(descEl);
        }

        var footer = document.createElement("div");
        footer.className = "cu-tour-tooltip-footer";

        var progress = document.createElement("div");
        progress.className = "cu-tour-tooltip-progress";
        progress.textContent = (index + 1) + " / " + steps.length;
        footer.appendChild(progress);

        var actions = document.createElement("div");
        actions.className = "cu-tour-tooltip-actions";

        if (index > 0) {
          var prevBtn = document.createElement("button");
          prevBtn.className = "cu-button cu-button-ghost cu-button-sm";
          prevBtn.textContent = "Back";
          prevBtn.addEventListener("click", function () { clearTarget(); show(index - 1); });
          actions.appendChild(prevBtn);
        }

        if (index < steps.length - 1) {
          var nextBtn = document.createElement("button");
          nextBtn.className = "cu-button cu-button-default cu-button-sm";
          nextBtn.textContent = "Next";
          nextBtn.addEventListener("click", function () { clearTarget(); show(index + 1); });
          actions.appendChild(nextBtn);
        } else {
          var doneBtn = document.createElement("button");
          doneBtn.className = "cu-button cu-button-default cu-button-sm";
          doneBtn.textContent = "Done";
          doneBtn.addEventListener("click", function () { close(); });
          actions.appendChild(doneBtn);
        }

        footer.appendChild(actions);
        tooltip.appendChild(footer);

        // Position tooltip
        var tRect = tooltip.getBoundingClientRect();
        if (placement === "bottom") {
          tooltip.style.top = (rect.bottom + window.scrollY + 12) + "px";
          tooltip.style.left = (rect.left + window.scrollX + rect.width / 2 - tRect.width / 2) + "px";
        } else if (placement === "top") {
          tooltip.style.top = (rect.top + window.scrollY - tRect.height - 12) + "px";
          tooltip.style.left = (rect.left + window.scrollX + rect.width / 2 - tRect.width / 2) + "px";
        } else if (placement === "left") {
          tooltip.style.top = (rect.top + window.scrollY + rect.height / 2 - tRect.height / 2) + "px";
          tooltip.style.left = (rect.left + window.scrollX - tRect.width - 12) + "px";
        } else {
          tooltip.style.top = (rect.top + window.scrollY + rect.height / 2 - tRect.height / 2) + "px";
          tooltip.style.left = (rect.right + window.scrollX + 12) + "px";
        }
      }

      function clearTarget() {
        if (currentTarget) {
          currentTarget.classList.remove("cu-tour-target");
          currentTarget = null;
        }
      }

      function close() {
        clearTarget();
        if (overlay && overlay.parentNode) overlay.remove();
        if (tooltip && tooltip.parentNode) tooltip.remove();
        overlay = null; tooltip = null; spotlight = null;
        el.dispatchEvent(new CustomEvent("cu:tour:complete", { bubbles: true }));
      }

      // Auto-start if data-cu-tour-auto is present
      if (el.hasAttribute("data-cu-tour-auto")) {
        show(0);
      }

      // Allow programmatic start via el.dispatchEvent(new Event("cu:tour:start"))
      el.addEventListener("cu:tour:start", function () { show(0); });

      _tours.push({ el: el, close: close });
    });
  }

  // ───────────────────────────────────────────────
  // Data Table Expandable Rows
  // ───────────────────────────────────────────────
  /**
   * Data Table Expandable — toggle row expansion to show details.
   *
   * HTML structure:
   *   <tr>
   *     <td><button class="cu-data-table-expand-trigger" data-cu-expand-row aria-expanded="false"><svg>...</svg></button></td>
   *     <td>...</td>
   *   </tr>
   *   <tr hidden>
   *     <td colspan="..." class="cu-data-table-expanded-content">Details...</td>
   *   </tr>
   */
  function setupDataTableExpandables() {
    document.querySelectorAll("[data-cu-data-table-expandable]").forEach(function (el) {
      if (el._cuInit) return;
      el._cuInit = true;

      el.querySelectorAll("[data-cu-expand-row]").forEach(function (trigger) {
        trigger.addEventListener("click", function () {
          var row = trigger.closest("tr");
          if (!row) return;
          var expandedRow = row.nextElementSibling;
          if (!expandedRow) return;

          var expanded = trigger.getAttribute("aria-expanded") === "true";
          trigger.setAttribute("aria-expanded", String(!expanded));

          if (expanded) {
            expandedRow.setAttribute("hidden", "");
            row.classList.remove("cu-data-table-expanded-row");
          } else {
            expandedRow.removeAttribute("hidden");
            row.classList.add("cu-data-table-expanded-row");
          }
        });
      });

      _dataTableExpandables.push({ el: el });
    });
  }

  // ───────────────────────────────────────────────
  // Input Clearable
  // ───────────────────────────────────────────────
  /**
   * Input Clearable — shows a clear button when input has value.
   *
   * HTML structure:
   *   <div class="cu-input-icon-wrapper" data-cu-input-clearable>
   *     <input class="cu-input cu-input-clearable" placeholder="Search..." />
   *     <button type="button" class="cu-input-clear" data-cu-input-clear aria-label="Clear">
   *       <svg>...</svg>
   *     </button>
   *   </div>
   */
  function setupInputClearables() {
    document.querySelectorAll("[data-cu-input-clearable]").forEach(function (el) {
      if (el._cuInit) return;
      el._cuInit = true;

      var input = el.querySelector(".cu-input-clearable, input");
      var btn = el.querySelector("[data-cu-input-clear]");
      if (!input || !btn) return;

      function toggle() {
        if (input.value.length > 0) {
          btn.style.opacity = "0.7";
          btn.style.pointerEvents = "auto";
        } else {
          btn.style.opacity = "0";
          btn.style.pointerEvents = "none";
        }
      }

      input.addEventListener("input", toggle);
      btn.addEventListener("click", function () {
        input.value = "";
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.focus();
      });

      toggle();
      _inputClearables.push({ el: el });
    });
  }

  // ───────────────────────────────────────────────
  // Alert Expandable
  // ───────────────────────────────────────────────
  /**
   * Alert Expandable — toggle extra content in an alert.
   *
   * HTML structure:
   *   <div class="cu-alert cu-alert-info" data-cu-alert-expandable>
   *     <div>
   *       <h5 class="cu-alert-title">Title</h5>
   *       <p class="cu-alert-description">Summary</p>
   *       <button class="cu-alert-expand-trigger" data-cu-alert-expand-trigger aria-expanded="false">
   *         Show more <svg>...</svg>
   *       </button>
   *     </div>
   *     <div class="cu-alert-expandable-content" data-cu-alert-expandable-content>
   *       <div>Expanded details...</div>
   *     </div>
   *   </div>
   */
  function setupAlertExpandables() {
    document.querySelectorAll("[data-cu-alert-expandable]").forEach(function (el) {
      if (el._cuInit) return;
      el._cuInit = true;

      var trigger = el.querySelector("[data-cu-alert-expand-trigger]");
      var content = el.querySelector("[data-cu-alert-expandable-content]");
      if (!trigger || !content) return;

      trigger.addEventListener("click", function () {
        var expanded = trigger.getAttribute("aria-expanded") === "true";
        trigger.setAttribute("aria-expanded", String(!expanded));
        if (expanded) {
          content.removeAttribute("data-cu-expanded");
        } else {
          content.setAttribute("data-cu-expanded", "");
        }
      });

      _alertExpandables.push({ el: el });
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
    setupPasswordInputs();
    setupSegmentedControls();
    setupPinInputs();
    setupCheckboxGroups();
    setupCodeBlocks();
    setupCarousels();
    setupContextMenus();
    setupResizables();
    setupCommandPalettes();
    setupDatePickers();
    setupColorPickers();
    setupToggleGroups();
    setupRatings();
    setupTagInputs();
    setupSortableLists();
    setupCountdowns();
    setupImageCompares();
    setupSpeedDials();
    setupBackToTops();
    setupKanbans();
    setupTours();
    setupInputClearables();
    setupAlertExpandables();
    setupDataTableExpandables();
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
    _tagInputs = [];
    _sortableLists = [];
    _toggleGroups = [];
    _ratings = [];
    _countdowns.forEach(function (c) { clearTimeout(c.timer); });
    _countdowns = [];
    _imageCompares.forEach(function (c) { if (c.cleanup) c.cleanup(); });
    _imageCompares = [];
    _speedDials = [];
    _backToTops.forEach(function (b) { if (b.cleanup) b.cleanup(); });
    _backToTops = [];
    _kanbans = [];
    _tours.forEach(function (t) { if (t.close) t.close(); });
    _tours = [];
    _inputClearables = [];
    _alertExpandables = [];
    _dataTableExpandables = [];
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
    _tagInputs = _tagInputs.filter(inBody);
    _sortableLists = _sortableLists.filter(inBody);
    _toggleGroups = _toggleGroups.filter(inBody);
    _ratings = _ratings.filter(inBody);
    _countdowns.forEach(function (c) { if (!inBody(c)) clearTimeout(c.timer); });
    _countdowns = _countdowns.filter(inBody);
    _imageCompares.forEach(function (c) { if (!inBody(c) && c.cleanup) c.cleanup(); });
    _imageCompares = _imageCompares.filter(inBody);
    _speedDials = _speedDials.filter(inBody);
    _backToTops.forEach(function (b) { if (!inBody(b) && b.cleanup) b.cleanup(); });
    _backToTops = _backToTops.filter(inBody);
    _kanbans = _kanbans.filter(inBody);
    _tours = _tours.filter(inBody);
    _inputClearables = _inputClearables.filter(inBody);
    _alertExpandables = _alertExpandables.filter(inBody);
    _dataTableExpandables = _dataTableExpandables.filter(inBody);
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

  return { init: init, destroy: destroy, refresh: refresh, toast: toastAPI };
});
