# 貢獻指南

感謝你考慮為 Cubby UI 貢獻。本文件說明開發流程、元件新增規範與品質要求。

## 專案性質

Cubby UI 是框架無關的 UI 元件庫，風格類似 shadcn/ui，使用純 HTML + Tailwind CSS。元件設計為可直接複製貼上使用，不依賴 React、Vue 或任何前端框架。示範文檔站使用 Astro 構建。

> **核心原則：每個 `cu-` CSS class 自包含、可單獨複製貼上。** 這是專案最大賣點，任何重構都不得犧牲它（例如不要把元件的 focus ring、disabled 樣式抽成必須額外引入的 utility class）。

設計細節見 [DESIGN.md](./DESIGN.md)；給 AI 代理的完整指南見 [CLAUDE.md](./CLAUDE.md)。

## 開發環境

Node.js 版本以根目錄 `.nvmrc` 為準（目前為 24，CI 與部署 workflow 也由此讀取），可用 `nvm use` 切換。

> Node 24 隨附 npm 11，預設不執行相依套件的 install script，`npm install` 結尾會列出被略過的套件（`esbuild`、`sharp`、`@parcel/watcher`）。它們都有平台預編譯檔可用，略過不影響建置與測試，可忽略該警告。

```bash
npm install          # 安裝依賴
npm run dev          # 啟動 Astro 開發伺服器（自動同步 i18n 路由）
npm run build        # 建置 NPM 套件至 dist/（CSS + JS）
npm run build:blade  # 轉換為 Laravel Blade 匿名元件
npm run build:docs   # 建置文檔站
npm run type-check   # astro check 型別檢查
npm run check:sync   # 元件清單跨來源同步檢查 + data-cu-* 與 DATA_ATTRS 對照
npm run check:links  # 文檔站站內連結檢查（需先 build:docs；BASE_PATH 與建置時相同）
npm run test:blade   # Blade 語法回歸測試
npm run test:e2e     # Playwright 互動元件測試（需先 npm run build）
npm run test         # check:sync → test:blade → test:e2e
```

> macOS 若使用 npm ≥ 10.9 遇到 `npm ci` 的 `Invalid Version` 錯誤，請先 `npm install` 重新生成 lock。

## 提交前檢查（CI 會驗證）

PR 推送後 `.github/workflows/ci.yml` 會執行以下檢查，請先在本機確認通過：

- `npm run check:sync` — 元件清單在各來源（`component-nav.ts` / 頁面 / i18n / CSS / `components.json` / `llms.txt` / README 元件分類表）一致；`src/scripts/` 各模組使用的 `data-cu-*` 與 `cubby-ui.d.ts` 的 `DATA_ATTRS` 雙向一致
- `npm run type-check` — 0 errors
- `npm run build` 與 `npm run build:blade` — 建置通過
- `npm run test:blade` — Blade 回歸通過
- `npm run check:links` — 文檔站所有站內連結帶 base 且目標存在（CI 以 `SITE_URL=https://dennykuo.github.io` + `BASE_PATH=/cubby-ui` 建置文檔站，與 GitHub Pages 部署設定相同；有 `SITE_URL` 才會產生 sitemap 與 canonical）
- `npm run test:e2e` — Playwright 互動元件測試通過（CI 會先 `npx playwright install --with-deps chromium` 與 `npm run build:docs`，讓 `docs-smoke.spec.ts` 逐頁驗證文檔站；設 `BASE_PATH` 時在子路徑下伺服，同源資源 404 即失敗）

本機重現 CI 的文檔站檢查：

```bash
SITE_URL=https://dennykuo.github.io BASE_PATH=/cubby-ui npm run build:docs
BASE_PATH=/cubby-ui npm run check:links
BASE_PATH=/cubby-ui npm run test:e2e
```

### E2E 測試

- 測試對象是 `dist/core/cubby-ui.{css,js}` 出貨產物，不是 Astro 文檔站；先 `npm run build` 再跑
- fixture 放在 `tests/e2e/fixtures/*.html`，spec 放在 `tests/e2e/*.spec.ts`，透過 `openFixture(page, "name")` 載入
- 新增互動元件時，至少補一個 fixture 與涵蓋「開啟 / 關閉 / 鍵盤 / ARIA」的 smoke test
- 無法下載 Playwright 瀏覽器的環境（離線、受限網路）可用既有 Chromium：
  `PLAYWRIGHT_CHROMIUM_EXECUTABLE=/path/to/chrome npm run test:e2e`

## 新增元件 Checklist

1. **CSS** — 在 `src/styles/components/` 建立 `.css` 檔（`cu-` 前綴），在 `src/styles/components.css` 對應區塊加 `@import`
2. **Astro 元件** — 在 `src/components/ui/` 建立 `.astro`（含 `interface Props`，用 `class:list` 組合）
3. **i18n** — 在 `src/i18n/pages/components/` 建立翻譯檔（en + zh-tw）
4. **文檔頁面** — 在 `src/pages/components/` 建立（用 `ComponentPreview` 展示，範例使用 `cu-` class 系統）；`<Layout>` 必須傳入 `description={t.description}`，翻譯檔頂層 `description`（en / zh-tw）寫成該頁專屬的一句描述（作為 meta description 與 `og:description`，可含 `<code>`，輸出時自動轉純文字）。漏傳會退回站台預設描述，`docs-smoke.spec.ts` 的 SEO 測試會失敗
5. **導航** — 在 `src/data/component-nav.ts` 對應分組加一筆，並把元件名加進 `README.md` 元件分類表的同一分類列
6. **manifest** — 更新 `components.json` 與 `llms.txt`
7. **互動 JS**（如需）— 在 `src/scripts/components/` 新增模組並匯出 `setupXxx()`；需要 tracking array 時在 `src/scripts/core/registry.js` 加欄位並於 `src/scripts/index.js` 的 `init()` / `destroy()` / `refresh()` 登記；更新 `cubby-ui.d.ts`
8. **驗證** — `npm run check:sync` 應全綠（含 `DATA_ATTRS` 對照）；有 JS 互動則補 `tests/e2e/` 測試；確認 dark / light 兩模式

## 修改既有元件

- 改 class 名 → 同步 `components.json`、`llms.txt`、docs 範例
- 改 `data-*` → 同步 `components.json`、`llms.txt`、`cubby-ui.d.ts` 的 `DATA_ATTRS`
- 改視覺設計 → 確認 dark / light 兩模式皆正確

## 程式碼規範

- **CSS class** 一律 `cu-` 前綴；變體 `cu-{component}-{variant}`、尺寸 `cu-{component}-{size}`
- **互動 JS** 為 ESM 模組（`src/scripts/`），由 `scripts/build-js.mjs` 以 esbuild 打包成 UMD；使用 delegated document-level events + `core/registry.js` 的 tracking array（供 `destroy()` / `refresh()` 清理；勿在每個元件實例各自註冊 document listener）；原始碼維持 ES5 風格（`var` / `function`），打包目標 `es2015`
- **站內連結** 文檔站部署在 GitHub Pages 子路徑（`/cubby-ui/`），`.astro` 內不可寫死 `href="/..."`：文檔頁用 `localizePath(path, locale)`，範例頁、favicon、表單 `action` 等其他根路徑用 `src/utils/paths.ts` 的 `withBase()`；與導航資料比對目前頁面前先 `stripBase(Astro.url.pathname)`。靜態資源放 `public/`
- **動畫** transition 用具體屬性（`transition-colors` 等）+ 明確 `duration-*`，禁止 `transition-all`
- **色彩** 避免硬編碼 HSL，半透明用 `color-mix`；中性色 tint 向品牌 hue，不用純 `#fff` / `#000`
- **焦點環** 導航/觸發器用 `focus-visible:ring-1 ring-ring/30`，控制元件用 `ring-2 ring-ring/40 ring-offset-2`，close 按鈕用 `ring-1 ring-ring/40`

## Commit 規範

- 訊息使用繁體中文，格式 `type: 描述`（type 用 `feat` / `fix` / `improve` / `chore` / `refactor`）
- 中文與英文／數字之間加一個半形空白
- 不要加 `Co-Authored-By` 標記

## 授權

貢獻即表示你同意以專案的 MIT 授權釋出你的程式碼。
