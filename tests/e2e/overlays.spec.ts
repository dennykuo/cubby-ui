import { test, expect } from "@playwright/test";
import { openFixture } from "./helpers";

/**
 * 浮層 trigger 不得阻止點擊冒泡：document 級 handler 依「點擊是否在元件內」關閉其他已開啟的浮層，
 * trigger 若 stopPropagation，開啟另一個浮層時已開啟的不會關閉，兩個面板同時存在。
 */
test.describe("浮層互斥", () => {
  test.beforeEach(async ({ page }) => {
    await openFixture(page, "overlays-mixed");
  });

  const content = (page: import("@playwright/test").Page, id: string, part: string) =>
    page.locator(`#${id} [data-cu-${part}-content]`);

  test("開啟另一個浮層時，已開啟的 Dropdown / Popover / Combobox 會關閉", async ({ page }) => {
    await page.locator("#dd-a [data-cu-dropdown-trigger]").click();
    await expect(content(page, "dd-a", "dropdown")).toBeVisible();

    await page.locator("#dd-b [data-cu-dropdown-trigger]").click();
    await expect(content(page, "dd-b", "dropdown")).toBeVisible();
    await expect(content(page, "dd-a", "dropdown")).toBeHidden();
    await expect(page.locator("#dd-a [data-cu-dropdown-trigger]")).toHaveAttribute("aria-expanded", "false");

    await page.locator("#pop [data-cu-popover-trigger]").click();
    await expect(content(page, "pop", "popover")).toBeVisible();
    await expect(content(page, "dd-b", "dropdown")).toBeHidden();

    await page.locator("#cb [data-cu-combobox-trigger]").click();
    await expect(content(page, "cb", "combobox")).toBeVisible();
    await expect(content(page, "pop", "popover")).toBeHidden();

    await page.locator("#dd-a [data-cu-dropdown-trigger]").click();
    await expect(content(page, "dd-a", "dropdown")).toBeVisible();
    await expect(content(page, "cb", "combobox")).toBeHidden();
  });

  test("Dropdown trigger 的點擊會冒泡到 document，自身維持開關切換", async ({ page }) => {
    const trigger = page.locator("#dd-a [data-cu-dropdown-trigger]");
    await trigger.click();
    expect(await page.evaluate(() => (window as any).__docClicks)).toBe(1);
    await expect(content(page, "dd-a", "dropdown")).toBeVisible();
    await trigger.click();
    await expect(content(page, "dd-a", "dropdown")).toBeHidden();
  });

  test("Tabs 關閉按鈕會關閉其他浮層，且不會啟用被關閉的分頁", async ({ page }) => {
    await page.locator("#dd-a [data-cu-dropdown-trigger]").click();
    await expect(content(page, "dd-a", "dropdown")).toBeVisible();
    await page.locator("[data-cu-tabs-close]").click();
    await expect(content(page, "dd-a", "dropdown")).toBeHidden();
    await expect(page.locator('[data-cu-tabs-trigger="two"]')).toHaveCount(0);
    await expect(page.locator('[data-cu-tabs-trigger="one"]')).toHaveAttribute("aria-selected", "true");
    await expect(page.locator('[data-cu-tabs-content="one"]')).toBeVisible();
  });
});
