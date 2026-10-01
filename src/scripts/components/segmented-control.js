// ── Segmented Control ─────────────────────────────────────────
export function setupSegmentedControls() {
  document.querySelectorAll("[data-cu-segmented]").forEach(function (control) {
    if (control._cuInit) return;
    control._cuInit = true;

    var inputs = /** @type {NodeListOf<HTMLInputElement>} */ (control.querySelectorAll(".cu-segmented-input"));

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
