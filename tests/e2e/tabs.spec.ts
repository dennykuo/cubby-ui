import { test, expect } from "@playwright/test";
import { openFixture } from "./helpers";

test.describe("Tabs", () => {
  test.beforeEach(async ({ page }) => {
    await openFixture(page, "tabs");
  });

  test("ARIA 角色與 trigger ↔ panel 雙向連結", async ({ page }) => {
    const tabs = page.locator("#basic");
    await expect(tabs.locator(".cu-tabs-list")).toHaveAttribute("role", "tablist");

    const trigger1 = tabs.locator('[data-cu-tabs-trigger="tab1"]');
    const panel1 = tabs.locator('[data-cu-tabs-content="tab1"]');
    await expect(trigger1).toHaveAttribute("role", "tab");
    await expect(trigger1).toHaveAttribute("aria-selected", "true");
    await expect(panel1).toHaveAttribute("role", "tabpanel");

    const triggerId = await trigger1.getAttribute("id");
    const panelId = await panel1.getAttribute("id");
    expect(triggerId).toBeTruthy();
    expect(panelId).toBeTruthy();
    await expect(trigger1).toHaveAttribute("aria-controls", panelId!);
    await expect(panel1).toHaveAttribute("aria-labelledby", triggerId!);
  });

  test("點擊切換 panel 與 aria-selected", async ({ page }) => {
    const tabs = page.locator("#basic");
    const trigger1 = tabs.locator('[data-cu-tabs-trigger="tab1"]');
    const trigger2 = tabs.locator('[data-cu-tabs-trigger="tab2"]');
    const panel1 = tabs.locator('[data-cu-tabs-content="tab1"]');
    const panel2 = tabs.locator('[data-cu-tabs-content="tab2"]');

    await expect(panel1).toBeVisible();
    await expect(panel2).toBeHidden();

    await trigger2.click();
    await expect(panel2).toBeVisible();
    await expect(panel1).toBeHidden();
    await expect(trigger2).toHaveClass(/cu-tabs-trigger-active/);
    await expect(trigger2).toHaveAttribute("aria-selected", "true");
    await expect(trigger1).not.toHaveClass(/cu-tabs-trigger-active/);
    await expect(trigger1).toHaveAttribute("aria-selected", "false");
  });

  test("關閉啟用中的 tab 會啟用剩餘的第一個 tab 並派發 cu:tabs:close", async ({ page }) => {
    const tabs = page.locator("#closable");
    await tabs.locator('[aria-label="Close B"]').click();

    await expect(tabs.locator('[data-cu-tabs-trigger="b"]')).toHaveCount(0);
    await expect(tabs.locator('[data-cu-tabs-content="b"]')).toHaveCount(0);
    await expect(tabs.locator('[data-cu-tabs-trigger="a"]')).toHaveClass(/cu-tabs-trigger-active/);
    await expect(tabs.locator('[data-cu-tabs-content="a"]')).toBeVisible();
    await expect.poll(() => page.evaluate(() => (window as any).__closed)).toEqual(["b"]);
  });
});
