# TODO — 元件開發清單

定期分析對比 shadcn/ui、Radix、Chakra UI、Ant Design、Flowbite 等主流元件庫，找出有價值的補強方向。

## 命名考慮清單
- Cubby 小盒子
- Caddy 小罐、小盒子或收納盒（如桌面整理盒）
- Framekit 框架積木
- Bitsy 小元件集合 (bitsy: 零星小東西，已有遊戲框架用此命名)
- Nibble 小口吃掉的元件
- Nook 角落小空間
- Cove 小灣、包覆空間
- Crate 木箱、收納箱 (Rust 用到了)

## 改善項目

- [x] **Aspect Ratio** — Basic — 固定比例容器（16:9、4:3 等），一個 CSS class 搞定
- [x] **Carousel** — Data Display — 輪播，CSS `scroll-snap` + 少量 JS，視覺效果好
- [x] **Command** — Overlay — 命令面板（⌘K），需較多 JS，但現代應用常見
- [x] **Context Menu** — Overlay — 右鍵選單，結構與 Dropdown 相似，需 JS 定位
- [x] **Resizable** — Layout — 可拖拽調整大小的面板，需 JS，但適合 dashboard 場景

## Dashboard 元件

### 高優先（幾乎每個 dashboard 都會用到）
- [x] **Date Picker** — Forms — 日期選擇器（單日、日期範圍），需 JS
- [x] **Calendar** — Data Display — 月曆檢視（日期格狀排列），需 JS
- [x] **Chart** — Data Display — 圖表容器（搭配 Chart.js 等外部庫的包裝樣式）
- [x] **Context Menu** — Overlay — 右鍵選單（表格列操作）

### 中優先（提升操作效率）

- [x] **Timeline** — Data Display — 時間軸（活動日誌、審計紀錄）
- [x] **Kbd** — Typography — 鍵盤快捷鍵標示（`⌘` `Shift` `K`）
- [x] **Copy Button** — Basic — 一鍵複製（ID、API Key、程式碼片段），需少量 JS

### 低優先（特定場景使用）

- [x] **Pin Input** — Forms — 驗證碼輸入（2FA / OTP），需 JS
- [x] **Rating** — Forms — 星級評分
- [x] **Dropzone** — Forms — 拖放上傳區（比 File Input 更強），需 JS
- [x] **Color Picker** — Forms — 色彩選擇器（主題設定），需 JS

## 工程與品質

以下項目自已歸檔的 `references/archive/PLAN-3.md` 與 `references/archive/UI-UX-REVIEW.md` 移入（2026-09-28）。

- [x] **Dialog 點擊內部 padding 誤關閉** — `src/scripts/core/overlay.js` 以 `e.target === dialog` 判斷點擊 backdrop，但 `cu-dialog` 的 `p-6` 設在 `<dialog>` 本體上，點在對話框內部 padding 或子元素間的空白也會關閉（已實測重現）。改用 `getBoundingClientRect()` 比對點擊座標，並補 E2E 測試。Drawer 本體無 padding、Alert Dialog 不允許 backdrop 關閉，兩者不受影響（來源：PLAN-3 #4）
- [x] **JS 型別檢查** — `tsconfig.json` 啟用 `allowJs` + `checkJs`，讓 `src/scripts/` 的 ESM 模組納入 `npm run type-check`（來源：PLAN-3 #1）
- [ ] **Lint / Format** — 導入 Prettier + `prettier-plugin-tailwindcss`（Tailwind class 自動排序）與 ESLint，並加入 CI（來源：PLAN-3 #2）。ESLint（正確性規則）已完成並納入 CI；Prettier 會產生大量格式差異，尚未導入
- [ ] **版本發布流程** — 導入 Changesets，自動產生 `CHANGELOG.md` 與版本號（來源：PLAN-3 #5）
- [x] **Combobox / Multi Select 搜尋 debounce** — 目前每次 `input` 事件都即時過濾（來源：UI-UX-REVIEW 第七節）
- [x] **表單元件 Props 明確型別** — Input / Textarea / Select / Checkbox / Radio 的 `disabled` / `required` / `placeholder` 目前只靠 `[key: string]: any` 透傳，缺少型別提示（來源：UI-UX-REVIEW 第八節）

### 2026-10 整合時發現的後續項目

- [ ] **`dark:` variant 跟隨系統偏好而非 `.dark` class** — `theme.css` 未定義 `@custom-variant dark`，9 個元件 CSS 的 `dark:` 被編譯成 `@media (prefers-color-scheme: dark)`；以 `.dark` 切換的網站，浮層的 `dark:shadow-*` 與網站深淺不同步。修法：`@custom-variant dark (&:where(.dark, .dark *));`
- [ ] **浮層 trigger 的 `stopPropagation`** — Dropdown、Popover 等 trigger 仍會 `stopPropagation`，開啟另一個浮層時已開啟的不會關閉（Combobox / Multi Select / Date Picker 已修正）
- [ ] **`destroy()` 後 `init()` 是否重新登記元件** — 元件以 `_cuInit` 判斷是否已初始化，`destroy()` 未清除，推測 destroy 後再 init 不會重新登記到 registry（未實測）
- [ ] **無障礙缺口**（E2E 中以 `test.fixme` 標記）— Combobox `aria-activedescendant`；Multi Select 移除按鈕的無障礙名稱；Date Picker trigger 的 `aria-haspopup` / `aria-expanded` 與開啟時聚焦；日期按鈕的完整日期名稱與 `aria-selected` / `aria-current`；Command Palette 結果清單沒有 `role` / `aria-activedescendant`
- [ ] **文件與標記不一致** — llms.txt 的 Multi Select trigger 是 `<div>`（無法鍵盤聚焦）；llms.txt 的 Date Picker 範例缺 `data-cu-calendar` 等屬性，照抄不會初始化；Dashboard V2 範例有 16 處 `<Label htmlFor>`（Astro 輸出成 `htmlFor` 屬性，label 未關聯）
- [ ] **Code Block** — 複製沒有 aria-live 播報與失敗處理（可改用 Copy Button 的共用邏輯）；`code-block.blade.php` 有既有轉換錯誤（`$codeTheme === '$light'`、殘留 `{filename || language}`）
- [ ] **`toast.spec.ts` promise 測試偶發失敗** — 高負載時 promise 在斷言前 resolve，抓不到 loading 狀態（單獨重跑穩定）
