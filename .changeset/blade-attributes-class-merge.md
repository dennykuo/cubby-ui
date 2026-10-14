---
"cubby-ui": patch
---

修正 Laravel Blade 元件遺失使用者 `class` 與重複輸出屬性的問題。

- 根元素的 `class:list` 與 `{...rest}` 之間夾有其他屬性時（如 Dropdown、Popover、Progress、Command Palette、Menubar、Drawer、Tabs List、Tour、Transfer List、Carousel、Resizable 等 58 個元件），原本輸出 `@class([...]) … {{ $attributes }}`，`<x-cu.dropdown class="mine">` 會產生兩個 `class` 屬性，瀏覽器只採用第一個，使用者的 class 因此遺失；改為輸出單一 `{{ $attributes->class([...]) }}`
- Select、Toggle、Number Input、Password Input、Search Input、Floating Label 的使用者 class 改為合併到外層 wrapper（與 Astro 版一致），內層表單元素改用 `{{ $attributes->except('class') }}`，不再與內層自身的 `class` 重複
- Resizable Panel 移除重複的 `{{ $attributes->except('class') }}`，`id` 等屬性不再輸出兩次；Header Mobile Nav 的 backdrop 只合併 class，其餘屬性只輸出在 nav 面板上
- `npm run test:blade` 新增檢查：同一開頭標籤出現 `@class(` / 靜態 `class="…"` 搭配裸 `{{ $attributes }}`，或 `$attributes->class(` 搭配 `$attributes->except('class')` 即失敗
