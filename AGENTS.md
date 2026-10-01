# Agent Guide — Cubby UI

## Project Overview

Cubby UI 是一個框架無關的 UI 元件庫，使用純 HTML + Tailwind CSS 構建，文檔站點使用 Astro 5。

## Quick Reference

- **元件 CSS 參考**：`/llms.txt`（完整 class 列表 + 範例）
- **機器可讀 Manifest**：`/components.json`（所有元件的 class、data-attr、ARIA）
- **CSS 原始檔**：`src/styles/components/*.css`（每個元件一個檔案）
- **JS 互動元件**：`src/scripts/index.js`（入口）+ `core/`（registry / utils / document-listeners / overlay）+ `components/*.js`（每元件一個模組）

## Guidelines

- 使用繁體中文，中文字元和英文字元之間加上一個半形空白字元
- 所有元件 CSS 類別使用 `cu-` 前綴（定義於 `src/config.ts` 的 `TOP_CLASS`）
- 元件 CSS 定義在 `src/styles/components/*.css`，透過 `src/styles/components.css` 的 `@layer components` 匯入
- Astro 元件在 `src/components/ui/`，必須使用 `interface Props` 型別定義和 `class:list` 處理 class 組合
- 文檔頁面在 `src/pages/components/`，使用 `ComponentPreview` 展示
- 使用 `data-*` 屬性處理互動狀態，不使用框架狀態管理
- 風格簡約細緻、優雅，避免庸俗高亮度的元素和顏色

## Commands

```bash
npm run dev         # 啟動開發伺服器（i18n 路由由 Vite plugin 自動同步）
npm run build       # 建置 NPM 套件至 dist/（CSS + JS）
npm run build:blade # 生成 Laravel Blade 元件至 dist/laravel/
npm run build:all   # 一次建置全部（build + build:blade）
npm run build:docs  # 建置文檔站點至 docs/（BASE_PATH=/cubby-ui 模擬 GitHub Pages 子路徑）
npm run check:links # 檢查 docs/ 站內連結帶 base 且目標存在（BASE_PATH 需與建置時相同）
npm run type-check  # astro check + type-check:scripts（src/scripts/ 互動 JS 的 checkJs，tsconfig.scripts.json）
npm run lint        # ESLint（eslint.config.js）檢查 src/scripts/，只含正確性規則，無排版規則 / Prettier
npm run preview     # 預覽建置結果
```

> 文檔站部署到 GitHub Pages（`https://dennykuo.github.io/cubby-ui/`，`.github/workflows/deploy-docs.yml`，main 的 CI 通過後觸發）。站內連結不可寫死 `href="/..."`：文檔頁用 `localizePath()`，其他根路徑用 `src/utils/paths.ts` 的 `withBase()`，比對目前路徑前先 `stripBase(Astro.url.pathname)`。

> 透過 git URL 安裝時，`prepare` script 自動執行 `build:all`，產生完整 `dist/` 產出。

## NPM Package

執行 `npm run build` 產生：
- `dist/core/cubby-ui.css` / `.min.css` — 預編譯 CSS
- `dist/core/cubby-ui.js` / `.min.js` — 互動元件 JS (UMD，由 `scripts/build-js.mjs` 以 esbuild 打包)
- `dist/core/cubby-ui.d.ts` — TypeScript 型別
- `dist/components.json` — 元件 manifest（跨框架共用）

執行 `npm run build:blade` 額外產生：
- `dist/laravel/CubbyUiServiceProvider.php` — 可選 ServiceProvider
- `dist/laravel/README.md` — Laravel 設定指南
- `dist/laravel/components/cu/` — Blade 匿名元件

互動元件 JS 原始碼：`src/scripts/index.js` + `src/scripts/core/` + `src/scripts/components/`（ESM 模組，esbuild 打包成 UMD）

## CSS Class Naming Rules

```
cu-{component}                  基礎類別       cu-button, cu-input
cu-{component}-{variant}        變體           cu-button-destructive, cu-badge-success
cu-{component}-{size}           尺寸           cu-button-sm, cu-kbd-lg
cu-{component}-{part}           子元件         cu-card-header, cu-sidebar-item
cu-{component}-wrapper          包裝器         cu-checkbox-wrapper, cu-select-wrapper
cu-{component}-{part}-{state}   狀態           cu-sidebar-item-active, cu-tabs-trigger-active
cu-{component}-{modifier}       修飾           cu-card-hover, cu-alert-accent
```

## JavaScript API

```js
CubbyUI.init()     // 初始化所有互動元件（DOMContentLoaded 後自動執行，可重複呼叫）
CubbyUI.destroy()  // 清除內部追蹤陣列（SPA 路由切換前使用）
CubbyUI.refresh()  // 清理已移除元素 + 重新 init（動態內容更新後使用）
```

## Interactive Components — data-* Attribute Reference

### Tabs
```html
<div class="cu-tabs" data-cu-tabs>
  <div class="cu-tabs-list">
    <!-- cu-tabs-trigger-active on the default active tab -->
    <button class="cu-tabs-trigger cu-tabs-trigger-active" data-cu-tabs-trigger="tab1">Tab 1</button>
    <button class="cu-tabs-trigger" data-cu-tabs-trigger="tab2">Tab 2</button>
  </div>
  <!-- No hidden on active panel; hidden on all others -->
  <div class="cu-tabs-content" data-cu-tabs-content="tab1">Panel 1</div>
  <div class="cu-tabs-content" data-cu-tabs-content="tab2" hidden>Panel 2</div>
</div>
```

### Dropdown Menu
```html
<div class="cu-dropdown" data-cu-dropdown>
  <button class="cu-button cu-button-outline" data-cu-dropdown-trigger>Options ▾</button>
  <!-- hidden attribute required initially -->
  <div class="cu-dropdown-content" data-cu-dropdown-content hidden>
    <div class="cu-dropdown-label">Actions</div>
    <button class="cu-dropdown-item">Edit</button>
    <div class="cu-dropdown-separator"></div>
    <button class="cu-dropdown-item">Delete</button>
  </div>
</div>
```

### Combobox (searchable single-select)
```html
<div class="cu-combobox" data-cu-combobox>
  <button class="cu-combobox-trigger" data-cu-combobox-trigger>
    <span data-cu-combobox-value class="cu-combobox-trigger-placeholder">Select option...</span>
  </button>
  <div class="cu-combobox-content" data-cu-combobox-content hidden>
    <input class="cu-combobox-input" data-cu-combobox-input placeholder="Search...">
    <ul data-cu-combobox-list>
      <!-- Active item: add cu-combobox-item-active -->
      <li class="cu-combobox-item" data-cu-combobox-item>Option 1</li>
      <li class="cu-combobox-item" data-cu-combobox-item>Option 2</li>
    </ul>
    <div data-cu-combobox-empty hidden>No results</div>
  </div>
</div>
```

### Multi Select
```html
<div class="cu-multi-select" data-cu-multi-select>
  <div class="cu-multi-select-trigger" data-cu-multi-select-trigger>
    <div data-cu-multi-select-tags>
      <span data-cu-multi-select-placeholder>Select options...</span>
    </div>
  </div>
  <div class="cu-multi-select-content" data-cu-multi-select-content hidden>
    <input class="cu-multi-select-input" data-cu-multi-select-input placeholder="Search...">
    <ul data-cu-multi-select-list>
      <!-- data-cu-value required for tag rendering -->
      <li class="cu-multi-select-item" data-cu-multi-select-item data-cu-value="opt1">Option 1</li>
      <li class="cu-multi-select-item" data-cu-multi-select-item data-cu-value="opt2">Option 2</li>
    </ul>
    <div data-cu-multi-select-empty hidden>No results</div>
  </div>
</div>
```

### Number Input
```html
<div class="cu-number-input" data-cu-number-input>
  <button class="cu-button cu-button-outline cu-button-icon-sm" data-cu-number-decrement>−</button>
  <input type="number" class="cu-input" data-cu-number-field min="0" max="100" step="1" value="0">
  <button class="cu-button cu-button-outline cu-button-icon-sm" data-cu-number-increment>+</button>
</div>
```

### Dropzone
```html
<div class="cu-dropzone" data-cu-dropzone>
  <input type="file" data-cu-dropzone-input class="sr-only" multiple>
  <p>Drop files here or click to upload</p>
</div>
<!-- cu-dropzone-active class auto-toggled on drag -->
```

### Dialog
```html
<!-- trigger value = dialog id -->
<button class="cu-button cu-button-default" data-cu-dialog-trigger="my-dialog">Open Dialog</button>

<dialog id="my-dialog" class="cu-dialog cu-dialog-md">
  <div class="cu-dialog-header">
    <h2 class="cu-dialog-title">Dialog Title</h2>
    <p class="cu-dialog-description">Description text.</p>
  </div>
  <div class="cu-dialog-footer">
    <button class="cu-button cu-button-outline" data-cu-dialog-close>Cancel</button>
    <button class="cu-button cu-button-default">Confirm</button>
  </div>
</dialog>
```
Dialog sizes: `cu-dialog-sm` / `cu-dialog-md` / `cu-dialog-xl` / `cu-dialog-full`

### Drawer
```html
<button class="cu-button cu-button-default" data-cu-drawer-trigger="my-drawer">Open Drawer</button>

<!-- Direction: cu-drawer-right (default) | cu-drawer-left | cu-drawer-top | cu-drawer-bottom -->
<dialog id="my-drawer" class="cu-drawer cu-drawer-right">
  <div class="cu-drawer-header">
    <h2 class="cu-drawer-title">Drawer Title</h2>
    <button class="cu-button cu-button-ghost cu-button-icon" data-cu-drawer-close aria-label="Close">✕</button>
  </div>
  <div class="cu-drawer-content">Content</div>
  <div class="cu-drawer-footer">
    <button class="cu-button cu-button-outline" data-cu-drawer-close>Close</button>
  </div>
</dialog>
```

### Alert Dialog (blocking confirmation)
```html
<button class="cu-button cu-button-destructive" data-cu-alert-dialog-trigger="confirm-dialog">Delete</button>

<!-- Does NOT close on backdrop click -->
<dialog id="confirm-dialog" class="cu-alert-dialog">
  <div class="cu-alert-dialog-header">
    <h2 class="cu-alert-dialog-title">Are you sure?</h2>
    <p class="cu-alert-dialog-description">This action cannot be undone.</p>
  </div>
  <div class="cu-alert-dialog-footer">
    <button class="cu-button cu-button-outline" data-cu-alert-dialog-cancel>Cancel</button>
    <button class="cu-button cu-button-destructive" data-cu-alert-dialog-action>Delete</button>
  </div>
</dialog>
```

### Toast
```html
<!-- Trigger button with data attributes -->
<button class="cu-button cu-button-default"
  data-cu-toast-trigger
  data-cu-toast-title="Saved!"
  data-cu-toast-description="Your changes have been saved."
  data-cu-toast-variant="success"
  data-cu-toast-duration="4000">
  Save
</button>

<!-- Container is auto-created if not in DOM. Explicit container: -->
<div class="cu-toast-container cu-toast-container-bottom-right"
  data-cu-toast-container
  data-cu-toast-max="5">
</div>
```
Toast variants: `default` | `destructive` | `success` | `warning` | `info`

### Popover
```html
<div class="cu-popover" data-cu-popover>
  <button class="cu-button cu-button-outline" data-cu-popover-trigger>Info</button>
  <!-- hidden initially; cu-popover-content-sm (w-56) or cu-popover-content-lg (w-96) -->
  <div class="cu-popover-content" data-cu-popover-content hidden>
    Popover content here.
  </div>
</div>
```

### Menubar
```html
<div class="cu-menubar" data-cu-menubar>
  <div class="cu-menubar-menu" data-cu-menubar-menu>
    <button class="cu-menubar-trigger" data-cu-menubar-trigger>File</button>
    <div class="cu-menubar-content" data-cu-menubar-content hidden>
      <button class="cu-menubar-item">New</button>
      <button class="cu-menubar-item">Open</button>
      <div class="cu-menubar-separator"></div>
      <button class="cu-menubar-item">
        Save <span class="cu-menubar-shortcut">⌘S</span>
      </button>
    </div>
  </div>
  <!-- More menus... -->
</div>
```

### Transfer List
```html
<div class="cu-transfer-list" data-cu-transfer-list>
  <!-- Left panel -->
  <div data-cu-transfer-panel="left">
    <input data-cu-transfer-search="left" type="search" placeholder="Search...">
    <div>
      <input type="checkbox" data-cu-transfer-check-all="left">
      <span data-cu-transfer-count="left"></span>
    </div>
    <ul class="cu-transfer-list-content">
      <li class="cu-transfer-list-item">
        <input type="checkbox" data-cu-transfer-check data-cu-value="item1">
        <span>Item 1</span>
      </li>
    </ul>
  </div>
  <!-- Control buttons -->
  <div>
    <button data-cu-transfer-to-right class="cu-button cu-button-outline">→</button>
    <button data-cu-transfer-to-left class="cu-button cu-button-outline">←</button>
  </div>
  <!-- Right panel (same structure as left) -->
  <div data-cu-transfer-panel="right">
    <input data-cu-transfer-search="right" type="search" placeholder="Search...">
    <div>
      <input type="checkbox" data-cu-transfer-check-all="right">
      <span data-cu-transfer-count="right"></span>
    </div>
    <ul class="cu-transfer-list-content"></ul>
  </div>
</div>
```

---

## Complete data-* Attribute Table

| Component | data-cu-* attributes |
|-----------|---------------------|
| Tabs | `data-cu-tabs`, `data-cu-tabs-trigger="value"`, `data-cu-tabs-content="value"` |
| Dropdown | `data-cu-dropdown`, `data-cu-dropdown-trigger`, `data-cu-dropdown-content` |
| Combobox | `data-cu-combobox`, `data-cu-combobox-trigger`, `data-cu-combobox-value`, `data-cu-combobox-content`, `data-cu-combobox-input`, `data-cu-combobox-list`, `data-cu-combobox-item`, `data-cu-combobox-empty` |
| Multi Select | `data-cu-multi-select`, `data-cu-multi-select-trigger`, `data-cu-multi-select-content`, `data-cu-multi-select-input`, `data-cu-multi-select-list`, `data-cu-multi-select-item`, `data-cu-multi-select-tags`, `data-cu-multi-select-placeholder`, `data-cu-multi-select-empty`, `data-cu-value` |
| Number Input | `data-cu-number-input`, `data-cu-number-field`, `data-cu-number-decrement`, `data-cu-number-increment` |
| Dropzone | `data-cu-dropzone`, `data-cu-dropzone-input` |
| Dialog | `data-cu-dialog-trigger="id"`, `data-cu-dialog`, `data-cu-dialog-close` |
| Drawer | `data-cu-drawer-trigger="id"`, `data-cu-drawer`, `data-cu-drawer-close` |
| Alert Dialog | `data-cu-alert-dialog-trigger="id"`, `data-cu-alert-dialog`, `data-cu-alert-dialog-cancel`, `data-cu-alert-dialog-action` |
| Toast | `data-cu-toast-trigger`, `data-cu-toast-title`, `data-cu-toast-description`, `data-cu-toast-variant`, `data-cu-toast-duration`, `data-cu-toast-container`, `data-cu-toast-max`, `data-cu-toast-close` |
| Popover | `data-cu-popover`, `data-cu-popover-trigger`, `data-cu-popover-content` |
| Menubar | `data-cu-menubar`, `data-cu-menubar-menu`, `data-cu-menubar-trigger`, `data-cu-menubar-content` |
| Transfer List | `data-cu-transfer-list`, `data-cu-transfer-panel="left\|right"`, `data-cu-transfer-to-right`, `data-cu-transfer-to-left`, `data-cu-transfer-check`, `data-cu-transfer-check-all="left\|right"`, `data-cu-transfer-count="left\|right"`, `data-cu-transfer-search="left\|right"`, `data-cu-value` |

---

## Common Mistakes to Avoid

1. **Separator 缺少方向類別**：`cu-separator` 必須搭配 `cu-separator-horizontal` 或 `cu-separator-vertical`，否則沒有尺寸
2. **包裝器元件缺少外層 wrapper**：Checkbox、Radio、Toggle、Select、Search Input、File Input 都需要對應的 `cu-*-wrapper` 外層
3. **Dialog/Drawer 的 trigger 值**：`data-cu-dialog-trigger` 的值必須與 `<dialog id="...">` 相符
4. **Tabs 的 hidden 屬性**：預設啟用的 tab 內容不加 `hidden`，其餘都要加
5. **Combobox/Dropdown content 的 hidden**：需要在 HTML 上加 `hidden` 屬性作為初始狀態
6. **Multi Select item 的 data-cu-value**：缺少此屬性會導致 tag 無法正確渲染
7. **Container 需要 size class**：`cu-container` 需要搭配 `cu-container-xl` 等尺寸類別
8. **CSS-only 元件不需要 JS**：Accordion、Collapsible（`<details>`）、Hover Card、Tooltip 完全靠 CSS，不需要任何 JS

---

## Adding New Components

### 新增元件 Checklist

1. **CSS**：在 `src/styles/components/` 建立 `.css` 檔案（使用 `cu-` 前綴），並在 `src/styles/components.css` 對應區塊加入 `@import`
2. **Astro 元件**：在 `src/components/ui/` 建立 `.astro` 元件檔（含 `interface Props` 型別定義，使用 `class:list`）
3. **i18n 翻譯**：在 `src/i18n/pages/components/` 建立翻譯檔（`Record<Locale, {...}>` 格式，含 en/zh-tw）
4. **文檔頁面**：在 `src/pages/components/` 建立文檔頁面（使用 `ComponentPreview` 展示，含 Preview + Code 兩個 tab）
5. **導航**：在 `src/data/component-nav.ts` 的對應陣列加入 NavItem，並把元件名加進 `README.md` 元件分類表的同一分類列（`check:sync` 會檢查）
6. **components.json**：更新根目錄 `components.json`，加入新元件規格（cssClasses、dataAttributes、aria、notes、example）
7. **llms.txt**：更新根目錄 `llms.txt`，在對應分類區塊加入元件說明（class 清單 + HTML 範例）
8. **互動元件 JS**（有 JS 互動才需要）：在 `src/scripts/components/` 新增模組並匯出 `setupXxx()`（含 JSDoc）；需要追蹤陣列時在 `core/registry.js` 加欄位並於 `index.js` 的 `init()` / `destroy()` / `refresh()` 登記；更新 `src/scripts/cubby-ui.d.ts` 的 `DATA_ATTRS` 常數；`npm run type-check` 與 `npm run lint` 須通過——DOM 查詢結果以 JSDoc 轉型（`/** @type {HTMLInputElement} */ (el.querySelector(...))`），元素 expando 屬性（`_cuInit` 等）宣告在 `src/scripts/globals.d.ts`，不要為此修改對外公開的 `cubby-ui.d.ts`；維持 ES5 風格（`var` / `function`）
9. **Dark / Light mode**：切換 `.dark` class，確認兩種模式下色彩、邊框、陰影皆正確
10. **build 驗證**：執行 `npm run build` 確認 CSS 正確編譯；有 JS 互動的元件另在 `tests/e2e/` 加 fixture 與 spec（`npm run test:e2e`）；`npm run check:sync` 會驗證 `data-cu-*` 屬性已列入 `DATA_ATTRS`

### 修改已有元件時的額外確認

- 修改 class 名稱 → 同步更新 `components.json`、`llms.txt`、docs 頁面範例
- 修改 `data-*` attribute → 同步更新 `components.json`、`llms.txt`、`cubby-ui.d.ts` 的 `DATA_ATTRS`
- 修改視覺設計 → 確認 dark/light 兩種模式皆正確
