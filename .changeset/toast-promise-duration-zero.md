---
"cubby-ui": patch
---

**Toast** 修正 `CubbyUI.toast.promise()` 的 `success` / `error` 傳入 `duration: 0` 時仍在 5000ms 後消失的問題，現在 `0` 會讓結果通知保持顯示直到手動關閉
