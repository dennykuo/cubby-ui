import { genId } from "../core/utils.js";

// ── Date Picker / Calendar helpers ────────────────────────────
export function toISODate(date) {
  var y = date.getFullYear();
  var m = String(date.getMonth() + 1).padStart(2, "0");
  var d = String(date.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + d;
}

export function formatDate(date) {
  var y = date.getFullYear();
  var m = String(date.getMonth() + 1).padStart(2, "0");
  var d = String(date.getDate()).padStart(2, "0");
  return y + "/" + m + "/" + d;
}

export function initCalendar(calendar, onSelect) {
  var header = calendar.querySelector("[data-cu-calendar-title]");
  var prevBtn = calendar.querySelector("[data-cu-calendar-prev]");
  var nextBtn = calendar.querySelector("[data-cu-calendar-next]");
  var grid = calendar.querySelector("[data-cu-calendar-grid]");
  if (!header || !grid) return;

  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var currentMonth = today.getMonth();
  var currentYear = today.getFullYear();

  if (calendar._cuSelectedDate) {
    currentMonth = calendar._cuSelectedDate.getMonth();
    currentYear = calendar._cuSelectedDate.getFullYear();
  }

  var selectedDate = calendar._cuSelectedDate || null;
  var minDate = null;
  var maxDate = null;
  var minAttr = calendar.getAttribute("data-cu-calendar-min");
  var maxAttr = calendar.getAttribute("data-cu-calendar-max");
  if (minAttr) {
    var mp = minAttr.split("-");
    minDate = new Date(parseInt(mp[0]), parseInt(mp[1]) - 1, parseInt(mp[2]));
    minDate.setHours(0, 0, 0, 0);
  }
  if (maxAttr) {
    var xp = maxAttr.split("-");
    maxDate = new Date(parseInt(xp[0]), parseInt(xp[1]) - 1, parseInt(xp[2]));
    maxDate.setHours(0, 0, 0, 0);
  }

  // APG grid：月曆是以月份標題命名的 role="grid"，每週一個 role="row"（cu-calendar-week），日期按鈕為 gridcell。
  // grid 讓螢幕閱讀器把方向鍵交給頁面處理（瀏覽模式下一般按鈕收不到方向鍵）；只有一個 Tab 停駐點（roving tabindex）
  grid.setAttribute("role", "grid");
  if (!header.id) header.id = genId("cu-calendar-title");
  if (!grid.hasAttribute("aria-label") && !grid.hasAttribute("aria-labelledby"))
    grid.setAttribute("aria-labelledby", header.id);

  // 日期按鈕的無障礙名稱（完整日期，每次重繪時讀取語系）。語系：data-cu-calendar-locale（可放在任一祖先）
  // → 最近祖先的 lang（含 <html lang>）→ 瀏覽器預設；無效的語系標籤略過
  var dateFormat;
  function getDateFormat() {
    var localeEl = calendar.closest("[data-cu-calendar-locale]");
    var langEl = calendar.closest("[lang]");
    var locales = [localeEl && localeEl.getAttribute("data-cu-calendar-locale"), langEl && langEl.getAttribute("lang")];
    /** @type {Intl.DateTimeFormatOptions} */
    var options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    for (var i = 0; i < locales.length; i++) {
      if (!locales[i]) continue;
      try {
        return new Intl.DateTimeFormat(locales[i], options);
      } catch (_e) {
        // 無效的語系標籤（RangeError）：改用下一個來源
      }
    }
    return new Intl.DateTimeFormat(undefined, options);
  }

  function inRange(date) {
    return !(minDate && date < minDate) && !(maxDate && date > maxDate);
  }

  function render() {
    var monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    header.textContent = monthNames[currentMonth] + " " + currentYear;
    dateFormat = getDateFormat();

    if (prevBtn) {
      if (minDate) {
        var prevMonth = new Date(currentYear, currentMonth, 0);
        prevBtn.disabled = prevMonth < minDate;
      } else {
        prevBtn.disabled = false;
      }
    }
    if (nextBtn) {
      if (maxDate) {
        var nextMonthFirst = new Date(currentYear, currentMonth + 1, 1);
        nextBtn.disabled = nextMonthFirst > maxDate;
      } else {
        nextBtn.disabled = false;
      }
    }

    grid.innerHTML = "";
    var firstDay = new Date(currentYear, currentMonth, 1).getDay();
    var daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    var daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    var cells = [];
    for (var p = firstDay - 1; p >= 0; p--) {
      cells.push(createDayButton(daysInPrevMonth - p, currentMonth - 1, currentYear, true));
    }
    for (var d = 1; d <= daysInMonth; d++) {
      cells.push(createDayButton(d, currentMonth, currentYear, false));
    }
    var totalCells = cells.length;
    var remaining = totalCells <= 35 ? 35 - totalCells : 42 - totalCells;
    for (var n = 1; n <= remaining; n++) {
      cells.push(createDayButton(n, currentMonth + 1, currentYear, true));
    }

    var row;
    for (var c = 0; c < cells.length; c++) {
      if (c % 7 === 0) {
        row = document.createElement("div");
        row.className = "cu-calendar-week";
        row.setAttribute("role", "row");
        grid.appendChild(row);
      }
      row.appendChild(cells[c]);
    }
    setTabStop(
      enabled(findDay(selectedDate)) ||
        enabled(findDay(today)) ||
        grid.querySelector(".cu-calendar-day:not(.cu-calendar-day-outside):not(:disabled)") ||
        grid.querySelector(".cu-calendar-day:not(:disabled)"),
    );
  }

  function createDayButton(day, month, year, isOutside) {
    var date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);
    var btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = day;
    btn._cuDate = date;
    btn.tabIndex = -1;
    btn.setAttribute("role", "gridcell");
    btn.setAttribute("aria-label", dateFormat.format(date));
    var classes = ["cu-calendar-day"];
    var isToday = date.getTime() === today.getTime();
    var isSelected = selectedDate && date.getTime() === selectedDate.getTime();
    if (isOutside) classes.push("cu-calendar-day-outside");
    if (isToday && !isSelected) classes.push("cu-calendar-day-today");
    if (isSelected) classes.push("cu-calendar-day-selected");
    if (isSelected) btn.setAttribute("aria-selected", "true");
    if (isToday) btn.setAttribute("aria-current", "date"); // 選取今天時視覺上只標 selected，語意上仍是今天
    var isDisabled = false;
    if (minDate && date < minDate) isDisabled = true;
    if (maxDate && date > maxDate) isDisabled = true;
    if (isDisabled) {
      classes.push("cu-calendar-day-disabled");
      btn.disabled = true;
    }
    btn.className = classes.join(" ");
    if (!isDisabled) {
      btn.addEventListener("click", function () {
        var hadFocus = document.activeElement === btn;
        selectedDate = date;
        calendar._cuSelectedDate = date;
        if (isOutside) {
          currentMonth = date.getMonth();
          currentYear = date.getFullYear();
        }
        render();
        // render() 會重建所有日期按鈕，把焦點移到新的選取按鈕，鍵盤使用者才能繼續操作
        if (hadFocus) focusDate(date);
        if (onSelect) onSelect(date);
      });
    }
    return btn;
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      render();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      render();
    });
  }

  /** @returns {HTMLButtonElement | null} 目前顯示月份中（不含前後月補位）代表該日期的按鈕 */
  function findDay(date) {
    if (!date) return null;
    var buttons = grid.querySelectorAll(".cu-calendar-day:not(.cu-calendar-day-outside)");
    for (var i = 0; i < buttons.length; i++) {
      if (buttons[i]._cuDate && buttons[i]._cuDate.getTime() === date.getTime())
        return /** @type {HTMLButtonElement} */ (buttons[i]);
    }
    return null;
  }

  function enabled(btn) {
    return btn && !btn.disabled ? btn : null;
  }

  function focusDate(date) {
    var btn = findDay(date);
    if (btn) btn.focus();
  }

  // Roving tabindex：Tab 只停在一個日期（最後取得焦點的日期；重繪後為選取日 → 今天 → 本月第一個可選日期）
  function setTabStop(stop) {
    grid.querySelectorAll(".cu-calendar-day").forEach(function (/** @type {HTMLElement} */ b) {
      b.tabIndex = b === stop ? 0 : -1;
    });
  }
  grid.addEventListener("focusin", function (e) {
    var target = /** @type {HTMLElement} */ (e.target);
    if (target._cuDate) setTabStop(target);
  });

  // APG Date Picker Dialog：開啟時切到並聚焦選取日；沒有選取時為今天，今天不在範圍內時為範圍內第一個可選日期
  calendar._cuFocusInitialDate = function () {
    var target = selectedDate && inRange(selectedDate) ? selectedDate : inRange(today) ? today : minDate || maxDate;
    currentMonth = target.getMonth();
    currentYear = target.getFullYear();
    render();
    focusDate(target);
  };

  // 以日期計算移動目標（而非按鈕索引），跨月時切換月份；超出 min / max 時停在邊界
  grid.addEventListener("keydown", function (e) {
    var focused = /** @type {HTMLElement} */ (document.activeElement);
    if (!focused || !grid.contains(focused) || !focused._cuDate) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      focused.click();
      return;
    }
    var cur = focused._cuDate;
    var y = cur.getFullYear(),
      m = cur.getMonth(),
      d = cur.getDate();
    var target;
    if (e.key === "ArrowRight") target = new Date(y, m, d + 1);
    else if (e.key === "ArrowLeft") target = new Date(y, m, d - 1);
    else if (e.key === "ArrowDown") target = new Date(y, m, d + 7);
    else if (e.key === "ArrowUp") target = new Date(y, m, d - 7);
    else if (e.key === "Home") target = new Date(y, m, 1);
    else if (e.key === "End") target = new Date(y, m + 1, 0);
    else return;
    e.preventDefault();
    if (minDate && target < minDate) target = minDate;
    if (maxDate && target > maxDate) target = maxDate;
    if (target.getMonth() !== currentMonth || target.getFullYear() !== currentYear) {
      currentMonth = target.getMonth();
      currentYear = target.getFullYear();
      render();
    }
    focusDate(target);
  });

  render();
}
