---
"cubby-ui": patch
---

**焦點環** `ring-offset-*` 的間隙色改為跟隨 `--color-background`，暗色模式下 Button、Checkbox、Radio、Rating 等元件的焦點環外不再多出一圈白邊（Tailwind 預設為白色）；需要其他顏色時仍可用 `ring-offset-{color}` 覆寫
