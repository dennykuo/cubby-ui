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
- **Code Block** 複製回饋：失敗狀態 `data-cu-copy-failed`、aria-live 播報（與 Copy Button 共用 `[data-cu-copy-live]`）、Clipboard API 不可用或被拒時退回 `execCommand("copy")`；根元素可用 `data-cu-code-block-success-text` / `data-cu-code-block-error-text` 自訂訊息，成功 / 失敗時觸發 `cu:code-block:copy` / `cu:code-block:error`
- `npm run test:blade` 新增回歸檢查：文字位置殘留的 JSX `||` / `??` 表達式，以及 `'$` 開頭的 PHP 字串（字串字面量被誤轉成變數）
- Multi Select：`data-cu-multi-select-remove-text`（預設 `Remove {label}`），自訂標籤移除按鈕的無障礙名稱
- Calendar / Date Picker：`data-cu-calendar-locale` 指定日期按鈕完整日期名稱的語系（預設取最近祖先的 `lang`）；新增 JS 產生的週列 class `cu-calendar-week`
- **無障礙**：Combobox / Multi Select 的搜尋框依 WAI-ARIA APG combobox 加上 `role` / `aria-controls` / `aria-autocomplete` / `aria-expanded`，並以 `aria-activedescendant` 指向鍵盤高亮項目；Multi Select 標籤移除按鈕有可讀名稱（例如 "Remove React"）；Date Picker trigger 加上 `aria-haspopup="dialog"` / `aria-expanded` / `aria-controls`，面板為以月份命名的非模態 dialog；Calendar 改為 grid / row / gridcell 結構，日期按鈕帶完整日期名稱、`aria-selected` 與 `aria-current="date"`；Command Palette 輸入框為 combobox，清單為 listbox / group / option，`aria-activedescendant` 與 `aria-selected` 跟隨選中項目
- `cu-dropzone-input`：視覺隱藏但可聚焦的 file input（取代範例中不存在於 dist CSS 的 `sr-only`），Dropzone 可用鍵盤選檔
- 範例標記自動檢查（`tests/e2e/examples.spec.ts`）：把 `components.json` 的 `example`、`llms.txt` 的 HTML 範例與文檔頁 Code 範例放進只載入 `dist/` 產物的頁面，靜態檢查必要的 `data-cu-*` 屬性與結構、觸發器可鍵盤操作、巢狀互動元素、表單類按鈕的 `type="button"`、label 關聯，並實際操作元件確認照抄即可運作
- `llms.txt` 新增 Input Clearable、Alert Expandable、Data Table 展開列範例與 15 列互動屬性對照；`components.json` 新增 Combobox、Multi Select、Transfer List 範例
- Header：`cu-header-mobile-toggle-{sm|md|lg|xl}`，漢堡觸發按鈕在該斷點以上隱藏，與 `cu-header-nav-{bp}`、`cu-header-mobile-{nav|backdrop}-{bp}` 搭配
