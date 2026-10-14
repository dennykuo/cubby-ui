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

  test("動態項目：初始化後新增的項目立即有 ARIA，可篩選、鍵盤導航、滑鼠選中與執行", async ({ page }) => {
    const palette = page.locator("#cmd");
    const input = palette.locator("[data-cu-command-input]");
    const active = palette.locator("[data-cu-command-item][data-cu-command-active]");
    await page.locator("#trigger").click();

    await page.evaluate(() => {
      const group = document.querySelector("#cmd [data-cu-command-group]")!;
      const item = document.createElement("div");
      item.className = "cu-command-item";
      item.setAttribute("data-cu-command-item", "");
      item.setAttribute("data-cu-command-value", "save file");
      item.textContent = "Save File";
      item.addEventListener("click", () => ((window as any).__ran = "save file"));
      group.appendChild(item);
    });
    const added = palette.locator("[data-cu-command-item]", { hasText: "Save File" });
    await expect(added).toHaveAttribute("role", "option");
    await expect(added).toHaveAttribute("aria-selected", "false");
    expect(await added.getAttribute("id")).toBeTruthy();

    await input.fill("file");
    await expect(palette.locator("[data-cu-command-item]:visible")).toHaveText(["New File", "Open File", "Save File"]);
    await input.press("ArrowUp"); // 由第一項反向循環到最後一項（新項目）
    await expect(active).toHaveText("Save File");
    await expect(input).toHaveAttribute("aria-activedescendant", (await added.getAttribute("id"))!);
    await input.press("Enter");
    expect(await page.evaluate(() => (window as any).__ran)).toBe("save file");

    await input.fill("");
    await added.hover();
    await expect(active).toHaveText("Save File");
  });

  test("動態項目：查詢中加入的項目依查詢篩選並更新無結果提示；選中項目被移除時改選第一個可見項目", async ({ page }) => {
    const palette = page.locator("#cmd");
    const input = palette.locator("[data-cu-command-input]");
    const empty = palette.locator("[data-cu-command-empty]");
    const active = palette.locator("[data-cu-command-item][data-cu-command-active]");
    await page.locator("#trigger").click();

    await input.fill("deploy");
    await expect(empty).toBeVisible();
    // 模擬遠端搜尋：查詢期間陸續加入結果
    await page.evaluate(() => {
      const list = document.querySelector("#cmd [data-cu-command-list]")!;
      const group = document.createElement("div");
      group.className = "cu-command-group";
      group.setAttribute("data-cu-command-group", "");
      group.innerHTML =
        '<div class="cu-command-group-heading">Remote</div>' +
        '<div class="cu-command-item" data-cu-command-item>Deploy to staging</div>' +
        '<div class="cu-command-item" data-cu-command-item>Rollback</div>';
      list.insertBefore(group, list.querySelector("[data-cu-command-empty]"));
    });
    await expect(palette.locator("[data-cu-command-item]:visible")).toHaveText(["Deploy to staging"]);
    await expect(empty).toBeHidden();
    await expect(page.getByRole("group", { name: "Remote" })).toBeVisible();

    await input.fill("file");
    await expect(active).toHaveText("New File");
    await page.evaluate(() => document.querySelector("#cmd [data-cu-command-active]")!.remove());
    await expect(active).toHaveText("Open File");
    await expect(input).toHaveAttribute("aria-activedescendant", (await active.getAttribute("id"))!);
  });

  test("CubbyUI.refresh() 重新收集項目：既有元素之後才加上 data-cu-command-item 也會納入", async ({ page }) => {
    const palette = page.locator("#cmd");
    const input = palette.locator("[data-cu-command-input]");
    await page.evaluate(() => {
      const el = document.createElement("div");
      el.id = "late";
      el.className = "cu-command-item";
      el.textContent = "Toggle Theme";
      document.querySelector("#cmd [data-cu-command-group]")!.appendChild(el);
    });
    await expect(page.locator("#late")).not.toHaveAttribute("role", "option");

    await page.evaluate(() => {
      document.getElementById("late")!.setAttribute("data-cu-command-item", "");
      (window as any).CubbyUI.refresh();
    });
    await expect(page.locator("#late")).toHaveAttribute("role", "option");

    await page.locator("#trigger").click();
    await input.fill("theme");
    await expect(palette.locator("[data-cu-command-item]:visible")).toHaveText(["Toggle Theme"]);
    await input.fill("file");
    await expect(page.locator("#late")).toBeHidden();
  });

  test("點擊 backdrop 關閉", async ({ page }) => {
    const palette = page.locator("#cmd");
    await page.locator("#trigger").click();
    await expect(palette).toBeVisible();
    await page.mouse.click(5, 5);
    await expect(palette).toBeHidden();
  });
});
