---
"cubby-ui": minor
---

**破壞性變更** **Rating** 移除 `cubby-ui.d.ts` 的 `DATA_ATTRS.RATING_MAX`（`data-cu-rating-max`）：cubby-ui.js 從未讀取這個屬性，星數一律是 `[data-cu-rating-star]` 元素的數量（radio group 的大小即 radio 的數量）。標記中留著這個屬性不影響運作，只有在 TypeScript 中引用 `DATA_ATTRS.RATING_MAX` 的程式需要移除該引用
