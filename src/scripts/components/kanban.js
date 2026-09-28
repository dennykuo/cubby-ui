import { registry } from "../core/registry.js";

// Kanban Board
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
export function setupKanbans() {
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

    registry.kanbans.push({ el: el });
  });
}
