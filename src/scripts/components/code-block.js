// ── Code Block ────────────────────────────────────────────────
export function setupCodeBlocks() {
  document.querySelectorAll("[data-cu-code-block]").forEach(function (block) {
    if (block._cuInit) return;
    block._cuInit = true;

    var btn = block.querySelector("[data-cu-code-block-copy]");
    if (!btn) return;

    btn.addEventListener("click", function () {
      var pre = block.querySelector(".cu-code-block-pre");
      if (!pre) return;

      var text = pre.textContent || "";
      navigator.clipboard.writeText(text).then(function () {
        var label = btn.querySelector("[data-cu-code-block-label]");
        btn.setAttribute("data-cu-copied", "");
        if (label) label.textContent = "Copied!";

        setTimeout(function () {
          btn.removeAttribute("data-cu-copied");
          if (label) label.textContent = "Copy";
        }, 2000);
      });
    });
  });
}
