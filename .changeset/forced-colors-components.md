---
"cubby-ui": patch
---

**Forced colors（Windows 高對比）** 修正只靠底色、陰影或框線色表達的狀態與元素在高對比模式下看不出來或消失的問題：Tabs、Segmented Control、Toggle Group、Toolbar、Pagination、Nav、Sidebar、Tree View、Calendar 選取日、Steps 已完成的步驟，以及 Dropdown / Menubar / Context Menu / Combobox / Multi Select / Command Palette 的高亮項目改以系統選取色（`Highlight` / `HighlightText`）填滿；Calendar 今天、實心 Button、Badge、標籤、Chat 氣泡、Tooltip、Progress / Range 軌道等補上外框；Toggle 圓鈕、進度條、Skeleton、分隔線、Timeline 軸線、Carousel / Tour 圓點、Spinner 缺口改用系統色；Chart 色塊、Color Picker、Image Compare、Avatar 狀態點保留原本的色彩；Toggle、Segmented Control、Dropzone 的鍵盤焦點改在可見元素上顯示外框
