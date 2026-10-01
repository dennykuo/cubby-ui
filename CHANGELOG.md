# Changelog

本檔記錄 Cubby UI 的重要變更。格式參考 [Keep a Changelog](https://keepachangelog.com/zh-TW/1.1.0/)，版本遵循 [語意化版本](https://semver.org/lang/zh-TW/)。

## [Unreleased]

### Added
- **Chart** 圖表容器（Data Display）：卡片式包裝（標頭、主數值、操作區、繪圖區、頁尾）、圖例（含可切換項目）、tooltip、SVG 格線與軸標籤、空狀態與載入狀態；搭配 Chart.js 等外部圖表庫使用，不內建繪圖 JS
- 圖表色盤 token `--color-chart-1` ~ `--color-chart-5`（含暗色模式），`cu-chart-color-1` ~ `5` 以 `currentColor` 供圖例與 SVG 共用
- **Copy Button** 一鍵複製（Basic）：`data-cu-copy` / `data-cu-copy-target`、`data-cu-copied` / `data-cu-copy-failed` 狀態、aria-live 播報、Clipboard API 失敗時退回 `execCommand`、`cu:copy-button:copy` / `cu:copy-button:error` 事件；另含 Copy Field
- Combobox / Multi Select 可選的搜尋 debounce：`data-cu-combobox-debounce` / `data-cu-multi-select-debounce`（毫秒），未設定時維持即時過濾；實際套用的查詢改變時觸發 `cu:combobox:search` / `cu:multiselect:search`（`{ query }`），可串接遠端搜尋
- Calendar 支援 Home / End 跳至月首 / 月末，方向鍵可跨月移動；Date Picker 選取日期時對 hidden input 觸發 `change`
- **文檔站 SEO**：每頁專屬 meta description（元件頁取翻譯檔副標題並轉純文字）、Open Graph 與 `twitter:card`、設定 `SITE_URL` 時輸出含 base 的 canonical / `og:url` 與絕對網址 hreflang（含 `x-default`）、sitemap（`@astrojs/sitemap`，排除範例 404 頁）與 `robots.txt`；CI 建置文檔站時帶入 `SITE_URL`
- E2E 測試：Combobox、Multi Select、Date Picker（含 Calendar）、Combobox / Multi Select debounce、Copy Button，以及文檔站 SEO 測試組
- **文檔站搜尋**：Header 的搜尋框原本沒有任何功能，改以元件庫自身的 Command Palette 實作（`src/components/DocsSearch.astro`）。項目取自 `component-nav.ts`（入門指南、10 個元件分類、範例頁，與側邊欄同步），可用名稱、路徑代稱或中英文分類名搜尋，Enter 直接導航；支援 ⌘K / Ctrl+K，非 Apple 平台的快捷鍵提示顯示 `Ctrl K`；手機寬度新增圖示按鈕
- Command Palette 互動測試（`tests/e2e/command-palette.spec.ts`，對出貨產物執行）與文檔站搜尋測試（`docs-smoke.spec.ts`）
- **文檔站部署到 GitHub Pages**（`https://dennykuo.github.io/cubby-ui/`）：新增 `.github/workflows/deploy-docs.yml`，於 `main` 的 CI 成功後（`workflow_run`）或手動觸發時，以 `actions/configure-pages` 取得網址與子路徑建置 `docs/`、跑連結檢查，再以 `deploy-pages` 發布
- `astro.config.mjs` 由 `SITE_URL` / `BASE_PATH` 環境變數設定 `site` / `base`（未設定時維持根目錄）；新增 `src/utils/paths.ts`（`withBase()` / `stripBase()`），`localizePath()`、`getAlternatePath()`、`getLocaleFromUrl()` 改為處理 base，文檔站與所有範例頁的站內連結、表單 `action`、favicon 改經 base 轉換
- `npm run check:links`（`scripts/check-links.mjs`）：掃描建置後所有頁面，站內根路徑連結缺 base 或目標不存在即失敗
- 文檔站 smoke test 支援 `BASE_PATH`（只在子路徑下伺服 `docs/`），並新增同源資源 4xx / 5xx 檢查；CI 改以 `BASE_PATH=/cubby-ui` 建置文檔站，驗證的即是部署設定
- `public/favicon.svg`（原本各頁引用的 `/favicon.svg` 並不存在）
- `check:sync` 新增 README 元件分類表檢查：每個分類的元件須與 `component-nav.ts` 的 `componentGroups` 完全一致，分類標籤取自 `src/i18n/ui.ts` 的 sidebar 英文標籤

### Security
- **Deploy Docs** 只在本 repo 的 push 觸發的 CI 成功後部署：`workflow_run` 的 `branches: [main]` 比對的是來源分支名稱，fork 若以名為 `main` 的分支開 PR，其 CI 完成後同樣會觸發部署並 checkout fork 的 commit；`build` job 條件新增 `workflow_run.event == 'push'` 與 `head_repository.full_name == github.repository`

### Removed
- `src/pages/examples/dashboard-v5/feedback/`：誤提交進版控的 12 個舊建置快照（`.html`，引用已不存在的 `/_astro/*.css`，部署後會是無樣式頁面），連帶移除 `check:links` 與 docs smoke test 為它設的例外

### Changed
- Input / Textarea / Select / Checkbox / Radio 的 Astro Props 改為延伸 `HTMLAttributes`，`disabled` / `required` / `placeholder` 等原生屬性有型別提示與檢查，不再接受任意 prop（Blade 輸出不變）
- Blade 轉換器登記 Chart 複合元件；AI 文件範例支援巢狀子元件
- **Node.js 20 → 24**：新增 `.nvmrc`（`24`），CI 與 Deploy Docs 改以 `node-version-file: .nvmrc` 讀取；`@types/node` 升至 `^24`
- **GitHub Actions 升級為 Node 24 runtime 的版本**，消除 Node 20 deprecation 警告：`actions/checkout` v4 → v7、`actions/setup-node` v4 → v7、`actions/configure-pages` v5 → v6、`actions/upload-pages-artifact` v3 → v5（內部改用 `upload-artifact` v7）、`actions/deploy-pages` v4 → v5
- **README 元件分類表**依 `component-nav.ts` 重建：由 8 類補齊為 10 類（新增 Content、AI），元件由 59 個補到 95 個，Avatar、Badge 由 Data Display 改回 Basic，分類順序與文檔站側邊欄一致
- **TODO.md** 勾選 12 個已完成元件項目，並新增「工程與品質」段落，移入已歸檔計畫中尚未完成的 6 項待辦（含已實測重現的 Dialog 點擊內部 padding 誤關閉問題）
- 已完成或過時的計畫文件移至 `references/archive/`，各檔開頭加註歸檔狀態與未完成項目去向：`PLAN-3.md`、`UI-UX-REVIEW.md`、`agent-guide/implementation_plan.md`

### Fixed
- **Date Picker** 內的月曆被初始化兩次：方向鍵一次移動兩格，且重複呼叫 `init()` / `refresh()` 後選取的日期不再寫回 input；hidden input 的預設值不會讓月曆開在該月、也不會標記選取
- **Calendar** 跨月鍵盤導航聚焦到錯誤日期；以 Enter 選取後焦點遺失
- **Combobox / Multi Select** 篩選掉已高亮的項目後，按 Enter 會選到看不見的項目
- **Combobox / Multi Select / Date Picker** 選取或按 Escape 後焦點遺失（現回到 trigger）；開啟其中一個時不會關閉另一個已開啟的同類浮層；trigger 放在 `<form>` 內點擊會送出表單
- **Multi Select** 預選項目初始化時不會渲染成標籤；值含引號時渲染標籤會拋錯；以鍵盤移除標籤後焦點遺失；文檔「Preset Values」範例在 trigger `<button>` 內巢狀 `<button>`，HTML 解析後元件無法運作
- 文檔站所有頁面共用同一個 meta description
- Dashboard V2 範例頁誤用 React 寫法 `defaultValue` / `className`，欄位沒有預設值、padding 未套用
- **Command Palette** 關閉時仍顯示：`.cu-command` 的 `display: flex` 寫在基礎 class 上，作者樣式蓋過瀏覽器 `dialog:not([open]) { display: none }`，關閉中的 palette 以 `fixed` 置中疊在頁面上（文檔頁範例因此常駐顯示、Esc 關閉後畫面不變）。`display: flex` 改為只套用於 `.cu-command[open]`
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
