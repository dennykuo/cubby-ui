# Cubby UI

框架無關的 UI 元件庫，風格類似 shadcn/ui，使用純 HTML + Tailwind CSS 構建。元件設計為可直接複製貼上使用，不依賴 React、Vue 或任何前端框架。

## Installation

### CDN（推薦）

最快速的方式，無需任何建置工具。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="https://unpkg.com/cubby-ui/dist/cubby-ui.min.css" />
</head>
<body>
  <!-- Your content -->
  <script src="https://unpkg.com/cubby-ui/dist/cubby-ui.min.js"></script>
</body>
</html>
```

### NPM

適合使用 Vite、Webpack 等打包工具的專案。

```bash
npm install cubby-ui
```

```javascript
// 在你的 JS/TS 入口檔案
import 'cubby-ui/dist/cubby-ui.css';
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
npm run dev         # 啟動開發伺服器
npm run build       # 建置文檔站點至 docs/
npm run build:lib   # 建置 NPM 套件至 dist/
npm run build:blade # 生成 Laravel Blade 匿名元件 + AI 文件至 dist/blade-components/（支援 --dry-run 預覽、--verbose 詳細輸出）
npm run preview     # 預覽建置結果
```

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

| 分類 | 元件 |
|------|------|
| Typography | Headings, Paragraphs, Blockquote, Lists, Links, Text, HR |
| Basic | Button, Button Group, Card, Color, Separator |
| Forms | Checkbox, Combobox, Dropzone, File Input, Form Group, Input, Label, Multi Select, Number Input, Radio, Range, Search Input, Select, Textarea, Toggle, Transfer List |
| Data Display | Accordion, Avatar, Badge, Collapsible, Data Table, Stat Card, Table, Tree View |
| Feedback | Alert, Empty State, Progress, Skeleton, Toast |
| Overlay | Alert Dialog, Dialog, Drawer, Dropdown Menu, Hover Card, Popover, Tooltip |
| Navigation | Breadcrumb, Menubar, Pagination, Steps, Tabs |
| Layouts | Container, Header, Nav, Scroll Area, Sidebar, Toolbar |

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

`npm run build:blade` 會在 `dist/blade-components/cu/` 內生成 AI 友善文件：

| 檔案 | 格式 | 內容 |
|------|------|------|
| `README.md` | Markdown | Blade 語法範例、props 說明、複合元件組合模式 |
| `components.json` | JSON | 結構化元件清單（tag、props with values、children、dataAttributes） |

兩個檔案放在 `cu/` 資料夾內，複製到 Laravel 專案時會一起帶過去，AI Agent 可直接讀取理解如何使用 `<x-cu.*>` 元件。

## 參考套件

- [shadcn ui](https://shadcn.github.io/shadcn-ui)
- [flowbite](https://flowbite.com)
- [flyonui](https://flyonui.com)
- [Tailwind CSS](https://tailwindcss.com)
