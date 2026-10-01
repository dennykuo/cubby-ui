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
  if (minAttr) { var mp = minAttr.split("-"); minDate = new Date(parseInt(mp[0]), parseInt(mp[1]) - 1, parseInt(mp[2])); minDate.setHours(0, 0, 0, 0); }
  if (maxAttr) { var xp = maxAttr.split("-"); maxDate = new Date(parseInt(xp[0]), parseInt(xp[1]) - 1, parseInt(xp[2])); maxDate.setHours(0, 0, 0, 0); }

  function render() {
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    header.textContent = monthNames[currentMonth] + " " + currentYear;

    if (prevBtn) {
      if (minDate) { var prevMonth = new Date(currentYear, currentMonth, 0); prevBtn.disabled = prevMonth < minDate; } else { prevBtn.disabled = false; }
    }
    if (nextBtn) {
      if (maxDate) { var nextMonthFirst = new Date(currentYear, currentMonth + 1, 1); nextBtn.disabled = nextMonthFirst > maxDate; } else { nextBtn.disabled = false; }
    }

    grid.innerHTML = "";
    var firstDay = new Date(currentYear, currentMonth, 1).getDay();
    var daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    var daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    for (var p = firstDay - 1; p >= 0; p--) { grid.appendChild(createDayButton(daysInPrevMonth - p, currentMonth - 1, currentYear, true)); }
    for (var d = 1; d <= daysInMonth; d++) { grid.appendChild(createDayButton(d, currentMonth, currentYear, false)); }
    var totalCells = grid.children.length;
    var remaining = totalCells <= 35 ? 35 - totalCells : 42 - totalCells;
    for (var n = 1; n <= remaining; n++) { grid.appendChild(createDayButton(n, currentMonth + 1, currentYear, true)); }
  }

  function createDayButton(day, month, year, isOutside) {
    var date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);
    var btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = day;
    var classes = ["cu-calendar-day"];
    var isToday = date.getTime() === today.getTime();
    var isSelected = selectedDate && date.getTime() === selectedDate.getTime();
    if (isOutside) classes.push("cu-calendar-day-outside");
    if (isToday && !isSelected) classes.push("cu-calendar-day-today");
    if (isSelected) classes.push("cu-calendar-day-selected");
    var isDisabled = false;
    if (minDate && date < minDate) isDisabled = true;
    if (maxDate && date > maxDate) isDisabled = true;
    if (isDisabled) { classes.push("cu-calendar-day-disabled"); btn.disabled = true; }
    btn.className = classes.join(" ");
    if (!isDisabled) {
      btn.addEventListener("click", function () {
        selectedDate = date;
        calendar._cuSelectedDate = date;
        if (isOutside) { currentMonth = date.getMonth(); currentYear = date.getFullYear(); }
        render();
        if (onSelect) onSelect(date);
      });
    }
    return btn;
  }

  if (prevBtn) { prevBtn.addEventListener("click", function () { currentMonth--; if (currentMonth < 0) { currentMonth = 11; currentYear--; } render(); }); }
  if (nextBtn) { nextBtn.addEventListener("click", function () { currentMonth++; if (currentMonth > 11) { currentMonth = 0; currentYear++; } render(); }); }

  grid.addEventListener("keydown", function (e) {
    var focused = /** @type {HTMLElement} */ (document.activeElement);
    if (!focused || !grid.contains(focused)) return;
    var buttons = Array.from(grid.querySelectorAll(".cu-calendar-day:not(.cu-calendar-day-disabled)"));
    var idx = buttons.indexOf(focused);
    if (idx === -1) return;
    var newIdx = idx;
    if (e.key === "ArrowRight") { e.preventDefault(); newIdx = idx + 1; }
    else if (e.key === "ArrowLeft") { e.preventDefault(); newIdx = idx - 1; }
    else if (e.key === "ArrowDown") { e.preventDefault(); newIdx = idx + 7; }
    else if (e.key === "ArrowUp") { e.preventDefault(); newIdx = idx - 7; }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); focused.click(); return; }
    if (newIdx >= 0 && newIdx < buttons.length) { buttons[newIdx].focus(); }
    else if (newIdx < 0 && prevBtn && !prevBtn.disabled) {
      prevBtn.click();
      setTimeout(function () { var nb = Array.from(grid.querySelectorAll(".cu-calendar-day:not(.cu-calendar-day-disabled)")); if (nb.length) nb[nb.length - 1].focus(); }, 0);
    } else if (newIdx >= buttons.length && nextBtn && !nextBtn.disabled) {
      nextBtn.click();
      setTimeout(function () { var nb = Array.from(grid.querySelectorAll(".cu-calendar-day:not(.cu-calendar-day-disabled)")); if (nb.length) nb[0].focus(); }, 0);
    }
  });

  calendar._cuRender = render;
  render();
}
