---
"cubby-ui": patch
---

**型別定義** `DATA_ATTRS` 補上以 `el.dataset` 讀取、先前漏列的屬性：`RESIZABLE_MIN_SIZE`（`data-cu-min-size`）、`RESIZABLE_MAX_SIZE`（`data-cu-max-size`）、`COLOR_PICKER_VALUE`（`data-cu-color-picker-value`）；`npm run check:sync` 的 DATA_ATTRS 對照改為同時偵測 `dataset.cuXxx` / `dataset["cuXxx"]` 的 camelCase 存取
