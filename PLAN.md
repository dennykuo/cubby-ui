# Cubby UI 優化計劃

文檔站與元件頁面的設計優化項目，依優先順序排列。

## 一、文檔站整體佈局

### 1. ~~Header 加入搜尋按鈕~~ ✅

在 Header 中間加一個搜尋觸發按鈕（`⌘K` 快捷鍵提示），即使不實作真正搜尋，視覺上也更完整。

```html
<button class="cu-button cu-button-outline cu-button-sm text-muted-foreground gap-2 w-56">
  <svg ...search-icon />
  <span class="flex-1 text-left text-xs">搜尋元件...</span>
  <kbd class="text-[10px] border border-border rounded px-1.5 py-0.5 bg-muted">⌘K</kbd>
</button>
```

### 2. ~~Header 加入 dark mode toggle~~ ✅

在 GitHub icon 旁加太陽/月亮切換按鈕，展示暗色模式支援，也讓文檔站更實用。

### 3. 元件頁底部 prev/next 導航

每個元件文檔頁底部加上「上一個 / 下一個」元件連結，方便連續瀏覽：

```html
<div class="mt-16 flex items-center justify-between border-t border-border pt-6">
  <a href="/components/badge" class="group text-sm text-muted-foreground hover:text-foreground">
    <span class="text-xs">上一個</span>
    <span class="block font-medium">Badge</span>
  </a>
  <a href="/components/card" class="group text-sm text-muted-foreground hover:text-foreground text-right">
    <span class="text-xs">下一個</span>
    <span class="block font-medium">Card</span>
  </a>
</div>
```

---

## 二、元件文檔頁面結構

### 4. ~~頁面標題區增加層次~~ ✅

加入 breadcrumb 導航 + 分類 badge：

```html
<div class="space-y-4">
  <div class="flex items-center gap-1.5 text-xs text-muted-foreground">
    <a href="/">Docs</a> <span>/</span>
    <a href="/components/button">Components</a> <span>/</span>
    <span class="text-foreground">Button</span>
  </div>
  <div class="flex items-center gap-3">
    <h1 class="text-3xl font-bold tracking-tight">Button</h1>
    <span class="cu-badge cu-badge-secondary">Basic</span>
  </div>
  <p class="text-base text-muted-foreground leading-relaxed">...</p>
</div>
```

### 5. ~~Section 標題加 anchor link~~ ✅

加入 `#` anchor link icon，hover 時顯示：

```html
<h2 class="text-lg font-semibold tracking-tight flex items-center gap-2 group">
  <a href="#variants" class="text-muted-foreground/0 group-hover:text-muted-foreground transition-colors duration-150">#</a>
  Variants
</h2>
```

### 6. ~~統一描述文字字級~~ ✅

頁面描述 `text-base`，section 描述 `text-sm`，落差稍大。統一為 `text-[15px]` 或讓 section 描述也用 `text-base text-muted-foreground`。

---

## 三、ComponentPreview 優化

### 7. Preview 區加入 responsive 切換按鈕

Preview 上方加裝置寬度切換按鈕（Desktop / Tablet / Mobile）。

### 8. ~~Preview 背景網格改為更淡~~ ✅

目前 `#e5e7eb_1px` 在某些元件上干擾視覺，改為 `#f1f5f9_1px` 或加背景切換按鈕。

### 9. Code 區可折疊

長程式碼區塊預設收折至 ~200px，點擊展開：

```html
<div class="code-container max-h-[200px] overflow-hidden" data-cu-code-collapsed>
  ...
  <button class="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-muted/80 ...">
    展開程式碼
  </button>
</div>
```

---

## 四、首頁

### 10. Hero 區更有氣勢

加入更大標題、tagline、版本 badge：

```html
<div class="space-y-4">
  <div class="flex items-center gap-2">
    <span class="cu-badge cu-badge-secondary">v1.0</span>
    <span class="text-xs text-muted-foreground">Tailwind CSS v4</span>
  </div>
  <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">
    精緻優雅的<br />UI 元件庫
  </h1>
  <p class="text-lg text-muted-foreground leading-relaxed max-w-xl">
    框架無關。純 HTML + Tailwind CSS。複製貼上即可使用。
  </p>
</div>
```

### 11. 元件分類 grid 加 icon + hover 效果

每個分類加圖示、hover 邊框和陰影效果，並連結到對應元件頁：

```html
<a href="/components/button" class="rounded-xl border border-border p-5 space-y-2 transition-all duration-200 hover:border-primary/30 hover:shadow-sm group">
  <div class="flex items-center gap-2">
    <div class="flex size-8 items-center justify-center rounded-lg bg-primary/8 text-primary">
      <svg ...icon />
    </div>
    <p class="text-sm font-semibold group-hover:text-primary transition-colors duration-150">Basic</p>
  </div>
  <p class="text-xs text-muted-foreground">Button、Button Group、Card、Color、Separator</p>
</a>
```

### 12. 加入「快速開始」程式碼片段

首頁加一個 code block 展示如何引入 CSS 和使用元件。

---

## 五、細節打磨

### 13. `cu-code` inline code 加入 click to copy

點擊 inline code（如 `cu-button`）時自動複製文字。

### 14. 元件頁加入 Props / Classes 參考表

每個元件頁底部加 table 列出可用 CSS classes 和說明：

| Class | 說明 |
|-------|------|
| `cu-button` | 基礎按鈕 |
| `cu-button-default` | 預設變體 |
| `cu-button-sm` | 小尺寸 |

### 15. Transition 統一

所有互動元素統一使用具體 transition 屬性（`transition-colors`、`transition-shadow`）+ `duration-200`，避免 `transition-all duration-300`。

### 16. Sidebar 當前分類展開/收合

預設只展開當前所在分類，其他收合，減少捲動量。
