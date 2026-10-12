---
"cubby-ui": minor
---

新增

- **Chart** 圖表容器（Data Display）：卡片式包裝（標頭、主數值、操作區、繪圖區、頁尾）、圖例（含可切換項目）、tooltip、SVG 格線與軸標籤、空狀態與載入狀態；搭配 Chart.js 等外部圖表庫使用，不內建繪圖 JS
- 圖表色盤 token `--color-chart-1` ~ `--color-chart-5`（含暗色模式），`cu-chart-color-1` ~ `5` 以 `currentColor` 供圖例與 SVG 共用
- **Copy Button** 一鍵複製（Basic）：`data-cu-copy` / `data-cu-copy-target`、`data-cu-copied` / `data-cu-copy-failed` 狀態、aria-live 播報、Clipboard API 失敗時退回 `execCommand`、`cu:copy-button:copy` / `cu:copy-button:error` 事件；另含 Copy Field
- Combobox / Multi Select 可選的搜尋 debounce：`data-cu-combobox-debounce` / `data-cu-multi-select-debounce`（毫秒），未設定時維持即時過濾；實際套用的查詢改變時觸發 `cu:combobox:search` / `cu:multiselect:search`（`{ query }`），可串接遠端搜尋
- Calendar 支援 Home / End 跳至月首 / 月末，方向鍵可跨月移動；Date Picker 選取日期時對 hidden input 觸發 `change`
- **文檔站 SEO**：每頁專屬 meta description（元件頁取翻譯檔副標題並轉純文字）、Open Graph 與 `twitter:card`、設定 `SITE_URL` 時輸出含 base 的 canonical / `og:url` 與絕對網址 hreflang（含 `x-default`）、sitemap（`@astrojs/sitemap`，排除範例 404 頁）與 `robots.txt`；CI 建置文檔站時帶入 `SITE_URL`
- **互動 JS 型別檢查**：`tsconfig.scripts.json`（`allowJs` + `checkJs`）檢查 `src/scripts/` 元件庫 JS，`npm run type-check` 於 `astro check` 後執行 `type-check:scripts`；元素 expando 屬性宣告於 `src/scripts/globals.d.ts`（不影響對外的 `cubby-ui.d.ts`）
- **ESLint**（`npm run lint`，flat config）：範圍 `src/scripts/`，只啟用 `@eslint/js` recommended 與少數正確性規則，不含排版 / 風格規則、不導入 Prettier；CI 於型別檢查後執行
- E2E 測試：Combobox、Multi Select、Date Picker（含 Calendar）、Combobox / Multi Select debounce、Copy Button，以及文檔站 SEO 測試組
- **文檔站搜尋**：Header 的搜尋框原本沒有任何功能，改以元件庫自身的 Command Palette 實作（`src/components/DocsSearch.astro`）。項目取自 `component-nav.ts`（入門指南、10 個元件分類、範例頁，與側邊欄同步），可用名稱、路徑代稱或中英文分類名搜尋，Enter 直接導航；支援 ⌘K / Ctrl+K，非 Apple 平台的快捷鍵提示顯示 `Ctrl K`；手機寬度新增圖示按鈕
- Command Palette 互動測試（`tests/e2e/command-palette.spec.ts`，對出貨產物執行）與文檔站搜尋測試（`docs-smoke.spec.ts`）
- **文檔站部署到 GitHub Pages**（`https://dennykuo.github.io/cubby-ui/`）：新增 `.github/workflows/deploy-docs.yml`，於 `main` 的 CI 成功後（`workflow_run`）或手動觸發時，以 `actions/configure-pages` 取得網址與子路徑建置 `docs/`、跑連結檢查，再以 `deploy-pages` 發布
- `astro.config.mjs` 由 `SITE_URL` / `BASE_PATH` 環境變數設定 `site` / `base`（未設定時維持根目錄）；新增 `src/utils/paths.ts`（`withBase()` / `stripBase()`），`localizePath()`、`getAlternatePath()`、`getLocaleFromUrl()` 改為處理 base，文檔站與所有範例頁的站內連結、表單 `action`、favicon 改經 base 轉換
- `npm run check:links`（`scripts/check-links.mjs`）：掃描建置後所有頁面，站內根路徑連結缺 base 或目標不存在即失敗
- 文檔站 smoke test 支援 `BASE_PATH`（只在子路徑下伺服 `docs/`），並新增同源資源 4xx / 5xx 檢查；CI 改以 `BASE_PATH=/cubby-ui` 建置文檔站，驗證的即是部署設定
- `public/favicon.svg`（原本各頁引用的 `/favicon.svg` 並不存在）
- `check:sync` 新增 README 元件分類表檢查：每個分類的元件須與 `component-nav.ts` 的 `componentGroups` 完全一致，分類標籤取自 `src/i18n/ui.ts` 的 sidebar 英文標籤
