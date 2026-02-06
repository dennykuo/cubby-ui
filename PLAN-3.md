# Cubby UI — 改善建議（第三輪）

前 23 項已全部完成。以下是基於全面程式碼審查的新改善建議，按分類整理。

---

## A. JS 安全與一致性

### A1. Toast close button `innerHTML` → DOM API
**檔案：** `src/scripts/cubby-ui.js:616-617`
**問題：** Toast close button 的 SVG 使用 `innerHTML` 注入，與 CLAUDE.md 記載的「Toast 使用 DOM API 建立，避免 innerHTML XSS 風險」原則不一致。其餘所有 Toast 內容都正確地使用了 `textContent` / `createElement()`。
**修改：** 改用 `document.createElementNS()` 建立 SVG 元素。

### A2. Dropdown 缺少 `aria-expanded` 切換
**檔案：** `src/scripts/cubby-ui.js:124-137`
**問題：** Menubar 已正確管理 `aria-expanded`（63 行），但 Dropdown 的 trigger 在開合時未切換 `aria-expanded` 屬性。
**修改：** 在 `setupDropdowns()` 中 toggle `hidden` 時同步設定 trigger 的 `aria-expanded`。

### A3. Combobox / Multi Select 缺少 ARIA 屬性
**檔案：** `src/scripts/cubby-ui.js:140-292`
**問題：** Combobox 和 Multi Select 是複雜互動元件，但未設定 WAI-ARIA 角色屬性。
**修改：**
- Combobox trigger: `aria-expanded`、`aria-haspopup="listbox"`
- Combobox content: `role="listbox"`
- Combobox item: `role="option"`、`aria-selected`
- Multi Select: 同上模式

### A4. Combobox / Multi Select / Dropdown 鍵盤導航
**檔案：** `src/scripts/cubby-ui.js`
**問題：** 這三個浮層元件僅支援 Escape 關閉，缺少上下箭頭鍵選項導航。
**修改：** 在各元件 content 可見時攔截 ArrowUp / ArrowDown / Enter，管理焦點高亮。

---

## B. CSS 品質

### B1. Pagination 元素缺少 disabled hover 中和
**檔案：** `src/styles/components/pagination.css:19-22`
**問題：** `cu-pagination-prev/next` 有 `disabled:pointer-events-none disabled:opacity-50`，但帶有 `hover:bg-accent` 效果。按照 CLAUDE.md 的慣例，帶有 hover border/background 的 disabled 元素應加上 hover 中和。雖然 `pointer-events-none` 已阻止 hover，仍建議保持一致性。
**修改：** 可選 — 低優先度，因 `pointer-events-none` 已涵蓋。

### B2. Dropdown / Menubar item 重複樣式
**檔案：** `dropdown.css:15-16`、`menubar.css:27-28`
**問題：** `.cu-dropdown-item` 和 `.cu-menubar-item` 幾乎相同（`rounded-md px-2 py-1.5 text-sm transition-colors duration-150 hover:bg-accent hover:text-accent-foreground outline-none`）。
**修改：** 可考慮用逗號選擇器去重（類似 `listbox.css` 模式），或保持目前結構以維持獨立性。

---

## C. 文件與範例

### C1. 更新 CLAUDE.md Separator 章節
**問題：** CLAUDE.md 仍寫「Separator 預設為 horizontal（`h-px w-full`）」，但上一輪已改為 base class 不含方向，需要明確使用 `cu-separator-horizontal` 或 `cu-separator-vertical`。
**修改：** 更新 CLAUDE.md 相關描述。
