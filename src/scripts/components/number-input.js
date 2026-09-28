import { registry } from "../core/registry.js";
import { roundToStep, clampValue } from "../core/utils.js";

/**
 * Number Input — increment/decrement buttons for a numeric input field.
 *
 * HTML structure:
 * ```html
 * <div class="cu-number-input" data-cu-number-input>
 *   <button data-cu-number-decrement>−</button>
 *   <input type="number" data-cu-number-field min="0" max="100" step="1" value="0">
 *   <button data-cu-number-increment>+</button>
 * </div>
 * ```
 * - Uses native `<input type="number">` min/max/step attributes.
 * - On blur, sanitizes input: non-numeric → 0, then clamps and rounds to step.
 * - ARIA: adds role="spinbutton" + aria-valuemin/max/now automatically.
 */
export function setupNumberInputs() {
  document
    .querySelectorAll("[data-cu-number-input]")
    .forEach(function (container) {
      if (container._cuInit) return;
      container._cuInit = true;

      var field = container.querySelector("[data-cu-number-field]");
      var decrement = container.querySelector("[data-cu-number-decrement]");
      var increment = container.querySelector("[data-cu-number-increment]");
      if (!field) return;

      var getStep = function () { return Number(field.step) || 1; };
      var getMin = function () { return field.min !== "" ? Number(field.min) : -Infinity; };
      var getMax = function () { return field.max !== "" ? Number(field.max) : Infinity; };

      // ARIA: spinbutton semantics
      field.setAttribute("role", "spinbutton");
      if (field.min !== "") field.setAttribute("aria-valuemin", field.min);
      if (field.max !== "") field.setAttribute("aria-valuemax", field.max);
      field.setAttribute("aria-valuenow", field.value);
      field.addEventListener("input", function () {
        field.setAttribute("aria-valuenow", field.value);
      });

      decrement &&
        decrement.addEventListener("click", function () {
          var current = Number(field.value) || 0;
          var next = roundToStep(current - getStep(), getStep());
          if (next >= getMin()) {
            field.value = next;
            field.dispatchEvent(new Event("input", { bubbles: true }));
          }
        });

      increment &&
        increment.addEventListener("click", function () {
          var current = Number(field.value) || 0;
          var next = roundToStep(current + getStep(), getStep());
          if (next <= getMax()) {
            field.value = next;
            field.dispatchEvent(new Event("input", { bubbles: true }));
          }
        });

      // Sanitize manual input on blur: filter non-numeric, clamp to min/max, round to step
      field.addEventListener("change", function () {
        var raw = field.value.trim();
        if (raw === "" || isNaN(Number(raw))) {
          field.value = clampValue(0, getMin(), getMax());
        } else {
          field.value = clampValue(roundToStep(Number(raw), getStep()), getMin(), getMax());
        }
        field.dispatchEvent(new Event("input", { bubbles: true }));
      });

      registry.numberInputs.push({ el: container });
    });
}
