# Cubby UI — Web Components 支援方案

## 背景

目前 Cubby UI 的元件有兩層：CSS 類別層（`cu-*` class）和 Astro 元件層。使用者在純 HTML 中使用時，需要手動組合多個 CSS class 並貼上 JS 片段來處理互動。Web Components 可作為第三層，簡化使用體驗。

---

## 方案一：Light DOM Custom Elements（全元件宣告式 API）

### 概念

所有元件都包裝為 Custom Element，在 `connectedCallback` 中將 attribute 轉為 `cu-*` class，直接作用於 Light DOM。不使用 Shadow DOM，完全依賴全域 CSS。

### 使用範例

```html
<!-- 載入 CSS + JS -->
<link rel="stylesheet" href="cubby-ui.css">
<script src="cubby-wc.js"></script>

<!-- 簡單元件 -->
<cu-button variant="outline" size="md">Click me</cu-button>

<!-- 結構化元件 -->
<cu-card>
  <cu-card-header>
    <cu-card-title>Title</cu-card-title>
  </cu-card-header>
  <cu-card-content>Content</cu-card-content>
</cu-card>

<!-- 互動元件 -->
<cu-button data-dialog-trigger="my-dialog">Open</cu-button>
<cu-dialog id="my-dialog">
  <cu-dialog-header>
    <cu-dialog-title>Title</cu-dialog-title>
  </cu-dialog-header>
  <cu-dialog-footer>
    <cu-button variant="outline" data-dialog-close>Cancel</cu-button>
  </cu-dialog-footer>
</cu-dialog>
```

### 實作要點

- `<cu-button>` 在 `connectedCallback` 中建立內部 `<button>`，套用 `cu-button cu-button-{variant} cu-button-{size}` class，自身設為 `display: contents`
- 子元件（`cu-card-header` 等）在 host 上加對應 class
- 互動元件自動綁定事件（trigger / close / backdrop click）
- 需為 Custom Element 補上 `display` 修正 CSS
- 每個子元件都需獨立的 `customElements.define()`

### 優缺點

| 優點 | 缺點 |
|------|------|
| 統一的宣告式 API | 語意問題（`<cu-button>` 非原生 `<button>`，需額外處理 a11y） |
| CSS 零改動，複用現有 `cu-*` 樣式 | 需為每個子元件註冊 Custom Element（數量爆炸） |
| Bundle 小（~3-5 KB gzip） | `display: contents` 或 DOM 重建的邊界情況 |
| 暗色模式、Tailwind utility 自動生效 | FOUC 風險（定義載入前顯示未樣式化內容） |
| 漸進式可採用 | 仍需載入外部 CSS |

---

## 方案二：Behavioral Custom Elements（僅互動元件）

### 概念

只為需要 JS 的互動元件（7 個）建立 Custom Element，純 CSS 元件保持原樣。Custom Element 扮演「行為控制器」角色，自動綁定事件，消除使用者手動貼 `<script>` 的需求。

### 涵蓋元件

| Custom Element | 取代的 JS |
|---|---|
| `<cu-dialog>` | `setupDialogs()` |
| `<cu-drawer>` | `setupDrawers()` |
| `<cu-alert-dialog>` | `setupAlertDialogs()` |
| `<cu-dropdown>` | `setupDropdowns()` |
| `<cu-popover>` | `setupPopovers()` |
| `<cu-tabs>` | `setupTabs()` |
| `<cu-toast-container>` | `setupToasts()` |

### 使用範例

```html
<link rel="stylesheet" href="cubby-ui.css">
<script src="cubby-wc.js"></script>

<!-- 純 CSS 元件：完全不變 -->
<button class="cu-button cu-button-outline cu-button-md">Click</button>

<!-- 互動元件：用 Custom Element 取代 <script> -->
<button class="cu-button cu-button-outline cu-button-md"
        data-dialog-trigger="my-dialog">Open</button>

<cu-dialog id="my-dialog">
  <!-- 內部自動建立 <dialog> 並插入 close 按鈕 -->
  <div class="cu-dialog-header">
    <h2 class="cu-dialog-title">Title</h2>
  </div>
  <div class="cu-dialog-footer">
    <button class="cu-button cu-button-outline" data-dialog-close>Cancel</button>
  </div>
</cu-dialog>

<!-- Tabs -->
<cu-tabs default="account">
  <div class="cu-tabs-list">
    <button class="cu-tabs-trigger" data-tabs-trigger="account">Account</button>
    <button class="cu-tabs-trigger" data-tabs-trigger="password">Password</button>
  </div>
  <div class="cu-tabs-content" data-tabs-content="account">Account content</div>
  <div class="cu-tabs-content" data-tabs-content="password" hidden>Password content</div>
</cu-tabs>
```

### 實作要點

- `<cu-dialog>` 在 `connectedCallback` 中建立 `<dialog class="cu-dialog">`、搬移子節點、自動插入 close 按鈕、綁定 trigger/close/backdrop 事件
- `<cu-tabs>` 讀取 `default` attribute 設定初始 tab，綁定 trigger click 切換 `cu-tabs-trigger-active` class 和 `hidden` attribute
- `<cu-dropdown>` 綁定 trigger click toggle `hidden`、outside click 關閉、Escape 關閉
- 暴露 `open()` / `close()` / `select()` 等 API
- 使用 `AbortController` 在 `disconnectedCallback` 清理全域事件

### 優缺點

| 優點 | 缺點 |
|------|------|
| 精準解決痛點（消除 JS boilerplate） | 純 CSS 元件仍需冗長 class 書寫 |
| 完全向後相容，零破壞性 | API 不統一（有些 Custom Element，有些 class） |
| CSS 零改動 | 互動元件內部子結構仍需手寫 class |
| Bundle 最小（~1.5-2.5 KB gzip） | |
| 維護成本最低（僅 7 個檔案） | |
| 原生 HTML 語意保留 | |

---

## 方案三：Shadow DOM + Adopted Stylesheets（完全封裝）

### 概念

所有元件使用 Shadow DOM 完全封裝，自帶樣式。用 `adoptedStyleSheets` 注入共享的設計 token。一個 `<script>` 標籤即可使用，不需要外部 CSS。

### 使用範例

```html
<!-- 只需一行，不需要 CSS -->
<script src="cubby-wc.js"></script>

<cu-button variant="outline" size="md">Click me</cu-button>

<cu-dialog id="my-dialog">
  <cu-dialog-header>
    <cu-dialog-title>Title</cu-dialog-title>
  </cu-dialog-header>
  <cu-dialog-footer>
    <cu-button variant="outline" data-dialog-close>Cancel</cu-button>
    <cu-button>Confirm</cu-button>
  </cu-dialog-footer>
</cu-dialog>
```

### 實作要點

- 每個元件 `attachShadow({ mode: 'open' })`
- 共享設計 token 的 `CSSStyleSheet` 物件（`adoptedStyleSheets`）
- 需將所有 Tailwind `@apply` 展開為純 CSS
- 使用 `<slot>` 進行內容分發，暴露 `::part()` 供外部客製化
- 暗色模式需額外偵測宿主 `.dark` class 並同步到 Shadow DOM

### 優缺點

| 優點 | 缺點 |
|------|------|
| 真正零依賴（一個 script 搞定） | CSS 全部重寫（52 個檔案，從 `@apply` 轉純 CSS） |
| 完全樣式封裝 | 雙重 CSS 維護（Tailwind 版 + 純 CSS 版） |
| 可嵌入任何環境（WordPress 等） | 暗色模式需額外處理 |
| 最統一的 API | Tailwind utility class 在 Shadow DOM 內失效 |
| `<slot>` 原生支援 | Bundle 最大（~8-15 KB gzip） |
| | 子元件數量爆炸（每個都需獨立 Shadow DOM） |
| | 表單整合問題（需 `ElementInternals`） |
| | 開發工作量最大 |

---

## 三方案對比

| 維度 | 方案一 Light DOM | 方案二 Behavioral | 方案三 Shadow DOM |
|------|:---:|:---:|:---:|
| 涵蓋元件數 | ~52 | 7 | ~52 |
| CSS 改動 | 少量 display 修正 | 零 | 全部重寫 |
| Bundle (gzip) | ~3-5 KB | ~1.5-2.5 KB | ~8-15 KB |
| 需外部 CSS | 是 | 是 | 否 |
| 暗色模式 | 自動 | 自動 | 需額外處理 |
| Tailwind utility | 可用 | 可用 | 不可用 |
| 向後相容 | 需遷移標記 | 完全相容 | 需遷移標記 |
| 開發工作量 | 中 | 小 | 大 |
| 維護成本 | 中 | 低 | 高 |

---

## 實作檔案結構（通用）

```
src/web-components/
├── index.ts              -- 總入口
├── core/
│   └── base-element.ts   -- 共用 base class
├── elements/
│   ├── cu-dialog.ts
│   ├── cu-drawer.ts
│   ├── cu-dropdown.ts
│   ├── cu-tabs.ts
│   ├── cu-popover.ts
│   ├── cu-alert-dialog.ts
│   ├── cu-toast.ts
│   └── (方案一/三額外：cu-button.ts, cu-card.ts, cu-badge.ts ...)
└── dist/
    └── cubby-wc.js       -- 打包產出
```

## 驗證方式

- 建立 `src/pages/web-components.astro` 測試頁面，展示 Web Component 用法
- 確認各互動元件的 open/close/toggle 行為正常
- 確認暗色模式切換生效
- 確認 `npm run build` 無誤
