# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cubby UI 是一個框架無關的 UI 元件庫，風格類似 shadcn/ui，使用純 HTML + Tailwind CSS 構建。元件設計為可直接複製貼上使用，不依賴 React、Vue 或任何前端框架。

示範文檔站點使用 Astro 構建。

## Commands

- `npm run dev` — 啟動 Astro 開發伺服器（i18n 路由由 Vite plugin 自動同步）
- `npm run build` — 建置 NPM 套件至 `dist/`（CSS + JS）
- `npm run build:blade` — 將 Astro 元件轉換為 Laravel Blade 匿名元件，輸出至 `dist/laravel/components/cu/`（支援 `--dry-run` 預覽不寫入、`--verbose` 詳細輸出）
- `npm run build:all` — 一次建置全部（`build` + `build:blade`），也作為 `prepare` script 在 git URL 安裝時自動執行
- `npm run build:docs` — 建置文檔站點至 `docs/`（自動先執行 `i18n:routes`）
- `npm run preview` — 預覽建置結果
- `npm run test:blade` — 對 `dist/laravel/` 下所有 `.blade.php` 做回歸檢查：已知壞 pattern（`,,`、空陣列元素、未轉譯 JSX 屬性）、並萃取 `@class` / `@props` / `@if` / `{{ … }}` 中的 PHP 片段以 `php -l` 驗證（安裝 PHP 時生效，可加 `--skip-php` 略過）

目前無 lint 命令。

## Architecture

### 技術棧

- **Astro 5** — 靜態站點生成（示範文檔站點）
- **Tailwind CSS v4** — 使用 CSS `@theme` 指令定義設計 token（非 tailwind.config.js）
- **astro-expressive-code** — 程式碼區塊語法高亮（主題：min-light, min-dark；內建複製按鈕已停用）
- **Vanilla JS** — 極少量，僅用於互動效果，使用 `data-*` 屬性管理狀態

### 國際化（i18n）

文檔站支援英文（預設）和繁體中文兩種語言。

**URL 結構**：英文無前綴（`/components/button`），繁中加 `/zh-tw/`（`/zh-tw/components/button`）。Dashboard 範例頁不翻譯。

**路由產生**：`scripts/generate-i18n-routes.js` 在 dev/build 前自動將 `src/pages/` 下的頁面複製到 `src/pages/zh-tw/`（已加入 `.gitignore`）。複製後的頁面透過 `Astro.url.pathname` 中的 `/zh-tw/` 前綴自動切換語言。

**翻譯系統**（`src/i18n/`）：
- `index.ts` — `Locale` 型別、`getLocaleFromUrl()`、`localizePath()`、`getAlternatePath()`、`useTranslations()`
- `ui.ts` — 共用 UI 翻譯（Header、Sidebar、ComponentPreview 的文字）
- `pages/home.ts`、`usage.ts`、`theming.ts`、`dark-mode.ts`、`playground.ts` — 核心頁面翻譯
- `pages/components/*.ts` — 95 個元件頁面翻譯（每頁一個檔案）

**頁面 i18n 模式**：每個頁面透過 3 行程式碼取得翻譯：
```astro
import { getLocaleFromUrl, useTranslations } from "@/i18n";
import { buttonPage } from "@/i18n/pages/components/button";
const locale = getLocaleFromUrl(Astro.url);
const t = useTranslations(buttonPage, locale);
```

**翻譯慣例**：
- 元件名稱（Button、Card 等）兩語言維持英文
- 程式碼範例與 HTML 預覽不翻譯
- 含 HTML 的翻譯字串（如 `<code>` 標籤）使用 `set:html` 渲染
- 共用 UI 透過 `data-cu-i18n-*` 屬性傳遞翻譯給客戶端 JS

**語言切換器**：位於 Header 右側，英文頁面顯示「中」，中文頁面顯示「EN」，使用 `getAlternatePath()` 保留當前頁面路徑。

### 元件系統

元件有兩個層次：

1. **CSS 類別層**（`src/styles/components.css` + `src/styles/components/*.css`）— 在 `@layer components` 中定義，使用 `cu-` 前綴（Cubby）。`components.css` 僅包含 `@layer components {}` 包裝和 `@import` 語句，各元件 CSS 規則拆分至 `components/` 資料夾的獨立檔案。CSS 按領域分十個區塊：`TYPOGRAPHY`（Headings, Kbd, Paragraph, Blockquote, List, Link, Text, HR）→ `BASIC`（Aspect Ratio, Avatar, Badge, Button, Button Group, Card, Separator）→ `FORMS`（Checkbox, Checkbox Group, Color Picker, Date Picker, Floating Label, Input Group, Listbox, Combobox, Password Input, Pin Input, Rating, Tag Input, Toggle Group ~ Transfer List）→ `DATA DISPLAY`（Accordion, Code Block, Collapsible, Data Table, Setting Item, Sortable List, Stat, Table, Timeline, Tree View）→ `CONTENT`（Carousel, Countdown, Diff Viewer, Image Compare, Marquee）→ `FEEDBACK`（Alert, Empty State, Progress, Skeleton, Toast）→ `OVERLAY`（Alert Dialog, Command Palette, Context Menu, Dialog, Drawer, Dropdown, Hover Card, Popover, Tooltip）→ `NAVIGATION`（Breadcrumb, Menubar, Pagination, Segmented Control, Steps, Tabs）→ `LAYOUT`（Container, Filter Bar, Header, Nav, Page Header, Resizable Panels, Scroll Area, Sidebar, Toolbar）→ `AI`（Chat Bubble, Chat Input, Chat Typing）。這是元件的核心，純 HTML 專案可以只用這些 CSS 類別。共用結構透過 `listbox.css` 以逗號選擇器去重（Combobox / Multi Select 共用 7 組 class）。
2. **Astro 元件層**（`src/components/ui/`）— 包裝 CSS 類別的 `.astro` 檔案，提供 TypeScript Props 型別安全和屬性透傳。

### CSS 類別命名規則

所有元件類別使用 `cu-` 前綴（來自 `src/config.ts` 的 `TOP_CLASS`）：

- 基礎類別：`cu-{component}`（例如 `cu-button`, `cu-input`, `cu-card`, `cu-sidebar`）
- 變體類別：`cu-{component}-{variant}`（例如 `cu-button-destructive`, `cu-button-outline`）
- 尺寸類別：`cu-{component}-{size}`（例如 `cu-button-sm`, `cu-button-lg`, `cu-toggle-sm`）
- 子元件：`cu-{component}-{part}`（例如 `cu-card-header`, `cu-sidebar-content`, `cu-sidebar-item`）
- 包裝器：`cu-{component}-wrapper`（例如 `cu-checkbox-wrapper`, `cu-toggle-wrapper`, `cu-select-wrapper`）
- 狀態類別：`cu-{component}-{part}-{state}`（例如 `cu-sidebar-item-active`）
- 修飾類別：`cu-{component}-{modifier}`（例如 `cu-card-hover` opt-in hover 陰影）

### 設計系統

主題定義在 `src/styles/theme.css` 的 `@theme` 區塊中（由 `global.css` 和 `lib.css` 引入），使用 CSS 變數：

- 語意色彩：primary, secondary, destructive, success, warning, info, muted, accent
- 每個色彩有配對的 foreground 色（例如 `--color-primary` / `--color-primary-foreground`）
- 支援暗色模式（`.dark` class + `color-scheme: dark` 確保原生元素跟隨）
- 支援 `prefers-reduced-motion` 全域降低動畫
- 文檔站工具類別：`.cu-code`（inline code 樣式，定義在 `global.css`）
- 動畫慣例：微互動 `duration-150`、狀態切換 `duration-200`；所有 `transition-*` 必須搭配明確的 `duration-*`；偏好具體 transition 屬性（`transition-colors`、`transition-shadow`、`transition-opacity`）而非 `transition-all`；Dialog/Drawer/Alert Dialog 使用 CSS `@starting-style` + `transition-behavior: allow-discrete` 實現開關動畫（統一 `0.2s ease`）
- 色彩引用：避免硬編碼 HSL 值，使用 `color-mix(in srgb, var(--color-*) N%, transparent)` 處理半透明語意色
- 陰影層次：`shadow-xs`（卡片靜態）→ `shadow-md`（浮層）→ `shadow-lg`（遮罩級 Dialog/Drawer/Toast）
- 浮層圓角統一為 `rounded-xl`（Dialog, Dropdown, Combobox, Multi Select, Popover, Hover Card）
- Alert / Toast 變體帶有 `bg-{color}/5` 極淡背景色調，增強視覺辨識度
- Card 的 hover shadow 為 opt-in（`cu-card-hover`），非預設行為
- Skeleton 提供兩種動畫：`cu-skeleton`（pulse）和 `cu-skeleton-shimmer`（掃光）；`cu-skeleton-circle` 和 `cu-skeleton-text` 提供常見形狀
- 表單 disabled 統一為 `disabled:pointer-events-none disabled:opacity-50 disabled:bg-muted disabled:text-muted-foreground`；帶有 hover border 的輸入元素（Input、Textarea、Select、Search Input、File Input、Combobox、Multi Select）額外加 `disabled:hover:border-input` 以中和 hover 效果
- Button ghost 變體帶有 `text-muted-foreground`，搭配 icon button 時預設淡色、hover 變深
- Button icon 尺寸：`cu-button-icon`（h-9 w-9）、`cu-button-icon-sm`（h-8 w-8）、`cu-button-icon-xs`（h-7 w-7）
- Card flush content：`cu-card-content-flush`（`p-0`），用於 table-in-card 等需要移除 padding 的場景；`cu-card-elevated` 提供較深陰影（`shadow-md`）
- Button solid 變體帶有 `hover:shadow-sm` 微互動，transition 包含 box-shadow
- 浮層暗色模式加強：所有浮層型元件（Dropdown、Popover、Hover Card、Menubar、Context Menu、Combobox、Multi Select、Calendar、Color Picker）帶有 `dark:shadow-lg dark:shadow-black/20`
- 表單驗證變體：Input 和 Textarea 提供 `cu-input-error` / `cu-input-success` / `cu-textarea-error` / `cu-textarea-success`
- Label 必填標記：`cu-label-required` 在後方自動加上紅色星號
- Textarea 自動高度：`cu-textarea-auto` 使用 `field-sizing: content`（漸進增強）
- Progress 支援條紋動畫：`cu-progress-bar-striped` + `cu-progress-bar-striped-animated`；漸層色彩 `cu-progress-bar-gradient`
- Badge 支援尺寸：`cu-badge-sm` / `cu-badge-lg`
- Avatar 支援狀態指示器：`cu-avatar-status` + `cu-avatar-status-online/offline/busy/away`；外環 `cu-avatar-ring`
- Alert accent 變體：`cu-alert-accent`（醒目填色強調，全框 + 背景 tint，取代舊的左側色條）
- Tabs pills 變體：`cu-tabs-list-pills`（圓角藥丸形標籤）
- Popover 尺寸：`cu-popover-content-sm`（`w-56`）/ `cu-popover-content-lg`（`w-96`）
- Separator base class（`cu-separator`）僅含 `shrink-0 bg-border`，需明確搭配 `cu-separator-horizontal`（`h-px w-full`）或 `cu-separator-vertical`（`h-full w-px`）指定方向
- 展開收合觸發器（Accordion、Collapsible、Tree View）使用 `outline-none` 搭配輕量 `focus-visible:ring-1 focus-visible:ring-ring/30` 焦點環
- 導航互動元素（Tabs、Pagination、Nav、Breadcrumb、Menubar）使用 `outline-none` 搭配 `focus-visible:ring-1 focus-visible:ring-ring/30`
- Dialog / Drawer / Alert 的 close 按鈕使用 `focus-visible:ring-1 focus-visible:ring-ring/40`
- Chat Input send / attach 按鈕屬於主要互動元素，使用模式 A（`ring-2 ring-ring/40 ring-offset-2`）
- Code Block 刻意使用硬編碼 `zinc-*` 色彩（非設計 token），因為程式碼區塊需要始終維持深色背景以確保語法高亮可讀性，與主題色彩解耦
- Pin Input 預設 `h-10 w-10`（非標準表單 `h-9`），因為正方形格子需要較大尺寸以確保可讀性與點擊面積
- Textarea 使用 `py-2`（非標準表單 `py-1`），因為多行輸入需要額外垂直間距以提升閱讀體驗
- Chat 系列元件（Chat Input、Chat Message、Chat Typing）使用 `rounded-2xl`（非標準浮層 `rounded-xl`），遵循 chat UI 慣例（iMessage/WhatsApp 氣泡感）
- Card 支援水平佈局：`cu-card-horizontal`（flex-row）+ `cu-card-horizontal-img`（w-48 側圖）；頂部圖片 `cu-card-img-top`（負邊距貼合邊框圓角）；可選取 `cu-card-selectable`（`:has(input:checked)` CSS-only 選取）
- Avatar 方形變體：`cu-avatar-square`（`rounded-lg`）
- Badge 脈衝動畫：`cu-badge-dot-animated`（在 `cu-badge-dot` 基礎上加入 pulse 動畫）
- Toast action 按鈕：`cu-toast-action`（容器）+ `cu-toast-action-btn`（按鈕樣式）
- Timeline 交錯排列：`cu-timeline-alternating`（置中軸線，`:nth-child(odd/even)` 左右交替）；水平排列：`cu-timeline-horizontal`（flex 橫向）
- Timeline dot 色彩背景使用 `color-mix(in srgb, var(--color-*) 12%, var(--color-background))` 產生不透明實色，避免直線透過圓圈顯示
- Timeline alternating/horizontal dot 使用 `translate` 置中對齊線條（alternating: `left-0 -translate-x-1/2` / `right-0 translate-x-1/2`；horizontal: `left-1/2 -translate-x-1/2 top-0`）
- Progress 多段：`cu-progress-multi`（flex 容器，多個 `cu-progress-bar` 彩色段落）；環形 `cu-progress-circular`（SVG-based，`stroke-dasharray/dashoffset` 控制填充）
- Input 可清除：`cu-input-clearable` + `cu-input-clear`（清除按鈕，JS 控制顯隱）
- Alert 可展開：`cu-alert-expandable-content`（`grid-template-rows: 0fr/1fr` 動畫）+ `cu-alert-expand-trigger`
- Tabs 徽章：`cu-tabs-trigger-badge`；可關閉：`cu-tabs-trigger-close`（JS 移除 tab）；可捲動：`cu-tabs-list-scrollable` + `cu-tabs-scroll-btn`（JS 捲動控制）
- Data Table 展開列：`cu-data-table-expand-trigger` + `cu-data-table-expanded-row` + `cu-data-table-expanded-content`
- Dialog 可捲動：`cu-dialog-body`（`max-height: 85vh`）+ `cu-dialog-scroll`（`overflow-y-auto`）
- Breadcrumb 摺疊省略：`cu-breadcrumb-ellipsis`（可點擊，搭配 Dropdown 展開隱藏項目）
- Skeleton 模板：Table Skeleton / List Skeleton（組合現有 `cu-skeleton-*` class）
- Empty State 場景模板：No Permission / Maintenance / Search No Results

### NPM 套件打包

執行 `npm run build:lib` 後產生：

```
dist/
├── core/                 # 框架無關的核心檔案
│   ├── cubby-ui.css      # 預編譯 CSS（@apply 已展開，不需 Tailwind，使用 source(none) 排除 utility）
│   ├── cubby-ui.min.css  # 壓縮版
│   ├── cubby-ui.js       # 互動元件 JS（UMD，支援 CommonJS / AMD / browser global）
│   ├── cubby-ui.min.js   # 壓縮版
│   ├── cubby-ui.min.js.map # Source map（方便除錯）
│   └── cubby-ui.d.ts     # TypeScript 型別定義（CubbyUI API）
└── components.json       # 元件 manifest（跨框架共用）
```

執行 `npm run build:blade` 後產生：

```
dist/
└── laravel/
    ├── CubbyUiServiceProvider.php   # 可選 ServiceProvider（從 node_modules 載入 Blade 元件）
    ├── README.md                    # Laravel 專用設定指南
    └── components/
        └── cu/
            ├── button.blade.php     # 獨立元件
            ├── card/
            │   ├── index.blade.php  # 主元件（Card）
            │   ├── header.blade.php # 子元件（CardHeader）
            │   ├── title.blade.php  # 子元件（CardTitle）
            │   └── ...
            ├── ...
            ├── README.md            # AI 友善文件（Blade 語法範例、props、組合模式）
            └── components.json      # 結構化元件清單（tag、props、children、dataAttributes）
```

轉換器腳本位於 `scripts/generate-blade-components.cjs`，搭配 `scripts/blade/parser.cjs`（解析 Astro frontmatter + Props）、`scripts/blade/transformers.cjs`（轉換 template 語法）和 `scripts/blade/generate-ai-docs.cjs`（生成 AI 友善文件）。手動 override 放在 `scripts/blade/overrides/*.blade.php`，會跳過自動轉換直接使用。支援 `--dry-run`（預覽轉換結果，不寫入檔案）和 `--verbose`（印出每個檔案的轉換路徑及完整 Blade 內容）。建置時自動生成 `README.md`（敘述式 Blade 使用文件）和 `components.json`（結構化 metadata），供 AI Agent 在 Laravel 專案中理解和使用元件。

互動元件 JS 原始檔位於 `src/scripts/cubby-ui.js`，使用 UMD 格式（支援 `require()`、AMD `define()`、`window.CubbyUI`），包含 38 個元件：Tabs（含 closable / scrollable）、Dropdown、Dialog、Drawer、Alert Dialog、Toast（含 promise API）、Popover、Menubar、Combobox、Multi Select、Number Input、Dropzone、Transfer List、Mobile Nav、Password Input、Segmented Control、Pin Input、Checkbox Group、Code Block、Carousel、Context Menu、Resizable Panels、Command Palette、Date Picker（含 Calendar）、Color Picker、Toggle Group、Rating、Tag Input、Sortable List、Countdown、Image Compare、Speed Dial、Back to Top、Kanban、Tour、Input Clearable、Alert Expandable、Data Table Expandable。Document 級事件監聯器使用 delegated pattern（click + keydown 各一個），避免每個元件實例各自註冊。Toast 內容使用 DOM API（`textContent` / `createElement`）建立，避免 innerHTML XSS 風險。Toast 自動消失時間預設 5000ms，可透過 `data-cu-toast-duration` 自訂。Toast 堆疊上限預設 5 則，可透過 `data-cu-toast-max` 自訂，超出時自動移除最舊通知。

ARIA 無障礙支援：
- **Tabs** — `role="tablist/tab/tabpanel"`、`aria-selected`、`aria-controls` / `aria-labelledby` 雙向連結
- **Dropdown** — `aria-haspopup="menu"`、`aria-expanded`、`role="menu"` / `role="menuitem"`
- **Combobox / Multi Select** — `aria-haspopup="listbox"`、`aria-expanded`、`role="listbox"` / `role="option"`、`aria-selected`
- **Popover** — `aria-haspopup="dialog"`、`aria-expanded`、`aria-controls`
- **Dialog / Drawer** — `aria-labelledby` + `aria-describedby` 自動連結標題與描述元素；開啟時聚焦首個可互動元素（尊重 `[autofocus]`），關閉時焦點返回觸發按鈕
- **Alert Dialog** — `role="alertdialog"` + `aria-labelledby` + `aria-describedby`
- **Number Input** — `role="spinbutton"` + `aria-valuemin` / `aria-valuemax` / `aria-valuenow`
- **Mobile Nav** — `role="dialog"` + `aria-modal="true"` + `aria-label`、trigger 使用 `aria-expanded`
- **Command Palette** — `role="dialog"` 透過 `<dialog>` 元素、內建鍵盤搜尋/篩選（方向鍵與 Tab / Shift+Tab 循環結果、Enter 選取）
- **Calendar** — 完整鍵盤導航（方向鍵切換日期、Home/End 跳至月首/月末）

公開 API：
- `CubbyUI.init()` — 初始化所有互動元件（自動在 DOMContentLoaded 執行，可重複呼叫以初始化動態新增的元素）
- `CubbyUI.destroy()` — 清除內部追蹤陣列（配合 SPA 路由切換使用）
- `CubbyUI.refresh()` — 清理已移除元素的過時參照，並重新執行 init()（適用於動態內容更新後）
- `CubbyUI.toast.show({ title, description?, variant?, duration? })` — 程式化建立 toast 通知，回傳 toast DOM 元素
- `CubbyUI.toast.promise(promise, { loading, success, error })` — 顯示載入中 toast，Promise resolve 時更新為 success，reject 時更新為 error

`package.json` 的 `exports` 欄位中 `"style"` condition 非 Node.js 標準，但 Vite、Parcel 等打包工具支援。標準引入方式為 `import "cubby-ui/css"`。

### 目錄結構

```
src/
├── scripts/
│   ├── cubby-ui.js               — 互動元件 JS（打包來源）
│   ├── cubby-ui.d.ts             — TypeScript 型別定義（打包來源）
│   └── playground.js             — Playground 頁面客戶端邏輯（IIFE，元件 registry + 控制項 + 主題）
├── data/
│   └── component-nav.ts          — 共享導航資料（Sidebar + PrevNext 共用，single source of truth）
├── i18n/
│   ├── index.ts                  — Locale 型別、getLocaleFromUrl()、localizePath()、useTranslations()
│   ├── ui.ts                     — 共用 UI 翻譯（Header、Sidebar、ComponentPreview）
│   └── pages/                    — 各頁面翻譯資料
│       ├── home.ts
│       ├── usage.ts
│       ├── theming.ts
│       ├── dark-mode.ts
│       ├── playground.ts
│       └── components/           — 95 個元件頁面翻譯（每元件一個檔案）
│           ├── button.ts
│           ├── card.ts
│           └── ...
├── components/
│   ├── Header.astro              — 頂部導航列（使用 cu-header / cu-header-brand / cu-header-actions）
│   ├── ComponentPreview.astro     — 元件展示框（iframe 隔離預覽 + responsive 裝置寬度切換 + code 摺疊/複製）
│   ├── PrevNextNav.astro          — 元件頁底部 prev/next 導航（從 component-nav.ts 取得順序）
│   ├── sidebar/                   — 文檔站點專用側邊欄（使用 cu-sidebar-* classes）
│   │   ├── Sidebar.astro          — 側邊欄（包含導航資料與結構）
│   │   ├── SidebarSection.astro   — 第一層分類標題（使用 cu-sidebar-section-title）
│   │   ├── SidebarGroup.astro     — 第二層副標題（使用 cu-sidebar-group / cu-sidebar-group-title）
│   │   └── SidebarLink.astro      — 導航連結（使用 cu-sidebar-item / cu-sidebar-item-active）
│   └── ui/                        — 可重用 UI 元件
│       ├── Blockquote.astro        — 引用區塊
│       ├── Heading.astro           — 標題（level prop: 1–4）
│       ├── Hr.astro                — 水平分隔線
│       ├── Link.astro              — 行內連結
│       ├── List.astro              — 列表（type prop: disc / decimal）
│       ├── Paragraph.astro         — 段落（variant prop: default / lead）
│       ├── AspectRatio.astro       — 等比例容器
│       ├── Accordion*.astro       — 手風琴（Accordion, AccordionItem, AccordionTrigger, AccordionContent）
│       ├── Alert*.astro           — 警示（Alert, AlertTitle, AlertDescription）
│       ├── AlertDialog*.astro     — 阻斷對話框（AlertDialog, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter）
│       ├── Avatar*.astro          — 頭像（Avatar, AvatarImage, AvatarFallback）
│       ├── Badge.astro            — 徽章（variant prop）
│       ├── Breadcrumb*.astro      — 麵包屑（Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbCurrent）
│       ├── Button.astro           — 按鈕（variant + size + href props，href 時渲染為 <a>）
│       ├── ButtonGroup.astro      — 按鈕群組（vertical prop）
│       ├── Calendar.astro         — 日曆（鍵盤導航、日期選取）
│       ├── Card*.astro            — 卡片（Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter）
│       ├── Carousel*.astro        — 輪播（Carousel, CarouselSlide）
│       ├── Checkbox.astro         — 核取方塊（自訂勾勾）
│       ├── CheckboxGroup.astro    — 核取方塊群組
│       ├── CodeBlock.astro        — 程式碼區塊
│       ├── ColorPicker.astro      — 色彩選擇器
│       ├── CommandPalette*.astro  — 命令面板（CommandPalette, CommandPaletteEmpty, CommandPaletteGroup, CommandPaletteInput, CommandPaletteItem, CommandPaletteList, CommandPaletteSeparator, CommandPaletteShortcut）
│       ├── ContextMenu*.astro     — 右鍵選單（ContextMenu, ContextMenuContent, ContextMenuItem）
│       ├── EmptyState*.astro      — 空狀態（EmptyState, EmptyStateIcon, EmptyStateTitle, EmptyStateDescription, EmptyStateAction）
│       ├── Collapsible*.astro     — 可折疊區塊（Collapsible, CollapsibleTrigger, CollapsibleContent）
│       ├── Container.astro        — 容器（size prop）
│       ├── DatePicker.astro       — 日期選擇器
│       ├── Dialog*.astro          — 對話框（Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose）（Dialog 支援 size prop: sm / md / default / xl / full）
│       ├── Dropdown*.astro        — 下拉選單（Dropdown, DropdownContent, DropdownItem, DropdownLabel, DropdownSeparator）
│       ├── FileInput.astro        — 檔案上傳
│       ├── FilterBar*.astro       — 篩選列（FilterBar, FilterBarInner, FilterBarSearch, FilterBarFilters）
│       ├── FormGroup.astro        — 表單群組容器
│       ├── FormDescription.astro  — 表單說明文字
│       ├── FormError.astro        — 表單錯誤訊息
│       ├── Header*.astro          — 頂部列（Header, HeaderInner, HeaderBrand, HeaderNav, HeaderActions）
│       ├── HoverCard*.astro       — 懸停卡片（HoverCard, HoverCardContent）
│       ├── Input.astro            — 文字輸入框（size prop: sm / default / lg）
│       ├── InputGroup*.astro      — 輸入群組（InputGroup, InputGroupText）
│       ├── Kbd.astro              — 鍵盤快捷鍵（size prop: sm / default / lg）
│       ├── Label.astro            — 表單標籤
│       ├── Menubar*.astro         — 選單列（Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator, MenubarLabel, MenubarShortcut）
│       ├── Nav.astro              — 導航選單（vertical prop）
│       ├── NavItem.astro          — 導航項目（active prop）
│       ├── PageHeader*.astro      — 頁面標頭（PageHeader, PageHeaderContent, PageHeaderTitle, PageHeaderDescription, PageHeaderActions）
│       ├── Pagination*.astro      — 分頁（Pagination, PaginationItem, PaginationPrev, PaginationNext, PaginationEllipsis）
│       ├── PasswordInput.astro    — 密碼輸入框（顯示/隱藏切換）
│       ├── PinInput.astro         — PIN 碼輸入（多格輸入）
│       ├── Popover*.astro         — 彈出層（Popover, PopoverContent）
│       ├── Progress.astro         — 進度條（value prop）
│       ├── Radio.astro            — 單選按鈕（自訂圓點）
│       ├── Range.astro            — 滑桿
│       ├── Resizable*.astro       — 可調整大小面板（Resizable, ResizableHandle, ResizablePanel）
│       ├── ScrollArea.astro       — 自訂捲軸容器（horizontal prop）
│       ├── SearchInput.astro      — 搜尋欄（含搜尋圖示）
│       ├── Select.astro           — 下拉選擇（含裝飾箭頭）
│       ├── SegmentedControl.astro  — 分段控制（size + block props）
│       ├── SegmentedControlItem.astro — 分段控制項目
│       ├── Separator.astro        — 分隔線（orientation prop）
│       ├── SettingItem*.astro     — 設定項（SettingItem, SettingItemContent, SettingItemLabel, SettingItemDescription, SettingItemAction）
│       ├── Drawer*.astro          — 側邊面板（Drawer, DrawerHeader, DrawerTitle, DrawerDescription, DrawerContent, DrawerFooter, DrawerClose）
│       ├── Sidebar*.astro         — 側邊欄（Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarSection, SidebarSectionTitle, SidebarGroup, SidebarGroupTitle, SidebarItem, SidebarSeparator）
│       ├── Skeleton.astro         — 骨架屏
│       ├── Stat*.astro            — 指標卡（Stat, StatHeader, StatLabel, StatValue, StatDescription, StatTrend）
│       ├── Steps*.astro           — 步驟指示器（Steps, StepsItem, StepsSeparator）
│       ├── Tabs*.astro            — 分頁標籤（Tabs, TabsList, TabsTrigger, TabsContent）
│       ├── Textarea.astro         — 多行輸入框
│       ├── Toast*.astro            — 通知（Toast, ToastContainer, ToastTitle, ToastDescription, ToastClose）
│       ├── Toggle.astro           — 開關（純 CSS，size prop）
│       ├── ToggleGroup*.astro     — 切換群組（ToggleGroup, ToggleGroupItem）
│       ├── TagInput.astro         — 標籤輸入（互動式新增/移除標籤）
│       ├── Rating.astro           — 評分（星星評分，支援半星、唯讀）
│       ├── Marquee.astro          — 跑馬燈（無限滾動內容，純 CSS）
│       ├── SortableList.astro     — 可排序列表容器
│       ├── SortableItem.astro     — 可排序列表項目（含拖曳把手）
│       ├── Timeline*.astro         — 時間軸（Timeline, TimelineItem, TimelineDot, TimelineContent, TimelineTime）
│       ├── Toolbar*.astro         — 工具列（Toolbar, ToolbarGroup, ToolbarButton, ToolbarSeparator）
│       ├── TreeView*.astro        — 樹狀結構（TreeView, TreeItem, TreeLeaf）
│       ├── ChatBubble*.astro     — 聊天氣泡（ChatBubble, ChatBubbleAvatar, ChatBubbleContent, ChatBubbleName, ChatBubbleMessage, ChatBubbleTimestamp, ChatBubbleActions, ChatBubbleAction）
│       ├── ChatInput.astro       — 聊天輸入框
│       └── ChatTyping.astro      — 打字指示器
├── config.ts                      — 全域配置（TOP_CLASS = 'cu'）
├── types.ts                       — 共用 TypeScript 型別（FeedbackVariant 等）
├── layouts/
│   └── Layout.astro               — 主布局（引入 Header + Sidebar，wide prop 移除 max-w-3xl 限制）
├── pages/
│   ├── index.astro                — 首頁
│   ├── playground.astro           — Playground 互動式元件探索頁（wide layout）
│   ├── zh-tw/                     — 繁中路由（自動產生，已 gitignore）
│   └── components/                — 元件文檔頁面
│       ├── accordion.astro
│       ├── alert.astro
│       ├── alert-dialog.astro
│       ├── aspect-ratio.astro
│       ├── avatar.astro
│       ├── badge.astro
│       ├── breadcrumb.astro
│       ├── button.astro
│       ├── blockquote.astro
│       ├── button-group.astro
│       ├── card.astro
│       ├── carousel.astro
│       ├── checkbox.astro
│       ├── checkbox-group.astro
│       ├── code-block.astro
│       ├── color-picker.astro
│       ├── command-palette.astro
│       ├── context-menu.astro
│       ├── collapsible.astro
│       ├── color.astro
│       ├── combobox.astro
│       ├── container.astro
│       ├── data-table.astro
│       ├── date-picker.astro
│       ├── dialog.astro
│       ├── dropdown.astro
│       ├── empty-state.astro
│       ├── file-input.astro
│       ├── form-group.astro
│       ├── headings.astro
│       ├── header.astro
│       ├── hover-card.astro
│       ├── hr.astro
│       ├── input.astro
│       ├── input-group.astro
│       ├── kbd.astro
│       ├── label.astro
│       ├── links.astro
│       ├── lists.astro
│       ├── menubar.astro
│       ├── multi-select.astro
│       ├── number-input.astro
│       ├── dropzone.astro
│       ├── transfer-list.astro
│       ├── nav.astro
│       ├── pagination.astro
│       ├── paragraphs.astro
│       ├── password-input.astro
│       ├── pin-input.astro
│       ├── popover.astro
│       ├── progress.astro
│       ├── radio.astro
│       ├── range.astro
│       ├── resizable-panels.astro
│       ├── scroll-area.astro
│       ├── search-input.astro
│       ├── segmented-control.astro
│       ├── select.astro
│       ├── separator.astro
│       ├── drawer.astro
│       ├── sidebar.astro
│       ├── skeleton.astro
│       ├── stat-card.astro
│       ├── steps.astro
│       ├── tabs.astro
│       ├── text.astro
│       ├── textarea.astro
│       ├── timeline.astro
│       ├── toast.astro
│       ├── toggle.astro
│       ├── toggle-group.astro
│       ├── tag-input.astro
│       ├── rating.astro
│       ├── marquee.astro
│       ├── sortable-list.astro
│       ├── toolbar.astro
│       ├── tooltip.astro
│       ├── tree-view.astro
│       ├── chat-bubble.astro
│       ├── chat-input.astro
│       └── chat-typing.astro
└── styles/
    ├── global.css                 — 文檔站入口（引入 tailwindcss + theme + components + body/.cu-code 樣式）
    ├── theme.css                  — 設計 token（@theme 區塊 + .dark 暗色覆蓋）
    ├── lib.css                    — NPM 套件建置入口（tailwindcss source(none) + theme + components）
    ├── components.css             — @layer components 包裝 + @import 各子檔案
    └── components/                — 各元件獨立 CSS 檔案
        ├── accordion.css
        ├── aspect-ratio.css
        ├── blockquote.css
        ├── alert.css
        ├── alert-dialog.css
        ├── avatar.css
        ├── badge.css
        ├── breadcrumb.css
        ├── button.css
        ├── button-group.css
        ├── card.css
        ├── carousel.css
        ├── checkbox.css
        ├── checkbox-group.css
        ├── code-block.css
        ├── color-picker.css
        ├── command-palette.css
        ├── context-menu.css
        ├── collapsible.css
        ├── combobox.css
        ├── container.css
        ├── date-picker.css
        ├── data-table.css
        ├── dialog.css
        ├── dropdown.css
        ├── empty-state.css
        ├── file-input.css
        ├── filter-bar.css
        ├── form-group.css
        ├── headings.css
        ├── header.css
        ├── hover-card.css
        ├── hr.css
        ├── input.css
        ├── input-group.css
        ├── kbd.css
        ├── label.css
        ├── link.css
        ├── list.css
        ├── listbox.css
        ├── menubar.css
        ├── multi-select.css
        ├── number-input.css
        ├── dropzone.css
        ├── transfer-list.css
        ├── nav.css
        ├── page-header.css
        ├── pagination.css
        ├── paragraph.css
        ├── password-input.css
        ├── pin-input.css
        ├── popover.css
        ├── progress.css
        ├── radio.css
        ├── range.css
        ├── resizable.css
        ├── scroll-area.css
        ├── search-input.css
        ├── segmented.css
        ├── select.css
        ├── separator.css
        ├── setting-item.css
        ├── drawer.css
        ├── sidebar.css
        ├── skeleton.css
        ├── stat.css
        ├── steps.css
        ├── table.css
        ├── tabs.css
        ├── text.css
        ├── textarea.css
        ├── timeline.css
        ├── toast.css
        ├── toggle.css
        ├── toggle-group.css
        ├── tag-input.css
        ├── rating.css
        ├── marquee.css
        ├── sortable-list.css
        ├── toolbar.css
        ├── tooltip.css
        ├── tree-view.css
        ├── chat-bubble.css
        ├── chat-input.css
        └── chat-typing.css
```

### Astro 元件模式

所有 UI 元件統一使用 `interface Props` 型別定義和 `class:list` 處理 class 組合。分為三種模式：

1. **Simple**（Label, Input, Textarea, Checkbox, Radio, Range, FormGroup, Card 子元件, Header 子元件, Sidebar 子元件, Alert 子元件, Avatar 子元件, Dialog 子元件, Dropdown 子元件, Breadcrumb 子元件, Table 子元件, Accordion 子元件, Skeleton, Pagination 等）— 定義 `interface Props { class?: string; [key: string]: any; }`，提取 `class` + `...rest`，使用 `class:list={[baseClass, className]}` 和 `<slot />`。
2. **Composite**（SearchInput, Select, Progress）— 包含包裝器 + 內部子元素（如圖示、輸入框、進度條），props 轉發給內部元素。
3. **Complex**（Button, Toggle, Container, Nav, NavItem, SidebarItem, Badge, Alert, Avatar, PaginationItem）— 有 `variant` / `size` / `active` / `vertical` 等 typed props，使用 `class:list` 組合多個條件 class。

### 側邊欄架構

#### 文檔站點側邊欄（`src/components/sidebar/`）

導航資料集中在 `src/data/component-nav.ts` 中管理（single source of truth），`Sidebar.astro` 和 `PrevNextNav.astro` 共同引用。資料分為：`gettingStarted`、`componentGroups`（含 10 個分組：layouts / basic / typography / navigation / dataDisplay / content / forms / feedback / overlay / ai）、`examplePages`。`allComponentPages` 為所有元件頁的扁平有序陣列，供 prev/next 導航使用。
側邊欄子元件使用 `cu-*` CSS classes（dog-fooding）：`SidebarSection`（`cu-sidebar-section-title`）→ `SidebarGroup`（`cu-sidebar-group` + `cu-sidebar-group-title`）→ `SidebarLink`（`cu-sidebar-item` + `cu-sidebar-item-active`）。
新增元件時需在 `component-nav.ts` 的對應陣列加一筆資料。

元件分類：
- **Components > Typography** — Headings, Kbd, Paragraphs, Blockquote, Lists, Links, Text, HR
- **Components > Basic** — Aspect Ratio, Avatar, Badge, Button, Button Group, Card, Color, Separator
- **Components > Forms** — Checkbox, Checkbox Group, Color Picker, Combobox, Date Picker, Dropzone, File Input, Floating Label, Form Group, Input, Input Group, Label, Multi Select, Number Input, Password Input, Pin Input, Radio, Range, Rating, Search Input, Select, Tag Input, Textarea, Toggle, Toggle Group, Transfer List
- **Components > Data Display** — Accordion, Code Block, Collapsible, Data Table, Setting Item, Sortable List, Stat Card, Table, Timeline, Tree View
- **Components > Content** — Carousel, Countdown, Diff Viewer, Image Compare, Marquee
- **Components > Feedback** — Alert, Empty State, Notification, Progress, Skeleton, Spinner, Toast
- **Components > Overlay** — Alert Dialog, Command Palette, Context Menu, Dialog, Drawer, Dropdown Menu, Hover Card, Popover, Tooltip, Tour
- **Components > Navigation** — Back to Top, Breadcrumb, Menubar, Pagination, Segmented Control, Speed Dial, Steps, Tabs
- **Components > Layouts** — Container, Filter Bar, Header, Kanban, Nav, Page Header, Resizable Panels, Scroll Area, Sidebar, Toolbar
- **Components > AI** — Chat Bubble, Chat Input, Chat Typing

#### UI Sidebar 元件（`src/components/ui/Sidebar*.astro`）

可重用的 sidebar 元件，供使用者在自己的專案中使用。支援兩層標題結構：

- `cu-sidebar` — 容器（`w-56`，無邊框，邊框由相鄰內容區的 `border-l` 處理）
- `cu-sidebar-header` — 頭部（`pl-9` 與下方連結齊左）
- `cu-sidebar-content` — 可捲動內容區（`py-8 pl-6 pr-2`）
- `cu-sidebar-footer` — 底部
- `cu-sidebar-section` + `cu-sidebar-section-title` — 第一層標題（大寫、寬字距、`text-muted-foreground/70`）
- `cu-sidebar-group` + `cu-sidebar-group-title` — 第二層標題（`font-bold`、`::before` 裝飾橫線 `bg-primary/70`）
- `cu-sidebar-item` / `cu-sidebar-item-active` — 導航項目（`text-[13.5px]`、`hover:bg-muted/60`）
- `cu-sidebar-separator` — 水平分隔線

#### UI Container 元件（`src/components/ui/Container.astro`）

響應式容器元件，支援 6 種最大寬度：

- `cu-container` — 基礎容器（`mx-auto w-full px-4 sm:px-6 lg:px-8`）
- `cu-container-sm` / `cu-container-md` / `cu-container-lg` / `cu-container-xl` / `cu-container-2xl` — 對應 `max-w-screen-*`
- `cu-container-prose` — 適合長文閱讀的寬度（`max-w-prose`）

#### UI Header 元件（`src/components/ui/Header*.astro`）

頂部導航列元件，支援品牌 logo、導航選單、操作按鈕：

- `cu-header` — 容器（`sticky top-0 z-50`、`backdrop-blur-xl`、`bg-background/80` 半透明模糊）
- `cu-header-inner` — 內部 flex 容器（`h-14`、`justify-between`）
- `cu-header-brand` — 左側品牌區（`gap-2.5`）
- `cu-header-nav` — 中間導航區（`flex`、`px-5`，預設永遠可見）
- `cu-header-nav-{sm|md|lg|xl}` — 斷點修飾類別（`hidden {bp}:flex`），控制導航在哪個斷點以上顯示
- `cu-header-nav-start` — 導航靠左（`mr-auto`，緊鄰品牌）
- `cu-header-nav-end` — 導航靠右（`ml-auto`，緊鄰操作區）
- `cu-header-actions` — 右側操作區（`gap-2`）
- `cu-header-mobile-backdrop` — 遮罩層（`fixed inset-0 z-50`、`bg-foreground/30`、`opacity` 過渡 360ms）
- `cu-header-mobile-nav` — 右側滑入面板（`fixed right-0 z-[60] w-72`、`translate-x` 過渡 360ms）
- `cu-header-mobile-header` — 面板頂部（`h-14`、`justify-end`）
- `cu-header-mobile-content` — 面板可捲動內容區（`overflow-y-auto p-4`）
- `cu-header-mobile-close` — 關閉按鈕（`size-9`、`focus-visible:ring-1 ring-ring/40`）

#### UI Nav 元件（`src/components/ui/Nav*.astro`）

導航選單元件，可獨立使用或放在 Header 內，支援水平與垂直排列：

- `cu-nav` — 容器（`flex items-center gap-1`）
- `cu-nav-item` — 導航連結（`text-sm`、`hover:bg-muted/60`）
- `cu-nav-item-active` — 啟用狀態（`bg-primary/8 font-medium text-primary`）
- `cu-nav-vertical` — 垂直排列（`flex-col items-stretch gap-0.5`，適合側邊欄）

#### UI PageHeader 元件（`src/components/ui/PageHeader*.astro`）

頁面標頭元件，用於展示頁面標題、描述和操作按鈕：

- `cu-page-header` — 容器（`flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between`）
- `cu-page-header-content` — 內容區（`min-w-0`）
- `cu-page-header-title` — 標題（`text-3xl md:text-4xl font-bold tracking-tight`）
- `cu-page-header-description` — 描述（`text-sm text-muted-foreground mt-2.5`）
- `cu-page-header-actions` — 操作區（`flex items-center gap-2 shrink-0 sm:mt-1`）
- `cu-page-header-bordered` — 底部分隔線變體（`pb-4 border-b border-border`，opt-in）
- `cu-page-header-centered` — 置中對齊變體（`sm:flex-col sm:items-center sm:text-center`，opt-in）

#### UI FilterBar 元件（`src/components/ui/FilterBar*.astro`）

篩選列元件，用於搜尋和篩選控制項的容器：

- `cu-filter-bar` — 容器（`rounded-xl border border-border bg-card p-4 shadow-sm`）
- `cu-filter-bar-inner` — 內部 flex 容器（`flex flex-col gap-4 lg:flex-row`）
- `cu-filter-bar-search` — 搜尋區（`flex-1`）
- `cu-filter-bar-filters` — 篩選區（`flex flex-wrap items-center gap-2`）

#### UI SettingItem 元件（`src/components/ui/SettingItem*.astro`）

設定項元件，用於設定頁面的單項設定：

- `cu-setting-item` — 容器（`flex items-center justify-between p-4 sm:p-6`）
- `cu-setting-item-content` — 內容區（`space-y-0.5`）
- `cu-setting-item-label` — 標籤（`text-sm font-medium`）
- `cu-setting-item-description` — 描述（`text-sm text-muted-foreground`）
- `cu-setting-item-action` — 操作區（`shrink-0`）

### Dog-fooding 原則

文檔站點的 Header 和 sidebar 元件使用 `cu-*` CSS classes，而非重複寫 inline Tailwind。這確保 UI 元件庫自身的 CSS classes 經過實際使用驗證。文檔站 Header 的內層 `<div>` 因 sidebar 對齊需求保留自訂 padding，不使用 `cu-header-inner`。

### 對齊原則

Header logo 與 sidebar 連結文字齊左：
- `md:` — sidebar `pl-6` + item `px-3` = `2.25rem` → Header `md:pl-9`
- `lg:` — sidebar `lg:pl-8` + item `px-3` = `2.75rem` → Header `lg:pl-11`
- `cu-sidebar-header` — `pl-9`（= content `pl-6` + item `px-3`）

## Style Guide

- 風格簡約細緻、優雅，避免庸俗高亮度的元素和顏色
- 使用淺色陰影營造深淺層次
- 適度使用圓角營造柔和感
- 表單元素使用 `appearance-none` 搭配自訂樣式，避免瀏覽器原生呆板感
- Checkbox 使用 SVG checkmark，Radio 使用粗 border 內圓點，Toggle 使用純 CSS hidden checkbox + sibling selector
- 所有文字輸入框（Input、Textarea、Select、Search Input）帶有 `hover:border` 微互動
- Range slider 的 thumb 帶有 hover 光暈效果
- 美學參考：
  - [shadcn ui](https://shadcn.github.io/shadcn-ui)
  - [flowbite](https://flowbite.com)
  - [flyonui](https://flyonui.com)

## Adding New Components

### 新增元件完整 Checklist

1. **CSS**：在 `src/styles/components/` 建立獨立 `.css` 檔案定義 CSS 類別（使用 `cu-` 前綴），並在 `src/styles/components.css` 的 `@layer components` 對應區塊（BASIC / FORMS / DATA DISPLAY / CONTENT / FEEDBACK / OVERLAY / NAVIGATION / LAYOUT / AI）加入 `@import` 語句
2. **Astro 元件**：在 `src/components/ui/` 建立對應的 `.astro` 元件檔（必須包含 `interface Props` 型別定義，使用 `class:list` 處理 class 組合）
3. **i18n 翻譯**：在 `src/i18n/pages/components/` 建立翻譯檔（`Record<Locale, {...}>` 格式，包含 en/zh-tw 翻譯）
4. **文檔頁面**：在 `src/pages/components/` 建立文檔頁面（使用 `ComponentPreview` 展示，含 Preview + Code 兩個 tab；引入翻譯並使用 `getLocaleFromUrl` + `useTranslations`，inline code 使用 `cu-code` class；code 範例使用 `cu-` class 系統，非原始 Tailwind utilities）
5. **導航**：在 `src/data/component-nav.ts` 中將元件加入對應的導航陣列（layouts / basic / typography / navigation / dataDisplay / content / forms / feedback / overlay / ai）
6. **components.json**：在根目錄 `components.json` 新增元件規格（`cssClasses`、`dataAttributes`、`aria`、`notes`、`example`）
7. **llms.txt**：在根目錄 `llms.txt` 對應分類區塊加入元件說明（CSS class 清單 + HTML 範例）
8. **互動元件 JS**（僅有 JS 互動的元件）：在 `src/scripts/cubby-ui.js` 加入 `setupXxx()` 函式（含 JSDoc + HTML 結構範例）與追蹤陣列；更新 `src/scripts/cubby-ui.d.ts` 的 `DATA_ATTRS` 常數；使用 `data-*` 屬性管理狀態（非框架狀態管理）
9. **Dark / Light mode**：在瀏覽器切換 `.dark` class，確認兩種模式下色彩 token、邊框、陰影皆正確；半透明色使用 `color-mix(in srgb, var(--color-*) N%, transparent)` 而非硬編碼 HSL
10. **CSS 規範驗證**：
    - Disabled 狀態：`disabled:pointer-events-none disabled:opacity-50 disabled:bg-muted disabled:text-muted-foreground`（帶 hover border 的輸入元件額外加 `disabled:hover:border-input`）
    - Transition：使用具體屬性（`transition-colors`、`transition-shadow`、`transition-opacity`）+ 明確 `duration-150` 或 `duration-200`，禁止 `transition-all`
    - Focus ring：導航/互動元素加 `focus-visible:ring-1 focus-visible:ring-ring/30`；關閉按鈕用 `ring-ring/40`
11. **build 驗證**：執行 `npm run build:lib` 確認 CSS 正確編譯（`@apply` 全部展開，無編譯錯誤）
12. **dev 驗證**：執行 `npm run dev` 確認 `i18n:routes` 自動產生 `src/pages/zh-tw/components/` 路由，en/zh-tw 兩語言頁面皆正常顯示

### 修改已有元件時的額外確認

- 修改 class 名稱 → 同步更新 `components.json`、`llms.txt`、docs 頁面範例
- 修改 `data-*` attribute → 同步更新 `components.json`、`llms.txt`、`cubby-ui.d.ts` 的 `DATA_ATTRS`
- 修改視覺設計 → 確認 dark/light 兩種模式皆正確

## Language

使用繁體中文。中文字元和英文字元之間加上一個半形空白字元。