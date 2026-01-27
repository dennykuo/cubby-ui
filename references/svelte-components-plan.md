# Cubby UI — Svelte 元件層整合方案

## 背景

Cubby UI 的核心是框架無關的 CSS 類別層（`cu-*` class）。Svelte 元件層作為第三層封裝，提供：

- **TypeScript Props 型別安全**（`$props()` + `interface`）
- **`$bindable()` 雙向綁定**（表單元件 `bind:value`、Dialog `bind:open` 等）
- **Svelte Actions**（`use:clickOutside`、`use:escapeKey` — 可重用的 DOM 行為）
- **編譯時最佳化**（無 Virtual DOM，最小 runtime，產出極小 bundle）
- **Tree-shaking**（按需引入，未使用的元件不打包）
- **SSR 相容**（SvelteKit 伺服器端渲染）

本方案以 **Svelte 5**（Runes API）為基礎。

設計原則：Svelte 元件層**完全依賴**既有 `cu-*` CSS，不新增任何 CSS 規則。

---

## 核心對應關係

| Astro 概念 | Svelte 5 對應 |
|---|---|
| `interface Props` | `interface Props` + `let { ... } = $props()` |
| `Astro.props` 解構 | `let { variant, class: className, ...rest } = $props()` |
| `class:list={[base, className]}` | `class={cn(base, className)}` |
| `{...rest}` 屬性透傳 | `{...rest}` spread |
| `<slot />` | `{@render children?.()}` （Svelte 5 Snippet） |
| 具名 slot `<slot name="x" />` | `{@render header?.()}` 具名 Snippet |
| `TOP_CLASS` (`cu`) | 直接寫死或常數 |
| inline `<script>` + `data-*` | `$state` + `$effect` + Svelte Actions |

---

## 檔案結構

```
packages/cubby-ui-svelte/
├── package.json
├── tsconfig.json
├── svelte.config.js
├── vite.config.ts
├── src/
│   ├── index.ts                  -- 總入口（named exports）
│   ├── lib/
│   │   ├── utils/
│   │   │   └── cn.ts             -- class 合併工具
│   │   ├── actions/
│   │   │   ├── click-outside.ts  -- use:clickOutside
│   │   │   └── escape-key.ts     -- use:escapeKey
│   │   └── components/
│   │       ├── Button.svelte
│   │       ├── Badge.svelte
│   │       ├── Separator.svelte
│   │       ├── ButtonGroup.svelte
│   │       ├── Card.svelte
│   │       ├── CardHeader.svelte
│   │       ├── CardTitle.svelte
│   │       ├── CardDescription.svelte
│   │       ├── CardContent.svelte
│   │       ├── CardFooter.svelte
│   │       ├── Alert.svelte
│   │       ├── AlertTitle.svelte
│   │       ├── AlertDescription.svelte
│   │       ├── AlertDialog.svelte
│   │       ├── AlertDialogHeader.svelte
│   │       ├── AlertDialogTitle.svelte
│   │       ├── AlertDialogDescription.svelte
│   │       ├── AlertDialogFooter.svelte
│   │       ├── Dialog.svelte
│   │       ├── DialogHeader.svelte
│   │       ├── DialogTitle.svelte
│   │       ├── DialogDescription.svelte
│   │       ├── DialogFooter.svelte
│   │       ├── DialogClose.svelte
│   │       ├── Drawer.svelte
│   │       ├── DrawerHeader.svelte
│   │       ├── DrawerTitle.svelte
│   │       ├── DrawerDescription.svelte
│   │       ├── DrawerContent.svelte
│   │       ├── DrawerFooter.svelte
│   │       ├── DrawerClose.svelte
│   │       ├── Dropdown.svelte
│   │       ├── DropdownContent.svelte
│   │       ├── DropdownItem.svelte
│   │       ├── DropdownLabel.svelte
│   │       ├── DropdownSeparator.svelte
│   │       ├── Accordion.svelte
│   │       ├── AccordionItem.svelte
│   │       ├── AccordionTrigger.svelte
│   │       ├── AccordionContent.svelte
│   │       ├── Avatar.svelte
│   │       ├── AvatarImage.svelte
│   │       ├── AvatarFallback.svelte
│   │       ├── Breadcrumb.svelte
│   │       ├── BreadcrumbItem.svelte
│   │       ├── BreadcrumbLink.svelte
│   │       ├── BreadcrumbSeparator.svelte
│   │       ├── BreadcrumbCurrent.svelte
│   │       ├── Collapsible.svelte
│   │       ├── CollapsibleTrigger.svelte
│   │       ├── CollapsibleContent.svelte
│   │       ├── EmptyState.svelte
│   │       ├── EmptyStateIcon.svelte
│   │       ├── EmptyStateTitle.svelte
│   │       ├── EmptyStateDescription.svelte
│   │       ├── EmptyStateAction.svelte
│   │       ├── HoverCard.svelte
│   │       ├── HoverCardContent.svelte
│   │       ├── Menubar.svelte
│   │       ├── MenubarMenu.svelte
│   │       ├── MenubarTrigger.svelte
│   │       ├── MenubarContent.svelte
│   │       ├── MenubarItem.svelte
│   │       ├── MenubarSeparator.svelte
│   │       ├── MenubarLabel.svelte
│   │       ├── MenubarShortcut.svelte
│   │       ├── Pagination.svelte
│   │       ├── PaginationItem.svelte
│   │       ├── PaginationPrev.svelte
│   │       ├── PaginationNext.svelte
│   │       ├── PaginationEllipsis.svelte
│   │       ├── Popover.svelte
│   │       ├── PopoverContent.svelte
│   │       ├── Stat.svelte
│   │       ├── StatHeader.svelte
│   │       ├── StatLabel.svelte
│   │       ├── StatValue.svelte
│   │       ├── StatDescription.svelte
│   │       ├── StatTrend.svelte
│   │       ├── Tabs.svelte
│   │       ├── TabsList.svelte
│   │       ├── TabsTrigger.svelte
│   │       ├── TabsContent.svelte
│   │       ├── Toast.svelte
│   │       ├── Toaster.svelte
│   │       ├── toast.svelte.ts   -- createToast() rune-based store
│   │       ├── Tooltip.svelte
│   │       ├── Header.svelte
│   │       ├── HeaderInner.svelte
│   │       ├── HeaderBrand.svelte
│   │       ├── HeaderNav.svelte
│   │       ├── HeaderActions.svelte
│   │       ├── Sidebar.svelte
│   │       ├── SidebarHeader.svelte
│   │       ├── SidebarContent.svelte
│   │       ├── SidebarFooter.svelte
│   │       ├── SidebarSection.svelte
│   │       ├── SidebarSectionTitle.svelte
│   │       ├── SidebarGroup.svelte
│   │       ├── SidebarGroupTitle.svelte
│   │       ├── SidebarItem.svelte
│   │       ├── SidebarSeparator.svelte
│   │       ├── Nav.svelte
│   │       ├── NavItem.svelte
│   │       ├── Container.svelte
│   │       ├── Label.svelte
│   │       ├── Input.svelte
│   │       ├── Textarea.svelte
│   │       ├── Select.svelte
│   │       ├── Checkbox.svelte
│   │       ├── Radio.svelte
│   │       ├── Toggle.svelte
│   │       ├── Range.svelte
│   │       ├── SearchInput.svelte
│   │       ├── FileInput.svelte
│   │       ├── FormGroup.svelte
│   │       ├── FormDescription.svelte
│   │       ├── FormError.svelte
│   │       ├── Progress.svelte
│   │       ├── Skeleton.svelte
│   │       ├── Heading.svelte
│   │       ├── Paragraph.svelte
│   │       ├── Blockquote.svelte
│   │       ├── Link.svelte
│   │       ├── List.svelte
│   │       └── Hr.svelte
└── dist/                         -- svelte-package 產出
```

> Svelte 不支援 React 的 Compound Component（`Card.Header`）語法，因此每個子元件為獨立 `.svelte` 檔案，透過 `index.ts` 統一匯出。但使用體驗同樣簡潔 — Svelte 的 import 語法支援多元件批次匯入。

---

## 共用工具與 Actions

### `utils/cn.ts` — Class 合併

```ts
/**
 * 合併 CSS class，過濾 falsy 值
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
```

### `actions/click-outside.ts` — 點擊外部

Svelte Actions 是 Svelte 最具特色的功能之一 — 可重用的 DOM 行為邏輯，透過 `use:action` 指令綁定到任何元素，無需額外元件包裝。

```ts
/**
 * 點擊元素外部時觸發回呼。
 *
 * 用法：<div use:clickOutside={handleClose}>
 */
export function clickOutside(node: HTMLElement, callback: () => void) {
  function handler(e: MouseEvent) {
    if (!node.contains(e.target as Node)) {
      callback()
    }
  }

  document.addEventListener('click', handler, true)

  return {
    update(newCallback: () => void) {
      callback = newCallback
    },
    destroy() {
      document.removeEventListener('click', handler, true)
    },
  }
}
```

### `actions/escape-key.ts` — Escape 關閉

```ts
/**
 * 按下 Escape 時觸發回呼。
 *
 * 用法：<div use:escapeKey={handleClose}>
 */
export function escapeKey(node: HTMLElement, callback: () => void) {
  function handler(e: KeyboardEvent) {
    if (e.key === 'Escape') callback()
  }

  document.addEventListener('keydown', handler)

  return {
    update(newCallback: () => void) {
      callback = newCallback
    },
    destroy() {
      document.removeEventListener('keydown', handler)
    },
  }
}
```

> **Action vs Hook/Composable：** Svelte Action 直接綁定在 DOM 節點上，`destroy()` 自動在節點移除時觸發，不需要手動管理生命週期。比 React 的 `useEffect` + `useRef` 或 Vue 的 `onMounted` + `onBeforeUnmount` 更精簡。

---

## 元件模式對照與實作範例

### 模式一：Simple（純包裝）

**Astro 原始碼（Label.astro）：**

```astro
---
interface Props {
    class?: string;
    [key: string]: any;
}
const { class: className, ...rest } = Astro.props;
---
<label class:list={[`${TOP_CLASS}-label`, className]} {...rest}>
    <slot />
</label>
```

**Svelte 對應（`Label.svelte`）：**

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLLabelAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn'

  interface Props extends HTMLLabelAttributes {
    class?: string
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()
</script>

<label class={cn('cu-label', className)} {...rest}>
  {@render children?.()}
</label>
```

**使用方式：**

```svelte
<Label for="email">Email</Label>
<Label for="name" class="text-lg">Name</Label>
```

> Svelte 5 使用 `$props()` 取代舊版 `export let`。`Snippet` 取代舊版 `<slot />`，透過 `{@render children?.()}` 渲染子內容。`HTMLLabelAttributes` 提供原生 `<label>` 的所有屬性型別，`...rest` 自動透傳。

---

### 模式二：Variant / Size Props

**Svelte 對應（`Button.svelte`）：**

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn'

  type Variant = 'default' | 'destructive' | 'outline' | 'secondary'
               | 'ghost' | 'link' | 'success' | 'warning' | 'info'
  type Size = 'default' | 'xs' | 'sm' | 'lg' | 'xl' | 'icon'

  interface Props extends HTMLButtonAttributes {
    variant?: Variant
    size?: Size
    class?: string
    children?: Snippet
  }

  let {
    variant = 'default',
    size = 'default',
    class: className,
    children,
    ...rest
  }: Props = $props()

  let classes = $derived(cn(
    'cu-button',
    `cu-button-${variant}`,
    size === 'default' ? 'cu-button-md' : `cu-button-${size}`,
    className,
  ))
</script>

<button class={classes} {...rest}>
  {@render children?.()}
</button>
```

**使用方式：**

```svelte
<Button>Submit</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button variant="destructive" size="lg" onclick={handleDelete}>Delete</Button>

<!-- 額外 Tailwind utility -->
<Button variant="ghost" class="w-full">Full Width</Button>
```

> Svelte 5 的 `$derived` 是編譯時反應式推導，等效於 Vue 的 `computed` 或 React 的 `useMemo`，但**完全不需要依賴陣列** — 編譯器自動追蹤。

---

### 模式三：State Props（布林狀態）

**Svelte 對應（`NavItem.svelte`）：**

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAnchorAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn'

  interface Props extends HTMLAnchorAttributes {
    active?: boolean
    class?: string
    children?: Snippet
  }

  let {
    active = false,
    class: className,
    children,
    ...rest
  }: Props = $props()

  let classes = $derived(cn(
    'cu-nav-item',
    active && 'cu-nav-item-active',
    className,
  ))
</script>

<a class={classes} {...rest}>
  {@render children?.()}
</a>
```

**使用方式（搭配 SvelteKit）：**

```svelte
<script lang="ts">
  import { page } from '$app/state'
</script>

<Nav>
  {#each menu as item}
    <NavItem
      href={item.path}
      active={page.url.pathname === item.path}
    >
      {item.label}
    </NavItem>
  {/each}
</Nav>
```

> SvelteKit 的 `$app/state` 提供當前路由資訊，與 `active` prop 搭配即可實現導航高亮。

---

### 模式四：結構化子元件

**Svelte 對應（`Card.svelte`）：**

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    class?: string
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()
</script>

<div class={cn('cu-card', className)} {...rest}>
  {@render children?.()}
</div>
```

**Svelte 對應（`CardHeader.svelte`）：**

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    class?: string
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()
</script>

<div class={cn('cu-card-header', className)} {...rest}>
  {@render children?.()}
</div>
```

**Svelte 對應（`CardTitle.svelte`）：**

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn'

  interface Props extends HTMLAttributes<HTMLHeadingElement> {
    class?: string
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()
</script>

<h3 class={cn('cu-card-title', className)} {...rest}>
  {@render children?.()}
</h3>
```

其餘子元件（`CardDescription`、`CardContent`、`CardFooter`）同理。

**使用方式：**

```svelte
<script lang="ts">
  import {
    Card, CardHeader, CardTitle, CardDescription,
    CardContent, CardFooter, Button, Label, Input, FormGroup,
  } from 'cubby-ui-svelte'
</script>

<Card>
  <CardHeader>
    <CardTitle>專案設定</CardTitle>
    <CardDescription>管理您的專案配置</CardDescription>
  </CardHeader>
  <CardContent>
    <FormGroup>
      <Label for="name">專案名稱</Label>
      <Input id="name" bind:value={name} placeholder="My Project" />
    </FormGroup>
  </CardContent>
  <CardFooter class="justify-end">
    <Button variant="outline" onclick={cancel}>取消</Button>
    <Button onclick={save}>儲存</Button>
  </CardFooter>
</Card>
```

---

### 模式五：表單元件（`bind:value` / `bind:checked`）

Svelte 的 `bind:` 語法是語言內建的雙向綁定，搭配 `$bindable()` 即可讓自訂元件支援。

**Svelte 對應（`Input.svelte`）：**

```svelte
<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn'

  interface Props extends HTMLInputAttributes {
    class?: string
    value?: string
  }

  let { class: className, value = $bindable(''), ...rest }: Props = $props()
</script>

<input class={cn('cu-input', className)} bind:value {...rest} />
```

**Svelte 對應（`Checkbox.svelte`）：**

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLInputAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn'

  interface Props extends Omit<HTMLInputAttributes, 'type'> {
    label?: string
    checked?: boolean
    class?: string
    children?: Snippet
  }

  let {
    label,
    checked = $bindable(false),
    class: className,
    children,
    ...rest
  }: Props = $props()
</script>

<label class={cn('cu-checkbox-wrapper', className)}>
  <input type="checkbox" class="cu-checkbox" bind:checked {...rest} />
  {#if label}
    <span>{label}</span>
  {:else}
    {@render children?.()}
  {/if}
</label>
```

**Svelte 對應（`Toggle.svelte`）：**

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLInputAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn'

  interface Props extends Omit<HTMLInputAttributes, 'type' | 'size'> {
    size?: 'default' | 'sm' | 'lg'
    label?: string
    checked?: boolean
    class?: string
    children?: Snippet
  }

  let {
    size = 'default',
    label,
    checked = $bindable(false),
    class: className,
    children,
    ...rest
  }: Props = $props()

  let toggleClass = $derived(
    size === 'default' ? 'cu-toggle' : `cu-toggle cu-toggle-${size}`
  )
</script>

<label class={cn('cu-toggle-wrapper', className)}>
  <input type="checkbox" class="cu-toggle-input" bind:checked {...rest} />
  <span class={toggleClass}>
    <span class="cu-toggle-thumb"></span>
  </span>
  {#if label}
    <span>{label}</span>
  {:else}
    {@render children?.()}
  {/if}
</label>
```

**Svelte 對應（`Select.svelte`）：**

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLSelectAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn'

  interface Props extends HTMLSelectAttributes {
    class?: string
    value?: string
    children?: Snippet
  }

  let { class: className, value = $bindable(''), children, ...rest }: Props = $props()
</script>

<div class="cu-select-wrapper">
  <select class={cn('cu-select', className)} bind:value {...rest}>
    {@render children?.()}
  </select>
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
       viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
       class="cu-select-icon">
    <path d="m6 9 6 6 6-6"></path>
  </svg>
</div>
```

**Svelte 對應（`Textarea.svelte`）：**

```svelte
<script lang="ts">
  import type { HTMLTextareaAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn'

  interface Props extends HTMLTextareaAttributes {
    class?: string
    value?: string
  }

  let { class: className, value = $bindable(''), ...rest }: Props = $props()
</script>

<textarea class={cn('cu-textarea', className)} bind:value {...rest}></textarea>
```

**使用方式：**

```svelte
<script lang="ts">
  let name = $state('')
  let agree = $state(false)
  let darkMode = $state(false)
  let country = $state('')
</script>

<Input bind:value={name} placeholder="名稱" />

<Checkbox bind:checked={agree} label="我同意服務條款" />

<Toggle bind:checked={darkMode} label="暗色模式" />

<Select bind:value={country}>
  <option value="">請選擇國家</option>
  <option value="tw">台灣</option>
  <option value="jp">日本</option>
</Select>

<Textarea bind:value={bio} placeholder="自我介紹..." />
```

> `$bindable()` 是 Svelte 5 的核心特性。宣告 prop 為 `$bindable` 後，外部可用 `bind:value` 雙向綁定，也可用單向 `value={x}` 傳入 — 同時支援受控與非受控模式，**零額外代碼**。

---

### 模式六：Dialog（`bind:open` + 原生 `<dialog>`）

**Svelte 對應（`Dialog.svelte`）：**

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLDialogAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn'
  import { setContext } from 'svelte'

  interface Props extends Omit<HTMLDialogAttributes, 'open'> {
    open?: boolean
    class?: string
    children?: Snippet
  }

  let {
    open = $bindable(false),
    class: className,
    children,
    ...rest
  }: Props = $props()

  let dialogEl: HTMLDialogElement

  // 同步 open 狀態到原生 <dialog>
  $effect(() => {
    if (!dialogEl) return
    if (open) {
      if (!dialogEl.open) dialogEl.showModal()
    } else {
      if (dialogEl.open) dialogEl.close()
    }
  })

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === dialogEl) open = false
  }

  function handleClose() {
    open = false
  }

  // 透過 Context 讓子元件（DialogClose）可存取 close 行為
  setContext('cu-dialog', {
    close: () => { open = false },
  })
</script>

<dialog
  bind:this={dialogEl}
  class={cn('cu-dialog', className)}
  onclick={handleBackdropClick}
  onclose={handleClose}
  {...rest}
>
  {@render children?.()}
</dialog>
```

**Svelte 對應（`DialogClose.svelte`）：**

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { getContext } from 'svelte'
  import { cn } from '../utils/cn'

  interface Props extends HTMLButtonAttributes {
    class?: string
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()

  const { close } = getContext<{ close: () => void }>('cu-dialog')
</script>

<button
  type="button"
  class={cn('cu-dialog-close', className)}
  onclick={close}
  aria-label="Close"
  {...rest}
>
  {#if children}
    {@render children()}
  {:else}
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
         viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 6 6 18"></path>
      <path d="m6 6 12 12"></path>
    </svg>
  {/if}
</button>
```

**Svelte 對應（`DialogHeader.svelte`、`DialogTitle.svelte` 等）：**

```svelte
<!-- DialogHeader.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    class?: string
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()
</script>

<div class={cn('cu-dialog-header', className)} {...rest}>
  {@render children?.()}
</div>
```

```svelte
<!-- DialogTitle.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn'

  interface Props extends HTMLAttributes<HTMLHeadingElement> {
    class?: string
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()
</script>

<h2 class={cn('cu-dialog-title', className)} {...rest}>
  {@render children?.()}
</h2>
```

**使用方式：**

```svelte
<script lang="ts">
  let showDialog = $state(false)
</script>

<Button onclick={() => showDialog = true}>開啟對話框</Button>

<Dialog bind:open={showDialog}>
  <DialogClose />
  <DialogHeader>
    <DialogTitle>確認操作</DialogTitle>
    <DialogDescription>此操作無法復原，確定要繼續嗎？</DialogDescription>
  </DialogHeader>
  <DialogFooter>
    <Button variant="outline" onclick={() => showDialog = false}>取消</Button>
    <Button variant="destructive" onclick={handleDelete}>確認刪除</Button>
  </DialogFooter>
</Dialog>
```

> Svelte 的 `bind:open` 是雙向綁定 — 當使用者點擊 backdrop 或按 Escape 時，`open` 自動變為 `false`，外部的 `showDialog` 同步更新。不需要像 React 那樣手動寫 `onOpenChange` callback。

---

### 模式七：Alert Dialog（無 backdrop 關閉、攔截 Escape）

**Svelte 對應（`AlertDialog.svelte`）：**

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLDialogAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn'
  import { setContext } from 'svelte'

  interface Props extends Omit<HTMLDialogAttributes, 'open'> {
    open?: boolean
    class?: string
    children?: Snippet
  }

  let {
    open = $bindable(false),
    class: className,
    children,
    ...rest
  }: Props = $props()

  let dialogEl: HTMLDialogElement

  $effect(() => {
    if (!dialogEl) return
    open ? !dialogEl.open && dialogEl.showModal() : dialogEl.open && dialogEl.close()
  })

  // 攔截 Escape — Alert Dialog 不允許 Escape 或 backdrop 關閉
  function handleCancel(e: Event) {
    e.preventDefault()
  }

  function handleClose() {
    open = false
  }

  setContext('cu-alert-dialog', {
    close: () => { open = false },
  })
</script>

<dialog
  bind:this={dialogEl}
  class={cn('cu-alert-dialog', className)}
  oncancel={handleCancel}
  onclose={handleClose}
  {...rest}
>
  {@render children?.()}
</dialog>
```

**使用方式：**

```svelte
<AlertDialog bind:open={showConfirm}>
  <AlertDialogHeader>
    <AlertDialogTitle>確定要刪除嗎？</AlertDialogTitle>
    <AlertDialogDescription>此操作無法復原。</AlertDialogDescription>
  </AlertDialogHeader>
  <AlertDialogFooter>
    <Button variant="outline" onclick={() => showConfirm = false}>取消</Button>
    <Button variant="destructive" onclick={confirmDelete}>確認</Button>
  </AlertDialogFooter>
</AlertDialog>
```

---

### 模式八：Drawer（方向 prop）

**Svelte 對應（`Drawer.svelte`）：**

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLDialogAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn'
  import { setContext } from 'svelte'

  interface Props extends Omit<HTMLDialogAttributes, 'open'> {
    open?: boolean
    side?: 'right' | 'left' | 'top' | 'bottom'
    class?: string
    children?: Snippet
  }

  let {
    open = $bindable(false),
    side = 'right',
    class: className,
    children,
    ...rest
  }: Props = $props()

  let dialogEl: HTMLDialogElement

  $effect(() => {
    if (!dialogEl) return
    open ? !dialogEl.open && dialogEl.showModal() : dialogEl.open && dialogEl.close()
  })

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === dialogEl) open = false
  }

  function handleClose() {
    open = false
  }

  setContext('cu-drawer', {
    close: () => { open = false },
  })
</script>

<dialog
  bind:this={dialogEl}
  class={cn('cu-drawer', `cu-drawer-${side}`, className)}
  onclick={handleBackdropClick}
  onclose={handleClose}
  {...rest}
>
  {@render children?.()}
</dialog>
```

**使用方式：**

```svelte
<Drawer bind:open={showDrawer} side="right">
  <DrawerClose />
  <DrawerHeader>
    <DrawerTitle>設定</DrawerTitle>
  </DrawerHeader>
  <DrawerContent>...</DrawerContent>
  <DrawerFooter>
    <Button onclick={() => showDrawer = false}>關閉</Button>
  </DrawerFooter>
</Drawer>
```

---

### 模式九：Dropdown（Action 組合）

**Svelte 對應（`Dropdown.svelte`）：**

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn'
  import { setContext } from 'svelte'
  import { clickOutside } from '../actions/click-outside'
  import { escapeKey } from '../actions/escape-key'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    class?: string
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()
  let isOpen = $state(false)

  function close() {
    isOpen = false
  }

  function toggle(e: MouseEvent) {
    e.stopPropagation()
    isOpen = !isOpen
  }

  setContext('cu-dropdown', {
    get isOpen() { return isOpen },
    toggle,
    close,
  })
</script>

<div
  class={cn('cu-dropdown', className)}
  use:clickOutside={close}
  use:escapeKey={close}
  {...rest}
>
  {@render children?.()}
</div>
```

**Svelte 對應（`DropdownContent.svelte`）：**

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { getContext } from 'svelte'
  import { cn } from '../utils/cn'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    class?: string
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()
  const ctx = getContext<{ isOpen: boolean }>('cu-dropdown')
</script>

{#if ctx.isOpen}
  <div class={cn('cu-dropdown-content', className)} {...rest}>
    {@render children?.()}
  </div>
{/if}
```

**Svelte 對應（`DropdownItem.svelte`）：**

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { getContext } from 'svelte'
  import { cn } from '../utils/cn'

  interface Props extends HTMLButtonAttributes {
    class?: string
    children?: Snippet
  }

  let { class: className, children, onclick, ...rest }: Props = $props()
  const { close } = getContext<{ close: () => void }>('cu-dropdown')

  function handleClick(e: MouseEvent) {
    if (typeof onclick === 'function') onclick(e as any)
    close()
  }
</script>

<button
  type="button"
  class={cn('cu-dropdown-item', className)}
  onclick={handleClick}
  {...rest}
>
  {@render children?.()}
</button>
```

**使用方式：**

```svelte
<script lang="ts">
  import {
    Dropdown, DropdownContent, DropdownItem,
    DropdownLabel, DropdownSeparator, Button,
  } from 'cubby-ui-svelte'
</script>

<Dropdown>
  <Button variant="outline" onclick={(e) => { /* toggle handled by context */ }}>
    選單
  </Button>
  <DropdownContent>
    <DropdownLabel>我的帳號</DropdownLabel>
    <DropdownSeparator />
    <DropdownItem onclick={() => goto('/profile')}>個人資料</DropdownItem>
    <DropdownItem onclick={() => goto('/settings')}>設定</DropdownItem>
    <DropdownSeparator />
    <DropdownItem onclick={logout}>登出</DropdownItem>
  </DropdownContent>
</Dropdown>
```

> 注意：Dropdown 的 trigger 需要從 context 取得 `toggle`。可額外提供一個 `DropdownTrigger.svelte` 便利元件，或讓使用者用 `getContext` 手動取得。下方提供 `DropdownTrigger` 簡化使用：

**`DropdownTrigger.svelte`：**

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { getContext } from 'svelte'

  interface Props extends HTMLButtonAttributes {
    children?: Snippet
  }

  let { children, ...rest }: Props = $props()
  const { toggle } = getContext<{ toggle: (e: MouseEvent) => void }>('cu-dropdown')
</script>

<button type="button" onclick={toggle} {...rest}>
  {@render children?.()}
</button>
```

```svelte
<!-- 更簡潔的用法 -->
<Dropdown>
  <DropdownTrigger class="cu-button cu-button-outline cu-button-md">
    選單
  </DropdownTrigger>
  <DropdownContent>
    <DropdownItem onclick={() => goto('/profile')}>個人資料</DropdownItem>
  </DropdownContent>
</Dropdown>
```

---

### 模式十：Tabs（Context + `$bindable`）

**Svelte 對應（`Tabs.svelte`）：**

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn'
  import { setContext } from 'svelte'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** 初始值或受控值 */
    value?: string
    class?: string
    children?: Snippet
  }

  let {
    value = $bindable(''),
    class: className,
    children,
    ...rest
  }: Props = $props()

  setContext('cu-tabs', {
    get activeTab() { return value },
    select(v: string) { value = v },
  })
</script>

<div class={cn('cu-tabs', className)} {...rest}>
  {@render children?.()}
</div>
```

**Svelte 對應（`TabsTrigger.svelte`）：**

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { getContext } from 'svelte'
  import { cn } from '../utils/cn'

  interface Props extends HTMLButtonAttributes {
    value: string
    class?: string
    children?: Snippet
  }

  let { value, class: className, children, ...rest }: Props = $props()
  const ctx = getContext<{ activeTab: string; select: (v: string) => void }>('cu-tabs')

  let isActive = $derived(ctx.activeTab === value)
</script>

<button
  type="button"
  class={cn('cu-tabs-trigger', isActive && 'cu-tabs-trigger-active', className)}
  onclick={() => ctx.select(value)}
  {...rest}
>
  {@render children?.()}
</button>
```

**Svelte 對應（`TabsContent.svelte`）：**

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { getContext } from 'svelte'
  import { cn } from '../utils/cn'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    value: string
    class?: string
    children?: Snippet
  }

  let { value, class: className, children, ...rest }: Props = $props()
  const ctx = getContext<{ activeTab: string }>('cu-tabs')

  let isActive = $derived(ctx.activeTab === value)
</script>

{#if isActive}
  <div class={cn('cu-tabs-content', className)} {...rest}>
    {@render children?.()}
  </div>
{/if}
```

**使用方式：**

```svelte
<script lang="ts">
  let tab = $state('account')
</script>

<!-- 非受控 -->
<Tabs value="account">
  <TabsList>
    <TabsTrigger value="account">帳號</TabsTrigger>
    <TabsTrigger value="password">密碼</TabsTrigger>
    <TabsTrigger value="notifications">通知</TabsTrigger>
  </TabsList>
  <TabsContent value="account">帳號設定...</TabsContent>
  <TabsContent value="password">密碼設定...</TabsContent>
  <TabsContent value="notifications">通知設定...</TabsContent>
</Tabs>

<!-- 受控（外部追蹤） -->
<Tabs bind:value={tab}>
  ...
</Tabs>
<p>目前分頁：{tab}</p>
```

---

### 模式十一：Popover

結構與 Dropdown 近似，同樣使用 Context + Actions。

**使用方式：**

```svelte
<Popover>
  <PopoverTrigger class="cu-button cu-button-outline cu-button-md">
    開啟 Popover
  </PopoverTrigger>
  <PopoverContent>
    <p>這是一段彈出內容。</p>
  </PopoverContent>
</Popover>
```

---

### 模式十二：Toast（Rune-based Store）

Svelte 5 的 `$state` 可在模組層級（`.svelte.ts`）使用，天然適合全域狀態。

**`toast.svelte.ts`（Rune-based Store）：**

```ts
interface ToastItem {
  id: number
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info'
  duration?: number
}

let toasts = $state<ToastItem[]>([])
let nextId = 0

export function getToasts() {
  return toasts
}

export function toast(options: Omit<ToastItem, 'id'>) {
  const id = nextId++
  const item: ToastItem = { id, duration: 5000, variant: 'default', ...options }
  toasts.push(item)

  setTimeout(() => dismiss(id), item.duration)
  return id
}

export function dismiss(id: number) {
  toasts = toasts.filter(t => t.id !== id)
}
```

**`Toaster.svelte`：**

```svelte
<script lang="ts">
  import { getToasts, dismiss } from './toast.svelte'
  import { cn } from '../utils/cn'

  interface Props {
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  }

  let { position = 'bottom-right' }: Props = $props()

  let toasts = $derived(getToasts())
</script>

<div class={cn('cu-toast-container', `cu-toast-container-${position}`)}>
  {#each toasts as t (t.id)}
    <div class={cn('cu-toast', `cu-toast-${t.variant}`)}>
      <div>
        {#if t.title}
          <div class="cu-toast-title">{t.title}</div>
        {/if}
        {#if t.description}
          <div class="cu-toast-description">{t.description}</div>
        {/if}
      </div>
      <button class="cu-toast-close" onclick={() => dismiss(t.id)} aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
             viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18"></path>
          <path d="m6 6 12 12"></path>
        </svg>
      </button>
    </div>
  {/each}
</div>
```

**使用方式：**

```svelte
<!-- +layout.svelte（根層級掛載一次） -->
<script lang="ts">
  import { Toaster } from 'cubby-ui-svelte'
</script>

<slot />
<Toaster position="bottom-right" />

<!-- 任何子元件中 -->
<script lang="ts">
  import { toast } from 'cubby-ui-svelte'
  import { Button } from 'cubby-ui-svelte'

  function handleSave() {
    // ...
    toast({ title: '儲存成功', variant: 'success' })
  }
</script>

<Button onclick={handleSave}>儲存</Button>
```

> Svelte 5 的 `$state` 在 `.svelte.ts` 模組中可直接使用，不需要 React 的 `createContext` + `Provider` 包裝，也不需要 Vue 的 `provide/inject`。匯入 `toast()` 函式即可在任何地方呼叫。

---

### 模式十三：Accordion / Collapsible（原生 `<details>`）

**Svelte 對應（`AccordionItem.svelte`）：**

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte'
  import { cn } from '../utils/cn'

  interface Props {
    open?: boolean
    class?: string
    children?: Snippet
    [key: string]: any
  }

  let { open = false, class: className, children, ...rest }: Props = $props()
</script>

<details class={cn('cu-accordion-item', className)} {open} {...rest}>
  {@render children?.()}
</details>
```

**Svelte 對應（`AccordionTrigger.svelte`）：**

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte'
  import { cn } from '../utils/cn'

  interface Props {
    class?: string
    children?: Snippet
    [key: string]: any
  }

  let { class: className, children, ...rest }: Props = $props()
</script>

<summary class={cn('cu-accordion-trigger', className)} {...rest}>
  {@render children?.()}
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
       viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="m6 9 6 6 6-6"></path>
  </svg>
</summary>
```

**使用方式：**

```svelte
<Accordion>
  <AccordionItem open>
    <AccordionTrigger>什麼是 Cubby UI？</AccordionTrigger>
    <AccordionContent>一個框架無關的 UI 元件庫。</AccordionContent>
  </AccordionItem>
  <AccordionItem>
    <AccordionTrigger>支援哪些框架？</AccordionTrigger>
    <AccordionContent>任何使用 HTML + CSS 的環境。</AccordionContent>
  </AccordionItem>
</Accordion>
```

---

### 模式十四：HoverCard / Tooltip（純 CSS）

**Svelte 對應（`Tooltip.svelte`）：**

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn'

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    content: string
    position?: 'top' | 'bottom' | 'left' | 'right'
    class?: string
    children?: Snippet
  }

  let {
    content,
    position = 'top',
    class: className,
    children,
    ...rest
  }: Props = $props()

  let classes = $derived(cn(
    'cu-tooltip',
    position !== 'top' && `cu-tooltip-${position}`,
    className,
  ))
</script>

<span class={classes} data-tooltip={content} {...rest}>
  {@render children?.()}
</span>
```

**使用方式：**

```svelte
<Tooltip content="這是提示文字">
  <Button variant="ghost" size="icon"><InfoIcon /></Button>
</Tooltip>
```

---

### 模式十五：Typography（動態標籤）

Svelte 透過 `<svelte:element>` 實現動態標籤。

**Svelte 對應（`Heading.svelte`）：**

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte'
  import { cn } from '../utils/cn'

  interface Props {
    level?: 1 | 2 | 3 | 4
    class?: string
    children?: Snippet
    [key: string]: any
  }

  let { level = 1, class: className, children, ...rest }: Props = $props()
</script>

<svelte:element this={`h${level}`} class={cn(`cu-h${level}`, className)} {...rest}>
  {@render children?.()}
</svelte:element>
```

**Svelte 對應（`Paragraph.svelte`）：**

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte'
  import { cn } from '../utils/cn'

  interface Props {
    variant?: 'default' | 'lead'
    class?: string
    children?: Snippet
    [key: string]: any
  }

  let { variant = 'default', class: className, children, ...rest }: Props = $props()
</script>

<p class={cn('cu-paragraph', variant === 'lead' && 'cu-paragraph-lead', className)} {...rest}>
  {@render children?.()}
</p>
```

**使用方式：**

```svelte
<Heading level={1}>頁面標題</Heading>
<Heading level={3} class="text-primary">副標題</Heading>
<Paragraph variant="lead">這是一段引導文字。</Paragraph>
```

---

## 總入口 `index.ts`

```ts
// --- Components ---
export { default as Button } from './lib/components/Button.svelte'
export { default as Badge } from './lib/components/Badge.svelte'
export { default as Separator } from './lib/components/Separator.svelte'
export { default as ButtonGroup } from './lib/components/ButtonGroup.svelte'

export { default as Card } from './lib/components/Card.svelte'
export { default as CardHeader } from './lib/components/CardHeader.svelte'
export { default as CardTitle } from './lib/components/CardTitle.svelte'
export { default as CardDescription } from './lib/components/CardDescription.svelte'
export { default as CardContent } from './lib/components/CardContent.svelte'
export { default as CardFooter } from './lib/components/CardFooter.svelte'

export { default as Dialog } from './lib/components/Dialog.svelte'
export { default as DialogHeader } from './lib/components/DialogHeader.svelte'
export { default as DialogTitle } from './lib/components/DialogTitle.svelte'
export { default as DialogDescription } from './lib/components/DialogDescription.svelte'
export { default as DialogFooter } from './lib/components/DialogFooter.svelte'
export { default as DialogClose } from './lib/components/DialogClose.svelte'

export { default as AlertDialog } from './lib/components/AlertDialog.svelte'
export { default as AlertDialogHeader } from './lib/components/AlertDialogHeader.svelte'
export { default as AlertDialogTitle } from './lib/components/AlertDialogTitle.svelte'
export { default as AlertDialogDescription } from './lib/components/AlertDialogDescription.svelte'
export { default as AlertDialogFooter } from './lib/components/AlertDialogFooter.svelte'

export { default as Drawer } from './lib/components/Drawer.svelte'
export { default as DrawerHeader } from './lib/components/DrawerHeader.svelte'
export { default as DrawerTitle } from './lib/components/DrawerTitle.svelte'
export { default as DrawerDescription } from './lib/components/DrawerDescription.svelte'
export { default as DrawerContent } from './lib/components/DrawerContent.svelte'
export { default as DrawerFooter } from './lib/components/DrawerFooter.svelte'
export { default as DrawerClose } from './lib/components/DrawerClose.svelte'

export { default as Dropdown } from './lib/components/Dropdown.svelte'
export { default as DropdownTrigger } from './lib/components/DropdownTrigger.svelte'
export { default as DropdownContent } from './lib/components/DropdownContent.svelte'
export { default as DropdownItem } from './lib/components/DropdownItem.svelte'
export { default as DropdownLabel } from './lib/components/DropdownLabel.svelte'
export { default as DropdownSeparator } from './lib/components/DropdownSeparator.svelte'

export { default as Tabs } from './lib/components/Tabs.svelte'
export { default as TabsList } from './lib/components/TabsList.svelte'
export { default as TabsTrigger } from './lib/components/TabsTrigger.svelte'
export { default as TabsContent } from './lib/components/TabsContent.svelte'

export { default as Popover } from './lib/components/Popover.svelte'
export { default as PopoverTrigger } from './lib/components/PopoverTrigger.svelte'
export { default as PopoverContent } from './lib/components/PopoverContent.svelte'

export { default as Accordion } from './lib/components/Accordion.svelte'
export { default as AccordionItem } from './lib/components/AccordionItem.svelte'
export { default as AccordionTrigger } from './lib/components/AccordionTrigger.svelte'
export { default as AccordionContent } from './lib/components/AccordionContent.svelte'

export { default as Collapsible } from './lib/components/Collapsible.svelte'
export { default as CollapsibleTrigger } from './lib/components/CollapsibleTrigger.svelte'
export { default as CollapsibleContent } from './lib/components/CollapsibleContent.svelte'

export { default as Avatar } from './lib/components/Avatar.svelte'
export { default as AvatarImage } from './lib/components/AvatarImage.svelte'
export { default as AvatarFallback } from './lib/components/AvatarFallback.svelte'

export { default as Breadcrumb } from './lib/components/Breadcrumb.svelte'
export { default as BreadcrumbItem } from './lib/components/BreadcrumbItem.svelte'
export { default as BreadcrumbLink } from './lib/components/BreadcrumbLink.svelte'
export { default as BreadcrumbSeparator } from './lib/components/BreadcrumbSeparator.svelte'
export { default as BreadcrumbCurrent } from './lib/components/BreadcrumbCurrent.svelte'

export { default as EmptyState } from './lib/components/EmptyState.svelte'
export { default as EmptyStateIcon } from './lib/components/EmptyStateIcon.svelte'
export { default as EmptyStateTitle } from './lib/components/EmptyStateTitle.svelte'
export { default as EmptyStateDescription } from './lib/components/EmptyStateDescription.svelte'
export { default as EmptyStateAction } from './lib/components/EmptyStateAction.svelte'

export { default as HoverCard } from './lib/components/HoverCard.svelte'
export { default as HoverCardContent } from './lib/components/HoverCardContent.svelte'

export { default as Menubar } from './lib/components/Menubar.svelte'
export { default as MenubarMenu } from './lib/components/MenubarMenu.svelte'
export { default as MenubarTrigger } from './lib/components/MenubarTrigger.svelte'
export { default as MenubarContent } from './lib/components/MenubarContent.svelte'
export { default as MenubarItem } from './lib/components/MenubarItem.svelte'
export { default as MenubarSeparator } from './lib/components/MenubarSeparator.svelte'
export { default as MenubarLabel } from './lib/components/MenubarLabel.svelte'
export { default as MenubarShortcut } from './lib/components/MenubarShortcut.svelte'

export { default as Pagination } from './lib/components/Pagination.svelte'
export { default as PaginationItem } from './lib/components/PaginationItem.svelte'
export { default as PaginationPrev } from './lib/components/PaginationPrev.svelte'
export { default as PaginationNext } from './lib/components/PaginationNext.svelte'
export { default as PaginationEllipsis } from './lib/components/PaginationEllipsis.svelte'

export { default as Stat } from './lib/components/Stat.svelte'
export { default as StatHeader } from './lib/components/StatHeader.svelte'
export { default as StatLabel } from './lib/components/StatLabel.svelte'
export { default as StatValue } from './lib/components/StatValue.svelte'
export { default as StatDescription } from './lib/components/StatDescription.svelte'
export { default as StatTrend } from './lib/components/StatTrend.svelte'

export { default as Header } from './lib/components/Header.svelte'
export { default as HeaderInner } from './lib/components/HeaderInner.svelte'
export { default as HeaderBrand } from './lib/components/HeaderBrand.svelte'
export { default as HeaderNav } from './lib/components/HeaderNav.svelte'
export { default as HeaderActions } from './lib/components/HeaderActions.svelte'

export { default as Sidebar } from './lib/components/Sidebar.svelte'
export { default as SidebarHeader } from './lib/components/SidebarHeader.svelte'
export { default as SidebarContent } from './lib/components/SidebarContent.svelte'
export { default as SidebarFooter } from './lib/components/SidebarFooter.svelte'
export { default as SidebarSection } from './lib/components/SidebarSection.svelte'
export { default as SidebarSectionTitle } from './lib/components/SidebarSectionTitle.svelte'
export { default as SidebarGroup } from './lib/components/SidebarGroup.svelte'
export { default as SidebarGroupTitle } from './lib/components/SidebarGroupTitle.svelte'
export { default as SidebarItem } from './lib/components/SidebarItem.svelte'
export { default as SidebarSeparator } from './lib/components/SidebarSeparator.svelte'

export { default as Nav } from './lib/components/Nav.svelte'
export { default as NavItem } from './lib/components/NavItem.svelte'

export { default as Container } from './lib/components/Container.svelte'
export { default as Label } from './lib/components/Label.svelte'
export { default as Input } from './lib/components/Input.svelte'
export { default as Textarea } from './lib/components/Textarea.svelte'
export { default as Select } from './lib/components/Select.svelte'
export { default as Checkbox } from './lib/components/Checkbox.svelte'
export { default as Radio } from './lib/components/Radio.svelte'
export { default as Toggle } from './lib/components/Toggle.svelte'
export { default as Range } from './lib/components/Range.svelte'
export { default as SearchInput } from './lib/components/SearchInput.svelte'
export { default as FileInput } from './lib/components/FileInput.svelte'
export { default as FormGroup } from './lib/components/FormGroup.svelte'
export { default as FormDescription } from './lib/components/FormDescription.svelte'
export { default as FormError } from './lib/components/FormError.svelte'
export { default as Progress } from './lib/components/Progress.svelte'
export { default as Skeleton } from './lib/components/Skeleton.svelte'
export { default as Tooltip } from './lib/components/Tooltip.svelte'

export { default as Heading } from './lib/components/Heading.svelte'
export { default as Paragraph } from './lib/components/Paragraph.svelte'
export { default as Blockquote } from './lib/components/Blockquote.svelte'
export { default as Link } from './lib/components/Link.svelte'
export { default as List } from './lib/components/List.svelte'
export { default as Hr } from './lib/components/Hr.svelte'

// --- Toast ---
export { default as Toaster } from './lib/components/Toaster.svelte'
export { toast, dismiss } from './lib/components/toast.svelte'

// --- Actions ---
export { clickOutside } from './lib/actions/click-outside'
export { escapeKey } from './lib/actions/escape-key'

// --- Utils ---
export { cn } from './lib/utils/cn'
```

---

## 打包設定

Svelte 套件使用 `@sveltejs/package`（官方工具），直接將 `src/lib` 打包為可發布的 npm 套件。

### `package.json`

```json
{
  "name": "cubby-ui-svelte",
  "version": "0.1.0",
  "type": "module",
  "svelte": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "svelte": "./dist/index.js",
      "default": "./dist/index.js"
    }
  },
  "files": ["dist", "!dist/**/*.test.*"],
  "scripts": {
    "build": "svelte-kit sync && svelte-package",
    "prepublishOnly": "npm run build"
  },
  "peerDependencies": {
    "svelte": "^5.0.0"
  },
  "devDependencies": {
    "@sveltejs/kit": "^2.0.0",
    "@sveltejs/package": "^2.0.0",
    "svelte": "^5.0.0",
    "typescript": "^5.5.0",
    "vite": "^6.0.0"
  },
  "sideEffects": false
}
```

### `svelte.config.js`

```js
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
  preprocess: vitePreprocess(),
}
```

---

## 使用方式

### 按需引入（推薦）

```svelte
<script lang="ts">
  import { Button, Card, CardHeader, CardTitle, CardContent } from 'cubby-ui-svelte'
</script>

<Card>
  <CardHeader>
    <CardTitle>Hello</CardTitle>
  </CardHeader>
  <CardContent>
    <Button onclick={doSomething}>Click</Button>
  </CardContent>
</Card>
```

### CSS 引入

Svelte 元件不打包 CSS，使用者需自行引入 Cubby UI 的 CSS：

**SvelteKit：**

```css
/* src/app.css */
@import "tailwindcss";
@import "cubby-ui/css/components.css";

@theme {
  --color-primary: hsl(221 83% 53%);
  --color-primary-foreground: hsl(0 0% 100%);
  /* ... Cubby UI design tokens ... */
}
```

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import '../app.css'
  import { Toaster } from 'cubby-ui-svelte'
</script>

<slot />
<Toaster />
```

---

## Svelte 獨有特性

### 1. Svelte Actions — 可重用 DOM 行為

Actions 是 Svelte 獨有的功能，讓行為邏輯可以脫離元件獨立使用：

```svelte
<!-- 直接在任何元素上使用 -->
<div use:clickOutside={handleClose}>
  ...
</div>

<input use:escapeKey={clearSearch} />
```

不需要像 React 那樣用 `useRef` + `useEffect`，也不需要像 Vue 那樣用 `onMounted` + `onBeforeUnmount`。

### 2. `$bindable()` — 語言級雙向綁定

```svelte
<!-- 雙向綁定 -->
<Input bind:value={name} />
<Dialog bind:open={showDialog} />
<Toggle bind:checked={darkMode} />
<Tabs bind:value={activeTab} />

<!-- 單向傳入（也完全支援） -->
<Input value={name} oninput={(e) => name = e.target.value} />
<Dialog open={showDialog} onclose={() => showDialog = false} />
```

受控與非受控模式由 `$bindable()` 一次解決，不需要 React 的 `useControllable` hook。

### 3. `$derived` — 零成本反應式推導

```svelte
let classes = $derived(cn('cu-button', `cu-button-${variant}`, className))
```

編譯器自動追蹤 `variant` 和 `className` 的變化，不需要依賴陣列（React `useMemo`）或顯式宣告（Vue `computed`）。

### 4. `.svelte.ts` — 模組級 Runes

```ts
// toast.svelte.ts — 不在元件內，但仍可使用 $state
let toasts = $state<ToastItem[]>([])
```

全域狀態不需要 Context/Provider 包裝（React）或 `provide/inject`（Vue），直接匯入即用。

### 5. 編譯時最佳化 — 最小 Runtime

Svelte 在編譯時將反應式邏輯轉為原生 JS，不需要 Virtual DOM diff。元件產出的 JS 極小，適合對 bundle size 敏感的場景。

---

## 完整元件清單

### Typography（7 個）

| Svelte 元件 | Props | HTML 元素 |
|---|---|---|
| `<Heading>` | `level` (1–4) | `<h1>`–`<h4>` |
| `<Paragraph>` | `variant` (default, lead) | `<p>` |
| `<Blockquote>` | — | `<blockquote>` |
| `<List>` | `type` (disc, decimal) | `<ul>` / `<ol>` |
| `<Link>` | — | `<a>` |
| `<Hr>` | — | `<hr>` |

### Basic（5 群組）

| Svelte 元件 | Props |
|---|---|
| `<Button>` | `variant`, `size` |
| `<ButtonGroup>` | `vertical` |
| `<Card>` + Header / Title / Description / Content / Footer | — |
| `<Separator>` | `orientation` |
| `<Badge>` | `variant` |

### Forms（13 個，全部支援 `bind:`）

| Svelte 元件 | Props | `bind:` 型別 |
|---|---|---|
| `<Label>` | — | — |
| `<Input>` | — | `bind:value` → `string` |
| `<Textarea>` | — | `bind:value` → `string` |
| `<Select>` | — | `bind:value` → `string` |
| `<Checkbox>` | `label` | `bind:checked` → `boolean` |
| `<Radio>` | `label` | `bind:group` → `string` |
| `<Toggle>` | `size`, `label` | `bind:checked` → `boolean` |
| `<SearchInput>` | — | `bind:value` → `string` |
| `<FileInput>` | — | — |
| `<Range>` | — | `bind:value` → `number` |
| `<FormGroup>` | — | — |
| `<FormDescription>` | — | — |
| `<FormError>` | — | — |

### Data Display（6 群組）

| Svelte 元件 | Props | 互動方式 |
|---|---|---|
| `<Accordion>` + Item / Trigger / Content | `open` (Item) | 原生 `<details>` |
| `<Collapsible>` + Trigger / Content | `open` | 原生 `<details>` |
| `<Avatar>` + Image / Fallback | — | 純 CSS |
| `<Badge>` | `variant` | 純 CSS |
| `<Stat>` + Header / Label / Value / Description / Trend | `trend` | 純 CSS |

### Feedback（5 群組）

| Svelte 元件 | Props |
|---|---|
| `<Alert>` + Title / Description | `variant` |
| `<Progress>` | `value` |
| `<Skeleton>` | — |
| `<EmptyState>` + Icon / Title / Description / Action | — |
| `<Toaster>` + `toast()` 函式 | `position` |

### Overlay（7 群組）

| Svelte 元件 | Props | 狀態控制 |
|---|---|---|
| `<Dialog>` + Header / Title / Description / Footer / Close | — | `bind:open` |
| `<AlertDialog>` + Header / Title / Description / Footer | — | `bind:open`（無 backdrop/Escape 關閉） |
| `<Drawer>` + Header / Title / Description / Content / Footer / Close | `side` | `bind:open` |
| `<Dropdown>` + Trigger / Content / Item / Label / Separator | — | 內部 `$state`（自動管理） |
| `<Popover>` + Trigger / Content | — | 內部 `$state`（自動管理） |
| `<HoverCard>` + Content | — | 純 CSS hover |
| `<Tooltip>` | `content`, `position` | 純 CSS hover |

### Navigation（4 群組）

| Svelte 元件 | Props |
|---|---|
| `<Breadcrumb>` + Item / Link / Separator / Current | — |
| `<Menubar>` + Menu / Trigger / Content / Item / Separator / Label / Shortcut | — |
| `<Pagination>` + Item / Prev / Next / Ellipsis | `active` (Item) |
| `<Tabs>` + List / Trigger / Content | `value` (Tabs + bind), `value` (Trigger/Content) |

### Layout（4 群組）

| Svelte 元件 | Props |
|---|---|
| `<Container>` | `size` |
| `<Header>` + Inner / Brand / Nav / Actions | — |
| `<Nav>` + Item | `vertical` (Nav), `active` (Item) |
| `<Sidebar>` + Header / Content / Footer / Section / SectionTitle / Group / GroupTitle / Item / Separator | `active` (Item) |

---

## 與其他方案的比較

| 面向 | Svelte 元件 | React 元件 | Vue 元件 | Blade 匿名元件 |
|---|---|---|---|---|
| 型別安全 | `$props()` + `interface` | `defineProps` + `forwardRef` 泛型 | `defineProps<T>()` | 無 |
| 反應式模型 | 編譯時（`$state` / `$derived`） | Runtime（`useState` / `useMemo`） | Runtime（`ref` / `computed`） | 伺服器端 |
| 雙向綁定 | `bind:value`（語言內建） | `value` + `onChange`（慣例） | `v-model`（語法糖） | 無 |
| DOM 行為復用 | Svelte Actions（`use:`） | Custom hooks（`useRef` + `useEffect`） | Composables（`onMounted`） | 無 |
| 子元件語法 | `<CardHeader>`（獨立匯入） | `Card.Header`（Compound） | `<CuCardHeader>`（獨立匯入） | `<x-cu.card.header>` |
| 全域狀態 | `.svelte.ts` 模組級 `$state` | Context + Provider | `provide/inject` | Session |
| SSR | SvelteKit | Next.js (RSC) | Nuxt | Laravel |
| Virtual DOM | 無（編譯時） | 有 | 有 | 不適用 |
| Bundle overhead | ~2-4 KB base | ~5-8 KB base | ~5-8 KB base | 0 KB |
| 適用場景 | SvelteKit / Vite | Next.js / Remix / Vite | Nuxt / Vite | Laravel 全端 |

---

## SvelteKit 整合

```
src/
├── app.css                   -- @import cubby CSS + @theme
├── routes/
│   ├── +layout.svelte        -- Toaster 掛載
│   └── dashboard/
│       └── +page.svelte      -- 使用元件
```

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import '../app.css'
  import { Toaster } from 'cubby-ui-svelte'
</script>

<slot />
<Toaster position="bottom-right" />
```

```svelte
<!-- src/routes/dashboard/+page.svelte -->
<script lang="ts">
  import {
    Card, CardHeader, CardTitle, CardContent,
    Button, Input, Label, FormGroup, toast,
  } from 'cubby-ui-svelte'

  let projectName = $state('')

  function save() {
    // ...
    toast({ title: '儲存成功', variant: 'success' })
  }
</script>

<Card>
  <CardHeader>
    <CardTitle>專案設定</CardTitle>
  </CardHeader>
  <CardContent>
    <FormGroup>
      <Label for="name">專案名稱</Label>
      <Input id="name" bind:value={projectName} placeholder="My Project" />
    </FormGroup>
    <Button onclick={save}>儲存</Button>
  </CardContent>
</Card>
```

---

## 優缺點總結

| 優點 | 缺點 |
|---|---|
| 完全複用現有 `cu-*` CSS，零重複維護 | 僅限 Svelte 5 生態系 |
| `$bindable()` 語言級雙向綁定，受控/非受控零額外代碼 | 生態系規模較 React / Vue 小 |
| Svelte Actions 極簡的 DOM 行為復用（`use:clickOutside`） | 不支援 Compound Component 語法（`Card.Header`） |
| 編譯時反應式，無 Virtual DOM，bundle 最小 | |
| `$derived` 無需依賴陣列，編譯器自動追蹤 | |
| `.svelte.ts` 模組級 Runes，全域狀態不需 Provider | |
| SvelteKit SSR 完整支援 | |
| TypeScript 完整型別推導 | |
| `$props()` 解構語法最接近原始 Astro 元件的寫法 | |
