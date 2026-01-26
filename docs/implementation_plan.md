# 實作計畫 - tw-components

## 目標描述
建立一個極簡、優雅的元件庫，使用純 HTML 和 Tailwind CSS。目標是擁有類似 shadcn/ui 的美學和實用性，但不綁定 React、Vue 或任何特定框架。元件應設計為可直接複製貼上使用。

## 需使用者審查事項
> [!IMPORTANT]
> **元件架構決策**：
> 由於這些是純 HTML/Tailwind，「元件」本質上是 HTML 片段。
> - **方法**：我們將建立一個 `src/components` 目錄，每個元件有自己的資料夾（例如 `src/components/button.html`）或在主頁面中演示。
> - **JS**：我們需要決定是否要為互動元件（下拉選單、模態框）使用單一的全域 `ui.js` 或內聯腳本。**建議**：採用小巧、模組化的 Vanilla JS 方法（例如使用 data attributes）以保持解耦。

> [!NOTE]
> **圖示**：我們將使用像 `lucide-static` 這樣的圖示庫或 SVG 片段以保持獨立性。

## 預計變更

### 專案結構 (Astro)
已遷移至 Astro 以獲得更好的元件管理與文件體驗。我們使用 `astro-expressive-code` 來強化程式碼展示區塊。

```text
tw-components/
├── astro.config.mjs    # Astro 設定 (整合 Tailwind v4, Expressive Code)
├── src/
│   ├── layouts/        # 版面配置 (Sidebar, Header)
│   ├── pages/          # 文件頁面
│   │   ├── components/ # 個別元件頁面
│   ├── styles/         # 全域樣式 (CSS 變數)
│   ├── components/     # UI 元件展示 (Astro 檔案)
│       ├── ui/         # 可重用元件 (Button.astro, Card.astro)
│       │   ├── Button.astro
│       │   ├── Card.astro
│       │   └── ...
```
├── index.html          # 文件 / 列出所有元件的著陸頁
├── package.json
├── tailwind.config.js
├── src/
│   ├── main.css        # 基礎樣式、變數（用於主題的 CSS 變數）
│   ├── main.js         # 入口點
│   ├── utils.js        # cn() 輔助函式（clsx + tailwind-merge 等效功能，如果有需要）
│   └── components/     # 元件演示/片段
│       ├── button/
│       │   ├── button.html
│       │   └── button.js (如果有需要)
│       ├── card/
│       │   └── card.html
│       ├── input/
│       │   └── input.html
│       └── ...
```

### 核心設計系統 (`src/main.css`)
- 定義顏色的 CSS 變數（background, foreground, primary, secondary, muted, accent, destructive, border, input, ring）。
- 圓角變數 (Radius)。
- 排版設定 (Typography)。

### 初始元件清單
1.  **Button (按鈕)**：變體 (default, secondary, outline, ghost, link, destructive)。尺寸 (sm, default, lg, icon)。
### Javascript 邏輯
- 使用 data attributes 來控制狀態（例如 `data-state="open"`）。
- 在初始化時委派或附加事件監聽器。
