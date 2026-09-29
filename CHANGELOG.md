# Changelog

本檔記錄 Cubby UI 的重要變更。格式參考 [Keep a Changelog](https://keepachangelog.com/zh-TW/1.1.0/)，版本遵循 [語意化版本](https://semver.org/lang/zh-TW/)。

## [Unreleased]

### Added
- **文檔站部署到 GitHub Pages**（`https://dennykuo.github.io/cubby-ui/`）：新增 `.github/workflows/deploy-docs.yml`，於 `main` 的 CI 成功後（`workflow_run`）或手動觸發時，以 `actions/configure-pages` 取得網址與子路徑建置 `docs/`、跑連結檢查，再以 `deploy-pages` 發布
- `astro.config.mjs` 由 `SITE_URL` / `BASE_PATH` 環境變數設定 `site` / `base`（未設定時維持根目錄）；新增 `src/utils/paths.ts`（`withBase()` / `stripBase()`），`localizePath()`、`getAlternatePath()`、`getLocaleFromUrl()` 改為處理 base，文檔站與所有範例頁的站內連結、表單 `action`、favicon 改經 base 轉換
- `npm run check:links`（`scripts/check-links.mjs`）：掃描建置後所有頁面，站內根路徑連結缺 base 或目標不存在即失敗
- 文檔站 smoke test 支援 `BASE_PATH`（只在子路徑下伺服 `docs/`），並新增同源資源 4xx / 5xx 檢查；CI 改以 `BASE_PATH=/cubby-ui` 建置文檔站，驗證的即是部署設定
- `public/favicon.svg`（原本各頁引用的 `/favicon.svg` 並不存在）
- `check:sync` 新增 README 元件分類表檢查：每個分類的元件須與 `component-nav.ts` 的 `componentGroups` 完全一致，分類標籤取自 `src/i18n/ui.ts` 的 sidebar 英文標籤

### Changed
- **README 元件分類表**依 `component-nav.ts` 重建：由 8 類補齊為 10 類（新增 Content、AI），元件由 59 個補到 95 個，Avatar、Badge 由 Data Display 改回 Basic，分類順序與文檔站側邊欄一致
- **TODO.md** 勾選 12 個已完成元件項目，並新增「工程與品質」段落，移入已歸檔計畫中尚未完成的 6 項待辦（含已實測重現的 Dialog 點擊內部 padding 誤關閉問題）
- 已完成或過時的計畫文件移至 `references/archive/`，各檔開頭加註歸檔狀態與未完成項目去向：`PLAN-3.md`、`UI-UX-REVIEW.md`、`agent-guide/implementation_plan.md`

### Fixed
- Header 的 GitHub 連結原本指向 `https://github.com`，改為本專案 repo
- Dashboard V2 / V3 範例的導航 active 狀態在建置輸出中永遠不亮（`Astro.url.pathname` 帶尾端斜線，導航資料不帶），比對前改為去掉尾端斜線
- Dashboard V2 範例側邊欄的 4 個項目（數據分析、文件中心、訊息通知、API 金鑰）指向從未建立的頁面，改為 `#` 佔位連結
- **Dialog** 點擊對話框內部 padding 區或子元素間的空白會誤關閉：`cu-dialog` 的 `p-6` 設在 `<dialog>` 本體上，這些點擊的 `e.target` 也是 dialog。`src/scripts/core/overlay.js` 的 backdrop 判斷改以 `getBoundingClientRect()` 比對點擊座標，只有落在 dialog 邊界框外才關閉；`detail === 0` 的非指標 click（鍵盤、程式化 `click()`，座標為 0,0）不視為 backdrop 點擊。`tests/e2e/dialog.spec.ts` 新增 padding 區與 `detail === 0` 兩個案例

## [0.2.0] - 2026-09-28

### Changed
- **互動 JS 模組化**：`src/scripts/cubby-ui.js`（單一 3,500 行 UMD 檔）拆為 ESM 模組 — 入口 `src/scripts/index.js`、`core/`（`registry.js` 共享追蹤狀態、`utils.js`、`document-listeners.js`、`overlay.js`）與 `components/*.js`（每元件一個模組）。新增 `scripts/build-js.mjs` 以 esbuild 打包回 `dist/core/cubby-ui.js`，UMD wrapper、公開 API（`init` / `destroy` / `refresh` / `toast`）、自動初始化與所有 `data-cu-*` 行為不變；文檔站改由 `astro.config.mjs` 的 `cubbyUiJsBundle` Vite plugin 於 dev / build 前打包並監看重建。新增 `build:js` npm script
- `package.json` `exports` 的 `style` condition 移到 `default` 之前（condition 依序匹配，`default` 需為最後一項）

### Added
- 文檔站 smoke test（`tests/e2e/docs-smoke.spec.ts`）：逐頁載入 `docs/` 產出的 95 個元件頁與範例頁，驗證無未捕捉例外、無 console error、重複 `init()` / `refresh()` 安全；CI 先 `build:docs` 再執行
- Playwright E2E 測試（`tests/e2e/`）：針對出貨產物 `dist/core/cubby-ui.{css,js}` 的互動元件 smoke test，涵蓋 Dialog / Drawer / Alert Dialog 的開關、焦點移入與返回、backdrop 行為；Dropdown 鍵盤導航與 Enter / Escape / 外部點擊；Tabs ARIA 連結、切換與 closable；Toast 觸發、堆疊上限、自動消失、XSS 防護與 promise API；`init()` / `destroy()` / `refresh()` 生命週期與 document 級 listener 淨零檢查。新增 `test:e2e` 與 `test` npm script，CI 於 Blade 回歸後執行
- `check:sync` 新增 `data-cu-*` 對照：雙向比對 `src/scripts/` 各模組實際使用的屬性與 `cubby-ui.d.ts` 的 `DATA_ATTRS`
- `DATA_ATTRS` 補齊 63 個缺漏屬性（Calendar、Carousel、Checkbox Group、Code Block、Color Picker、Command Palette、Context Menu、Date Picker、Password Input、Pin Input、Resizable、Segmented Control 等，以及 `data-cu-open` / `data-cu-expanded` / `data-cu-visible` / `data-cu-copied` / `data-cu-resizing` / `data-cu-command-active` 狀態屬性）
- CI workflow（`.github/workflows/ci.yml`）：push / PR 時執行建置、型別檢查、清單同步與 Blade 回歸測試

### Removed
- 移除誤入版控的 AI 工具目錄（`.agent/`、`.claude/`、`.codex/`、`.gemini/`、`.shared/`、`.idea/`、`.intent/`，皆已在 `.gitignore`）與所有 `__pycache__` / `*.pyc`；`.gitignore` 補上 `__pycache__/`、`*.pyc` 與 `.intent/`
- `type-check`（`astro check`）與 `check:sync` npm script
- `scripts/check-component-sync.cjs`：防止元件清單在 `component-nav.ts` / 頁面 / i18n / CSS / `components.json` / `llms.txt` 之間漂移
- 治理文件：`DESIGN.md`、`CONTRIBUTING.md`、`CHANGELOG.md`
- 補回缺漏的 **Text** 元件至 `components.json` 與 `llms.txt`

### Changed
- **Alert** `cu-alert-accent` 與 **Notification** 未讀狀態：移除左側色條反模式，改為全框 + 背景 tint（Alert）與背景 tint + 標題前圓點（Notification）
- **色彩 token**：中性表面與前景的純白 `#fff` 改為極淡品牌色調（`hsl(210 40% 99.5%)`），消除死白
- **CodeBlock**：`variant`（dark/light）prop 更名為 `theme`；**ChatBubble**：`variant`（user/assistant）更名為 `role`。兩者皆保留舊 `variant` prop 作為向後相容 fallback，CSS class 名不變

### Fixed
- **Checkbox 文檔頁** indeterminate 示範腳本原本在主頁面執行，但預覽內容渲染於 iframe 內，導致 `Cannot read properties of null` 例外且示範無效；改為 `<script is:inline>` 隨 slot 進入 iframe（由文檔站 smoke test 抓出）
- `CubbyUI.destroy()` 現在完整移除所有 document 級事件監聽器（含 Command Palette 全域快捷鍵），不再殘留
- **Context Menu** 與 **Date Picker** 改用 delegated 事件模式，消除每個實例累積 document listener 的潛在記憶體洩漏
- `theme.css` 移除 `--color-border` / `--color-input` 的雙分號筆誤
- 重新生成 `package-lock.json`，修復 sharp 罕見平台套件缺 `version` 導致 npm ≥ 10.9 無法 `npm ci` 的問題

### Accessibility
- **Toast** 作者自行提供的 `[data-cu-toast-container]` 也會補上 `role="region"` 與 `aria-label`（不覆寫既有值），與自動建立的容器一致
- **Dialog / Drawer / Alert Dialog** 開啟時聚焦首個可互動元素（尊重 `[autofocus]`），符合 WCAG 2.4.3
- **Command Palette** 新增 Tab / Shift+Tab 鍵盤導航（循環結果）

## [0.1.0]

- 初始開發版本：95 個元件（純 HTML + Tailwind CSS）、完整英文 / 繁體中文 i18n 文檔站、Laravel Blade 元件轉換器、UMD 互動 JS、Playground 互動式探索頁與多套 Dashboard 範例
