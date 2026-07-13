# Changelog

本檔記錄 Cubby UI 的重要變更。格式參考 [Keep a Changelog](https://keepachangelog.com/zh-TW/1.1.0/)，版本遵循 [語意化版本](https://semver.org/lang/zh-TW/)。

## [Unreleased]

### Added
- CI workflow（`.github/workflows/ci.yml`）：push / PR 時執行建置、型別檢查、清單同步與 Blade 回歸測試
- `type-check`（`astro check`）與 `check:sync` npm script
- `scripts/check-component-sync.cjs`：防止元件清單在 `component-nav.ts` / 頁面 / i18n / CSS / `components.json` / `llms.txt` 之間漂移
- 治理文件：`DESIGN.md`、`CONTRIBUTING.md`、`CHANGELOG.md`
- 補回缺漏的 **Text** 元件至 `components.json` 與 `llms.txt`

### Changed
- **Alert** `cu-alert-accent` 與 **Notification** 未讀狀態：移除左側色條反模式，改為全框 + 背景 tint（Alert）與背景 tint + 標題前圓點（Notification）
- **色彩 token**：中性表面與前景的純白 `#fff` 改為極淡品牌色調（`hsl(210 40% 99.5%)`），消除死白
- **CodeBlock**：`variant`（dark/light）prop 更名為 `theme`；**ChatBubble**：`variant`（user/assistant）更名為 `role`。兩者皆保留舊 `variant` prop 作為向後相容 fallback，CSS class 名不變

### Fixed
- `CubbyUI.destroy()` 現在完整移除所有 document 級事件監聽器（含 Command Palette 全域快捷鍵），不再殘留
- **Context Menu** 與 **Date Picker** 改用 delegated 事件模式，消除每個實例累積 document listener 的潛在記憶體洩漏
- `theme.css` 移除 `--color-border` / `--color-input` 的雙分號筆誤
- 重新生成 `package-lock.json`，修復 sharp 罕見平台套件缺 `version` 導致 npm ≥ 10.9 無法 `npm ci` 的問題

### Accessibility
- **Dialog / Drawer / Alert Dialog** 開啟時聚焦首個可互動元素（尊重 `[autofocus]`），符合 WCAG 2.4.3
- **Command Palette** 新增 Tab / Shift+Tab 鍵盤導航（循環結果）

## [0.1.0]

- 初始開發版本：95 個元件（純 HTML + Tailwind CSS）、完整英文 / 繁體中文 i18n 文檔站、Laravel Blade 元件轉換器、UMD 互動 JS、Playground 互動式探索頁與多套 Dashboard 範例
