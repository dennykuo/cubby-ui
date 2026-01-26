# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cubby UI 是一個框架無關的 UI 元件庫，風格類似 shadcn/ui，使用純 HTML + Tailwind CSS 構建。元件設計為可直接複製貼上使用，不依賴 React、Vue 或任何前端框架。

示範文檔站點使用 Astro 構建。

## Commands

- `npm run dev` — 啟動 Astro 開發伺服器
- `npm run build` — 建置靜態站點
- `npm run preview` — 預覽建置結果

目前無 lint 或 test 命令。

## Architecture

### 技術棧

- **Astro 5** — 靜態站點生成（示範文檔站點）
- **Tailwind CSS v4** — 使用 CSS `@theme` 指令定義設計 token（非 tailwind.config.js）
- **astro-expressive-code** — 程式碼區塊語法高亮（主題：github-dark, github-light；內建複製按鈕已停用）
- **Vanilla JS** — 極少量，僅用於互動效果，使用 `data-*` 屬性管理狀態

### 元件系統

元件有兩個層次：

1. **CSS 類別層**（`src/styles/components.css` + `src/styles/components/*.css`）— 在 `@layer components` 中定義，使用 `cu-` 前綴（Cubby）。`components.css` 僅包含 `@layer components {}` 包裝和 `@import` 語句，各元件 CSS 規則拆分至 `components/` 資料夾的獨立檔案。CSS 按領域分七個區塊：`BASIC`（Button, Card）→ `FORMS`（Label ~ Form Group）→ `DATA DISPLAY`（Badge, Avatar, Table, Accordion）→ `FEEDBACK`（Alert, Progress, Skeleton）→ `OVERLAY`（Dialog, Dropdown Menu, Tooltip）→ `NAVIGATION`（Breadcrumb, Pagination, Tabs）→ `LAYOUT`（Container, Header, Nav, Sidebar）。這是元件的核心，純 HTML 專案可以只用這些 CSS 類別。
2. **Astro 元件層**（`src/components/ui/`）— 包裝 CSS 類別的 `.astro` 檔案，提供 TypeScript Props 型別安全和屬性透傳。

### CSS 類別命名規則

所有元件類別使用 `cu-` 前綴（來自 `src/config.ts` 的 `TOP_CLASS`）：

- 基礎類別：`cu-{component}`（例如 `cu-button`, `cu-input`, `cu-card`, `cu-sidebar`）
- 變體類別：`cu-{component}-{variant}`（例如 `cu-button-destructive`, `cu-button-outline`）
- 尺寸類別：`cu-{component}-{size}`（例如 `cu-button-sm`, `cu-button-lg`, `cu-toggle-sm`）
- 子元件：`cu-{component}-{part}`（例如 `cu-card-header`, `cu-sidebar-content`, `cu-sidebar-item`）
- 包裝器：`cu-{component}-wrapper`（例如 `cu-checkbox-wrapper`, `cu-toggle-wrapper`, `cu-select-wrapper`）
- 狀態類別：`cu-{component}-{part}-{state}`（例如 `cu-sidebar-item-active`）

### 設計系統

主題定義在 `src/styles/global.css` 的 `@theme` 區塊中，使用 CSS 變數：

- 語意色彩：primary, secondary, destructive, success, warning, info, muted, accent
- 每個色彩有配對的 foreground 色（例如 `--color-primary` / `--color-primary-foreground`）
- 支援暗色模式（`.dark` class）
- 支援 `prefers-reduced-motion` 全域降低動畫
- 文檔站工具類別：`.cu-code`（inline code 樣式，定義在 `global.css`）

### 目錄結構

```
src/
├── components/
│   ├── Header.astro              — 頂部導航列（使用 cu-header / cu-header-brand / cu-header-actions）
│   ├── ComponentPreview.astro     — 元件展示框（Preview/Code 切換）
│   ├── sidebar/                   — 文檔站點專用側邊欄（使用 cu-sidebar-* classes）
│   │   ├── Sidebar.astro          — 側邊欄（包含導航資料與結構）
│   │   ├── SidebarSection.astro   — 第一層分類標題（使用 cu-sidebar-section-title）
│   │   ├── SidebarGroup.astro     — 第二層副標題（使用 cu-sidebar-group / cu-sidebar-group-title）
│   │   └── SidebarLink.astro      — 導航連結（使用 cu-sidebar-item / cu-sidebar-item-active）
│   └── ui/                        — 可重用 UI 元件
│       ├── Accordion*.astro       — 手風琴（Accordion, AccordionItem, AccordionTrigger, AccordionContent）
│       ├── Alert*.astro           — 警示（Alert, AlertTitle, AlertDescription）
│       ├── AlertDialog*.astro     — 阻斷對話框（AlertDialog, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter）
│       ├── Avatar*.astro          — 頭像（Avatar, AvatarImage, AvatarFallback）
│       ├── Badge.astro            — 徽章（variant prop）
│       ├── Breadcrumb*.astro      — 麵包屑（Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbCurrent）
│       ├── Button.astro           — 按鈕（variant + size props）
│       ├── Card*.astro            — 卡片（Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter）
│       ├── Checkbox.astro         — 核取方塊（自訂勾勾）
│       ├── Collapsible*.astro     — 可折疊區塊（Collapsible, CollapsibleTrigger, CollapsibleContent）
│       ├── Container.astro        — 容器（size prop）
│       ├── Dialog*.astro          — 對話框（Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose）
│       ├── Dropdown*.astro        — 下拉選單（Dropdown, DropdownContent, DropdownItem, DropdownLabel, DropdownSeparator）
│       ├── FileInput.astro        — 檔案上傳
│       ├── FormGroup.astro        — 表單群組容器
│       ├── FormDescription.astro  — 表單說明文字
│       ├── FormError.astro        — 表單錯誤訊息
│       ├── Header*.astro          — 頂部列（Header, HeaderInner, HeaderBrand, HeaderNav, HeaderActions）
│       ├── HoverCard*.astro       — 懸停卡片（HoverCard, HoverCardContent）
│       ├── Input.astro            — 文字輸入框
│       ├── Label.astro            — 表單標籤
│       ├── Menubar*.astro         — 選單列（Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator, MenubarLabel, MenubarShortcut）
│       ├── Nav.astro              — 導航選單（vertical prop）
│       ├── NavItem.astro          — 導航項目（active prop）
│       ├── Pagination*.astro      — 分頁（Pagination, PaginationItem, PaginationPrev, PaginationNext, PaginationEllipsis）
│       ├── Popover*.astro         — 彈出層（Popover, PopoverContent）
│       ├── Progress.astro         — 進度條（value prop）
│       ├── Radio.astro            — 單選按鈕（自訂圓點）
│       ├── Range.astro            — 滑桿
│       ├── SearchInput.astro      — 搜尋欄（含搜尋圖示）
│       ├── Select.astro           — 下拉選擇（含裝飾箭頭）
│       ├── Separator.astro        — 分隔線（orientation prop）
│       ├── Sheet*.astro           — 側邊面板（Sheet, SheetHeader, SheetTitle, SheetDescription, SheetContent, SheetFooter, SheetClose）
│       ├── Sidebar*.astro         — 側邊欄（Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarSection, SidebarSectionTitle, SidebarGroup, SidebarGroupTitle, SidebarItem, SidebarSeparator）
│       ├── Skeleton.astro         — 骨架屏
│       ├── Textarea.astro         — 多行輸入框
│       └── Toggle.astro           — 開關（純 CSS，size prop）
├── config.ts                      — 全域配置（TOP_CLASS = 'cu'）
├── layouts/
│   └── Layout.astro               — 主布局（引入 Header + Sidebar）
├── pages/
│   ├── index.astro                — 首頁
│   └── components/                — 元件文檔頁面
│       ├── accordion.astro
│       ├── alert.astro
│       ├── alert-dialog.astro
│       ├── avatar.astro
│       ├── badge.astro
│       ├── breadcrumb.astro
│       ├── button.astro
│       ├── card.astro
│       ├── checkbox.astro
│       ├── collapsible.astro
│       ├── color.astro
│       ├── container.astro
│       ├── data-table.astro
│       ├── dialog.astro
│       ├── dropdown.astro
│       ├── file-input.astro
│       ├── form-group.astro
│       ├── header.astro
│       ├── hover-card.astro
│       ├── input.astro
│       ├── label.astro
│       ├── menubar.astro
│       ├── nav.astro
│       ├── pagination.astro
│       ├── popover.astro
│       ├── progress.astro
│       ├── radio.astro
│       ├── range.astro
│       ├── search-input.astro
│       ├── select.astro
│       ├── separator.astro
│       ├── sheet.astro
│       ├── sidebar.astro
│       ├── skeleton.astro
│       ├── tabs.astro
│       ├── textarea.astro
│       ├── toast.astro
│       ├── toggle.astro
│       └── tooltip.astro
└── styles/
    ├── global.css                 — 設計 token、主題變數、.cu-code 工具類別
    ├── components.css             — @layer components 包裝 + @import 各子檔案
    └── components/                — 各元件獨立 CSS 檔案
        ├── accordion.css
        ├── alert.css
        ├── alert-dialog.css
        ├── avatar.css
        ├── badge.css
        ├── breadcrumb.css
        ├── button.css
        ├── card.css
        ├── checkbox.css
        ├── collapsible.css
        ├── container.css
        ├── data-table.css
        ├── dialog.css
        ├── dropdown.css
        ├── file-input.css
        ├── form-group.css
        ├── header.css
        ├── hover-card.css
        ├── input.css
        ├── label.css
        ├── menubar.css
        ├── nav.css
        ├── pagination.css
        ├── popover.css
        ├── progress.css
        ├── radio.css
        ├── range.css
        ├── search-input.css
        ├── select.css
        ├── separator.css
        ├── sheet.css
        ├── sidebar.css
        ├── skeleton.css
        ├── table.css
        ├── tabs.css
        ├── textarea.css
        ├── toast.css
        ├── toggle.css
        └── tooltip.css
```

### Astro 元件模式

所有 UI 元件統一使用 `interface Props` 型別定義和 `class:list` 處理 class 組合。分為三種模式：

1. **Simple**（Label, Input, Textarea, Checkbox, Radio, Range, FormGroup, Card 子元件, Header 子元件, Sidebar 子元件, Alert 子元件, Avatar 子元件, Dialog 子元件, Dropdown 子元件, Breadcrumb 子元件, Table 子元件, Accordion 子元件, Skeleton, Pagination 等）— 定義 `interface Props { class?: string; [key: string]: any; }`，提取 `class` + `...rest`，使用 `class:list={[baseClass, className]}` 和 `<slot />`。
2. **Composite**（SearchInput, Select, Progress）— 包含包裝器 + 內部子元素（如圖示、輸入框、進度條），props 轉發給內部元素。
3. **Complex**（Button, Toggle, Container, Nav, NavItem, SidebarItem, Badge, Alert, Avatar, PaginationItem）— 有 `variant` / `size` / `active` / `vertical` 等 typed props，使用 `class:list` 組合多個條件 class。

### 側邊欄架構

#### 文檔站點側邊欄（`src/components/sidebar/`）

導航資料集中在 `Sidebar.astro` 中管理，分為八個陣列：`gettingStarted`、`basicComponents`、`formComponents`、`dataDisplayComponents`、`feedbackComponents`、`overlayComponents`、`navigationComponents`、`layoutComponents`（已按字母排序）。
側邊欄子元件使用 `cu-*` CSS classes（dog-fooding）：`SidebarSection`（`cu-sidebar-section-title`）→ `SidebarGroup`（`cu-sidebar-group` + `cu-sidebar-group-title`）→ `SidebarLink`（`cu-sidebar-item` + `cu-sidebar-item-active`）。
新增元件時只需在此檔案的對應陣列加一筆資料。

元件分類：
- **Components > Basic** — Button, Card, Color, Separator
- **Components > Forms** — Label, Input, Textarea, Select, Checkbox, Radio, Toggle, Search Input, File Input, Range, Form Group
- **Components > Data Display** — Accordion, Avatar, Badge, Collapsible, Data Table, Table
- **Components > Feedback** — Alert, Progress, Skeleton, Toast
- **Components > Overlay** — Alert Dialog, Dialog, Dropdown Menu, Hover Card, Popover, Sheet, Tooltip
- **Components > Navigation** — Breadcrumb, Menubar, Pagination, Tabs
- **Components > Layouts** — Container, Header, Nav, Sidebar

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
- `cu-header-nav` — 中間導航區（`hidden md:flex`，行動端隱藏）
- `cu-header-actions` — 右側操作區（`gap-2`）

#### UI Nav 元件（`src/components/ui/Nav*.astro`）

導航選單元件，可獨立使用或放在 Header 內，支援水平與垂直排列：

- `cu-nav` — 容器（`flex items-center gap-1`）
- `cu-nav-item` — 導航連結（`text-sm`、`hover:bg-muted/60`）
- `cu-nav-item-active` — 啟用狀態（`bg-primary/8 font-medium text-primary`）
- `cu-nav-vertical` — 垂直排列（`flex-col items-stretch gap-0.5`，適合側邊欄）

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

1. 在 `src/styles/components/` 資料夾中建立對應的獨立 `.css` 檔案定義 CSS 類別（使用 `cu-` 前綴），並在 `src/styles/components.css` 的 `@layer components` 對應區塊（BASIC / FORMS / DATA DISPLAY / FEEDBACK / OVERLAY / NAVIGATION / LAYOUT）中加入 `@import` 語句
2. 在 `src/components/ui/` 中建立對應的 `.astro` 元件檔（必須包含 `interface Props` 型別定義，使用 `class:list` 處理 class 組合）
3. 在 `src/pages/components/` 中建立文檔頁面（使用 `ComponentPreview` 展示，inline code 使用 `cu-code` class）
4. 在 `src/components/sidebar/Sidebar.astro` 中將元件加入對應的導航陣列（Basic / Forms / Data Display / Feedback / Overlay / Navigation / Layouts）
5. 文檔頁面的 code 範例使用 `cu-` class 系統（非原始 Tailwind utilities）
6. 使用 `data-*` 屬性處理互動狀態（非框架狀態管理）

## Language

使用繁體中文。中文字元和英文字元之間加上一個半形空白字元。