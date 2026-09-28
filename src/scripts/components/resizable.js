// ── Resizable Panels ─────────────────────────────────────────
export function setupResizables() {
  document.querySelectorAll("[data-cu-resizable]").forEach(function (container) {
    if (container._cuResizableInit) return;
    container._cuResizableInit = true;

    var panels = Array.from(container.querySelectorAll(":scope > [data-cu-resizable-panel]"));
    var handles = Array.from(container.querySelectorAll(":scope > [data-cu-resizable-handle]"));
    var isVertical = container.classList.contains("cu-resizable-vertical");

    if (panels.length < 2 || handles.length < 1) return;

    var defaultSize = 100 / panels.length;
    panels.forEach(function (panel) {
      if (!panel.style.flexGrow || panel.style.flexGrow === "0") {
        panel.style.flexGrow = String(defaultSize);
      }
    });

    function applyConstraints(panel, value, total) {
      var minSize = parseFloat(panel.dataset.cuMinSize);
      var maxSize = parseFloat(panel.dataset.cuMaxSize);
      if (!isNaN(minSize)) { var minGrow = (minSize / 100) * total; if (value < minGrow) value = minGrow; }
      if (!isNaN(maxSize)) { var maxGrow = (maxSize / 100) * total; if (value > maxGrow) value = maxGrow; }
      if (value < 0) value = 0;
      return value;
    }

    function startResize(startX, startY, handle, handleIndex) {
      var prevPanel = panels[handleIndex];
      var nextPanel = panels[handleIndex + 1];
      if (!prevPanel || !nextPanel) return;

      var containerRect = container.getBoundingClientRect();
      var containerSize = isVertical ? containerRect.height : containerRect.width;
      var totalHandleSize = 0;
      handles.forEach(function (h) { totalHandleSize += isVertical ? h.offsetHeight : h.offsetWidth; });
      var availableSize = containerSize - totalHandleSize;
      if (availableSize <= 0) return;

      var startPos = isVertical ? startY : startX;
      var prevGrow = parseFloat(prevPanel.style.flexGrow) || defaultSize;
      var nextGrow = parseFloat(nextPanel.style.flexGrow) || defaultSize;
      var totalGrow = prevGrow + nextGrow;
      var allGrow = 0;
      panels.forEach(function (p) { allGrow += parseFloat(p.style.flexGrow) || defaultSize; });

      handle.setAttribute("data-cu-resizing", "");
      document.body.style.cursor = isVertical ? "row-resize" : "col-resize";
      document.body.style.userSelect = "none";
      document.body.style.webkitUserSelect = "none";

      function onMove(clientX, clientY) {
        var currentPos = isVertical ? clientY : clientX;
        var delta = currentPos - startPos;
        var deltaGrow = (delta / availableSize) * allGrow;
        var newPrevGrow = applyConstraints(prevPanel, prevGrow + deltaGrow, totalGrow);
        var newNextGrow = totalGrow - newPrevGrow;
        newNextGrow = applyConstraints(nextPanel, newNextGrow, totalGrow);
        newPrevGrow = totalGrow - newNextGrow;
        prevPanel.style.flexGrow = String(newPrevGrow);
        nextPanel.style.flexGrow = String(newNextGrow);
      }

      function onMouseMove(e) { onMove(e.clientX, e.clientY); }
      function onTouchMove(e) { if (e.touches.length === 1) onMove(e.touches[0].clientX, e.touches[0].clientY); }
      function onEnd() {
        handle.removeAttribute("data-cu-resizing");
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        document.body.style.webkitUserSelect = "";
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onEnd);
        document.removeEventListener("touchmove", onTouchMove);
        document.removeEventListener("touchend", onEnd);
      }

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onEnd);
      document.addEventListener("touchmove", onTouchMove, { passive: false });
      document.addEventListener("touchend", onEnd);
    }

    handles.forEach(function (handle, i) {
      handle.addEventListener("mousedown", function (e) { e.preventDefault(); startResize(e.clientX, e.clientY, handle, i); });
      handle.addEventListener("touchstart", function (e) {
        if (e.touches.length !== 1) return;
        e.preventDefault();
        startResize(e.touches[0].clientX, e.touches[0].clientY, handle, i);
      }, { passive: false });

      handle.addEventListener("keydown", function (e) {
        var step = 5;
        var delta = 0;
        if (!isVertical && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
          delta = e.key === "ArrowLeft" ? -step : step;
        } else if (isVertical && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
          delta = e.key === "ArrowUp" ? -step : step;
        }
        if (delta === 0) return;
        e.preventDefault();
        var prevPanel = panels[i];
        var nextPanel = panels[i + 1];
        if (!prevPanel || !nextPanel) return;
        var prevGrow = parseFloat(prevPanel.style.flexGrow) || defaultSize;
        var nextGrow = parseFloat(nextPanel.style.flexGrow) || defaultSize;
        var total = prevGrow + nextGrow;
        var newPrev = applyConstraints(prevPanel, prevGrow + delta, total);
        var newNext = total - newPrev;
        newNext = applyConstraints(nextPanel, newNext, total);
        newPrev = total - newNext;
        prevPanel.style.flexGrow = String(newPrev);
        nextPanel.style.flexGrow = String(newNext);
      });
    });
  });
}
