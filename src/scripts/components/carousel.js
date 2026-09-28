// ── Carousel ──────────────────────────────────────────────────
export function setupCarousels() {
  document.querySelectorAll("[data-cu-carousel]").forEach(function (carousel) {
    if (carousel._cuInit) return;
    carousel._cuInit = true;

    var viewport = carousel.querySelector("[data-cu-carousel-viewport]");
    var prevBtn = carousel.querySelector("[data-cu-carousel-prev]");
    var nextBtn = carousel.querySelector("[data-cu-carousel-next]");
    var dots = carousel.querySelectorAll("[data-cu-carousel-dot]");
    if (!viewport) return;

    var slides = viewport.querySelectorAll("[data-cu-carousel-slide]");
    if (!slides.length) return;

    function getSlideWidth() { return slides[0].offsetWidth; }

    function getCurrentIndex() {
      return Math.round(viewport.scrollLeft / getSlideWidth());
    }

    function updateState() {
      var index = getCurrentIndex();
      var visibleSlides = Math.round(viewport.offsetWidth / getSlideWidth());
      var maxScrollIndex = Math.max(0, slides.length - visibleSlides);

      if (prevBtn) prevBtn.disabled = index <= 0;
      if (nextBtn) nextBtn.disabled = index >= maxScrollIndex;

      dots.forEach(function (dot, i) {
        dot.classList.toggle("cu-carousel-dot-active", i === index);
      });
    }

    function scrollToIndex(index) {
      viewport.scrollTo({ left: index * getSlideWidth(), behavior: "smooth" });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        var index = getCurrentIndex();
        if (index > 0) scrollToIndex(index - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        var index = getCurrentIndex();
        var visibleSlides = Math.round(viewport.offsetWidth / getSlideWidth());
        var maxScrollIndex = Math.max(0, slides.length - visibleSlides);
        if (index < maxScrollIndex) scrollToIndex(index + 1);
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () { scrollToIndex(i); });
    });

    var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      var origScrollTo = viewport.scrollTo.bind(viewport);
      viewport.scrollTo = function (opts) {
        origScrollTo({ left: opts.left, behavior: "auto" });
      };
    }

    viewport.addEventListener("scroll", updateState);
    updateState();
  });
}
