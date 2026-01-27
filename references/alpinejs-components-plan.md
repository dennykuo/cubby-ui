# Cubby UI — Alpine.js 元件層整合方案

## 背景

Cubby UI 的核心是框架無關的 CSS 類別層（`cu-*` class）。Alpine.js 是最貼近 Cubby UI「純 HTML + CSS」哲學的互動層 — 直接在 HTML 屬性中宣告行為，無需建構工具、無需元件檔案、無需打包步驟。

Alpine.js 元件層的定位：

- **取代 inline `<script>` 片段**（現有文檔頁中的 `setupDialogs()`、`setupTabs()` 等）
- **保留 HTML-first 使用方式**（不產生 `.vue`、`.svelte`、`.tsx` 檔案）
- **透過 `x-data`、`x-bind`、`x-on` 宣告互動行為**
- **提供可複用 Alpine plugin**（`Alpine.data()` 預定義元件邏輯）
- **零建構工具依賴**（CDN `<script>` 標籤即可使用）

設計原則：Alpine.js 層**完全依賴**既有 `cu-*` CSS，不新增任何 CSS 規則。HTML 結構保持不變，僅以 `x-*` 屬性附加行為。

---

## 核心對應關係

| Astro / Vanilla JS 概念 | Alpine.js 對應 |
|---|---|
| `data-dialog-trigger` + `addEventListener` | `x-on:click="open = true"` |
| `data-dialog-close` + `addEventListener` | `x-on:click="close()"` |
| `document.getElementById(id).showModal()` | `$refs.dialog.showModal()` |
| `element.hidden = true` | `x-show="isOpen"` |
| `element.classList.toggle(...)` | `:class="{ 'cu-tabs-trigger-active': active === 'tab1' }"` |
| `setupDialogs()` 全域函式 | `Alpine.data('dialog', ...)` 可複用元件 |
| `<script>` inline JS | `x-data` 宣告式 |

---

## 檔案結構

```
packages/cubby-ui-alpine/
├── package.json
├── src/
│   ├── index.ts              -- 總入口（Alpine plugin）
│   ├── plugins/
│   │   ├── dialog.ts         -- Alpine.data('cuDialog', ...)
│   │   ├── alert-dialog.ts   -- Alpine.data('cuAlertDialog', ...)
│   │   ├── drawer.ts         -- Alpine.data('cuDrawer', ...)
│   │   ├── dropdown.ts       -- Alpine.data('cuDropdown', ...)
│   │   ├── popover.ts        -- Alpine.data('cuPopover', ...)
│   │   ├── tabs.ts           -- Alpine.data('cuTabs', ...)
│   │   ├── accordion.ts      -- Alpine.data('cuAccordion', ...) [可選]
│   │   ├── combobox.ts       -- Alpine.data('cuCombobox', ...)
│   │   ├── toast.ts          -- Alpine.data('cuToast', ...) + $toast magic
│   │   └── collapsible.ts    -- Alpine.data('cuCollapsible', ...) [可選]
│   └── directives/
│       └── tooltip.ts        -- x-tooltip 自訂指令 [可選]
├── dist/
│   ├── cubby-alpine.js       -- UMD bundle
│   └── cubby-alpine.esm.js   -- ESM bundle
└── cdn/
    └── cubby-alpine.min.js   -- CDN 用壓縮版
```

> Alpine.js 版的檔案數量最少 — 僅需為有互動行為的元件定義 `Alpine.data()`，純 CSS 元件（Button、Card、Badge 等）完全不需要任何 JS 封裝。

---

## 兩種使用模式

### 模式 A：Inline `x-data`（零依賴，直接寫）

不需要任何 plugin，直接在 HTML 中使用 Alpine.js 內建語法：

```html
<link rel="stylesheet" href="cubby-ui.css">
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3/dist/cdn.min.js"></script>
```

### 模式 B：Plugin 預定義（簡潔寫法）

載入 Cubby Alpine plugin，使用預定義的 `Alpine.data()` 元件：

```html
<link rel="stylesheet" href="cubby-ui.css">
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3/dist/cdn.min.js"></script>
<script src="cubby-alpine.min.js"></script>
```

或 ESM：

```js
import Alpine from 'alpinejs'
import cubbyAlpine from 'cubby-ui-alpine'

Alpine.plugin(cubbyAlpine)
Alpine.start()
```

---

## Plugin 實作

### 總入口 `index.ts`

```ts
import type { Alpine as AlpineType } from 'alpinejs'
import { dialogPlugin } from './plugins/dialog'
import { alertDialogPlugin } from './plugins/alert-dialog'
import { drawerPlugin } from './plugins/drawer'
import { dropdownPlugin } from './plugins/dropdown'
import { popoverPlugin } from './plugins/popover'
import { tabsPlugin } from './plugins/tabs'
import { comboboxPlugin } from './plugins/combobox'
import { toastPlugin } from './plugins/toast'

export default function cubbyAlpine(Alpine: AlpineType) {
  dialogPlugin(Alpine)
  alertDialogPlugin(Alpine)
  drawerPlugin(Alpine)
  dropdownPlugin(Alpine)
  popoverPlugin(Alpine)
  tabsPlugin(Alpine)
  comboboxPlugin(Alpine)
  toastPlugin(Alpine)
}
```

---

## 元件實作與使用範例

### 1. 純 CSS 元件（不需要 Alpine）

純展示元件完全不需要 JS，直接使用 `cu-*` class：

```html
<!-- Button -->
<button class="cu-button cu-button-default cu-button-md">Submit</button>
<button class="cu-button cu-button-outline cu-button-sm">Cancel</button>
<button class="cu-button cu-button-destructive cu-button-lg">Delete</button>

<!-- Badge -->
<span class="cu-badge cu-badge-default">Default</span>
<span class="cu-badge cu-badge-secondary">Secondary</span>

<!-- Card -->
<div class="cu-card">
  <div class="cu-card-header">
    <h3 class="cu-card-title">專案設定</h3>
    <p class="cu-card-description">管理您的專案配置</p>
  </div>
  <div class="cu-card-content">
    <div class="cu-form-group">
      <label class="cu-label" for="name">專案名稱</label>
      <input class="cu-input" id="name" placeholder="My Project" />
    </div>
  </div>
  <div class="cu-card-footer" style="justify-content: flex-end; gap: 0.5rem;">
    <button class="cu-button cu-button-outline cu-button-md">取消</button>
    <button class="cu-button cu-button-default cu-button-md">儲存</button>
  </div>
</div>

<!-- Alert -->
<div class="cu-alert cu-alert-default">
  <div class="cu-alert-title">注意</div>
  <div class="cu-alert-description">這是一則提醒訊息。</div>
</div>

<!-- Avatar -->
<div class="cu-avatar">
  <img class="cu-avatar-image" src="avatar.jpg" alt="User" />
  <span class="cu-avatar-fallback">JD</span>
</div>

<!-- Progress -->
<div class="cu-progress">
  <div class="cu-progress-bar" style="width: 60%"></div>
</div>

<!-- Skeleton -->
<div class="cu-skeleton" style="height: 1rem; width: 50%"></div>
```

> 這正是 Alpine.js 方案最大的優勢 — **大多數元件完全不需要 JS**，與 Cubby UI 的 HTML-first 哲學完美契合。只有需要互動行為的元件才引入 Alpine。

---

### 2. Dialog

#### Plugin 定義（`plugins/dialog.ts`）

```ts
import type { Alpine as AlpineType } from 'alpinejs'

export function dialogPlugin(Alpine: AlpineType) {
  Alpine.data('cuDialog', () => ({
    open: false,

    show() {
      this.open = true
      this.$nextTick(() => {
        this.$refs.dialog?.showModal()
      })
    },

    close() {
      this.$refs.dialog?.close()
      this.open = false
    },

    handleBackdropClick(e: MouseEvent) {
      if (e.target === this.$refs.dialog) this.close()
    },

    handleClose() {
      this.open = false
    },
  }))
}
```

#### 使用方式 A：Inline（無 plugin）

```html
<div x-data="{ open: false }">
  <button
    class="cu-button cu-button-default cu-button-md"
    x-on:click="open = true; $nextTick(() => $refs.dialog.showModal())"
  >
    開啟對話框
  </button>

  <dialog
    class="cu-dialog"
    x-ref="dialog"
    x-on:click="if ($event.target === $refs.dialog) { $refs.dialog.close(); open = false }"
    x-on:close="open = false"
  >
    <button
      type="button"
      class="cu-dialog-close"
      x-on:click="$refs.dialog.close(); open = false"
      aria-label="Close"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
           viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 6 6 18"></path>
        <path d="m6 6 12 12"></path>
      </svg>
    </button>
    <div class="cu-dialog-header">
      <h2 class="cu-dialog-title">確認操作</h2>
      <p class="cu-dialog-description">此操作無法復原，確定要繼續嗎？</p>
    </div>
    <div class="cu-dialog-footer">
      <button
        class="cu-button cu-button-outline cu-button-md"
        x-on:click="$refs.dialog.close(); open = false"
      >
        取消
      </button>
      <button class="cu-button cu-button-destructive cu-button-md">
        確認刪除
      </button>
    </div>
  </dialog>
</div>
```

#### 使用方式 B：Plugin（簡潔）

```html
<div x-data="cuDialog">
  <button
    class="cu-button cu-button-default cu-button-md"
    x-on:click="show()"
  >
    開啟對話框
  </button>

  <dialog
    class="cu-dialog"
    x-ref="dialog"
    x-on:click="handleBackdropClick($event)"
    x-on:close="handleClose()"
  >
    <button
      type="button"
      class="cu-dialog-close"
      x-on:click="close()"
      aria-label="Close"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
           viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 6 6 18"></path>
        <path d="m6 6 12 12"></path>
      </svg>
    </button>
    <div class="cu-dialog-header">
      <h2 class="cu-dialog-title">確認操作</h2>
      <p class="cu-dialog-description">此操作無法復原，確定要繼續嗎？</p>
    </div>
    <div class="cu-dialog-footer">
      <button class="cu-button cu-button-outline cu-button-md" x-on:click="close()">
        取消
      </button>
      <button class="cu-button cu-button-destructive cu-button-md">
        確認刪除
      </button>
    </div>
  </dialog>
</div>
```

> 與原版 Cubby UI 的 `data-dialog-trigger` + `<script>setupDialogs()</script>` 相比，Alpine 版完全宣告式 — `x-on:click="show()"` 取代命令式事件綁定，`x-ref="dialog"` 取代 `getElementById`。

---

### 3. Alert Dialog（無 backdrop / Escape 關閉）

#### Plugin 定義（`plugins/alert-dialog.ts`）

```ts
import type { Alpine as AlpineType } from 'alpinejs'

export function alertDialogPlugin(Alpine: AlpineType) {
  Alpine.data('cuAlertDialog', () => ({
    open: false,

    show() {
      this.open = true
      this.$nextTick(() => {
        this.$refs.dialog?.showModal()
      })
    },

    close() {
      this.$refs.dialog?.close()
      this.open = false
    },

    // 攔截 Escape
    handleCancel(e: Event) {
      e.preventDefault()
    },

    handleClose() {
      this.open = false
    },
  }))
}
```

#### 使用方式

```html
<div x-data="cuAlertDialog">
  <button
    class="cu-button cu-button-destructive cu-button-md"
    x-on:click="show()"
  >
    刪除帳號
  </button>

  <dialog
    class="cu-alert-dialog"
    x-ref="dialog"
    x-on:cancel.prevent="handleCancel($event)"
    x-on:close="handleClose()"
  >
    <div class="cu-alert-dialog-header">
      <h2 class="cu-alert-dialog-title">確定要刪除嗎？</h2>
      <p class="cu-alert-dialog-description">此操作無法復原，所有資料將永久刪除。</p>
    </div>
    <div class="cu-alert-dialog-footer">
      <button class="cu-button cu-button-outline cu-button-md" x-on:click="close()">
        取消
      </button>
      <button class="cu-button cu-button-destructive cu-button-md">
        確認刪除
      </button>
    </div>
  </dialog>
</div>
```

---

### 4. Drawer（方向 prop）

#### Plugin 定義（`plugins/drawer.ts`）

```ts
import type { Alpine as AlpineType } from 'alpinejs'

export function drawerPlugin(Alpine: AlpineType) {
  Alpine.data('cuDrawer', (side: string = 'right') => ({
    open: false,
    side,

    show() {
      this.open = true
      this.$nextTick(() => {
        this.$refs.dialog?.showModal()
      })
    },

    close() {
      this.$refs.dialog?.close()
      this.open = false
    },

    handleBackdropClick(e: MouseEvent) {
      if (e.target === this.$refs.dialog) this.close()
    },

    handleClose() {
      this.open = false
    },
  }))
}
```

#### 使用方式

```html
<div x-data="cuDrawer('right')">
  <button class="cu-button cu-button-outline cu-button-md" x-on:click="show()">
    開啟側邊面板
  </button>

  <dialog
    class="cu-drawer cu-drawer-right"
    x-ref="dialog"
    x-on:click="handleBackdropClick($event)"
    x-on:close="handleClose()"
  >
    <button type="button" class="cu-drawer-close" x-on:click="close()" aria-label="Close">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
           viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 6 6 18"></path>
        <path d="m6 6 12 12"></path>
      </svg>
    </button>
    <div class="cu-drawer-header">
      <h2 class="cu-drawer-title">設定</h2>
      <p class="cu-drawer-description">調整您的偏好設定。</p>
    </div>
    <div class="cu-drawer-content">
      <!-- 內容 -->
    </div>
    <div class="cu-drawer-footer">
      <button class="cu-button cu-button-default cu-button-md" x-on:click="close()">
        關閉
      </button>
    </div>
  </dialog>
</div>
```

---

### 5. Dropdown Menu

#### Plugin 定義（`plugins/dropdown.ts`）

```ts
import type { Alpine as AlpineType } from 'alpinejs'

export function dropdownPlugin(Alpine: AlpineType) {
  Alpine.data('cuDropdown', () => ({
    isOpen: false,

    toggle() {
      this.isOpen = !this.isOpen
    },

    close() {
      this.isOpen = false
    },

    // x-on:click.outside 是 Alpine 內建，不需要自訂
    // x-on:keydown.escape 也是 Alpine 內建
  }))
}
```

#### 使用方式 A：Inline

```html
<div
  class="cu-dropdown"
  x-data="{ isOpen: false }"
  x-on:click.outside="isOpen = false"
  x-on:keydown.escape.window="isOpen = false"
>
  <button
    class="cu-button cu-button-outline cu-button-md"
    x-on:click.stop="isOpen = !isOpen"
  >
    選單
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
         viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m6 9 6 6 6-6"></path>
    </svg>
  </button>

  <div class="cu-dropdown-content" x-show="isOpen" x-transition x-cloak>
    <div class="cu-dropdown-label">我的帳號</div>
    <div class="cu-dropdown-separator"></div>
    <button class="cu-dropdown-item" x-on:click="isOpen = false">個人資料</button>
    <button class="cu-dropdown-item" x-on:click="isOpen = false">設定</button>
    <div class="cu-dropdown-separator"></div>
    <button class="cu-dropdown-item" x-on:click="isOpen = false">登出</button>
  </div>
</div>
```

#### 使用方式 B：Plugin

```html
<div
  class="cu-dropdown"
  x-data="cuDropdown"
  x-on:click.outside="close()"
  x-on:keydown.escape.window="close()"
>
  <button
    class="cu-button cu-button-outline cu-button-md"
    x-on:click.stop="toggle()"
  >
    選單
  </button>

  <div class="cu-dropdown-content" x-show="isOpen" x-transition x-cloak>
    <div class="cu-dropdown-label">我的帳號</div>
    <div class="cu-dropdown-separator"></div>
    <button class="cu-dropdown-item" x-on:click="close()">個人資料</button>
    <button class="cu-dropdown-item" x-on:click="close()">設定</button>
    <div class="cu-dropdown-separator"></div>
    <button class="cu-dropdown-item" x-on:click="close()">登出</button>
  </div>
</div>
```

> Alpine.js 內建 `x-on:click.outside` 修飾符，不需要自訂 Action 或 Hook。`x-transition` 自動加入 CSS 過場動畫。`x-cloak` 隱藏初始未渲染狀態（需搭配 `[x-cloak] { display: none }` CSS）。

---

### 6. Popover

#### Plugin 定義（`plugins/popover.ts`）

```ts
import type { Alpine as AlpineType } from 'alpinejs'

export function popoverPlugin(Alpine: AlpineType) {
  Alpine.data('cuPopover', () => ({
    isOpen: false,

    toggle() {
      this.isOpen = !this.isOpen
    },

    close() {
      this.isOpen = false
    },
  }))
}
```

#### 使用方式

```html
<div
  class="cu-popover"
  x-data="cuPopover"
  x-on:click.outside="close()"
  x-on:keydown.escape.window="close()"
>
  <button
    class="cu-button cu-button-outline cu-button-md"
    x-on:click.stop="toggle()"
  >
    開啟 Popover
  </button>

  <div class="cu-popover-content" x-show="isOpen" x-transition x-cloak>
    <p>這是一段彈出內容。</p>
  </div>
</div>
```

---

### 7. Tabs

#### Plugin 定義（`plugins/tabs.ts`）

```ts
import type { Alpine as AlpineType } from 'alpinejs'

export function tabsPlugin(Alpine: AlpineType) {
  Alpine.data('cuTabs', (defaultTab: string = '') => ({
    active: defaultTab,

    select(value: string) {
      this.active = value
    },

    isActive(value: string): boolean {
      return this.active === value
    },

    triggerClass(value: string): string {
      return this.active === value
        ? 'cu-tabs-trigger cu-tabs-trigger-active'
        : 'cu-tabs-trigger'
    },
  }))
}
```

#### 使用方式 A：Inline

```html
<div class="cu-tabs" x-data="{ active: 'account' }">
  <div class="cu-tabs-list">
    <button
      :class="active === 'account' ? 'cu-tabs-trigger cu-tabs-trigger-active' : 'cu-tabs-trigger'"
      x-on:click="active = 'account'"
    >
      帳號
    </button>
    <button
      :class="active === 'password' ? 'cu-tabs-trigger cu-tabs-trigger-active' : 'cu-tabs-trigger'"
      x-on:click="active = 'password'"
    >
      密碼
    </button>
    <button
      :class="active === 'notifications' ? 'cu-tabs-trigger cu-tabs-trigger-active' : 'cu-tabs-trigger'"
      x-on:click="active = 'notifications'"
    >
      通知
    </button>
  </div>

  <div class="cu-tabs-content" x-show="active === 'account'">帳號設定...</div>
  <div class="cu-tabs-content" x-show="active === 'password'" x-cloak>密碼設定...</div>
  <div class="cu-tabs-content" x-show="active === 'notifications'" x-cloak>通知設定...</div>
</div>
```

#### 使用方式 B：Plugin

```html
<div class="cu-tabs" x-data="cuTabs('account')">
  <div class="cu-tabs-list">
    <button :class="triggerClass('account')" x-on:click="select('account')">
      帳號
    </button>
    <button :class="triggerClass('password')" x-on:click="select('password')">
      密碼
    </button>
    <button :class="triggerClass('notifications')" x-on:click="select('notifications')">
      通知
    </button>
  </div>

  <div class="cu-tabs-content" x-show="isActive('account')">帳號設定...</div>
  <div class="cu-tabs-content" x-show="isActive('password')" x-cloak>密碼設定...</div>
  <div class="cu-tabs-content" x-show="isActive('notifications')" x-cloak>通知設定...</div>
</div>
```

---

### 8. Combobox（可搜尋下拉選單）

#### Plugin 定義（`plugins/combobox.ts`）

```ts
import type { Alpine as AlpineType } from 'alpinejs'

export function comboboxPlugin(Alpine: AlpineType) {
  Alpine.data('cuCombobox', (items: Array<{ value: string; label: string }> = []) => ({
    isOpen: false,
    query: '',
    selected: '' as string,
    selectedLabel: '' as string,
    items,

    get filtered() {
      if (!this.query) return this.items
      const q = this.query.toLowerCase()
      return this.items.filter((item: { label: string }) =>
        item.label.toLowerCase().includes(q),
      )
    },

    toggle() {
      this.isOpen = !this.isOpen
      if (this.isOpen) {
        this.$nextTick(() => this.$refs.input?.focus())
      }
    },

    close() {
      this.isOpen = false
      this.query = ''
    },

    select(item: { value: string; label: string }) {
      this.selected = item.value
      this.selectedLabel = item.label
      this.close()
    },

    isSelected(value: string): boolean {
      return this.selected === value
    },
  }))
}
```

#### 使用方式

```html
<div
  x-data="cuCombobox([
    { value: 'next', label: 'Next.js' },
    { value: 'svelte', label: 'SvelteKit' },
    { value: 'nuxt', label: 'Nuxt' },
    { value: 'remix', label: 'Remix' },
    { value: 'astro', label: 'Astro' }
  ])"
  class="cu-combobox"
  x-on:click.outside="close()"
  x-on:keydown.escape.window="close()"
>
  <button class="cu-combobox-trigger" x-on:click.stop="toggle()">
    <span
      x-text="selectedLabel || '選擇框架...'"
      :class="selectedLabel ? '' : 'cu-combobox-trigger-placeholder'"
    ></span>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
         viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
         class="cu-combobox-icon">
      <path d="m7 15 5 5 5-5"></path>
      <path d="m7 9 5-5 5 5"></path>
    </svg>
  </button>

  <div class="cu-combobox-content" x-show="isOpen" x-transition x-cloak>
    <div class="cu-combobox-input-wrapper">
      <input
        class="cu-combobox-input"
        x-ref="input"
        x-model="query"
        placeholder="搜尋..."
      />
    </div>
    <div class="cu-combobox-list">
      <template x-for="item in filtered" :key="item.value">
        <button
          class="cu-combobox-item"
          :class="isSelected(item.value) ? 'cu-combobox-item-active' : ''"
          x-on:click="select(item)"
          x-text="item.label"
        ></button>
      </template>
      <div
        class="cu-combobox-empty"
        x-show="filtered.length === 0"
      >
        找不到結果
      </div>
    </div>
  </div>
</div>
```

---

### 9. Toast

#### Plugin 定義（`plugins/toast.ts`）

```ts
import type { Alpine as AlpineType } from 'alpinejs'

interface ToastItem {
  id: number
  title?: string
  description?: string
  variant: string
}

let nextId = 0

export function toastPlugin(Alpine: AlpineType) {
  // 全域 store
  Alpine.store('cuToasts', {
    items: [] as ToastItem[],

    add(options: Omit<ToastItem, 'id'>) {
      const id = nextId++
      const item: ToastItem = { id, variant: 'default', ...options }
      ;(this.items as ToastItem[]).push(item)

      setTimeout(() => this.dismiss(id), 5000)
      return id
    },

    dismiss(id: number) {
      this.items = (this.items as ToastItem[]).filter(t => t.id !== id)
    },
  })

  // $toast magic helper
  Alpine.magic('toast', () => {
    return (options: Omit<ToastItem, 'id'>) => {
      return (Alpine.store('cuToasts') as any).add(options)
    }
  })

  // Toast 容器元件
  Alpine.data('cuToaster', (position: string = 'bottom-right') => ({
    position,

    get toasts() {
      return (this.$store as any).cuToasts.items
    },

    dismiss(id: number) {
      ;(this.$store as any).cuToasts.dismiss(id)
    },

    containerClass(): string {
      return `cu-toast-container cu-toast-container-${this.position}`
    },
  }))
}
```

#### 使用方式

```html
<!-- Toast 容器（放在 body 底部，全頁只需一個） -->
<div x-data="cuToaster('bottom-right')" :class="containerClass()">
  <template x-for="t in toasts" :key="t.id">
    <div :class="'cu-toast cu-toast-' + t.variant">
      <div>
        <div class="cu-toast-title" x-show="t.title" x-text="t.title"></div>
        <div class="cu-toast-description" x-show="t.description" x-text="t.description"></div>
      </div>
      <button class="cu-toast-close" x-on:click="dismiss(t.id)" aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
             viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18"></path>
          <path d="m6 6 12 12"></path>
        </svg>
      </button>
    </div>
  </template>
</div>

<!-- 在任何地方觸發 toast -->
<button
  class="cu-button cu-button-default cu-button-md"
  x-data
  x-on:click="$toast({ title: '儲存成功', variant: 'success' })"
>
  儲存
</button>

<button
  class="cu-button cu-button-destructive cu-button-md"
  x-data
  x-on:click="$toast({ title: '刪除失敗', description: '請稍後再試', variant: 'destructive' })"
>
  刪除
</button>
```

> Alpine 的 `$store` 提供全域狀態，`Alpine.magic('$toast', ...)` 讓任何元素都能用 `$toast(...)` 觸發通知，不需要 React 的 Provider 或 Vue 的 `provide/inject`。

---

### 10. Accordion / Collapsible（原生 `<details>`）

原生 `<details>` 已經有展開/收合行為，不需要 Alpine。但如果需要「同時只展開一個」的手風琴行為，可加上 Alpine：

#### 基本用法（無 Alpine）

```html
<div class="cu-accordion">
  <details class="cu-accordion-item" open>
    <summary class="cu-accordion-trigger">
      什麼是 Cubby UI？
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
           viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m6 9 6 6 6-6"></path>
      </svg>
    </summary>
    <div class="cu-accordion-content">一個框架無關的 UI 元件庫。</div>
  </details>
  <details class="cu-accordion-item">
    <summary class="cu-accordion-trigger">
      支援哪些框架？
      <svg><!-- ... --></svg>
    </summary>
    <div class="cu-accordion-content">任何使用 HTML + CSS 的環境。</div>
  </details>
</div>
```

#### 進階：單一展開模式（Alpine）

```ts
// plugins/accordion.ts
import type { Alpine as AlpineType } from 'alpinejs'

export function accordionPlugin(Alpine: AlpineType) {
  Alpine.data('cuAccordion', (defaultOpen: string = '') => ({
    active: defaultOpen,

    toggle(value: string) {
      this.active = this.active === value ? '' : value
    },

    isOpen(value: string): boolean {
      return this.active === value
    },
  }))
}
```

```html
<div class="cu-accordion" x-data="cuAccordion('item-1')">
  <div class="cu-accordion-item">
    <button
      class="cu-accordion-trigger"
      x-on:click="toggle('item-1')"
    >
      什麼是 Cubby UI？
      <svg><!-- ... --></svg>
    </button>
    <div class="cu-accordion-content" x-show="isOpen('item-1')" x-collapse>
      一個框架無關的 UI 元件庫。
    </div>
  </div>
  <div class="cu-accordion-item">
    <button
      class="cu-accordion-trigger"
      x-on:click="toggle('item-2')"
    >
      支援哪些框架？
      <svg><!-- ... --></svg>
    </button>
    <div class="cu-accordion-content" x-show="isOpen('item-2')" x-collapse>
      任何使用 HTML + CSS 的環境。
    </div>
  </div>
</div>
```

> `x-collapse` 是 Alpine.js 的官方 plugin（`@alpinejs/collapse`），提供平滑的高度動畫過場。

---

### 11. HoverCard / Tooltip（純 CSS）

這些元件完全依賴 CSS hover 效果，不需要 Alpine：

```html
<!-- Tooltip -->
<span class="cu-tooltip" data-tooltip="這是提示文字">
  <button class="cu-button cu-button-ghost cu-button-icon">
    <svg><!-- info icon --></svg>
  </button>
</span>

<span class="cu-tooltip cu-tooltip-bottom" data-tooltip="底部提示">
  Hover me
</span>

<!-- HoverCard -->
<div class="cu-hover-card">
  <a href="#">@username</a>
  <div class="cu-hover-card-content">
    <p>使用者的詳細資訊...</p>
  </div>
</div>
```

---

### 12. Typography / Layout（純 CSS）

```html
<!-- Headings -->
<h1 class="cu-h1">頁面標題</h1>
<h2 class="cu-h2">二級標題</h2>

<!-- Paragraph -->
<p class="cu-paragraph cu-paragraph-lead">這是引導文字。</p>
<p class="cu-paragraph">這是一般段落。</p>

<!-- Blockquote -->
<blockquote class="cu-blockquote">這是一段引用。</blockquote>

<!-- List -->
<ul class="cu-list cu-list-disc">
  <li>項目一</li>
  <li>項目二</li>
</ul>

<!-- Link -->
<a class="cu-link" href="#">連結文字</a>

<!-- HR -->
<hr class="cu-hr" />

<!-- Container -->
<div class="cu-container cu-container-lg">
  <!-- 內容 -->
</div>

<!-- Header -->
<header class="cu-header">
  <div class="cu-header-inner">
    <div class="cu-header-brand">Logo</div>
    <nav class="cu-header-nav">
      <a class="cu-nav-item cu-nav-item-active" href="#">首頁</a>
      <a class="cu-nav-item" href="#">關於</a>
    </nav>
    <div class="cu-header-actions">
      <button class="cu-button cu-button-ghost cu-button-sm">登入</button>
    </div>
  </div>
</header>

<!-- Sidebar -->
<aside class="cu-sidebar">
  <div class="cu-sidebar-content">
    <div class="cu-sidebar-section">
      <div class="cu-sidebar-section-title">Components</div>
      <div class="cu-sidebar-group">
        <div class="cu-sidebar-group-title">Basic</div>
        <a class="cu-sidebar-item cu-sidebar-item-active" href="#">Button</a>
        <a class="cu-sidebar-item" href="#">Card</a>
      </div>
    </div>
  </div>
</aside>
```

---

### 13. 表單元件（Alpine 雙向綁定）

表單元件本身不需要 Alpine plugin，但可用 `x-model` 管理表單狀態：

```html
<form x-data="{ form: { name: '', email: '', agree: false, role: '', darkMode: false } }">
  <div class="cu-form-group">
    <label class="cu-label" for="name">名稱</label>
    <input class="cu-input" id="name" x-model="form.name" placeholder="請輸入名稱" />
  </div>

  <div class="cu-form-group">
    <label class="cu-label" for="email">Email</label>
    <input class="cu-input" id="email" type="email" x-model="form.email" />
    <p class="cu-form-description">我們不會分享您的 email。</p>
  </div>

  <div class="cu-form-group">
    <label class="cu-label" for="role">角色</label>
    <div class="cu-select-wrapper">
      <select class="cu-select" id="role" x-model="form.role">
        <option value="">請選擇角色</option>
        <option value="admin">管理員</option>
        <option value="user">使用者</option>
      </select>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
           viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
           class="cu-select-icon">
        <path d="m6 9 6 6 6-6"></path>
      </svg>
    </div>
  </div>

  <label class="cu-checkbox-wrapper">
    <input type="checkbox" class="cu-checkbox" x-model="form.agree" />
    <span>我同意服務條款</span>
  </label>

  <label class="cu-toggle-wrapper">
    <input type="checkbox" class="cu-toggle-input" x-model="form.darkMode" />
    <span class="cu-toggle">
      <span class="cu-toggle-thumb"></span>
    </span>
    <span>暗色模式</span>
  </label>

  <button
    class="cu-button cu-button-default cu-button-md"
    type="submit"
    :disabled="!form.agree"
  >
    送出
  </button>
</form>
```

> Alpine 的 `x-model` 直接綁定到原生表單元素，不需要元件包裝。`:disabled="!form.agree"` 是 `x-bind:disabled` 的簡寫，響應式禁用按鈕。

---

## 完整元件清單

### 不需要 Alpine 的元件（純 CSS）

直接使用 `cu-*` class，無需任何 JS：

| 類別 | 元件 |
|---|---|
| **Typography** | Headings, Paragraph, Blockquote, List, Link, HR |
| **Basic** | Button, Button Group, Card（含子元件）, Badge, Separator |
| **Forms** | Label, Input, Textarea, Select, Checkbox, Radio, Toggle, Search Input, File Input, Range, Form Group, Form Description, Form Error |
| **Data Display** | Accordion（原生 `<details>`）, Avatar, Collapsible（原生 `<details>`）, Stat（含子元件）|
| **Feedback** | Alert（含子元件）, Progress, Skeleton, Empty State |
| **Overlay** | HoverCard, Tooltip |
| **Navigation** | Breadcrumb, Pagination |
| **Layout** | Container, Header, Nav, Sidebar |

### 需要 Alpine 的元件（互動行為）

| Alpine 元件 | `x-data` | 提供的方法 | 核心狀態 |
|---|---|---|---|
| Dialog | `cuDialog` | `show()`, `close()` | `open` |
| Alert Dialog | `cuAlertDialog` | `show()`, `close()` | `open` |
| Drawer | `cuDrawer('right')` | `show()`, `close()` | `open`, `side` |
| Dropdown | `cuDropdown` | `toggle()`, `close()` | `isOpen` |
| Popover | `cuPopover` | `toggle()`, `close()` | `isOpen` |
| Tabs | `cuTabs('default')` | `select(v)`, `isActive(v)`, `triggerClass(v)` | `active` |
| Combobox | `cuCombobox(items)` | `toggle()`, `close()`, `select(item)` | `isOpen`, `query`, `selected` |
| Toast | `cuToaster('pos')` + `$toast()` | `dismiss(id)`, `$toast({...})` | `$store.cuToasts.items` |
| Accordion（單一展開） | `cuAccordion('default')` | `toggle(v)`, `isOpen(v)` | `active` |

---

## Alpine.js 特有優勢

### 1. `x-on:click.outside` — 內建修飾符

```html
<!-- Alpine 內建，不需要自訂 hook 或 action -->
<div x-on:click.outside="close()">
```

其他框架需要 `useOutsideClick`（React）、`useOutsideClick`（Vue composable）、`use:clickOutside`（Svelte action）。

### 2. `x-on:keydown.escape.window` — 鍵盤事件修飾符

```html
<div x-on:keydown.escape.window="close()">
```

`.window` 修飾符將事件綁定到 `window`，`.escape` 自動比對按鍵。

### 3. `x-transition` — 零配置過場動畫

```html
<div x-show="isOpen" x-transition>
```

自動加入 enter/leave CSS transition class，不需要額外 CSS 或配置。

### 4. `x-collapse` — 高度動畫

```html
<!-- 需要 @alpinejs/collapse plugin -->
<div x-show="isOpen" x-collapse>
```

平滑的 height auto → 0 動畫，適合 Accordion、Collapsible。

### 5. `x-cloak` — 防止 FOUC

```html
<div x-show="isOpen" x-cloak>
```

搭配 `[x-cloak] { display: none }` CSS，防止 Alpine 初始化前的閃爍。

### 6. `$store` — 全域狀態（零包裝）

```html
<!-- 不需要 Provider、Context、inject — 直接存取 -->
<button x-data x-on:click="$toast({ title: 'Hello' })">Toast</button>
```

### 7. `x-model` — 原生表單雙向綁定

```html
<input class="cu-input" x-model="form.name" />
<select class="cu-select" x-model="form.role">
```

直接綁定到原生元素，不需要元件包裝。

---

## 與 Vanilla JS（現有方案）的對比

| 面向 | 現有 Vanilla JS | Alpine.js |
|---|---|---|
| 狀態管理 | `data-*` + DOM 操作 | `x-data` 響應式 |
| 事件綁定 | `addEventListener` + `querySelector` | `x-on:click` 宣告式 |
| DOM 更新 | 手動 `classList.toggle` / `hidden` | `:class` / `x-show` 自動同步 |
| Outside click | 自訂 `document.addEventListener('click')` | `x-on:click.outside` 內建 |
| Escape key | 自訂 `document.addEventListener('keydown')` | `x-on:keydown.escape.window` 內建 |
| 初始化 | `setupDialogs()` 手動呼叫 | `x-data` 自動初始化 |
| 清理 | 需手動 `removeEventListener` | Alpine 自動清理 |
| 動畫 | 自行處理或無 | `x-transition` / `x-collapse` 內建 |
| 全域通信 | 自行管理 | `$store` / `$dispatch` |

---

## 與其他框架方案的比較

| 面向 | Alpine.js | React | Vue | Svelte | Blade | Web Components |
|---|---|---|---|---|---|---|
| 需要建構工具 | 否 | 是 | 是 | 是 | 否 | 否 |
| 元件檔案 | 0（全在 HTML 中） | `.tsx` | `.vue` | `.svelte` | `.blade.php` | `.ts` |
| JS 體積（Alpine 本體） | ~17 KB min+gzip | — | — | — | — | — |
| Plugin 體積 | ~1-2 KB gzip | ~6-10 KB | ~5-8 KB | ~2-4 KB | 0 KB | ~1.5-5 KB |
| 型別安全 | 無 | 完整 | 完整 | 完整 | 無 | 無 |
| 學習曲線 | 極低 | 中 | 中 | 中 | 低 | 中 |
| 適用場景 | 多頁應用、CMS、靜態站、快速原型 | SPA、Next.js | SPA、Nuxt | SPA、SvelteKit | Laravel | 任何環境 |
| 與 Cubby UI 哲學契合度 | **最高** | 中 | 中 | 高 | 高 | 高 |
| 純 CSS 元件處理 | 完全不變 | 需元件包裝 | 需元件包裝 | 需元件包裝 | 需模板包裝 | 需 CE 包裝 |
| SSR 相容 | 是（漸進式增強） | RSC | Nuxt | SvelteKit | Laravel | 有限 |

---

## 打包設定

### `package.json`

```json
{
  "name": "cubby-ui-alpine",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/cubby-alpine.js",
  "module": "./dist/cubby-alpine.esm.js",
  "unpkg": "./cdn/cubby-alpine.min.js",
  "jsdelivr": "./cdn/cubby-alpine.min.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/cubby-alpine.esm.js",
      "require": "./dist/cubby-alpine.js",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist", "cdn"],
  "peerDependencies": {
    "alpinejs": "^3.14.0"
  },
  "devDependencies": {
    "alpinejs": "^3.14.0",
    "tsup": "^8.0.0",
    "typescript": "^5.5.0"
  },
  "sideEffects": false
}
```

### `tsup.config.ts`

```ts
import { defineConfig } from 'tsup'

export default defineConfig([
  // ESM + CJS
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    external: ['alpinejs'],
    outDir: 'dist',
  },
  // CDN (IIFE, self-registering)
  {
    entry: { 'cubby-alpine.min': 'src/cdn.ts' },
    format: ['iife'],
    minify: true,
    outDir: 'cdn',
    globalName: 'CubbyAlpine',
  },
])
```

### `src/cdn.ts`（CDN 自動註冊版）

```ts
import cubbyAlpine from './index'

// 自動偵測 Alpine 並註冊
document.addEventListener('alpine:init', () => {
  cubbyAlpine((window as any).Alpine)
})
```

---

## 使用方式總覽

### CDN（最簡單）

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <link rel="stylesheet" href="https://cdn.example.com/cubby-ui.css">
  <style>[x-cloak] { display: none !important; }</style>
</head>
<body>

  <!-- 純 CSS 元件 -->
  <button class="cu-button cu-button-default cu-button-md">Click</button>

  <!-- 互動元件 -->
  <div x-data="cuDialog">
    <button class="cu-button cu-button-outline cu-button-md" x-on:click="show()">
      開啟
    </button>
    <dialog class="cu-dialog" x-ref="dialog"
            x-on:click="handleBackdropClick($event)"
            x-on:close="handleClose()">
      <div class="cu-dialog-header">
        <h2 class="cu-dialog-title">Hello</h2>
      </div>
      <div class="cu-dialog-footer">
        <button class="cu-button cu-button-outline cu-button-md" x-on:click="close()">
          關閉
        </button>
      </div>
    </dialog>
  </div>

  <!-- Alpine + Cubby Plugin -->
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3/dist/cdn.min.js"></script>
  <script src="https://cdn.example.com/cubby-alpine.min.js"></script>
</body>
</html>
```

### ESM（含建構工具）

```js
// main.js
import Alpine from 'alpinejs'
import collapse from '@alpinejs/collapse'  // 可選：高度動畫
import cubbyAlpine from 'cubby-ui-alpine'

Alpine.plugin(collapse)
Alpine.plugin(cubbyAlpine)
Alpine.start()
```

### Laravel + Alpine（Livewire 預設）

```php
// resources/views/layouts/app.blade.php
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    {{ $slot }}

    <!-- Toast 容器 -->
    <div x-data="cuToaster('bottom-right')" :class="containerClass()">
        <template x-for="t in toasts" :key="t.id">
            <div :class="'cu-toast cu-toast-' + t.variant">
                <div>
                    <div class="cu-toast-title" x-show="t.title" x-text="t.title"></div>
                    <div class="cu-toast-description" x-show="t.description" x-text="t.description"></div>
                </div>
                <button class="cu-toast-close" x-on:click="dismiss(t.id)">✕</button>
            </div>
        </template>
    </div>
</body>
</html>
```

```js
// resources/js/app.js
import Alpine from 'alpinejs'
import cubbyAlpine from 'cubby-ui-alpine'

Alpine.plugin(cubbyAlpine)
window.Alpine = Alpine
Alpine.start()
```

### Astro + Alpine

```astro
---
// src/pages/demo.astro
import Layout from '../layouts/Layout.astro'
---
<Layout title="Alpine Demo">
  <div x-data="cuTabs('account')">
    <div class="cu-tabs-list">
      <button :class="triggerClass('account')" x-on:click="select('account')">帳號</button>
      <button :class="triggerClass('password')" x-on:click="select('password')">密碼</button>
    </div>
    <div class="cu-tabs-content" x-show="isActive('account')">帳號設定...</div>
    <div class="cu-tabs-content" x-show="isActive('password')" x-cloak>密碼設定...</div>
  </div>
</Layout>

<script>
  import Alpine from 'alpinejs'
  import cubbyAlpine from 'cubby-ui-alpine'

  Alpine.plugin(cubbyAlpine)
  Alpine.start()
</script>
```

---

## 優缺點總結

| 優點 | 缺點 |
|---|---|
| **與 Cubby UI 哲學最契合** — HTML-first，純 CSS 元件完全不變 | 無型別安全（`x-data` 內容無靜態檢查） |
| 零建構工具依賴，CDN 一行引入 | 複雜元件的 inline `x-data` 可能冗長 |
| 純 CSS 元件不需要任何 JS 封裝 | 不適合大型 SPA（Alpine 定位為輕量互動層） |
| `x-on:click.outside`、`x-transition` 等內建修飾符 | 無元件檔案系統（不像 .vue/.svelte 可拆分） |
| `x-model` 直接綁定原生表單元素 | IDE 支援不如 TypeScript 框架 |
| `$store` + `$toast` magic 全域通信極簡 | |
| Plugin 體積最小（~1-2 KB gzip） | |
| 與 Laravel / Livewire / Astro / Hugo 等完美整合 | |
| 漸進式增強 — 無 JS 時元件仍可見（純 CSS） | |
| 學習曲線最低 — 已熟悉 HTML 的開發者即刻上手 | |
