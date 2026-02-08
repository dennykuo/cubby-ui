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

## 改善項目

- [ ] **Aspect Ratio** — Basic — 固定比例容器（16:9、4:3 等），一個 CSS class 搞定
- [ ] **Carousel** — Data Display — 輪播，CSS `scroll-snap` + 少量 JS，視覺效果好
- [ ] **Command** — Overlay — 命令面板（⌘K），需較多 JS，但現代應用常見
- [ ] **Context Menu** — Overlay — 右鍵選單，結構與 Dropdown 相似，需 JS 定位
- [ ] **Resizable** — Layout — 可拖拽調整大小的面板，需 JS，但適合 dashboard 場景

## Dashboard 元件

### 高優先（幾乎每個 dashboard 都會用到）
- [ ] **Date Picker** — Forms — 日期選擇器（單日、日期範圍），需 JS
- [ ] **Calendar** — Data Display — 月曆檢視（日期格狀排列），需 JS
- [ ] **Chart** — Data Display — 圖表容器（搭配 Chart.js 等外部庫的包裝樣式）
- [ ] **Context Menu** — Overlay — 右鍵選單（表格列操作）

### 中優先（提升操作效率）

- [ ] **Timeline** — Data Display — 時間軸（活動日誌、審計紀錄）
- [ ] **Kbd** — Typography — 鍵盤快捷鍵標示（`⌘` `Shift` `K`）
- [ ] **Copy Button** — Basic — 一鍵複製（ID、API Key、程式碼片段），需少量 JS

### 低優先（特定場景使用）

- [ ] **Pin Input** — Forms — 驗證碼輸入（2FA / OTP），需 JS
- [ ] **Rating** — Forms — 星級評分
- [x] **Dropzone** — Forms — 拖放上傳區（比 File Input 更強），需 JS
- [ ] **Color Picker** — Forms — 色彩選擇器（主題設定），需 JS
