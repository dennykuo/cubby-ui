# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cubby UI 是一個框架無關的 UI 元件庫，風格類似 shadcn/ui，使用純 HTML + Tailwind CSS 構建。元件設計為可直接複製貼上使用，不依賴 React、Vue 或任何前端框架。文檔站點使用 Astro 構建。

## Commands

- `npm run dev` — 啟動 Astro 開發伺服器
- `npm run build` — 建置靜態站點
- `npm run preview` — 預覽建置結果

目前無 lint 或 test 命令。

## Architecture

### 技術棧

- **Astro 5** — 靜態站點生成（文檔站點）
- **Tailwind CSS v4** — 使用 CSS `@theme` 指令定義設計 token（非 tailwind.config.js）
- **astro-expressive-code** — 程式碼區塊語法高亮（主題：github-dark, github-light）
- **Vanilla JS** — 極少量，僅用於互動效果，使用 `data-*` 屬性管理狀態

### 元件系統

元件有兩個層次：

1. **CSS 類別層**（`src/styles/components.css`）— 在 `@layer components` 中定義，使用 `cu-` 前綴（Cubby）。這是元件的核心，純 HTML 專案可以只用這些 CSS 類別。
2. **Astro 元件層**（`src/components/ui/`）— 包裝 CSS 類別的 `.astro` 檔案，提供 TypeScript Props 型別安全和屬性透傳。

### CSS 類別命名規則

所有元件類別使用 `cu-` 前綴（來自 `src/config.ts` 的 `TOP_CLASS`）：

- 基礎類別：`cu-{component}`（例如 `cu-button`, `cu-card`）
- 變體類別：`cu-{component}-{variant}`（例如 `cu-button-destructive`, `cu-button-outline`）
- 尺寸類別：`cu-{component}-{size}`（例如 `cu-button-sm`, `cu-button-lg`）
- 子元件：`cu-{component}-{part}`（例如 `cu-card-header`, `cu-card-title`）

### 設計系統

主題定義在 `src/styles/global.css` 的 `@theme` 區塊中，使用 CSS 變數：

- 語意色彩：primary, secondary, destructive, success, warning, info, muted, accent
- 每個色彩有配對的 foreground 色（例如 `--color-primary` / `--color-primary-foreground`）
- 支援暗色模式（`.dark` class）

### 目錄結構重點

- `src/components/ui/` — 可重用 UI 元件（Astro 元件）
- `src/styles/global.css` — 設計 token 與主題變數
- `src/styles/components.css` — 所有元件的 CSS 類別定義
- `src/pages/` — Astro 路由頁面（文檔站點）
- `src/layouts/Layout.astro` — 主布局（Sidebar + Header）
- `src/config.ts` — 全域配置（`TOP_CLASS = 'cu'`）
- `docs/implementation_plan.md` — 元件實作計畫

## Style Guide

- 風格簡約細緻、優雅，避免庸俗高亮度的元素和顏色
- 使用淺色陰影營造深淺層次
- 適度使用圓角營造柔和感
- 適度使用漸層營造顏色層次
- 美學參考：shadcn/ui

## Adding New Components

1. 在 `src/styles/components.css` 的 `@layer components` 中定義 CSS 類別（使用 `cu-` 前綴）
2. 在 `src/components/ui/` 中建立對應的 `.astro` 元件檔
3. 在 `src/pages/components/` 中建立文檔頁面
4. 使用 `data-*` 屬性處理互動狀態（非框架狀態管理）

## Language

中文使用繁體中文。中文字元和英文字元之間加上一個半形空白字元。
