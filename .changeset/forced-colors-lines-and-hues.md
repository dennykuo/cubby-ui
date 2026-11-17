---
"cubby-ui": patch
---

**Forced colors（Windows 高對比）** 補齊以背景色繪製與只靠色相表達的元素（一般模式外觀不變）：Separator、HR、Dropdown / Context Menu / Menubar / Command Palette / Sidebar / Toolbar 的分隔線、Timeline 連接線與 Resizable 的拖曳握把原本會消失，改以文字色顯示（握把 hover / 拖曳中為系統選取色）；Data Table 選取列與 Transfer List 勾選項目以系統選取色填滿，列內核取方塊與徽章一併改色；Avatar 狀態點原本消失，改以形狀區分（online 實心、offline 空心、busy 實心加橫槓、away 半實心）；Badge 補上外框、實心變體反白，dot 不再消失；Alert / Toast / Notification 以 `text-*` 上色的圖示原本保留作者色相（黃色圖示在淺色高對比主題下幾乎看不見），改跟隨文字色，Alert accent 改以較粗外框強調，Notification 未讀圓點不再消失。各語意色相（成功、警告、錯誤）無法在高對比下保留，請以文字或圖示表達（`llms.txt` / `components.json` 已註明）
