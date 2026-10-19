---
"cubby-ui": patch
---

**焦點環** forced colors 模式（例如 Windows 高對比）會移除 box-shadow，以 `ring-*` 畫的焦點環原本會整個消失；現在 `:focus-visible` 在此模式下改以 `2px solid Highlight` 的 outline 顯示，涵蓋所有元件
