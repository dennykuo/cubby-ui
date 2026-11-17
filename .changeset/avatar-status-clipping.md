---
"cubby-ui": patch
---

**Avatar** 狀態點（`cu-avatar-status`）放在頭像內時原本會被頭像的圓形裁成一小角（square 變體刻意伸出邊框外的部分也被裁掉），現在完整顯示：含狀態點的頭像不再裁切內容，圖片改以 `border-radius: inherit` 自行裁成頭像形狀，有圖片時 fallback 明確隱藏（外觀與原本相同）
