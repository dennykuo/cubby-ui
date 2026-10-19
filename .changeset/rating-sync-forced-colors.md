---
"cubby-ui": minor
---

**Rating** 以程式設定 `data-cu-rating-value`（例如 `el.setAttribute("data-cu-rating-value", "3")`）時，星星外觀、`aria-checked` 與 Tab 停駐點會自動同步，且不派發 `cu:rating:change`；`cu-rating-readonly` / `cu-rating-disabled` 可在初始化後隨時加上或移除，`aria-readonly` / `aria-disabled` 與操作限制跟著生效。forced colors 模式（例如 Windows 高對比）下，選取的星改用 `Highlight` 系統色實心、未選取的星為空心外框，不再全部變成同一個顏色
