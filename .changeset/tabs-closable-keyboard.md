---
"cubby-ui": minor
---

**Tabs** 可關閉的 tab 改用鍵盤 Delete 關閉，關閉圖示不再是巢狀互動元素：文檔原本把 `role="button" tabindex="0"` 的關閉圖示放在 `role="tab"` 的 trigger 內（tab 的子元素對輔助技術為 presentational，且按 Enter 也無法關閉）。JS 現在一律把 `[data-cu-tabs-close]` 設為 `aria-hidden="true"` 並移除 `role` / `tabindex`（舊標記自動修正），可關閉的 trigger 加上 `aria-keyshortcuts="Delete"`，在聚焦的可關閉 tab 上按 Delete（或 Backspace）即關閉。**行為改變**：關閉啟用中的 tab 時改為啟用後一個 tab（沒有則前一個），不再是剩下的第一個；焦點在被關閉的 tab 上時一併移過去
