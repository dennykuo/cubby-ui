// ── Pin Input ─────────────────────────────────────────────────
export function setupPinInputs() {
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
