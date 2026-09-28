// ── Checkbox Group ────────────────────────────────────────────
export function setupCheckboxGroups() {
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
