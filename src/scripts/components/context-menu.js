import { registry } from "../core/registry.js";

// ── Context Menu ──────────────────────────────────────────────
export function setupContextMenus() {
  document.querySelectorAll("[data-cu-context-menu]").forEach(function (/** @type {HTMLElement} */ container) {
    if (container._cuInit) return;
    container._cuInit = true;

    var content = /** @type {HTMLElement} */ (container.querySelector("[data-cu-context-menu-content]"));
    if (!content) return;

    container.addEventListener("contextmenu", function (e) {
      e.preventDefault();
      document.querySelectorAll("[data-cu-context-menu-content]").forEach(function (c) {
        if (c !== content) c.setAttribute("hidden", "");
      });
      content.removeAttribute("hidden");
      var x = e.clientX;
      var y = e.clientY;
      var rect = content.getBoundingClientRect();
      var vw = window.innerWidth;
      var vh = window.innerHeight;
      if (x + rect.width > vw) x = vw - rect.width - 4;
      if (y + rect.height > vh) y = vh - rect.height - 4;
      if (x < 0) x = 4;
      if (y < 0) y = 4;
      content.style.left = x + "px";
      content.style.top = y + "px";
    });

    // 全域關閉(click/contextmenu/keydown/scroll)由 setupDocumentListeners 的
    // delegated handler 統一處理(遍歷 registry.contextMenus),避免每實例累積 document listener
    registry.contextMenus.push({ el: container, content: content });
  });
}
