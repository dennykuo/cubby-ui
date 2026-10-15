---
"cubby-ui": minor
---

**Context Menu** 支援鍵盤：容器自動可聚焦（`tabindex="0"`，已有 `tabindex` 時保留），在容器或其內的聚焦元素按 Shift+F10 / ContextMenu 鍵會在聚焦元素上開啟選單並高亮第一個項目；選單為取得焦點的 `role="menu"`（`aria-activedescendant` 指向高亮項目，項目 `role="menuitem"`、分隔線 `role="separator"`），↑ / ↓ 循環並略過停用項目、Home / End、Enter / Space 執行、Esc / Tab 關閉，關閉後焦點回到開啟前的元素。滑鼠右鍵開啟時選單同樣取得焦點，可改用方向鍵操作；滑鼠移入項目時高亮跟隨
