import { registry } from "../core/registry.js";

// Image Compare
/**
 * Image Compare — before/after slider comparison.
 *
 * HTML structure:
 *   <div class="cu-image-compare" data-cu-image-compare>
 *     <img class="cu-image-compare-after" src="after.jpg" />
 *     <img class="cu-image-compare-before" src="before.jpg" />
 *     <div class="cu-image-compare-handle">
 *       <div class="cu-image-compare-handle-line"></div>
 *       <div class="cu-image-compare-handle-grip">⇔</div>
 *     </div>
 *   </div>
 */
export function setupImageCompares() {
  document.querySelectorAll("[data-cu-image-compare]").forEach(function (/** @type {HTMLElement} */ el) {
    if (el._cuInit) return;
    el._cuInit = true;

    var isDragging = false;
    var isVertical = el.classList.contains("cu-image-compare-vertical");

    function setPosition(percent) {
      percent = Math.max(0, Math.min(100, percent));
      el.style.setProperty("--cu-compare-position", percent + "%");
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
    el.addEventListener("touchstart", function (e) {
      isDragging = true;
      setPosition(getPercent(e));
    }, { passive: true });

    function onMouseMove(e) { if (!isDragging) return; setPosition(getPercent(e)); }
    function onTouchMove(e) { if (!isDragging) return; e.preventDefault(); setPosition(getPercent(e)); }
    function onMouseUp() { isDragging = false; }
    function onTouchEnd() { isDragging = false; }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("touchend", onTouchEnd);

    setPosition(50);
    registry.imageCompares.push({ el: el, cleanup: function () {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchend", onTouchEnd);
    } });
  });
}
