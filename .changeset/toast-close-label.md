---
"cubby-ui": patch
---

**Toast** JS 產生的關閉按鈕補上可讀名稱（`aria-label`，預設 `Close`）與 `type="button"`，圖示加 `aria-hidden`；可在容器以 `data-cu-toast-close-text` 覆寫名稱（例如 `關閉通知`）
