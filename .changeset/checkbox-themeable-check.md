---
"cubby-ui": minor
---

**Checkbox** 勾勾改以 `::before` + `mask` 繪製、顏色取 `--color-primary-foreground`，不再固定為白色，淺色品牌主色搭配深色前景時勾勾仍清楚可見；新增 `:indeterminate` 的橫線樣式（原本半選狀態看不出來），並在 Windows 高對比模式下改用 `CanvasText`
