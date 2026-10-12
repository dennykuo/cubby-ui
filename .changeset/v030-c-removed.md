---
"cubby-ui": minor
---

移除

- `src/pages/examples/dashboard-v5/feedback/`：誤提交進版控的 12 個舊建置快照（`.html`，引用已不存在的 `/_astro/*.css`，部署後會是無樣式頁面），連帶移除 `check:links` 與 docs smoke test 為它設的例外
