# Cubby UI — React 元件層整合方案

## 背景

Cubby UI 的核心是框架無關的 CSS 類別層（`cu-*` class）。React 元件層作為第三層封裝，提供：

- **TypeScript Props 型別安全**（與 Astro 層同等）
- **受控 / 非受控模式**（表單元件支援 `value` + `onChange` 或內部狀態）
- **Hooks 抽象**（共用 outside-click、escape-key、toggle 等行為邏輯）
- **Compound Component 模式**（Card.Header、Dialog.Footer 等靜態子元件語法）
- **Tree-shaking**（按需引入，未使用的元件不打包）
- **Server Component 相容**（純展示元件可作為 RSC，互動元件標記 `'use client'`）

設計原則：React 元件層**完全依賴**既有 `cu-*` CSS，不新增任何 CSS 規則。

---

## 核心對應關係

| Astro 概念 | React 對應 |
|---|---|
| `interface Props` | `interface Props` / `type Props` |
| `Astro.props` 解構 | 函式參數解構 |
| `class:list={[base, className]}` | `cn(base, className)`（clsx / 自訂工具） |
| `{...rest}` 屬性透傳 | `{...rest}` spread |
| `<slot />` | `children: React.ReactNode` |
| 具名 slot `<slot name="x" />` | 具名 prop 或 Compound Component |
| `TOP_CLASS` (`cu`) | 直接寫死或常數 |
| inline `<script>` + `data-*` | `useState` + `useEffect` + `useRef` |

---

## 檔案結構

```
packages/cubby-ui-react/
├── package.json
├── tsconfig.json
├── tsup.config.ts              -- 打包（ESM + CJS + .d.ts）
├── src/
│   ├── index.ts                -- 總入口（named exports）
│   ├── utils/
│   │   └── cn.ts               -- class 合併工具
│   ├── hooks/
│   │   ├── use-toggle.ts       -- open/close 狀態
│   │   ├── use-outside-click.ts
│   │   ├── use-escape-key.ts
│   │   └── use-controllable.ts -- 受控 / 非受控統一
│   └── components/
│       ├── Button.tsx
│       ├── Badge.tsx
│       ├── Separator.tsx
│       ├── ButtonGroup.tsx
│       ├── Card.tsx            -- Card + Card.Header + Card.Title + ...
│       ├── Alert.tsx           -- Alert + Alert.Title + Alert.Description
│       ├── AlertDialog.tsx     -- AlertDialog + sub-components
│       ├── Dialog.tsx          -- Dialog + sub-components
│       ├── Drawer.tsx          -- Drawer + sub-components
│       ├── Dropdown.tsx        -- Dropdown + sub-components
│       ├── Accordion.tsx       -- Accordion + sub-components
│       ├── Avatar.tsx          -- Avatar + sub-components
│       ├── Breadcrumb.tsx      -- Breadcrumb + sub-components
│       ├── Collapsible.tsx
│       ├── EmptyState.tsx      -- EmptyState + sub-components
│       ├── HoverCard.tsx       -- HoverCard + sub-components
│       ├── Menubar.tsx         -- Menubar + sub-components
│       ├── Pagination.tsx      -- Pagination + sub-components
│       ├── Popover.tsx         -- Popover + sub-components
│       ├── Stat.tsx            -- Stat + sub-components
│       ├── Tabs.tsx            -- Tabs + sub-components
│       ├── Toast.tsx           -- ToastProvider + useToast
│       ├── Tooltip.tsx
│       ├── Header.tsx          -- Header + sub-components
│       ├── Sidebar.tsx         -- Sidebar + sub-components
│       ├── Nav.tsx             -- Nav + Nav.Item
│       ├── Container.tsx
│       ├── Label.tsx
│       ├── Input.tsx
│       ├── Textarea.tsx
│       ├── Select.tsx
│       ├── Checkbox.tsx
│       ├── Radio.tsx
│       ├── Toggle.tsx
│       ├── Range.tsx
│       ├── SearchInput.tsx
│       ├── FileInput.tsx
│       ├── FormGroup.tsx
│       ├── FormDescription.tsx
│       ├── FormError.tsx
│       ├── Progress.tsx
│       ├── Skeleton.tsx
│       ├── Heading.tsx
│       ├── Paragraph.tsx
│       ├── Blockquote.tsx
│       ├── Link.tsx
│       ├── List.tsx
│       └── Hr.tsx
└── dist/
    ├── index.mjs
    ├── index.js
    └── index.d.ts
```

> 與 Vue 版每個子元件一個檔案不同，React 版利用 **Compound Component 模式**將父元件與子元件合併在同一檔案中（例如 `Card.tsx` 匯出 `Card`、`Card.Header`、`Card.Title` 等），減少檔案數量並強化語意關聯。

---

## 共用工具與 Hooks

### `utils/cn.ts` — Class 合併

```tsx
/**
 * 合併 CSS class，過濾 falsy 值
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
```

### `hooks/use-toggle.ts` — 開關狀態

```tsx
import { useState, useCallback } from 'react'

export function useToggle(initial = false) {
  const [isOpen, setIsOpen] = useState(initial)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen(v => !v), [])

  return { isOpen, setIsOpen, open, close, toggle } as const
}
```

### `hooks/use-outside-click.ts` — 點擊外部

```tsx
import { useEffect, type RefObject } from 'react'

export function useOutsideClick(
  ref: RefObject<HTMLElement | null>,
  callback: () => void,
) {
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback()
      }
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [ref, callback])
}
```

### `hooks/use-escape-key.ts` — Escape 關閉

```tsx
import { useEffect } from 'react'

export function useEscapeKey(callback: () => void) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') callback()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [callback])
}
```

### `hooks/use-controllable.ts` — 受控 / 非受控統一

```tsx
import { useState, useCallback, useRef } from 'react'

/**
 * 讓元件同時支援受控（controlled）和非受控（uncontrolled）模式。
 *
 * - 受控：外部傳入 value + onChange，元件不持有內部狀態
 * - 非受控：外部不傳 value，元件自行管理狀態，可透過 defaultValue 設定初始值
 */
export function useControllable<T>(props: {
  value?: T
  defaultValue: T
  onChange?: (value: T) => void
}) {
  const { value: controlledValue, defaultValue, onChange } = props
  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue)

  const value = isControlled ? controlledValue : internalValue

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setInternalValue(next)
      onChange?.(next)
    },
    [isControlled, onChange],
  )

  return [value, setValue] as const
}
```

---

## 元件模式對照與實作範例

### 模式一：Simple（純包裝 + `forwardRef`）

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

**React 對應（`Label.tsx`）：**

```tsx
import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../utils/cn'

export const Label = forwardRef<
  HTMLLabelElement,
  ComponentPropsWithoutRef<'label'>
>(({ className, ...rest }, ref) => (
  <label ref={ref} className={cn('cu-label', className)} {...rest} />
))

Label.displayName = 'Label'
```

**使用方式：**

```tsx
<Label htmlFor="email">Email</Label>
<Label htmlFor="name" className="text-lg">Name</Label>
```

> React 使用 `forwardRef` 確保 `ref` 可透傳到底層 DOM 元素，這對表單庫（react-hook-form）和動畫庫（framer-motion）的整合至關重要。`ComponentPropsWithoutRef<'label'>` 自動繼承 `<label>` 的所有原生 HTML 屬性。

---

### 模式二：Variant / Size Props

**React 對應（`Button.tsx`）：**

```tsx
'use client'

import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../utils/cn'

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary'
          | 'ghost' | 'link' | 'success' | 'warning' | 'info'
  size?: 'default' | 'xs' | 'sm' | 'lg' | 'xl' | 'icon'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', size = 'default', className, ...rest }, ref) => (
    <button
      ref={ref}
      className={cn(
        'cu-button',
        `cu-button-${variant}`,
        size === 'default' ? 'cu-button-md' : `cu-button-${size}`,
        className,
      )}
      {...rest}
    />
  ),
)

Button.displayName = 'Button'
```

**使用方式：**

```tsx
<Button>Submit</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button variant="destructive" size="lg" onClick={handleDelete}>Delete</Button>

{/* 額外 Tailwind utility */}
<Button variant="ghost" className="w-full">Full Width</Button>

{/* 作為連結使用時搭配 asChild 或直接套 class */}
<a href="/login" className={cn('cu-button cu-button-outline cu-button-md')}>Login</a>
```

---

### 模式三：State Props（布林狀態）

**React 對應（`Nav.tsx` 局部）：**

```tsx
import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../utils/cn'

/* ---- Nav ---- */

export interface NavProps extends ComponentPropsWithoutRef<'nav'> {
  vertical?: boolean
}

const NavRoot = forwardRef<HTMLElement, NavProps>(
  ({ vertical = false, className, ...rest }, ref) => (
    <nav
      ref={ref}
      className={cn('cu-nav', vertical && 'cu-nav-vertical', className)}
      {...rest}
    />
  ),
)
NavRoot.displayName = 'Nav'

/* ---- NavItem ---- */

export interface NavItemProps extends ComponentPropsWithoutRef<'a'> {
  active?: boolean
}

const NavItem = forwardRef<HTMLAnchorElement, NavItemProps>(
  ({ active = false, className, ...rest }, ref) => (
    <a
      ref={ref}
      className={cn('cu-nav-item', active && 'cu-nav-item-active', className)}
      {...rest}
    />
  ),
)
NavItem.displayName = 'Nav.Item'

/* ---- 匯出 Compound Component ---- */

export const Nav = Object.assign(NavRoot, { Item: NavItem })
```

**使用方式（搭配 React Router / Next.js）：**

```tsx
import { usePathname } from 'next/navigation'

function MainNav() {
  const pathname = usePathname()

  return (
    <Nav>
      {menu.map(item => (
        <Nav.Item
          key={item.path}
          href={item.path}
          active={pathname === item.path}
        >
          {item.label}
        </Nav.Item>
      ))}
    </Nav>
  )
}
```

---

### 模式四：Compound Component（結構化子元件）

React 版的核心設計模式 — 將父元件與子元件定義在同一檔案，透過 `Object.assign` 掛載為靜態屬性。

**React 對應（`Card.tsx`）：**

```tsx
import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../utils/cn'

/* ---- Card ---- */

const CardRoot = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...rest }, ref) => (
    <div ref={ref} className={cn('cu-card', className)} {...rest} />
  ),
)
CardRoot.displayName = 'Card'

/* ---- CardHeader ---- */

const CardHeader = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...rest }, ref) => (
    <div ref={ref} className={cn('cu-card-header', className)} {...rest} />
  ),
)
CardHeader.displayName = 'Card.Header'

/* ---- CardTitle ---- */

const CardTitle = forwardRef<HTMLHeadingElement, ComponentPropsWithoutRef<'h3'>>(
  ({ className, ...rest }, ref) => (
    <h3 ref={ref} className={cn('cu-card-title', className)} {...rest} />
  ),
)
CardTitle.displayName = 'Card.Title'

/* ---- CardDescription ---- */

const CardDescription = forwardRef<HTMLParagraphElement, ComponentPropsWithoutRef<'p'>>(
  ({ className, ...rest }, ref) => (
    <p ref={ref} className={cn('cu-card-description', className)} {...rest} />
  ),
)
CardDescription.displayName = 'Card.Description'

/* ---- CardContent ---- */

const CardContent = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...rest }, ref) => (
    <div ref={ref} className={cn('cu-card-content', className)} {...rest} />
  ),
)
CardContent.displayName = 'Card.Content'

/* ---- CardFooter ---- */

const CardFooter = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...rest }, ref) => (
    <div ref={ref} className={cn('cu-card-footer', className)} {...rest} />
  ),
)
CardFooter.displayName = 'Card.Footer'

/* ---- 匯出 ---- */

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
})
```

**使用方式：**

```tsx
<Card>
  <Card.Header>
    <Card.Title>專案設定</Card.Title>
    <Card.Description>管理您的專案配置</Card.Description>
  </Card.Header>
  <Card.Content>
    <FormGroup>
      <Label htmlFor="name">專案名稱</Label>
      <Input id="name" value={name} onChange={e => setName(e.target.value)} />
    </FormGroup>
  </Card.Content>
  <Card.Footer className="justify-end">
    <Button variant="outline" onClick={cancel}>取消</Button>
    <Button onClick={save}>儲存</Button>
  </Card.Footer>
</Card>
```

> **為何選 Compound Component？** 相較於獨立匯出 `CardHeader`、`CardTitle` 等，`Card.Header`、`Card.Title` 的寫法在 IDE 中輸入 `Card.` 即可看到所有子元件的自動完成，語意更清晰，也不會污染頂層命名空間。

---

### 模式五：表單元件（受控 / 非受控）

**React 對應（`Input.tsx`）：**

```tsx
import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../utils/cn'

export const Input = forwardRef<
  HTMLInputElement,
  ComponentPropsWithoutRef<'input'>
>(({ className, ...rest }, ref) => (
  <input ref={ref} className={cn('cu-input', className)} {...rest} />
))

Input.displayName = 'Input'
```

**React 對應（`Checkbox.tsx`）：**

```tsx
'use client'

import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../utils/cn'

export interface CheckboxProps extends Omit<ComponentPropsWithoutRef<'input'>, 'type'> {
  label?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, children, ...rest }, ref) => (
    <label className={cn('cu-checkbox-wrapper', className)}>
      <input ref={ref} type="checkbox" className="cu-checkbox" {...rest} />
      {label ? <span>{label}</span> : children}
    </label>
  ),
)

Checkbox.displayName = 'Checkbox'
```

**React 對應（`Toggle.tsx`）：**

```tsx
'use client'

import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../utils/cn'

export interface ToggleProps extends Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'size'> {
  size?: 'default' | 'sm' | 'lg'
  label?: string
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ size = 'default', label, className, children, ...rest }, ref) => (
    <label className={cn('cu-toggle-wrapper', className)}>
      <input ref={ref} type="checkbox" className="cu-toggle-input" {...rest} />
      <span className={cn('cu-toggle', size !== 'default' && `cu-toggle-${size}`)}>
        <span className="cu-toggle-thumb" />
      </span>
      {label ? <span>{label}</span> : children}
    </label>
  ),
)

Toggle.displayName = 'Toggle'
```

**React 對應（`Select.tsx`）：**

```tsx
import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../utils/cn'

export const Select = forwardRef<
  HTMLSelectElement,
  ComponentPropsWithoutRef<'select'>
>(({ className, children, ...rest }, ref) => (
  <div className="cu-select-wrapper">
    <select ref={ref} className={cn('cu-select', className)} {...rest}>
      {children}
    </select>
    <svg
      xmlns="http://www.w3.org/2000/svg" width="16" height="16"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="cu-select-icon"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  </div>
))

Select.displayName = 'Select'
```

**使用方式：**

```tsx
function MyForm() {
  const [form, setForm] = useState({
    name: '',
    agree: false,
    darkMode: false,
    country: '',
  })

  return (
    <>
      {/* 受控模式 */}
      <Input
        value={form.name}
        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        placeholder="名稱"
      />

      <Checkbox
        checked={form.agree}
        onChange={e => setForm(f => ({ ...f, agree: e.target.checked }))}
        label="我同意服務條款"
      />

      <Toggle
        checked={form.darkMode}
        onChange={e => setForm(f => ({ ...f, darkMode: e.target.checked }))}
        label="暗色模式"
      />

      <Select
        value={form.country}
        onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
      >
        <option value="">請選擇國家</option>
        <option value="tw">台灣</option>
        <option value="jp">日本</option>
      </Select>

      {/* 非受控模式（搭配 react-hook-form） */}
      <Input {...register('email')} placeholder="Email" />
      <Checkbox {...register('agree')} label="同意" />
    </>
  )
}
```

> React 表單元件不需要像 Vue 的 `v-model` 特殊處理 — 標準的 `value` + `onChange`（或 `checked` + `onChange`）就是 React 的慣例。`forwardRef` 確保 `ref` 透傳，react-hook-form 的 `register()` 可直接 spread。

---

### 模式六：Dialog（受控 open + 原生 `<dialog>`）

**React 對應（`Dialog.tsx`）：**

```tsx
'use client'

import {
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle,
  createContext,
  useContext,
  useCallback,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react'
import { cn } from '../utils/cn'

/* ---- Context ---- */

const DialogContext = createContext<{
  onClose: () => void
} | null>(null)

function useDialogContext() {
  const ctx = useContext(DialogContext)
  if (!ctx) throw new Error('Dialog sub-components must be inside <Dialog>')
  return ctx
}

/* ---- Dialog ---- */

export interface DialogProps extends Omit<ComponentPropsWithoutRef<'dialog'>, 'open'> {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DialogRoot = forwardRef<HTMLDialogElement, DialogProps>(
  ({ open, onOpenChange, className, children, ...rest }, ref) => {
    const innerRef = useRef<HTMLDialogElement>(null)
    useImperativeHandle(ref, () => innerRef.current!)

    useEffect(() => {
      const el = innerRef.current
      if (!el) return
      if (open) {
        if (!el.open) el.showModal()
      } else {
        if (el.open) el.close()
      }
    }, [open])

    const handleBackdropClick = useCallback(
      (e: React.MouseEvent<HTMLDialogElement>) => {
        if (e.target === innerRef.current) onOpenChange(false)
      },
      [onOpenChange],
    )

    const handleClose = useCallback(() => {
      onOpenChange(false)
    }, [onOpenChange])

    return (
      <DialogContext.Provider value={{ onClose: handleClose }}>
        <dialog
          ref={innerRef}
          className={cn('cu-dialog', className)}
          onClick={handleBackdropClick}
          onClose={handleClose}
          {...rest}
        >
          {children}
        </dialog>
      </DialogContext.Provider>
    )
  },
)
DialogRoot.displayName = 'Dialog'

/* ---- DialogHeader ---- */

const DialogHeader = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...rest }, ref) => (
    <div ref={ref} className={cn('cu-dialog-header', className)} {...rest} />
  ),
)
DialogHeader.displayName = 'Dialog.Header'

/* ---- DialogTitle ---- */

const DialogTitle = forwardRef<HTMLHeadingElement, ComponentPropsWithoutRef<'h2'>>(
  ({ className, ...rest }, ref) => (
    <h2 ref={ref} className={cn('cu-dialog-title', className)} {...rest} />
  ),
)
DialogTitle.displayName = 'Dialog.Title'

/* ---- DialogDescription ---- */

const DialogDescription = forwardRef<HTMLParagraphElement, ComponentPropsWithoutRef<'p'>>(
  ({ className, ...rest }, ref) => (
    <p ref={ref} className={cn('cu-dialog-description', className)} {...rest} />
  ),
)
DialogDescription.displayName = 'Dialog.Description'

/* ---- DialogFooter ---- */

const DialogFooter = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...rest }, ref) => (
    <div ref={ref} className={cn('cu-dialog-footer', className)} {...rest} />
  ),
)
DialogFooter.displayName = 'Dialog.Footer'

/* ---- DialogClose ---- */

const DialogClose = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<'button'>>(
  ({ className, children, onClick, ...rest }, ref) => {
    const { onClose } = useDialogContext()

    return (
      <button
        ref={ref}
        type="button"
        className={cn('cu-dialog-close', className)}
        onClick={(e) => {
          onClick?.(e)
          onClose()
        }}
        aria-label="Close"
        {...rest}
      >
        {children ?? (
          <svg
            xmlns="http://www.w3.org/2000/svg" width="16" height="16"
            viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        )}
      </button>
    )
  },
)
DialogClose.displayName = 'Dialog.Close'

/* ---- 匯出 ---- */

export const Dialog = Object.assign(DialogRoot, {
  Header: DialogHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Footer: DialogFooter,
  Close: DialogClose,
})
```

**使用方式：**

```tsx
function ConfirmDialog() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>開啟對話框</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Close />
        <Dialog.Header>
          <Dialog.Title>確認操作</Dialog.Title>
          <Dialog.Description>此操作無法復原，確定要繼續嗎？</Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
          <Button variant="outline" onClick={() => setOpen(false)}>取消</Button>
          <Button variant="destructive" onClick={handleDelete}>確認刪除</Button>
        </Dialog.Footer>
      </Dialog>
    </>
  )
}
```

> `Dialog.Close` 透過 `useContext` 自動取得父層的 `onClose`，不需要手動傳遞 callback。這是 Compound Component + Context 模式的優勢。

---

### 模式七：Alert Dialog（無 backdrop 關閉、攔截 Escape）

**React 對應（`AlertDialog.tsx`）：**

```tsx
'use client'

import {
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle,
  createContext,
  useContext,
  useCallback,
  type ComponentPropsWithoutRef,
} from 'react'
import { cn } from '../utils/cn'

const AlertDialogContext = createContext<{ onClose: () => void } | null>(null)

function useAlertDialogContext() {
  const ctx = useContext(AlertDialogContext)
  if (!ctx) throw new Error('AlertDialog sub-components must be inside <AlertDialog>')
  return ctx
}

export interface AlertDialogProps extends Omit<ComponentPropsWithoutRef<'dialog'>, 'open'> {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const AlertDialogRoot = forwardRef<HTMLDialogElement, AlertDialogProps>(
  ({ open, onOpenChange, className, children, ...rest }, ref) => {
    const innerRef = useRef<HTMLDialogElement>(null)
    useImperativeHandle(ref, () => innerRef.current!)

    useEffect(() => {
      const el = innerRef.current
      if (!el) return
      if (open) {
        if (!el.open) el.showModal()
      } else {
        if (el.open) el.close()
      }
    }, [open])

    // 攔截 Escape — Alert Dialog 不允許 Escape 關閉
    const handleCancel = useCallback((e: React.SyntheticEvent) => {
      e.preventDefault()
    }, [])

    const handleClose = useCallback(() => {
      onOpenChange(false)
    }, [onOpenChange])

    return (
      <AlertDialogContext.Provider value={{ onClose: handleClose }}>
        <dialog
          ref={innerRef}
          className={cn('cu-alert-dialog', className)}
          onCancel={handleCancel}
          onClose={handleClose}
          {...rest}
        >
          {children}
        </dialog>
      </AlertDialogContext.Provider>
    )
  },
)
AlertDialogRoot.displayName = 'AlertDialog'

/* 子元件（Header, Title, Description, Footer）結構同 Dialog，省略重複代碼 */

const AlertDialogHeader = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...rest }, ref) => (
    <div ref={ref} className={cn('cu-alert-dialog-header', className)} {...rest} />
  ),
)

const AlertDialogTitle = forwardRef<HTMLHeadingElement, ComponentPropsWithoutRef<'h2'>>(
  ({ className, ...rest }, ref) => (
    <h2 ref={ref} className={cn('cu-alert-dialog-title', className)} {...rest} />
  ),
)

const AlertDialogDescription = forwardRef<HTMLParagraphElement, ComponentPropsWithoutRef<'p'>>(
  ({ className, ...rest }, ref) => (
    <p ref={ref} className={cn('cu-alert-dialog-description', className)} {...rest} />
  ),
)

const AlertDialogFooter = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...rest }, ref) => (
    <div ref={ref} className={cn('cu-alert-dialog-footer', className)} {...rest} />
  ),
)

export const AlertDialog = Object.assign(AlertDialogRoot, {
  Header: AlertDialogHeader,
  Title: AlertDialogTitle,
  Description: AlertDialogDescription,
  Footer: AlertDialogFooter,
})
```

**使用方式：**

```tsx
<AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
  <AlertDialog.Header>
    <AlertDialog.Title>確定要刪除嗎？</AlertDialog.Title>
    <AlertDialog.Description>此操作無法復原。</AlertDialog.Description>
  </AlertDialog.Header>
  <AlertDialog.Footer>
    <Button variant="outline" onClick={() => setShowConfirm(false)}>取消</Button>
    <Button variant="destructive" onClick={confirmDelete}>確認</Button>
  </AlertDialog.Footer>
</AlertDialog>
```

---

### 模式八：Drawer（方向 prop）

**React 對應（`Drawer.tsx`，核心部分）：**

```tsx
'use client'

export interface DrawerProps extends Omit<ComponentPropsWithoutRef<'dialog'>, 'open'> {
  open: boolean
  onOpenChange: (open: boolean) => void
  side?: 'right' | 'left' | 'top' | 'bottom'
}

const DrawerRoot = forwardRef<HTMLDialogElement, DrawerProps>(
  ({ open, onOpenChange, side = 'right', className, children, ...rest }, ref) => {
    const innerRef = useRef<HTMLDialogElement>(null)
    useImperativeHandle(ref, () => innerRef.current!)

    useEffect(() => {
      const el = innerRef.current
      if (!el) return
      open ? !el.open && el.showModal() : el.open && el.close()
    }, [open])

    return (
      <DrawerContext.Provider value={{ onClose: () => onOpenChange(false) }}>
        <dialog
          ref={innerRef}
          className={cn('cu-drawer', `cu-drawer-${side}`, className)}
          onClick={e => { if (e.target === innerRef.current) onOpenChange(false) }}
          onClose={() => onOpenChange(false)}
          {...rest}
        >
          {children}
        </dialog>
      </DrawerContext.Provider>
    )
  },
)

/* sub-components: Drawer.Header, .Title, .Description, .Content, .Footer, .Close */

export const Drawer = Object.assign(DrawerRoot, {
  Header: DrawerHeader,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Content: DrawerContent,
  Footer: DrawerFooter,
  Close: DrawerClose,
})
```

**使用方式：**

```tsx
<Drawer open={showDrawer} onOpenChange={setShowDrawer} side="right">
  <Drawer.Close />
  <Drawer.Header>
    <Drawer.Title>設定</Drawer.Title>
  </Drawer.Header>
  <Drawer.Content>...</Drawer.Content>
  <Drawer.Footer>
    <Button onClick={() => setShowDrawer(false)}>關閉</Button>
  </Drawer.Footer>
</Drawer>
```

---

### 模式九：Dropdown（hooks 組合 + render prop）

**React 對應（`Dropdown.tsx`）：**

```tsx
'use client'

import {
  forwardRef,
  useRef,
  useState,
  useCallback,
  createContext,
  useContext,
  type ComponentPropsWithoutRef,
} from 'react'
import { cn } from '../utils/cn'
import { useOutsideClick } from '../hooks/use-outside-click'
import { useEscapeKey } from '../hooks/use-escape-key'

/* ---- Context ---- */

const DropdownContext = createContext<{
  isOpen: boolean
  toggle: (e: React.MouseEvent) => void
  close: () => void
} | null>(null)

function useDropdownContext() {
  const ctx = useContext(DropdownContext)
  if (!ctx) throw new Error('Dropdown sub-components must be inside <Dropdown>')
  return ctx
}

/* ---- Dropdown ---- */

const DropdownRoot = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, children, ...rest }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isOpen, setIsOpen] = useState(false)

    const close = useCallback(() => setIsOpen(false), [])
    const toggle = useCallback((e: React.MouseEvent) => {
      e.stopPropagation()
      setIsOpen(v => !v)
    }, [])

    useOutsideClick(containerRef, close)
    useEscapeKey(close)

    return (
      <DropdownContext.Provider value={{ isOpen, toggle, close }}>
        <div
          ref={(node) => {
            (containerRef as any).current = node
            if (typeof ref === 'function') ref(node)
            else if (ref) ref.current = node
          }}
          className={cn('cu-dropdown', className)}
          {...rest}
        >
          {children}
        </div>
      </DropdownContext.Provider>
    )
  },
)
DropdownRoot.displayName = 'Dropdown'

/* ---- DropdownTrigger（方便用法，非必要） ---- */

const DropdownTrigger = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<'button'>>(
  ({ className, onClick, ...rest }, ref) => {
    const { toggle } = useDropdownContext()
    return (
      <button
        ref={ref}
        type="button"
        className={className}
        onClick={(e) => {
          onClick?.(e)
          toggle(e)
        }}
        {...rest}
      />
    )
  },
)
DropdownTrigger.displayName = 'Dropdown.Trigger'

/* ---- DropdownContent ---- */

const DropdownContent = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...rest }, ref) => {
    const { isOpen } = useDropdownContext()
    if (!isOpen) return null

    return (
      <div ref={ref} className={cn('cu-dropdown-content', className)} {...rest} />
    )
  },
)
DropdownContent.displayName = 'Dropdown.Content'

/* ---- DropdownItem ---- */

const DropdownItem = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<'button'>>(
  ({ className, onClick, ...rest }, ref) => {
    const { close } = useDropdownContext()
    return (
      <button
        ref={ref}
        type="button"
        className={cn('cu-dropdown-item', className)}
        onClick={(e) => {
          onClick?.(e)
          close()
        }}
        {...rest}
      />
    )
  },
)
DropdownItem.displayName = 'Dropdown.Item'

/* ---- DropdownLabel ---- */

const DropdownLabel = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...rest }, ref) => (
    <div ref={ref} className={cn('cu-dropdown-label', className)} {...rest} />
  ),
)
DropdownLabel.displayName = 'Dropdown.Label'

/* ---- DropdownSeparator ---- */

const DropdownSeparator = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...rest }, ref) => (
    <div ref={ref} className={cn('cu-dropdown-separator', className)} {...rest} />
  ),
)
DropdownSeparator.displayName = 'Dropdown.Separator'

/* ---- 匯出 ---- */

export const Dropdown = Object.assign(DropdownRoot, {
  Trigger: DropdownTrigger,
  Content: DropdownContent,
  Item: DropdownItem,
  Label: DropdownLabel,
  Separator: DropdownSeparator,
})
```

**使用方式：**

```tsx
<Dropdown>
  <Dropdown.Trigger className="cu-button cu-button-outline cu-button-md">
    選單 <ChevronDownIcon />
  </Dropdown.Trigger>
  <Dropdown.Content>
    <Dropdown.Label>我的帳號</Dropdown.Label>
    <Dropdown.Separator />
    <Dropdown.Item onClick={() => navigate('/profile')}>個人資料</Dropdown.Item>
    <Dropdown.Item onClick={() => navigate('/settings')}>設定</Dropdown.Item>
    <Dropdown.Separator />
    <Dropdown.Item onClick={logout}>登出</Dropdown.Item>
  </Dropdown.Content>
</Dropdown>
```

> `Dropdown.Item` 點擊後自動呼叫 `close()` 關閉選單，使用者不需要手動管理開關狀態。

---

### 模式十：Tabs（Context + `useControllable`）

**React 對應（`Tabs.tsx`）：**

```tsx
'use client'

import {
  forwardRef,
  createContext,
  useContext,
  useCallback,
  type ComponentPropsWithoutRef,
} from 'react'
import { cn } from '../utils/cn'
import { useControllable } from '../hooks/use-controllable'

/* ---- Context ---- */

const TabsContext = createContext<{
  activeTab: string
  select: (value: string) => void
} | null>(null)

function useTabsContext() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('Tabs sub-components must be inside <Tabs>')
  return ctx
}

/* ---- Tabs ---- */

export interface TabsProps extends ComponentPropsWithoutRef<'div'> {
  /** 非受控模式的初始值 */
  defaultValue?: string
  /** 受控模式的當前值 */
  value?: string
  /** 切換 tab 時的回呼 */
  onValueChange?: (value: string) => void
}

const TabsRoot = forwardRef<HTMLDivElement, TabsProps>(
  ({ defaultValue = '', value, onValueChange, className, children, ...rest }, ref) => {
    const [activeTab, setActiveTab] = useControllable({
      value,
      defaultValue,
      onChange: onValueChange,
    })

    const select = useCallback(
      (v: string) => setActiveTab(v),
      [setActiveTab],
    )

    return (
      <TabsContext.Provider value={{ activeTab, select }}>
        <div ref={ref} className={cn('cu-tabs', className)} {...rest}>
          {children}
        </div>
      </TabsContext.Provider>
    )
  },
)
TabsRoot.displayName = 'Tabs'

/* ---- TabsList ---- */

const TabsList = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...rest }, ref) => (
    <div ref={ref} className={cn('cu-tabs-list', className)} {...rest} />
  ),
)
TabsList.displayName = 'Tabs.List'

/* ---- TabsTrigger ---- */

export interface TabsTriggerProps extends ComponentPropsWithoutRef<'button'> {
  value: string
}

const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, className, ...rest }, ref) => {
    const { activeTab, select } = useTabsContext()
    const isActive = activeTab === value

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'cu-tabs-trigger',
          isActive && 'cu-tabs-trigger-active',
          className,
        )}
        onClick={() => select(value)}
        {...rest}
      />
    )
  },
)
TabsTrigger.displayName = 'Tabs.Trigger'

/* ---- TabsContent ---- */

export interface TabsContentProps extends ComponentPropsWithoutRef<'div'> {
  value: string
}

const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value, className, ...rest }, ref) => {
    const { activeTab } = useTabsContext()
    if (activeTab !== value) return null

    return (
      <div ref={ref} className={cn('cu-tabs-content', className)} {...rest} />
    )
  },
)
TabsContent.displayName = 'Tabs.Content'

/* ---- 匯出 ---- */

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
})
```

**使用方式：**

```tsx
{/* 非受控模式 */}
<Tabs defaultValue="account">
  <Tabs.List>
    <Tabs.Trigger value="account">帳號</Tabs.Trigger>
    <Tabs.Trigger value="password">密碼</Tabs.Trigger>
    <Tabs.Trigger value="notifications">通知</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="account">帳號設定...</Tabs.Content>
  <Tabs.Content value="password">密碼設定...</Tabs.Content>
  <Tabs.Content value="notifications">通知設定...</Tabs.Content>
</Tabs>

{/* 受控模式 */}
<Tabs value={tab} onValueChange={setTab}>
  ...
</Tabs>
```

---

### 模式十一：Popover

結構與 Dropdown 近似，同樣使用 Context + `useOutsideClick` + `useEscapeKey`。

**使用方式：**

```tsx
<Popover>
  <Popover.Trigger className="cu-button cu-button-outline cu-button-md">
    開啟 Popover
  </Popover.Trigger>
  <Popover.Content>
    <p>這是一段彈出內容。</p>
  </Popover.Content>
</Popover>
```

---

### 模式十二：Toast（Context + Hooks）

**React 對應（`Toast.tsx`）：**

```tsx
'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../utils/cn'

/* ---- Types ---- */

interface ToastItem {
  id: number
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info'
  duration?: number
}

interface ToastContextValue {
  toast: (options: Omit<ToastItem, 'id'>) => number
  dismiss: (id: number) => void
}

/* ---- Context ---- */

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be inside <ToastProvider>')
  return ctx
}

/* ---- Provider ---- */

export interface ToastProviderProps {
  children: ReactNode
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

export function ToastProvider({
  children,
  position = 'bottom-right',
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextId = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = useCallback(
    (options: Omit<ToastItem, 'id'>) => {
      const id = nextId.current++
      const item: ToastItem = { id, duration: 5000, variant: 'default', ...options }
      setToasts(prev => [...prev, item])
      setTimeout(() => dismiss(id), item.duration)
      return id
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <div className={cn('cu-toast-container', `cu-toast-container-${position}`)}>
            {toasts.map(t => (
              <div key={t.id} className={cn('cu-toast', `cu-toast-${t.variant}`)}>
                <div>
                  {t.title && <div className="cu-toast-title">{t.title}</div>}
                  {t.description && (
                    <div className="cu-toast-description">{t.description}</div>
                  )}
                </div>
                <button
                  className="cu-toast-close"
                  onClick={() => dismiss(t.id)}
                  aria-label="Close"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  )
}
```

**使用方式：**

```tsx
// App.tsx / layout.tsx（根層級掛載一次）
<ToastProvider position="bottom-right">
  <App />
</ToastProvider>

// 任何子元件中
function SaveButton() {
  const { toast } = useToast()

  function handleSave() {
    // ...
    toast({ title: '儲存成功', variant: 'success' })
  }

  return <Button onClick={handleSave}>儲存</Button>
}
```

---

### 模式十三：Accordion / Collapsible（原生 `<details>`）

這些元件使用原生 HTML `<details>` 元素，不需要 `'use client'`，可作為 Server Component。

**React 對應（`Accordion.tsx`）：**

```tsx
import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../utils/cn'

/* ---- Accordion ---- */

const AccordionRoot = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...rest }, ref) => (
    <div ref={ref} className={cn('cu-accordion', className)} {...rest} />
  ),
)
AccordionRoot.displayName = 'Accordion'

/* ---- AccordionItem ---- */

interface AccordionItemProps extends ComponentPropsWithoutRef<'details'> {
  open?: boolean
}

const AccordionItem = forwardRef<HTMLDetailsElement, AccordionItemProps>(
  ({ className, ...rest }, ref) => (
    <details ref={ref} className={cn('cu-accordion-item', className)} {...rest} />
  ),
)
AccordionItem.displayName = 'Accordion.Item'

/* ---- AccordionTrigger ---- */

const AccordionTrigger = forwardRef<HTMLElement, ComponentPropsWithoutRef<'summary'>>(
  ({ className, children, ...rest }, ref) => (
    <summary ref={ref} className={cn('cu-accordion-trigger', className)} {...rest}>
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg" width="16" height="16"
        viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </summary>
  ),
)
AccordionTrigger.displayName = 'Accordion.Trigger'

/* ---- AccordionContent ---- */

const AccordionContent = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...rest }, ref) => (
    <div ref={ref} className={cn('cu-accordion-content', className)} {...rest} />
  ),
)
AccordionContent.displayName = 'Accordion.Content'

/* ---- 匯出 ---- */

export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
})
```

**使用方式：**

```tsx
<Accordion>
  <Accordion.Item open>
    <Accordion.Trigger>什麼是 Cubby UI？</Accordion.Trigger>
    <Accordion.Content>一個框架無關的 UI 元件庫。</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item>
    <Accordion.Trigger>支援哪些框架？</Accordion.Trigger>
    <Accordion.Content>任何使用 HTML + CSS 的環境。</Accordion.Content>
  </Accordion.Item>
</Accordion>
```

---

### 模式十四：HoverCard / Tooltip（純 CSS）

**React 對應（`Tooltip.tsx`）：**

```tsx
import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../utils/cn'

export interface TooltipProps extends ComponentPropsWithoutRef<'span'> {
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export const Tooltip = forwardRef<HTMLSpanElement, TooltipProps>(
  ({ content, position = 'top', className, ...rest }, ref) => (
    <span
      ref={ref}
      className={cn(
        'cu-tooltip',
        position !== 'top' && `cu-tooltip-${position}`,
        className,
      )}
      data-tooltip={content}
      {...rest}
    />
  ),
)

Tooltip.displayName = 'Tooltip'
```

**使用方式：**

```tsx
<Tooltip content="這是提示文字">
  <Button variant="ghost" size="icon"><InfoIcon /></Button>
</Tooltip>

<Tooltip content="底部提示" position="bottom">
  <span>Hover me</span>
</Tooltip>
```

---

### 模式十五：Typography（動態標籤）

**React 對應（`Heading.tsx`）：**

```tsx
import { forwardRef, type ComponentPropsWithoutRef, type ElementType } from 'react'
import { cn } from '../utils/cn'

type HeadingLevel = 1 | 2 | 3 | 4

export interface HeadingProps extends ComponentPropsWithoutRef<'h1'> {
  level?: HeadingLevel
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level = 1, className, ...rest }, ref) => {
    const Tag = `h${level}` as ElementType
    return <Tag ref={ref} className={cn(`cu-h${level}`, className)} {...rest} />
  },
)

Heading.displayName = 'Heading'
```

**React 對應（`Paragraph.tsx`）：**

```tsx
import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../utils/cn'

export interface ParagraphProps extends ComponentPropsWithoutRef<'p'> {
  variant?: 'default' | 'lead'
}

export const Paragraph = forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ variant = 'default', className, ...rest }, ref) => (
    <p
      ref={ref}
      className={cn(
        'cu-paragraph',
        variant === 'lead' && 'cu-paragraph-lead',
        className,
      )}
      {...rest}
    />
  ),
)

Paragraph.displayName = 'Paragraph'
```

**使用方式：**

```tsx
<Heading level={1}>頁面標題</Heading>
<Heading level={3} className="text-primary">副標題</Heading>
<Paragraph variant="lead">這是一段引導文字。</Paragraph>
```

---

## Server Component 相容性

React Server Component（RSC）是 Next.js App Router 的預設模式。Cubby UI 元件分為兩類：

| 類型 | 需要 `'use client'`？ | 元件 |
|---|---|---|
| **純展示** | 否（可作為 RSC） | Card, Badge, Alert, Avatar, Breadcrumb, Label, Heading, Paragraph, Blockquote, List, Link, Hr, Separator, Container, Header, Skeleton, EmptyState, Stat, Progress, FormGroup, FormDescription, FormError |
| **互動** | 是 | Button*, Dialog, AlertDialog, Drawer, Dropdown, Popover, Tabs, Accordion*, Collapsible*, Toggle, Checkbox, Input, Textarea, Select, Range, SearchInput, FileInput, Nav.Item*, Tooltip, HoverCard, Toast |

> `*` 標記的元件雖然不一定需要 `useState`，但因為可能接收 `onClick` 等事件處理器，實務上通常標記為 client component。純 CSS 的 Accordion/Collapsible 可選擇不標記。

**原則：** 只在檔案頂部加 `'use client'` 於確實使用 hooks 或事件綁定的元件。純 CSS 展示元件不加，讓使用者享受 RSC 的零 JS 傳輸優勢。

---

## 總入口 `index.ts`

```ts
// --- Components ---
export { Button, type ButtonProps } from './components/Button'
export { Badge, type BadgeProps } from './components/Badge'
export { Separator } from './components/Separator'
export { ButtonGroup } from './components/ButtonGroup'
export { Card } from './components/Card'
export { Alert } from './components/Alert'
export { AlertDialog, type AlertDialogProps } from './components/AlertDialog'
export { Dialog, type DialogProps } from './components/Dialog'
export { Drawer, type DrawerProps } from './components/Drawer'
export { Dropdown } from './components/Dropdown'
export { Accordion } from './components/Accordion'
export { Avatar } from './components/Avatar'
export { Breadcrumb } from './components/Breadcrumb'
export { Collapsible } from './components/Collapsible'
export { EmptyState } from './components/EmptyState'
export { HoverCard } from './components/HoverCard'
export { Menubar } from './components/Menubar'
export { Pagination } from './components/Pagination'
export { Popover } from './components/Popover'
export { Stat } from './components/Stat'
export { Tabs, type TabsProps, type TabsTriggerProps, type TabsContentProps } from './components/Tabs'
export { Tooltip, type TooltipProps } from './components/Tooltip'
export { Header } from './components/Header'
export { Sidebar } from './components/Sidebar'
export { Nav, type NavProps, type NavItemProps } from './components/Nav'
export { Container, type ContainerProps } from './components/Container'

export { Label } from './components/Label'
export { Input } from './components/Input'
export { Textarea } from './components/Textarea'
export { Select } from './components/Select'
export { Checkbox, type CheckboxProps } from './components/Checkbox'
export { Radio } from './components/Radio'
export { Toggle, type ToggleProps } from './components/Toggle'
export { Range } from './components/Range'
export { SearchInput } from './components/SearchInput'
export { FileInput } from './components/FileInput'
export { FormGroup } from './components/FormGroup'
export { FormDescription } from './components/FormDescription'
export { FormError } from './components/FormError'
export { Progress } from './components/Progress'
export { Skeleton } from './components/Skeleton'

export { Heading, type HeadingProps } from './components/Heading'
export { Paragraph, type ParagraphProps } from './components/Paragraph'
export { Blockquote } from './components/Blockquote'
export { Link } from './components/Link'
export { List } from './components/List'
export { Hr } from './components/Hr'

// --- Toast ---
export { ToastProvider, useToast, type ToastProviderProps } from './components/Toast'

// --- Hooks ---
export { useToggle } from './hooks/use-toggle'
export { useOutsideClick } from './hooks/use-outside-click'
export { useEscapeKey } from './hooks/use-escape-key'
export { useControllable } from './hooks/use-controllable'

// --- Utils ---
export { cn } from './utils/cn'
```

---

## 打包設定

### `tsup.config.ts`

```ts
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  treeshake: true,
  clean: true,
  external: ['react', 'react-dom'],
  esbuildOptions(options) {
    options.jsx = 'automatic'
  },
  banner: {
    js: "'use client';",
  },
})
```

> 使用 `tsup` 而非 Vite library mode，因為 tsup 對 React 生態的 `'use client'` directive、CJS/ESM dual output、`.d.ts` 生成支援更成熟。

### `package.json`

```json
{
  "name": "cubby-ui-react",
  "version": "0.1.0",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.mts",
        "default": "./dist/index.mjs"
      },
      "require": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      }
    }
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tsup": "^8.0.0",
    "typescript": "^5.5.0"
  },
  "sideEffects": false
}
```

---

## 使用方式

### 按需引入（推薦，支援 tree-shaking）

```tsx
import { Button, Card, Dialog, useToast } from 'cubby-ui-react'
```

### CSS 引入

React 元件不打包 CSS，使用者需自行引入 Cubby UI 的 CSS：

**Next.js：**

```css
/* app/globals.css */
@import "tailwindcss";
@import "cubby-ui/css/components.css";

@theme {
  --color-primary: hsl(221 83% 53%);
  --color-primary-foreground: hsl(0 0% 100%);
  /* ... Cubby UI design tokens ... */
}
```

**Vite / CRA：**

```css
/* src/index.css */
@import "tailwindcss";
@import "cubby-ui/css/components.css";

@theme { /* ... */ }
```

---

## 完整元件清單

### Typography（7 個）

| React 元件 | Props | HTML 元素 | RSC |
|---|---|---|---|
| `<Heading>` | `level` (1–4) | `<h1>`–`<h4>` | Yes |
| `<Paragraph>` | `variant` (default, lead) | `<p>` | Yes |
| `<Blockquote>` | — | `<blockquote>` | Yes |
| `<List>` | `type` (disc, decimal) | `<ul>` / `<ol>` | Yes |
| `<Link>` | — | `<a>` | Yes |
| `<Hr>` | — | `<hr>` | Yes |

### Basic（5 群組，Compound Component）

| React 元件 | Props | RSC |
|---|---|---|
| `<Button>` | `variant`, `size` | No |
| `<ButtonGroup>` | `vertical` | Yes |
| `<Card>` + `.Header` `.Title` `.Description` `.Content` `.Footer` | — | Yes |
| `<Separator>` | `orientation` | Yes |
| `<Badge>` | `variant` | Yes |

### Forms（13 個，支援 `value` + `onChange` 受控模式）

| React 元件 | Props | 受控型別 |
|---|---|---|
| `<Label>` | — | — |
| `<Input>` | — | `string` |
| `<Textarea>` | — | `string` |
| `<Select>` | — | `string` |
| `<Checkbox>` | `label` | `boolean` |
| `<Radio>` | `label` | `string` |
| `<Toggle>` | `size`, `label` | `boolean` |
| `<SearchInput>` | — | `string` |
| `<FileInput>` | — | — |
| `<Range>` | — | `number` |
| `<FormGroup>` | — | — |
| `<FormDescription>` | — | — |
| `<FormError>` | — | — |

### Data Display（6 群組）

| React 元件 | Props | 互動方式 | RSC |
|---|---|---|---|
| `<Accordion>` + `.Item` `.Trigger` `.Content` | `open` (Item) | 原生 `<details>` | Yes |
| `<Collapsible>` + `.Trigger` `.Content` | `open` | 原生 `<details>` | Yes |
| `<Avatar>` + `.Image` `.Fallback` | — | 純 CSS | Yes |
| `<Badge>` | `variant` | 純 CSS | Yes |
| `<Stat>` + `.Header` `.Label` `.Value` `.Description` `.Trend` | `trend` | 純 CSS | Yes |

### Feedback（5 群組）

| React 元件 | Props | RSC |
|---|---|---|
| `<Alert>` + `.Title` `.Description` | `variant` | Yes |
| `<Progress>` | `value` | Yes |
| `<Skeleton>` | — | Yes |
| `<EmptyState>` + `.Icon` `.Title` `.Description` `.Action` | — | Yes |
| `<ToastProvider>` + `useToast()` | `position` | No |

### Overlay（7 群組，React 狀態管理）

| React 元件 | Props | 狀態控制 |
|---|---|---|
| `<Dialog>` + `.Header` `.Title` `.Description` `.Footer` `.Close` | — | `open` + `onOpenChange` |
| `<AlertDialog>` + `.Header` `.Title` `.Description` `.Footer` | — | `open` + `onOpenChange`（無 backdrop/Escape 關閉） |
| `<Drawer>` + `.Header` `.Title` `.Description` `.Content` `.Footer` `.Close` | `side` | `open` + `onOpenChange` |
| `<Dropdown>` + `.Trigger` `.Content` `.Item` `.Label` `.Separator` | — | 內部 `useState`（自動管理） |
| `<Popover>` + `.Trigger` `.Content` | — | 內部 `useState`（自動管理） |
| `<HoverCard>` + `.Content` | — | 純 CSS hover |
| `<Tooltip>` | `content`, `position` | 純 CSS hover |

### Navigation（4 群組）

| React 元件 | Props |
|---|---|
| `<Breadcrumb>` + `.Item` `.Link` `.Separator` `.Current` | — |
| `<Menubar>` + `.Menu` `.Trigger` `.Content` `.Item` `.Separator` `.Label` `.Shortcut` | — |
| `<Pagination>` + `.Item` `.Prev` `.Next` `.Ellipsis` | `active` (Item) |
| `<Tabs>` + `.List` `.Trigger` `.Content` | `defaultValue` / `value` + `onValueChange` |

### Layout（4 群組）

| React 元件 | Props | RSC |
|---|---|---|
| `<Container>` | `size` | Yes |
| `<Header>` + `.Inner` `.Brand` `.Nav` `.Actions` | — | Yes |
| `<Nav>` + `.Item` | `vertical` (Nav), `active` (Item) | Yes |
| `<Sidebar>` + `.Header` `.Content` `.Footer` `.Section` `.SectionTitle` `.Group` `.GroupTitle` `.Item` `.Separator` | `active` (Item) | Yes |

---

## React 版的設計決策

### 1. Compound Component vs 獨立匯出

| 決策 | 理由 |
|---|---|
| `Card.Header` 而非 `CardHeader` | IDE 自動完成友好；輸入 `Card.` 即可看到所有子元件 |
| 同一檔案定義 | 強化語意關聯，減少 import 數量 |
| `Object.assign` 掛載 | 保留 `forwardRef` 型別推導，tree-shaking 仍有效 |

### 2. `forwardRef` 全覆蓋

| 決策 | 理由 |
|---|---|
| 所有元件使用 `forwardRef` | react-hook-form `register()` 需要 ref |
| | framer-motion `<motion.div>` 需要 ref |
| | 測試中 `ref.current` 存取 DOM |
| | 與 Radix UI / shadcn 慣例一致 |

### 3. `'use client'` 最小化

| 決策 | 理由 |
|---|---|
| 僅互動元件加 `'use client'` | 純展示元件可作為 RSC，零 JS 傳輸 |
| 不在 `index.ts` 加 | 避免污染所有匯出 |

### 4. 受控 / 非受控雙模式

| 決策 | 理由 |
|---|---|
| Tabs / Dialog 等支援 `value` + `defaultValue` | 與 React 原生表單元素行為一致 |
| `useControllable` hook 統一處理 | 減少重複邏輯 |

---

## 與其他方案的比較

| 面向 | React 元件 | Vue 元件 | Blade 匿名元件 | Web Components |
|---|---|---|---|---|
| 型別安全 | `interface Props` + `forwardRef` 泛型 | `defineProps<T>()` | 無 | 無 |
| 狀態管理 | `useState` / Context | `ref()` / `provide/inject` | 伺服器端 | vanilla JS |
| 子元件語法 | `Card.Header`（Compound） | `<CuCardHeader>`（獨立匯出） | `<x-cu.card.header>` | `<cu-card-header>` |
| Ref 透傳 | `forwardRef` | `defineExpose` | 不適用 | 不適用 |
| SSR / RSC | 純展示元件可作 RSC | Nuxt SSR | Laravel SSR | 不支援 |
| 表單整合 | react-hook-form `register()` | `v-model` | `old()` / `$errors` | 手動 |
| Tree-shaking | 完整支援 | 完整支援 | 不適用 | 需手動拆分 |
| 打包體積 | ~6-10 KB gzip（按需） | ~5-8 KB gzip | 0 KB（模板） | ~1.5-5 KB gzip |
| 適用場景 | Next.js / Remix / Vite React | Nuxt / Vite Vue | Laravel 全端 | 任何環境 |

---

## Next.js App Router 整合

```
app/
├── layout.tsx          -- ToastProvider 掛載
├── globals.css         -- @import cubby CSS + @theme
└── dashboard/
    └── page.tsx        -- 使用元件（RSC + Client 混合）
```

```tsx
// app/layout.tsx
import { ToastProvider } from 'cubby-ui-react'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>
        <ToastProvider position="bottom-right">
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
```

```tsx
// app/dashboard/page.tsx (Server Component)
import { Card, Heading, Paragraph } from 'cubby-ui-react'
import { DashboardActions } from './actions' // Client Component

export default function DashboardPage() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Dashboard</Card.Title>  {/* RSC — 零 JS */}
      </Card.Header>
      <Card.Content>
        <Heading level={2}>歡迎回來</Heading>  {/* RSC */}
        <Paragraph>這裡是您的控制台。</Paragraph>  {/* RSC */}
        <DashboardActions />  {/* Client Component — 互動 */}
      </Card.Content>
    </Card>
  )
}
```

---

## 優缺點總結

| 優點 | 缺點 |
|---|---|
| 完全複用現有 `cu-*` CSS，零重複維護 | 僅限 React 18+ 生態系 |
| Compound Component 語法直覺（`Card.Header`） | Compound Component 需 `Object.assign` 技巧 |
| `forwardRef` 確保 ref 透傳，相容 react-hook-form / framer-motion | 每個元件都要寫 `forwardRef` boilerplate |
| 純展示元件可作為 RSC，零 JS 開銷 | 需區分 `'use client'` / RSC |
| `useControllable` 統一受控 / 非受控模式 | |
| Context 驅動的 Dialog.Close / Dropdown.Item 自動行為 | |
| Tree-shaking + code splitting 按需載入 | |
| TypeScript 完整型別推導與自動完成 | |
| 與 Next.js / Remix / Vite 無縫整合 | |
