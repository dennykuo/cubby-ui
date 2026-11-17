---
"cubby-ui": patch
---

**Toggle** 修正 `components.json` 的 `example` 與 `llms.txt` 範例結構：原本把 `cu-toggle` 放在 `<input>` 上，照抄只會出現沒有樣式的原生 checkbox（沒有軌道與滑塊）；改為與 CSS 及文檔頁一致的 `<label class="cu-toggle-wrapper">` + `cu-toggle-input` + `<span class="cu-toggle">` 軌道 + `cu-toggle-thumb`，`cssClasses` 補上 `cu-toggle-input` / `cu-toggle-thumb`，`notes` 說明軌道必須緊接在 checkbox 之後
