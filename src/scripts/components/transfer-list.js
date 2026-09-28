import { registry } from "../core/registry.js";

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
export function setupTransferLists() {
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

      registry.transferLists.push({ el: container });
    });
}
