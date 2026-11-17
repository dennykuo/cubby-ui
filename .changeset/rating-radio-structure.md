---
"cubby-ui": minor
---

**破壞性變更** **Rating** 舊的 radio 樣式（`<input class="cu-rating-input">` 後面接同層的 `<label class="cu-rating-label">`）不再套用：這個寫法選取時只有該顆星變色，`cu-rating-label` 也沒有基本樣式；`cu-rating-label-fill` 一併移除。請改用 label 包住 radio 的結構 `<label class="cu-rating-label"><input type="radio" class="cu-rating-input" …>星星 svg</label>`（見 Rating 文檔頁「表單（不需 JS）」），或在 Astro / Blade 元件傳入 `name`。只用 `cu-rating-item` 的展示評分與 `data-cu-rating` 互動評分不受影響
