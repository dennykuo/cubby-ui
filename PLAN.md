# Cubby UI 優化計劃

文檔站與元件頁面的設計優化項目，依優先順序排列。

## 一、文檔站整體佈局

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

## 三、ComponentPreview 優化

### 7. Preview 區加入 responsive 切換按鈕

Preview 上方加裝置寬度切換按鈕（Desktop / Tablet / Mobile）。

---

## 五、細節打磨

### 15. Transition 統一

所有互動元素統一使用具體 transition 屬性（`transition-colors`、`transition-shadow`）+ `duration-200`，避免 `transition-all duration-300`。
