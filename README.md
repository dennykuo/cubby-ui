# Cubby UI

框架無關的 UI 元件庫，風格類似 shadcn/ui，使用純 HTML + Tailwind CSS 構建。元件設計為可直接複製貼上使用，不依賴 React、Vue 或任何前端框架。

**文檔站**：<https://dennykuo.github.io/cubby-ui/>（每次 `main` 的 CI 通過後自動部署）

## Installation

### CDN（推薦）

最快速的方式，無需任何建置工具。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="https://unpkg.com/cubby-ui/dist/core/cubby-ui.min.css" />
</head>
<body>
  <!-- Your content -->
  <script src="https://unpkg.com/cubby-ui/dist/core/cubby-ui.min.js"></script>
</body>
</html>
```

### NPM

適合使用 Vite、Webpack 等打包工具的專案。

```bash
npm install cubby-ui
```

此為私有套件，可透過 git URL 安裝：

```bash
# SSH
npm install git+ssh://git@github.com:dennykuo/cubby-ui.git

# 指定分支
npm install git+ssh://git@github.com:dennykuo/cubby-ui.git#develop
```

安裝時會自動執行 `prepare` script 進行建置（`build:all`），產生 `dist/` 下所有產出（CSS、JS、Laravel Blade 元件等），無需手動 build。

```javascript
// 在你的 JS/TS 入口檔案
import 'cubby-ui/css';
import 'cubby-ui';  // 自動初始化互動元件
```

### Manual（Tailwind CSS 原始碼）

適合需要自訂主題的進階用戶，需要 Tailwind CSS v4。

複製 `src/styles/` 至你的專案，然後在 CSS 中引入：

```css
@import "tailwindcss";
@import "./cubby-ui/components.css";
@import "./cubby-ui/global.css";
```

## Tech Stack

- **Tailwind CSS v4** — 使用 CSS `@theme` 指令定義設計 token
- **Vanilla JS** — 極少量，僅用於互動效果，使用 `data-*` 屬性管理狀態
- **Astro 5** — 文檔站點（開發用）

## Commands

```bash
npm run dev         # 啟動開發伺服器（i18n 路由由 Vite plugin 自動同步）
npm run build       # 建置 NPM 套件至 dist/（CSS + JS）
npm run build:blade # 生成 Laravel Blade 元件至 dist/laravel/
npm run build:all   # 一次建置全部（build + build:blade）
npm run build:docs  # 建置文檔站點至 docs/
npm run check:links # 檢查文檔站站內連結（需先 build:docs）
npm run preview     # 預覽建置結果
```

> `prepare` script 會在 `npm install`（含 git URL 安裝）時自動執行 `build:all`，確保 `dist/` 產出可用。

## 元件系統

元件有兩個層次：

1. **CSS 類別層**（`src/styles/components.css` + `src/styles/components/*.css`）— 在 `@layer components` 中定義，使用 `cu-` 前綴
2. **Astro 元件層**（`src/components/ui/`）— 包裝 CSS 類別的 `.astro` 檔案，提供 TypeScript Props 型別安全和屬性透傳

### CSS 類別命名規則

所有元件類別使用 `cu-` 前綴：

- 基礎類別：`cu-{component}`（例如 `cu-button`, `cu-input`, `cu-card`）
- 變體類別：`cu-{component}-{variant}`（例如 `cu-button-destructive`, `cu-button-outline`）
- 尺寸類別：`cu-{component}-{size}`（例如 `cu-button-sm`, `cu-button-lg`）
- 子元件：`cu-{component}-{part}`（例如 `cu-card-header`, `cu-sidebar-content`）
- 包裝器：`cu-{component}-wrapper`（例如 `cu-checkbox-wrapper`）
- 狀態類別：`cu-{component}-{part}-{state}`（例如 `cu-sidebar-item-active`）

### 元件分類

分類與順序和文檔站側邊欄一致（來源：`src/data/component-nav.ts`），`npm run check:sync` 會檢查兩者是否同步。

| 分類 | 元件 |
|------|------|
| Layouts | Container, Filter Bar, Header, Kanban, Nav, Page Header, Resizable Panels, Scroll Area, Sidebar, Toolbar |
| Basic | Aspect Ratio, Avatar, Badge, Button, Button Group, Card, Color, Separator |
| Typography | Headings, Kbd, Paragraphs, Blockquote, Lists, Links, Text, HR |
| Navigation | Breadcrumb, Menubar, Pagination, Segmented Control, Speed Dial, Steps, Tabs, Back to Top |
| Data Display | Accordion, Chart, Code Block, Collapsible, Data Table, Setting Item, Sortable List, Stat Card, Table, Timeline, Tree View |
| Content | Carousel, Countdown, Diff Viewer, Image Compare, Marquee |
| Forms | Checkbox, Checkbox Group, Color Picker, Combobox, Date Picker, Dropzone, File Input, Floating Label, Form Group, Input, Input Group, Label, Multi Select, Number Input, Password Input, Pin Input, Radio, Range, Rating, Search Input, Select, Tag Input, Textarea, Toggle, Toggle Group, Transfer List |
| Feedback | Alert, Empty State, Progress, Skeleton, Notification, Spinner, Toast |
| Overlay | Alert Dialog, Command Palette, Context Menu, Dialog, Drawer, Dropdown Menu, Hover Card, Popover, Tooltip, Tour |
| AI | Chat Bubble, Chat Input, Chat Typing |

## Style Guide

- 風格簡約細緻、優雅，避免庸俗高亮度的元素和顏色
- 使用淺色陰影營造深淺層次
- 適度使用圓角營造柔和感
- 表單元素使用 `appearance-none` 搭配自訂樣式，避免瀏覽器原生呆板感
- Checkbox 使用 SVG checkmark，Radio 使用粗 border 內圓點，Toggle 使用純 CSS hidden checkbox + sibling selector
- 所有文字輸入框（Input、Textarea、Select、Search Input）帶有 `hover:border` 微互動
- Range slider 的 thumb 帶有 hover 光暈效果

## For AI Coding Assistants

Cubby UI 提供以下機器可讀資源，讓 AI coding tools 能精確產出正確的 HTML 結構與 class 組合：

| 檔案 | 格式 | 內容 |
|------|------|------|
| [`llms.txt`](./llms.txt) | 純文字 | 完整元件清單、CSS class 說明、`data-*` attribute 對照表、HTML 範例 |
| [`components.json`](./components.json) | JSON | 機器可讀元件 manifest（cssClasses、dataAttributes、ARIA roles、notes） |

```js
// 程式化讀取元件規格
import manifest from 'cubby-ui/components.json';
const button = manifest.components.find(c => c.name === 'Button');
// → { cssClasses: { base: 'cu-button', variants: [...] }, interactive: false, ... }
```

大多數 AI coding tools（Cursor、Claude Code、GitHub Copilot）會自動讀取專案根目錄的 `llms.txt`。

### Laravel Blade

套件內含自動生成的 Blade 匿名元件，在 `AppServiceProvider` 加一行即可從 `node_modules` 直接載入：

```php
// app/Providers/AppServiceProvider.php boot()
Blade::anonymousComponentPath(
    base_path('node_modules/cubby-ui/dist/laravel/components'),
    'cu'
);
```

CSS / JS 透過 Vite 引入：

```js
// resources/js/app.js
import 'cubby-ui/css';
import 'cubby-ui';
```

所有資源皆從 `node_modules` 載入，`npm update cubby-ui` 即自動更新全部。詳細設定請參考 `dist/laravel/README.md`。`dist/laravel/components/cu/` 內另有 AI 友善文件（`README.md` + `components.json`），供 AI Agent 理解如何使用 `<x-cu.*>` 元件。

## 參考套件

- [shadcn ui](https://shadcn.github.io/shadcn-ui)
- [flowbite](https://flowbite.com)
- [flyonui](https://flyonui.com)
- [Tailwind CSS](https://tailwindcss.com)
