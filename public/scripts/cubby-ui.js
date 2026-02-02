/**
 * Cubby UI — Interactive component scripts
 * Framework-agnostic, vanilla JS
 */
(function () {
  "use strict";

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
          content && content.toggleAttribute("hidden");
        });
      document.addEventListener("click", function (e) {
        if (!dropdown.contains(e.target)) {
          content && content.setAttribute("hidden", "");
        }
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          content && content.setAttribute("hidden", "");
        }
      });
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

      trigger &&
        trigger.addEventListener("click", function (e) {
          e.stopPropagation();
          var isHidden = content && content.hasAttribute("hidden");
          content && content.toggleAttribute("hidden");
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
          });
          item.classList.add("cu-combobox-item-active");
          content && content.setAttribute("hidden", "");
          if (input) {
            input.value = "";
            input.dispatchEvent(new Event("input"));
          }
        });
      });

      document.addEventListener("click", function (e) {
        if (!combobox.contains(e.target)) {
          content && content.setAttribute("hidden", "");
          if (input) {
            input.value = "";
            input.dispatchEvent(new Event("input"));
          }
        }
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          content && content.setAttribute("hidden", "");
          if (input) {
            input.value = "";
            input.dispatchEvent(new Event("input"));
          }
        }
      });
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
              tag.innerHTML =
                item.textContent +
                '<button class="cu-multi-select-tag-remove" data-cu-remove="' +
                val +
                '">&times;</button>';
              var removeBtn = tag.querySelector("[data-cu-remove]");
              removeBtn &&
                removeBtn.addEventListener("click", function (e) {
                  e.stopPropagation();
                  selected.delete(val);
                  item.classList.remove("cu-multi-select-item-active");
                  renderTags();
                });
              tagsEl.appendChild(tag);
            });
          }
        }

        trigger &&
          trigger.addEventListener("click", function (e) {
            e.stopPropagation();
            var isHidden = content && content.hasAttribute("hidden");
            content && content.toggleAttribute("hidden");
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
            } else {
              selected.add(val);
              item.classList.add("cu-multi-select-item-active");
            }
            renderTags();
          });
        });

        document.addEventListener("click", function (e) {
          if (!ms.contains(e.target)) {
            content && content.setAttribute("hidden", "");
            if (input) {
              input.value = "";
              input.dispatchEvent(new Event("input"));
            }
          }
        });

        document.addEventListener("keydown", function (e) {
          if (e.key === "Escape") {
            content && content.setAttribute("hidden", "");
            if (input) {
              input.value = "";
              input.dispatchEvent(new Event("input"));
            }
          }
        });
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

  function init() {
    setupTabs();
    setupDropdowns();
    setupComboboxes();
    setupMultiSelects();
    setupNumberInputs();
    setupDropzones();
    setupTransferLists();
  }

  // Export
  window.CubbyUI = { init: init };

  // Auto-init
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
