# Cubby UI — Laravel Blade 元件打包方案

## 背景

延伸 `laravel-blade-plan.md` 的元件設計，聚焦在如何將 Blade 匿名元件打包發布給 Laravel 開發者使用。

---

## 三種打包方向

### 方案 1：Composer Package（Laravel 生態標準）

發布為 `cubby/blade-ui` Composer 套件，透過 `ServiceProvider` 自動註冊：

```php
// CubbyUiServiceProvider.php
Blade::anonymousComponentPath(__DIR__.'/../resources/components', 'cu');
```

使用者安裝後直接寫 `<x-cu.button>`，不需手動複製檔案。

- **優點**：`composer update` 一鍵升級、版本鎖定、Laravel 開發者最熟悉的安裝方式
- **缺點**：元件藏在 `vendor/` 裡，客製化需 `vendor:publish` 後脫離版本管理
- **適合**：想直接用、不太需要改元件結構的使用者

### 方案 2：npm 套件 + Artisan Generator（shadcn 模式）

延伸現有 `cubby-ui` npm 套件，加入 Blade 檔案。搭配輕量 Artisan command 按需複製：

```bash
# 複製所有元件
php artisan cubby:install

# 只複製特定元件
php artisan cubby:add button card dialog
```

元件直接進 `resources/views/components/cu/`，使用者擁有原始碼可自由修改。

- **優點**：符合 Cubby UI「複製貼上」哲學、使用者完全掌控、可按需引入
- **缺點**：升級不方便（需 diff merge）、需開發 Artisan command
- **適合**：想客製化元件的使用者

### 方案 3：混合模式（推薦）

Composer 套件 + `vendor:publish` + stub 覆蓋機制：

```bash
# 安裝
composer require cubby/blade-ui

# 直接使用（元件從 vendor 載入）
<x-cu.button variant="outline">OK</x-cu.button>

# 想客製化某個元件？publish 出來覆蓋
php artisan vendor:publish --tag=cubby-components -- --component=button
# → resources/views/components/cu/button.blade.php（優先於 vendor）
```

Laravel 的 component 解析機制會優先使用專案內的同名元件，所以 publish 出來的檔案自動覆蓋 vendor 版本，未 publish 的繼續用套件內的。

- **優點**：預設零配置可用、需要時才 publish 客製化、`composer update` 升級未修改的元件
- **缺點**：需處理「已 publish 的元件」與「套件升級」的衝突提示

---

## 推薦方案：混合模式

### 套件結構

```
cubby/blade-ui/
├── composer.json
├── src/
│   └── CubbyUiServiceProvider.php    # 註冊元件 + publish 設定 + Blade directives
├── resources/
│   ├── components/
│   │   └── cu/                       # 所有 Blade 匿名元件
│   │       ├── button.blade.php
│   │       ├── badge.blade.php
│   │       ├── card/
│   │       │   ├── index.blade.php
│   │       │   ├── header.blade.php
│   │       │   ├── title.blade.php
│   │       │   ├── description.blade.php
│   │       │   ├── content.blade.php
│   │       │   └── footer.blade.php
│   │       ├── dialog/
│   │       │   ├── index.blade.php
│   │       │   ├── header.blade.php
│   │       │   ├── title.blade.php
│   │       │   ├── description.blade.php
│   │       │   ├── footer.blade.php
│   │       │   └── close.blade.php
│   │       └── ...（完整元件列表見 laravel-blade-plan.md）
│   ├── css/
│   │   ├── cubby-ui.css              # 預編譯 CSS（@apply 已展開）
│   │   ├── cubby-ui.min.css
│   │   └── src/                      # 原始 Tailwind CSS（進階用戶 Vite 編譯用）
│   │       ├── theme.css
│   │       ├── components.css
│   │       └── components/
│   └── js/
│       ├── cubby-ui.js               # 互動元件 JS（UMD）
│       └── cubby-ui.min.js
├── config/
│   └── cubby-ui.php                  # 套件設定檔
├── stubs/                            # publish 用的 stub 檔案
└── README.md
```

### ServiceProvider 核心邏輯

```php
namespace Cubby\BladeUi;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;

class CubbyUiServiceProvider extends ServiceProvider
{
    public function boot()
    {
        // 註冊匿名元件路徑（x-cu.* 前綴）
        Blade::anonymousComponentPath(
            __DIR__ . '/../resources/components/cu',
            'cu'
        );

        // Blade directive：自動注入 JS
        Blade::directive('cubbyScripts', function () {
            $js = asset('vendor/cubby-ui/cubby-ui.min.js');
            return "<?php echo '<script src=\"{$js}\"></script>'; ?>";
        });

        // Blade directive：自動注入 CSS
        Blade::directive('cubbyStyles', function () {
            $css = asset('vendor/cubby-ui/cubby-ui.min.css');
            return "<?php echo '<link rel=\"stylesheet\" href=\"{$css}\">'; ?>";
        });

        // Publishable assets
        $this->publishes([
            __DIR__ . '/../resources/css' => public_path('vendor/cubby-ui'),
            __DIR__ . '/../resources/js' => public_path('vendor/cubby-ui'),
        ], 'cubby-assets');

        // Publishable components（全部）
        $this->publishes([
            __DIR__ . '/../resources/components/cu' => resource_path('views/components/cu'),
        ], 'cubby-components');

        // Publishable config
        $this->publishes([
            __DIR__ . '/../config/cubby-ui.php' => config_path('cubby-ui.php'),
        ], 'cubby-config');
    }

    public function register()
    {
        $this->mergeConfigFrom(
            __DIR__ . '/../config/cubby-ui.php',
            'cubby-ui'
        );
    }
}
```

### 設定檔

```php
// config/cubby-ui.php
return [
    // 元件前綴（對應 CSS class 前綴）
    'prefix' => 'cu',

    // 預設 variant
    'defaults' => [
        'button' => ['variant' => 'default', 'size' => 'default'],
        'badge' => ['variant' => 'default'],
        'alert' => ['variant' => 'default'],
    ],

    // 是否自動初始化互動元件 JS（透過 @cubbyScripts）
    'auto_init' => true,
];
```

### composer.json

```json
{
    "name": "cubby/blade-ui",
    "description": "Cubby UI components for Laravel Blade",
    "type": "library",
    "license": "MIT",
    "require": {
        "php": "^8.1",
        "illuminate/support": "^10.0|^11.0|^12.0"
    },
    "autoload": {
        "psr-4": {
            "Cubby\\BladeUi\\": "src/"
        }
    },
    "extra": {
        "laravel": {
            "providers": [
                "Cubby\\BladeUi\\CubbyUiServiceProvider"
            ]
        }
    }
}
```

---

## 使用者安裝流程

```bash
# 1. 安裝套件
composer require cubby/blade-ui

# 2. 發布靜態資源（CSS + JS）
php artisan vendor:publish --tag=cubby-assets

# 3.（可選）發布設定檔
php artisan vendor:publish --tag=cubby-config

# 4.（可選）客製化特定元件
php artisan vendor:publish --tag=cubby-components
```

### Layout 引入

```blade
<!DOCTYPE html>
<html>
<head>
    @cubbyStyles
    {{-- 或透過 Vite --}}
    @vite(['resources/css/app.css'])
</head>
<body>
    {{ $slot }}

    @cubbyScripts
    {{-- 或透過 Vite --}}
    @vite(['resources/js/app.js'])
</body>
</html>
```

### Vite 整合（進階）

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
@import "../../vendor/cubby/blade-ui/resources/css/src/theme.css";
@import "../../vendor/cubby/blade-ui/resources/css/src/components.css";
```

```js
// resources/js/app.js
import '../../vendor/cubby/blade-ui/resources/js/cubby-ui.js';
```

---

## CSS 引入方式比較

| 方式 | 適合情境 | 優缺點 |
|------|---------|--------|
| `@cubbyStyles`（預編譯 CSS） | 快速上手、不用 Tailwind 的專案 | 簡單但無法 tree-shake |
| Vite + 原始 Tailwind source | 已用 Tailwind 的專案 | 可客製 theme、與專案 Tailwind 合併編譯 |
| CDN / 靜態檔 | 原型開發、無建構工具 | 最快但無法客製化 |

---

## 關鍵決策點

| 問題 | 建議 |
|------|------|
| 元件前綴 | `x-cu.*`（短、與 CSS 前綴一致） |
| CSS 引入 | 提供預編譯和原始 source 兩種，透過 Blade directive 或 Vite |
| JS 引入 | `@cubbyScripts` directive 或手動 `<script>` 或 Vite import |
| Livewire 相容 | `$attributes->merge()` 自動透傳 `wire:model`，零額外處理 |
| 版本策略 | 遵循 semver，Blade 元件結構變更為 major bump |
| 單元件 publish | 可考慮加入 `--component=button` 選項，僅 publish 指定元件 |

---

## 待決議事項

1. **是否需要 Artisan command？** 除了 `vendor:publish`，是否需要 `cubby:add button` 這類按需安裝命令？
2. **Livewire 深度整合**：是否提供 Livewire-specific 的元件變體（如自動 `wire:model` 綁定）？
3. **IDE 支援**：是否提供 VS Code / PhpStorm 的自動完成定義檔（元件 props 提示）？
4. **測試策略**：是否附帶 Blade 元件的渲染測試？
5. **與 Lit Web Components 的關係**：兩套方案並行，共享相同的 CSS token 和設計語言，但各自獨立打包
