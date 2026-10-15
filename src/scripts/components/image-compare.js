import { track, restore } from "../core/registry.js";

// Image Compare
/**
 * Image Compare — before/after slider comparison.
 *
 * HTML structure:
 *   <div class="cu-image-compare" data-cu-image-compare data-cu-image-compare-position="50">
 *     <img class="cu-image-compare-after" src="after.jpg" alt="After" />
 *     <img class="cu-image-compare-before" src="before.jpg" alt="Before" />
 *     <div class="cu-image-compare-handle">
 *       <div class="cu-image-compare-handle-line"></div>
 *       <div class="cu-image-compare-handle-grip">⇔</div>
 *     </div>
 *   </div>
 * - `data-cu-image-compare-position`: optional initial position in % (0–100, default 50; out-of-range values are clamped).
 * - The handle becomes an APG slider (`role="slider"`, `tabindex="0"`, `aria-valuenow` 0–100, `aria-valuetext` "N%",
 *   `aria-orientation`). Keys: Arrow keys ±1, Page Up / Page Down ±10, Home / End → 0 / 100. Horizontal: Right / Up
 *   increase; vertical (`cu-image-compare-vertical`, value grows downwards): Down / Right increase.
 * - Accessible name: `aria-label` / `aria-labelledby` on the handle (default "Image comparison").
 */
export function setupImageCompares() {
  document.querySelectorAll("[data-cu-image-compare]").forEach(function (/** @type {HTMLElement} */ el) {
    if (el._cuInit) {
      restore("imageCompares", el);
      return;
    }
    el._cuInit = true;

    var isDragging = false;
    var isVertical = el.classList.contains("cu-image-compare-vertical");
    var handle = /** @type {HTMLElement} */ (el.querySelector(".cu-image-compare-handle"));
    var position = 50;

    if (handle) {
      handle.setAttribute("role", "slider");
      if (!handle.hasAttribute("tabindex")) handle.tabIndex = 0;
      handle.setAttribute("aria-valuemin", "0");
      handle.setAttribute("aria-valuemax", "100");
      handle.setAttribute("aria-orientation", isVertical ? "vertical" : "horizontal");
      if (!handle.hasAttribute("aria-label") && !handle.hasAttribute("aria-labelledby")) {
        handle.setAttribute("aria-label", "Image comparison");
      }
    }

    function setPosition(percent) {
      position = Math.max(0, Math.min(100, percent));
      el.style.setProperty("--cu-compare-position", position + "%");
      if (handle) {
        var rounded = Math.round(position);
        handle.setAttribute("aria-valuenow", String(rounded));
        handle.setAttribute("aria-valuetext", rounded + "%");
      }
    }

    function getPercent(e) {
      var rect = el.getBoundingClientRect();
      var clientPos = e.touches ? e.touches[0] : e;
      if (isVertical) {
        return ((clientPos.clientY - rect.top) / rect.height) * 100;
      }
      return ((clientPos.clientX - rect.left) / rect.width) * 100;
    }

    el.addEventListener("mousedown", function (e) {
      isDragging = true;
      setPosition(getPercent(e));
      e.preventDefault();
    });
    el.addEventListener(
      "touchstart",
      function (e) {
        isDragging = true;
        setPosition(getPercent(e));
      },
      { passive: true },
    );

    // 垂直模式的位置由上往下增加：Down / Right 增加、Up / Left 減少；水平模式依 APG，Right / Up 增加
    if (handle) {
      handle.addEventListener("keydown", function (e) {
        var current = Math.round(position);
        var next;
        if (e.key === "Home") next = 0;
        else if (e.key === "End") next = 100;
        else if (e.key === "ArrowRight" || e.key === (isVertical ? "ArrowDown" : "ArrowUp")) next = current + 1;
        else if (e.key === "ArrowLeft" || e.key === (isVertical ? "ArrowUp" : "ArrowDown")) next = current - 1;
        else if (e.key === (isVertical ? "PageDown" : "PageUp")) next = current + 10;
        else if (e.key === (isVertical ? "PageUp" : "PageDown")) next = current - 10;
        else return;
        e.preventDefault(); // 避免方向鍵 / Page 鍵捲動頁面
        setPosition(next);
      });
    }

    function onMouseMove(e) {
      if (!isDragging) return;
      setPosition(getPercent(e));
    }
    function onTouchMove(e) {
      if (!isDragging) return;
      e.preventDefault();
      setPosition(getPercent(e));
    }
    function onMouseUp() {
      isDragging = false;
    }
    function onTouchEnd() {
      isDragging = false;
    }

    function addDocListeners() {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("touchmove", onTouchMove, { passive: false });
      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("touchend", onTouchEnd);
    }
    addDocListeners();

    var initial = parseFloat(el.getAttribute("data-cu-image-compare-position"));
    setPosition(isNaN(initial) ? 50 : initial);
    // destroy() 移除 document 拖曳監聽；之後再 init() 時由 resume() 加回（mousedown / touchstart / keydown 在元素上，不受影響）
    track("imageCompares", {
      el: el,
      cleanup: function () {
        isDragging = false;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("touchmove", onTouchMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.removeEventListener("touchend", onTouchEnd);
      },
      resume: addDocListeners,
    });
  });
}
