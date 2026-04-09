# Cubby UI — Laravel Integration

> 在 Laravel 專案中使用 Cubby UI 元件庫的設定指南。

## 推薦方式 (AppServiceProvider + Vite)

只需 2 步，所有資源直接從 `node_modules` 載入，`npm update` 即自動更新。

### 1. 安裝套件

```bash
npm install cubby-ui
```

### 2. 註冊 Blade 元件

在現有的 `AppServiceProvider` 加一行：

```php
<?php
// app/Providers/AppServiceProvider.php

namespace App\Providers;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // 從 node_modules 載入 Cubby UI Blade 元件，使用 <x-cu.*> 前綴
        Blade::anonymousComponentPath(
            base_path('node_modules/cubby-ui/dist/laravel/components'),
            'cu'
        );
    }
}
```

### 3. 引入 CSS / JS (透過 Vite)

在 `resources/js/app.js` 加入：

```js
import 'cubby-ui/css';  // 引入 Cubby UI 樣式
import 'cubby-ui';       // 引入互動元件 JS (自動初始化)
```

### 4. 使用元件

```blade
<x-cu.button variant="outline" size="sm">Click me</x-cu.button>

<x-cu.card>
  <x-cu.card.header>
    <x-cu.card.title>My Card</x-cu.card.title>
  </x-cu.card.header>
  <x-cu.card.content>Content here</x-cu.card.content>
</x-cu.card>
```

## 更新

所有資源（Blade 元件、CSS、JS）皆從 `node_modules` 載入，一個指令即可更新全部：

```bash
npm update cubby-ui
```

---

## 替代方案：獨立 ServiceProvider

如果偏好將 Cubby UI 註冊放在獨立的 ServiceProvider，而非修改 `AppServiceProvider`：

1. 複製 ServiceProvider：

```bash
cp node_modules/cubby-ui/dist/laravel/CubbyUiServiceProvider.php app/Providers/
```

2. 註冊到 `bootstrap/providers.php`：

```php
return [
    App\Providers\AppServiceProvider::class,
    App\Providers\CubbyUiServiceProvider::class,
];
```

### Monorepo / 自訂路徑

如果 `node_modules` 不在專案根目錄（例如 pnpm workspace、Yarn workspaces），建立 `config/cubby-ui.php` 覆寫路徑：

```php
<?php
// config/cubby-ui.php
return [
    'components_path' => base_path('../../node_modules/cubby-ui/dist/laravel/components'),
];
```

---

## 替代方案：CDN

最簡單的方式，適合快速原型開發。注意：此方式需要手動複製 Blade 元件檔案。

### 1. 引入 CSS / JS

在 layout 中加入 CDN 連結：

```html
<link rel="stylesheet" href="https://unpkg.com/cubby-ui/dist/core/cubby-ui.min.css">
<script src="https://unpkg.com/cubby-ui/dist/core/cubby-ui.min.js"></script>
```

### 2. 複製 Blade 元件

```bash
cp -r node_modules/cubby-ui/dist/laravel/components/cu resources/views/components/cu
```

---

## 主題客製

Cubby UI 使用 CSS 變數定義主題色彩，覆寫即可自訂：

```css
/* resources/css/app.css */
:root {
    --color-primary: oklch(0.55 0.2 250);
    --color-primary-foreground: oklch(0.98 0 0);
    --color-secondary: oklch(0.97 0.001 286);
    --color-secondary-foreground: oklch(0.21 0.006 286);
    --radius-lg: 0.5rem;
}
```

### 暗色模式

在 `<html>` 加上 `dark` class 即可啟用暗色模式：

```html
<html class="dark">
```

---

## 動態內容

如果透過 Livewire、AJAX 或其他方式動態載入含有互動元件的 HTML，需要重新初始化：

```js
// 動態內容載入後
CubbyUI.refresh();
```

## JavaScript API

```js
CubbyUI.init()      // 初始化所有互動元件 (頁面載入時自動執行，可重複呼叫)
CubbyUI.destroy()   // 清除內部追蹤 (SPA 路由切換前使用)
CubbyUI.refresh()   // 清理已移除元素 + 重新初始化

// Toast 通知 API
CubbyUI.toast.show({ title: 'Saved!', variant: 'success' })
CubbyUI.toast.promise(fetch('/api/data'), {
    loading: 'Loading...',
    success: 'Done!',
    error: 'Failed'
})
```

## 更多資訊

- [元件 Blade 語法參考](./components/cu/README.md)
- [元件結構化 metadata](./components/cu/components.json)
- [完整文件](https://github.com/dennykuo/cubby-ui)
