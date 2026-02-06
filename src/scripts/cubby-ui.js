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
  var _docListenersReady = false;

  // Shared keyboard navigation helper for floating panels
  function navigateItems(items, key, highlightClass) {
    var visible = [];
    items.forEach(function (item) {
      if (!item.hasAttribute("hidden")) visible.push(item);
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
    if (key === "ArrowDown") {
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
          }
        });
        return;
      }

      // --- Arrow / Enter: navigate items in open floating panels ---
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter") {
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
          if (!c.items || c.items.length === 0) return;
          if (e.key === "Enter") {
            var active = c.content.querySelector(".cu-combobox-item-highlight");
            if (active) { active.click(); e.preventDefault(); }
            return;
          }
          e.preventDefault();
          navigateItems(c.items, e.key, "cu-combobox-item-highlight");
        });

        // Multi Select
        _multiSelects.forEach(function (ms) {
          if (!ms.content || ms.content.hasAttribute("hidden")) return;
          if (!ms.items || ms.items.length === 0) return;
          if (e.key === "Enter") {
            var active = ms.content.querySelector(".cu-multi-select-item-highlight");
            if (active) { active.click(); e.preventDefault(); }
            return;
          }
          e.preventDefault();
          navigateItems(ms.items, e.key, "cu-multi-select-item-highlight");
        });
      }
    });
  }

  function setupTabs() {
    document.querySelectorAll("[data-cu-tabs]").forEach(function (tabs) {
      if (tabs._cuInit) return;
      tabs._cuInit = true;

      var triggers = tabs.querySelectorAll("[data-cu-tabs-trigger]");
      var contents = tabs.querySelectorAll("[data-cu-tabs-content]");
      triggers.forEach(function (trigger) {
        trigger.addEventListener("click", function () {
          var value = trigger.getAttribute("data-cu-tabs-trigger");
          triggers.forEach(function (t) {
            t.classList.remove("cu-tabs-trigger-active");
          });
          trigger.classList.add("cu-tabs-trigger-active");
          contents.forEach(function (c) {
            c.hidden = c.getAttribute("data-cu-tabs-content") !== value;
          });
        });
      });
    });
  }

  function setupDropdowns() {
    document.querySelectorAll("[data-cu-dropdown]").forEach(function (dropdown) {
      if (dropdown._cuInit) return;
      dropdown._cuInit = true;

      var trigger = dropdown.querySelector("[data-cu-dropdown-trigger]");
      var content = dropdown.querySelector("[data-cu-dropdown-content]");
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

  function setupComboboxes() {
    document.querySelectorAll("[data-cu-combobox]").forEach(function (combobox) {
      if (combobox._cuInit) return;
      combobox._cuInit = true;

      var trigger = combobox.querySelector("[data-cu-combobox-trigger]");
      var content = combobox.querySelector("[data-cu-combobox-content]");
      var input = combobox.querySelector("[data-cu-combobox-input]");
      var items = combobox.querySelectorAll("[data-cu-combobox-item]");
      var empty = combobox.querySelector("[data-cu-combobox-empty]");
      var valueEl = combobox.querySelector("[data-cu-combobox-value]");

      // ARIA setup
      if (trigger) {
        trigger.setAttribute("aria-haspopup", "listbox");
        trigger.setAttribute("aria-expanded", "false");
      }
      if (content) {
        var list = content.querySelector("[data-cu-combobox-list]") || content;
        list.setAttribute("role", "listbox");
      }
      items.forEach(function (item) {
        item.setAttribute("role", "option");
        item.setAttribute("aria-selected", item.classList.contains("cu-combobox-item-active") ? "true" : "false");
      });

      trigger &&
        trigger.addEventListener("click", function (e) {
          e.stopPropagation();
          var isHidden = content && content.hasAttribute("hidden");
          content && content.toggleAttribute("hidden");
          trigger.setAttribute("aria-expanded", String(isHidden));
          if (isHidden && input) input.focus();
        });

      input &&
        input.addEventListener("input", function () {
          var query = input.value.toLowerCase();
          var visible = 0;
          items.forEach(function (item) {
            var match = (item.textContent || "").toLowerCase().includes(query);
            item.toggleAttribute("hidden", !match);
            if (match) visible++;
          });
          empty && empty.toggleAttribute("hidden", visible > 0);
        });

      items.forEach(function (item) {
        item.addEventListener("click", function () {
          if (valueEl) {
            valueEl.textContent = item.textContent;
            valueEl.classList.remove("cu-combobox-trigger-placeholder");
          }
          items.forEach(function (i) {
            i.classList.remove("cu-combobox-item-active");
            i.setAttribute("aria-selected", "false");
          });
          item.classList.add("cu-combobox-item-active");
          item.setAttribute("aria-selected", "true");
          content && content.setAttribute("hidden", "");
          if (trigger) trigger.setAttribute("aria-expanded", "false");
          if (input) {
            input.value = "";
            input.dispatchEvent(new Event("input"));
          }
        });
      });

      _comboboxes.push({ el: combobox, trigger: trigger, content: content, input: input, items: items });
    });
  }

  function setupMultiSelects() {
    document
      .querySelectorAll("[data-cu-multi-select]")
      .forEach(function (ms) {
        if (ms._cuInit) return;
        ms._cuInit = true;

        var trigger = ms.querySelector("[data-cu-multi-select-trigger]");
        var content = ms.querySelector("[data-cu-multi-select-content]");
        var input = ms.querySelector("[data-cu-multi-select-input]");
        var items = ms.querySelectorAll("[data-cu-multi-select-item]");
        var empty = ms.querySelector("[data-cu-multi-select-empty]");
        var tagsEl = ms.querySelector("[data-cu-multi-select-tags]");
        var placeholder = ms.querySelector(
          "[data-cu-multi-select-placeholder]"
        );
        var selected = new Set();

        // ARIA setup
        if (trigger) {
          trigger.setAttribute("aria-haspopup", "listbox");
          trigger.setAttribute("aria-expanded", "false");
        }
        if (content) {
          var list = content.querySelector("[data-cu-multi-select-list]") || content;
          list.setAttribute("role", "listbox");
          list.setAttribute("aria-multiselectable", "true");
        }
        items.forEach(function (item) {
          item.setAttribute("role", "option");
          item.setAttribute("aria-selected", item.classList.contains("cu-multi-select-item-active") ? "true" : "false");
        });

        // Init from preset active items
        items.forEach(function (item) {
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
              });
              tag.appendChild(removeBtn);
              tagsEl.appendChild(tag);
            });
          }
        }

        trigger &&
          trigger.addEventListener("click", function (e) {
            e.stopPropagation();
            var isHidden = content && content.hasAttribute("hidden");
            content && content.toggleAttribute("hidden");
            trigger.setAttribute("aria-expanded", String(isHidden));
            if (isHidden && input) input.focus();
          });

        if (input) {
          input.addEventListener("input", function () {
            var query = input.value.toLowerCase();
            var visible = 0;
            items.forEach(function (item) {
              var match = (item.textContent || "")
                .toLowerCase()
                .includes(query);
              item.toggleAttribute("hidden", !match);
              if (match) visible++;
            });
            empty && empty.toggleAttribute("hidden", visible > 0);
          });
        }

        items.forEach(function (item) {
          item.addEventListener("click", function (e) {
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
          });
        });

        _multiSelects.push({ el: ms, trigger: trigger, content: content, input: input, items: items });
      });
  }

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

        decrement &&
          decrement.addEventListener("click", function () {
            var step = Number(field.step) || 1;
            var min = field.min !== "" ? Number(field.min) : -Infinity;
            var current = Number(field.value) || 0;
            var next = current - step;
            if (next >= min) {
              field.value = next;
              field.dispatchEvent(new Event("input", { bubbles: true }));
            }
          });

        increment &&
          increment.addEventListener("click", function () {
            var step = Number(field.step) || 1;
            var max = field.max !== "" ? Number(field.max) : Infinity;
            var current = Number(field.value) || 0;
            var next = current + step;
            if (next <= max) {
              field.value = next;
              field.dispatchEvent(new Event("input", { bubbles: true }));
            }
          });
      });
  }

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
    });
  }

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
          if (dialog && dialog.showModal) dialog.showModal();
        });
      });

    document
      .querySelectorAll("[" + config.dialogAttr + "]")
      .forEach(function (dialog) {
        if (dialog._cuInit) return;
        dialog._cuInit = true;

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
      });
  }

  function setupDialogs() {
    setupOverlay({
      triggerAttr: "data-cu-dialog-trigger",
      dialogAttr: "data-cu-dialog",
      closeAttrs: ["data-cu-dialog-close"],
      closeOnBackdrop: true,
    });
  }

  function setupDrawers() {
    setupOverlay({
      triggerAttr: "data-cu-drawer-trigger",
      dialogAttr: "data-cu-drawer",
      closeAttrs: ["data-cu-drawer-close"],
      closeOnBackdrop: true,
    });
  }

  function setupAlertDialogs() {
    setupOverlay({
      triggerAttr: "data-cu-alert-dialog-trigger",
      dialogAttr: "data-cu-alert-dialog",
      closeAttrs: ["data-cu-alert-dialog-cancel", "data-cu-alert-dialog-action"],
      closeOnBackdrop: false,
    });
  }

  function setupToasts() {
    // Ensure container exists
    var container = document.querySelector("[data-cu-toast-container]");
    if (!container) {
      container = document.createElement("div");
      container.className = "cu-toast-container cu-toast-container-bottom-right";
      container.setAttribute("data-cu-toast-container", "");
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
          var duration = parseInt(trigger.getAttribute("data-cu-toast-duration"), 10) || 5000;
          var timer = setTimeout(function () {
            toast.remove();
          }, duration);
          closeBtn.addEventListener("click", function () {
            clearTimeout(timer);
            toast.remove();
          });
        });
      });
  }

  function setupPopovers() {
    document.querySelectorAll("[data-cu-popover]").forEach(function (popover) {
      if (popover._cuInit) return;
      popover._cuInit = true;

      var trigger = popover.querySelector("[data-cu-popover-trigger]");
      var content = popover.querySelector("[data-cu-popover-content]");
      if (!trigger || !content) return;

      content.setAttribute("hidden", "");
      trigger.addEventListener("click", function () {
        content.toggleAttribute("hidden");
      });
      _popovers.push({ el: popover, content: content });
    });
  }

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
  }

  function destroy() {
    _dropdowns = [];
    _comboboxes = [];
    _multiSelects = [];
    _popovers = [];
    _menubars = [];
  }

  function refresh() {
    _dropdowns = _dropdowns.filter(function (d) { return document.body.contains(d.el); });
    _comboboxes = _comboboxes.filter(function (c) { return document.body.contains(c.el); });
    _multiSelects = _multiSelects.filter(function (ms) { return document.body.contains(ms.el); });
    _popovers = _popovers.filter(function (p) { return document.body.contains(p.el); });
    _menubars = _menubars.filter(function (b) { return document.body.contains(b.el); });
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
