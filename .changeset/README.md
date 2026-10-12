# Changesets

這個資料夾放待發布的變更說明，`npm run version-packages`（`changeset version`）會依這些檔案決定版本號遞增幅度、寫入 `CHANGELOG.md`，並刪除已消耗的檔案。

每個使用者可感知的變更（新元件、新屬性 / 事件、行為改變、bug 修正）都附一個 changeset，與程式碼放在同一個 commit / PR。文件、測試、CI 等不影響套件使用者的變更不需要。

新增方式：在終端機執行 `npm run changeset` 依提示選擇遞增類型並輸入說明；或直接新增 `.changeset/<任意名稱>.md`：

```md
---
"cubby-ui": patch
---

**Dropdown** 修正某某情況下無法關閉的問題
```

遞增類型（1.0 之前）：新功能與行為改變用 `minor`，bug 修正用 `patch`；破壞性變更用 `minor` 並在說明開頭標註 **破壞性變更**。說明使用繁體中文，第一行即 CHANGELOG 中的條目。

`v030-*.md` 是導入 Changesets 前累積的 0.3.0 變更（由原 `CHANGELOG.md` 的 `[Unreleased]` 段落依分類轉入），發布 0.3.0 時會一併消耗。
