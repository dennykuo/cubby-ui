import { test, expect, type Locator, type Page } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  ROOT,
  componentsJsonExamples,
  docsExamples,
  knownDataAttrs,
  llmsExamples,
  rawNestingProblems,
  rawScriptProblems,
  type Example,
} from "./example-sources";

/**
 * 範例標記驗證
 * ---------------------------------------------------------------------------
 * AI agent 與使用者會原樣照抄 `components.json` 的 `example`、`llms.txt` 的 HTML 範例與
 * 文檔頁 Code 分頁的字串，因此每個範例都必須「照抄就能動」。本 spec 把每段範例放進只載入
 * `dist/core/cubby-ui.{css,js}` 的頁面（範例外層包一層 <form>，模擬放在表單內），檢查：
 *
 * 靜態（解析後、初始化前的標記）
 *   - 巢狀互動元素（<button> 內的 <button> / <a href> / 可聚焦元素等）
 *   - 未知的 data-cu-* 屬性（cubby-ui.js 不會讀取 → 拼字錯誤或過時屬性）
 *   - 子元件屬性不在根元素內（例如 data-cu-dialog-close 所在的 <dialog> 沒有 data-cu-dialog）
 *   - 根元素缺少 JS 必要的子元件（例如 data-cu-carousel 內沒有 data-cu-carousel-viewport）
 *   - 帶有互動 class 卻沒接上 JS 屬性（例如 .cu-carousel-prev 沒有 data-cu-carousel-prev）
 *   - 觸發器不是原生可鍵盤操作的元素（<div> / <span> 觸發器無法 Tab 聚焦或以 Enter 啟動）
 *   - 表單類元件內的 <button> 沒有 type（放進 <form> 會變成 submit）
 *   - 觸發器指向的 id / selector 不存在、tabs trigger 與 content 的值對不上、label 沒有關聯控制項
 *   - 範例自帶的 <script> 以 querySelectorAll("[data-cu-*]").forEach 重新實作元件（與 cubby-ui.js 重複綁定）
 * 執行期
 *   - 沒有未捕捉例外與 console error；表單類元件的按鈕在操作過程中沒有送出外層 <form>
 *   - 依元件實際操作（開啟浮層、選取項目、切換狀態……），驗證 cubby-ui.js 有接手
 *
 * 文檔頁範例來自 docs/（CI 會先 build:docs），未建置時該組略過。
 *
 * 無法自動判斷而未做操作驗證的部分（仍做靜態檢查）：
 *   - Sortable List / Kanban：原生 HTML5 拖放，只檢查 draggable="true" 與結構
 *   - Image Compare / Color Picker 色盤：只支援滑鼠 / 觸控拖曳，只檢查初始化
 *   - Copy Button：剪貼簿權限因環境而異，只檢查進入 data-cu-copied 或 data-cu-copy-failed 狀態
 *   - Code Block：複製只走 Clipboard API（測試頁不是安全來源），只做靜態檢查
 *   - Back to Top：需要捲動頁面，只檢查結構
 *   - Context Menu 項目：選單只能以右鍵開啟（容器無法聚焦），不檢查項目的鍵盤操作
 *   - Tour：步驟目標不在範例中時無法開始，改為靜態檢查目標是否存在
 */

const DIST_CSS = resolve(ROOT, "dist/core/cubby-ui.css");
const DIST_JS = resolve(ROOT, "dist/core/cubby-ui.js");
const ORIGIN = "http://cubby-examples.test";

/**
 * 已知、需修改 cubby-ui.js 才能解決的限制：比對到的問題不算失敗（列在這裡以便追蹤）。
 * 每筆都必須說明原因；JS 修正後應移除對應項目。
 */
const KNOWN_JS_LIMITATIONS: Array<{ match: RegExp; reason: string }> = [
  {
    match: /^(巢狀互動元素|無法以鍵盤操作)：.*data-cu-tabs-close/,
    reason:
      "Closable Tabs：tabs.js 以 closeBtn.closest('[data-cu-tabs-trigger]') 找所屬分頁，關閉鈕只能寫在 trigger <button> 內，" +
      "無法同時避免巢狀互動元素並支援鍵盤關閉，需調整 JS 結構",
  },
  {
    match: /未知屬性 data-cu-image-compare-position/,
    reason:
      "Image Compare：文檔描述以 data-cu-image-compare-position 設定初始位置，但 image-compare.js 固定 setPosition(50)，需在 JS 讀取該屬性",
  },
];

/** 表單類元件（component-nav 的 Forms 分類）：放在 <form> 內很常見，按鈕必須明確 type */
const FORM_ROOTS = [
  "[data-cu-combobox]",
  "[data-cu-multi-select]",
  "[data-cu-date-picker]",
  "[data-cu-number-input]",
  "[data-cu-password-input]",
  "[data-cu-tag-input]",
  "[data-cu-color-picker]",
  "[data-cu-transfer-list]",
  "[data-cu-input-clearable]",
  "[data-cu-toggle-group]",
  "[data-cu-rating]",
  "[data-cu-dropzone]",
  "[data-cu-checkbox-group]",
  "[data-cu-pin-input]",
];

/** 子元件屬性 → 必須位於其內的根元素（不在根內 cubby-ui.js 不會處理） */
const PART_ROOT: Record<string, string> = {
  "data-cu-tabs-trigger": "[data-cu-tabs]",
  "data-cu-tabs-content": "[data-cu-tabs]",
  "data-cu-tabs-close": "[data-cu-tabs-trigger]",
  "data-cu-tabs-scroll-start": "[data-cu-tabs-scrollable]",
  "data-cu-tabs-scroll-end": "[data-cu-tabs-scrollable]",
  "data-cu-dropdown-trigger": "[data-cu-dropdown]",
  "data-cu-dropdown-content": "[data-cu-dropdown]",
  "data-cu-combobox-trigger": "[data-cu-combobox]",
  "data-cu-combobox-value": "[data-cu-combobox]",
  "data-cu-combobox-content": "[data-cu-combobox]",
  "data-cu-combobox-input": "[data-cu-combobox]",
  "data-cu-combobox-list": "[data-cu-combobox]",
  "data-cu-combobox-item": "[data-cu-combobox]",
  "data-cu-combobox-empty": "[data-cu-combobox]",
  "data-cu-multi-select-trigger": "[data-cu-multi-select]",
  "data-cu-multi-select-content": "[data-cu-multi-select]",
  "data-cu-multi-select-input": "[data-cu-multi-select]",
  "data-cu-multi-select-list": "[data-cu-multi-select]",
  "data-cu-multi-select-item": "[data-cu-multi-select]",
  "data-cu-multi-select-tags": "[data-cu-multi-select]",
  "data-cu-multi-select-placeholder": "[data-cu-multi-select]",
  "data-cu-multi-select-empty": "[data-cu-multi-select]",
  "data-cu-number-field": "[data-cu-number-input]",
  "data-cu-number-decrement": "[data-cu-number-input]",
  "data-cu-number-increment": "[data-cu-number-input]",
  "data-cu-dropzone-input": "[data-cu-dropzone]",
  "data-cu-dialog-close": "[data-cu-dialog]",
  "data-cu-drawer-close": "[data-cu-drawer]",
  "data-cu-alert-dialog-cancel": "[data-cu-alert-dialog]",
  "data-cu-alert-dialog-action": "[data-cu-alert-dialog]",
  "data-cu-popover-trigger": "[data-cu-popover]",
  "data-cu-popover-content": "[data-cu-popover]",
  "data-cu-menubar-menu": "[data-cu-menubar]",
  "data-cu-menubar-trigger": "[data-cu-menubar-menu]",
  "data-cu-menubar-content": "[data-cu-menubar-menu]",
  "data-cu-transfer-panel": "[data-cu-transfer-list]",
  "data-cu-transfer-to-right": "[data-cu-transfer-list]",
  "data-cu-transfer-to-left": "[data-cu-transfer-list]",
  "data-cu-transfer-check": "[data-cu-transfer-panel]",
  "data-cu-transfer-check-all": "[data-cu-transfer-list]",
  "data-cu-transfer-count": "[data-cu-transfer-list]",
  "data-cu-transfer-search": "[data-cu-transfer-list]",
  "data-cu-mobile-nav-close": "[data-cu-mobile-nav-panel]",
  "data-cu-rating-star": "[data-cu-rating]",
  "data-cu-tag-input-field": "[data-cu-tag-input]",
  "data-cu-sortable-item": "[data-cu-sortable-list]",
  "data-cu-sortable-handle": "[data-cu-sortable-item]",
  "data-cu-countdown-days": "[data-cu-countdown]",
  "data-cu-countdown-hours": "[data-cu-countdown]",
  "data-cu-countdown-minutes": "[data-cu-countdown]",
  "data-cu-countdown-seconds": "[data-cu-countdown]",
  "data-cu-speed-dial-trigger": "[data-cu-speed-dial]",
  "data-cu-speed-dial-actions": "[data-cu-speed-dial]",
  "data-cu-kanban-column": "[data-cu-kanban]",
  "data-cu-kanban-column-body": "[data-cu-kanban-column]",
  "data-cu-kanban-card": "[data-cu-kanban]",
  "data-cu-expand-row": "[data-cu-data-table-expandable]",
  "data-cu-input-clear": "[data-cu-input-clearable]",
  "data-cu-alert-expand-trigger": "[data-cu-alert-expandable]",
  "data-cu-alert-expandable-content": "[data-cu-alert-expandable]",
  "data-cu-password-toggle": "[data-cu-password-input]",
  "data-cu-password-icon-show": "[data-cu-password-toggle]",
  "data-cu-password-icon-hide": "[data-cu-password-toggle]",
  "data-cu-checkbox-group-item": "[data-cu-checkbox-group]",
  "data-cu-checkbox-group-selectall": "[data-cu-checkbox-group]",
  "data-cu-code-block-copy": "[data-cu-code-block]",
  "data-cu-carousel-viewport": "[data-cu-carousel]",
  "data-cu-carousel-slide": "[data-cu-carousel-viewport]",
  "data-cu-carousel-prev": "[data-cu-carousel]",
  "data-cu-carousel-next": "[data-cu-carousel]",
  "data-cu-carousel-dot": "[data-cu-carousel]",
  "data-cu-context-menu-content": "[data-cu-context-menu]",
  "data-cu-command-input": "[data-cu-command]",
  "data-cu-command-list": "[data-cu-command]",
  "data-cu-command-group": "[data-cu-command-list]",
  "data-cu-command-item": "[data-cu-command-list]",
  "data-cu-command-separator": "[data-cu-command-list]",
  "data-cu-command-empty": "[data-cu-command]",
  "data-cu-calendar-title": "[data-cu-calendar]",
  "data-cu-calendar-prev": "[data-cu-calendar]",
  "data-cu-calendar-next": "[data-cu-calendar]",
  "data-cu-calendar-grid": "[data-cu-calendar]",
  "data-cu-date-picker-trigger": "[data-cu-date-picker]",
  "data-cu-date-picker-content": "[data-cu-date-picker]",
  "data-cu-date-picker-value": "[data-cu-date-picker]",
  "data-cu-date-picker-input": "[data-cu-date-picker]",
  "data-cu-color-picker-saturation": "[data-cu-color-picker]",
  "data-cu-color-picker-saturation-pointer": "[data-cu-color-picker-saturation]",
  "data-cu-color-picker-hue": "[data-cu-color-picker]",
  "data-cu-color-picker-hue-pointer": "[data-cu-color-picker-hue]",
  "data-cu-color-picker-preview": "[data-cu-color-picker]",
  "data-cu-color-picker-input": "[data-cu-color-picker]",
  "data-cu-color-picker-hidden": "[data-cu-color-picker]",
  "data-cu-color-picker-swatch": "[data-cu-color-picker]",
};

/** 根元素 → JS 運作所需的子元件（任一缺少，該元件會靜默不作用） */
const ROOT_PARTS: Record<string, string[]> = {
  "[data-cu-tabs]": ["[data-cu-tabs-trigger]", "[data-cu-tabs-content]"],
  "[data-cu-tabs-scrollable]": [".cu-tabs-list"],
  "[data-cu-dropdown]": ["[data-cu-dropdown-trigger]", "[data-cu-dropdown-content]"],
  "[data-cu-combobox]": [
    "[data-cu-combobox-trigger]",
    "[data-cu-combobox-value]",
    "[data-cu-combobox-content]",
    "[data-cu-combobox-item]",
  ],
  "[data-cu-multi-select]": [
    "[data-cu-multi-select-trigger]",
    "[data-cu-multi-select-tags]",
    "[data-cu-multi-select-content]",
    "[data-cu-multi-select-item]",
  ],
  "[data-cu-number-input]": ["[data-cu-number-field]"],
  "[data-cu-dropzone]": ["[data-cu-dropzone-input]"],
  "[data-cu-popover]": ["[data-cu-popover-trigger]", "[data-cu-popover-content]"],
  "[data-cu-menubar]": ["[data-cu-menubar-menu]"],
  "[data-cu-menubar-menu]": ["[data-cu-menubar-trigger]", "[data-cu-menubar-content]"],
  "[data-cu-transfer-list]": ['[data-cu-transfer-panel="left"]', '[data-cu-transfer-panel="right"]'],
  "[data-cu-password-input]": [".cu-password-input-field", "[data-cu-password-toggle]"],
  "[data-cu-checkbox-group]": ["[data-cu-checkbox-group-item]"],
  "[data-cu-carousel]": ["[data-cu-carousel-viewport]", "[data-cu-carousel-slide]"],
  "[data-cu-context-menu]": ["[data-cu-context-menu-content]"],
  "[data-cu-command]": ["[data-cu-command-input]", "[data-cu-command-list]", "[data-cu-command-item]"],
  "[data-cu-calendar]": ["[data-cu-calendar-title]", "[data-cu-calendar-grid]"],
  "[data-cu-date-picker]": ["[data-cu-date-picker-trigger]", "[data-cu-date-picker-content]", "[data-cu-calendar]"],
  "[data-cu-color-picker]": ["[data-cu-color-picker-saturation]", "[data-cu-color-picker-hue]"],
  "[data-cu-rating]:not(.cu-rating-readonly):not(.cu-rating-disabled)": ["[data-cu-rating-star]"],
  "[data-cu-tag-input]": ["[data-cu-tag-input-field]"],
  "[data-cu-sortable-list]": ["[data-cu-sortable-item]"],
  "[data-cu-countdown]": [
    "[data-cu-countdown-days], [data-cu-countdown-hours], [data-cu-countdown-minutes], [data-cu-countdown-seconds]",
  ],
  "[data-cu-speed-dial]": ["[data-cu-speed-dial-trigger]", "[data-cu-speed-dial-actions]"],
  "[data-cu-kanban]": ["[data-cu-kanban-column-body]"],
  "[data-cu-input-clearable]": ["input", "[data-cu-input-clear]"],
  "[data-cu-alert-expandable]": ["[data-cu-alert-expand-trigger]", "[data-cu-alert-expandable-content]"],
  "[data-cu-data-table-expandable]": ["[data-cu-expand-row]"],
  "[data-cu-pin-input]": [".cu-pin-input-field"],
  "[data-cu-segmented]": [".cu-segmented-item"],
  "[data-cu-toggle-group]": [".cu-toggle-group-item"],
};

/**
 * 帶互動 class 的元素必須接上 JS：`need` 為 `data-cu-*`（可用 | 表示任一）時元素本身須有該屬性；
 * 以 `@` 開頭時元素須位於符合該 selector 的祖先內。
 */
const CLASS_HOOKS: Array<[string, string]> = [
  ["dialog.cu-dialog", "data-cu-dialog"],
  ["dialog.cu-drawer", "data-cu-drawer"],
  ["dialog.cu-alert-dialog", "data-cu-alert-dialog"],
  ["dialog.cu-command", "data-cu-command"],
  [".cu-carousel-viewport", "data-cu-carousel-viewport"],
  [".cu-carousel-slide", "data-cu-carousel-slide"],
  [".cu-carousel-prev", "data-cu-carousel-prev"],
  [".cu-carousel-next", "data-cu-carousel-next"],
  [".cu-carousel-dot", "data-cu-carousel-dot"],
  [".cu-carousel-viewport", "@[data-cu-carousel]"],
  ["button.cu-segmented-item", "@[data-cu-segmented]"],
  [".cu-command-input", "data-cu-command-input"],
  [".cu-command-list", "data-cu-command-list"],
  [".cu-command-group", "data-cu-command-group"],
  [".cu-command-item", "data-cu-command-item"],
  [".cu-command-separator", "data-cu-command-separator"],
  [".cu-command-empty", "data-cu-command-empty"],
  [".cu-date-picker .cu-calendar", "data-cu-calendar"],
  ["[data-cu-calendar] .cu-calendar-title", "data-cu-calendar-title"],
  ["[data-cu-calendar] .cu-calendar-grid", "data-cu-calendar-grid"],
  ["[data-cu-calendar] .cu-calendar-nav", "data-cu-calendar-prev|data-cu-calendar-next"],
  [".cu-combobox-trigger", "data-cu-combobox-trigger"],
  [".cu-combobox-item", "data-cu-combobox-item"],
  [".cu-multi-select-trigger", "data-cu-multi-select-trigger"],
  [".cu-multi-select-item", "data-cu-multi-select-item"],
  [".cu-date-picker-trigger", "data-cu-date-picker-trigger"],
  [".cu-date-picker-content", "data-cu-date-picker-content"],
  [".cu-password-input-toggle", "data-cu-password-toggle"],
  [".cu-input-clear", "data-cu-input-clear"],
  [".cu-alert-expand-trigger", "data-cu-alert-expand-trigger"],
  [".cu-alert-expandable-content", "data-cu-alert-expandable-content"],
  [".cu-data-table-expand-trigger", "data-cu-expand-row"],
  [".cu-tabs-trigger-close", "data-cu-tabs-close"],
  [".cu-tabs-scroll-btn", "data-cu-tabs-scroll-start|data-cu-tabs-scroll-end"],
  [".cu-speed-dial-trigger", "data-cu-speed-dial-trigger"],
  [".cu-speed-dial-actions", "data-cu-speed-dial-actions"],
  [".cu-header-mobile-nav", "data-cu-mobile-nav-panel"],
  [".cu-header-mobile-backdrop", "data-cu-mobile-nav"],
  [".cu-header-mobile-close", "data-cu-mobile-nav-close"],
  [".cu-checkbox-group-selectall input[type=checkbox]", "data-cu-checkbox-group-selectall"],
  [".cu-checkbox-group-selectall", "@[data-cu-checkbox-group]"],
  [".cu-checkbox-group-items input[type=checkbox]", "data-cu-checkbox-group-item"],
  [
    "[data-cu-countdown] .cu-countdown-value",
    "data-cu-countdown-days|data-cu-countdown-hours|data-cu-countdown-minutes|data-cu-countdown-seconds",
  ],
  ["[data-cu-tag-input] .cu-tag-input-field", "data-cu-tag-input-field"],
  ["[data-cu-number-input] input", "data-cu-number-field"],
  ["[data-cu-dropzone] input[type=file]", "data-cu-dropzone-input"],
  ["[data-cu-rating] .cu-rating-item", "data-cu-rating-star"],
  ["[data-cu-sortable-list] .cu-sortable-item", "data-cu-sortable-item"],
  ["[data-cu-kanban] .cu-kanban-column-body", "data-cu-kanban-column-body"],
  ["[data-cu-kanban] .cu-kanban-card", "data-cu-kanban-card"],
  ["[data-cu-resizable] > .cu-resizable-panel", "data-cu-resizable-panel"],
  ["[data-cu-resizable] > .cu-resizable-handle", "data-cu-resizable-handle"],
  ["[data-cu-color-picker] .cu-color-picker-saturation", "data-cu-color-picker-saturation"],
  ["[data-cu-color-picker] .cu-color-picker-hue", "data-cu-color-picker-hue"],
  ["[data-cu-color-picker] .cu-color-picker-swatch", "data-cu-color-picker-swatch"],
];

/**
 * 會被使用者「啟動」的元素：cubby-ui.js 只監聽 click，因此必須是原生可鍵盤操作的元素
 * （<button>、<a href>、<summary> 或按鈕型 <input>）。Dropdown / Combobox / Multi Select /
 * Command Palette 的項目由 document 級方向鍵導航處理，不在此列。
 */
const ACTIVATABLE = [
  "[data-cu-dropdown-trigger]",
  "[data-cu-combobox-trigger]",
  "[data-cu-multi-select-trigger]",
  "[data-cu-popover-trigger]",
  "[data-cu-menubar-trigger]",
  "[data-cu-menubar-content] .cu-menubar-item",
  "[data-cu-dialog-trigger]",
  "[data-cu-drawer-trigger]",
  "[data-cu-alert-dialog-trigger]",
  "[data-cu-command-trigger]",
  "[data-cu-date-picker-trigger]",
  "[data-cu-calendar-prev]",
  "[data-cu-calendar-next]",
  "[data-cu-toast-trigger]",
  "[data-cu-mobile-nav-trigger]",
  "[data-cu-mobile-nav-close]",
  "[data-cu-speed-dial-trigger]",
  "[data-cu-tabs-trigger]",
  "[data-cu-tabs-close]",
  "[data-cu-tabs-scroll-start]",
  "[data-cu-tabs-scroll-end]",
  "[data-cu-carousel-prev]",
  "[data-cu-carousel-next]",
  "[data-cu-carousel-dot]",
  "[data-cu-password-toggle]",
  "[data-cu-number-increment]",
  "[data-cu-number-decrement]",
  "[data-cu-transfer-to-right]",
  "[data-cu-transfer-to-left]",
  "[data-cu-alert-expand-trigger]",
  "[data-cu-expand-row]",
  "[data-cu-input-clear]",
  "[data-cu-back-to-top]",
  "[data-cu-dialog-close]",
  "[data-cu-drawer-close]",
  "[data-cu-alert-dialog-cancel]",
  "[data-cu-alert-dialog-action]",
  "[data-cu-copy]",
  "[data-cu-copy-target]",
  "[data-cu-color-picker-swatch]",
  "[data-cu-rating-star]",
  "[data-cu-toggle-group] .cu-toggle-group-item",
  "[data-cu-segmented]:not(:has(.cu-segmented-input)) .cu-segmented-item",
  "[data-cu-tag-input] .cu-tag-input-tag-remove",
];

interface AuditConfig {
  html: string;
  knownAttrs: string[];
  partRoot: Record<string, string>;
  rootParts: Record<string, string[]>;
  classHooks: Array<[string, string]>;
  activatable: string[];
  formRoots: string[];
}

/** 在瀏覽器內以 <template> 解析範例（不執行 script、不初始化），回傳靜態問題清單 */
function staticAudit(cfg: AuditConfig): string[] {
  const problems: string[] = [];
  const tpl = document.createElement("template");
  tpl.innerHTML = cfg.html;
  const frag = tpl.content;
  const known = new Set(cfg.knownAttrs);
  const all = Array.from(frag.querySelectorAll("*"));

  const describe = (el: Element): string => {
    const attrs = Array.from(el.attributes)
      .filter((a) => a.name === "class" || a.name === "id" || a.name === "type" || a.name.startsWith("data-cu-"))
      .map((a) => (a.value ? `${a.name}="${a.value.length > 48 ? a.value.slice(0, 45) + "..." : a.value}"` : a.name))
      .join(" ");
    return `<${el.tagName.toLowerCase()}${attrs ? " " + attrs : ""}>`;
  };
  const byId = (id: string): Element | null => {
    try {
      return frag.querySelector("#" + CSS.escape(id));
    } catch {
      return null;
    }
  };
  const isNativeActivatable = (el: Element): boolean => {
    const tag = el.tagName.toLowerCase();
    if (tag === "button" || tag === "summary") return true;
    if (tag === "a") return el.hasAttribute("href");
    if (tag === "input") return /^(button|submit|reset|checkbox|radio)$/i.test(el.getAttribute("type") || "");
    return false;
  };

  // 1. 巢狀互動元素（DOM 層：<button> 內的 <a href> / 表單控制項 / 可聚焦元素）
  for (const host of all.filter((el) => el.matches("button, a[href], summary"))) {
    const inner = host.querySelector(
      'button, a[href], input:not([type="hidden"]), select, textarea, summary, [tabindex]:not([tabindex="-1"]), [contenteditable]',
    );
    if (inner)
      problems.push(
        `巢狀互動元素：${describe(inner)} 位於 ${describe(host)} 內 [${inner.matches("[data-cu-tabs-close]") ? "data-cu-tabs-close" : "nesting"}]`,
      );
  }

  // 2. 未知的 data-cu-* 屬性
  const unknown = new Set<string>();
  for (const el of all) {
    for (const a of Array.from(el.attributes)) {
      if (a.name.startsWith("data-cu-") && !known.has(a.name)) unknown.add(a.name);
    }
  }
  for (const name of unknown) problems.push(`未知屬性 ${name}：cubby-ui.js 不會讀取（拼字錯誤或已移除的屬性？）`);

  // 3. 子元件屬性不在根元素內
  for (const [attr, rootSel] of Object.entries(cfg.partRoot)) {
    for (const el of Array.from(frag.querySelectorAll(`[${attr}]`))) {
      if (!el.parentElement || !el.parentElement.closest(rootSel)) {
        problems.push(`${describe(el)} 不在 ${rootSel} 內，cubby-ui.js 不會處理 [${attr}]`);
      }
    }
  }
  for (const el of Array.from(frag.querySelectorAll("[data-cu-resizable-panel], [data-cu-resizable-handle]"))) {
    if (!el.parentElement || !el.parentElement.matches("[data-cu-resizable]")) {
      problems.push(`${describe(el)} 必須是 [data-cu-resizable] 的直接子元素`);
    }
  }

  // 4. 根元素缺少必要子元件
  for (const [rootSel, parts] of Object.entries(cfg.rootParts)) {
    for (const root of Array.from(frag.querySelectorAll(rootSel))) {
      for (const part of parts) {
        if (!root.querySelector(part)) problems.push(`${describe(root)} 缺少 ${part}，元件不會運作`);
      }
    }
  }
  for (const root of Array.from(frag.querySelectorAll("[data-cu-resizable]"))) {
    const panels = root.querySelectorAll(":scope > [data-cu-resizable-panel]").length;
    const handles = root.querySelectorAll(":scope > [data-cu-resizable-handle]").length;
    if (panels < 2 || handles < 1)
      problems.push(`${describe(root)} 需要至少 2 個 panel 與 1 個 handle（目前 ${panels} / ${handles}）`);
  }
  for (const root of Array.from(frag.querySelectorAll("[data-cu-countdown]"))) {
    const target = root.getAttribute("data-cu-countdown-target") || "";
    if (!target || isNaN(new Date(target).getTime()))
      problems.push(`${describe(root)} 的 data-cu-countdown-target 不是有效日期`);
  }

  // 5. 互動 class 沒有接上 JS 屬性
  for (const [sel, need] of cfg.classHooks) {
    for (const el of Array.from(frag.querySelectorAll(sel))) {
      if (need.startsWith("@")) {
        if (!el.closest(need.slice(1))) problems.push(`${describe(el)} 不在 ${need.slice(1)} 內，cubby-ui.js 不會處理`);
      } else if (!need.split("|").some((n) => el.hasAttribute(n))) {
        problems.push(`${describe(el)} 缺少 ${need.split("|").join(" 或 ")}`);
      }
    }
  }

  // 6. 觸發器必須可鍵盤操作
  for (const sel of cfg.activatable) {
    for (const el of Array.from(frag.querySelectorAll(sel))) {
      if (!isNativeActivatable(el)) {
        problems.push(`無法以鍵盤操作：${describe(el)} 不是 <button> / <a href>（cubby-ui.js 只處理 click）[${sel}]`);
      }
    }
  }
  for (const el of Array.from(frag.querySelectorAll("[data-cu-resizable-handle]"))) {
    const tabindex = el.getAttribute("tabindex");
    if (el.tagName !== "BUTTON" && (tabindex === null || Number(tabindex) < 0)) {
      problems.push(`無法以鍵盤操作：${describe(el)} 需要 tabindex="0" 才能聚焦並用方向鍵調整`);
    }
  }

  // 7. 表單類元件內的 <button> 必須明確 type
  for (const rootSel of cfg.formRoots) {
    for (const root of Array.from(frag.querySelectorAll(rootSel))) {
      for (const btn of Array.from(root.querySelectorAll("button:not([type])"))) {
        problems.push(`${describe(btn)} 缺少 type="button"：表單元件放進 <form> 時會變成 submit 按鈕`);
      }
    }
  }

  // 8. 參照完整性
  const overlayRefs: Array<[string, string]> = [
    ["data-cu-dialog-trigger", "data-cu-dialog"],
    ["data-cu-drawer-trigger", "data-cu-drawer"],
    ["data-cu-alert-dialog-trigger", "data-cu-alert-dialog"],
    ["data-cu-command-trigger", "data-cu-command"],
  ];
  for (const [trigAttr, targetAttr] of overlayRefs) {
    for (const trig of Array.from(frag.querySelectorAll(`[${trigAttr}]`))) {
      const id = trig.getAttribute(trigAttr) || "";
      const target = byId(id);
      if (!target) problems.push(`${describe(trig)} 指向的 id="${id}" 不存在`);
      else if (target.tagName !== "DIALOG" || !target.hasAttribute(targetAttr)) {
        problems.push(`${describe(trig)} 指向的 ${describe(target)} 必須是帶 ${targetAttr} 的 <dialog>`);
      }
    }
  }
  for (const trig of Array.from(frag.querySelectorAll("[data-cu-mobile-nav-trigger]"))) {
    const id = trig.getAttribute("data-cu-mobile-nav-trigger") || "";
    if (!byId(id)) problems.push(`${describe(trig)} 指向的遮罩 id="${id}" 不存在`);
    if (!frag.querySelector(`[data-cu-mobile-nav-panel="${CSS.escape(id)}"]`)) {
      problems.push(`${describe(trig)} 找不到對應的 [data-cu-mobile-nav-panel="${id}"]`);
    }
  }
  for (const btn of Array.from(frag.querySelectorAll("[data-cu-copy-target]"))) {
    const sel = btn.getAttribute("data-cu-copy-target") || "";
    let target: Element | null = null;
    try {
      target = frag.querySelector(sel);
    } catch {
      problems.push(`${describe(btn)} 的 selector 無效`);
      continue;
    }
    if (!target) problems.push(`${describe(btn)} 的複製目標 ${sel} 不存在`);
  }
  for (const tabs of Array.from(frag.querySelectorAll("[data-cu-tabs]"))) {
    const triggers = Array.from(tabs.querySelectorAll("[data-cu-tabs-trigger]")).map((t) =>
      t.getAttribute("data-cu-tabs-trigger"),
    );
    const panels = Array.from(tabs.querySelectorAll("[data-cu-tabs-content]")).map((c) =>
      c.getAttribute("data-cu-tabs-content"),
    );
    for (const v of triggers)
      if (!panels.includes(v)) problems.push(`Tabs：trigger "${v}" 沒有對應的 data-cu-tabs-content`);
    for (const v of panels)
      if (!triggers.includes(v)) problems.push(`Tabs：content "${v}" 沒有對應的 data-cu-tabs-trigger`);
  }
  for (const tour of Array.from(frag.querySelectorAll("[data-cu-tour]"))) {
    let steps: Array<{ target?: string; title?: string }> = [];
    try {
      steps = JSON.parse(tour.getAttribute("data-cu-tour-steps") || "");
    } catch {
      problems.push(`${describe(tour)} 的 data-cu-tour-steps 不是有效 JSON`);
      continue;
    }
    if (!Array.isArray(steps) || steps.length === 0) problems.push(`${describe(tour)} 沒有任何步驟`);
    for (const step of steps) {
      let found: Element | null = null;
      try {
        found = step.target ? frag.querySelector(step.target) : null;
      } catch {
        found = null;
      }
      if (!found) problems.push(`Tour 步驟 "${step.title || ""}" 的 target ${step.target} 不在範例中，導覽無法開始`);
    }
  }

  // 9. label 必須關聯控制項（for 指向存在的元素，或包住控制項）
  for (const label of Array.from(frag.querySelectorAll("label"))) {
    const forId = label.getAttribute("for");
    if (forId) {
      if (!byId(forId)) problems.push(`${describe(label)} 的 for="${forId}" 指向不存在的元素`);
    } else if (!label.querySelector("input, select, textarea, button, meter, output, progress")) {
      problems.push(
        `<label>${(label.textContent || "").trim().slice(0, 30)}</label> 沒有 for 也沒有包住控制項，點擊不會作用於輸入框`,
      );
    }
  }
  for (const el of all) {
    if (el.hasAttribute("htmlfor")) problems.push(`${describe(el)} 使用 React 的 htmlFor，HTML 應為 for`);
    if (el.hasAttribute("classname")) problems.push(`${describe(el)} 使用 React 的 className，HTML 應為 class`);
  }

  return problems;
}

/* ------------------------------------------------------------------------- */
/* 執行期探測：依元件實際操作，確認 cubby-ui.js 有接手                          */
/* ------------------------------------------------------------------------- */

type Probe = (page: Page, root: Locator) => Promise<string | void>;

const hiddenAttr = async (loc: Locator) => (await loc.getAttribute("hidden")) !== null;
const isShown = async (loc: Locator) => !(await hiddenAttr(loc)) && (await loc.isVisible());

/** 以鍵盤啟動（聚焦後按 Enter），模擬鍵盤使用者 */
async function pressEnterOn(page: Page, loc: Locator) {
  await loc.focus();
  await page.keyboard.press("Enter");
}

/** 在不可見（如 md:hidden）時改用程式 click；可見時用真實滑鼠點擊 */
async function activate(loc: Locator) {
  if (await loc.isVisible()) await loc.click();
  else await loc.evaluate((el) => (el as HTMLElement).click());
}

async function closeOverlays(page: Page) {
  await page.keyboard.press("Escape");
  await page.evaluate(() => document.querySelectorAll("dialog[open]").forEach((d) => (d as HTMLDialogElement).close()));
}

const PROBES: Array<{ selector: string; run: Probe }> = [
  {
    selector: "[data-cu-tabs]",
    run: async (_page, root) => {
      const triggers = root.locator("[data-cu-tabs-trigger]:not(:disabled)");
      const n = await triggers.count();
      if (n < 2) return;
      const target = triggers.nth(n - 1);
      await activate(target);
      if ((await target.getAttribute("aria-selected")) !== "true") return "點擊 tab 後 aria-selected 沒有變成 true";
      const panelId = await target.getAttribute("aria-controls");
      if (!panelId) return "tab 沒有 aria-controls（cubby-ui.js 未連結 panel）";
      if (await hiddenAttr(root.locator(`[id="${panelId}"]`))) return "點擊 tab 後對應 panel 仍為 hidden";
    },
  },
  {
    selector: "[data-cu-dropdown]",
    run: async (page, root) => {
      const content = root.locator("[data-cu-dropdown-content]").first();
      await pressEnterOn(page, root.locator("[data-cu-dropdown-trigger]").first());
      if (!(await isShown(content))) return "以鍵盤（Enter）啟動 trigger 後選單沒有開啟";
      await page.keyboard.press("Escape");
      if (await isShown(content)) return "按 Escape 後選單沒有關閉";
    },
  },
  {
    selector: "[data-cu-combobox]",
    run: async (page, root) => {
      const content = root.locator("[data-cu-combobox-content]").first();
      await pressEnterOn(page, root.locator("[data-cu-combobox-trigger]").first());
      if (!(await isShown(content))) return "以鍵盤（Enter）啟動 trigger 後面板沒有開啟";
      const item = root.locator("[data-cu-combobox-item]:not([hidden])").first();
      const text = ((await item.textContent()) || "").trim();
      await item.click();
      if (await isShown(content)) return "選取項目後面板沒有關閉";
      const value = ((await root.locator("[data-cu-combobox-value]").first().textContent()) || "").trim();
      if (value !== text) return `選取 "${text}" 後顯示值為 "${value}"`;
    },
  },
  {
    selector: "[data-cu-multi-select]",
    run: async (page, root) => {
      const content = root.locator("[data-cu-multi-select-content]").first();
      await pressEnterOn(page, root.locator("[data-cu-multi-select-trigger]").first());
      if (!(await isShown(content))) return "以鍵盤（Enter）啟動 trigger 後面板沒有開啟";
      // 以索引固定目標：點擊後 aria-selected 改變，屬性選擇器會改指向下一個項目
      const items = root.locator("[data-cu-multi-select-item]");
      const index = await items.evaluateAll((els) =>
        els.findIndex((el) => el.getAttribute("aria-selected") === "false" && !el.hasAttribute("hidden")),
      );
      if (index === -1) return;
      const item = items.nth(index);
      const before = await root.locator(".cu-multi-select-tag").count();
      await item.click();
      if ((await item.getAttribute("aria-selected")) !== "true") return "點擊項目後沒有被選取";
      if ((await root.locator(".cu-multi-select-tag").count()) !== before + 1)
        return "選取後沒有產生標籤（檢查 data-cu-value 與 data-cu-multi-select-tags）";
    },
  },
  {
    selector: "[data-cu-number-input]",
    run: async (_page, root) => {
      const field = root.locator("[data-cu-number-field]").first();
      if ((await field.getAttribute("role")) !== "spinbutton") return "欄位沒有被設定 role=spinbutton";
      const inc = root.locator("[data-cu-number-increment]").first();
      const dec = root.locator("[data-cu-number-decrement]").first();
      const before = await field.inputValue();
      if ((await inc.count()) && !(await inc.isDisabled())) {
        await inc.click();
        if ((await field.inputValue()) === before && before !== (await field.getAttribute("max")))
          return "點擊 + 後數值沒有改變";
      }
      if ((await dec.count()) && !(await dec.isDisabled())) await dec.click();
    },
  },
  {
    selector: "[data-cu-dropzone]",
    run: async (page, root) => {
      const input = root.locator("[data-cu-dropzone-input]").first();
      if (await input.isDisabled()) return;
      const clickChooser = page.waitForEvent("filechooser", { timeout: 2000 }).then(
        () => true,
        () => false,
      );
      await root.click({ position: { x: 5, y: 5 } });
      if (!(await clickChooser)) return "點擊上傳區沒有開啟檔案選擇器";
      await input.focus();
      if (!(await input.evaluate((el) => el === document.activeElement))) {
        return '檔案輸入框無法以鍵盤聚焦（勿用 hidden 屬性 / display:none，改用 class="cu-dropzone-input"）';
      }
      const keyChooser = page.waitForEvent("filechooser", { timeout: 2000 }).then(
        () => true,
        () => false,
      );
      await page.keyboard.press("Space");
      if (!(await keyChooser)) return "聚焦檔案輸入框按 Space 沒有開啟檔案選擇器";
    },
  },
  {
    selector: "[data-cu-transfer-list]",
    run: async (_page, root) => {
      const left = root.locator('[data-cu-transfer-panel="left"]');
      const right = root.locator('[data-cu-transfer-panel="right"]');
      const check = left.locator("[data-cu-transfer-check]").first();
      if ((await check.count()) === 0) return;
      const beforeRight = await right.locator(".cu-transfer-list-item").count();
      await check.check();
      const toRight = root.locator("[data-cu-transfer-to-right]").first();
      if (await toRight.isDisabled()) return "勾選項目後「移到右側」按鈕仍為 disabled";
      await toRight.click();
      if ((await right.locator(".cu-transfer-list-item").count()) !== beforeRight + 1)
        return "點擊移動後項目沒有移到右側（項目需為 .cu-transfer-list-item）";
    },
  },
  ...(["dialog", "drawer", "alert-dialog"] as const).map((kind) => ({
    selector: `[data-cu-${kind}-trigger]`,
    run: (async (page: Page, trigger: Locator) => {
      const id = (await trigger.getAttribute(`data-cu-${kind}-trigger`)) || "";
      const dialog = page.locator(`dialog[id="${id}"]`);
      // 巢狀對話框的 trigger 位於尚未開啟的外層 <dialog> 內，無法直接操作
      const reachable = await trigger.evaluate((el) => {
        const outer = el.parentElement && el.parentElement.closest("dialog");
        return !outer || outer.open;
      });
      if ((await dialog.count()) === 0 || !reachable) return;
      await pressEnterOn(page, trigger);
      if (!(await dialog.evaluate((d) => (d as HTMLDialogElement).open)))
        return "以鍵盤啟動 trigger 後 <dialog> 沒有開啟";
      if (kind === "alert-dialog" && (await dialog.getAttribute("role")) !== "alertdialog")
        return '<dialog> 沒有被設定 role="alertdialog"（缺 data-cu-alert-dialog？）';
      const closeSel =
        kind === "alert-dialog"
          ? "[data-cu-alert-dialog-cancel], [data-cu-alert-dialog-action]"
          : `[data-cu-${kind}-close]`;
      const close = dialog.locator(closeSel).first();
      if ((await close.count()) === 0) return;
      // 以鍵盤啟動關閉鈕：不受開啟動畫期間元素位移影響，也同時驗證可鍵盤操作
      await pressEnterOn(page, close);
      if (await dialog.evaluate((d) => (d as HTMLDialogElement).open)) return `點擊 ${closeSel} 後 <dialog> 沒有關閉`;
    }) as Probe,
  })),
  {
    selector: "[data-cu-toast-trigger]",
    run: async (page, trigger) => {
      const before = await page.locator(".cu-toast").count();
      await activate(trigger);
      if ((await page.locator(".cu-toast").count()) <= before) return "點擊後沒有出現 toast";
    },
  },
  {
    selector: "[data-cu-popover]",
    run: async (page, root) => {
      const content = root.locator("[data-cu-popover-content]").first();
      await pressEnterOn(page, root.locator("[data-cu-popover-trigger]").first());
      if (!(await isShown(content))) return "以鍵盤（Enter）啟動 trigger 後 popover 沒有開啟";
      await page.keyboard.press("Escape");
    },
  },
  {
    selector: "[data-cu-menubar]",
    run: async (page, root) => {
      const menu = root.locator("[data-cu-menubar-menu]").first();
      await pressEnterOn(page, menu.locator("[data-cu-menubar-trigger]").first());
      if (!(await isShown(menu.locator("[data-cu-menubar-content]").first())))
        return "以鍵盤（Enter）啟動 trigger 後選單沒有開啟";
    },
  },
  {
    selector: "[data-cu-mobile-nav-trigger]",
    run: async (page, trigger) => {
      const id = (await trigger.getAttribute("data-cu-mobile-nav-trigger")) || "";
      const panel = page.locator(`[data-cu-mobile-nav-panel="${id}"]`);
      if ((await panel.count()) === 0) return;
      await activate(trigger);
      if ((await panel.getAttribute("data-cu-mobile-nav-open")) === null) return "點擊 trigger 後面板沒有開啟";
      const close = panel.locator("[data-cu-mobile-nav-close]").first();
      if ((await close.count()) === 0) return;
      await activate(close);
      if ((await panel.getAttribute("data-cu-mobile-nav-open")) !== null) return "點擊關閉鈕後面板沒有關閉";
    },
  },
  {
    selector: "[data-cu-password-input]",
    run: async (_page, root) => {
      const field = root.locator(".cu-password-input-field").first();
      const toggle = root.locator("[data-cu-password-toggle]").first();
      if (await toggle.isDisabled()) return;
      const type = await field.getAttribute("type");
      await toggle.click();
      if ((await field.getAttribute("type")) === type) return "點擊切換鈕後輸入框 type 沒有改變";
    },
  },
  {
    selector: "[data-cu-segmented]",
    run: async (_page, root) => {
      const items = root.locator(".cu-segmented-item");
      const n = await items.count();
      if (n < 2) return;
      const target = items.nth(n - 1);
      await target.click();
      if (!(await target.evaluate((el) => el.classList.contains("cu-segmented-item-active")))) {
        return "點擊最後一個項目後沒有變成 active（radio 模式需以 for / id 關聯 label 與 input）";
      }
    },
  },
  {
    selector: "[data-cu-pin-input]",
    run: async (page, root) => {
      const fields = root.locator(".cu-pin-input-field");
      if ((await fields.count()) < 2 || (await fields.first().isDisabled())) return;
      await fields.first().focus();
      await page.keyboard.type("1");
      if (!(await fields.nth(1).evaluate((el) => el === document.activeElement)))
        return "輸入一個字元後焦點沒有移到下一格";
    },
  },
  {
    selector: "[data-cu-checkbox-group]",
    run: async (_page, root) => {
      const all = root.locator("[data-cu-checkbox-group-selectall]").first();
      const items = root.locator("[data-cu-checkbox-group-item]:not(:disabled)");
      if ((await all.count()) === 0 || (await items.count()) === 0) return;
      if (await all.isChecked()) await all.click();
      await all.click();
      for (const item of await items.all()) if (!(await item.isChecked())) return "勾選全選後項目沒有全部勾選";
    },
  },
  {
    selector: "[data-cu-copy], [data-cu-copy-target]",
    run: async (_page, btn) => {
      await activate(btn);
      const handled = await btn.evaluate(
        (el) => el.hasAttribute("data-cu-copied") || el.hasAttribute("data-cu-copy-failed"),
      );
      if (!handled) return "點擊後沒有進入 data-cu-copied / data-cu-copy-failed 狀態";
    },
  },
  {
    selector: "[data-cu-carousel]",
    run: async (_page, root) => {
      const prev = root.locator("[data-cu-carousel-prev]").first();
      if ((await prev.count()) && !(await prev.isDisabled()))
        return "初始位置的「上一張」按鈕沒有被 disabled（cubby-ui.js 未接手）";
    },
  },
  {
    selector: "[data-cu-context-menu]",
    run: async (page, root) => {
      const content = root.locator("[data-cu-context-menu-content]").first();
      await root.click({ button: "right", position: { x: 5, y: 5 } });
      if (!(await isShown(content))) return "右鍵後選單沒有開啟";
      await page.keyboard.press("Escape");
    },
  },
  {
    selector: "[data-cu-resizable]",
    run: async (page, root) => {
      const handle = root.locator(":scope > [data-cu-resizable-handle]").first();
      const panel = root.locator(":scope > [data-cu-resizable-panel]").first();
      const vertical = await root.evaluate((el) => el.classList.contains("cu-resizable-vertical"));
      const before = await panel.evaluate((el) => (el as HTMLElement).style.flexGrow);
      await handle.focus();
      await page.keyboard.press(vertical ? "ArrowDown" : "ArrowRight");
      const after = await panel.evaluate((el) => (el as HTMLElement).style.flexGrow);
      if (before === after) return "聚焦 handle 按方向鍵後 panel 尺寸沒有改變";
    },
  },
  {
    selector: "[data-cu-command]",
    run: async (page, palette) => {
      const id = await palette.getAttribute("id");
      const trigger = id ? page.locator(`[data-cu-command-trigger="${id}"]`).first() : null;
      if (trigger && (await trigger.count())) await pressEnterOn(page, trigger);
      else await page.keyboard.press("Control+k");
      if (!(await palette.evaluate((d) => (d as HTMLDialogElement).open))) return "無法開啟 Command Palette";
      await page.keyboard.press("ArrowDown");
      if ((await palette.locator("[data-cu-command-active]").count()) === 0) return "按方向鍵後沒有項目被標記為 active";
      await palette.locator("[data-cu-command-input]").first().fill("zzqqxx-no-match");
      if ((await palette.locator("[data-cu-command-item]:not([hidden])").count()) !== 0)
        return "輸入不相符的查詢後項目沒有被過濾";
      await page.keyboard.press("Escape");
    },
  },
  {
    selector: "[data-cu-date-picker]",
    run: async (page, root) => {
      const content = root.locator("[data-cu-date-picker-content]").first();
      await pressEnterOn(page, root.locator("[data-cu-date-picker-trigger]").first());
      if (!(await content.isVisible())) return "以鍵盤（Enter）啟動 trigger 後月曆沒有開啟";
      if ((await root.locator(".cu-calendar-day").count()) < 28)
        return "月曆沒有產生日期按鈕（缺 data-cu-calendar-grid / data-cu-calendar-title？）";
      // 有 min / max 限制時，目前月份可能沒有可選日期（月曆開在今天所在月份），此時只驗證已渲染
      const days = root.locator(".cu-calendar-day:not(.cu-calendar-day-outside):not(:disabled)");
      if ((await days.count()) === 0) return;
      await days.nth(Math.min(9, (await days.count()) - 1)).click();
      if (await content.isVisible()) return "選取日期後月曆沒有關閉";
      const input = root.locator("input[data-cu-date-picker-input]").first();
      if ((await input.count()) && !/^\d{4}-\d{2}-\d{2}$/.test(await input.inputValue()))
        return "選取日期後 hidden input 沒有 ISO 日期";
    },
  },
  {
    selector: "[data-cu-calendar]",
    run: async (_page, root) => {
      if (await root.evaluate((el) => !!el.closest("[data-cu-date-picker]"))) return;
      if ((await root.locator(".cu-calendar-day").count()) < 28) return "月曆沒有產生日期按鈕";
    },
  },
  {
    selector: "[data-cu-color-picker]",
    run: async (_page, root) => {
      const swatch = root.locator("[data-cu-color-picker-swatch]").first();
      const input = root.locator("[data-cu-color-picker-input]").first();
      if ((await swatch.count()) && (await input.count())) {
        const color = ((await swatch.getAttribute("data-cu-color-picker-swatch")) || "").toLowerCase();
        await swatch.click();
        if ((await input.inputValue()).toLowerCase() !== color) return `點擊色票 ${color} 後輸入框沒有同步`;
      } else if ((await input.count()) && !(await input.inputValue()).startsWith("#")) {
        return "初始化後 hex 輸入框沒有值";
      }
    },
  },
  {
    selector: "[data-cu-toggle-group]",
    run: async (_page, root) => {
      const items = root.locator(".cu-toggle-group-item:not(:disabled)");
      const n = await items.count();
      if (n < 2) return;
      const target = items.nth(n - 1);
      const multiple = await root.evaluate((el) => el.hasAttribute("data-cu-toggle-group-multiple"));
      const wasActive = await target.evaluate((el) => el.classList.contains("cu-toggle-group-item-active"));
      await target.click();
      // 單選模式點擊後一定是 pressed；多選模式則反轉
      const expected = multiple ? String(!wasActive) : "true";
      if ((await target.getAttribute("aria-pressed")) !== expected) return "點擊項目後 aria-pressed 沒有更新";
    },
  },
  {
    selector: "[data-cu-rating]:not(.cu-rating-readonly):not(.cu-rating-disabled)",
    run: async (page, root) => {
      const stars = root.locator("[data-cu-rating-star]");
      const n = await stars.count();
      if (n === 0) return;
      const target = stars.nth(n - 1);
      await pressEnterOn(page, target);
      if ((await root.getAttribute("data-cu-rating-value")) !== (await target.getAttribute("data-cu-rating-star"))) {
        return "以鍵盤（Enter）選擇星等後 data-cu-rating-value 沒有更新";
      }
    },
  },
  {
    selector: "[data-cu-tag-input]",
    run: async (_page, root) => {
      const field = root.locator("[data-cu-tag-input-field]").first();
      if (await field.isDisabled()) return;
      const before = await root.locator(".cu-tag-input-tag").count();
      await field.fill("e2e-example-tag");
      await field.press("Enter");
      const max = Number((await root.getAttribute("data-cu-tag-max")) || 0);
      if (!max || before < max) {
        if ((await root.locator(".cu-tag-input-tag").count()) !== before + 1) return "輸入文字按 Enter 後沒有新增標籤";
      }
      const remove = root.locator(".cu-tag-input-tag-remove").first();
      if ((await remove.count()) === 0) return;
      const count = await root.locator(".cu-tag-input-tag").count();
      await remove.click();
      if ((await root.locator(".cu-tag-input-tag").count()) !== count - 1) return "點擊標籤的移除鈕後標籤沒有被移除";
    },
  },
  {
    selector: "[data-cu-sortable-list]",
    run: async (_page, root) => {
      const bad = await root
        .locator('[data-cu-sortable-item]:not([draggable="true"]):not(.cu-sortable-item-disabled)')
        .count();
      if (bad) return `${bad} 個 data-cu-sortable-item 沒有 draggable="true"，無法拖曳`;
    },
  },
  {
    selector: "[data-cu-kanban]",
    run: async (_page, root) => {
      const bad = await root.locator('[data-cu-kanban-card]:not([draggable="true"])').count();
      if (bad) return `${bad} 張 data-cu-kanban-card 沒有 draggable="true"，無法拖曳`;
    },
  },
  {
    selector: "[data-cu-countdown]",
    run: async (page, root) => {
      await page.waitForTimeout(50);
      const values = await root
        .locator(
          "[data-cu-countdown-days], [data-cu-countdown-hours], [data-cu-countdown-minutes], [data-cu-countdown-seconds]",
        )
        .allTextContents();
      if (values.some((v) => !/^\d{2,}$/.test(v.trim()))) return `倒數數值沒有被更新：${values.join(" / ")}`;
    },
  },
  {
    selector: "[data-cu-image-compare]",
    run: async (_page, root) => {
      const pos = await root.evaluate((el) => (el as HTMLElement).style.getPropertyValue("--cu-compare-position"));
      if (pos !== "50%") return "初始化後沒有設定 --cu-compare-position";
    },
  },
  {
    selector: "[data-cu-speed-dial]",
    run: async (page, root) => {
      const actions = root.locator("[data-cu-speed-dial-actions]").first();
      const wasOpen = (await actions.getAttribute("data-cu-open")) !== null;
      await pressEnterOn(page, root.locator("[data-cu-speed-dial-trigger]").first());
      if (((await actions.getAttribute("data-cu-open")) !== null) === wasOpen)
        return "以鍵盤（Enter）啟動 trigger 後動作選單沒有切換";
    },
  },
  {
    selector: "[data-cu-tour]",
    run: async (page, root) => {
      const steps = JSON.parse((await root.getAttribute("data-cu-tour-steps")) || "[]") as Array<{ target: string }>;
      if (!steps.length || (await page.locator(steps[0].target).count()) === 0) return;
      await root.evaluate((el) => el.dispatchEvent(new Event("cu:tour:start")));
      if ((await page.locator(".cu-tour-tooltip").count()) === 0) return "觸發 cu:tour:start 後沒有出現導覽提示";
      await page.evaluate(() =>
        document.querySelectorAll(".cu-tour-overlay, .cu-tour-tooltip").forEach((el) => el.remove()),
      );
    },
  },
  {
    selector: "[data-cu-input-clearable]",
    run: async (_page, root) => {
      const input = root.locator("input").first();
      const btn = root.locator("[data-cu-input-clear]").first();
      await input.fill("e2e");
      await btn.click();
      if ((await input.inputValue()) !== "") return "點擊清除鈕後輸入框沒有清空";
    },
  },
  {
    selector: "[data-cu-alert-expandable]",
    run: async (page, root) => {
      const content = root.locator("[data-cu-alert-expandable-content]").first();
      await pressEnterOn(page, root.locator("[data-cu-alert-expand-trigger]").first());
      if ((await content.getAttribute("data-cu-expanded")) === null)
        return "以鍵盤（Enter）啟動 trigger 後內容沒有展開";
    },
  },
  {
    selector: "[data-cu-data-table-expandable]",
    run: async (page, root) => {
      const trigger = root.locator("[data-cu-expand-row]").first();
      const next = await trigger.evaluate((el) => {
        const row = el.closest("tr");
        return !!(row && row.nextElementSibling);
      });
      if (!next) return "展開按鈕所在的列後面沒有詳細內容列";
      await pressEnterOn(page, trigger);
      const opened = await trigger.evaluate((el) => {
        const row = el.closest("tr");
        return !!row && !!row.nextElementSibling && !row.nextElementSibling.hasAttribute("hidden");
      });
      if (!opened) return "以鍵盤（Enter）啟動後詳細內容列沒有展開";
    },
  },
];

/* ------------------------------------------------------------------------- */

function hostDocument(snippet: string): string {
  // 範例外層包 <form>：模擬放在表單內。表單類元件（FORM_ROOTS）內的按鈕若送出表單即記錄下來；
  // 其他元件（Dialog、Tabs…）不在此限，由作者依情境決定是否加 type="button"。
  const body = /<form[\s>]/i.test(snippet) ? snippet : `<form data-example-form action="#">${snippet}</form>`;
  const submitListener =
    "window.__submits=[];document.addEventListener('submit',function(e){e.preventDefault();" +
    "var s=e.submitter||document.activeElement;" +
    `if(s&&s.closest&&s.closest(${JSON.stringify(FORM_ROOTS.join(","))}))window.__submits.push(s.outerHTML.slice(0,100));},true);`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Example</title>
<link rel="stylesheet" href="/cubby-ui.css">
<script>${submitListener}</script>
</head>
<body style="padding:24px;min-height:200vh">
<main data-example-root>${body}</main>
<script src="/cubby-ui.js"></script>
</body>
</html>`;
}

const knownAttrs = existsSync(DIST_JS) ? knownDataAttrs() : [];

function isKnownLimitation(problem: string): boolean {
  return KNOWN_JS_LIMITATIONS.some((k) => k.match.test(problem));
}

/** 每個 page 目前要伺服的範例（route handler 依此產生頁面） */
const currentHtml = new WeakMap<Page, string>();

async function setupRoutes(page: Page) {
  if (!existsSync(DIST_CSS) || !existsSync(DIST_JS)) {
    throw new Error("找不到 dist/core/cubby-ui.{css,js}，請先執行 `npm run build`。");
  }
  const css = readFileSync(DIST_CSS);
  const js = readFileSync(DIST_JS);
  // 只伺服範例頁與 dist 產物；其餘請求（範例中的 after.jpg、外部字型等）一律中止，不依賴外網
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== ORIGIN) return route.abort();
    if (url.pathname === "/cubby-ui.css") return route.fulfill({ body: css, contentType: "text/css" });
    if (url.pathname === "/cubby-ui.js") return route.fulfill({ body: js, contentType: "text/javascript" });
    if (url.pathname === "/example")
      return route.fulfill({ body: hostDocument(currentHtml.get(page) || ""), contentType: "text/html" });
    return route.abort();
  });
}

/** 檢查單一範例，回傳問題清單（空陣列 = 通過） */
async function auditExample(page: Page, html: string): Promise<string[]> {
  const problems: string[] = [];
  const consoleErrors: string[] = [];
  page.removeAllListeners("pageerror");
  page.removeAllListeners("console");
  page.on("pageerror", (err) => consoleErrors.push(`未捕捉例外：${err.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error" && !/Failed to load resource|net::ERR_/.test(msg.text()))
      consoleErrors.push(`console error：${msg.text()}`);
  });

  problems.push(...rawNestingProblems(html), ...rawScriptProblems(html));

  currentHtml.set(page, html);
  await page.goto(`${ORIGIN}/example`, { waitUntil: "load" });
  await page.waitForFunction(() => typeof (window as any).CubbyUI === "object");

  problems.push(
    ...(await page.evaluate(staticAudit, {
      html,
      knownAttrs,
      partRoot: PART_ROOT,
      rootParts: ROOT_PARTS,
      classHooks: CLASS_HOOKS,
      activatable: ACTIVATABLE,
      formRoots: FORM_ROOTS,
    })),
  );

  const main = page.locator("main[data-example-root]");
  for (const probe of PROBES) {
    const roots = main.locator(probe.selector);
    const count = await roots.count();
    for (let i = 0; i < count; i++) {
      let result: string | void;
      try {
        result = await probe.run(page, roots.nth(i));
      } catch (err) {
        result = `操作失敗：${(err as Error).message.split("\n")[0]}`;
      }
      if (result) problems.push(`${probe.selector} #${i + 1}：${result}`);
      await closeOverlays(page);
    }
  }

  const submits = await page.evaluate(() => (window as any).__submits as string[]);
  for (const s of new Set(submits))
    problems.push(`操作過程中送出了外層 <form>：${s}（表單元件內的按鈕缺少 type="button"）`);
  problems.push(...consoleErrors);

  return [...new Set(problems)].filter((p) => !isKnownLimitation(p));
}

/* ------------------------------------------------------------------------- */
/* 測試                                                                       */
/* ------------------------------------------------------------------------- */

test.use({ actionTimeout: 3000 });

/** 文檔頁只檢查用到互動元件的範例（含 data-cu-*，或帶有需要 JS 的互動 class） */
const HOOK_CLASS_RE = new RegExp(
  "\\b(" +
    [
      ...new Set(
        CLASS_HOOKS.map(([sel]) => sel)
          .filter((s) => !s.includes("[data-cu"))
          .flatMap((s) => s.match(/cu-[a-z0-9-]+/g) || []),
      ),
    ].join("|") +
    ")\\b",
);
const usesInteractive = (html: string) =>
  /data-cu-/.test(html) || /<dialog[\s>]/.test(html) || HOOK_CLASS_RE.test(html);

function groupByComponent(examples: Example[]): Map<string, Example[]> {
  const groups = new Map<string, Example[]>();
  for (const ex of examples) {
    const list = groups.get(ex.component) || [];
    list.push(ex);
    groups.set(ex.component, list);
  }
  return groups;
}

function defineSuite(title: string, examples: Example[], skipReason?: string) {
  test.describe(title, () => {
    if (skipReason) {
      test("（略過）", () => test.skip(true, skipReason));
      return;
    }
    for (const [component, list] of groupByComponent(examples)) {
      test(component, async ({ page }) => {
        await setupRoutes(page);
        const failures: string[] = [];
        for (const ex of list) {
          const problems = await auditExample(page, ex.html);
          if (problems.length) failures.push(`範例 #${ex.index}\n    - ${problems.join("\n    - ")}`);
        }
        expect(failures, `${title} › ${component} 的範例無法照抄使用：\n  ${failures.join("\n  ")}`).toEqual([]);
      });
    }
  });
}

defineSuite("components.json example", componentsJsonExamples());
defineSuite("llms.txt", llmsExamples());
const docs = docsExamples().filter((ex) => usesInteractive(ex.html));
defineSuite("docs Code 範例", docs, docs.length ? undefined : "docs/ 尚未建置，請先執行 npm run build:docs");

/**
 * 檢查器自我驗證（反向測試）：曾經出現在 llms.txt / components.json / 文檔頁的錯誤寫法，
 * 必須被上面的規則抓到，避免規則被改鬆而不自知。
 */
test.describe("examples 檢查器自我驗證", () => {
  const BAD: Array<{ name: string; html: string; expect: RegExp }> = [
    {
      name: "Multi Select 的 <div> trigger 無法鍵盤操作",
      html: `<div class="cu-multi-select" data-cu-multi-select>
  <div class="cu-multi-select-trigger" data-cu-multi-select-trigger><div data-cu-multi-select-tags><span data-cu-multi-select-placeholder>Select...</span></div></div>
  <div class="cu-multi-select-content" data-cu-multi-select-content hidden><ul data-cu-multi-select-list><li class="cu-multi-select-item" data-cu-multi-select-item data-cu-value="a">A</li></ul></div>
</div>`,
      expect: /無法以鍵盤操作：<div[^>]*data-cu-multi-select-trigger/,
    },
    {
      name: "Date Picker 月曆缺少 data-cu-calendar 等屬性",
      html: `<div class="cu-date-picker" data-cu-date-picker>
  <button type="button" class="cu-date-picker-trigger" data-cu-date-picker-trigger><span data-cu-date-picker-value>Pick a date</span></button>
  <input type="hidden" data-cu-date-picker-input value="">
  <div class="cu-date-picker-content" data-cu-date-picker-content>
    <div class="cu-calendar"><div class="cu-calendar-header"><button class="cu-calendar-nav">‹</button><span class="cu-calendar-title">March 2026</span><button class="cu-calendar-nav">›</button></div><div class="cu-calendar-grid"></div></div>
  </div>
</div>`,
      expect: /缺少 \[data-cu-calendar\]/,
    },
    {
      name: "Combobox trigger 缺少 type=button",
      html: `<div class="cu-combobox" data-cu-combobox>
  <button class="cu-combobox-trigger" data-cu-combobox-trigger><span data-cu-combobox-value>Select...</span></button>
  <div class="cu-combobox-content" data-cu-combobox-content hidden><ul data-cu-combobox-list><li class="cu-combobox-item" data-cu-combobox-item>A</li></ul></div>
</div>`,
      expect: /data-cu-combobox-trigger> 缺少 type="button"/,
    },
    {
      name: "<dialog> 缺少 data-cu-dialog，關閉鈕不作用",
      html: `<button data-cu-dialog-trigger="dlg">Open</button>
<dialog id="dlg" class="cu-dialog"><h2 class="cu-dialog-title">Title</h2><button data-cu-dialog-close>Close</button></dialog>`,
      expect: /data-cu-dialog-close> 不在 \[data-cu-dialog\] 內/,
    },
    {
      name: "按鈕巢狀在按鈕內",
      html: `<button class="cu-button">Outer <button class="cu-button">Inner</button></button>`,
      expect: /<button> 寫在 <button> 內/,
    },
    {
      name: "React 的 htmlFor",
      html: `<label class="cu-label" htmlFor="email">Email</label><input id="email" class="cu-input">`,
      expect: /React 的 htmlFor/,
    },
    {
      name: "範例自帶的 <script> 與 cubby-ui.js 重複綁定（點兩次 = 沒開）",
      html: `<div class="cu-dropdown" data-cu-dropdown>
  <button class="cu-button cu-button-outline" data-cu-dropdown-trigger>Open</button>
  <div class="cu-dropdown-content" data-cu-dropdown-content hidden><div class="cu-dropdown-item">Profile</div></div>
</div>
<script>
  document.querySelectorAll("[data-cu-dropdown]").forEach(function (d) {
    d.querySelector("[data-cu-dropdown-trigger]").addEventListener("click", function () {
      d.querySelector("[data-cu-dropdown-content]").toggleAttribute("hidden");
    });
  });
</script>`,
      expect: /重新查詢 \[data-cu-dropdown\][\s\S]*選單沒有開啟/,
    },
    {
      name: "Carousel 缺少 viewport / slide / prev 屬性",
      html: `<div class="cu-carousel" data-cu-carousel><div class="cu-carousel-viewport"><div class="cu-carousel-slide">1</div></div><button class="cu-carousel-prev">‹</button></div>`,
      expect: /缺少 data-cu-carousel-viewport/,
    },
    {
      name: "Number Input 按鈕放進 <form> 會送出表單",
      html: `<div class="cu-number-input" data-cu-number-input><button data-cu-number-decrement>−</button><input type="number" data-cu-number-field value="1"><button data-cu-number-increment>+</button></div>`,
      expect: /送出了外層 <form>/,
    },
    {
      name: "Segmented radio 模式的 label 沒有關聯 input",
      html: `<div class="cu-segmented" data-cu-segmented><input type="radio" name="v" class="cu-segmented-input" checked><label class="cu-segmented-item">A</label><input type="radio" name="v" class="cu-segmented-input"><label class="cu-segmented-item">B</label></div>`,
      expect: /沒有 for 也沒有包住控制項/,
    },
  ];

  for (const bad of BAD) {
    test(bad.name, async ({ page }) => {
      await setupRoutes(page);
      const problems = await auditExample(page, bad.html);
      expect(problems.join("\n")).toMatch(bad.expect);
    });
  }
});
