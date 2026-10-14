---
"cubby-ui": minor
---

**Image Compare** 讀取文檔記載的 `data-cu-image-compare-position`（0–100，預設 50，超出範圍夾住；先前一律從 50 開始）；把手改為可聚焦的 `role="slider"`（`aria-valuenow` / `aria-valuetext` / `aria-orientation`，預設名稱 "Image comparison"，可用把手的 `aria-label` 覆寫），支援方向鍵 ±1、Page Up / Page Down ±10、Home / End，垂直模式 ↓ 為增加；鍵盤焦點時握把顯示焦點環
