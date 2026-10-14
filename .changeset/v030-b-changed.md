---
"cubby-ui": minor
---

變更

- `src/scripts/` 全部模組補上 JSDoc 型別轉型與註記，修正 lint 問題（打包後執行行為不變）
- Input / Textarea / Select / Checkbox / Radio 的 Astro Props 改為延伸 `HTMLAttributes`，`disabled` / `required` / `placeholder` 等原生屬性有型別提示與檢查，不再接受任意 prop（Blade 輸出不變）
- Blade 轉換器登記 Chart 複合元件；AI 文件範例支援巢狀子元件
- **Node.js 20 → 24**：新增 `.nvmrc`（`24`），CI 與 Deploy Docs 改以 `node-version-file: .nvmrc` 讀取；`@types/node` 升至 `^24`
- **GitHub Actions 升級為 Node 24 runtime 的版本**，消除 Node 20 deprecation 警告：`actions/checkout` v4 → v7、`actions/setup-node` v4 → v7、`actions/configure-pages` v5 → v6、`actions/upload-pages-artifact` v3 → v5（內部改用 `upload-artifact` v7）、`actions/deploy-pages` v4 → v5
- **README 元件分類表**依 `component-nav.ts` 重建：由 8 類補齊為 10 類（新增 Content、AI），元件由 59 個補到 95 個，Avatar、Badge 由 Data Display 改回 Basic，分類順序與文檔站側邊欄一致
- **TODO.md** 勾選 12 個已完成元件項目，並新增「工程與品質」段落，移入已歸檔計畫中尚未完成的 6 項待辦（含已實測重現的 Dialog 點擊內部 padding 誤關閉問題）
- 已完成或過時的計畫文件移至 `references/archive/`，各檔開頭加註歸檔狀態與未完成項目去向：`PLAN-3.md`、`UI-UX-REVIEW.md`、`agent-guide/implementation_plan.md`
- Dropdown trigger 的點擊事件改為正常冒泡（原本 `stopPropagation`）；若 Dropdown 放在本身有 click 監聽的元素內（例如可點擊的卡片或表格列），點擊 trigger 也會觸發外層監聽，需要時請在外層判斷 `e.target.closest("[data-cu-dropdown]")`
- Copy Button 的剪貼簿寫入、播報與狀態邏輯抽成 `src/scripts/core/clipboard.js`，與 Code Block 共用（Copy Button 行為不變）
- **Code Block** 複製後還原為按鈕原本的文字，不再固定還原成 "Copy"
