# Cubby UI — 資深 UI/UX 設計師審查報告

---

## 一、設計系統基礎（整體優秀） ✅ 全部修復

| 問題 | 狀態 | 修復說明 |
|------|------|----------|
| ~~Drawer footer 間距~~ | ✅ | `p-6 pt-0` → `px-6 pb-6 mt-6`，與 Dialog footer 一致 |
| ~~Collapsible 缺動畫~~ | ✅ | 新增 `interpolate-size: allow-keywords` + `@starting-style` height/opacity 過渡，與 Accordion 一致 |
| ~~Toast 缺退出動畫~~ | ✅ | 已確認 CSS 有 `cu-toast-exit` + `@keyframes cu-toast-out`，JS `dismissToast()` 已使用 |
| ~~Tree View hover 不一致~~ | ✅ | `hover:bg-accent/60` → `hover:bg-muted/60`，與 Sidebar 一致 |

---

## 二、XSS 風險 ✅ 已修復

~~Toast 用 `innerHTML` 組合 `title`，若 data 屬性含惡意 HTML 可被注入，應改用 `textContent`~~

> **已修復**：Toast 已全面使用 DOM API（`textContent` + `createElement`），無 `innerHTML` 使用。

---

## 三、響應式設計（覆蓋不足） ✅ 全部完成

- ~~**Sidebar**：固定 `w-56`，沒有行動端摺疊/隱藏機制~~ ✅ 已新增 `cu-sidebar-responsive`（md+ 顯示）、`cu-sidebar-overlay`（行動端滑出面板）、`cu-sidebar-backdrop`（遮罩層）CSS 類別
- ~~**Table**：僅 `overflow-x-auto`，無行動端卡片化轉換~~ ✅ 新增 `cu-table-stacked`，行動端（≤640px）自動轉換成堆疊卡片佈局，透過 `data-label` 屬性顯示欄位名稱
- ~~**Button**：無全寬變體，在窄螢幕可能溢出~~ ✅ 新增 `cu-button-block`（始終全寬）和 `cu-button-block-sm`（行動端全寬、sm+ 自動寬度）
- ~~**元件文檔頁面**：幾乎沒有展示行動端適配方案~~ ✅ Button 頁新增 Responsive 範例段落，Data Table 頁新增 Responsive (Stacked) 範例段落

---

## 四、Astro 元件層缺口 ✅ 全部完成

**~~5 個元件有 CSS 但沒有 Astro 包裝器：~~** ✅ 已完成
- ~~`NumberInput`、`Combobox`、`MultiSelect`、`Dropzone`、`TransferList`~~
- ~~使用者無法享受 TypeScript Props 型別安全~~

> **已完成**：5 個元件皆已建立 Astro 包裝器（含 TypeScript Props 型別定義）：
> - `NumberInput.astro`（min/max/step/value/disabled props）
> - `Combobox.astro` + `ComboboxItem.astro`（placeholder/searchPlaceholder/emptyText props）
> - `MultiSelect.astro` + `MultiSelectItem.astro`（searchable/placeholder props）
> - `Dropzone.astro` + `DropzoneIcon/Title/Description.astro`（disabled/multiple/accept props）
> - `TransferList.astro` + `Panel/Header/Content/Item/Actions/Search.astro`（side/value props）

**~~Props 定義不完整：~~** ✅ 全部完成

| 問題 | 狀態 | 修復說明 |
|------|------|----------|
| ~~Badge 缺 soft 變體~~ | ✅ | soft 變體早已在 Props 中；另新增 `size` prop（`sm` / `default` / `lg`） |
| ~~Skeleton 缺動畫變體~~ | ✅ | 新增 `animation` prop（`pulse` / `shimmer`）和 `shape` prop（`default` / `circle` / `text`） |
| ~~Dialog/AlertDialog 缺尺寸~~ | ✅ | 已確認 `size` prop 早已存在（`sm` / `md` / `default` / `xl` / `full`） |
| ~~表單元件 Props 過於簡陋~~ | ✅ | Input 新增 `variant`（error/success）；Textarea 新增 `variant` + `auto`；Label 新增 `required` |

---

## 五、文檔頁面使用情境豐富度 ✅ 全部完成

**需要豐富情境的元件：**

| 元件 | 現有情境 | 建議新增 | 狀態 |
|------|---------|---------|------|
| ~~**Tabs**~~ | 8 個 | ~~垂直 Tabs、帶圖示、disabled tab、可捲動 tabs~~ | ✅ 早已有 vertical/icons/disabled/pills/underline，新增 Scrollable |
| ~~**Toast**~~ | 9 個 | ~~帶操作按鈕、持續型、堆疊通知、帶進度條~~ | ✅ 早已有 with action/custom duration/positions/with icon，新增 Persistent + Stack Limit |
| ~~**Combobox**~~ | 6 個 | ~~分組選項、disabled、空狀態、async 載入~~ | ✅ 新增 Disabled Items + Grouped Options |
| ~~**Breadcrumb**~~ | 5 個 | ~~帶下拉、行動端摺疊、省略號~~ | ✅ 新增 With Ellipsis |
| ~~**Input**~~ | 11 個 | ~~前綴/後綴圖示、字數限制、清除按鈕、驗證狀態~~ | ✅ 早已有 addon/icon/validation/sizes，新增 Character Count |
| ~~**Checkbox**~~ | 9 個 | ~~indeterminate 狀態、帶描述、行內排列~~ | ✅ 新增 With Description + Indeterminate + Inline Layout |
| ~~**Data Table**~~ | 9 個 | ~~排序、分頁、批次操作、空狀態、loading 骨架~~ | ✅ 早已有 sorting/pagination/row actions/striped/responsive，新增 Empty State + Loading Skeleton |
| ~~**Filter Bar**~~ | 5 個 | ~~清除全部、活動篩選 chip、結果計數~~ | ✅ 新增 With Active Chips（含 clear all + result count） |
| ~~**Steps**~~ | 6 個 | ~~錯誤狀態、可點擊跳轉、搭配表單~~ | ✅ 新增 Error State + Clickable Steps |

---

## 六、缺少的跨元件組合範例

目前文檔頁面都是單元件展示，缺少**真實應用場景**的組合頁面：

1. **Dashboard 頁面** — Header + Sidebar + Stat Cards + Data Table + Filter Bar
2. **表單精靈** — Steps + Form Group + Button（多步驟流程）
3. **設定頁面** — Sidebar Nav + Setting Items + Toggle + Dialog 確認
4. **資料管理頁面** — Page Header + Filter Bar + Data Table + Pagination + Toast 回饋
5. **Modal 工作流** — Dialog 表單 → 提交 → Toast 通知

---

## 七、JS 互動品質

**架構問題：**
- 716 行單一檔案，可模組化拆分
- 44 個 `addEventListener` 全掛在 `document` 上，無事件委派
- 無事件清理機制，動態 DOM 會造成記憶體洩漏
- Combobox/Multi-Select 搜尋無 debounce

---

## 八、改善建議優先順序

### 高優先（影響可用性） ✅ 全部完成
- ~~為 5 個缺失元件建立 Astro 包裝器~~ ✅
- ~~修復 Toast `innerHTML` XSS 風險~~ ✅（已確認早已使用 DOM API，無 innerHTML）
- ~~Sidebar 行動端響應式支援~~ ✅（新增 `cu-sidebar-responsive` / `cu-sidebar-overlay` / `cu-sidebar-backdrop`）

### 中優先（提升體驗）
- 補齊 Badge soft 變體、Skeleton shimmer 變體的 Props
- Dialog/AlertDialog 增加 size prop
- Collapsible 增加展開/收合動畫
- Toast 增加退出動畫
- 統一 hover 狀態（Tree View vs Sidebar）

### 低優先（錦上添花）
- 增加跨元件組合範例頁面（Dashboard、Settings 等）
- 豐富 Tabs、Toast、Input、Data Table 使用情境
- JS 模組化拆分 + 事件委派重構
- 表單元件 Props 增加明確的 disabled/required/placeholder 型別
