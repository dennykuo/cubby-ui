// ── Color Picker ──────────────────────────────────────────────
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
    var hueBar = picker.querySelector("[data-cu-color-picker-hue]");
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

    function update() {
      var rgb = hsvToRgb(state.h, state.s, state.v);
      var hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
      var pureRgb = hsvToRgb(state.h, 1, 1);
      satPanel.style.backgroundColor = rgbToHex(pureRgb[0], pureRgb[1], pureRgb[2]);
      if (satPointer) { satPointer.style.left = (state.s * 100) + "%"; satPointer.style.top = ((1 - state.v) * 100) + "%"; }
      if (huePointer) huePointer.style.left = (state.h / 360 * 100) + "%";
      if (preview) preview.style.backgroundColor = hex;
      if (hexInput && document.activeElement !== hexInput) hexInput.value = hex;
      if (hiddenInput) hiddenInput.value = hex;
    }

    function makeDragHandler(onDrag) {
      return function (e) {
        e.preventDefault();
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

    var onSatDrag = makeDragHandler(function (clientX, clientY) {
      var rect = satPanel.getBoundingClientRect();
      state.s = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      state.v = Math.max(0, Math.min(1, 1 - (clientY - rect.top) / rect.height));
      update();
    });
    satPanel.addEventListener("mousedown", onSatDrag);
    satPanel.addEventListener("touchstart", onSatDrag, { passive: false });

    var onHueDrag = makeDragHandler(function (clientX) {
      var rect = hueBar.getBoundingClientRect();
      state.h = Math.max(0, Math.min(360, (clientX - rect.left) / rect.width * 360));
      update();
    });
    hueBar.addEventListener("mousedown", onHueDrag);
    hueBar.addEventListener("touchstart", onHueDrag, { passive: false });

    if (hexInput) {
      hexInput.addEventListener("input", function () {
        var val = hexInput.value.trim();
        if (/^#[0-9a-fA-F]{6}$/.test(val)) {
          var rgb = hexToRgb(val);
          var hsv = rgbToHsv(rgb[0], rgb[1], rgb[2]);
          state.h = hsv[0]; state.s = hsv[1]; state.v = hsv[2];
          update();
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
          update();
        }
      });
    });

    update();
  });
}
