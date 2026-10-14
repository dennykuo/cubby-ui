import { track, restore } from "../core/registry.js";

// Data Table Expandable Rows
/**
 * Data Table Expandable — toggle row expansion to show details.
 *
 * HTML structure:
 *   <div class="cu-data-table" data-cu-data-table-expandable>
 *     <div class="cu-table-wrapper">
 *       <table class="cu-table">
 *         <tbody class="cu-table-body">
 *           <tr class="cu-table-row">
 *             <td class="cu-table-cell">
 *               <button class="cu-data-table-expand-trigger" data-cu-expand-row aria-expanded="false"><svg>...</svg></button>
 *             </td>
 *             <td class="cu-table-cell">...</td>
 *           </tr>
 *           <tr hidden>
 *             <td colspan="2" class="cu-data-table-expanded-content">Details...</td>
 *           </tr>
 *         </tbody>
 *       </table>
 *     </div>
 *   </div>
 * - `data-cu-data-table-expandable` on the wrapper is required: only `[data-cu-expand-row]` triggers inside it are wired up.
 * - The row right after the trigger's row is the details row; toggling sets `aria-expanded` and `cu-data-table-expanded-row`.
 */
export function setupDataTableExpandables() {
  document.querySelectorAll("[data-cu-data-table-expandable]").forEach(function (el) {
    if (el._cuInit) { restore("dataTableExpandables", el); return; }
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

    track("dataTableExpandables", { el: el });
  });
}
