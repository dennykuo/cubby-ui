---
"cubby-ui": minor
---

**Toast** `CubbyUI.toast.show()` 新增 `action: { label, onClick? }` 參數，於通知內渲染 `cu-toast-action-btn`（`label` 以純文字呈現）；點擊後呼叫 `onClick(event, toast)` 並關閉通知，`onClick` 內呼叫 `event.preventDefault()` 可保留通知。`cubby-ui.d.ts` 新增 `ToastAction` 型別
