---
"cubby-ui": patch
---

修正

- **`dark:` 工具類別跟隨作業系統而非 `.dark` class**：`theme.css` 未定義 `@custom-variant dark`，Tailwind v4 以 `prefers-color-scheme` 編譯 `dark:`，9 個元件的浮層陰影（`dark:shadow-*`）在使用者選擇與作業系統不同的主題時與網站深淺不同步；文檔站 Header 的深淺切換圖示也因此顯示錯誤。新增 `@custom-variant dark (&:where(.dark, .dark *))`，Dark Mode 文檔補上使用者自訂 `dark:` 的同樣設定
- **Date Picker** 內的月曆被初始化兩次：方向鍵一次移動兩格，且重複呼叫 `init()` / `refresh()` 後選取的日期不再寫回 input；hidden input 的預設值不會讓月曆開在該月、也不會標記選取
- **Calendar** 跨月鍵盤導航聚焦到錯誤日期；以 Enter 選取後焦點遺失
- **Combobox / Multi Select** 篩選掉已高亮的項目後，按 Enter 會選到看不見的項目
- **Combobox / Multi Select / Date Picker** 選取或按 Escape 後焦點遺失（現回到 trigger）；開啟其中一個時不會關閉另一個已開啟的同類浮層；trigger 放在 `<form>` 內點擊會送出表單
- **Multi Select** 預選項目初始化時不會渲染成標籤；值含引號時渲染標籤會拋錯；以鍵盤移除標籤後焦點遺失；文檔「Preset Values」範例在 trigger `<button>` 內巢狀 `<button>`，HTML 解析後元件無法運作
- 文檔站所有頁面共用同一個 meta description
- Dashboard V2 範例頁誤用 React 寫法 `defaultValue` / `className`，欄位沒有預設值、padding 未套用
- **Command Palette** 關閉時仍顯示：`.cu-command` 的 `display: flex` 寫在基礎 class 上，作者樣式蓋過瀏覽器 `dialog:not([open]) { display: none }`，關閉中的 palette 以 `fixed` 置中疊在頁面上（文檔頁範例因此常駐顯示、Esc 關閉後畫面不變）。`display: flex` 改為只套用於 `.cu-command[open]`
- Header 的 GitHub 連結原本指向 `https://github.com`，改為本專案 repo
- Dashboard V2 / V3 範例的導航 active 狀態在建置輸出中永遠不亮（`Astro.url.pathname` 帶尾端斜線，導航資料不帶），比對前改為去掉尾端斜線
- Dashboard V2 範例側邊欄的 4 個項目（數據分析、文件中心、訊息通知、API 金鑰）指向從未建立的頁面，改為 `#` 佔位連結
- **Dialog** 點擊對話框內部 padding 區或子元素間的空白會誤關閉：`cu-dialog` 的 `p-6` 設在 `<dialog>` 本體上，這些點擊的 `e.target` 也是 dialog。`src/scripts/core/overlay.js` 的 backdrop 判斷改以 `getBoundingClientRect()` 比對點擊座標，只有落在 dialog 邊界框外才關閉；`detail === 0` 的非指標 click（鍵盤、程式化 `click()`，座標為 0,0）不視為 backdrop 點擊。`tests/e2e/dialog.spec.ts` 新增 padding 區與 `detail === 0` 兩個案例
- **`CubbyUI.destroy()` 後再 `init()` 不會重新登記元件**：同一批元素（未替換 DOM）在 `destroy()` 後再 `init()` 時，元件因 `_cuInit` 直接跳過，不再被 document 級 handler 追蹤（Dropdown 外部點擊、Escape 不會關閉，Back to Top 捲動監聽不會恢復）。`core/registry.js` 新增 `track()` / `restore()`，已初始化的元素改為重新登記而不重複綁定；Back to Top、Image Compare 恢復 destroy 移除的監聽，Countdown 重新計時且已完成的不再觸發 `cu:countdown:complete`
- **浮層互斥**：Dropdown trigger、Tabs 關閉按鈕與 Multi Select 選項點擊不再 `stopPropagation`，開啟 Dropdown / Popover / Combobox 等任一浮層時，其他已開啟的會關閉
- **Blade：`code-block.blade.php` 無法渲染**：輸出含 `$codeTheme === '$light'`、殘留的 `{filename || language}` 與未定義變數 `$codeTheme`（Laravel 渲染即拋 `ViewException`）。改用手寫 override（`scripts/blade/overrides/code-block.blade.php`），並以 `$attributes->class()` 正確合併使用者傳入的 class
- **Blade：`date-picker.blade.php`** 把 `{value || placeholder}` 原樣輸出到頁面
- **Blade 轉換器**：條件式中的字串字面量不再被轉成 PHP 變數；文字位置的 `{a || b}` 轉為 `{{ $a ?: $b }}`
- **Code Block** 複製成功的狀態色看不清楚：暗色頁面時 success token 在深色區塊上對比只有約 2.9:1；light 變體的成功色被按鈕本身的文字色蓋過；header 內的按鈕在滑鼠停留時（也就是剛點擊後）狀態色被 hover 樣式蓋過。成功 / 失敗狀態改用固定色階（`green-400` / `red-400`，light 變體 `green-800` / `red-700`，對比皆 ≥ 4.5:1），hover 樣式不再套用到狀態中的按鈕
- **Calendar** 日期按鈕的鍵盤焦點看不見（`outline-none` 且沒有 focus-visible 樣式），改為 `ring-2 ring-ring/40` 焦點環並疊在相鄰日期之上，選取日上也可辨識
- **範例照抄無法運作**（`llms.txt` / `components.json` / 文檔頁）：Dialog / Drawer / Alert Dialog 缺 `data-cu-dialog` 等屬性（關閉鈕無作用、未設 `role` / `aria-labelledby`）；Date Picker 缺月曆必要屬性；Carousel、Command Palette、Checkbox Group、Segmented Control 缺 JS 必要的 `data-cu-*`；Multi Select trigger 是無法鍵盤操作的 `<div>`；Combobox、Number Input、Toggle Group、Transfer List、Color Picker、Tag Input 的按鈕缺 `type="button"`；Rating 星等是 `<span>`；Transfer List 缺右側面板；Tour 範例步驟欄位寫成 `content`（應為 `description`）並使用不存在的 trigger 屬性；label 未以 `for` / `id` 關聯控制項
- **文檔頁 15 個範例自帶重新實作元件的 `<script>`**（Dropdown、Combobox、Multi Select、Tabs、Popover、Menubar、Date Picker 等），與自動初始化的 cubby-ui.js 重複綁定，點擊 trigger 會開了又關
- Countdown 文檔範例缺數值屬性，數字永遠不會更新；Hover Card 範例的 popover 屬性與純 CSS 懸停衝突
- Dashboard V2 設定頁的 Tabs 使用 React 寫法（`defaultValue` / `data-[state=active]`）無法切換，16 處 `htmlFor` 未生效；改用 `data-cu-tabs` 並補上「訂閱方案」分頁內容
- **Header** 漢堡按鈕在桌機也會顯示：`HeaderMobileToggle`（含 Blade 版）與 Header 範例以 Tailwind 的 `md:hidden` 隱藏觸發按鈕，但預編譯的 `cubby-ui.css` 不含工具類別，只用 dist CSS 的專案在桌機同時看到導航列與漢堡按鈕。改用新的 `cu-header-mobile-toggle-{bp}`
