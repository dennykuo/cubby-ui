---
"cubby-ui": minor
---

**Rating** 新增不需 JS 的表單評分寫法：每顆星寫成 `<label class="cu-rating-label">`，包住 visually hidden 的 `<input type="radio" class="cu-rating-input">`（同一 `name`）與星星 svg，選取值隨表單送出。選取的星與其前面的星以 CSS `:has()` 填滿、滑鼠指到時預覽星等，鍵盤操作（Tab 停在選取的星、方向鍵切換）由原生 radio group 提供，支援 `checked` / `required` / `disabled`；forced colors（Windows 高對比）下同樣以系統色實心 / 空心區分，焦點以外框顯示。原本未完成的 radio 樣式（`cu-rating-input` 後接同層 `cu-rating-label`，選取時只有該顆星變色）不再套用，請改用上述 label 包住 radio 的結構
