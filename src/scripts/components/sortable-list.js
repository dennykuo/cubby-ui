import { registry } from "../core/registry.js";

// Sortable List
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
export function setupSortableLists() {
  document.querySelectorAll("[data-cu-sortable-list]").forEach(function (/** @type {HTMLElement} */ el) {
    if (el._cuInit) return;
    el._cuInit = true;

    var draggedItem = null;
    var placeholder = null;

    function getItems() {
      return Array.from(el.querySelectorAll("[data-cu-sortable-item]"));
    }

    el.addEventListener("dragstart", function (e) {
      var item = /** @type {Element} */ (e.target).closest("[data-cu-sortable-item]");
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

    registry.sortableLists.push({ el: el });
  });
}
