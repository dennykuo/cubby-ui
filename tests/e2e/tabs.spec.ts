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

  test("點擊關閉啟用中的 tab 會啟用相鄰的 tab 並派發 cu:tabs:close", async ({ page }) => {
    const tabs = page.locator("#closable");
    await tabs.locator('[aria-label="Close B"]').click();

    await expect(tabs.locator('[data-cu-tabs-trigger="b"]')).toHaveCount(0);
    await expect(tabs.locator('[data-cu-tabs-content="b"]')).toHaveCount(0);
    await expect(tabs.locator('[data-cu-tabs-trigger="a"]')).toHaveClass(/cu-tabs-trigger-active/);
    await expect(tabs.locator('[data-cu-tabs-content="a"]')).toBeVisible();
    await expect.poll(() => page.evaluate(() => (window as any).__closed)).toEqual(["b"]);
  });

  test('可關閉的 tab：關閉圖示不是巢狀互動元素（舊版 role="button" / tabindex 會被移除），trigger 帶 aria-keyshortcuts', async ({
    page,
  }) => {
    for (const id of ["closable", "files"]) {
      const closes = page.locator(`#${id} [data-cu-tabs-close]`);
      for (const close of await closes.all()) {
        await expect(close).toHaveAttribute("aria-hidden", "true");
        await expect(close).not.toHaveAttribute("role");
        await expect(close).not.toHaveAttribute("tabindex");
      }
    }
    await expect(page.locator('#closable [data-cu-tabs-trigger="a"]')).toHaveAccessibleName("A");
    await expect(page.getByRole("tab", { name: "styles.css" })).toHaveAttribute("aria-keyshortcuts", "Delete");
    await expect(page.getByRole("tab", { name: "README.md" })).not.toHaveAttribute("aria-keyshortcuts");
    await expect(page.locator("#files").getByRole("button")).toHaveCount(0);

    // Tab 鍵只停在 trigger 上，不會停在關閉圖示
    await page.getByRole("tab", { name: "index.ts" }).focus();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("tab", { name: "styles.css" })).toBeFocused();
  });

  test("Delete 關閉聚焦中的啟用 tab：後一個 tab 取得焦點並啟用", async ({ page }) => {
    const files = page.locator("#files");
    await page.getByRole("tab", { name: "styles.css" }).focus();
    await page.keyboard.press("Delete");

    await expect(files.locator('[data-cu-tabs-trigger="styles"]')).toHaveCount(0);
    await expect(files.locator('[data-cu-tabs-content="styles"]')).toHaveCount(0);
    const app = page.getByRole("tab", { name: "app.tsx" });
    await expect(app).toBeFocused();
    await expect(app).toHaveAttribute("aria-selected", "true");
    await expect(files.locator('[data-cu-tabs-content="app"]')).toBeVisible();
    expect(await page.evaluate(() => (window as any).__closed)).toEqual(["styles"]);
  });

  test("Backspace 關閉未啟用的 tab：焦點移到後一個 tab，選取不變；最後一個關閉時焦點移到前一個", async ({ page }) => {
    const files = page.locator("#files");
    await page.getByRole("tab", { name: "index.ts" }).focus();
    await page.keyboard.press("Backspace");
    await expect(files.locator('[data-cu-tabs-trigger="index"]')).toHaveCount(0);
    const styles = page.getByRole("tab", { name: "styles.css" });
    await expect(styles).toBeFocused();
    await expect(styles).toHaveAttribute("aria-selected", "true");

    // app.tsx 之後只剩不可關閉的 README.md：Delete 在不可關閉的 tab 上無作用
    const readme = page.getByRole("tab", { name: "README.md" });
    await readme.focus();
    await page.keyboard.press("Delete");
    await expect(readme).toHaveCount(1);
    await expect(readme).toBeFocused();

    // 關閉啟用中且為最後一個可關閉的 tab 之前，先把 app.tsx 移到最後
    await page.evaluate(() => {
      const list = document.querySelector("#files .cu-tabs-list")!;
      list.appendChild(list.querySelector('[data-cu-tabs-trigger="app"]')!);
    });
    const app = page.getByRole("tab", { name: "app.tsx" });
    await app.click();
    await page.keyboard.press("Delete");
    await expect(app).toHaveCount(0);
    await expect(readme).toBeFocused();
    await expect(readme).toHaveAttribute("aria-selected", "true");
    await expect(files.locator('[data-cu-tabs-content="readme"]')).toBeVisible();
    expect(await page.evaluate(() => (window as any).__closed)).toEqual(["index", "app"]);
  });

  test("點擊關閉圖示：關閉未啟用的 tab 不影響選取", async ({ page }) => {
    const files = page.locator("#files");
    await files.locator('[data-cu-tabs-trigger="app"] [data-cu-tabs-close]').click();
    await expect(files.locator('[data-cu-tabs-trigger="app"]')).toHaveCount(0);
    await expect(page.getByRole("tab", { name: "styles.css" })).toHaveAttribute("aria-selected", "true");
    await expect(files.locator('[data-cu-tabs-content="styles"]')).toBeVisible();
    expect(await page.evaluate(() => (window as any).__closed)).toEqual(["app"]);
  });
});
