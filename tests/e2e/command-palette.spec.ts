import { test, expect } from "@playwright/test";
import { openFixture } from "./helpers";

test.describe("Command Palette", () => {
  test.beforeEach(async ({ page }) => {
    await openFixture(page, "command-palette");
  });

  test("關閉時不顯示，觸發按鈕開啟並聚焦輸入框", async ({ page }) => {
    const palette = page.locator("#cmd");
    // 回歸：.cu-command 的 display 曾寫在基礎 class 上，關閉中的 palette 會以 fixed 疊在頁面上
    await expect(palette).toBeHidden();
    await expect(page.locator("#trigger")).toBeVisible();

    await page.locator("#trigger").click();
    await expect(palette).toBeVisible();
    await expect(palette.locator("[data-cu-command-input]")).toBeFocused();
  });

  test("Ctrl+K / ⌘K 切換開關，Esc 關閉後清空查詢與篩選", async ({ page }) => {
    const palette = page.locator("#cmd");
    const input = palette.locator("[data-cu-command-input]");

    await page.keyboard.press("Control+k");
    await expect(palette).toBeVisible();
    await input.fill("pref");
    await expect(palette.locator("[data-cu-command-item]:visible")).toHaveCount(1);

    await page.keyboard.press("Escape");
    await expect(palette).toBeHidden();

    await page.keyboard.press("Meta+k");
    await expect(palette).toBeVisible();
    await expect(input).toHaveValue("");
    await expect(palette.locator("[data-cu-command-item]:visible")).toHaveCount(3);

    await page.keyboard.press("Meta+k");
    await expect(palette).toBeHidden();
  });

  test("篩選隱藏空分組與分隔線，無結果顯示提示", async ({ page }) => {
    const palette = page.locator("#cmd");
    const input = palette.locator("[data-cu-command-input]");
    await page.locator("#trigger").click();

    await input.fill("file");
    await expect(palette.locator("[data-cu-command-item]:visible")).toHaveText(["New File", "Open File"]);
    await expect(palette.locator("[data-cu-command-group]:visible")).toHaveCount(1);
    await expect(palette.locator("[data-cu-command-separator]")).toBeHidden();
    await expect(palette.locator("[data-cu-command-empty]")).toBeHidden();

    await input.fill("nothing-matches");
    await expect(palette.locator("[data-cu-command-item]:visible")).toHaveCount(0);
    await expect(palette.locator("[data-cu-command-empty]")).toBeVisible();
  });

  test("方向鍵 / Tab 循環選取，Enter 執行選中項目", async ({ page }) => {
    const palette = page.locator("#cmd");
    const input = palette.locator("[data-cu-command-input]");
    await page.locator("#trigger").click();

    await input.fill("file");
    const items = palette.locator("[data-cu-command-item]:visible");
    await expect(items.nth(0)).toHaveAttribute("data-cu-command-active", "");

    await input.press("ArrowDown");
    await expect(items.nth(1)).toHaveAttribute("data-cu-command-active", "");
    await input.press("Tab"); // 循環回第一項
    await expect(items.nth(0)).toHaveAttribute("data-cu-command-active", "");
    await input.press("Shift+Tab"); // 反向循環到最後一項
    await expect(items.nth(1)).toHaveAttribute("data-cu-command-active", "");

    await input.press("Enter");
    expect(await page.evaluate(() => (window as any).__ran)).toBe("open file");
  });

  test("點擊 backdrop 關閉", async ({ page }) => {
    const palette = page.locator("#cmd");
    await page.locator("#trigger").click();
    await expect(palette).toBeVisible();
    await page.mouse.click(5, 5);
    await expect(palette).toBeHidden();
  });
});
