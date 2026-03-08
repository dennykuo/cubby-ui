# Cubby UI — 資深 UI/UX 設計師審查報告

---

## 一、設計系統基礎（整體優秀）

**做得好的部分：**
- 色彩系統完整：8 組語意色彩 + 配對前景色，暗色模式全覆蓋
- 陰影層次分明：`shadow-sm`（卡片）→ `shadow-md`（浮層）→ `shadow-lg`（Dialog/Toast）
- 動畫規範統一：微互動 `duration-150`、狀態切換 `duration-200`
- `color-mix()` 處理半透明語意色，避免硬編碼 HSL
- `prefers-reduced-motion` 全域降低動畫支援

**需要改進的問題：**

| 問題 | 說明 |
|------|------|
| Button 圓角不一致 | xs/sm 用 `rounded-md`，md+ 用 `rounded-lg`，視覺斷層 |
| Drawer footer 間距 | 用 `pt-0` 而非 `mt-6`，與 Dialog footer 不一致 |
| Collapsible 缺動畫 | Accordion 有 height/opacity 過渡，Collapsible 沒有 |
| Toast 缺退出動畫 | 只有 `cu-toast-in` 入場，沒有退出 keyframes |
| Tree View hover 不一致 | 用 `hover:bg-accent/60`，Sidebar 用 `hover:bg-muted/60` |

---

## 二、無障礙性（最需改善的區域）

這是整個專案**最大的短板**。目前的 JS 互動對鍵盤使用者和螢幕閱讀器幾乎不可用：

**嚴重缺失：**
- **鍵盤導航**：只有 Escape 關閉，缺少 Arrow 鍵切換、Enter/Space 選取、Home/End 跳轉
- **ARIA 屬性**：Dropdown、Combobox、Multi-Select、Popover 缺 `aria-expanded`、`aria-controls`、`role`
- **Focus 管理**：Dialog 無 focus trap（雖用原生 `<dialog>` 部分緩解）、關閉後不還原焦點
- **Toast 通知**：缺 `role="status"` + `aria-live="polite"`，螢幕閱讀器無法感知
- **Number Input**：不支援 Arrow Up/Down 鍵盤增減

**XSS 風險**：Toast 用 `innerHTML` 組合 `title`，若 data 屬性含惡意 HTML 可被注入，應改用 `textContent`

**WAI-ARIA 合規對照：**

| 元件 | 狀態 | 缺失 |
|------|------|------|
| Accordion | 原生 `<details>` | — |
| Dialog/Drawer | 原生 `<dialog>` | 缺 `aria-labelledby` |
| Combobox | 不合規 | 缺 `role="combobox"`、鍵盤導航 |
| Multi-Select | 不合規 | 缺 roles、`aria-selected` |
| Dropdown | 部分合規 | 缺 item roles、鍵盤導航 |
| Menubar | 有 `aria-expanded` | 缺鍵盤導航 |
| Tabs | 部分合規 | JS 未同步 ARIA 屬性 |
| Toast | 不合規 | 缺 `aria-live` |

---

## 三、響應式設計（覆蓋不足）

目前只有 Header 和 Dialog footer 有響應式處理：

- **Sidebar**：固定 `w-56`，沒有行動端摺疊/隱藏機制
- **Table**：僅 `overflow-x-auto`，無行動端卡片化轉換
- **Button**：無全寬變體，在窄螢幕可能溢出
- **元件文檔頁面**：幾乎沒有展示行動端適配方案

---

## 四、Astro 元件層缺口

**5 個元件有 CSS 但沒有 Astro 包裝器：**
- `NumberInput`、`Combobox`、`MultiSelect`、`Dropzone`、`TransferList`
- 使用者無法享受 TypeScript Props 型別安全

**Props 定義不完整：**

| 問題 | 影響元件 |
|------|---------|
| Badge 缺 soft 變體 | CSS 有 `cu-badge-soft-*`，Props 沒列 |
| Skeleton 缺動畫變體 | CSS 有 `cu-skeleton-shimmer`，Props 沒列 |
| Dialog/AlertDialog 缺尺寸 | 無 `size` prop（sm/md/lg/xl） |
| 表單元件 Props 過於簡陋 | Input、Textarea、Select 等只有 `class` + `...rest` |

---

## 五、文檔頁面使用情境豐富度

**已經做得好的元件（情境充足）：**
- Button（9 變體 + 5 尺寸 + loading + icon + disabled）
- Card（表單卡、產品卡、成員卡、hover 卡）
- Stat Card（7 種變體）
- Dropdown（圖示、快捷鍵、危險項、使用者選單）
- Sidebar（5 種結構模式）

**需要豐富情境的元件：**

| 元件 | 現有情境 | 建議新增 |
|------|---------|---------|
| **Tabs** | 2 個（基礎 + 內容） | 垂直 Tabs、帶圖示、disabled tab、可捲動 tabs |
| **Toast** | 2 個（基礎 + 變體） | 帶操作按鈕、持續型、堆疊通知、帶進度條 |
| **Combobox** | 2 個 | 分組選項、disabled、空狀態、async 載入 |
| **Breadcrumb** | 3 個 | 帶下拉、行動端摺疊、省略號 |
| **Input** | 5 個（很基本） | 前綴/後綴圖示、字數限制、清除按鈕、驗證狀態 |
| **Checkbox** | 5 個 | indeterminate 狀態、帶描述、行內排列 |
| **Data Table** | 1 個（僅完整範例） | 排序、分頁、批次操作、空狀態、loading 骨架 |
| **Filter Bar** | 3 個 | 清除全部、活動篩選 chip、結果計數 |
| **Steps** | 3 個 | 錯誤狀態、可點擊跳轉、搭配表單 |

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

### 高優先（影響可用性）
1. 為 5 個缺失元件建立 Astro 包裝器
2. 補齊 ARIA 屬性（`aria-expanded`、`role`、`aria-live`）
3. 實作鍵盤導航（Arrow、Enter/Space、Home/End）
4. 修復 Toast `innerHTML` XSS 風險
5. Sidebar 行動端響應式支援

### 中優先（提升體驗）
6. 補齊 Badge soft 變體、Skeleton shimmer 變體的 Props
7. Dialog/AlertDialog 增加 size prop
8. Collapsible 增加展開/收合動畫
9. Toast 增加退出動畫
10. 統一 hover 狀態（Tree View vs Sidebar）

### 低優先（錦上添花）
11. 增加跨元件組合範例頁面（Dashboard、Settings 等）
12. 豐富 Tabs、Toast、Input、Data Table 使用情境
13. JS 模組化拆分 + 事件委派重構
14. 表單元件 Props 增加明確的 disabled/required/placeholder 型別
