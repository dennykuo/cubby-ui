---
"cubby-ui": minor
---

**Color Picker** 支援鍵盤並新增 `cu:color-picker:change` 事件：飽和度面板與色相條成為可聚焦的 `role="slider"`（預設名稱 "Saturation and brightness" / "Hue"，可用 `aria-label` 覆寫；面板以 `aria-valuetext` 同時描述飽和度與亮度）。面板 ← / → 調整飽和度、↑ / ↓ 調整亮度（Shift ×10）、Page Up / Page Down 亮度 ±10%、Home / End 飽和度 0 / 100%；色相條方向鍵 ±1°（Shift ×10）、Page Up / Page Down ±10°、Home / End。使用者拖曳（持續派發）、鍵盤、輸入有效 hex 或點色票改變顏色時，於根元素派發 `cu:color-picker:change`（`detail.value` 為 `#rrggbb`，冒泡；初始化與色碼未變時不派發）；拖曳開始時焦點移到面板 / 色相條，之後可直接用方向鍵微調，並顯示焦點環
