import { registry } from "../core/registry.js";

// Data Table Expandable Rows
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
export function setupDataTableExpandables() {
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

    registry.dataTableExpandables.push({ el: el });
  });
}
