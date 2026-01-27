# Cubby UI — Laravel Blade 匿名元件整合方案

## 背景

Cubby UI 的 CSS 類別層（`cu-*` class）是框架無關的，可直接在任何 HTML 環境中使用。Laravel Blade 的匿名元件（Anonymous Components）提供了一層輕量級封裝，讓開發者在 Blade 模板中以宣告式標籤使用元件，同時保留 Tailwind utility class 的擴展能力。

此方案將 Cubby UI 的 Astro 元件層平移為 Blade 匿名元件，模式一致、學習成本低。

---

## 核心對應關係

| Astro 概念 | Laravel Blade 對應 |
|---|---|
| `interface Props` | `@props([...])` |
| `Astro.props` 解構 | `@props` 自動展開為變數 |
| `class:list={[base, className]}` | `$attributes->merge(['class' => $base])` |
| `{...rest}` 屬性透傳 | `{{ $attributes }}` |
| `<slot />` | `{{ $slot }}` |
| 具名 slot `<slot name="x" />` | `{{ $x }}` 具名 slot |
| `TOP_CLASS` (`cu`) | 直接寫死或定義 config |

---

## 檔案結構

```
resources/
├── views/
│   └── components/
│       └── cu/
│           ├── button.blade.php
│           ├── badge.blade.php
│           ├── card/
│           │   ├── index.blade.php        -- <x-cu.card>
│           │   ├── header.blade.php       -- <x-cu.card.header>
│           │   ├── title.blade.php        -- <x-cu.card.title>
│           │   ├── description.blade.php  -- <x-cu.card.description>
│           │   ├── content.blade.php      -- <x-cu.card.content>
│           │   └── footer.blade.php       -- <x-cu.card.footer>
│           ├── alert/
│           │   ├── index.blade.php        -- <x-cu.alert>
│           │   ├── title.blade.php        -- <x-cu.alert.title>
│           │   └── description.blade.php  -- <x-cu.alert.description>
│           ├── dialog/
│           │   ├── index.blade.php        -- <x-cu.dialog>
│           │   ├── header.blade.php       -- <x-cu.dialog.header>
│           │   ├── title.blade.php        -- <x-cu.dialog.title>
│           │   ├── description.blade.php  -- <x-cu.dialog.description>
│           │   ├── footer.blade.php       -- <x-cu.dialog.footer>
│           │   └── close.blade.php        -- <x-cu.dialog.close>
│           ├── alert-dialog/
│           │   ├── index.blade.php
│           │   ├── header.blade.php
│           │   ├── title.blade.php
│           │   ├── description.blade.php
│           │   └── footer.blade.php
│           ├── drawer/
│           │   ├── index.blade.php
│           │   ├── header.blade.php
│           │   ├── title.blade.php
│           │   ├── description.blade.php
│           │   ├── content.blade.php
│           │   ├── footer.blade.php
│           │   └── close.blade.php
│           ├── dropdown/
│           │   ├── index.blade.php        -- <x-cu.dropdown>
│           │   ├── content.blade.php
│           │   ├── item.blade.php
│           │   ├── label.blade.php
│           │   └── separator.blade.php
│           ├── accordion/
│           │   ├── index.blade.php
│           │   ├── item.blade.php
│           │   ├── trigger.blade.php
│           │   └── content.blade.php
│           ├── avatar/
│           │   ├── index.blade.php
│           │   ├── image.blade.php
│           │   └── fallback.blade.php
│           ├── breadcrumb/
│           │   ├── index.blade.php
│           │   ├── item.blade.php
│           │   ├── link.blade.php
│           │   ├── separator.blade.php
│           │   └── current.blade.php
│           ├── hover-card/
│           │   ├── index.blade.php
│           │   └── content.blade.php
│           ├── popover/
│           │   ├── index.blade.php
│           │   └── content.blade.php
│           ├── menubar/
│           │   ├── index.blade.php
│           │   ├── menu.blade.php
│           │   ├── trigger.blade.php
│           │   ├── content.blade.php
│           │   ├── item.blade.php
│           │   ├── separator.blade.php
│           │   ├── label.blade.php
│           │   └── shortcut.blade.php
│           ├── pagination/
│           │   ├── index.blade.php
│           │   ├── item.blade.php
│           │   ├── prev.blade.php
│           │   ├── next.blade.php
│           │   └── ellipsis.blade.php
│           ├── tabs/
│           │   ├── index.blade.php
│           │   ├── list.blade.php
│           │   ├── trigger.blade.php
│           │   └── content.blade.php
│           ├── header/
│           │   ├── index.blade.php
│           │   ├── inner.blade.php
│           │   ├── brand.blade.php
│           │   ├── nav.blade.php
│           │   └── actions.blade.php
│           ├── sidebar/
│           │   ├── index.blade.php
│           │   ├── header.blade.php
│           │   ├── content.blade.php
│           │   ├── footer.blade.php
│           │   ├── section.blade.php
│           │   ├── section-title.blade.php
│           │   ├── group.blade.php
│           │   ├── group-title.blade.php
│           │   ├── item.blade.php
│           │   └── separator.blade.php
│           ├── empty-state/
│           │   ├── index.blade.php
│           │   ├── icon.blade.php
│           │   ├── title.blade.php
│           │   ├── description.blade.php
│           │   └── action.blade.php
│           ├── stat/
│           │   ├── index.blade.php
│           │   ├── header.blade.php
│           │   ├── label.blade.php
│           │   ├── value.blade.php
│           │   ├── description.blade.php
│           │   └── trend.blade.php
│           ├── button-group.blade.php
│           ├── container.blade.php
│           ├── separator.blade.php
│           ├── label.blade.php
│           ├── input.blade.php
│           ├── textarea.blade.php
│           ├── select.blade.php
│           ├── checkbox.blade.php
│           ├── radio.blade.php
│           ├── toggle.blade.php
│           ├── range.blade.php
│           ├── search-input.blade.php
│           ├── file-input.blade.php
│           ├── form-group.blade.php
│           ├── form-description.blade.php
│           ├── form-error.blade.php
│           ├── progress.blade.php
│           ├── skeleton.blade.php
│           ├── tooltip.blade.php
│           ├── collapsible/
│           │   ├── index.blade.php
│           │   ├── trigger.blade.php
│           │   └── content.blade.php
│           ├── nav/
│           │   ├── index.blade.php
│           │   └── item.blade.php
│           ├── heading.blade.php
│           ├── paragraph.blade.php
│           ├── blockquote.blade.php
│           ├── link.blade.php
│           ├── list.blade.php
│           └── hr.blade.php
```

---

## 元件模式對照與實作範例

### 模式一：Simple（純包裝）

**Astro 原始碼（Label.astro）：**

```astro
---
import { TOP_CLASS } from "../../config";

interface Props {
    class?: string;
    [key: string]: any;
}

const { class: className, ...rest } = Astro.props;
const baseClass = `${TOP_CLASS}-label`;
---

<label class:list={[baseClass, className]} {...rest}>
    <slot />
</label>
```

**Blade 對應（`cu/label.blade.php`）：**

```blade
<label {{ $attributes->merge(['class' => 'cu-label']) }}>
    {{ $slot }}
</label>
```

**使用方式：**

```blade
<x-cu.label for="email">Email</x-cu.label>
<x-cu.label for="name" class="text-lg">Name</x-cu.label>
```

> Blade 匿名元件不需要 `@props` 就能自動透傳所有 attributes。`$attributes->merge()` 會將預設 class 與外部傳入的 class 合併。

---

### 模式二：Variant / Size Props（複合 class）

**Astro 原始碼（Button.astro）：**

```astro
---
interface Props {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "success" | "warning" | "info";
    size?: "default" | "sm" | "lg" | "icon" | "xs" | "xl";
    class?: string;
    [key: string]: any;
}

const { variant = "default", size = "default", class: className, ...rest } = Astro.props;
const baseClass = `${TOP_CLASS}-button`;
const variantClass = `${TOP_CLASS}-button-${variant}`;
const sizeClass = size === "default" ? `${TOP_CLASS}-button-md` : `${TOP_CLASS}-button-${size}`;
---

<button class:list={[baseClass, variantClass, sizeClass, className]} {...rest}>
    <slot />
</button>
```

**Blade 對應（`cu/button.blade.php`）：**

```blade
@props([
    'variant' => 'default',
    'size' => 'default',
])

@php
    $sizeClass = $size === 'default' ? 'cu-button-md' : "cu-button-{$size}";
    $classes = "cu-button cu-button-{$variant} {$sizeClass}";
@endphp

<button {{ $attributes->merge(['class' => $classes]) }}>
    {{ $slot }}
</button>
```

**使用方式：**

```blade
<x-cu.button>Submit</x-cu.button>
<x-cu.button variant="outline" size="sm">Cancel</x-cu.button>
<x-cu.button variant="destructive" size="lg" onclick="confirm('Sure?')">Delete</x-cu.button>

{{-- 額外 Tailwind utility --}}
<x-cu.button variant="ghost" class="w-full">Full Width</x-cu.button>
```

> `@props` 宣告的屬性會從 `$attributes` 中抽離，不會出現在最終 HTML 的 attributes 中。未宣告的屬性（如 `onclick`、`disabled`、`type`）會自動透傳。

---

### 模式三：State Props（布林狀態）

**Blade 對應（`cu/nav/item.blade.php`）：**

```blade
@props([
    'active' => false,
])

@php
    $classes = 'cu-nav-item' . ($active ? ' cu-nav-item-active' : '');
@endphp

<a {{ $attributes->merge(['class' => $classes]) }}>
    {{ $slot }}
</a>
```

**使用方式：**

```blade
<x-cu.nav>
    <x-cu.nav.item href="/dashboard" :active="request()->is('dashboard')">
        Dashboard
    </x-cu.nav.item>
    <x-cu.nav.item href="/settings" :active="request()->is('settings')">
        Settings
    </x-cu.nav.item>
</x-cu.nav>
```

> `:active="..."` 使用冒號前綴傳遞 PHP 表達式（非字串）。這是 Laravel 與伺服器端狀態整合的天然優勢。

---

### 模式四：Composite（複合結構）

**Blade 對應（`cu/search-input.blade.php`）：**

```blade
@props([
    'wrapperClass' => '',
])

<div class="cu-input-search {{ $wrapperClass }}">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
         stroke-linejoin="round" class="cu-input-search-icon">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.3-4.3"></path>
    </svg>
    <input {{ $attributes->merge(['class' => 'cu-input-search-field', 'type' => 'search']) }} />
</div>
```

**使用方式：**

```blade
<x-cu.search-input placeholder="搜尋..." name="q" />
<x-cu.search-input placeholder="Filter..." name="filter" class="text-lg" />
```

---

### 模式五：結構化子元件

**Blade 對應（`cu/card/index.blade.php`）：**

```blade
<div {{ $attributes->merge(['class' => 'cu-card']) }}>
    {{ $slot }}
</div>
```

**Blade 對應（`cu/card/header.blade.php`）：**

```blade
<div {{ $attributes->merge(['class' => 'cu-card-header']) }}>
    {{ $slot }}
</div>
```

**Blade 對應（`cu/card/title.blade.php`）：**

```blade
<h3 {{ $attributes->merge(['class' => 'cu-card-title']) }}>
    {{ $slot }}
</h3>
```

**Blade 對應（`cu/card/description.blade.php`）：**

```blade
<p {{ $attributes->merge(['class' => 'cu-card-description']) }}>
    {{ $slot }}
</p>
```

**Blade 對應（`cu/card/content.blade.php`）：**

```blade
<div {{ $attributes->merge(['class' => 'cu-card-content']) }}>
    {{ $slot }}
</div>
```

**Blade 對應（`cu/card/footer.blade.php`）：**

```blade
<div {{ $attributes->merge(['class' => 'cu-card-footer']) }}>
    {{ $slot }}
</div>
```

**使用方式：**

```blade
<x-cu.card>
    <x-cu.card.header>
        <x-cu.card.title>專案設定</x-cu.card.title>
        <x-cu.card.description>管理您的專案配置</x-cu.card.description>
    </x-cu.card.header>
    <x-cu.card.content>
        <x-cu.form-group>
            <x-cu.label for="name">專案名稱</x-cu.label>
            <x-cu.input id="name" placeholder="My Project" />
        </x-cu.form-group>
    </x-cu.card.content>
    <x-cu.card.footer class="justify-end">
        <x-cu.button variant="outline">取消</x-cu.button>
        <x-cu.button>儲存</x-cu.button>
    </x-cu.card.footer>
</x-cu.card>
```

---

### 模式六：表單自訂控件（Hidden Input + Visual）

**Blade 對應（`cu/toggle.blade.php`）：**

```blade
@props([
    'size' => 'default',
    'label' => null,
])

@php
    $toggleClass = $size === 'default' ? 'cu-toggle' : "cu-toggle cu-toggle-{$size}";
@endphp

<label {{ $attributes->only('class')->merge(['class' => 'cu-toggle-wrapper']) }}>
    <input type="checkbox" class="cu-toggle-input"
           {{ $attributes->except('class') }} />
    <span class="{{ $toggleClass }}">
        <span class="cu-toggle-thumb"></span>
    </span>
    @if($label)
        <span>{{ $label }}</span>
    @else
        {{ $slot }}
    @endif
</label>
```

**使用方式：**

```blade
<x-cu.toggle name="notifications" label="啟用通知" />
<x-cu.toggle name="dark_mode" size="sm" :checked="$user->dark_mode" />
<x-cu.toggle name="feature" size="lg">
    啟用進階功能
</x-cu.toggle>
```

**Blade 對應（`cu/checkbox.blade.php`）：**

```blade
@props([
    'label' => null,
])

<label class="cu-checkbox-wrapper">
    <input {{ $attributes->merge(['class' => 'cu-checkbox', 'type' => 'checkbox']) }} />
    @if($label)
        <span>{{ $label }}</span>
    @else
        {{ $slot }}
    @endif
</label>
```

**使用方式：**

```blade
<x-cu.checkbox name="agree" label="我同意服務條款" />
<x-cu.checkbox name="remember" :checked="old('remember')">記住我</x-cu.checkbox>
```

---

### 模式七：Select（含裝飾箭頭）

**Blade 對應（`cu/select.blade.php`）：**

```blade
<div class="cu-select-wrapper">
    <select {{ $attributes->merge(['class' => 'cu-select']) }}>
        {{ $slot }}
    </select>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
         stroke-linejoin="round" class="cu-select-icon">
        <path d="m6 9 6 6 6-6"></path>
    </svg>
</div>
```

**使用方式：**

```blade
<x-cu.select name="country">
    <option value="">請選擇國家</option>
    <option value="tw">台灣</option>
    <option value="jp">日本</option>
</x-cu.select>
```

---

### 模式八：互動元件（Dialog、Dropdown、Tabs 等）

互動元件的 HTML 結構和 `data-*` 屬性由 Blade 元件產生，JS 行為腳本需另外載入。

**Blade 對應（`cu/dialog/index.blade.php`）：**

```blade
@props([
    'id' => null,
])

<dialog {{ $attributes->merge(['class' => 'cu-dialog', 'id' => $id]) }}>
    <button type="button" class="cu-dialog-close" data-dialog-close aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
             stroke-linejoin="round">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
        </svg>
    </button>
    {{ $slot }}
</dialog>
```

**使用方式：**

```blade
<x-cu.button data-dialog-trigger="confirm-dialog">開啟對話框</x-cu.button>

<x-cu.dialog id="confirm-dialog">
    <x-cu.dialog.header>
        <x-cu.dialog.title>確認操作</x-cu.dialog.title>
        <x-cu.dialog.description>此操作無法復原，確定要繼續嗎？</x-cu.dialog.description>
    </x-cu.dialog.header>
    <x-cu.dialog.footer>
        <x-cu.button variant="outline" data-dialog-close>取消</x-cu.button>
        <x-cu.button variant="destructive">確認刪除</x-cu.button>
    </x-cu.dialog.footer>
</x-cu.dialog>
```

**Blade 對應（`cu/tabs/index.blade.php`）：**

```blade
@props([
    'default' => null,
])

<div {{ $attributes->merge(['class' => 'cu-tabs', 'data-tabs' => '', 'data-tabs-default' => $default]) }}>
    {{ $slot }}
</div>
```

**Blade 對應（`cu/tabs/trigger.blade.php`）：**

```blade
@props([
    'value' => null,
    'active' => false,
])

@php
    $classes = 'cu-tabs-trigger' . ($active ? ' cu-tabs-trigger-active' : '');
@endphp

<button {{ $attributes->merge(['class' => $classes, 'data-tabs-trigger' => $value, 'type' => 'button']) }}>
    {{ $slot }}
</button>
```

**使用方式：**

```blade
<x-cu.tabs default="account">
    <x-cu.tabs.list>
        <x-cu.tabs.trigger value="account" :active="true">帳號</x-cu.tabs.trigger>
        <x-cu.tabs.trigger value="password">密碼</x-cu.tabs.trigger>
    </x-cu.tabs.list>
    <x-cu.tabs.content value="account">
        帳號設定內容...
    </x-cu.tabs.content>
    <x-cu.tabs.content value="password" hidden>
        密碼設定內容...
    </x-cu.tabs.content>
</x-cu.tabs>
```

---

### 模式九：Accordion（`<details>` 原生元素）

**Blade 對應（`cu/accordion/index.blade.php`）：**

```blade
<div {{ $attributes->merge(['class' => 'cu-accordion']) }}>
    {{ $slot }}
</div>
```

**Blade 對應（`cu/accordion/item.blade.php`）：**

```blade
@props([
    'open' => false,
])

<details {{ $attributes->merge(['class' => 'cu-accordion-item']) }} @if($open) open @endif>
    {{ $slot }}
</details>
```

**Blade 對應（`cu/accordion/trigger.blade.php`）：**

```blade
<summary {{ $attributes->merge(['class' => 'cu-accordion-trigger']) }}>
    {{ $slot }}
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
         stroke-linejoin="round">
        <path d="m6 9 6 6 6-6"></path>
    </svg>
</summary>
```

**使用方式：**

```blade
<x-cu.accordion>
    <x-cu.accordion.item :open="true">
        <x-cu.accordion.trigger>什麼是 Cubby UI？</x-cu.accordion.trigger>
        <x-cu.accordion.content>
            Cubby UI 是一個框架無關的 UI 元件庫...
        </x-cu.accordion.content>
    </x-cu.accordion.item>
    <x-cu.accordion.item>
        <x-cu.accordion.trigger>支援哪些框架？</x-cu.accordion.trigger>
        <x-cu.accordion.content>
            支援任何使用 HTML + CSS 的環境...
        </x-cu.accordion.content>
    </x-cu.accordion.item>
</x-cu.accordion>
```

---

### 模式十：Typography 元件

**Blade 對應（`cu/heading.blade.php`）：**

```blade
@props([
    'level' => 1,
])

@php
    $tag = "h{$level}";
    $class = "cu-h{$level}";
@endphp

<{{ $tag }} {{ $attributes->merge(['class' => $class]) }}>
    {{ $slot }}
</{{ $tag }}>
```

**Blade 對應（`cu/paragraph.blade.php`）：**

```blade
@props([
    'variant' => 'default',
])

@php
    $classes = $variant === 'lead' ? 'cu-paragraph cu-paragraph-lead' : 'cu-paragraph';
@endphp

<p {{ $attributes->merge(['class' => $classes]) }}>
    {{ $slot }}
</p>
```

**使用方式：**

```blade
<x-cu.heading :level="1">頁面標題</x-cu.heading>
<x-cu.heading :level="3" class="text-primary">副標題</x-cu.heading>
<x-cu.paragraph variant="lead">這是一段引導文字。</x-cu.paragraph>
<x-cu.paragraph>這是一般段落。</x-cu.paragraph>
```

---

## Laravel 整合要點

### 1. CSS 引入

Cubby UI 的 CSS 需在 Laravel 的前端建構流程中引入。

**方式 A：Vite（推薦）**

```js
// vite.config.js
import tailwindcss from '@tailwindcss/vite';

export default {
    plugins: [
        laravel({ input: ['resources/css/app.css', 'resources/js/app.js'] }),
        tailwindcss(),
    ],
};
```

```css
/* resources/css/app.css */
@import "tailwindcss";
@import "./cubby/components.css";

@theme {
    /* 貼入 Cubby UI 的 design tokens */
    --color-primary: hsl(221 83% 53%);
    --color-primary-foreground: hsl(0 0% 100%);
    /* ... 其餘 token ... */
}

.dark {
    --color-background: hsl(224 71% 4%);
    /* ... 暗色 token ... */
}
```

**方式 B：CDN / 靜態檔案**

```html
<link rel="stylesheet" href="{{ asset('css/cubby-ui.css') }}">
```

### 2. JS 載入

互動元件（Dialog、Dropdown、Tabs、Drawer、Popover、AlertDialog、Toast）需要 JS。

```html
{{-- 放在 </body> 前 --}}
<script src="{{ asset('js/cubby-ui.js') }}"></script>
```

或透過 Vite：

```js
// resources/js/app.js
import './cubby/interactions.js';
```

### 3. 元件前綴命名空間

Blade 匿名元件放在 `resources/views/components/cu/` 下，使用 `x-cu.` 前綴，避免與 Laravel 內建或其他套件衝突：

```blade
<x-cu.button>        {{-- resources/views/components/cu/button.blade.php --}}
<x-cu.card>          {{-- resources/views/components/cu/card/index.blade.php --}}
<x-cu.card.header>   {{-- resources/views/components/cu/card/header.blade.php --}}
```

### 4. 與 Laravel 功能整合

**表單驗證錯誤：**

```blade
<x-cu.form-group>
    <x-cu.label for="email">Email</x-cu.label>
    <x-cu.input
        id="email"
        name="email"
        type="email"
        :value="old('email')"
        class="{{ $errors->has('email') ? 'border-destructive' : '' }}"
    />
    @error('email')
        <x-cu.form-error>{{ $message }}</x-cu.form-error>
    @enderror
</x-cu.form-group>
```

**Livewire 整合：**

```blade
<x-cu.input wire:model="name" placeholder="名稱" />
<x-cu.select wire:model="status">
    <option value="active">啟用</option>
    <option value="inactive">停用</option>
</x-cu.select>
<x-cu.toggle wire:model="notifications" label="啟用通知" />
```

> `$attributes->merge()` 會自動透傳 `wire:model` 等 Livewire 指令。

**條件渲染與迴圈：**

```blade
<x-cu.sidebar>
    <x-cu.sidebar.content>
        @foreach($menuSections as $section)
            <x-cu.sidebar.section>
                <x-cu.sidebar.section-title>{{ $section->name }}</x-cu.sidebar.section-title>
                @foreach($section->items as $item)
                    <x-cu.sidebar.item
                        href="{{ $item->url }}"
                        :active="request()->is($item->pattern)"
                    >
                        {{ $item->label }}
                    </x-cu.sidebar.item>
                @endforeach
            </x-cu.sidebar.section>
        @endforeach
    </x-cu.sidebar.content>
</x-cu.sidebar>
```

---

## 完整元件清單

### Typography（7 個元件）

| Blade 標籤 | 檔案 | Props |
|---|---|---|
| `<x-cu.heading>` | `cu/heading.blade.php` | `level` (1–4) |
| `<x-cu.paragraph>` | `cu/paragraph.blade.php` | `variant` (default, lead) |
| `<x-cu.blockquote>` | `cu/blockquote.blade.php` | — |
| `<x-cu.list>` | `cu/list.blade.php` | `type` (disc, decimal) |
| `<x-cu.link>` | `cu/link.blade.php` | — |
| `<x-cu.hr>` | `cu/hr.blade.php` | — |

### Basic（5 個元件，含子元件 8 個）

| Blade 標籤 | Props |
|---|---|
| `<x-cu.button>` | `variant`, `size` |
| `<x-cu.button-group>` | `vertical` |
| `<x-cu.card>` | — |
| `<x-cu.card.header>` `<x-cu.card.title>` `<x-cu.card.description>` `<x-cu.card.content>` `<x-cu.card.footer>` | — |
| `<x-cu.separator>` | `orientation` (horizontal, vertical) |
| `<x-cu.badge>` | `variant` |

### Forms（13 個元件）

| Blade 標籤 | Props |
|---|---|
| `<x-cu.label>` | — |
| `<x-cu.input>` | — |
| `<x-cu.textarea>` | — |
| `<x-cu.select>` | — |
| `<x-cu.checkbox>` | `label` |
| `<x-cu.radio>` | `label` |
| `<x-cu.toggle>` | `size`, `label` |
| `<x-cu.search-input>` | `wrapperClass` |
| `<x-cu.file-input>` | — |
| `<x-cu.range>` | — |
| `<x-cu.form-group>` | — |
| `<x-cu.form-description>` | — |
| `<x-cu.form-error>` | — |

### Data Display（7 群組）

| Blade 標籤 | Props |
|---|---|
| `<x-cu.accordion>` + `.item` `.trigger` `.content` | `open` (item) |
| `<x-cu.avatar>` + `.image` `.fallback` | — |
| `<x-cu.badge>` | `variant` |
| `<x-cu.collapsible>` + `.trigger` `.content` | — |
| `<x-cu.stat>` + `.header` `.label` `.value` `.description` `.trend` | `trend` (up, down) |

### Feedback（5 群組）

| Blade 標籤 | Props |
|---|---|
| `<x-cu.alert>` + `.title` `.description` | `variant` |
| `<x-cu.progress>` | `value` |
| `<x-cu.skeleton>` | — |
| `<x-cu.empty-state>` + `.icon` `.title` `.description` `.action` | — |

### Overlay（7 群組，需 JS）

| Blade 標籤 | Props |
|---|---|
| `<x-cu.dialog>` + `.header` `.title` `.description` `.footer` `.close` | `id` |
| `<x-cu.alert-dialog>` + `.header` `.title` `.description` `.footer` | `id` |
| `<x-cu.drawer>` + `.header` `.title` `.description` `.content` `.footer` `.close` | `id` |
| `<x-cu.dropdown>` + `.content` `.item` `.label` `.separator` | — |
| `<x-cu.hover-card>` + `.content` | — |
| `<x-cu.popover>` + `.content` | — |
| `<x-cu.tooltip>` | — |

### Navigation（4 群組）

| Blade 標籤 | Props |
|---|---|
| `<x-cu.breadcrumb>` + `.item` `.link` `.separator` `.current` | — |
| `<x-cu.menubar>` + `.menu` `.trigger` `.content` `.item` `.separator` `.label` `.shortcut` | — |
| `<x-cu.pagination>` + `.item` `.prev` `.next` `.ellipsis` | `active` (item) |
| `<x-cu.tabs>` + `.list` `.trigger` `.content` | `default`, `value`, `active` |

### Layout（4 群組）

| Blade 標籤 | Props |
|---|---|
| `<x-cu.container>` | `size` (sm, md, lg, xl, 2xl, prose) |
| `<x-cu.header>` + `.inner` `.brand` `.nav` `.actions` | — |
| `<x-cu.nav>` + `.item` | `vertical` (nav), `active` (item) |
| `<x-cu.sidebar>` + `.header` `.content` `.footer` `.section` `.section-title` `.group` `.group-title` `.item` `.separator` | `active` (item) |

---

## 與 Astro 元件層的差異

| 面向 | Astro 元件 | Blade 匿名元件 |
|---|---|---|
| 型別安全 | `interface Props` + TypeScript | 無靜態型別（PHP 動態） |
| 屬性透傳 | `{...rest}` | `{{ $attributes }}` |
| Class 合併 | `class:list={[...]}` | `$attributes->merge(['class' => ...])` |
| Slot | `<slot />` | `{{ $slot }}` |
| 具名 Slot | `<slot name="x" />` | `{{ $x }}` |
| 動態標籤 | 直接寫 | `<{{ $tag }}>` 語法 |
| 伺服器端狀態 | 無（靜態站點） | `request()`, `auth()`, `old()`, `$errors` |
| 即時更新 | 無 | Livewire `wire:model` |
| 前綴 | `<Button>` (import) | `<x-cu.button>` (自動發現) |

---

## 發布方式建議

### 方案 A：npm 套件（推薦）

```bash
npm install cubby-ui
```

```
node_modules/cubby-ui/
├── css/
│   ├── components.css
│   └── components/
│       ├── button.css
│       └── ...
├── blade/
│   └── cu/
│       ├── button.blade.php
│       └── ...
├── js/
│   └── cubby-ui.js
└── stubs/
    └── cubby-ui.php        -- Artisan publish config
```

搭配 Laravel 的 `php artisan vendor:publish` 將 Blade 元件複製到專案中：

```bash
php artisan vendor:publish --tag=cubby-ui-components
```

### 方案 B：Composer 套件

```bash
composer require cubby/ui
```

透過 `ServiceProvider` 自動註冊元件命名空間：

```php
// CubbyUiServiceProvider.php
public function boot()
{
    $this->loadViewComponentsFrom(
        __DIR__ . '/../resources/views/components',
        'cu'
    );
}
```

### 方案 C：直接複製

將 `blade/cu/` 資料夾直接複製到 `resources/views/components/cu/`，符合 Cubby UI「可直接複製貼上使用」的核心理念。

---

## 優缺點總結

| 優點 | 缺點 |
|---|---|
| 完全複用現有 `cu-*` CSS，零重複維護 | 無靜態型別檢查（可搭配 IDE 外掛緩解） |
| Laravel 原生整合（`$errors`、`old()`、`wire:model`） | Blade 元件不支援 TypeScript |
| `$attributes->merge()` 自動合併 class 與透傳屬性 | 子元件數量多（但每個都非常簡短） |
| 與 Livewire 無縫相容 | 需額外載入 JS（互動元件） |
| 零 JS 框架依賴 | |
| 匿名元件無需 PHP class，維護極簡 | |
| 符合「複製貼上即用」理念 | |
