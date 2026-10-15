import { track, restore } from "../core/registry.js";

// Rating
/**
 * Rating — interactive star rating, exposed as a WAI-ARIA APG radio group (one radio per star).
 *
 * HTML structure:
 *   <div class="cu-rating" data-cu-rating data-cu-rating-value="0" aria-label="Rate this product">
 *     <button type="button" class="cu-rating-item" data-cu-rating-star="1"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></button>
 *     <button type="button" class="cu-rating-item" data-cu-rating-star="2"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></button>
 *     ...
 *   </div>
 * - Each star is a `cu-rating-item` with `data-cu-rating-star="N"` (1-based) wrapping the star `<svg>`
 *   (`cu-rating-item-half` styles target the svg). Use `<button type="button">` so the stars never submit a
 *   surrounding form (JS adds the missing `type`). The star count is the number of `[data-cu-rating-star]` elements.
 * - `data-cu-rating-value="N"` on the root is the selected value (0 = none); JS keeps it, the active classes and
 *   `aria-checked` in sync. Fires `cu:rating:change` ({ value }) when the value changes (click, keyboard).
 * - ARIA: the root gets `role="radiogroup"` (named by your `aria-label` / `aria-labelledby`, default "Rating"),
 *   each star `role="radio"` + `aria-checked` and a roving tabindex (one Tab stop: the checked star, or the first
 *   star when nothing is checked). Keys: Arrow Right / Down = next star, Arrow Left / Up = previous (both wrap,
 *   mirrored in RTL), Home / End = first / last star, Space / Enter = select the focused star.
 * - `data-cu-rating-star-text="{value} 顆星"`: optional, on the root. Accessible name template for each star;
 *   `{value}` is replaced with the star number (default "1 star" / "N stars"). A star's own `aria-label` wins.
 * - `cu-rating-readonly` / `cu-rating-disabled` on the root skip the interaction (readonly keeps one Tab stop and
 *   sets `aria-readonly`, disabled removes the stars from the Tab order and sets `aria-disabled`); display-only
 *   ratings can omit `data-cu-rating` and the star attributes entirely.
 */
export function setupRatings() {
  document.querySelectorAll("[data-cu-rating]").forEach(function (/** @type {HTMLElement} */ el) {
    if (el._cuInit) {
      restore("ratings", el);
      return;
    }
    el._cuInit = true;

    /** @type {HTMLElement[]} */
    var stars = Array.prototype.slice.call(el.querySelectorAll("[data-cu-rating-star]"));
    if (!stars.length) return;
    var readonly = el.classList.contains("cu-rating-readonly");
    var disabled = el.classList.contains("cu-rating-disabled");

    function starValue(star) {
      return parseInt(star.getAttribute("data-cu-rating-star"), 10);
    }

    function getValue() {
      return parseInt(el.getAttribute("data-cu-rating-value") || "0", 10) || 0;
    }

    // APG Rating Radio Group：根元素為 radiogroup、每顆星為 radio；「第 N 個，共 M 個」由螢幕閱讀器依 DOM 計算
    el.setAttribute("role", "radiogroup");
    if (!el.hasAttribute("aria-label") && !el.hasAttribute("aria-labelledby")) el.setAttribute("aria-label", "Rating");
    if (readonly) el.setAttribute("aria-readonly", "true");
    if (disabled) el.setAttribute("aria-disabled", "true");
    var starText = el.getAttribute("data-cu-rating-star-text");
    stars.forEach(function (star) {
      var v = starValue(star);
      star.setAttribute("role", "radio");
      // 星星只有 svg（或「★」字元）時沒有可讀的名稱；以 data-cu-rating-star-text 模板（{value} 為星等）命名
      if (!star.hasAttribute("aria-label") && !star.hasAttribute("aria-labelledby")) {
        star.setAttribute(
          "aria-label",
          starText ? starText.split("{value}").join(String(v)) : v === 1 ? "1 star" : v + " stars",
        );
      }
      // 評分常放在 <form> 內，沒有 type 的 <button> 會變成 submit 按鈕
      if (star.tagName === "BUTTON" && !star.hasAttribute("type")) star.setAttribute("type", "button");
    });

    // 外觀（填滿的星等）；滑鼠預覽時與實際值不同，因此和 aria-checked 分開更新
    function fill(value) {
      stars.forEach(function (star) {
        star.classList.toggle("cu-rating-item-active", starValue(star) <= value);
        star.classList.remove("cu-rating-item-half");
      });
    }

    // data-cu-rating-value 是唯一的值來源：同步 aria-checked 與 roving tabindex
    // （Tab 只停在選取的星，未選取時為第一顆；停用時都不在 Tab 順序中）
    function syncState() {
      var value = getValue();
      var stop = stars[0];
      stars.forEach(function (star) {
        var checked = starValue(star) === value;
        star.setAttribute("aria-checked", checked ? "true" : "false");
        if (checked) stop = star;
      });
      stars.forEach(function (star) {
        star.tabIndex = !disabled && star === stop ? 0 : -1;
      });
    }

    syncState();
    // 唯讀 / 停用保留作者標記的外觀（例如半星），只補上語意
    if (readonly || disabled) return;
    fill(getValue());

    function select(star, moveFocus) {
      var value = starValue(star);
      var changed = value !== getValue();
      el.setAttribute("data-cu-rating-value", String(value));
      syncState();
      fill(value);
      if (moveFocus) star.focus();
      if (changed) el.dispatchEvent(new CustomEvent("cu:rating:change", { detail: { value: value }, bubbles: true }));
    }

    el.addEventListener("mouseover", function (e) {
      var star = /** @type {Element} */ (e.target).closest("[data-cu-rating-star]");
      if (star) fill(starValue(star));
    });

    el.addEventListener("mouseleave", function () {
      fill(getValue());
    });

    el.addEventListener("click", function (e) {
      var star = /** @type {HTMLElement} */ (/** @type {Element} */ (e.target).closest("[data-cu-rating-star]"));
      if (star && stars.indexOf(star) !== -1) select(star, false);
    });

    // APG radio group：方向鍵移動焦點並同時選取（頭尾循環），另加 Home / End；Space / Enter 選取目前焦點的星
    el.addEventListener("keydown", function (e) {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      var star = /** @type {HTMLElement} */ (/** @type {Element} */ (e.target).closest("[data-cu-rating-star]"));
      var i = stars.indexOf(star);
      if (i === -1) return;
      var n = stars.length;
      // 由右至左排版時星星的視覺順序相反，左右方向鍵跟著對調
      var step = getComputedStyle(el).direction === "rtl" ? -1 : 1;
      var target;
      if (e.key === "ArrowRight") target = (i + step + n) % n;
      else if (e.key === "ArrowLeft") target = (i - step + n) % n;
      else if (e.key === "ArrowDown") target = (i + 1) % n;
      else if (e.key === "ArrowUp") target = (i - 1 + n) % n;
      else if (e.key === "Home") target = 0;
      else if (e.key === "End") target = n - 1;
      else if (e.key === " " || e.key === "Enter") target = i;
      else return;
      // 同時擋下 <button> 原生的 Enter / Space click，以及 Space / 方向鍵捲動頁面
      e.preventDefault();
      select(stars[target], target !== i);
    });

    track("ratings", { el: el });
  });
}
