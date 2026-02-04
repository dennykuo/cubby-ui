# Agent Guide

## Project Overview

Cubby UI 是一個框架無關的 UI 元件庫，使用純 HTML + Tailwind CSS 構建，文檔站點使用 Astro 5。

## Guidelines

- 使用繁體中文，中文字元和英文字元之間加上一個半形空白字元
- 所有元件 CSS 類別使用 `cu-` 前綴（定義於 `src/config.ts` 的 `TOP_CLASS`）
- 元件 CSS 定義在 `src/styles/components/*.css`，透過 `src/styles/components.css` 的 `@layer components` 匯入
- Astro 元件在 `src/components/ui/`，必須使用 `interface Props` 型別定義和 `class:list` 處理 class 組合
- 文檔頁面在 `src/pages/components/`，使用 `ComponentPreview` 展示
- 使用 `data-*` 屬性處理互動狀態，不使用框架狀態管理
- 風格簡約細緻、優雅，避免庸俗高亮度的元素和顏色

## Adding New Components

1. 在 `src/styles/components/` 建立 `.css` 檔案（使用 `cu-` 前綴），並在 `src/styles/components.css` 對應區塊加入 `@import`
2. 在 `src/components/ui/` 建立 `.astro` 元件檔
3. 在 `src/pages/components/` 建立文檔頁面
4. 在 `src/components/sidebar/Sidebar.astro` 將元件加入對應的導航陣列

## Commands

```bash
npm run dev       # 啟動開發伺服器
npm run build     # 建置文檔站點至 docs/
npm run preview   # 預覽建置結果
npm run build:lib # 建置 NPM 套件至 dist/
```

## NPM Package

執行 `npm run build:lib` 產生：
- `dist/cubby-ui.css` / `.min.css` — 預編譯 CSS
- `dist/cubby-ui.js` / `.min.js` — 互動元件 JS
- `dist/src/` — 原始 Tailwind CSS

互動元件 JS 原始檔：`src/scripts/cubby-ui.js`
