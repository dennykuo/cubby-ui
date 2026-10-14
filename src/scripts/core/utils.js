// Shared keyboard navigation helper for floating panels
export function navigateItems(items, key, highlightClass) {
  var visible = [];
  items.forEach(function (item) {
    if (
      !item.hasAttribute("hidden") &&
      !item.hasAttribute("disabled") &&
      !item.classList.contains("pointer-events-none")
    )
      visible.push(item);
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

  // 清除所有項目的高亮（含已被篩選隱藏的項目），確保同時只有一個高亮
  items.forEach(function (item) {
    item.classList.remove(highlightClass);
  });
  visible[next].classList.add(highlightClass);
  visible[next].scrollIntoView({ block: "nearest" });
}

export function genId(prefix) {
  return prefix + "-" + Math.random().toString(36).slice(2, 9);
}

// Mirror the keyboard highlight (highlightClass) of a listbox popup onto owner's aria-activedescendant
// (APG combobox: DOM focus stays on owner). The highlight changes in several places — document keydown
// navigation, filtering, closing — so observe class / hidden changes instead of hooking each one.
// Cleared while the popup (container) is hidden or no visible item is highlighted.
export function trackActiveDescendant(owner, container, highlightClass, idPrefix) {
  function sync() {
    var active = container.hasAttribute("hidden")
      ? null
      : container.querySelector("." + highlightClass + ":not([hidden])");
    if (active) {
      if (!active.id) active.id = genId(idPrefix);
      if (owner.getAttribute("aria-activedescendant") !== active.id)
        owner.setAttribute("aria-activedescendant", active.id);
    } else if (owner.hasAttribute("aria-activedescendant")) {
      owner.removeAttribute("aria-activedescendant");
    }
  }
  sync();
  new MutationObserver(sync).observe(container, {
    attributes: true,
    attributeFilter: ["class", "hidden"],
    subtree: true,
  });
}

// Combobox / Multi Select ARIA (WAI-ARIA APG combobox pattern). The element keeping DOM focus while the
// popup is open owns aria-activedescendant: the search input (role="combobox", filters the list →
// aria-autocomplete="list"; it only exists inside the open popup → aria-expanded="true"), or, without a
// search input, the trigger itself (APG select-only combobox — role="button" does not support
// aria-activedescendant, so the trigger becomes role="combobox"; it keeps aria-haspopup / aria-expanded).
export function setupComboboxAria(trigger, input, content, list, highlightClass, idPrefix) {
  if (!list.id) list.id = genId(idPrefix + "-listbox");
  if (trigger) trigger.setAttribute("aria-controls", list.id);
  if (input) {
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-autocomplete", "list");
    input.setAttribute("aria-expanded", "true");
    input.setAttribute("aria-controls", list.id);
  } else if (trigger) {
    trigger.setAttribute("role", "combobox");
  }
  var owner = input || trigger;
  if (owner) trackActiveDescendant(owner, content, highlightClass, idPrefix + "-option");
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
