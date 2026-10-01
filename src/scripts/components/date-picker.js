import { registry } from "../core/registry.js";
import { toISODate, formatDate, initCalendar } from "./calendar.js";

// ── Date Picker ───────────────────────────────────────────────
export function setupDatePickers() {
  document.querySelectorAll("[data-cu-calendar]").forEach(function (calendar) {
    // Date Picker 內的月曆由下方連同 onSelect 一起初始化，這裡只處理獨立 Calendar；
    // 否則同一個月曆會被綁兩次（方向鍵一次移動兩格），重複 init() 時還會覆蓋掉 onSelect
    if (calendar._cuInit || calendar.closest("[data-cu-date-picker]")) return;
    calendar._cuInit = true;
    initCalendar(calendar, null);
  });

  document.querySelectorAll("[data-cu-date-picker]").forEach(function (picker) {
    if (picker._cuInit) return;
    picker._cuInit = true;

    var trigger = /** @type {HTMLElement} */ (picker.querySelector("[data-cu-date-picker-trigger]"));
    var content = /** @type {HTMLElement} */ (picker.querySelector("[data-cu-date-picker-content]"));
    var calendar = picker.querySelector("[data-cu-calendar]");
    var valueEl = picker.querySelector("[data-cu-date-picker-value]");
    var hiddenInput = /** @type {HTMLInputElement} */ (picker.querySelector("input[data-cu-date-picker-input]"));
    if (!trigger || !content || !calendar) return;

    content.style.display = "none";
    calendar._cuInit = true;

    // 須在 initCalendar 之前解析預設值，月曆才會開在該月份並標記選取
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

    initCalendar(calendar, function (date) {
      var formatted = formatDate(date);
      if (valueEl) { valueEl.textContent = formatted; valueEl.classList.remove("cu-date-picker-trigger-placeholder"); }
      if (hiddenInput) {
        hiddenInput.value = toISODate(date);
        // 程式設定 value 不會觸發事件，手動通知表單 / 使用者程式碼
        hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));
      }
      content.style.display = "none";
      trigger.focus(); // 面板已隱藏，焦點移回 trigger 避免遺失
    });

    trigger.addEventListener("click", function () {
      // 不阻止冒泡：讓 document 級 handler 關閉其他已開啟的浮層（自身因 contains 判斷不受影響）
      var isHidden = content.style.display === "none";
      content.style.display = isHidden ? "" : "none";
      if (isHidden && calendar._cuRender) calendar._cuRender();
    });

    // 全域關閉(click 外部 / Escape)由 setupDocumentListeners 的 delegated handler 統一處理
    registry.datePickers.push({ el: picker, trigger: trigger, content: content });
  });
}
