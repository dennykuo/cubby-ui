import { registry } from "../core/registry.js";
import { toISODate, formatDate, initCalendar } from "./calendar.js";

// ── Date Picker ───────────────────────────────────────────────
export function setupDatePickers() {
  document.querySelectorAll("[data-cu-calendar]").forEach(function (calendar) {
    if (calendar._cuInit) return;
    calendar._cuInit = true;
    initCalendar(calendar, null);
  });

  document.querySelectorAll("[data-cu-date-picker]").forEach(function (picker) {
    if (picker._cuInit) return;
    picker._cuInit = true;

    var trigger = picker.querySelector("[data-cu-date-picker-trigger]");
    var content = picker.querySelector("[data-cu-date-picker-content]");
    var calendar = picker.querySelector("[data-cu-calendar]");
    var valueEl = picker.querySelector("[data-cu-date-picker-value]");
    var hiddenInput = picker.querySelector("input[data-cu-date-picker-input]");
    if (!trigger || !content || !calendar) return;

    content.style.display = "none";
    if (calendar._cuInit) calendar._cuInit = false;

    initCalendar(calendar, function (date) {
      var formatted = formatDate(date);
      if (valueEl) { valueEl.textContent = formatted; valueEl.classList.remove("cu-date-picker-trigger-placeholder"); }
      if (hiddenInput) hiddenInput.value = toISODate(date);
      content.style.display = "none";
    });

    if (hiddenInput && hiddenInput.value) {
      var parts = hiddenInput.value.split("-");
      if (parts.length === 3) {
        var initDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        if (!isNaN(initDate.getTime())) {
          if (valueEl) { valueEl.textContent = formatDate(initDate); valueEl.classList.remove("cu-date-picker-trigger-placeholder"); }
          calendar._cuSelectedDate = initDate;
        }
      }
    }

    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      var isHidden = content.style.display === "none";
      content.style.display = isHidden ? "" : "none";
      if (isHidden && calendar._cuRender) calendar._cuRender();
    });

    // 全域關閉(click 外部 / Escape)由 setupDocumentListeners 的 delegated handler 統一處理
    registry.datePickers.push({ el: picker, content: content });
  });
}
