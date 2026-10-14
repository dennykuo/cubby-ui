// ── Color Picker ──────────────────────────────────────────────
/**
 * Color Picker — HSV saturation / brightness panel, hue slider, hex input and optional swatches.
 *
 * HTML structure:
 * ```html
 * <div class="cu-color-picker" data-cu-color-picker data-cu-color-picker-value="#3b82f6">
 *   <div class="cu-color-picker-saturation" data-cu-color-picker-saturation>
 *     <div class="cu-color-picker-saturation-pointer" data-cu-color-picker-saturation-pointer></div>
 *   </div>
 *   <div class="cu-color-picker-hue" data-cu-color-picker-hue>
 *     <div class="cu-color-picker-hue-pointer" data-cu-color-picker-hue-pointer></div>
 *   </div>
 *   <div class="cu-color-picker-controls">
 *     <div class="cu-color-picker-preview" data-cu-color-picker-preview></div>
 *     <input type="text" class="cu-color-picker-input" data-cu-color-picker-input maxlength="7">
 *   </div>
 *   <input type="hidden" data-cu-color-picker-hidden>
 *   <div class="cu-color-picker-swatches">
 *     <button type="button" class="cu-color-picker-swatch" data-cu-color-picker-swatch="#ef4444" aria-label="Select #ef4444"></button>
 *   </div>
 * </div>
 * ```
 * - Initial color: the hidden input's value, else `data-cu-color-picker-value` (default `#ff0000`).
 * - Keyboard: the saturation panel and the hue bar become focusable `role="slider"` elements
 *   (default names "Saturation and brightness" / "Hue"; override with `aria-label`).
 *   Saturation panel: ← / → saturation ±1%, ↑ / ↓ brightness ±1% (Shift ×10), Page Up / Page Down brightness ±10%,
 *   Home / End saturation 0 / 100%. Hue bar: ← / ↓ −1°, → / ↑ +1° (Shift ×10), Page Up / Page Down ±10°,
 *   Home / End 0° / 360°.
 * - Fires `cu:color-picker:change` ({ value: "#rrggbb" }, bubbles) whenever the user changes the color — dragging
 *   (continuously), keyboard, a valid hex input or a swatch; not on initialization, and not when the hex is unchanged.
 */
export function setupColorPickers() {
  function hsvToRgb(h, s, v) {
    h = h / 360;
    var i = Math.floor(h * 6), f = h * 6 - i;
    var p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s);
    var r, g, b;
    switch (i % 6) {
      case 0: r = v; g = t; b = p; break; case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t; break; case 3: r = p; g = q; b = v; break;
      case 4: r = t; g = p; b = v; break; case 5: r = v; g = p; b = q; break;
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(function (c) { return c.toString(16).padStart(2, "0"); }).join("");
  }

  function hexToRgb(hex) {
    hex = hex.replace("#", "");
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
  }

  function rgbToHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max, d = max - min;
    s = max === 0 ? 0 : d / max;
    if (max === min) { h = 0; } else {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return [h * 360, s, v];
  }

  document.querySelectorAll("[data-cu-color-picker]").forEach(function (/** @type {HTMLElement} */ picker) {
    if (picker._cuInit) return;
    picker._cuInit = true;

    var satPanel = /** @type {HTMLElement} */ (picker.querySelector("[data-cu-color-picker-saturation]"));
    var satPointer = /** @type {HTMLElement} */ (picker.querySelector("[data-cu-color-picker-saturation-pointer]"));
    var hueBar = /** @type {HTMLElement} */ (picker.querySelector("[data-cu-color-picker-hue]"));
    var huePointer = /** @type {HTMLElement} */ (picker.querySelector("[data-cu-color-picker-hue-pointer]"));
    var preview = /** @type {HTMLElement} */ (picker.querySelector("[data-cu-color-picker-preview]"));
    var hexInput = /** @type {HTMLInputElement} */ (picker.querySelector("[data-cu-color-picker-input]"));
    var hiddenInput = /** @type {HTMLInputElement} */ (picker.querySelector("[data-cu-color-picker-hidden]"));
    var swatches = picker.querySelectorAll("[data-cu-color-picker-swatch]");
    if (!satPanel || !hueBar) return;

    var state = { h: 0, s: 1, v: 1 };
    var initValue = (hiddenInput && hiddenInput.value) || picker.dataset.cuColorPickerValue || "#ff0000";
    if (/^#[0-9a-fA-F]{3,6}$/.test(initValue)) {
      var rgb = hexToRgb(initValue);
      var hsv = rgbToHsv(rgb[0], rgb[1], rgb[2]);
      state.h = hsv[0]; state.s = hsv[1]; state.v = hsv[2];
    }

    // 鍵盤操作：飽和度面板（二維：aria-valuenow 為飽和度，aria-valuetext 同時描述亮度）與色相條皆為 APG slider
    function setupSlider(el, label, max) {
      el.setAttribute("role", "slider");
      if (!el.hasAttribute("tabindex")) el.tabIndex = 0;
      if (!el.hasAttribute("aria-label") && !el.hasAttribute("aria-labelledby")) el.setAttribute("aria-label", label);
      el.setAttribute("aria-valuemin", "0");
      el.setAttribute("aria-valuemax", String(max));
    }
    setupSlider(satPanel, "Saturation and brightness", 100);
    setupSlider(hueBar, "Hue", 360);

    var lastHex = "";
    // notify：使用者操作（拖曳、鍵盤、hex 輸入、色票）造成的變更才派發 cu:color-picker:change，色碼未變時不重複派發
    function update(notify) {
      var rgb = hsvToRgb(state.h, state.s, state.v);
      var hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
      var pureRgb = hsvToRgb(state.h, 1, 1);
      satPanel.style.backgroundColor = rgbToHex(pureRgb[0], pureRgb[1], pureRgb[2]);
      if (satPointer) { satPointer.style.left = (state.s * 100) + "%"; satPointer.style.top = ((1 - state.v) * 100) + "%"; }
      if (huePointer) huePointer.style.left = (state.h / 360 * 100) + "%";
      if (preview) preview.style.backgroundColor = hex;
      if (hexInput && document.activeElement !== hexInput) hexInput.value = hex;
      if (hiddenInput) hiddenInput.value = hex;
      var sat = Math.round(state.s * 100);
      var bright = Math.round(state.v * 100);
      satPanel.setAttribute("aria-valuenow", String(sat));
      satPanel.setAttribute("aria-valuetext", "Saturation " + sat + "%, brightness " + bright + "%");
      hueBar.setAttribute("aria-valuenow", String(Math.round(state.h)));
      if (notify && hex !== lastHex) {
        picker.dispatchEvent(new CustomEvent("cu:color-picker:change", { bubbles: true, detail: { value: hex } }));
      }
      lastHex = hex;
    }

    function makeDragHandler(target, onDrag) {
      return function (e) {
        e.preventDefault();
        // preventDefault 會擋掉預設聚焦；手動聚焦，拖曳後可直接改用方向鍵微調
        target.focus({ preventScroll: true });
        var onMove = function (e2) {
          var clientX = e2.touches ? e2.touches[0].clientX : e2.clientX;
          var clientY = e2.touches ? e2.touches[0].clientY : e2.clientY;
          onDrag(clientX, clientY);
        };
        var onUp = function () {
          document.removeEventListener("mousemove", onMove);
          document.removeEventListener("mouseup", onUp);
          document.removeEventListener("touchmove", onMove);
          document.removeEventListener("touchend", onUp);
          document.body.style.userSelect = "";
        };
        document.body.style.userSelect = "none";
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
        document.addEventListener("touchmove", onMove, { passive: false });
        document.addEventListener("touchend", onUp);
        onMove(e);
      };
    }

    var onSatDrag = makeDragHandler(satPanel, function (clientX, clientY) {
      var rect = satPanel.getBoundingClientRect();
      state.s = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      state.v = Math.max(0, Math.min(1, 1 - (clientY - rect.top) / rect.height));
      update(true);
    });
    satPanel.addEventListener("mousedown", onSatDrag);
    satPanel.addEventListener("touchstart", onSatDrag, { passive: false });

    var onHueDrag = makeDragHandler(hueBar, function (clientX) {
      var rect = hueBar.getBoundingClientRect();
      state.h = Math.max(0, Math.min(360, (clientX - rect.left) / rect.width * 360));
      update(true);
    });
    hueBar.addEventListener("mousedown", onHueDrag);
    hueBar.addEventListener("touchstart", onHueDrag, { passive: false });

    // 以整數百分比 / 角度為步進基準（拖曳後的值可能帶小數）
    satPanel.addEventListener("keydown", function (e) {
      var step = e.shiftKey ? 10 : 1;
      var s = Math.round(state.s * 100);
      var v = Math.round(state.v * 100);
      if (e.key === "ArrowRight") s += step;
      else if (e.key === "ArrowLeft") s -= step;
      else if (e.key === "ArrowUp") v += step;
      else if (e.key === "ArrowDown") v -= step;
      else if (e.key === "PageUp") v += 10;
      else if (e.key === "PageDown") v -= 10;
      else if (e.key === "Home") s = 0;
      else if (e.key === "End") s = 100;
      else return;
      e.preventDefault(); // 避免方向鍵 / Page 鍵捲動頁面
      state.s = Math.max(0, Math.min(100, s)) / 100;
      state.v = Math.max(0, Math.min(100, v)) / 100;
      update(true);
    });

    hueBar.addEventListener("keydown", function (e) {
      var step = e.shiftKey ? 10 : 1;
      var h = Math.round(state.h);
      if (e.key === "ArrowRight" || e.key === "ArrowUp") h += step;
      else if (e.key === "ArrowLeft" || e.key === "ArrowDown") h -= step;
      else if (e.key === "PageUp") h += 10;
      else if (e.key === "PageDown") h -= 10;
      else if (e.key === "Home") h = 0;
      else if (e.key === "End") h = 360;
      else return;
      e.preventDefault();
      state.h = Math.max(0, Math.min(360, h));
      update(true);
    });

    if (hexInput) {
      hexInput.addEventListener("input", function () {
        var val = hexInput.value.trim();
        if (/^#[0-9a-fA-F]{6}$/.test(val)) {
          var rgb = hexToRgb(val);
          var hsv = rgbToHsv(rgb[0], rgb[1], rgb[2]);
          state.h = hsv[0]; state.s = hsv[1]; state.v = hsv[2];
          update(true);
        }
      });
    }

    swatches.forEach(function (/** @type {HTMLElement} */ swatch) {
      swatch.addEventListener("click", function () {
        var color = swatch.dataset.cuColorPickerSwatch;
        if (color && /^#[0-9a-fA-F]{3,6}$/.test(color)) {
          var rgb = hexToRgb(color);
          var hsv = rgbToHsv(rgb[0], rgb[1], rgb[2]);
          state.h = hsv[0]; state.s = hsv[1]; state.v = hsv[2];
          update(true);
        }
      });
    });

    update(false);
  });
}
