import { test, expect, type Page } from "@playwright/test";
import { openFixture } from "./helpers";

/**
 * 全站焦點環（src/styles/theme.css）：
 * - `ring-offset-*` 的間隙色跟隨 `--color-background`，暗色模式下不再是 Tailwind 預設的白色
 * - forced colors（Windows 高對比）會移除 box-shadow，`:focus-visible` 改以系統色 outline 顯示
 */
async function focusButtonByKeyboard(page: Page) {
  await page.locator("#before").focus();
  await page.keyboard.press("Tab");
  await expect(page.locator("#button")).toBeFocused();
}

test.describe("焦點環", () => {
  test.beforeEach(async ({ page }) => {
    await openFixture(page, "focus-ring");
  });

  for (const dark of [false, true]) {
    test(`ring-offset 間隙色為頁面背景色（${dark ? "暗色" : "亮色"}模式）`, async ({ page }) => {
      await page.evaluate((on) => document.documentElement.classList.toggle("dark", on), dark);
      await focusButtonByKeyboard(page);
      const background = await page.locator("#probe").evaluate((el) => getComputedStyle(el).backgroundColor);
      const shadow = () => page.locator("#button").evaluate((el) => getComputedStyle(el).boxShadow);
      // ring-offset 是 box-shadow 中 `<color> 0px 0px 0px 2px` 的那一層（等 box-shadow 的 transition 結束）
      await expect.poll(shadow).toContain(`${background} 0px 0px 0px 2px`);
      if (dark) expect(await shadow()).not.toContain("rgb(255, 255, 255)");
    });
  }

  test("forced colors：:focus-visible 以 outline 顯示（一般模式維持 outline-none）", async ({ page }) => {
    await focusButtonByKeyboard(page);
    await expect(page.locator("#button")).toHaveCSS("outline-style", "none");

    await page.emulateMedia({ forcedColors: "active" });
    await expect(page.locator("#button")).toHaveCSS("outline-style", "solid");
    await expect(page.locator("#button")).toHaveCSS("outline-width", "2px");
  });
});
