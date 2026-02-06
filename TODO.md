# TODO — 元件開發清單

## 命名考慮清單
- Cubby 小盒子
- Caddy 小罐、小盒子或收納盒（如桌面整理盒）
- Framekit 框架積木
- Bitsy 小元件集合 (bitsy: 零星小東西，已有遊戲框架用此命名)
- Nibble 小口吃掉的元件
- Nook 角落小空間
- Cove 小灣、包覆空間
- Crate 木箱、收納箱 (Rust 用到了)

## 推薦優先開發

- [x] **Separator** — Basic — 水平/垂直分隔線，極簡單，使用頻率高
- [x] **Drawer** — Overlay — 側邊滑出面板，`<dialog>` + CSS transform 即可實現
- [x] **Toast** — Feedback — 通知提示，需少量 JS 控制出現/消失，幾乎所有應用都需要
- [x] **Popover** — Overlay — 通用彈出層，比 Dropdown 更靈活，可用 CSS `popover` 原生屬性
- [x] **Hover Card** — Overlay — 滑鼠懸停卡片，純 CSS 可做，適合使用者頭像、連結預覽

## 值得考慮

- [x] **Collapsible** — Data Display — 可折疊區塊，與 Accordion 類似但更通用，`<details>` 單獨使用
- [x] **Alert Dialog** — Overlay — Dialog 的阻斷變體，強調確認/取消動作，可複用現有 Dialog 樣式
- [ ] **Aspect Ratio** — Basic — 固定比例容器（16:9、4:3 等），一個 CSS class 搞定
- [ ] **Carousel** — Data Display — 輪播，CSS `scroll-snap` + 少量 JS，視覺效果好
- [ ] **Command** — Overlay — 命令面板（⌘K），需較多 JS，但現代應用常見

## 進階（複雜度較高）

- [ ] **Context Menu** — Overlay — 右鍵選單，結構與 Dropdown 相似，需 JS 定位
- [x] **Menubar** — Navigation — 水平選單列 + 下拉子選單，桌面應用風格
- [ ] **Resizable** — Layout — 可拖拽調整大小的面板，需 JS，但適合 dashboard 場景
- [x] **Data Table** — Data Display — 增強版 Table（排序、篩選、分頁），需較多 JS

## Dashboard 元件

### 高優先（幾乎每個 dashboard 都會用到）

- [x] **Stat Card** — Data Display — KPI 指標卡（數字、標籤、趨勢箭頭、百分比變化）
- [x] **Empty State** — Feedback — 無資料佔位（圖示 + 說明 + CTA 按鈕）
- [x] **Combobox** — Forms — 可搜尋下拉選單（用戶 / 項目篩選），需 JS
- [x] **Multi Select** — Forms — 多選標籤式下拉（篩選條件、權限指派），需 JS
- [ ] **Date Picker** — Forms — 日期選擇器（單日、日期範圍），需 JS
- [ ] **Calendar** — Data Display — 月曆檢視（日期格狀排列），需 JS
- [ ] **Chart** — Data Display — 圖表容器（搭配 Chart.js 等外部庫的包裝樣式）
- [ ] **Context Menu** — Overlay — 右鍵選單（表格列操作）

### 中優先（提升操作效率）

- [ ] **Timeline** — Data Display — 時間軸（活動日誌、審計紀錄）
- [x] **Steps** — Navigation — 步驟指示器（建立流程、引導精靈）
- [x] **Toolbar** — Basic — 工具列（批次操作、編輯器動作列）
- [x] **Scroll Area** — Layout — 自訂捲軸（側邊面板、資料區塊）
- [x] **Tree View** — Data Display — 樹狀結構（檔案管理、分類階層），需 JS
- [ ] **Kbd** — Typography — 鍵盤快捷鍵標示（`⌘` `Shift` `K`）
- [ ] **Copy Button** — Basic — 一鍵複製（ID、API Key、程式碼片段），需少量 JS

### 低優先（特定場景使用）

- [ ] **Pin Input** — Forms — 驗證碼輸入（2FA / OTP），需 JS
- [x] **Number Input** — Forms — 數字步進器（數量調整）
- [ ] **Rating** — Forms — 星級評分
- [x] **Dropzone** — Forms — 拖放上傳區（比 File Input 更強），需 JS
- [ ] **Color Picker** — Forms — 色彩選擇器（主題設定），需 JS
- [x] **Transfer List** — Forms — 穿梭框（左右移動項目），需 JS

---

## 樣式優化清單

### P0 — 全域基礎

- [x] ~~**補齊暗色模式 token**~~ — 已在 `theme.css` 的 `.dark` 區塊完整定義所有語意色彩的暗色模式值
