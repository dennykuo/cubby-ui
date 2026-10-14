import { test, expect } from "@playwright/test";
import { openFixture } from "./helpers";

/**
 * Header 漢堡按鈕的斷點隱藏
 * ---------------------------------------------------------------------------
 * fixture 只載入 dist CSS（不含 Tailwind 工具類別）：觸發按鈕須以 cu-header-mobile-toggle-{bp}
 * 在斷點以上隱藏，與 cu-header-nav-{bp} 互補（原本範例用的 md:hidden 不在 dist CSS 中，桌機也會顯示）。
 */

const BREAKPOINTS = { sm: 640, md: 768, lg: 1024, xl: 1280 } as const;

test.describe("Header", () => {
  for (const [bp, px] of Object.entries(BREAKPOINTS)) {
    test(`cu-header-mobile-toggle-${bp}：${px}px 以下顯示、以上隱藏`, async ({ page }) => {
      const toggle = page.locator(`#toggle-${bp}`);
      await page.setViewportSize({ width: px - 1, height: 600 });
      await openFixture(page, "header");
      await expect(toggle).toBeVisible();
      await page.setViewportSize({ width: px, height: 600 });
      await expect(toggle).toBeHidden();
    });
  }

  test("沒有斷點 class 的觸發按鈕永遠可見", async ({ page }) => {
    await page.setViewportSize({ width: 1400, height: 600 });
    await openFixture(page, "header");
    await expect(page.locator("#toggle-always")).toBeVisible();
  });

  test("md 斷點：觸發按鈕與導航列互補，手機寬度可開啟面板", async ({ page }) => {
    await page.setViewportSize({ width: 767, height: 600 });
    await openFixture(page, "header");
    await expect(page.locator("#nav-md")).toBeHidden();
    await page.locator("#toggle-md").click();
    await expect(page.locator("#main-nav-panel")).toBeVisible();
    await expect(page.locator("#toggle-md")).toHaveAttribute("aria-expanded", "true");

    await page.setViewportSize({ width: 768, height: 600 });
    await expect(page.locator("#nav-md")).toBeVisible();
    await expect(page.locator("#toggle-md")).toBeHidden();
    await expect(page.locator("#main-nav-panel")).toBeHidden();
  });
});
