# Cubby UI 優化計畫

基於對專案的分析，為了增強本專案「與框架無關 (framework-agnostic)」的特性並提升開發者體驗 (DX)，制定了以下優化與重構任務。

## 1. 增強元件的多態性 (Component Polymorphism)
目前 `Button.astro` 被寫死渲染為 `<button>` 標籤。
- **行動**：修改 `Button.astro`，若有傳入 `href` 屬性則動態渲染為 `<a>`，否則渲染為 `<button>`。
- **效益**：無縫支援「按鈕外觀的連結」，無需手動複製 class，這對於排版靈活性至關重要。

## 2. 標準化互動邏輯 (Standardize Interaction Logic) ✅ 已完成
已建立 `src/scripts/cubby-ui.js`，包含 13 個互動元件：
- Tabs、Dropdown、Dialog、Drawer、Alert Dialog、Toast、Popover、Menubar
- Combobox、Multi Select、Number Input、Dropzone、Transfer List

使用 `data-cu-*` 屬性自動初始化，支援 NPM 發布和 CDN 引入。

## 3. CSS 變數與深色模式優化
- **行動**：
    - 在 `global.css` 的 `.dark` 類別中加入 `color-scheme: dark;`，確保瀏覽器原生 UI 元素（捲軸、日期選擇器等）符合主題。
    - 檢查 `Dialog::backdrop` 的顏色，確保 `color-mix` 在深色模式變數下能正確運作。

## 4. 共用型別定義 (Shared Type Definitions)
目前元件的 variants（如 'primary', 'secondary'）在各個元件檔案中重複定義。
- **行動**：建立 `src/types/ui.ts`。
- **內容**：匯出通用的型別，如 `ComponentSize`, `ComponentVariant`, `ComponentState`。
- **效益**：建立設計系統 Token 的單一真理來源 (Single Source of Truth)，讓未來的更新（例如新增 'warning' variant）更安全、更容易。

## 5. 原生 Dialog UX 改進
原生 `<dialog>` 雖然好用，但預設缺乏一些現代預期的行為。
- **行動**：實作「點擊背景關閉」功能。
    - 將邏輯整合進 `ui.js`，偵測點擊是否發生在 dialog `rect` 之外，若是則關閉它。
- **效益**：符合現代 Web 應用程式的使用者預期，同時保留原生 `<dialog>` 元素的語意優勢。
