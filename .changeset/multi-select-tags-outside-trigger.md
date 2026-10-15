---
"cubby-ui": minor
---

**Multi Select** 標籤移出 trigger，移除按鈕不再是巢狀互動元素：JS 產生的標籤移除 `<button>` 原本渲染在 trigger `<button>` 內（HTML 不允許的巢狀互動內容，且未指定 `type`，在 `<form>` 內預設為 submit）。新結構以 `cu-multi-select-control`（外框）包住 `data-cu-multi-select-tags` 與 trigger 兩個兄弟元素，placeholder 放在 trigger 內；移除按鈕為 `type="button"` 並保留 `data-cu-multi-select-remove-text` 的名稱，在 Tab 順序中位於 trigger 之前，以鍵盤移除後焦點移到下一個標籤的移除按鈕（最後一個之後為 trigger）；點擊外框空白處同樣開啟面板；標籤遮住 placeholder 時 trigger 以 `aria-labelledby` 保留其文字作為名稱（已有 `aria-label` / `aria-labelledby` / `<label for>` 時除外）；trigger 鍵盤焦點時外框顯示焦點環，移除按鈕也有焦點環。舊結構（標籤容器在 trigger 內）初始化時會自動轉換，外觀不變；`cu-multi-select-trigger` 的外框樣式移到新的 `cu-multi-select-control`，自訂了 trigger 外框樣式的專案請改套在 control 上
