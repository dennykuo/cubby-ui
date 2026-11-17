---
"cubby-ui": patch
---

**Forced colors（Windows 高對比）** Chart 圖例色塊原本會消失，而 `<canvas>` / SVG 繪製的系列保留原色，圖例就對不上系列：色塊改為保留與系列相同的顏色並加外框，格線、軸線、軸標籤改用系統色，載入中的長條不再消失；Skeleton 原本整塊消失，改以系統灰色顯示（shimmer 保留掃光）；Avatar 只有縮寫的 fallback 頭像加上圓形外框，Avatar group 重疊頭像之間的分隔外圈與 `cu-avatar-ring` 外圈不再消失（一般模式外觀不變）
