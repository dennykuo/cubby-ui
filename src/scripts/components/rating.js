import { registry } from "../core/registry.js";

// Rating
/**
 * Rating — interactive star rating.
 *
 * HTML structure:
 *   <div class="cu-rating" data-cu-rating data-cu-rating-value="0" data-cu-rating-max="5">
 *     <span class="cu-rating-item" data-cu-rating-star="1">★</span>
 *     ...
 *   </div>
 */
export function setupRatings() {
  document.querySelectorAll("[data-cu-rating]").forEach(function (el) {
    if (el._cuInit) return;
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

    registry.ratings.push({ el: el });
  });
}
