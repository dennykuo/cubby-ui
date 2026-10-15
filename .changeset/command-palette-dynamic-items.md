---
"cubby-ui": patch
---

**Command Palette** 項目只在初始化時收集一次，之後新增的項目（例如遠端搜尋結果）不會被篩選、方向鍵選不到、沒有 `role="option"`，`CubbyUI.refresh()` 也因已初始化而略過。改為每次即時查詢項目，清單內容變動時（MutationObserver）立即套用 ARIA 與目前查詢的篩選並更新無結果提示；選中項目被移除時改選第一個可見項目；滑鼠選中改用事件委派；`refresh()` / `init()` 會重新同步已初始化的 palette
