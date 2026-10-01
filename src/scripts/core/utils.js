// Shared keyboard navigation helper for floating panels
export function navigateItems(items, key, highlightClass) {
  var visible = [];
  items.forEach(function (item) {
    if (!item.hasAttribute("hidden") && !item.hasAttribute("disabled") && !item.classList.contains("pointer-events-none")) visible.push(item);
  });
  if (visible.length === 0) return;

  var current = -1;
  for (var i = 0; i < visible.length; i++) {
    if (visible[i].classList.contains(highlightClass)) {
      current = i;
      break;
    }
  }

  var next;
  if (key === "Home") {
    next = 0;
  } else if (key === "End") {
    next = visible.length - 1;
  } else if (key === "ArrowDown") {
    next = current < visible.length - 1 ? current + 1 : 0;
  } else {
    next = current > 0 ? current - 1 : visible.length - 1;
  }

  if (current >= 0) visible[current].classList.remove(highlightClass);
  visible[next].classList.add(highlightClass);
  visible[next].scrollIntoView({ block: "nearest" });
}

export function genId(prefix) {
  return prefix + "-" + Math.random().toString(36).slice(2, 9);
}

// Round to step precision to avoid floating-point drift (e.g. 0.1 + 0.2)
export function roundToStep(value, step) {
  if (step >= 1) return Math.round(value / step) * step;
  var decimals = (String(step).split(".")[1] || "").length;
  return Number(value.toFixed(decimals));
}

export function clampValue(value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

// Read a millisecond delay from a data attribute; missing / invalid / <= 0 → 0 (run immediately)
export function readDelay(el, attr) {
  var ms = parseInt(el.getAttribute(attr), 10);
  return ms > 0 ? ms : 0;
}

// Debounced runner: run(delay) with delay <= 0 calls fn synchronously.
// flush() runs a pending call now; cancel() drops it.
export function createDebouncer(fn) {
  var timer = null;
  function cancel() {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  }
  return {
    run: function (delay) {
      cancel();
      if (delay > 0) {
        timer = setTimeout(function () {
          timer = null;
          fn();
        }, delay);
      } else {
        fn();
      }
    },
    flush: function () {
      if (timer === null) return;
      cancel();
      fn();
    },
    cancel: cancel,
  };
}
