import { registry } from "../core/registry.js";

// Back to Top
/**
 * Back to Top — scroll-to-top button that appears after scrolling.
 *
 * HTML structure:
 *   <button class="cu-back-to-top" data-cu-back-to-top data-cu-back-to-top-threshold="300">↑</button>
 */
export function setupBackToTops() {
  document.querySelectorAll("[data-cu-back-to-top]").forEach(function (el) {
    if (el._cuInit) return;
    el._cuInit = true;

    var threshold = parseInt(el.getAttribute("data-cu-back-to-top-threshold") || "300", 10);

    function onScroll() {
      if (window.scrollY > threshold) {
        el.setAttribute("data-cu-visible", "");
      } else {
        el.removeAttribute("data-cu-visible");
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    el.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    registry.backToTops.push({ el: el, cleanup: function () {
      window.removeEventListener("scroll", onScroll);
    } });
  });
}
