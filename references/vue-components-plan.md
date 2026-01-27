# Cubby UI — Vue 元件層整合方案

## 背景

Cubby UI 的核心是框架無關的 CSS 類別層（`cu-*` class）。Vue 元件層作為第三層封裝，提供：

- **TypeScript Props 型別安全**（與 Astro 層同等）
- **響應式狀態管理**（取代 vanilla JS 的 `data-*` + `addEventListener`）
- **`v-model` 雙向綁定**（表單元件、Dialog open 狀態等）
- **Composable 抽象**（共用 outside-click、escape-key、toggle 等行為邏輯）
- **Tree-shaking**（按需引入，未使用的元件不打包）

設計原則：Vue 元件層**完全依賴**既有 `cu-*` CSS，不新增任何 CSS 規則。

---

## 核心對應關係

| Astro 概念 | Vue 3 對應 |
|---|---|
| `interface Props` | `defineProps<{...}>()` |
| `Astro.props` 解構 | `const props = defineProps(...)` |
| `class:list={[base, className]}` | `:class="[base, props.class]"` |
| `{...rest}` 屬性透傳 | `v-bind="$attrs"` + `inheritAttrs: false` |
| `<slot />` | `<slot />` |
| 具名 slot `<slot name="x" />` | `<slot name="x" />` |
| `TOP_CLASS` (`cu`) | `const CU = 'cu'` 或直接寫死 |
| inline `<script>` + `data-*` | Composition API 響應式狀態 |

---

## 檔案結構

```
packages/cubby-ui-vue/
├── package.json
├── tsconfig.json
├── vite.config.ts              -- Library mode 打包
├── src/
│   ├── index.ts                -- 總入口（named exports + install plugin）
│   ├── utils/
│   │   └── cn.ts               -- class 合併工具
│   ├── composables/
│   │   ├── useToggle.ts        -- open/close 狀態（Dialog, Dropdown, Popover, Drawer）
│   │   ├── useOutsideClick.ts  -- 點擊外部關閉
│   │   ├── useEscapeKey.ts     -- Escape 鍵關閉
│   │   └── useTabs.ts          -- Tabs 狀態管理
│   └── components/
│       ├── Button.vue
│       ├── Badge.vue
│       ├── Separator.vue
│       ├── ButtonGroup.vue
│       ├── Card/
│       │   ├── Card.vue
│       │   ├── CardHeader.vue
│       │   ├── CardTitle.vue
│       │   ├── CardDescription.vue
│       │   ├── CardContent.vue
│       │   └── CardFooter.vue
│       ├── Alert/
│       │   ├── Alert.vue
│       │   ├── AlertTitle.vue
│       │   └── AlertDescription.vue
│       ├── AlertDialog/
│       │   ├── AlertDialog.vue
│       │   ├── AlertDialogHeader.vue
│       │   ├── AlertDialogTitle.vue
│       │   ├── AlertDialogDescription.vue
│       │   └── AlertDialogFooter.vue
│       ├── Dialog/
│       │   ├── Dialog.vue
│       │   ├── DialogHeader.vue
│       │   ├── DialogTitle.vue
│       │   ├── DialogDescription.vue
│       │   ├── DialogFooter.vue
│       │   └── DialogClose.vue
│       ├── Drawer/
│       │   ├── Drawer.vue
│       │   ├── DrawerHeader.vue
│       │   ├── DrawerTitle.vue
│       │   ├── DrawerDescription.vue
│       │   ├── DrawerContent.vue
│       │   ├── DrawerFooter.vue
│       │   └── DrawerClose.vue
│       ├── Dropdown/
│       │   ├── Dropdown.vue
│       │   ├── DropdownContent.vue
│       │   ├── DropdownItem.vue
│       │   ├── DropdownLabel.vue
│       │   └── DropdownSeparator.vue
│       ├── Accordion/
│       │   ├── Accordion.vue
│       │   ├── AccordionItem.vue
│       │   ├── AccordionTrigger.vue
│       │   └── AccordionContent.vue
│       ├── Avatar/
│       │   ├── Avatar.vue
│       │   ├── AvatarImage.vue
│       │   └── AvatarFallback.vue
│       ├── Breadcrumb/
│       │   ├── Breadcrumb.vue
│       │   ├── BreadcrumbItem.vue
│       │   ├── BreadcrumbLink.vue
│       │   ├── BreadcrumbSeparator.vue
│       │   └── BreadcrumbCurrent.vue
│       ├── Collapsible/
│       │   ├── Collapsible.vue
│       │   ├── CollapsibleTrigger.vue
│       │   └── CollapsibleContent.vue
│       ├── EmptyState/
│       │   ├── EmptyState.vue
│       │   ├── EmptyStateIcon.vue
│       │   ├── EmptyStateTitle.vue
│       │   ├── EmptyStateDescription.vue
│       │   └── EmptyStateAction.vue
│       ├── HoverCard/
│       │   ├── HoverCard.vue
│       │   └── HoverCardContent.vue
│       ├── Menubar/
│       │   ├── Menubar.vue
│       │   ├── MenubarMenu.vue
│       │   ├── MenubarTrigger.vue
│       │   ├── MenubarContent.vue
│       │   ├── MenubarItem.vue
│       │   ├── MenubarSeparator.vue
│       │   ├── MenubarLabel.vue
│       │   └── MenubarShortcut.vue
│       ├── Pagination/
│       │   ├── Pagination.vue
│       │   ├── PaginationItem.vue
│       │   ├── PaginationPrev.vue
│       │   ├── PaginationNext.vue
│       │   └── PaginationEllipsis.vue
│       ├── Popover/
│       │   ├── Popover.vue
│       │   └── PopoverContent.vue
│       ├── Stat/
│       │   ├── Stat.vue
│       │   ├── StatHeader.vue
│       │   ├── StatLabel.vue
│       │   ├── StatValue.vue
│       │   ├── StatDescription.vue
│       │   └── StatTrend.vue
│       ├── Tabs/
│       │   ├── Tabs.vue
│       │   ├── TabsList.vue
│       │   ├── TabsTrigger.vue
│       │   └── TabsContent.vue
│       ├── Toast/
│       │   ├── ToastProvider.vue
│       │   ├── Toast.vue
│       │   └── useToast.ts
│       ├── Tooltip.vue
│       ├── Header/
│       │   ├── Header.vue
│       │   ├── HeaderInner.vue
│       │   ├── HeaderBrand.vue
│       │   ├── HeaderNav.vue
│       │   └── HeaderActions.vue
│       ├── Sidebar/
│       │   ├── Sidebar.vue
│       │   ├── SidebarHeader.vue
│       │   ├── SidebarContent.vue
│       │   ├── SidebarFooter.vue
│       │   ├── SidebarSection.vue
│       │   ├── SidebarSectionTitle.vue
│       │   ├── SidebarGroup.vue
│       │   ├── SidebarGroupTitle.vue
│       │   ├── SidebarItem.vue
│       │   └── SidebarSeparator.vue
│       ├── Nav/
│       │   ├── Nav.vue
│       │   └── NavItem.vue
│       ├── Container.vue
│       ├── Label.vue
│       ├── Input.vue
│       ├── Textarea.vue
│       ├── Select.vue
│       ├── Checkbox.vue
│       ├── Radio.vue
│       ├── Toggle.vue
│       ├── Range.vue
│       ├── SearchInput.vue
│       ├── FileInput.vue
│       ├── FormGroup.vue
│       ├── FormDescription.vue
│       ├── FormError.vue
│       ├── Progress.vue
│       ├── Skeleton.vue
│       ├── Heading.vue
│       ├── Paragraph.vue
│       ├── Blockquote.vue
│       ├── Link.vue
│       ├── List.vue
│       └── Hr.vue
└── dist/                       -- 打包產出
    ├── cubby-ui-vue.es.js
    ├── cubby-ui-vue.umd.js
    └── index.d.ts
```

---

## 共用工具與 Composables

### `utils/cn.ts` — Class 合併

```ts
/**
 * 合併 CSS class，過濾 falsy 值
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
```

### `composables/useToggle.ts` — 開關狀態

```ts
import { ref, type Ref } from 'vue'

export function useToggle(initial = false): {
  isOpen: Ref<boolean>
  open: () => void
  close: () => void
  toggle: () => void
} {
  const isOpen = ref(initial)

  return {
    isOpen,
    open: () => { isOpen.value = true },
    close: () => { isOpen.value = false },
    toggle: () => { isOpen.value = !isOpen.value },
  }
}
```

### `composables/useOutsideClick.ts` — 點擊外部

```ts
import { onMounted, onBeforeUnmount, type Ref } from 'vue'

export function useOutsideClick(
  target: Ref<HTMLElement | null>,
  callback: () => void,
) {
  function handler(e: MouseEvent) {
    if (target.value && !target.value.contains(e.target as Node)) {
      callback()
    }
  }

  onMounted(() => document.addEventListener('click', handler))
  onBeforeUnmount(() => document.removeEventListener('click', handler))
}
```

### `composables/useEscapeKey.ts` — Escape 關閉

```ts
import { onMounted, onBeforeUnmount } from 'vue'

export function useEscapeKey(callback: () => void) {
  function handler(e: KeyboardEvent) {
    if (e.key === 'Escape') callback()
  }

  onMounted(() => document.addEventListener('keydown', handler))
  onBeforeUnmount(() => document.removeEventListener('keydown', handler))
}
```

### `composables/useTabs.ts` — Tabs 狀態

```ts
import { ref, provide, inject, type InjectionKey, type Ref } from 'vue'

const TabsKey: InjectionKey<{
  activeTab: Ref<string>
  select: (value: string) => void
}> = Symbol('Tabs')

export function useTabsProvider(defaultValue: string) {
  const activeTab = ref(defaultValue)

  function select(value: string) {
    activeTab.value = value
  }

  provide(TabsKey, { activeTab, select })
  return { activeTab, select }
}

export function useTabsConsumer() {
  const ctx = inject(TabsKey)
  if (!ctx) throw new Error('<TabsTrigger> / <TabsContent> must be inside <Tabs>')
  return ctx
}
```

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

**Vue 對應（`Label.vue`）：**

```vue
<script setup lang="ts">
defineOptions({ inheritAttrs: false })

defineProps<{
  class?: string
}>()
</script>

<template>
  <label :class="['cu-label', $props.class]" v-bind="$attrs">
    <slot />
  </label>
</template>
```

**使用方式：**

```vue
<CuLabel for="email">Email</CuLabel>
<CuLabel for="name" class="text-lg">Name</CuLabel>
```

> `inheritAttrs: false` + `v-bind="$attrs"` 確保 `for`、`id` 等原生屬性透傳到 `<label>` 而非根元素。對 Simple 元件來說根元素就是目標元素，實際上可省略 `inheritAttrs: false`，但統一模式更易維護。

---

### 模式二：Variant / Size Props

**Vue 對應（`Button.vue`）：**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../utils/cn'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  variant?: 'default' | 'destructive' | 'outline' | 'secondary'
           | 'ghost' | 'link' | 'success' | 'warning' | 'info'
  size?: 'default' | 'xs' | 'sm' | 'lg' | 'xl' | 'icon'
  class?: string
}>(), {
  variant: 'default',
  size: 'default',
})

const classes = computed(() => cn(
  'cu-button',
  `cu-button-${props.variant}`,
  props.size === 'default' ? 'cu-button-md' : `cu-button-${props.size}`,
  props.class,
))
</script>

<template>
  <button :class="classes" v-bind="$attrs">
    <slot />
  </button>
</template>
```

**使用方式：**

```vue
<CuButton>Submit</CuButton>
<CuButton variant="outline" size="sm">Cancel</CuButton>
<CuButton variant="destructive" size="lg" @click="handleDelete">Delete</CuButton>

<!-- 額外 Tailwind utility -->
<CuButton variant="ghost" class="w-full">Full Width</CuButton>
```

> Vue 的 `withDefaults` + `defineProps` 提供完整的 TypeScript 型別推導和 IDE 自動完成，與 Astro 的 `interface Props` 效果相同。

---

### 模式三：State Props（布林狀態）

**Vue 對應（`NavItem.vue`）：**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../utils/cn'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  active?: boolean
  class?: string
}>(), {
  active: false,
})

const classes = computed(() => cn(
  'cu-nav-item',
  props.active && 'cu-nav-item-active',
  props.class,
))
</script>

<template>
  <a :class="classes" v-bind="$attrs">
    <slot />
  </a>
</template>
```

**使用方式（搭配 Vue Router）：**

```vue
<CuNav>
  <CuNavItem
    v-for="item in menu"
    :key="item.path"
    :href="item.path"
    :active="route.path === item.path"
  >
    {{ item.label }}
  </CuNavItem>
</CuNav>
```

---

### 模式四：結構化子元件

**Vue 對應（`Card.vue`）：**

```vue
<script setup lang="ts">
defineOptions({ inheritAttrs: false })
defineProps<{ class?: string }>()
</script>

<template>
  <div :class="['cu-card', $props.class]" v-bind="$attrs">
    <slot />
  </div>
</template>
```

**Vue 對應（`CardHeader.vue`）：**

```vue
<script setup lang="ts">
defineOptions({ inheritAttrs: false })
defineProps<{ class?: string }>()
</script>

<template>
  <div :class="['cu-card-header', $props.class]" v-bind="$attrs">
    <slot />
  </div>
</template>
```

其餘子元件（`CardTitle`、`CardDescription`、`CardContent`、`CardFooter`）同理，僅替換 class 名稱和 HTML 標籤。

**使用方式：**

```vue
<CuCard>
  <CuCardHeader>
    <CuCardTitle>專案設定</CuCardTitle>
    <CuCardDescription>管理您的專案配置</CuCardDescription>
  </CuCardHeader>
  <CuCardContent>
    <CuFormGroup>
      <CuLabel for="name">專案名稱</CuLabel>
      <CuInput id="name" v-model="form.name" placeholder="My Project" />
    </CuFormGroup>
  </CuCardContent>
  <CuCardFooter class="justify-end">
    <CuButton variant="outline" @click="cancel">取消</CuButton>
    <CuButton @click="save">儲存</CuButton>
  </CuCardFooter>
</CuCard>
```

---

### 模式五：表單元件 + `v-model`

**Vue 對應（`Input.vue`）：**

```vue
<script setup lang="ts">
defineOptions({ inheritAttrs: false })

defineProps<{
  class?: string
  modelValue?: string | number
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <input
    :class="['cu-input', $props.class]"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    v-bind="$attrs"
  />
</template>
```

**Vue 對應（`Checkbox.vue`）：**

```vue
<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  class?: string
  modelValue?: boolean
  label?: string
}>(), {
  modelValue: false,
})

defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <label :class="['cu-checkbox-wrapper', $props.class]">
    <input
      type="checkbox"
      class="cu-checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      v-bind="$attrs"
    />
    <span v-if="label">{{ label }}</span>
    <slot v-else />
  </label>
</template>
```

**Vue 對應（`Toggle.vue`）：**

```vue
<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  size?: 'default' | 'sm' | 'lg'
  modelValue?: boolean
  label?: string
  class?: string
}>(), {
  size: 'default',
  modelValue: false,
})

defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const toggleClass = computed(() =>
  props.size === 'default' ? 'cu-toggle' : `cu-toggle cu-toggle-${props.size}`
)
</script>

<template>
  <label :class="['cu-toggle-wrapper', $props.class]">
    <input
      type="checkbox"
      class="cu-toggle-input"
      :checked="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      v-bind="$attrs"
    />
    <span :class="toggleClass">
      <span class="cu-toggle-thumb"></span>
    </span>
    <span v-if="label">{{ label }}</span>
    <slot v-else />
  </label>
</template>
```

**Vue 對應（`Select.vue`）：**

```vue
<script setup lang="ts">
defineOptions({ inheritAttrs: false })

defineProps<{
  class?: string
  modelValue?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="cu-select-wrapper">
    <select
      :class="['cu-select', $props.class]"
      :value="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      v-bind="$attrs"
    >
      <slot />
    </select>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
         stroke-linejoin="round" class="cu-select-icon">
      <path d="m6 9 6 6 6-6"></path>
    </svg>
  </div>
</template>
```

**使用方式：**

```vue
<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  name: '',
  agree: false,
  darkMode: false,
  country: '',
})
</script>

<template>
  <CuInput v-model="form.name" placeholder="名稱" />
  <CuCheckbox v-model="form.agree" label="我同意服務條款" />
  <CuToggle v-model="form.darkMode" label="暗色模式" />
  <CuSelect v-model="form.country">
    <option value="">請選擇國家</option>
    <option value="tw">台灣</option>
    <option value="jp">日本</option>
  </CuSelect>
</template>
```

---

### 模式六：Dialog（`v-model:open` + 原生 `<dialog>`）

Vue 版最大的價值在於互動元件。用 `v-model:open` 取代手動的 `data-dialog-trigger` + `addEventListener`。

**Vue 對應（`Dialog.vue`）：**

```vue
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  open?: boolean
  class?: string
}>(), {
  open: false,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const dialogRef = ref<HTMLDialogElement | null>(null)

watch(() => props.open, (val) => {
  if (!dialogRef.value) return
  if (val) {
    dialogRef.value.showModal()
  } else {
    dialogRef.value.close()
  }
})

onMounted(() => {
  if (props.open) dialogRef.value?.showModal()
})

function onBackdropClick(e: MouseEvent) {
  if (e.target === dialogRef.value) {
    emit('update:open', false)
  }
}

function onClose() {
  emit('update:open', false)
}

defineExpose({
  /** 取得原生 <dialog> 元素 */
  el: dialogRef,
})
</script>

<template>
  <dialog
    ref="dialogRef"
    :class="['cu-dialog', $props.class]"
    @click="onBackdropClick"
    @close="onClose"
    v-bind="$attrs"
  >
    <slot />
  </dialog>
</template>
```

**Vue 對應（`DialogClose.vue`）：**

```vue
<script setup lang="ts">
defineOptions({ inheritAttrs: false })
defineProps<{ class?: string }>()

// 需要父層傳入 close 回呼，或直接 emit 事件由 Dialog 攔截
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <button
    type="button"
    :class="['cu-dialog-close', $props.class]"
    @click="$parent?.$emit('update:open', false)"
    v-bind="$attrs"
    aria-label="Close"
  >
    <slot>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 6 6 18"></path>
        <path d="m6 6 12 12"></path>
      </svg>
    </slot>
  </button>
</template>
```

**使用方式：**

```vue
<script setup lang="ts">
import { ref } from 'vue'

const showDialog = ref(false)
</script>

<template>
  <CuButton @click="showDialog = true">開啟對話框</CuButton>

  <CuDialog v-model:open="showDialog">
    <CuDialogClose />
    <CuDialogHeader>
      <CuDialogTitle>確認操作</CuDialogTitle>
      <CuDialogDescription>此操作無法復原，確定要繼續嗎？</CuDialogDescription>
    </CuDialogHeader>
    <CuDialogFooter>
      <CuButton variant="outline" @click="showDialog = false">取消</CuButton>
      <CuButton variant="destructive" @click="handleDelete">確認刪除</CuButton>
    </CuDialogFooter>
  </CuDialog>
</template>
```

> 相較原版需要 `data-dialog-trigger="id"` + `<script>setupDialogs()</script>`，Vue 版用 `v-model:open` 一行搞定，且狀態完全在 Vue 響應式系統中可追蹤。

---

### 模式七：Alert Dialog（無 backdrop 關閉）

與 Dialog 幾乎相同，差異在於 **不處理 backdrop click**。

**Vue 對應（`AlertDialog.vue`）：**

```vue
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  open?: boolean
  class?: string
}>(), {
  open: false,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const dialogRef = ref<HTMLDialogElement | null>(null)

watch(() => props.open, (val) => {
  if (!dialogRef.value) return
  val ? dialogRef.value.showModal() : dialogRef.value.close()
})

onMounted(() => {
  if (props.open) dialogRef.value?.showModal()
})

// 攔截原生 Escape 關閉行為
function onCancel(e: Event) {
  e.preventDefault()
}

function onClose() {
  emit('update:open', false)
}
</script>

<template>
  <dialog
    ref="dialogRef"
    :class="['cu-alert-dialog', $props.class]"
    @cancel="onCancel"
    @close="onClose"
    v-bind="$attrs"
  >
    <slot />
  </dialog>
</template>
```

**使用方式：**

```vue
<CuAlertDialog v-model:open="showConfirm">
  <CuAlertDialogHeader>
    <CuAlertDialogTitle>確定要刪除嗎？</CuAlertDialogTitle>
    <CuAlertDialogDescription>此操作無法復原。</CuAlertDialogDescription>
  </CuAlertDialogHeader>
  <CuAlertDialogFooter>
    <CuButton variant="outline" @click="showConfirm = false">取消</CuButton>
    <CuButton variant="destructive" @click="confirmDelete">確認</CuButton>
  </CuAlertDialogFooter>
</CuAlertDialog>
```

---

### 模式八：Drawer（方向 prop）

**Vue 對應（`Drawer.vue`）：**

```vue
<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { cn } from '../utils/cn'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  open?: boolean
  side?: 'right' | 'left' | 'top' | 'bottom'
  class?: string
}>(), {
  open: false,
  side: 'right',
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const dialogRef = ref<HTMLDialogElement | null>(null)

const classes = computed(() => cn(
  'cu-drawer',
  `cu-drawer-${props.side}`,
  props.class,
))

watch(() => props.open, (val) => {
  if (!dialogRef.value) return
  val ? dialogRef.value.showModal() : dialogRef.value.close()
})

onMounted(() => {
  if (props.open) dialogRef.value?.showModal()
})

function onBackdropClick(e: MouseEvent) {
  if (e.target === dialogRef.value) emit('update:open', false)
}

function onClose() {
  emit('update:open', false)
}
</script>

<template>
  <dialog
    ref="dialogRef"
    :class="classes"
    @click="onBackdropClick"
    @close="onClose"
    v-bind="$attrs"
  >
    <slot />
  </dialog>
</template>
```

**使用方式：**

```vue
<CuDrawer v-model:open="showDrawer" side="right">
  <CuDrawerHeader>
    <CuDrawerTitle>設定</CuDrawerTitle>
  </CuDrawerHeader>
  <CuDrawerContent>
    ...
  </CuDrawerContent>
  <CuDrawerFooter>
    <CuButton @click="showDrawer = false">關閉</CuButton>
  </CuDrawerFooter>
</CuDrawer>
```

---

### 模式九：Dropdown（composable 組合）

**Vue 對應（`Dropdown.vue`）：**

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useOutsideClick } from '../composables/useOutsideClick'
import { useEscapeKey } from '../composables/useEscapeKey'

defineOptions({ inheritAttrs: false })
defineProps<{ class?: string }>()

const dropdownRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)

function close() {
  isOpen.value = false
}

function toggle(e: MouseEvent) {
  e.stopPropagation()
  isOpen.value = !isOpen.value
}

useOutsideClick(dropdownRef, close)
useEscapeKey(close)

defineExpose({ isOpen, close, toggle })
</script>

<template>
  <div ref="dropdownRef" :class="['cu-dropdown', $props.class]" v-bind="$attrs">
    <slot :is-open="isOpen" :toggle="toggle" :close="close" />
  </div>
</template>
```

**Vue 對應（`DropdownContent.vue`）：**

```vue
<script setup lang="ts">
defineOptions({ inheritAttrs: false })
defineProps<{ class?: string }>()
</script>

<template>
  <div :class="['cu-dropdown-content', $props.class]" v-bind="$attrs">
    <slot />
  </div>
</template>
```

**使用方式（scoped slot）：**

```vue
<CuDropdown v-slot="{ isOpen, toggle, close }">
  <CuButton variant="outline" @click="toggle">
    選單
    <ChevronDownIcon />
  </CuButton>
  <CuDropdownContent v-show="isOpen">
    <CuDropdownLabel>我的帳號</CuDropdownLabel>
    <CuDropdownSeparator />
    <CuDropdownItem @click="close">個人資料</CuDropdownItem>
    <CuDropdownItem @click="close">設定</CuDropdownItem>
    <CuDropdownSeparator />
    <CuDropdownItem @click="logout">登出</CuDropdownItem>
  </CuDropdownContent>
</CuDropdown>
```

---

### 模式十：Tabs（provide / inject）

**Vue 對應（`Tabs.vue`）：**

```vue
<script setup lang="ts">
import { useTabsProvider } from '../composables/useTabs'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  defaultValue: string
  class?: string
}>(), {})

const { activeTab } = useTabsProvider(props.defaultValue)

defineExpose({ activeTab })
</script>

<template>
  <div :class="['cu-tabs', $props.class]" v-bind="$attrs">
    <slot />
  </div>
</template>
```

**Vue 對應（`TabsTrigger.vue`）：**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useTabsConsumer } from '../composables/useTabs'
import { cn } from '../utils/cn'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  value: string
  class?: string
}>()

const { activeTab, select } = useTabsConsumer()

const classes = computed(() => cn(
  'cu-tabs-trigger',
  activeTab.value === props.value && 'cu-tabs-trigger-active',
  props.class,
))
</script>

<template>
  <button
    type="button"
    :class="classes"
    @click="select(value)"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>
```

**Vue 對應（`TabsContent.vue`）：**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useTabsConsumer } from '../composables/useTabs'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  value: string
  class?: string
}>()

const { activeTab } = useTabsConsumer()

const isActive = computed(() => activeTab.value === props.value)
</script>

<template>
  <div
    v-show="isActive"
    :class="['cu-tabs-content', $props.class]"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>
```

**使用方式：**

```vue
<CuTabs default-value="account">
  <CuTabsList>
    <CuTabsTrigger value="account">帳號</CuTabsTrigger>
    <CuTabsTrigger value="password">密碼</CuTabsTrigger>
    <CuTabsTrigger value="notifications">通知</CuTabsTrigger>
  </CuTabsList>
  <CuTabsContent value="account">
    帳號設定內容...
  </CuTabsContent>
  <CuTabsContent value="password">
    密碼設定內容...
  </CuTabsContent>
  <CuTabsContent value="notifications">
    通知設定內容...
  </CuTabsContent>
</CuTabs>
```

---

### 模式十一：Popover（composable 組合）

**Vue 對應（`Popover.vue`）：**

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useOutsideClick } from '../composables/useOutsideClick'
import { useEscapeKey } from '../composables/useEscapeKey'

defineOptions({ inheritAttrs: false })
defineProps<{ class?: string }>()

const popoverRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)

function toggle(e: MouseEvent) {
  e.stopPropagation()
  isOpen.value = !isOpen.value
}

function close() {
  isOpen.value = false
}

useOutsideClick(popoverRef, close)
useEscapeKey(close)
</script>

<template>
  <div ref="popoverRef" :class="['cu-popover', $props.class]" v-bind="$attrs">
    <slot :is-open="isOpen" :toggle="toggle" :close="close" />
  </div>
</template>
```

**使用方式：**

```vue
<CuPopover v-slot="{ isOpen, toggle }">
  <CuButton variant="outline" @click="toggle">開啟 Popover</CuButton>
  <CuPopoverContent v-show="isOpen">
    <p>這是一段彈出內容。</p>
  </CuPopoverContent>
</CuPopover>
```

---

### 模式十二：Toast（Composable + Provider）

Toast 是唯一需要「全域狀態」的元件，使用 composable 搭配 Provider 元件。

**`Toast/useToast.ts`：**

```ts
import { ref, type Component } from 'vue'

export interface ToastItem {
  id: number
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info'
  duration?: number
}

const toasts = ref<ToastItem[]>([])
let nextId = 0

export function useToast() {
  function toast(options: Omit<ToastItem, 'id'>) {
    const id = nextId++
    const item: ToastItem = { id, duration: 5000, variant: 'default', ...options }
    toasts.value.push(item)

    setTimeout(() => {
      dismiss(id)
    }, item.duration)

    return id
  }

  function dismiss(id: number) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return { toasts, toast, dismiss }
}
```

**`Toast/ToastProvider.vue`：**

```vue
<script setup lang="ts">
import { useToast } from './useToast'
import Toast from './Toast.vue'

defineProps<{
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}>()

const { toasts, dismiss } = useToast()
</script>

<template>
  <slot />
  <Teleport to="body">
    <div :class="['cu-toast-container', `cu-toast-container-${position ?? 'bottom-right'}`]">
      <Toast
        v-for="t in toasts"
        :key="t.id"
        v-bind="t"
        @dismiss="dismiss(t.id)"
      />
    </div>
  </Teleport>
</template>
```

**使用方式：**

```vue
<!-- App.vue（根層級掛載一次） -->
<CuToastProvider position="bottom-right">
  <RouterView />
</CuToastProvider>

<!-- 任何子元件中 -->
<script setup lang="ts">
import { useToast } from 'cubby-ui-vue'

const { toast } = useToast()

function handleSave() {
  // ...
  toast({ title: '儲存成功', variant: 'success' })
}
</script>
```

---

### 模式十三：Accordion / Collapsible（原生 `<details>`）

這些元件使用原生 HTML `<details>` 元素，不需要額外 JS 狀態管理。Vue 版只是提供型別安全的包裝。

**Vue 對應（`AccordionItem.vue`）：**

```vue
<script setup lang="ts">
defineOptions({ inheritAttrs: false })

withDefaults(defineProps<{
  open?: boolean
  class?: string
}>(), {
  open: false,
})
</script>

<template>
  <details :class="['cu-accordion-item', $props.class]" :open="open" v-bind="$attrs">
    <slot />
  </details>
</template>
```

**Vue 對應（`AccordionTrigger.vue`）：**

```vue
<script setup lang="ts">
defineOptions({ inheritAttrs: false })
defineProps<{ class?: string }>()
</script>

<template>
  <summary :class="['cu-accordion-trigger', $props.class]" v-bind="$attrs">
    <slot />
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round">
      <path d="m6 9 6 6 6-6"></path>
    </svg>
  </summary>
</template>
```

**使用方式：**

```vue
<CuAccordion>
  <CuAccordionItem :open="true">
    <CuAccordionTrigger>什麼是 Cubby UI？</CuAccordionTrigger>
    <CuAccordionContent>一個框架無關的 UI 元件庫。</CuAccordionContent>
  </CuAccordionItem>
  <CuAccordionItem>
    <CuAccordionTrigger>支援哪些框架？</CuAccordionTrigger>
    <CuAccordionContent>任何使用 HTML + CSS 的環境。</CuAccordionContent>
  </CuAccordionItem>
</CuAccordion>
```

---

### 模式十四：HoverCard / Tooltip（純 CSS）

這些元件完全依賴 CSS hover 效果，Vue 版只提供標記封裝。

**Vue 對應（`HoverCard.vue`）：**

```vue
<script setup lang="ts">
defineOptions({ inheritAttrs: false })
defineProps<{ class?: string }>()
</script>

<template>
  <div :class="['cu-hover-card', $props.class]" v-bind="$attrs">
    <slot />
  </div>
</template>
```

**Vue 對應（`Tooltip.vue`）：**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../utils/cn'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  class?: string
}>(), {
  position: 'top',
})

const classes = computed(() => cn(
  'cu-tooltip',
  props.position !== 'top' && `cu-tooltip-${props.position}`,
  props.class,
))
</script>

<template>
  <span :class="classes" :data-tooltip="content" v-bind="$attrs">
    <slot />
  </span>
</template>
```

**使用方式：**

```vue
<CuTooltip content="這是提示文字">
  <CuButton variant="ghost" size="icon">
    <InfoIcon />
  </CuButton>
</CuTooltip>

<CuTooltip content="底部提示" position="bottom">
  <span>Hover me</span>
</CuTooltip>
```

---

### 模式十五：Typography

**Vue 對應（`Heading.vue`）：**

```vue
<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  level?: 1 | 2 | 3 | 4
  class?: string
}>(), {
  level: 1,
})
</script>

<template>
  <component
    :is="`h${level}`"
    :class="[`cu-h${level}`, $props.class]"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>
```

**使用方式：**

```vue
<CuHeading :level="1">頁面標題</CuHeading>
<CuHeading :level="3" class="text-primary">副標題</CuHeading>
```

---

## 總入口 `index.ts`

```ts
// --- Components ---
export { default as CuButton } from './components/Button.vue'
export { default as CuBadge } from './components/Badge.vue'
export { default as CuSeparator } from './components/Separator.vue'
export { default as CuButtonGroup } from './components/ButtonGroup.vue'

export { default as CuCard } from './components/Card/Card.vue'
export { default as CuCardHeader } from './components/Card/CardHeader.vue'
export { default as CuCardTitle } from './components/Card/CardTitle.vue'
export { default as CuCardDescription } from './components/Card/CardDescription.vue'
export { default as CuCardContent } from './components/Card/CardContent.vue'
export { default as CuCardFooter } from './components/Card/CardFooter.vue'

// ... 其餘元件 ...

export { default as CuDialog } from './components/Dialog/Dialog.vue'
export { default as CuDialogHeader } from './components/Dialog/DialogHeader.vue'
export { default as CuDialogTitle } from './components/Dialog/DialogTitle.vue'
export { default as CuDialogDescription } from './components/Dialog/DialogDescription.vue'
export { default as CuDialogFooter } from './components/Dialog/DialogFooter.vue'
export { default as CuDialogClose } from './components/Dialog/DialogClose.vue'

export { default as CuTabs } from './components/Tabs/Tabs.vue'
export { default as CuTabsList } from './components/Tabs/TabsList.vue'
export { default as CuTabsTrigger } from './components/Tabs/TabsTrigger.vue'
export { default as CuTabsContent } from './components/Tabs/TabsContent.vue'

export { default as CuToastProvider } from './components/Toast/ToastProvider.vue'

// ... 其餘元件 ...

// --- Composables ---
export { useToast } from './components/Toast/useToast'
export { useToggle } from './composables/useToggle'
export { useOutsideClick } from './composables/useOutsideClick'
export { useEscapeKey } from './composables/useEscapeKey'

// --- Utils ---
export { cn } from './utils/cn'

// --- Plugin ---
import type { App } from 'vue'

export const CubbyUI = {
  install(app: App) {
    // 自動全域註冊所有元件（可選）
    const components = import.meta.glob('./components/**/*.vue', { eager: true })
    for (const [path, module] of Object.entries(components)) {
      const name = path.match(/\/(\w+)\.vue$/)?.[1]
      if (name && (module as any).default) {
        app.component(`Cu${name}`, (module as any).default)
      }
    }
  },
}
```

---

## 打包設定

### `vite.config.ts`

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({ rollupTypes: true }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'CubbyUIVue',
      formats: ['es', 'umd'],
      fileName: (format) => `cubby-ui-vue.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' },
      },
    },
  },
})
```

### `package.json`

```json
{
  "name": "cubby-ui-vue",
  "version": "0.1.0",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/cubby-ui-vue.umd.js",
  "module": "./dist/cubby-ui-vue.es.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/cubby-ui-vue.es.js",
      "require": "./dist/cubby-ui-vue.umd.js",
      "types": "./dist/index.d.ts"
    },
    "./css": "./dist/style.css"
  },
  "peerDependencies": {
    "vue": "^3.4.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "typescript": "^5.5.0",
    "vite": "^6.0.0",
    "vite-plugin-dts": "^4.0.0",
    "vue": "^3.5.0"
  },
  "sideEffects": false
}
```

---

## 使用方式

### 按需引入（推薦，支援 tree-shaking）

```vue
<script setup lang="ts">
import { CuButton, CuCard, CuCardHeader, CuCardTitle, CuCardContent } from 'cubby-ui-vue'
</script>

<template>
  <CuCard>
    <CuCardHeader>
      <CuCardTitle>Hello</CuCardTitle>
    </CuCardHeader>
    <CuCardContent>
      <CuButton @click="doSomething">Click</CuButton>
    </CuCardContent>
  </CuCard>
</template>
```

### 全域註冊（Plugin）

```ts
// main.ts
import { createApp } from 'vue'
import { CubbyUI } from 'cubby-ui-vue'
import App from './App.vue'

createApp(App).use(CubbyUI).mount('#app')
```

### CSS 引入

Vue 元件不打包 CSS，使用者需自行引入 Cubby UI 的 CSS：

```css
/* app.css */
@import "tailwindcss";
@import "cubby-ui/css/components.css";

@theme {
  /* Cubby UI design tokens */
  --color-primary: hsl(221 83% 53%);
  --color-primary-foreground: hsl(0 0% 100%);
  /* ... */
}
```

---

## 完整元件清單

### Typography（7 個）

| Vue 元件 | Props | HTML 元素 |
|---|---|---|
| `<CuHeading>` | `level` (1–4) | `<h1>`–`<h4>` |
| `<CuParagraph>` | `variant` (default, lead) | `<p>` |
| `<CuBlockquote>` | — | `<blockquote>` |
| `<CuList>` | `type` (disc, decimal) | `<ul>` / `<ol>` |
| `<CuLink>` | — | `<a>` |
| `<CuHr>` | — | `<hr>` |

### Basic（5 群組）

| Vue 元件 | Props |
|---|---|
| `<CuButton>` | `variant`, `size` |
| `<CuButtonGroup>` | `vertical` |
| `<CuCard>` + Header / Title / Description / Content / Footer | — |
| `<CuSeparator>` | `orientation` |
| `<CuBadge>` | `variant` |

### Forms（13 個，全部支援 `v-model`）

| Vue 元件 | Props | `v-model` 型別 |
|---|---|---|
| `<CuLabel>` | — | — |
| `<CuInput>` | — | `string` |
| `<CuTextarea>` | — | `string` |
| `<CuSelect>` | — | `string` |
| `<CuCheckbox>` | `label` | `boolean` |
| `<CuRadio>` | `label` | `string` |
| `<CuToggle>` | `size`, `label` | `boolean` |
| `<CuSearchInput>` | — | `string` |
| `<CuFileInput>` | — | — |
| `<CuRange>` | — | `number` |
| `<CuFormGroup>` | — | — |
| `<CuFormDescription>` | — | — |
| `<CuFormError>` | — | — |

### Data Display（6 群組）

| Vue 元件 | Props | 互動方式 |
|---|---|---|
| `<CuAccordion>` + Item / Trigger / Content | `open` (Item) | 原生 `<details>` |
| `<CuCollapsible>` + Trigger / Content | `open` | 原生 `<details>` |
| `<CuAvatar>` + Image / Fallback | — | 純 CSS |
| `<CuBadge>` | `variant` | 純 CSS |
| `<CuStat>` + Header / Label / Value / Description / Trend | `trend` | 純 CSS |

### Feedback（5 群組）

| Vue 元件 | Props |
|---|---|
| `<CuAlert>` + Title / Description | `variant` |
| `<CuProgress>` | `value` |
| `<CuSkeleton>` | — |
| `<CuEmptyState>` + Icon / Title / Description / Action | — |
| `<CuToastProvider>` + `useToast()` | `position` |

### Overlay（7 群組，Vue 響應式狀態管理）

| Vue 元件 | Props | 狀態控制 |
|---|---|---|
| `<CuDialog>` + sub-components | — | `v-model:open` |
| `<CuAlertDialog>` + sub-components | — | `v-model:open`（無 backdrop 關閉） |
| `<CuDrawer>` + sub-components | `side` | `v-model:open` |
| `<CuDropdown>` + sub-components | — | scoped slot `isOpen` / `toggle` |
| `<CuPopover>` + sub-components | — | scoped slot `isOpen` / `toggle` |
| `<CuHoverCard>` + Content | — | 純 CSS hover |
| `<CuTooltip>` | `content`, `position` | 純 CSS hover |

### Navigation（4 群組）

| Vue 元件 | Props |
|---|---|
| `<CuBreadcrumb>` + Item / Link / Separator / Current | — |
| `<CuMenubar>` + Menu / Trigger / Content / Item / Separator / Label / Shortcut | — |
| `<CuPagination>` + Item / Prev / Next / Ellipsis | `active` (Item) |
| `<CuTabs>` + List / Trigger / Content | `defaultValue` (Tabs), `value` (Trigger/Content) |

### Layout（4 群組）

| Vue 元件 | Props |
|---|---|
| `<CuContainer>` | `size` |
| `<CuHeader>` + Inner / Brand / Nav / Actions | — |
| `<CuNav>` + Item | `vertical` (Nav), `active` (Item) |
| `<CuSidebar>` + Header / Content / Footer / Section / SectionTitle / Group / GroupTitle / Item / Separator | `active` (Item) |

---

## 與其他方案的比較

| 面向 | Vue 元件 | Blade 匿名元件 | Web Components |
|---|---|---|---|
| 型別安全 | `defineProps<T>()` 完整推導 | 無靜態型別 | 無（attribute 皆 string） |
| 狀態管理 | `ref()` / `v-model` / `provide/inject` | 伺服器端（`$errors`, `old()`） | vanilla JS / `data-*` |
| 雙向綁定 | `v-model` 原生支援 | 無 | 需自行 dispatch event |
| 事件處理 | `@click` / `@input` | `onclick` / `wire:model` | `addEventListener` |
| 生命週期 | `onMounted` / `onBeforeUnmount` | 無（伺服器渲染） | `connectedCallback` |
| 組件間通信 | `provide/inject` / `emit` | 無 | Custom Event |
| Tree-shaking | 完整支援 | 不適用 | 需手動拆分 |
| 打包體積 | ~5-8 KB gzip（按需） | 0 KB（模板） | ~1.5-5 KB gzip |
| 適用場景 | Vue 3 SPA / Nuxt | Laravel 全端 | 任何環境 |

---

## Nuxt 3 整合

可額外提供 Nuxt module，自動匯入元件：

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['cubby-ui-vue/nuxt'],
})
```

Module 實作（未來擴展）：

```ts
// nuxt.ts
import { defineNuxtModule, addComponent } from '@nuxt/kit'

export default defineNuxtModule({
  meta: { name: 'cubby-ui-vue' },
  setup() {
    const components = [
      { name: 'CuButton', filePath: 'cubby-ui-vue/components/Button.vue' },
      { name: 'CuCard', filePath: 'cubby-ui-vue/components/Card/Card.vue' },
      // ...
    ]
    for (const c of components) {
      addComponent(c)
    }
  },
})
```

---

## 優缺點總結

| 優點 | 缺點 |
|---|---|
| 完全複用現有 `cu-*` CSS，零重複維護 | 僅限 Vue 3 生態系 |
| `defineProps` 提供完整 TypeScript 型別推導 | 元件數量多（但大多極簡短） |
| `v-model` 雙向綁定大幅簡化表單與互動元件 | 需另外引入 CSS（不自帶樣式） |
| Composable 抽象共用行為（toggle / outside click / escape） | |
| `provide/inject` 實現 Tabs 等父子通信 | |
| Tree-shaking 按需引入，未使用的元件不打包 | |
| Scoped slot 暴露內部狀態，靈活度高 | |
| Plugin 模式可一行全域註冊 | |
| 與 Vue Router / Pinia / Nuxt 無縫整合 | |
