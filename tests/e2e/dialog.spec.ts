import { test, expect } from "@playwright/test";
import { openFixture } from "./helpers";

test.describe("Dialog / Drawer / Alert Dialog", () => {
  test.beforeEach(async ({ page }) => {
    await openFixture(page, "overlays");
  });

  test("Dialog：開啟後聚焦首個可互動元素，ARIA 連結標題與描述", async ({ page }) => {
    const dialog = page.locator("#my-dialog");
    await expect(dialog).not.toHaveAttribute("open");

    await page.click("#dialog-trigger");
    await expect(dialog).toHaveAttribute("open", "");
    await expect(page.locator("#dialog-cancel")).toBeFocused();

    const titleId = await page.locator("#my-dialog .cu-dialog-title").getAttribute("id");
    const descId = await page.locator("#my-dialog .cu-dialog-description").getAttribute("id");
    expect(titleId).toBeTruthy();
    expect(descId).toBeTruthy();
    await expect(dialog).toHaveAttribute("aria-labelledby", titleId!);
    await expect(dialog).toHaveAttribute("aria-describedby", descId!);
  });

  test("Dialog：尊重 [autofocus]，不覆寫作者指定的初始焦點", async ({ page }) => {
    await page.click("#autofocus-trigger");
    await expect(page.locator("#autofocus-dialog")).toHaveAttribute("open", "");
    await expect(page.locator("#autofocus-input")).toBeFocused();
  });

  test("Dialog：close 按鈕關閉後焦點返回觸發按鈕", async ({ page }) => {
    await page.click("#dialog-trigger");
    await page.click("#dialog-cancel");
    await expect(page.locator("#my-dialog")).not.toHaveAttribute("open");
    await expect(page.locator("#dialog-trigger")).toBeFocused();
  });

  test("Dialog：Escape 關閉後焦點返回觸發按鈕", async ({ page }) => {
    await page.click("#dialog-trigger");
    await page.keyboard.press("Escape");
    await expect(page.locator("#my-dialog")).not.toHaveAttribute("open");
    await expect(page.locator("#dialog-trigger")).toBeFocused();
  });

  test("Dialog：點擊 backdrop 關閉", async ({ page }) => {
    await page.click("#dialog-trigger");
    await expect(page.locator("#my-dialog")).toHaveAttribute("open", "");
    await page.mouse.click(2, 2);
    await expect(page.locator("#my-dialog")).not.toHaveAttribute("open");
  });

  test("Drawer：開關與焦點返回", async ({ page }) => {
    const drawer = page.locator("#my-drawer");
    await page.click("#drawer-trigger");
    await expect(drawer).toHaveAttribute("open", "");
    await expect(page.locator("#drawer-x")).toBeFocused();
    const titleId = await page.locator("#my-drawer .cu-drawer-title").getAttribute("id");
    await expect(drawer).toHaveAttribute("aria-labelledby", titleId!);

    await page.click("#drawer-x");
    await expect(drawer).not.toHaveAttribute("open");
    await expect(page.locator("#drawer-trigger")).toBeFocused();
  });

  test("Drawer：點擊 backdrop 關閉", async ({ page }) => {
    await page.click("#drawer-trigger");
    // 右側抽屜，畫面左側為 backdrop
    await page.mouse.click(2, 200);
    await expect(page.locator("#my-drawer")).not.toHaveAttribute("open");
  });

  test("Alert Dialog：role=alertdialog，backdrop 點擊不關閉，只有 cancel / action 能關閉", async ({ page }) => {
    const alert = page.locator("#my-alert");
    await page.click("#alert-trigger");
    await expect(alert).toHaveAttribute("open", "");
    await expect(alert).toHaveAttribute("role", "alertdialog");

    await page.mouse.click(2, 2);
    await expect(alert).toHaveAttribute("open", "");

    await page.click("#alert-cancel");
    await expect(alert).not.toHaveAttribute("open");
    await expect(page.locator("#alert-trigger")).toBeFocused();

    await page.click("#alert-trigger");
    await page.click("#alert-action");
    await expect(alert).not.toHaveAttribute("open");
  });
});
