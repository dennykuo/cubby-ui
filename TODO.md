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
- [ ] **Chart** — Data Display — 圖表容器（搭配 Chart.js 等外部庫的包裝樣式）
- [x] **Context Menu** — Overlay — 右鍵選單（表格列操作）

### 中優先（提升操作效率）

- [x] **Timeline** — Data Display — 時間軸（活動日誌、審計紀錄）
- [x] **Kbd** — Typography — 鍵盤快捷鍵標示（`⌘` `Shift` `K`）
- [ ] **Copy Button** — Basic — 一鍵複製（ID、API Key、程式碼片段），需少量 JS

### 低優先（特定場景使用）

- [x] **Pin Input** — Forms — 驗證碼輸入（2FA / OTP），需 JS
- [x] **Rating** — Forms — 星級評分
- [x] **Dropzone** — Forms — 拖放上傳區（比 File Input 更強），需 JS
- [x] **Color Picker** — Forms — 色彩選擇器（主題設定），需 JS

## 工程與品質

以下項目自已歸檔的 `references/archive/PLAN-3.md` 與 `references/archive/UI-UX-REVIEW.md` 移入（2026-09-28）。

- [ ] **Dialog 點擊內部 padding 誤關閉** — `src/scripts/core/overlay.js` 以 `e.target === dialog` 判斷點擊 backdrop，但 `cu-dialog` 的 `p-6` 設在 `<dialog>` 本體上，點在對話框內部 padding 或子元素間的空白也會關閉（已實測重現）。改用 `getBoundingClientRect()` 比對點擊座標，並補 E2E 測試。Drawer 本體無 padding、Alert Dialog 不允許 backdrop 關閉，兩者不受影響（來源：PLAN-3 #4）
- [ ] **JS 型別檢查** — `tsconfig.json` 啟用 `allowJs` + `checkJs`，讓 `src/scripts/` 的 ESM 模組納入 `npm run type-check`（來源：PLAN-3 #1）
- [ ] **Lint / Format** — 導入 Prettier + `prettier-plugin-tailwindcss`（Tailwind class 自動排序）與 ESLint，並加入 CI（來源：PLAN-3 #2）
- [ ] **版本發布流程** — 導入 Changesets，自動產生 `CHANGELOG.md` 與版本號（來源：PLAN-3 #5）
- [ ] **Combobox / Multi Select 搜尋 debounce** — 目前每次 `input` 事件都即時過濾（來源：UI-UX-REVIEW 第七節）
- [ ] **表單元件 Props 明確型別** — Input / Textarea / Select / Checkbox / Radio 的 `disabled` / `required` / `placeholder` 目前只靠 `[key: string]: any` 透傳，缺少型別提示（來源：UI-UX-REVIEW 第八節）
