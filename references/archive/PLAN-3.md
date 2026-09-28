# Cubby UI 專案優化建議 (Project Optimization Suggestions)

> **已歸檔（2026-09-28，v0.2.0）**：本文件為歷史紀錄，不再維護。未完成項目已移至根目錄 `TODO.md`。
>
> | # | 項目 | 狀態 |
> |---|------|------|
> | 1 | TypeScript 型別系統 | 部分完成：已有 `tsconfig.json`（Astro strict），未啟用 `allowJs` / `checkJs` → 移至 TODO |
> | 2 | Prettier / ESLint | 未做 → 移至 TODO |
> | 3 | Playwright 測試 | 完成（v0.2.0，`tests/e2e/`） |
> | 4 | Dialog backdrop 判斷 | 未做，已實測確認為實際 bug → 移至 TODO |
> | 5 | Changesets 發布流程 | 未做 → 移至 TODO |
> | 6 | 互動式 Playground | 完成（`/playground`） |

基於程式碼分析 (`cubby-ui.js`, `package.json`) 與現有計畫 (`PLAN-2.md`)，為了提升開發體驗 (DX)、程式碼品質與專案維護性，制定以下優化建議。

## 1. 引入 TypeScript 與型別系統 (Type Safety)
目前專案無 `tsconfig.json`，JS 檔案缺乏型別檢查。
- **行動**：
    - 在根目錄新增 `tsconfig.json`。
    - 啟用 `allowJs: true` 與 `checkJs: true`。
- **效益**：
    - 透過 JSDoc (`/** @type {import(...)} */`) 為 Vanilla JS 提供型別檢查與 IntelliSense，無需重寫程式碼。
    - 讓 `.d.ts` 或 `.ts` 定義檔能被 JS 與 Astro 檔案共用。

## 2. 程式碼規範與格式化 (Linting & Formatting)
`src/scripts/cubby-ui.js` 檔案龐大且無自動格式化，維護困難。
- **行動**：
    - 安裝 **Prettier**。
    - 安裝並配置 **`prettier-plugin-tailwindcss`**。
    - 配置 **ESLint** 檢查基本錯誤。
- **效益**：
    - 自動排序 Tailwind Class (如 `flex items-center justify-between`)，保持一致性。
    - 減少 Git diff 雜訊，提升程式碼可讀性。

## 3. 測試策略 (Testing Strategy)
專案高度依賴 DOM 操作與樣式，缺乏自動化測試。
- **行動**：
    - 引入 **Playwright**。
    - 建立針對 Astro Preview 頁面的 **視覺回歸測試 (Visual Regression Testing)**。
    - 建立 **互動測試** (e.g., Dialog 開關、鍵盤導航、Focus trap)。
- **效益**：
    - 確保 UI 元件在重構或升級時不會壞掉 (Regression Testing)。
    - 比單元測試更能反映使用者真實操作情境。

## 4. 完善原生 Dialog 互動 (UX Improvement)
目前的 Dialog 點擊背景關閉邏輯 (`e.target === dialog`) 在某些邊緣情況下不可靠。
- **行動**：
    - 改用標準的 `dialog.getBoundingClientRect()` 方法。
    - 偵測點擊座標是否位於 Dialog 尺寸範圍之外。
- **效益**：
    - 符合 `<dialog>` 最佳實踐，提供更穩健的使用者體驗。

## 5. 自動化版本發布 (Release Workflow)
目前的建置與發布流程為手動，容易出錯。
- **行動**：
    - 引入 **Changesets** (`@changesets/cli`)。
- **效益**：
    - 開發者可透過 `npx changeset` 輕鬆記錄變更。
    - 自動生成 `CHANGELOG.md` 並更新 `package.json` 版本號（遵循 SemVer）。
    - 簡化 Monorepo 或 Library 的發布管理。

## 6. 文檔體驗升級 (Documentation Experience)
- **行動**：
    - 在 Astro 文件中加入 **互動式 Playground**。
- **效益**：
    - 讓使用者能動態調整 Props (如 Size, Variant) 並即時預覽，提供類似 Storybook 的專業文檔體驗。
