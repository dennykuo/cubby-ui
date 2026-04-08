# Cubby UI — Lit Web Components 方案

## 背景

延伸 `web-components-plan.md` 的方案三（Shadow DOM），選定 Lit 作為 Web Components 框架。Lit 提供響應式屬性、高效模板 diff、Constructable Stylesheets 共享、SSR 支援，適合 Cubby UI 80+ 元件的規模。

---

## 為什麼選 Lit

| 考量 | 決策 |
|------|------|
| 框架 | Lit（~5KB gzipped），Google 長期維護，社群活躍 |
| Shadow DOM vs Light DOM | **Shadow DOM** — 原生 `<slot>` 支援、樣式封裝、元件自包含 |
| 樣式策略 | CSS Variables 繼承（`:root` 定義的 token 穿透 Shadow DOM）+ scoped CSS |
| SSR | `@lit-labs/ssr` + `@astrojs/lit`，解決 FOUC |
| 打包 | 按元件 tree-shake 或 all-in-one bundle |

---

## 核心架構

### CSS Variables 策略

現有 `theme.css` 的 CSS variables 定義在 `:root`，Shadow DOM 自然繼承：

```css
/* theme.css（不變） */
:root {
  --color-primary: ...;
  --color-primary-foreground: ...;
  --color-border: ...;
  --radius-md: ...;
  --shadow-sm: ...;
}
```

Shadow DOM 內直接引用：

```js
static styles = css`
  button {
    background: var(--color-primary);
    color: var(--color-primary-foreground);
    border-radius: var(--radius-md);
  }
`
```

### 暗色模式

偵測宿主 `:host-context(.dark)` 或監聽 `<html>` class 變化：

```js
static styles = css`
  :host-context(.dark) button {
    background: var(--color-primary);  /* dark token 已在 .dark 下覆蓋 */
  }
`
```

因為 CSS variables 在 `.dark` 下已重新定義，Shadow DOM 內自動跟隨，多數情況不需額外處理。

### 共享樣式

```js
// shared-styles.ts — 跨元件共用的 reset 和基礎樣式
export const baseStyles = css`
  :host { box-sizing: border-box; }
  :host([hidden]) { display: none; }
  *, *::before, *::after { box-sizing: inherit; }
`

export const formStyles = css`
  :host(:disabled), :host([disabled]) {
    pointer-events: none;
    opacity: 0.5;
  }
`
```

---

## 元件範例

### Button（簡單元件）

```ts
import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { baseStyles } from '../shared-styles'

@customElement('cu-button')
export class CuButton extends LitElement {
  @property() variant: 'default' | 'outline' | 'destructive' | 'ghost' | 'link' = 'default'
  @property() size: 'default' | 'sm' | 'lg' | 'icon' = 'default'
  @property() href = ''
  @property({ type: Boolean }) disabled = false

  static styles = [baseStyles, css`
    :host { display: inline-block; }

    button, a {
      display: inline-flex; align-items: center; justify-content: center;
      gap: 0.5rem;
      border: none; border-radius: var(--radius-md);
      font-size: 0.875rem; font-weight: 500;
      cursor: pointer;
      transition: background 150ms, box-shadow 150ms, color 150ms;
    }

    /* 尺寸 */
    :host([size="default"]) button, :host([size="default"]) a,
    button, a { height: 2.25rem; padding: 0.5rem 1rem; }
    :host([size="sm"]) button, :host([size="sm"]) a { height: 2rem; padding: 0.25rem 0.75rem; font-size: 0.8125rem; }
    :host([size="lg"]) button, :host([size="lg"]) a { height: 2.75rem; padding: 0.625rem 1.5rem; }

    /* 變體 */
    :host([variant="default"]) button, button {
      background: var(--color-primary);
      color: var(--color-primary-foreground);
    }
    :host([variant="default"]) button:hover, button:hover {
      box-shadow: var(--shadow-sm);
    }

    :host([variant="outline"]) button {
      border: 1px solid var(--color-border);
      background: transparent;
      color: var(--color-foreground);
    }
    :host([variant="outline"]) button:hover {
      background: var(--color-muted);
    }

    :host([variant="destructive"]) button {
      background: var(--color-destructive);
      color: var(--color-destructive-foreground);
    }

    :host([variant="ghost"]) button {
      background: transparent;
      color: var(--color-muted-foreground);
    }
    :host([variant="ghost"]) button:hover {
      background: var(--color-muted);
      color: var(--color-foreground);
    }

    /* disabled */
    :host([disabled]) button {
      pointer-events: none; opacity: 0.5;
    }
  `]

  render() {
    if (this.href) {
      return html`<a href=${this.href}><slot></slot></a>`
    }
    return html`<button ?disabled=${this.disabled}><slot></slot></button>`
  }
}
```

### Card（具名 Slot）

```ts
import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { baseStyles } from '../shared-styles'

@customElement('cu-card')
export class CuCard extends LitElement {
  @property({ type: Boolean }) elevated = false
  @property({ type: Boolean }) hover = false

  static styles = [baseStyles, css`
    :host {
      display: block;
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      background: var(--color-card);
      color: var(--color-card-foreground);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
    }
    :host([elevated]) { box-shadow: var(--shadow-md); }
    :host([hover]):hover { box-shadow: var(--shadow-md); }

    .header { padding: 1.5rem 1.5rem 0; }
    .header ::slotted(h1), .header ::slotted(h2), .header ::slotted(h3) {
      font-weight: 600; line-height: 1.25;
    }
    .content { padding: 1.5rem; }
    .footer {
      padding: 0 1.5rem 1.5rem;
      display: flex; align-items: center; gap: 0.5rem;
    }
  `]

  render() {
    return html`
      <div class="header"><slot name="header"></slot></div>
      <div class="content"><slot></slot></div>
      <div class="footer"><slot name="footer"></slot></div>
    `
  }
}
```

使用方式：

```html
<cu-card hover>
  <h3 slot="header">Card Title</h3>
  <p>Card content goes here.</p>
  <div slot="footer">
    <cu-button variant="outline">Cancel</cu-button>
    <cu-button>Confirm</cu-button>
  </div>
</cu-card>
```

### Dialog（互動元件 + Slot）

```ts
import { LitElement, html, css } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { baseStyles } from '../shared-styles'

@customElement('cu-dialog')
export class CuDialog extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false
  @property() size: 'sm' | 'default' | 'lg' | 'xl' | 'full' = 'default'

  @query('dialog') private dialogEl!: HTMLDialogElement

  static styles = [baseStyles, css`
    dialog {
      border: none; border-radius: var(--radius-xl);
      background: var(--color-card);
      color: var(--color-card-foreground);
      box-shadow: var(--shadow-lg);
      padding: 0;
      max-width: 32rem; width: 90vw;
    }
    dialog::backdrop {
      background: rgba(0, 0, 0, 0.5);
    }
    .header { padding: 1.5rem 1.5rem 0; }
    .body { padding: 1.5rem; }
    .footer { padding: 0 1.5rem 1.5rem; display: flex; justify-content: flex-end; gap: 0.5rem; }
    .close {
      position: absolute; top: 1rem; right: 1rem;
      background: none; border: none; cursor: pointer;
      color: var(--color-muted-foreground);
    }
  `]

  show() { this.dialogEl.showModal(); this.open = true; }
  close() { this.dialogEl.close(); this.open = false; }

  render() {
    return html`
      <dialog @close=${() => this.open = false}>
        <button class="close" @click=${this.close} aria-label="Close">✕</button>
        <div class="header"><slot name="header"></slot></div>
        <div class="body"><slot></slot></div>
        <div class="footer"><slot name="footer"></slot></div>
      </dialog>
    `
  }
}
```

使用方式：

```html
<cu-button onclick="document.querySelector('#dlg').show()">Open</cu-button>

<cu-dialog id="dlg">
  <h2 slot="header">Dialog Title</h2>
  <p>Dialog content here.</p>
  <div slot="footer">
    <cu-button variant="outline" onclick="document.querySelector('#dlg').close()">Cancel</cu-button>
    <cu-button>Confirm</cu-button>
  </div>
</cu-dialog>
```

---

## 與現有架構的關係

| 層次 | 用途 | 目標使用者 |
|------|------|-----------|
| CSS 類別層（`cu-*`） | 底層樣式定義 | Tailwind 使用者、進階客製化 |
| Astro 元件層 | 文檔站 + Astro 專案 | Astro 開發者 |
| **Lit Web Components（新）** | 跨框架通用 | 任何環境（Laravel、WordPress、vanilla HTML） |

三層可獨立使用，也可共存。Lit 層的樣式從 CSS 類別層的設計 token（CSS variables）衍生，保持視覺一致性。

---

## 打包策略

```
dist/
├── cubby-ui.css            # 現有（不變）
├── cubby-ui.js             # 現有互動 JS（不變）
├── cubby-wc.js             # Lit Web Components all-in-one（新）
├── cubby-wc.min.js         # 壓縮版（新）
├── cubby-wc/               # 按元件拆分（新，tree-shake 用）
│   ├── cu-button.js
│   ├── cu-card.js
│   ├── cu-dialog.js
│   └── ...
└── src/                    # 現有（不變）
```

使用者可選擇：
- `<script src="cubby-wc.min.js">` 全量載入
- `import 'cubby-ui/wc/cu-button'` 按需引入

---

## Astro 整合

```bash
npm install @astrojs/lit
```

```js
// astro.config.mjs
import lit from '@astrojs/lit'
export default { integrations: [lit()] }
```

Lit 元件在 Astro 中可直接 SSR，搭配 `client:visible` 等指令做 hydration。

---

## 待決議事項

1. **元件優先級**：先實作高頻元件（Button、Card、Badge、Input、Dialog）還是全量？
2. **表單整合**：Shadow DOM 內的 `<input>` 不會自動參與外部 `<form>` 提交，需 `ElementInternals` API
3. **CSS-in-JS 維護**：Lit `static styles` 中的 CSS 與現有 Tailwind CSS 是否需要自動同步機制？
4. **命名空間**：Custom Element tag 使用 `cu-*` 還是 `cubby-*`（避免與 CSS class 前綴混淆）？
5. **Tailwind utility 客製化**：Shadow DOM 內無法使用外部 Tailwind utility，是否提供 `::part()` 作為擴展點？
