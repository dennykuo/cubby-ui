import { test, expect } from "@playwright/test";
import { openFixture } from "./helpers";

test.describe("Dropdown", () => {
  test.beforeEach(async ({ page }) => {
    await openFixture(page, "dropdown");
  });

  test("初始 ARIA 狀態與點擊開關", async ({ page }) => {
    const trigger = page.locator("#trigger");
    const content = page.locator("[data-cu-dropdown-content]");

    await expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(content).toBeHidden();
    await expect(content).toHaveAttribute("role", "menu");
    await expect(page.locator(".cu-dropdown-item").first()).toHaveAttribute("role", "menuitem");

    await trigger.click();
    await expect(content).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    await trigger.click();
    await expect(content).toBeHidden();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("鍵盤導航：方向鍵 / Home / End 循環並略過 disabled 項目", async ({ page }) => {
    await page.click("#trigger");
    const highlighted = page.locator(".cu-dropdown-item-highlight");

    await page.keyboard.press("ArrowDown");
    await expect(highlighted).toHaveText("Edit");
    await page.keyboard.press("ArrowDown");
    await expect(highlighted).toHaveText("Duplicate");
    // Archive 為 disabled，應被略過
    await page.keyboard.press("ArrowDown");
    await expect(highlighted).toHaveText("Delete");
    // 到底後循環回第一項
    await page.keyboard.press("ArrowDown");
    await expect(highlighted).toHaveText("Edit");
    // 從第一項往上循環到最後一項
    await page.keyboard.press("ArrowUp");
    await expect(highlighted).toHaveText("Delete");

    await page.keyboard.press("Home");
    await expect(highlighted).toHaveText("Edit");
    await page.keyboard.press("End");
    await expect(highlighted).toHaveText("Delete");
    await expect(highlighted).toHaveCount(1);
  });

  test("Enter 觸發高亮項目，且不會反向觸發 trigger 按鈕", async ({ page }) => {
    await page.click("#trigger");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect.poll(() => page.evaluate(() => (window as any).__clicked)).toBe("Duplicate");
    // 焦點仍在 trigger 上，Enter 的預設按鈕行為若未被阻止會把選單關掉
    await expect(page.locator("[data-cu-dropdown-content]")).toBeVisible();
  });

  test("Escape 與外部點擊關閉選單", async ({ page }) => {
    const trigger = page.locator("#trigger");
    const content = page.locator("[data-cu-dropdown-content]");

    await trigger.click();
    await page.keyboard.press("Escape");
    await expect(content).toBeHidden();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await trigger.click();
    await expect(content).toBeVisible();
    await page.click("#outside");
    await expect(content).toBeHidden();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
