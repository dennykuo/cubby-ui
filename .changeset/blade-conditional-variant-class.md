---
"cubby-ui": patch
---

修正 Laravel Blade 元件部分 variant / size 值沒有作用的問題。Astro 原始碼以 `variant === "x" ? … : undefined` 寫成的條件 class 在轉換時被略過，Blade 版傳入這些值不會加上對應 class：

- **Back to Top**：`variant="primary"`（`cu-back-to-top-primary`）
- **Countdown**：`variant="flush"`（`cu-countdown-flush`）
- **Paragraph**：`variant="lead"`（`cu-p-lead`）
- **Speed Dial**：`size="sm"`（`cu-speed-dial-sm`）
- **Toggle Group**：`variant="outline"`（`cu-toggle-group-outline`）

轉換器遇到無法解析的 `class:list` 項目時改為讓該元件轉換失敗，不再靜默略過。
