---
"cubby-ui": patch
---

修正 Laravel Blade 元件的使用者 `style` 被忽略，以及 Spinner 把後續內容包進去的問題。

- **Resizable Panel**：傳入 `style` 時 `default-size` 的 `flex-grow` 不再失效；元件的 `flex-grow` 與使用者的 style 合併為單一 `style` 屬性（如 `style="flex-grow: 30; min-width: 0;"`）
- **Marquee**：使用者傳入的 `style` 不再被 `--cu-marquee-duration` 蓋掉，兩者合併輸出
- **Spinner**：Blade 版不再輸出自閉合的 `<span … />`。瀏覽器會忽略非 void 元素的 `/>`，原本 Spinner 後面的兄弟元素會被包進 spinner、跟著一起旋轉；改為輸出 `<span …></span>`
- `npm run test:blade` 新增檢查：同一標籤同時有靜態 `style` 與帶使用者 style 的 `$attributes`、非 void 元素自閉合；render smoke test 另以 DOM 確認使用者傳入的 `style` 有生效
