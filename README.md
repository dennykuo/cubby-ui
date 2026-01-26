# Cubby UI

## Description
- 風格近似於 shadcn ui，但不使用任何框架，純粹使用 HTML 及 tailwind css
- 可以直接用在任何地方，不需要任何框架
- 極少量的 js，純粹用於元件動態效果

## 參考套件
- [shadcn ui](https://shadcn.github.io/shadcn-ui)
- [flowbite](https://flowbite.com)
- [flyonui](https://flyonui.com)
- [tailwind css](https://tailwindcss.com)

## Sytle Guide
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

## Tech Stack
- Tailwind CSS
- Astro
- Astro Expressive Code (Code Block Highlighting)

## 命名考慮清單
- Cubby 小盒子
- Caddy 小罐、小盒子或收納盒（如桌面整理盒）
- Framekit 框架積木
- Bitsy 小元件集合 (bitsy: 零星小東西，已有遊戲框架用此命名)
- Nibble 小口吃掉的元件
- Nook 角落小空間
- Cove 小灣、包覆空間
- Crate 木箱、收納箱 (Rust 用到了)