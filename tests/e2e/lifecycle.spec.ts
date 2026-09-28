import { test, expect } from "@playwright/test";
import { openFixture } from "./helpers";

declare const CubbyUI: any;

const DOC_EVENTS = ["click", "keydown", "contextmenu", "scroll"] as const;

test.describe("CubbyUI 生命週期：init / destroy / refresh", () => {
  test.beforeEach(async ({ page }) => {
    await openFixture(page, "lifecycle");
  });

  test("init 註冊 document 級 listener，destroy 全數移除", async ({ page }) => {
    const before = await page.evaluate(() => ({ ...(window as any).__listeners }));
    for (const type of DOC_EVENTS) expect(before[type], `init 後應有 ${type} listener`).toBeGreaterThan(0);

    await page.evaluate(() => CubbyUI.destroy());
    const after = await page.evaluate(() => ({ ...(window as any).__listeners }));
    for (const type of DOC_EVENTS) expect(after[type], `destroy 後 ${type} listener 應歸零`).toBe(0);
  });

  test("destroy 後外部點擊不再關閉選單；替換 DOM 並重新 init 後恢復", async ({ page }) => {
    const trigger = page.locator("#trigger");
    const content = page.locator("[data-cu-dropdown-content]");
    const initial = await page.evaluate(() => ({ ...(window as any).__listeners }));

    await page.evaluate(() => CubbyUI.destroy());
    await trigger.click(); // 元素級 listener 仍在，可開啟
    await expect(content).toBeVisible();
    await page.click("#outside"); // document 級 listener 已移除，不會關閉
    await expect(content).toBeVisible();

    // SPA 路由切換情境：DOM 被替換後重新 init
    await page.evaluate(() => {
      document.getElementById("host")!.innerHTML = `
        <div class="cu-dropdown" data-cu-dropdown>
          <button id="trigger2" class="cu-button cu-button-outline" data-cu-dropdown-trigger>Options</button>
          <div class="cu-dropdown-content" data-cu-dropdown-content hidden>
            <button class="cu-dropdown-item">Edit</button>
          </div>
        </div>`;
      CubbyUI.init();
    });
    const trigger2 = page.locator("#trigger2");
    const content2 = page.locator("[data-cu-dropdown-content]");
    await trigger2.click();
    await expect(content2).toBeVisible();
    await page.click("#outside");
    await expect(content2).toBeHidden();

    const counts = await page.evaluate(() => ({ ...(window as any).__listeners }));
    for (const type of DOC_EVENTS) expect(counts[type], `重新 init 後 ${type} listener 數量應與首次 init 相同`).toBe(initial[type]);
  });

  test("init 可重複呼叫且不會重複綁定元素級事件", async ({ page }) => {
    await page.evaluate(() => { CubbyUI.init(); CubbyUI.init(); });
    const content = page.locator("[data-cu-dropdown-content]");
    await page.click("#trigger");
    // 若重複綁定，兩次 toggle 會互相抵銷而維持隱藏
    await expect(content).toBeVisible();
  });

  test("refresh 清除已移除元素的參照並初始化新增元素", async ({ page }) => {
    await page.evaluate(() => {
      document.getElementById("host")!.innerHTML = `
        <div class="cu-dropdown" data-cu-dropdown>
          <button id="trigger2" class="cu-button cu-button-outline" data-cu-dropdown-trigger>New</button>
          <div class="cu-dropdown-content" data-cu-dropdown-content hidden>
            <button class="cu-dropdown-item">Item</button>
          </div>
        </div>`;
      CubbyUI.refresh();
    });
    const trigger = page.locator("#trigger2");
    const content = page.locator("[data-cu-dropdown-content]");
    await trigger.click();
    await expect(content).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(content).toBeHidden();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
