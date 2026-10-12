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

  test("APG combobox + listbox：輸入框、清單、分組與項目的 ARIA", async ({ page }) => {
    const palette = page.locator("#cmd");
    const input = palette.locator("[data-cu-command-input]");
    const list = palette.locator("[data-cu-command-list]");
    const items = palette.locator("[data-cu-command-item]");

    const listId = await list.getAttribute("id");
    expect(listId).toBeTruthy();
    await expect(list).toHaveAttribute("role", "listbox");
    await expect(input).toHaveAttribute("role", "combobox");
    await expect(input).toHaveAttribute("aria-controls", listId!);
    await expect(input).toHaveAttribute("aria-autocomplete", "list");
    await expect(input).toHaveAttribute("aria-expanded", "true");
    await expect(input).not.toHaveAttribute("aria-activedescendant");

    // 每個項目為 option，各有唯一 id，尚未選中
    await expect(items).toHaveCount(3);
    for (const item of await items.all()) {
      await expect(item).toHaveAttribute("role", "option");
      await expect(item).toHaveAttribute("aria-selected", "false");
    }
    const ids = await items.evaluateAll((els) => els.map((el) => el.id));
    expect(new Set(ids.filter(Boolean)).size).toBe(3);

    // 分組以標題命名
    await page.locator("#trigger").click();
    const groups = palette.locator("[data-cu-command-group]");
    await expect(groups.nth(0)).toHaveAttribute("role", "group");
    await expect(groups.nth(0)).toHaveAccessibleName("Files");
    await expect(groups.nth(1)).toHaveAccessibleName("Settings");
    await expect(page.getByRole("listbox")).toBeVisible();
    await expect(page.getByRole("group", { name: "Files" })).toBeVisible();
    await expect(page.getByRole("combobox")).toBeFocused();
  });

  test("aria-activedescendant / aria-selected 跟隨選中項目（鍵盤、篩選、滑鼠）", async ({ page }) => {
    const palette = page.locator("#cmd");
    const input = palette.locator("[data-cu-command-input]");
    const active = palette.locator("[data-cu-command-item][data-cu-command-active]");
    const selected = palette.locator('[data-cu-command-item][aria-selected="true"]');
    const expectActive = async (text: string) => {
      await expect(active).toHaveText(text);
      await expect(selected).toHaveCount(1);
      await expect(selected).toHaveText(text);
      await expect(input).toHaveAttribute("aria-activedescendant", (await active.getAttribute("id"))!);
      await expect(page.getByRole("option", { name: text, selected: true })).toBeVisible();
    };
    await page.locator("#trigger").click();

    // 輸入後第一個結果成為選中項目
    await input.fill("file");
    await expectActive("New File");
    await input.press("ArrowDown");
    await expectActive("Open File");
    await input.press("Tab");
    await expectActive("New File");

    // 無結果：清除
    await input.fill("nothing-matches");
    await expect(selected).toHaveCount(0);
    await expect(input).not.toHaveAttribute("aria-activedescendant");

    // 滑鼠移入 / 移出
    await input.fill("");
    await expectActive("New File");
    await palette.locator("[data-cu-command-item]", { hasText: "Preferences" }).hover();
    await expectActive("Preferences");
    await input.hover();
    await expect(selected).toHaveCount(0);
    await expect(input).not.toHaveAttribute("aria-activedescendant");

    // Enter 仍執行選中項目
    await input.press("ArrowUp");
    await expectActive("Preferences");
    await input.press("Enter");
    expect(await page.evaluate(() => (window as any).__ran)).toBe("preferences");
  });

  test("點擊 backdrop 關閉", async ({ page }) => {
    const palette = page.locator("#cmd");
    await page.locator("#trigger").click();
    await expect(palette).toBeVisible();
    await page.mouse.click(5, 5);
    await expect(palette).toBeHidden();
  });
});
