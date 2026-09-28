import { registry } from "../core/registry.js";

// Countdown
/**
 * Countdown — timer counting down to a target date.
 *
 * HTML structure:
 *   <div data-cu-countdown data-cu-countdown-target="2026-12-31T00:00:00">
 *     <div class="cu-countdown-segment"><span class="cu-countdown-value" data-cu-countdown-days>00</span><span class="cu-countdown-label">Days</span></div>
 *     <span class="cu-countdown-separator">:</span>
 *     <div class="cu-countdown-segment"><span class="cu-countdown-value" data-cu-countdown-hours>00</span><span class="cu-countdown-label">Hours</span></div>
 *     ...
 *   </div>
 */
export function setupCountdowns() {
  document.querySelectorAll("[data-cu-countdown]").forEach(function (el) {
    if (el._cuInit) return;
    el._cuInit = true;

    var target = el.getAttribute("data-cu-countdown-target");
    if (!target) return;
    var targetDate = new Date(target).getTime();

    var daysEl = el.querySelector("[data-cu-countdown-days]");
    var hoursEl = el.querySelector("[data-cu-countdown-hours]");
    var minutesEl = el.querySelector("[data-cu-countdown-minutes]");
    var secondsEl = el.querySelector("[data-cu-countdown-seconds]");

    function pad(n) { return n < 10 ? "0" + n : "" + n; }

    function update() {
      var now = Date.now();
      var diff = Math.max(0, targetDate - now);
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);

      if (daysEl) daysEl.textContent = pad(d);
      if (hoursEl) hoursEl.textContent = pad(h);
      if (minutesEl) minutesEl.textContent = pad(m);
      if (secondsEl) secondsEl.textContent = pad(s);

      if (diff === 0) {
        el.classList.add("cu-countdown-complete");
        el.dispatchEvent(new CustomEvent("cu:countdown:complete", { bubbles: true }));
        return;
      }
      entry.timer = setTimeout(update, 1000);
    }

    var entry = { el: el, timer: 0 };
    entry.timer = setTimeout(update, 0);
    registry.countdowns.push(entry);
  });
}
