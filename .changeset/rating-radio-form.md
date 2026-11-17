---
"cubby-ui": minor
---

**Rating** 新增不需 JS 的表單評分寫法：每顆星寫成 `<label class="cu-rating-label">`，包住 visually hidden 的 `<input type="radio" class="cu-rating-input">`（同一 `name`）與星星 svg，選取值隨表單送出。選取的星與其前面的星以 CSS `:has()` 填滿、滑鼠指到時預覽星等，鍵盤操作（Tab 停在選取的星、方向鍵切換）由原生 radio group 提供，支援 `checked` / `required` / `disabled`；forced colors（Windows 高對比）下同樣以系統色實心 / 空心區分，焦點以外框顯示。Astro `Rating` 與 Blade `<x-cu.rating>` 新增 `name` prop（輸出這種寫法，`value` 四捨五入為預設選取的星等）與 `starText` / `star-text`（星星名稱模板，例如 `"{value} 顆星"`），兩種模式傳入的 `aria-label` 都會取代預設名稱，不再重複輸出兩個 `aria-label`
