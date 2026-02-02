# Cubby UI

框架無關的 UI 元件庫，風格類似 shadcn/ui，使用純 HTML + Tailwind CSS 構建。元件設計為可直接複製貼上使用，不依賴 React、Vue 或任何前端框架。

示範文檔站點使用 Astro 構建。

## Tech Stack

- **Astro 5** — 靜態站點生成（示範文檔站點）
- **Tailwind CSS v4** — 使用 CSS `@theme` 指令定義設計 token
- **astro-expressive-code** — 程式碼區塊語法高亮
- **Vanilla JS** — 極少量，僅用於互動效果，使用 `data-*` 屬性管理狀態

## Commands

```bash
npm run dev       # 啟動 Astro 開發伺服器
npm run build     # 建置靜態站點
npm run preview   # 預覽建置結果
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

## 參考套件

- [shadcn ui](https://shadcn.github.io/shadcn-ui)
- [flowbite](https://flowbite.com)
- [flyonui](https://flyonui.com)
- [Tailwind CSS](https://tailwindcss.com)
