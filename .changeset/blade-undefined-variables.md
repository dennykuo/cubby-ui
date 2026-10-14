---
"cubby-ui": patch
---

修正多個 Laravel Blade 元件在 Laravel 中渲染時拋出 `Undefined variable`，以及輸出殘留 Astro / JSX 語法的問題。

- Carousel、Resizable、Steps、Breadcrumb Current、Progress、Chat Bubble、Command Palette Group / Input、Segmented Control Item 不再引用未宣告的變數（如 `$baseClass`、`$clampedValue`、`$bubbleRole`、`$id`）：可靜態求值的 frontmatter 常數直接內聯，依賴 prop 的值改在 `@props` 後以 `@php` 宣告
- Color Picker 的 `swatches` 改為 `@foreach` 輸出色票按鈕（原本輸出未轉譯的 `.map()`）
- Sortable Item 的 `draggable`、Toggle Group Item 的 `aria-pressed` 改為正確的 Blade 輸出；Command Palette Group 的 heading、Stat Trend 的上下箭頭改為 `@if`
- List 依 `type` 輸出 `<ol>` / `<ul>`（原本輸出字面的 `<Tag>`）；Date Picker 內嵌的月曆改為 `<x-cu.calendar>`，並補回未選日期時的 placeholder class
- `npm run test:blade` 新增未宣告變數、殘留 JSX 屬性 / 表達式、未轉譯 Astro tag 的檢查，並以 `illuminate/view` 實際渲染每個元件（CI 以 `--require-render` 執行）
