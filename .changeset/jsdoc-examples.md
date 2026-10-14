---
"cubby-ui": patch
---

**components.json / llms.txt** Dialog、Drawer、Alert Dialog 範例的 `<dialog>` 缺少 `data-cu-dialog` / `data-cu-drawer` / `data-cu-alert-dialog`（照抄時關閉按鈕、backdrop 點擊與焦點返回都不會生效），Dialog 範例另缺 footer 的結束標籤；notes 註明這些屬性為必要。互動元件 JSDoc 的 HTML 範例（Dialog、Drawer、Alert Dialog、Multi Select、Data Table Expandable、Rating）同步修正，並以 E2E 測試直接驗證 JSDoc 範例可運作
