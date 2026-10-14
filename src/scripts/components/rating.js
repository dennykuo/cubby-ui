import { track, restore } from "../core/registry.js";

// Rating
/**
 * Rating — interactive star rating.
 *
 * HTML structure:
 *   <div class="cu-rating" data-cu-rating data-cu-rating-value="0">
 *     <span class="cu-rating-item" data-cu-rating-star="1"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span>
 *     <span class="cu-rating-item" data-cu-rating-star="2"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span>
 *     ...
 *   </div>
 * - Each star is a `cu-rating-item` with `data-cu-rating-star="N"` (1-based) wrapping the star `<svg>`
 *   (`cu-rating-item-half` styles target the svg). The star count is the number of `[data-cu-rating-star]`
 *   elements; `data-cu-rating-max` is not read.
 * - `cu-rating-readonly` / `cu-rating-disabled` on the root skip the interaction; display-only ratings can omit
 *   `data-cu-rating` and the star attributes entirely.
 * - Fires `cu:rating:change` ({ value }) on click.
 */
export function setupRatings() {
  document.querySelectorAll("[data-cu-rating]").forEach(function (el) {
    if (el._cuInit) { restore("ratings", el); return; }
    el._cuInit = true;
    if (el.classList.contains("cu-rating-readonly") || el.classList.contains("cu-rating-disabled")) return;

    var stars = el.querySelectorAll("[data-cu-rating-star]");

    function updateStars(value) {
      stars.forEach(function (star) {
        var v = parseInt(star.getAttribute("data-cu-rating-star"), 10);
        if (v <= value) {
          star.classList.add("cu-rating-item-active");
          star.classList.remove("cu-rating-item-half");
        } else {
          star.classList.remove("cu-rating-item-active");
          star.classList.remove("cu-rating-item-half");
        }
      });
    }

    el.addEventListener("mouseover", function (e) {
      var star = /** @type {Element} */ (e.target).closest("[data-cu-rating-star]");
      if (!star) return;
      var v = parseInt(star.getAttribute("data-cu-rating-star"), 10);
      updateStars(v);
    });

    el.addEventListener("mouseleave", function () {
      var current = parseInt(el.getAttribute("data-cu-rating-value") || "0", 10);
      updateStars(current);
    });

    el.addEventListener("click", function (e) {
      var star = /** @type {Element} */ (e.target).closest("[data-cu-rating-star]");
      if (!star) return;
      var v = parseInt(star.getAttribute("data-cu-rating-star"), 10);
      el.setAttribute("data-cu-rating-value", String(v));
      updateStars(v);
      el.dispatchEvent(new CustomEvent("cu:rating:change", { detail: { value: v }, bubbles: true }));
    });

    track("ratings", { el: el });
  });
}
