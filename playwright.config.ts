import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E 設定
 * ---------------------------------------------------------------------------
 * 測試對象是 `dist/core/cubby-ui.{css,js}`（實際出貨的產物），而非 Astro 文檔站，
 * 因此執行前必須先 `npm run build`（`npm ci` 的 prepare 已包含）。
 * fixture 為 `tests/e2e/fixtures/*.html` 靜態頁面，透過 file:// 直接載入。
 *
 * 環境變數：
 *   PLAYWRIGHT_CHROMIUM_EXECUTABLE — 指定既有 Chromium 執行檔，
 *     適用於無法下載 Playwright 瀏覽器的離線／受限網路環境。
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? [["list"], ["github"]] : "list",
  use: {
    trace: "retain-on-failure",
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
      : {},
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
