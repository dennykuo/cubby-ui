# TODO — 元件開發清單

## 推薦優先開發

- [x] **Separator** — Basic — 水平/垂直分隔線，極簡單，使用頻率高
- [x] **Sheet** — Overlay — 側邊滑出面板（drawer），`<dialog>` + CSS transform 即可實現
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
