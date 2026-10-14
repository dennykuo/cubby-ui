import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test, expect, type Page } from "@playwright/test";
import { openFixture } from "./helpers";

declare const CubbyUI: any;

/**
 * src/scripts/components/*.js 的 JSDoc「HTML structure」範例必須能直接運作：
 * 從原始碼擷取範例標記注入空白頁、執行 CubbyUI.init()，再驗證元件的基本互動。
 */
const COMPONENTS = resolve(fileURLToPath(new URL(".", import.meta.url)), "../../src/scripts/components");

function jsdocExample(module: string): string {
  const src = readFileSync(resolve(COMPONENTS, `${module}.js`), "utf8");
  const lines = src
    .slice(src.indexOf("HTML structure:"))
    .split("\n")
    .slice(1)
    .map((l) => l.replace(/^\s*\* ?/, ""));
  const out: string[] = [];
  for (const line of lines) {
    if (line.startsWith("```html")) continue;
    if (line.startsWith("```") || line.startsWith("- ") || line.startsWith("/") || line.trim() === "") {
      if (out.length) break;
      continue;
    }
    out.push(line);
  }
  return out.join("\n");
}

async function mount(page: Page, module: string) {
  await openFixture(page, "blank");
  const html = jsdocExample(module);
  expect(html).toContain("<");
  await page.evaluate((markup) => {
    document.body.insertAdjacentHTML("afterbegin", markup);
    CubbyUI.init();
  }, html);
}

test.describe("JSDoc HTML 範例", () => {
  for (const [module, triggerAttr, closeAttr] of [
    ["dialog", "data-cu-dialog-trigger", "data-cu-dialog-close"],
    ["drawer", "data-cu-drawer-trigger", "data-cu-drawer-close"],
    ["alert-dialog", "data-cu-alert-dialog-trigger", "data-cu-alert-dialog-cancel"],
  ] as const) {
    test(`${module}：觸發按鈕開啟，關閉按鈕關閉並把焦點還給觸發按鈕`, async ({ page }) => {
      await mount(page, module);
      const trigger = page.locator(`[${triggerAttr}]`);
      const dialog = page.locator("dialog");
      await trigger.click();
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveAttribute("aria-labelledby", /.+/);
      await dialog.locator(`[${closeAttr}]`).first().click();
      await expect(dialog).toBeHidden();
      await expect(trigger).toBeFocused();
      if (module === "alert-dialog") await expect(dialog).toHaveAttribute("role", "alertdialog");
    });
  }

  test("multi-select：trigger 為 <button>，選取後標籤與移除按鈕在 trigger 之外", async ({ page }) => {
    await mount(page, "multi-select");
    const trigger = page.locator("[data-cu-multi-select-trigger]");
    await expect(trigger).toHaveJSProperty("tagName", "BUTTON");
    await trigger.click();
    await page.locator("[data-cu-multi-select-item]").first().click();
    await expect(page.locator(".cu-multi-select-tag")).toHaveCount(1);
    await expect(trigger.locator("button")).toHaveCount(0);
    await page.locator(".cu-multi-select-tag-remove").click();
    await expect(page.locator(".cu-multi-select-tag")).toHaveCount(0);
  });

  test("data-table-expandable：展開按鈕切換下一列與 aria-expanded", async ({ page }) => {
    await mount(page, "data-table-expandable");
    const trigger = page.locator("[data-cu-expand-row]");
    const details = page.locator(".cu-data-table-expanded-content");
    await expect(details).toBeHidden();
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(details).toBeVisible();
    await expect(page.locator("tr").first()).toHaveClass(/cu-data-table-expanded-row/);
    await trigger.click();
    await expect(details).toBeHidden();
  });

  test('rating：星星為 <button type="button">，點擊與 Enter 更新 data-cu-rating-value 並派發 cu:rating:change', async ({
    page,
  }) => {
    await mount(page, "rating");
    const root = page.locator("[data-cu-rating]");
    const value = page.evaluate(
      () =>
        new Promise((r) =>
          document.addEventListener("cu:rating:change", (e: any) => r(e.detail.value), { once: true }),
        ),
    );
    await page.locator('[data-cu-rating-star="2"]').click();
    expect(await value).toBe(2);
    await expect(root).toHaveAttribute("data-cu-rating-value", "2");
    await expect(page.locator(".cu-rating-item-active")).toHaveCount(2);
    await expect(page.locator(".cu-rating-item svg")).toHaveCount(2);
    // 星星為 <button type="button">：可用鍵盤評分
    await expect(page.locator("[data-cu-rating-star]").first()).toHaveJSProperty("type", "button");
    await page.locator('[data-cu-rating-star="1"]').focus();
    await page.keyboard.press("Enter");
    await expect(root).toHaveAttribute("data-cu-rating-value", "1");
  });
});
