# Changelog

## 0.3.0

### Minor Changes

- 475ed06: **Checkbox** 勾勾改以 `::before` + `mask` 繪製、顏色取 `--color-primary-foreground`，不再固定為白色，淺色品牌主色搭配深色前景時勾勾仍清楚可見；新增 `:indeterminate` 的橫線樣式（原本半選狀態看不出來），並在 Windows 高對比模式下改用 `CanvasText`
- 17afcce: **Color Picker** 支援鍵盤並新增 `cu:color-picker:change` 事件：飽和度面板與色相條成為可聚焦的 `role="slider"`（預設名稱 "Saturation and brightness" / "Hue"，可用 `aria-label` 覆寫；面板以 `aria-valuetext` 同時描述飽和度與亮度）。面板 ← / → 調整飽和度、↑ / ↓ 調整亮度（Shift ×10）、Page Up / Page Down 亮度 ±10%、Home / End 飽和度 0 / 100%；色相條方向鍵 ±1°（Shift ×10）、Page Up / Page Down ±10°、Home / End。使用者拖曳（持續派發）、鍵盤、輸入有效 hex 或點色票改變顏色時，於根元素派發 `cu:color-picker:change`（`detail.value` 為 `#rrggbb`，冒泡；初始化與色碼未變時不派發）；拖曳開始時焦點移到面板 / 色相條，之後可直接用方向鍵微調，並顯示焦點環
- 1b1fabf: **Context Menu** 支援鍵盤：容器自動可聚焦（`tabindex="0"`，已有 `tabindex` 時保留），在容器或其內的聚焦元素按 Shift+F10 / ContextMenu 鍵會在聚焦元素上開啟選單並高亮第一個項目；選單為取得焦點的 `role="menu"`（`aria-activedescendant` 指向高亮項目，項目 `role="menuitem"`、分隔線 `role="separator"`），↑ / ↓ 循環並略過停用項目、Home / End、Enter / Space 執行、Esc / Tab 關閉，關閉後焦點回到開啟前的元素。滑鼠右鍵開啟時選單同樣取得焦點，可改用方向鍵操作；滑鼠移入項目時高亮跟隨
- f85975f: **Image Compare** 讀取文檔記載的 `data-cu-image-compare-position`（0–100，預設 50，超出範圍夾住；先前一律從 50 開始）；把手改為可聚焦的 `role="slider"`（`aria-valuenow` / `aria-valuetext` / `aria-orientation`，預設名稱 "Image comparison"，可用把手的 `aria-label` 覆寫），支援方向鍵 ±1、Page Up / Page Down ±10、Home / End，垂直模式 ↓ 為增加；鍵盤焦點時握把顯示焦點環
- 3a365fc: **Multi Select** 標籤移出 trigger，移除按鈕不再是巢狀互動元素：JS 產生的標籤移除 `<button>` 原本渲染在 trigger `<button>` 內（HTML 不允許的巢狀互動內容，且未指定 `type`，在 `<form>` 內預設為 submit）。新結構以 `cu-multi-select-control`（外框）包住 `data-cu-multi-select-tags` 與 trigger 兩個兄弟元素，placeholder 放在 trigger 內；移除按鈕為 `type="button"` 並保留 `data-cu-multi-select-remove-text` 的名稱，在 Tab 順序中位於 trigger 之前，以鍵盤移除後焦點移到下一個標籤的移除按鈕（最後一個之後為 trigger）；點擊外框空白處同樣開啟面板；標籤遮住 placeholder 時 trigger 以 `aria-labelledby` 保留其文字作為名稱（已有 `aria-label` / `aria-labelledby` / `<label for>` 時除外）；trigger 鍵盤焦點時外框顯示焦點環，移除按鈕也有焦點環。舊結構（標籤容器在 trigger 內）初始化時會自動轉換，外觀不變；`cu-multi-select-trigger` 的外框樣式移到新的 `cu-multi-select-control`，自訂了 trigger 外框樣式的專案請改套在 control 上
- 30e1096: **Rating** 互動式評分支援鍵盤與螢幕閱讀器，依 WAI-ARIA APG Rating Radio Group：根元素加上 `role="radiogroup"`（名稱取自 `aria-label` / `aria-labelledby`，預設 "Rating"），每顆星為 `role="radio"` + `aria-checked`，roving tabindex 只留一個 Tab 停駐點（選取的星，未選取時為第一顆）。方向鍵移動並選取（頭尾循環，由右至左排版時左右對調）、Home / End 選取第一顆 / 最後一顆、Space / Enter 選取目前的星；`<span>` 星星標記同樣適用。星星名稱預設 "1 star" / "N stars"，新增根元素屬性 `data-cu-rating-star-text`（`{value}` 模板，例如 `"{value} 顆星"`）在地化，星星自帶的 `aria-label` 不會被覆寫；沒有 `type` 的 `<button>` 星星自動補上 `type="button"`，放在表單內不會送出。`cu-rating-readonly` 加上 `aria-readonly` 並保留 Tab 停駐點、`cu-rating-disabled` 加上 `aria-disabled` 並移出 Tab 順序（兩者仍不回應操作）。`<button>` 星星自行清除 UA 按鈕樣式。行為改變：初始化時依 `data-cu-rating-value` 同步填滿的星星；`cu:rating:change` 只在值改變時派發，重複點擊同一顆星不再派發
- 30e1096: **破壞性變更** **Rating** 移除 `cubby-ui.d.ts` 的 `DATA_ATTRS.RATING_MAX`（`data-cu-rating-max`）：cubby-ui.js 從未讀取這個屬性，星數一律是 `[data-cu-rating-star]` 元素的數量（radio group 的大小即 radio 的數量）。標記中留著這個屬性不影響運作，只有在 TypeScript 中引用 `DATA_ATTRS.RATING_MAX` 的程式需要移除該引用
- 77e57cf: **Rating** 以程式設定 `data-cu-rating-value`（例如 `el.setAttribute("data-cu-rating-value", "3")`）時，星星外觀、`aria-checked` 與 Tab 停駐點會自動同步，且不派發 `cu:rating:change`；`cu-rating-readonly` / `cu-rating-disabled` 可在初始化後隨時加上或移除，`aria-readonly` / `aria-disabled` 與操作限制跟著生效。forced colors 模式（例如 Windows 高對比）下，選取的星改用 `Highlight` 系統色實心、未選取的星為空心外框，不再全部變成同一個顏色
- 76cbd49: **Steps** 緊接在 `cu-steps-item-completed` 之後的 `cu-steps-separator` 自動顯示為 `bg-primary`（含 `transition-colors duration-200`），標示進度不再需要以 inline style 為分隔線上色
- 13ab64a: **Tabs** 支援 APG 鍵盤操作（自動啟用）：roving tabindex 只留選取中的 tab 為 Tab 停駐點，方向鍵移動焦點並選取（頭尾循環、RTL 左右對調）、Home / End 跳到第一個 / 最後一個，跳過停用的 tab；清單以 column 排版（如 `cu-tabs-list-vertical`，含斷點切換）時改用上 / 下，`aria-orientation` 跟隨當下版面
- a5f0e37: **Tabs** 可關閉的 tab 改用鍵盤 Delete 關閉，關閉圖示不再是巢狀互動元素：文檔原本把 `role="button" tabindex="0"` 的關閉圖示放在 `role="tab"` 的 trigger 內（tab 的子元素對輔助技術為 presentational，且按 Enter 也無法關閉）。JS 現在一律把 `[data-cu-tabs-close]` 設為 `aria-hidden="true"` 並移除 `role` / `tabindex`（舊標記自動修正），可關閉的 trigger 加上 `aria-keyshortcuts="Delete"`，在聚焦的可關閉 tab 上按 Delete（或 Backspace）即關閉。**行為改變**：關閉啟用中的 tab 時改為啟用後一個 tab（沒有則前一個），不再是剩下的第一個；焦點在被關閉的 tab 上時一併移過去
- 41242c3: **Toast** `CubbyUI.toast.show()` 新增 `action: { label, onClick? }` 參數，於通知內渲染 `cu-toast-action-btn`（`label` 以純文字呈現）；點擊後呼叫 `onClick(event, toast)` 並關閉通知，`onClick` 內呼叫 `event.preventDefault()` 可保留通知。`cubby-ui.d.ts` 新增 `ToastAction` 型別
- ca20c5e: 新增
  
  - **Chart** 圖表容器（Data Display）：卡片式包裝（標頭、主數值、操作區、繪圖區、頁尾）、圖例（含可切換項目）、tooltip、SVG 格線與軸標籤、空狀態與載入狀態；搭配 Chart.js 等外部圖表庫使用，不內建繪圖 JS
  - 圖表色盤 token `--color-chart-1` ~ `--color-chart-5`（含暗色模式），`cu-chart-color-1` ~ `5` 以 `currentColor` 供圖例與 SVG 共用
  - **Copy Button** 一鍵複製（Basic）：`data-cu-copy` / `data-cu-copy-target`、`data-cu-copied` / `data-cu-copy-failed` 狀態、aria-live 播報、Clipboard API 失敗時退回 `execCommand`、`cu:copy-button:copy` / `cu:copy-button:error` 事件；另含 Copy Field
  - Combobox / Multi Select 可選的搜尋 debounce：`data-cu-combobox-debounce` / `data-cu-multi-select-debounce`（毫秒），未設定時維持即時過濾；實際套用的查詢改變時觸發 `cu:combobox:search` / `cu:multiselect:search`（`{ query }`），可串接遠端搜尋
  - Calendar 支援 Home / End 跳至月首 / 月末，方向鍵可跨月移動；Date Picker 選取日期時對 hidden input 觸發 `change`
  - **文檔站 SEO**：每頁專屬 meta description（元件頁取翻譯檔副標題並轉純文字）、Open Graph 與 `twitter:card`、設定 `SITE_URL` 時輸出含 base 的 canonical / `og:url` 與絕對網址 hreflang（含 `x-default`）、sitemap（`@astrojs/sitemap`，排除範例 404 頁）與 `robots.txt`；CI 建置文檔站時帶入 `SITE_URL`
  - **互動 JS 型別檢查**：`tsconfig.scripts.json`（`allowJs` + `checkJs`）檢查 `src/scripts/` 元件庫 JS，`npm run type-check` 於 `astro check` 後執行 `type-check:scripts`；元素 expando 屬性宣告於 `src/scripts/globals.d.ts`（不影響對外的 `cubby-ui.d.ts`）
  - **ESLint**（`npm run lint`，flat config）：範圍 `src/scripts/`，只啟用 `@eslint/js` recommended 與少數正確性規則，不含排版 / 風格規則（排版由 Prettier 處理）；CI 於型別檢查後執行
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
  - Calendar / Date Picker：`data-cu-calendar-locale` 指定日期按鈕完整日期名稱與月份標題的語系（預設取最近祖先的 `lang`，都沒有時為 en-US）；Astro `Calendar` / `DatePicker` 與 Blade `calendar` 新增 `weekdays` prop（週日起 7 個字串，預設英文）在地化星期列；新增 JS 產生的週列 class `cu-calendar-week`
  - **無障礙**：Combobox / Multi Select 的搜尋框依 WAI-ARIA APG combobox 加上 `role` / `aria-controls` / `aria-autocomplete` / `aria-expanded`，並以 `aria-activedescendant` 指向鍵盤高亮項目；Multi Select 標籤移除按鈕有可讀名稱（例如 "Remove React"）；Date Picker trigger 加上 `aria-haspopup="dialog"` / `aria-expanded` / `aria-controls`，面板為以月份命名的非模態 dialog；Calendar 改為 grid / row / gridcell 結構，日期按鈕帶完整日期名稱、`aria-selected` 與 `aria-current="date"`；Command Palette 輸入框為 combobox，清單為 listbox / group / option，`aria-activedescendant` 與 `aria-selected` 跟隨選中項目
  - `cu-dropzone-input`：視覺隱藏但可聚焦的 file input（取代範例中不存在於 dist CSS 的 `sr-only`），Dropzone 可用鍵盤選檔
  - 範例標記自動檢查（`tests/e2e/examples.spec.ts`）：把 `components.json` 的 `example`、`llms.txt` 的 HTML 範例與文檔頁 Code 範例放進只載入 `dist/` 產物的頁面，靜態檢查必要的 `data-cu-*` 屬性與結構、觸發器可鍵盤操作、巢狀互動元素、表單類按鈕的 `type="button"`、label 關聯，並實際操作元件確認照抄即可運作
  - `llms.txt` 新增 Input Clearable、Alert Expandable、Data Table 展開列範例與 15 列互動屬性對照；`components.json` 新增 Combobox、Multi Select、Transfer List 範例
  - Header：`cu-header-mobile-toggle-{sm|md|lg|xl}`，漢堡觸發按鈕在該斷點以上隱藏，與 `cu-header-nav-{bp}`、`cu-header-mobile-{nav|backdrop}-{bp}` 搭配
  - **Prettier**（`npm run format` / `format:check`，exact 版本並搭配 `prettier-plugin-astro`、`prettier-plugin-tailwindcss`）：全專案一次格式化，CI 於 lint 後檢查；`src/components/ui/`（Blade 轉換器以 regex 解析，對排版敏感）、Markdown 與 `llms.txt` 不格式化；格式化 commit 登記在 `.git-blame-ignore-revs`。格式化前後 `cubby-ui.min.css` / `cubby-ui.min.js` 與 Blade 輸出完全相同
  - Combobox 文檔新增「Remote Search」範例：監聽 `cu:combobox:search` 以搜尋結果取代清單項目（搭配 debounce、丟棄過期回應）
- ca20c5e: 變更
  
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
  - **Date Picker** 開啟時切回並聚焦選取日（沒有選取時為今天，今天不在 min / max 範圍內時為範圍內第一個可選日期），不再停在上次瀏覽的月份
  - **Calendar** 改用 roving tabindex：整個月曆只有一個 Tab 停駐點，以方向鍵在日期間移動
  - **Combobox / Multi Select** 沒有搜尋框時 trigger 改為 `role="combobox"`（APG select-only combobox），按鈕文字成為「值」而非名稱，建議以 `aria-label` 或 `<label for>` 提供無障礙名稱；兩者都沒有時，JS 以 placeholder 文字補上 `aria-label`（Combobox 已預選值時不補），既有標記升級後不會失去名稱
  - **MenubarItem** 改輸出 `<button type="button">`（原本是無法鍵盤操作的 `<div>`）；Combobox、Multi Select、Number Input、Toggle Group、Transfer List 的 Astro / Blade 元件按鈕加上 `type="button"`，放在 `<form>` 內不再送出表單
  - **Label** 的 Astro Props 改為延伸原生 `<label>` 屬性，`htmlFor` 這類 React 寫法會在型別檢查時報錯
  - Dropdown / Menubar 項目與 Rating 星等加上 focus-visible 焦點樣式
  - **Calendar / Date Picker 月份標題跟著語系**：原本固定為英文（`March 2026`），現在以 `Intl.DateTimeFormat` 依 `data-cu-calendar-locale` / 最近祖先的 `lang` 格式化（zh-TW 為 `2026年3月`），與日期按鈕的無障礙名稱一致；`lang` 為英文或未指定語系的頁面顯示不變
  - **Combobox** 初始化後替換的清單項目（例如遠端搜尋結果）會自動補上 `role="option"` / `aria-selected` 並更新空狀態，原本要重新開啟面板才補上語意、空狀態也不會更新
- ca20c5e: 移除
  
  - `src/pages/examples/dashboard-v5/feedback/`：誤提交進版控的 12 個舊建置快照（`.html`，引用已不存在的 `/_astro/*.css`，部署後會是無樣式頁面），連帶移除 `check:links` 與 docs smoke test 為它設的例外

### Patch Changes

- c850552: 修正 Laravel Blade 元件遺失使用者 `class` 與重複輸出屬性的問題。
  
  - 根元素的 `class:list` 與 `{...rest}` 之間夾有其他屬性時（如 Dropdown、Popover、Progress、Command Palette、Menubar、Drawer、Tabs List、Tour、Transfer List、Carousel、Resizable 等 58 個元件），原本輸出 `@class([...]) … {{ $attributes }}`，`<x-cu.dropdown class="mine">` 會產生兩個 `class` 屬性，瀏覽器只採用第一個，使用者的 class 因此遺失；改為輸出單一 `{{ $attributes->class([...]) }}`
  - Select、Toggle、Number Input、Password Input、Search Input、Floating Label 的使用者 class 改為合併到外層 wrapper（與 Astro 版一致），內層表單元素改用 `{{ $attributes->except('class') }}`，不再與內層自身的 `class` 重複
  - Resizable Panel 移除重複的 `{{ $attributes->except('class') }}`，`id` 等屬性不再輸出兩次；Header Mobile Nav 的 backdrop 只合併 class，其餘屬性只輸出在 nav 面板上
  - `npm run test:blade` 新增檢查：同一開頭標籤出現 `@class(` / 靜態 `class="…"` 搭配裸 `{{ $attributes }}`，或 `$attributes->class(` 搭配 `$attributes->except('class')` 即失敗
- 1d0a110: 修正 Laravel Blade 元件部分 variant / size 值沒有作用的問題。Astro 原始碼以 `variant === "x" ? … : undefined` 寫成的條件 class 在轉換時被略過，Blade 版傳入這些值不會加上對應 class：
  
  - **Back to Top**：`variant="primary"`（`cu-back-to-top-primary`）
  - **Countdown**：`variant="flush"`（`cu-countdown-flush`）
  - **Paragraph**：`variant="lead"`（`cu-p-lead`）
  - **Speed Dial**：`size="sm"`（`cu-speed-dial-sm`）
  - **Toggle Group**：`variant="outline"`（`cu-toggle-group-outline`）
  
  轉換器遇到無法解析的 `class:list` 項目時改為讓該元件轉換失敗，不再靜默略過。
- f5c26a4: 修正 Laravel Blade 元件的使用者 `style` 被忽略，以及 Spinner 把後續內容包進去的問題。
  
  - **Resizable Panel**：傳入 `style` 時 `default-size` 的 `flex-grow` 不再失效；元件的 `flex-grow` 與使用者的 style 合併為單一 `style` 屬性（如 `style="flex-grow: 30; min-width: 0;"`）
  - **Marquee**：使用者傳入的 `style` 不再被 `--cu-marquee-duration` 蓋掉，兩者合併輸出
  - **Spinner**：Blade 版不再輸出自閉合的 `<span … />`。瀏覽器會忽略非 void 元素的 `/>`，原本 Spinner 後面的兄弟元素會被包進 spinner、跟著一起旋轉；改為輸出 `<span …></span>`
  - `npm run test:blade` 新增檢查：同一標籤同時有靜態 `style` 與帶使用者 style 的 `$attributes`、非 void 元素自閉合；render smoke test 另以 DOM 確認使用者傳入的 `style` 有生效
- 修正多個 Laravel Blade 元件在 Laravel 中渲染時拋出 `Undefined variable`，以及輸出殘留 Astro / JSX 語法的問題。
  
  - Carousel、Resizable、Steps、Breadcrumb Current、Progress、Chat Bubble、Command Palette Group / Input、Segmented Control Item 不再引用未宣告的變數（如 `$baseClass`、`$clampedValue`、`$bubbleRole`、`$id`）：可靜態求值的 frontmatter 常數直接內聯，依賴 prop 的值改在 `@props` 後以 `@php` 宣告
  - Color Picker 的 `swatches` 改為 `@foreach` 輸出色票按鈕（原本輸出未轉譯的 `.map()`）
  - Sortable Item 的 `draggable`、Toggle Group Item 的 `aria-pressed` 改為正確的 Blade 輸出；Command Palette Group 的 heading、Stat Trend 的上下箭頭改為 `@if`
  - List 依 `type` 輸出 `<ol>` / `<ul>`（原本輸出字面的 `<Tag>`）；Date Picker 內嵌的月曆改為 `<x-cu.calendar>`，並補回未選日期時的 placeholder class
  - `npm run test:blade` 新增未宣告變數、殘留 JSX 屬性 / 表達式、未轉譯 Astro tag 的檢查，並以 `illuminate/view` 實際渲染每個元件（CI 以 `--require-render` 執行）
- 818493c: **Calendar / Date Picker** 設定 `data-cu-calendar-min` / `data-cu-calendar-max` 且今天不在範圍內時，月曆初始化會開在今天所在、每一天都停用的月份。初始月份改與開啟 Date Picker 時相同：範圍內的選取日 → 今天 → 範圍內第一個可選日期
- 79da8a4: **Command Palette** 項目只在初始化時收集一次，之後新增的項目（例如遠端搜尋結果）不會被篩選、方向鍵選不到、沒有 `role="option"`，`CubbyUI.refresh()` 也因已初始化而略過。改為每次即時查詢項目，清單內容變動時（MutationObserver）立即套用 ARIA 與目前查詢的篩選並更新無結果提示；選中項目被移除時改選第一個可見項目；滑鼠選中改用事件委派；`refresh()` / `init()` 會重新同步已初始化的 palette
- b1c74bd: **型別定義** `DATA_ATTRS` 補上以 `el.dataset` 讀取、先前漏列的屬性：`RESIZABLE_MIN_SIZE`（`data-cu-min-size`）、`RESIZABLE_MAX_SIZE`（`data-cu-max-size`）、`COLOR_PICKER_VALUE`（`data-cu-color-picker-value`）；`npm run check:sync` 的 DATA_ATTRS 對照改為同時偵測 `dataset.cuXxx` / `dataset["cuXxx"]` 的 camelCase 存取
- 7ce1d3c: **焦點環** `ring-offset-*` 的間隙色改為跟隨 `--color-background`，暗色模式下 Button、Checkbox、Radio、Rating 等元件的焦點環外不再多出一圈白邊（Tailwind 預設為白色）；需要其他顏色時仍可用 `ring-offset-{color}` 覆寫
- 7ce1d3c: **焦點環** forced colors 模式（例如 Windows 高對比）會移除 box-shadow，以 `ring-*` 畫的焦點環原本會整個消失；現在 `:focus-visible` 在此模式下改以 `2px solid Highlight` 的 outline 顯示，涵蓋所有元件
- 4213cd0: **Table** `cu-table-wrapper` 加上 `position: relative`，表格內的 `sr-only` 等絕對定位元素改以捲動容器為定位基準，不再跑出容器撐寬整頁，造成窄螢幕出現水平捲動
- 2fd75e7: **Toast** JS 產生的關閉按鈕補上可讀名稱（`aria-label`，預設 `Close`）與 `type="button"`，圖示加 `aria-hidden`；可在容器以 `data-cu-toast-close-text` 覆寫名稱（例如 `關閉通知`）
- 0fc311b: **Toast** 修正 `CubbyUI.toast.promise()` 的 `success` / `error` 傳入 `duration: 0` 時仍在 5000ms 後消失的問題，現在 `0` 會讓結果通知保持顯示直到手動關閉
- 89f5d8b: **Toast** 修正觸發按鈕的 `data-cu-toast-duration="0"` 被當成預設 5000ms 的問題，現在 `0` 會讓通知保持顯示直到手動關閉
- ca20c5e: 修正
  
  - **`dark:` 工具類別跟隨作業系統而非 `.dark` class**：`theme.css` 未定義 `@custom-variant dark`，Tailwind v4 以 `prefers-color-scheme` 編譯 `dark:`，9 個元件的浮層陰影（`dark:shadow-*`）在使用者選擇與作業系統不同的主題時與網站深淺不同步；文檔站 Header 的深淺切換圖示也因此顯示錯誤。新增 `@custom-variant dark (&:where(.dark, .dark *))`，Dark Mode 文檔補上使用者自訂 `dark:` 的同樣設定
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
  - **`CubbyUI.destroy()` 後再 `init()` 不會重新登記元件**：同一批元素（未替換 DOM）在 `destroy()` 後再 `init()` 時，元件因 `_cuInit` 直接跳過，不再被 document 級 handler 追蹤（Dropdown 外部點擊、Escape 不會關閉，Back to Top 捲動監聽不會恢復）。`core/registry.js` 新增 `track()` / `restore()`，已初始化的元素改為重新登記而不重複綁定；Back to Top、Image Compare 恢復 destroy 移除的監聽，Countdown 重新計時且已完成的不再觸發 `cu:countdown:complete`
  - **浮層互斥**：Dropdown trigger、Tabs 關閉按鈕與 Multi Select 選項點擊不再 `stopPropagation`，開啟 Dropdown / Popover / Combobox 等任一浮層時，其他已開啟的會關閉
  - **Blade：`code-block.blade.php` 無法渲染**：輸出含 `$codeTheme === '$light'`、殘留的 `{filename || language}` 與未定義變數 `$codeTheme`（Laravel 渲染即拋 `ViewException`）。改用手寫 override（`scripts/blade/overrides/code-block.blade.php`），並以 `$attributes->class()` 正確合併使用者傳入的 class
  - **Blade：`date-picker.blade.php`** 把 `{value || placeholder}` 原樣輸出到頁面
  - **Blade 轉換器**：條件式中的字串字面量不再被轉成 PHP 變數；文字位置的 `{a || b}` 轉為 `{{ $a ?: $b }}`
  - **Code Block** 複製成功的狀態色看不清楚：暗色頁面時 success token 在深色區塊上對比只有約 2.9:1；light 變體的成功色被按鈕本身的文字色蓋過；header 內的按鈕在滑鼠停留時（也就是剛點擊後）狀態色被 hover 樣式蓋過。成功 / 失敗狀態改用固定色階（`green-400` / `red-400`，light 變體 `green-800` / `red-700`，對比皆 ≥ 4.5:1），hover 樣式不再套用到狀態中的按鈕
  - **Calendar** 日期按鈕的鍵盤焦點看不見（`outline-none` 且沒有 focus-visible 樣式），改為 `ring-2 ring-ring/40` 焦點環並疊在相鄰日期之上，選取日上也可辨識
  - **範例照抄無法運作**（`llms.txt` / `components.json` / 文檔頁）：Dialog / Drawer / Alert Dialog 缺 `data-cu-dialog` 等屬性（關閉鈕無作用、未設 `role` / `aria-labelledby`）；Date Picker 缺月曆必要屬性；Carousel、Command Palette、Checkbox Group、Segmented Control 缺 JS 必要的 `data-cu-*`；Multi Select trigger 是無法鍵盤操作的 `<div>`；Combobox、Number Input、Toggle Group、Transfer List、Color Picker、Tag Input 的按鈕缺 `type="button"`；Rating 星等是 `<span>`；Transfer List 缺右側面板；Tour 範例步驟欄位寫成 `content`（應為 `description`）並使用不存在的 trigger 屬性；label 未以 `for` / `id` 關聯控制項
  - **文檔頁 15 個範例自帶重新實作元件的 `<script>`**（Dropdown、Combobox、Multi Select、Tabs、Popover、Menubar、Date Picker 等），與自動初始化的 cubby-ui.js 重複綁定，點擊 trigger 會開了又關
  - Countdown 文檔範例缺數值屬性，數字永遠不會更新；Hover Card 範例的 popover 屬性與純 CSS 懸停衝突
  - Dashboard V2 設定頁的 Tabs 使用 React 寫法（`defaultValue` / `data-[state=active]`）無法切換，16 處 `htmlFor` 未生效；改用 `data-cu-tabs` 並補上「訂閱方案」分頁內容
  - **Header** 漢堡按鈕在桌機也會顯示：`HeaderMobileToggle`（含 Blade 版）與 Header 範例以 Tailwind 的 `md:hidden` 隱藏觸發按鈕，但預編譯的 `cubby-ui.css` 不含工具類別，只用 dist CSS 的專案在桌機同時看到導航列與漢堡按鈕。改用新的 `cu-header-mobile-toggle-{bp}`
- ca20c5e: 安全性
  
  - **Deploy Docs** 只在本 repo 的 push 觸發的 CI 成功後部署：`workflow_run` 的 `branches: [main]` 比對的是來源分支名稱，fork 若以名為 `main` 的分支開 PR，其 CI 完成後同樣會觸發部署並 checkout fork 的 commit；`build` job 條件新增 `workflow_run.event == 'push'` 與 `head_repository.full_name == github.repository`

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

---

本檔記錄 Cubby UI 的重要變更。格式參考 [Keep a Changelog](https://keepachangelog.com/zh-TW/1.1.0/)，版本遵循 [語意化版本](https://semver.org/lang/zh-TW/)。0.3.0 起由 [Changesets](https://github.com/changesets/changesets) 依 `.changeset/` 中的變更檔產生（依版本號遞增類型分為 Minor / Patch Changes）；0.2.0 以前為手寫的 Keep a Changelog 格式。
