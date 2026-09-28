// ── Password Input ──────────────────────────────────────────────
export function setupPasswordInputs() {
  document.querySelectorAll("[data-cu-password-input]").forEach(function (container) {
    if (container._cuInit) return;
    container._cuInit = true;

    var field = container.querySelector(".cu-password-input-field");
    var toggle = container.querySelector("[data-cu-password-toggle]");
    var iconShow = container.querySelector("[data-cu-password-icon-show]");
    var iconHide = container.querySelector("[data-cu-password-icon-hide]");
    if (!field || !toggle) return;

    toggle.addEventListener("click", function () {
      var isPassword = field.type === "password";
      field.type = isPassword ? "text" : "password";
      if (iconShow) iconShow.style.display = isPassword ? "none" : "";
      if (iconHide) iconHide.style.display = isPassword ? "" : "none";
    });
  });
}
