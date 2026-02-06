# Cubby UI 專案審查報告

## 🔴 高優先級

### 1. JS 全域事件監聽器記憶體洩漏

**檔案：** `src/scripts/cubby-ui.js`（行 42-51, 105-123, 224-242, 623-628, 678-688）

`setupDropdowns`、`setupComboboxes`、`setupMultiSelects`、`setupPopovers`、`setupMenubars` 每個元件實例都在 `document` 上新增 `click` / `keydown` 監聽器，且永遠不會移除。例如頁面上有 10 個 dropdown + 5 個 combobox + 3 個 multi-select，就會產生 39 個 document 級監聽器，每次點擊或按鍵都全部觸發。

**建議：** 改為單一 delegated listener，註冊一次即可，內部遍歷追蹤的實例。

---

### 2. Toast innerHTML XSS 風險

**檔案：** `src/scripts/cubby-ui.js`（行 583-594）

直接將 `data-cu-toast-title` 和 `data-cu-toast-description` 插入 `innerHTML`，若屬性包含使用者可控內容，有 XSS 風險。Multi Select 的 tag 渲染（行 167-172）也有類似問題，`data-cu-value` 中的 `"` 可能跳脫屬性注入 HTML。

**建議：** 改用 `textContent` 設定文字，或用 DOM API 建立元素。

---

### 3. JS 格式不是 UMD

**檔案：** `src/scripts/cubby-ui.js`（行 708）、`package.json`（行 5-6）

CLAUDE.md 聲稱輸出為 UMD，但實際是 IIFE，只暴露 `window.CubbyUI`。加上 `package.json` 設定了 `"type": "module"`，`require()` 和 `import` 都無法正常使用。`main` 欄位指向 IIFE 檔案，在 Node.js 環境中會失敗。

**建議：** 用 rollup/esbuild 打包為真正的 UMD + ESM 雙格式，或至少加上 `module.exports`。

---

### 4. CSS 建置產物過大

**檔案：** `package.json`（行 34-35）

`build:lib` 以 `global.css`（含 `@import "tailwindcss"`）作為入口，導致產出包含整個 Tailwind CSS 的 utility，約 273KB（壓縮後 212KB），遠大於元件本身所需（原始元件 CSS 約 40KB）。

**建議：** 建置時只包含元件層 CSS，或使用 `@source` 限定掃描範圍，避免輸出完整 Tailwind utility。

---

## 🟡 中優先級

### 5. Toast 入場動畫無效

**檔案：** `src/styles/components/toast.css`（行 64-77）、`src/scripts/cubby-ui.js`（行 582）

CSS 定義了 `cu-toast-enter` 動畫類別與 `@keyframes cu-toast-in`，但 JS 建立 toast 時設定 `toast.className = "cu-toast cu-toast-" + variant`，從未添加 `cu-toast-enter`，toast 直接出現無動畫。

**建議：** JS 建立 toast 時加入 `cu-toast-enter` class。

---

### 6. Dialog / Drawer / AlertDialog Astro 元件缺少 `data-cu-*` 屬性

**檔案：** `src/components/ui/Dialog.astro`、`src/components/ui/Drawer.astro`、`src/components/ui/AlertDialog.astro`

Dropdown 和 Popover 的 Astro 元件會自動加上 `data-cu-dropdown` / `data-cu-popover`，但 Dialog、Drawer、AlertDialog 沒有自動添加對應的 `data-cu-dialog`、`data-cu-drawer`、`data-cu-alert-dialog`，使用者必須手動加上這些屬性 JS 才能運作。

**建議：** 統一在 Astro 元件中自動添加 `data-cu-*` 屬性。

---

### 7. Badge Astro 元件缺少 `soft-*` 變體

**檔案：** `src/components/ui/Badge.astro`（行 5）、`src/styles/components/badge.css`（行 36-58）

CSS 定義了 `cu-badge-soft-default`、`cu-badge-soft-destructive`、`cu-badge-soft-success` 等變體，但 Badge.astro 的 `variant` prop 型別僅包含 `"default" | "secondary" | "outline" | "destructive" | "success" | "warning" | "info"`，未包含 soft 系列。

**建議：** 在 Badge.astro 的 Props interface 中加入 `soft-*` 變體，並在 `class:list` 中處理對應 class。

---

### 8. Popover 切換方式不一致

**檔案：** `src/scripts/cubby-ui.js`（行 618-628）

其他浮動元件（Dropdown、Combobox、Multi Select）使用 `hidden` HTML 屬性切換顯示，但 Popover 使用 `style.display`。這導致 CSS `[hidden]` 選擇器無法作用於 Popover，外部程式碼也無法透過 `hidden` 屬性判斷 Popover 的可見狀態。

**建議：** 統一使用 `hidden` 屬性。

---

### 9. Tailwind 版本不一致

**檔案：** `package.json`（行 65-67, 71）

- `tailwindcss`: `^4.0.0`
- `@tailwindcss/vite`: `^4.0.0`
- `@tailwindcss/cli`: `^4.1.18`

CLI 版本範圍遠高於核心和 vite plugin，可能導致 dev 環境和 build 環境行為不一致。

**建議：** 統一三者版本至相同範圍（如 `^4.1.18`）。

---

### 10. Disabled 狀態模式不一致

**檔案：** `src/styles/components/dropzone.css`（行 23）、`src/styles/components/number-input.css`（行 23）vs `src/styles/components/input.css`（行 4）

表單元素（Input、Checkbox、Radio 等）使用 `disabled:` 偽類搭配 HTML `disabled` 屬性自動生效，但 Dropzone 和 Number Input 使用獨立的 `cu-dropzone-disabled` / `cu-number-input-disabled` class，需要 JS 手動管理。

**建議：** 統一使用 `disabled:` 偽類模式，或在文件中明確說明差異原因。

---

### 11. Popover content CSS 重複定義

**檔案：** `src/styles/components/popover.css`（行 7-14）

`.cu-popover-content` 和 `.cu-popover-content[popover]` 兩個選擇器重複定義了 `rounded-xl border border-border bg-popover p-4 text-popover-foreground shadow-md` 等樣式。

**建議：** `[popover]` 變體應繼承共用樣式，只覆蓋定位相關屬性（`position: fixed`、`m-0`、`inset: unset`）。

---

## 🟢 低優先級

### 12. Radio CSS 使用 `transition-all`

**檔案：** `src/styles/components/radio.css`（行 12）

使用 `transition-all duration-150`，違反專案慣例（偏好具體 transition 屬性）。Radio 動畫的是 `border-width`（從 `border-2` 到 `border-[5px]`）。

**建議：** 改為 `transition-[border-width,colors] duration-150`。

---

### 13. Dialog / Drawer / AlertDialog JS 程式碼重複

**檔案：** `src/scripts/cubby-ui.js`（行 463-556）

`setupDialogs`、`setupDrawers`、`setupAlertDialogs` 三個函式幾乎相同（~90 行），僅 `data-*` 屬性名不同。

**建議：** 合併為一個參數化函式，減少約 60 行重複程式碼。

---

### 14. Dropdown / Popover / Menubar 無開關動畫

**檔案：** `src/styles/components/dropdown.css`、`src/styles/components/popover.css`、`src/styles/components/menubar.css`

Dialog、Drawer、Alert Dialog 都有 `@starting-style` 動畫，HoverCard 有 opacity 漸變，但 Dropdown、Popover、Menubar 內容是瞬間出現/消失。

**建議：** 加入 opacity / scale 微動畫，保持一致體驗。

---

### 15. Separator CSS 冗餘

**檔案：** `src/styles/components/separator.css`

`cu-separator` 已定義 `h-px w-full`，`cu-separator-horizontal` 重複相同值，無實質作用。

**建議：** 移除 `cu-separator-horizontal` 或讓 base class 不含方向，由 horizontal / vertical 變體各自定義。

---

### 16. 未使用的依賴

**檔案：** `package.json`（行 69-70）

`autoprefixer` 和 `postcss` 在 devDependencies 中，但專案無 postcss config 檔案。Tailwind CSS v4 內建處理。

**建議：** 移除這兩個未使用的依賴。

---

### 17. `sideEffects` 欄位遺漏 JS

**檔案：** `package.json`（行 42-44）

`sideEffects` 只列了 `"*.css"`，但 `cubby-ui.js` 是 IIFE，會自動執行 `init()` 並修改 `window.CubbyUI`，也應標記為 side effect。

**建議：** 將 `"*.js"` 或 `"dist/cubby-ui.js"` 加入 `sideEffects` 陣列。

---

### 18. CLAUDE.md 文檔不準確

**檔案：** `CLAUDE.md`

- Expressive-code 主題寫的是 `github-dark, github-light`，實際是 `min-light, min-dark`（`astro.config.mjs` 行 14）
- JS 格式寫 UMD，實際是 IIFE
- Setting Item 在 sidebar 歸類為 Layouts，但 CSS 和 CLAUDE.md 歸類為 Data Display

**建議：** 更新 CLAUDE.md 使其與實際程式碼一致。

---

### 19. Escape 鍵行為不精確

**檔案：** `src/scripts/cubby-ui.js`（行 47-51, 115-123, 234-242）

按 Escape 時，所有同類元件實例都會觸發關閉邏輯（例如所有 combobox），包括重置 search input 和觸發 synthetic `input` 事件，即使該實例並未開啟，造成不必要的 DOM 操作。

**建議：** 先檢查實例是否為開啟狀態，再執行關閉邏輯。

---

### 20. Toast 計時器未清理

**檔案：** `src/scripts/cubby-ui.js`（行 599, 602-604）

Toast 自動消失的 `setTimeout`（5000ms）在使用者手動關閉 toast 時未被 `clearTimeout`。雖然對已移除元素呼叫 `.remove()` 不會報錯，但若未來加入清理邏輯可能產生 bug。且自動消失時間無法由消費者設定。

**建議：** 手動關閉時 `clearTimeout`，並支援透過 `data-cu-toast-duration` 自訂時間。

---

### 21. 無 destroy / refresh API

**檔案：** `src/scripts/cubby-ui.js`（全域）

`_cuInit` flag 防止重複初始化，但若元件內部結構動態改變（如新增 tab），再次呼叫 `CubbyUI.init()` 會跳過已初始化的元件。無 `destroy()` 或 `refresh()` 方法處理此場景。

**建議：** 提供 `CubbyUI.destroy(selector)` 或 `CubbyUI.refresh(selector)` API。

---

### 22. `exports` 欄位的 `style` condition 非標準

**檔案：** `package.json`（行 11-14）

`"style": "./dist/cubby-ui.css"` 不是 Node.js 標準的 conditional export，只有部分打包工具（Vite、Parcel）認得。

**建議：** 改用標準 condition 或在文件中說明 CSS 引入方式。

---

### 23. Accordion 使用 `interpolate-size: allow-keywords`

**檔案：** `src/styles/components/accordion.css`（行 5）

此屬性目前僅 Chrome 129+ 支援，Firefox 和 Safari 尚未支援。不支援的瀏覽器中，`height` 從 `0` 到 `auto` 的過渡不會有動畫效果。

**建議：** 可保留作為漸進增強，但可在文件中註明瀏覽器支援狀況。

---

## ✅ 做得好的地方

- CSS 元件系統組織極佳，`cu-` 命名規則一致性高
- 設計 token 語意化，暗色模式覆蓋完整
- Astro 元件層統一使用 `interface Props` + `class:list`，模式一致
- Listbox 共用結構去重（combobox / multi-select 共用 7 組 class）設計精巧
- 62 個文檔頁面全部存在，無死連結
- `prefers-reduced-motion` 全域降低動畫正確實作
- ComponentPreview 展示框的 code collapse/expand 體驗好
- 暗色模式切換搭配 localStorage 持久化運作正常
- Dialog / Drawer / Alert Dialog 的 `@starting-style` 動畫模式統一且流暢
- 表單 disabled 狀態（主要元件）一致性高
