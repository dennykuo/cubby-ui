---
"cubby-ui": patch
---

**Forced colors（Windows 高對比）** 只靠底色、文字色或陰影表達的狀態改為不靠顏色也能辨識（一般模式外觀不變）：Dropdown / Context Menu / Menubar 的 hover 與鍵盤高亮項目、Menubar 展開的 trigger、Combobox / Multi Select / Command Palette 的高亮項目、Tabs（含 pills / underline）、Segmented Control、Toggle Group、Toolbar 按下的按鈕、Calendar 選取日、Pagination 目前頁、Nav / Sidebar / Tree View 目前項目與 Steps 完成步驟改以系統選取色（`Highlight` + `HighlightText`）填滿；Combobox / Multi Select 已選取項目加內框、Calendar 今天加外框、非本月日期為 `GrayText`、Steps 目前步驟加外圈、未到的步驟為 `GrayText`；Toggle 的 thumb 原本完全消失，改以文字色顯示並在開啟時填滿軌道；Progress（線性與環形）與 Range 原本軌道 / 進度條消失，改用系統色；Card selectable 選取、Carousel / Tour 圓點、Dropzone 拖曳中與 Radio 選取也各有區分；Rating 的 radio 模式（`cu-rating-input` + `cu-rating-label`）原本選取的星星只以琥珀色區分，改為與 JS 模式相同的實心 / 空心；underline Tabs 不再每個 tab 都顯示底線；沒有邊框的 Button 變體（default / secondary / ghost / destructive 等）補上外框。另外 Toggle、Segmented Control（radio 模式）、Dropzone 與 Rating（radio 模式）的焦點環畫在 sr-only input 以外的元素上，forced colors 下原本看不到鍵盤焦點，現在改以 outline 顯示
