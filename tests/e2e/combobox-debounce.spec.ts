import { test, expect, type Page } from "@playwright/test";
import { openFixture } from "./helpers";

/**
 * Combobox / Multi Select 搜尋 debounce（data-cu-combobox-debounce / data-cu-multi-select-debounce）
 * 以 page.clock 控制計時器，不使用固定 waitForTimeout。
 */

const searches = (page: Page) => page.evaluate(() => (window as any).__searches as string[]);
const changes = (page: Page) => page.evaluate(() => (window as any).__changes as string[]);

/** 安裝假時鐘並暫停，之後只有 runFor() 會推進時間 */
async function setupClock(page: Page) {
  await page.clock.install({ time: new Date("2026-01-01T00:00:00Z") });
  await page.clock.pauseAt(new Date("2026-01-01T00:00:01Z"));
}

test.describe("Combobox search debounce", () => {
  test.beforeEach(async ({ page }) => {
    await setupClock(page);
    await openFixture(page, "combobox-debounce");
  });

  test("未設定 debounce 時維持即時過濾", async ({ page }) => {
    const root = page.locator("#cb-instant");
    const visible = root.locator("[data-cu-combobox-item]:not([hidden])");

    await root.locator("[data-cu-combobox-trigger]").click();
    await root.locator("[data-cu-combobox-input]").fill("ap");
    // 不推進時鐘即已過濾
    await expect(visible).toHaveText(["Apple", "Apricot"]);
    expect(await searches(page)).toEqual(["cb-instant:ap"]);
  });

  test("設定 debounce 時延遲過濾，連續輸入會重新計時", async ({ page }) => {
    const root = page.locator("#cb-debounce");
    const input = root.locator("[data-cu-combobox-input]");
    const visible = root.locator("[data-cu-combobox-item]:not([hidden])");

    await root.locator("[data-cu-combobox-trigger]").click();
    await input.fill("b");
    await page.clock.runFor(200);
    await input.fill("ba");
    await page.clock.runFor(200);
    // 距離最後一次輸入僅 200ms，尚未過濾
    await expect(visible).toHaveCount(5);
    expect(await searches(page)).toEqual([]);

    await page.clock.runFor(99);
    await expect(visible).toHaveCount(5);
    await page.clock.runFor(1);
    await expect(visible).toHaveText(["Banana"]);
    // 只對最終查詢觸發一次 search 事件
    expect(await searches(page)).toEqual(["cb-debounce:ba"]);
  });

  test("清空查詢立即還原清單", async ({ page }) => {
    const root = page.locator("#cb-debounce");
    const input = root.locator("[data-cu-combobox-input]");
    const visible = root.locator("[data-cu-combobox-item]:not([hidden])");

    await root.locator("[data-cu-combobox-trigger]").click();
    await input.fill("cher");
    await page.clock.runFor(300);
    await expect(visible).toHaveText(["Cherry"]);

    await input.fill("");
    await expect(visible).toHaveCount(5);
  });

  test("Enter 先套用待執行的過濾，不會選到過期結果", async ({ page }) => {
    const root = page.locator("#cb-debounce");
    const input = root.locator("[data-cu-combobox-input]");
    const visible = root.locator("[data-cu-combobox-item]:not([hidden])");
    const value = root.locator("[data-cu-combobox-value]");

    await root.locator("[data-cu-combobox-trigger]").click();
    await input.fill("ap");
    await page.clock.runFor(300);
    await expect(visible).toHaveText(["Apple", "Apricot"]);

    await page.keyboard.press("ArrowDown");
    await expect(root.locator(".cu-combobox-item-highlight")).toHaveText("Apple");

    // 查詢改為 "apr"，過濾尚在等待中時按 Enter
    await input.fill("apr");
    await page.keyboard.press("Enter");

    await expect(visible).toHaveText(["Apricot"]);
    await expect(root.locator(".cu-combobox-item-highlight")).toHaveCount(0);
    await expect(value).toHaveText("Select fruit...");
    await expect(root.locator("[data-cu-combobox-content]")).toBeVisible();
    expect(await changes(page)).toEqual([]);

    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(value).toHaveText("Apricot");
    expect(await changes(page)).toEqual(["cb-debounce:Apricot"]);
  });

  test("方向鍵先套用待執行的過濾，高亮落在新結果", async ({ page }) => {
    const root = page.locator("#cb-debounce");
    const input = root.locator("[data-cu-combobox-input]");

    await root.locator("[data-cu-combobox-trigger]").click();
    await input.fill("blue");
    await page.keyboard.press("ArrowDown");
    await expect(root.locator(".cu-combobox-item-highlight")).toHaveText("Blueberry");
    await page.keyboard.press("Enter");
    await expect(root.locator("[data-cu-combobox-value]")).toHaveText("Blueberry");
  });

  test("即時模式下被過濾掉的高亮項目也不會被 Enter 選取", async ({ page }) => {
    const root = page.locator("#cb-instant");
    const input = root.locator("[data-cu-combobox-input]");
    const value = root.locator("[data-cu-combobox-value]");

    await root.locator("[data-cu-combobox-trigger]").click();
    await input.focus();
    await page.keyboard.press("ArrowDown");
    await expect(root.locator(".cu-combobox-item-highlight")).toHaveText("Apple");

    await input.fill("ban");
    await page.keyboard.press("Enter");
    await expect(value).toHaveText("Select fruit...");

    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(value).toHaveText("Banana");
  });

  test("關閉時清除待執行的過濾，重新開啟為完整清單", async ({ page }) => {
    const root = page.locator("#cb-debounce");
    const trigger = root.locator("[data-cu-combobox-trigger]");
    const input = root.locator("[data-cu-combobox-input]");
    const visible = root.locator("[data-cu-combobox-item]:not([hidden])");

    await trigger.click();
    await input.fill("ban");
    await page.keyboard.press("Escape");
    await expect(root.locator("[data-cu-combobox-content]")).toBeHidden();
    await expect(input).toHaveValue("");

    await page.clock.runFor(1000);
    expect(await searches(page)).toEqual([]);

    await trigger.click();
    await expect(visible).toHaveCount(5);
  });

  test("destroy() 清除待執行的過濾計時器", async ({ page }) => {
    const root = page.locator("#cb-debounce");
    const visible = root.locator("[data-cu-combobox-item]:not([hidden])");

    await root.locator("[data-cu-combobox-trigger]").click();
    await root.locator("[data-cu-combobox-input]").fill("ban");
    await page.evaluate(() => (window as any).CubbyUI.destroy());
    await page.clock.runFor(1000);

    await expect(visible).toHaveCount(5);
    expect(await searches(page)).toEqual([]);
  });
});

test.describe("Multi Select search debounce", () => {
  test.beforeEach(async ({ page }) => {
    await setupClock(page);
    await openFixture(page, "combobox-debounce");
  });

  test("未設定 debounce 時維持即時過濾", async ({ page }) => {
    const root = page.locator("#ms-instant");
    const visible = root.locator("[data-cu-multi-select-item]:not([hidden])");

    await root.locator("[data-cu-multi-select-trigger]").click();
    await root.locator("[data-cu-multi-select-input]").fill("ch");
    await expect(visible).toHaveText(["Cherry"]);
    expect(await searches(page)).toEqual(["ms-instant:ch"]);
  });

  test("設定 debounce 時延遲過濾", async ({ page }) => {
    const root = page.locator("#ms-debounce");
    const visible = root.locator("[data-cu-multi-select-item]:not([hidden])");

    await root.locator("[data-cu-multi-select-trigger]").click();
    await root.locator("[data-cu-multi-select-input]").fill("ch");
    await page.clock.runFor(299);
    await expect(visible).toHaveCount(5);
    await page.clock.runFor(1);
    await expect(visible).toHaveText(["Cherry"]);
    expect(await searches(page)).toEqual(["ms-debounce:ch"]);
  });

  test("Enter 先套用待執行的過濾，不會切換過期結果", async ({ page }) => {
    const root = page.locator("#ms-debounce");
    const input = root.locator("[data-cu-multi-select-input]");
    const visible = root.locator("[data-cu-multi-select-item]:not([hidden])");

    await root.locator("[data-cu-multi-select-trigger]").click();
    await input.fill("b");
    await page.clock.runFor(300);
    await expect(visible).toHaveText(["Banana", "Blueberry"]);
    await page.keyboard.press("ArrowDown");
    await expect(root.locator(".cu-multi-select-item-highlight")).toHaveText("Banana");

    await input.fill("blu");
    await page.keyboard.press("Enter");
    await expect(visible).toHaveText(["Blueberry"]);
    await expect(root.locator(".cu-multi-select-tag")).toHaveCount(0);
    expect(await changes(page)).toEqual([]);

    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(root.locator(".cu-multi-select-tag")).toHaveCount(1);
    await expect(root.locator(".cu-multi-select-tag")).toContainText("Blueberry");
    expect(await changes(page)).toEqual(["ms-debounce:blueberry"]);
  });

  test("關閉時清除待執行的過濾", async ({ page }) => {
    const root = page.locator("#ms-debounce");
    const trigger = root.locator("[data-cu-multi-select-trigger]");
    const input = root.locator("[data-cu-multi-select-input]");
    const visible = root.locator("[data-cu-multi-select-item]:not([hidden])");

    await trigger.click();
    await input.fill("ch");
    await page.click("#outside");
    await expect(root.locator("[data-cu-multi-select-content]")).toBeHidden();
    await expect(input).toHaveValue("");

    await page.clock.runFor(1000);
    expect(await searches(page)).toEqual([]);
    await trigger.click();
    await expect(visible).toHaveCount(5);
  });
});
