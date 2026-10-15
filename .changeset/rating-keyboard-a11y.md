---
"cubby-ui": minor
---

**Rating** 互動式評分支援鍵盤與螢幕閱讀器，依 WAI-ARIA APG Rating Radio Group：根元素加上 `role="radiogroup"`（名稱取自 `aria-label` / `aria-labelledby`，預設 "Rating"），每顆星為 `role="radio"` + `aria-checked`，roving tabindex 只留一個 Tab 停駐點（選取的星，未選取時為第一顆）。方向鍵移動並選取（頭尾循環，由右至左排版時左右對調）、Home / End 選取第一顆 / 最後一顆、Space / Enter 選取目前的星；`<span>` 星星標記同樣適用。星星名稱預設 "1 star" / "N stars"，新增根元素屬性 `data-cu-rating-star-text`（`{value}` 模板，例如 `"{value} 顆星"`）在地化，星星自帶的 `aria-label` 不會被覆寫；沒有 `type` 的 `<button>` 星星自動補上 `type="button"`，放在表單內不會送出。`cu-rating-readonly` 加上 `aria-readonly` 並保留 Tab 停駐點、`cu-rating-disabled` 加上 `aria-disabled` 並移出 Tab 順序（兩者仍不回應操作）。`<button>` 星星自行清除 UA 按鈕樣式。行為改變：初始化時依 `data-cu-rating-value` 同步填滿的星星；`cu:rating:change` 只在值改變時派發，重複點擊同一顆星不再派發
