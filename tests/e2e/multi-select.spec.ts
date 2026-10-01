import { test, expect, type Page } from "@playwright/test";
import { openFixture } from "./helpers";

declare const CubbyUI: any;

function multiSelect(page: Page, id: string) {
  const root = page.locator(`#${id}`);
  return {
    root,
    trigger: root.locator("[data-cu-multi-select-trigger]"),
    content: root.locator("[data-cu-multi-select-content]"),
    input: root.locator("[data-cu-multi-select-input]"),
    list: root.locator("[data-cu-multi-select-list]"),
    placeholder: root.locator("[data-cu-multi-select-placeholder]"),
    items: root.locator("[data-cu-multi-select-item]"),
    visibleItems: root.locator("[data-cu-multi-select-item]:not([hidden])"),
    item: (text: string) => root.locator("[data-cu-multi-select-item]", { hasText: text }),
    empty: root.locator("[data-cu-multi-select-empty]"),
    highlighted: root.locator(".cu-multi-select-item-highlight"),
    selected: root.locator('[data-cu-multi-select-item][aria-selected="true"]'),
    tags: root.locator(".cu-multi-select-tag"),
    removeBtn: (value: string) => root.locator(`.cu-multi-select-tag-remove[data-cu-remove='${value}']`),
    /** 各標籤的文字（不含移除按鈕的 ×） */
    tagLabels: () =>
      root.evaluate((el) =>
        Array.from(el.querySelectorAll(".cu-multi-select-tag")).map((t) => (t.firstChild?.textContent || "").trim()),
      ),
  };
}

const events = (page: Page) => page.evaluate(() => (window as any).__events);

test.describe("Multi Select", () => {
  test.beforeEach(async ({ page }) => {
    await openFixture(page, "multi-select");
  });

  test("初始 ARIA：trigger / listbox（可多選）/ option 角色與狀態", async ({ page }) => {
    const ms = multiSelect(page, "ms-frameworks");
    await expect(ms.trigger).toHaveAttribute("aria-haspopup", "listbox");
    await expect(ms.trigger).toHaveAttribute("aria-expanded", "false");
    await expect(ms.content).toBeHidden();
    await expect(ms.list).toHaveAttribute("role", "listbox");
    await expect(ms.list).toHaveAttribute("aria-multiselectable", "true");
    await expect(ms.items).toHaveCount(5);
    for (const item of await ms.items.all()) {
      await expect(item).toHaveAttribute("role", "option");
      await expect(item).toHaveAttribute("aria-selected", "false");
    }
    await expect(ms.placeholder).toBeVisible();
    await expect(ms.tags).toHaveCount(0);
  });

  test("點擊 trigger 開關面板；有搜尋框時焦點移到搜尋框", async ({ page }) => {
    const ms = multiSelect(page, "ms-members");
    await ms.trigger.click();
    await expect(ms.content).toBeVisible();
    await expect(ms.trigger).toHaveAttribute("aria-expanded", "true");
    await expect(ms.input).toBeFocused();

    await ms.trigger.click();
    await expect(ms.content).toBeHidden();
    await expect(ms.trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("多選：點擊項目切換選取，面板保持開啟，標籤依選取順序顯示並觸發 change 事件", async ({ page }) => {
    const ms = multiSelect(page, "ms-frameworks");
    await ms.trigger.click();

    await ms.item("Svelte").click();
    await ms.item("React").click();
    await expect(ms.content).toBeVisible();
    await expect(ms.trigger).toHaveAttribute("aria-expanded", "true");
    await expect.poll(ms.tagLabels).toEqual(["Svelte", "React"]);
    await expect(ms.placeholder).toBeHidden();
    await expect(ms.item("Svelte")).toHaveAttribute("aria-selected", "true");
    await expect(ms.item("Svelte")).toHaveClass(/cu-multi-select-item-active/);
    await expect(ms.selected).toHaveCount(2);

    // 再點一次取消選取
    await ms.item("Svelte").click();
    await expect.poll(ms.tagLabels).toEqual(["React"]);
    await expect(ms.item("Svelte")).toHaveAttribute("aria-selected", "false");
    await expect(ms.item("Svelte")).not.toHaveClass(/cu-multi-select-item-active/);

    expect(await events(page)).toEqual([
      { id: "ms-frameworks", selected: ["svelte"] },
      { id: "ms-frameworks", selected: ["svelte", "react"] },
      { id: "ms-frameworks", selected: ["react"] },
    ]);
  });

  test("點擊標籤的 × 移除選項，不影響面板開關狀態", async ({ page }) => {
    const ms = multiSelect(page, "ms-frameworks");
    await ms.trigger.click();
    await ms.item("Vue").click();
    await ms.item("Astro").click();

    // 面板開啟中：移除後仍保持開啟
    await ms.removeBtn("vue").click();
    await expect(ms.content).toBeVisible();
    await expect.poll(ms.tagLabels).toEqual(["Astro"]);
    await expect(ms.item("Vue")).toHaveAttribute("aria-selected", "false");

    // 面板關閉中：移除不會打開面板
    await page.click("#outside");
    await expect(ms.content).toBeHidden();
    await ms.removeBtn("astro").click();
    await expect(ms.content).toBeHidden();
    await expect(ms.trigger).toHaveAttribute("aria-expanded", "false");
    await expect(ms.tags).toHaveCount(0);
    await expect(ms.placeholder).toBeVisible();
    await expect(ms.selected).toHaveCount(0);

    expect((await events(page)).map((e: any) => e.selected)).toEqual([["vue"], ["vue", "astro"], ["astro"], []]);
  });

  test("鍵盤：方向鍵 / Home / End 循環，Enter 切換選取且面板保持開啟", async ({ page }) => {
    const ms = multiSelect(page, "ms-frameworks");
    await ms.trigger.focus();
    await page.keyboard.press("Enter");
    await expect(ms.content).toBeVisible();

    await page.keyboard.press("ArrowDown");
    await expect(ms.highlighted).toHaveText("React");
    await page.keyboard.press("ArrowUp");
    await expect(ms.highlighted).toHaveText("Astro");
    await page.keyboard.press("Home");
    await expect(ms.highlighted).toHaveText("React");
    await page.keyboard.press("End");
    await expect(ms.highlighted).toHaveText("Astro");
    await page.keyboard.press("ArrowDown");
    await expect(ms.highlighted).toHaveText("React");
    await page.keyboard.press("ArrowDown");
    await expect(ms.highlighted).toHaveText("Vue");
    await expect(ms.highlighted).toHaveCount(1);

    await page.keyboard.press("Enter");
    await expect(ms.content).toBeVisible();
    await expect(ms.item("Vue")).toHaveAttribute("aria-selected", "true");
    await expect.poll(ms.tagLabels).toEqual(["Vue"]);
    // 焦點仍在 trigger 上，Enter 不應同時觸發 trigger 而把面板關掉
    await expect(ms.trigger).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(ms.item("Vue")).toHaveAttribute("aria-selected", "false");
    await expect(ms.tags).toHaveCount(0);
    await expect(ms.content).toBeVisible();
  });

  test("鍵盤刪除：Tab 到標籤的移除按鈕按 Enter，焦點回到 trigger", async ({ page }) => {
    const ms = multiSelect(page, "ms-frameworks");
    await ms.trigger.click();
    await ms.item("React").click();
    await ms.item("Angular").click();
    await page.keyboard.press("Escape");
    await expect(ms.content).toBeHidden();

    await ms.trigger.focus();
    await page.keyboard.press("Tab");
    await expect(ms.removeBtn("react")).toBeFocused();
    await page.keyboard.press("Enter");
    await expect.poll(ms.tagLabels).toEqual(["Angular"]);
    await expect(ms.content).toBeHidden();
    await expect(ms.trigger).toBeFocused();

    await ms.removeBtn("angular").focus();
    await page.keyboard.press("Space");
    await expect(ms.tags).toHaveCount(0);
    await expect(ms.placeholder).toBeVisible();
    await expect(ms.trigger).toBeFocused();
  });

  test("輸入篩選（不分大小寫）、無結果狀態，篩選後鍵盤只在可見項目間移動", async ({ page }) => {
    const ms = multiSelect(page, "ms-members");
    await ms.trigger.click();

    await page.keyboard.press("ArrowDown");
    await expect(ms.highlighted).toHaveText("Alice");

    await ms.input.fill("E");
    await expect(ms.visibleItems).toHaveText(["Alice", "Charlie", "Eve"]);
    await ms.input.fill("ev");
    await expect(ms.visibleItems).toHaveText(["Eve"]);
    await expect(ms.empty).toBeHidden();

    // 已高亮的 Alice 被篩掉：Enter 不應選取看不見的項目
    await page.keyboard.press("Enter");
    await expect(ms.tags).toHaveCount(0);
    expect(await events(page)).toEqual([]);

    await page.keyboard.press("ArrowDown");
    await expect(ms.highlighted).toHaveCount(1);
    await expect(ms.highlighted).toHaveText("Eve");
    await page.keyboard.press("Enter");
    await expect.poll(ms.tagLabels).toEqual(["Eve"]);
    await expect(ms.content).toBeVisible();
    await expect(ms.input).toBeFocused();

    await ms.input.fill("zzz");
    await expect(ms.visibleItems).toHaveCount(0);
    await expect(ms.empty).toBeVisible();
    await ms.input.fill("");
    await expect(ms.visibleItems).toHaveCount(5);
    await expect(ms.empty).toBeHidden();
  });

  test("Escape 關閉面板、重設搜尋並保留已選項目，焦點回到 trigger", async ({ page }) => {
    const ms = multiSelect(page, "ms-members");
    await ms.trigger.click();
    await ms.item("Bob").click();
    await ms.input.fill("dia");
    await expect(ms.visibleItems).toHaveCount(1);

    await page.keyboard.press("Escape");
    await expect(ms.content).toBeHidden();
    await expect(ms.trigger).toHaveAttribute("aria-expanded", "false");
    await expect(ms.input).toHaveValue("");
    await expect(ms.visibleItems).toHaveCount(5);
    await expect(ms.trigger).toBeFocused();
    await expect.poll(ms.tagLabels).toEqual(["Bob"]);
  });

  test("外部點擊關閉面板並重設搜尋；面板內點擊不會關閉", async ({ page }) => {
    const ms = multiSelect(page, "ms-members");
    await ms.trigger.click();
    await ms.input.fill("zzz");
    await ms.empty.click();
    await expect(ms.content).toBeVisible();

    await page.click("#outside");
    await expect(ms.content).toBeHidden();
    await expect(ms.trigger).toHaveAttribute("aria-expanded", "false");
    await expect(ms.input).toHaveValue("");
    await ms.trigger.click();
    await expect(ms.visibleItems).toHaveCount(5);
    await expect(ms.empty).toBeHidden();
  });

  test("開啟另一個 Multi Select 時，先前開啟的會關閉", async ({ page }) => {
    const a = multiSelect(page, "ms-frameworks");
    const b = multiSelect(page, "ms-members");
    await a.trigger.click();
    await b.trigger.click();
    await expect(b.content).toBeVisible();
    await expect(a.content).toBeHidden();
    await expect(a.trigger).toHaveAttribute("aria-expanded", "false");

    await page.keyboard.press("ArrowDown");
    await expect(b.highlighted).toHaveText("Alice");
    await expect(a.highlighted).toHaveCount(0);
  });

  test("預設值：cu-multi-select-item-active 的項目在初始化時渲染為可移除的標籤", async ({ page }) => {
    const ms = multiSelect(page, "ms-preset");
    await expect.poll(ms.tagLabels).toEqual(["Bug", "Feature"]);
    await expect(ms.placeholder).toBeHidden();
    await expect(ms.selected).toHaveText(["Bug", "Feature"]);

    await ms.removeBtn("bug").click();
    await expect.poll(ms.tagLabels).toEqual(["Feature"]);
    await expect(ms.item("Bug")).toHaveAttribute("aria-selected", "false");
    expect(await events(page)).toEqual([{ id: "ms-preset", selected: ["feature"] }]);
  });

  test("值含引號等特殊字元時仍能選取與移除", async ({ page }) => {
    const ms = multiSelect(page, "ms-preset");
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await ms.trigger.click();
    await ms.item('12" Display').click();
    await expect.poll(ms.tagLabels).toEqual(["Bug", "Feature", '12" Display']);
    await ms.removeBtn('12" display').click();
    await expect.poll(ms.tagLabels).toEqual(["Bug", "Feature"]);
    await expect(ms.item('12" Display')).toHaveAttribute("aria-selected", "false");
    expect(errors).toEqual([]);
  });

  test("放在 <form> 內：開啟、選取、移除標籤都不會送出表單", async ({ page }) => {
    const ms = multiSelect(page, "ms-preset");
    await ms.trigger.click();
    await expect(ms.content).toBeVisible();
    await ms.item("Documentation").click();
    await ms.removeBtn("bug").click();
    await ms.removeBtn("docs").focus();
    await page.keyboard.press("Enter");
    await expect.poll(ms.tagLabels).toEqual(["Feature"]);
    await ms.trigger.click();
    await expect(ms.content).toBeHidden();
    expect(await page.evaluate(() => (window as any).__submits)).toBeUndefined();

    // 對照：真正的 submit 按鈕仍可送出
    await page.click("#submit");
    await expect.poll(() => page.evaluate(() => (window as any).__submits)).toBe(1);
  });

  test("重複呼叫 init() 不會重複綁定事件", async ({ page }) => {
    await page.evaluate(() => {
      CubbyUI.init();
      CubbyUI.init();
    });
    const ms = multiSelect(page, "ms-frameworks");
    await ms.trigger.click();
    await expect(ms.content).toBeVisible();
    await ms.item("React").click();
    await expect.poll(ms.tagLabels).toEqual(["React"]);
    expect(await events(page)).toHaveLength(1);
  });

  test.fixme("標籤移除按鈕有可辨識的無障礙名稱", async ({ page }) => {
    // 目前移除按鈕只有「×」文字，螢幕閱讀器會讀成 "times"。
    // 需要決定預設文案（英文 "Remove React"？）與 i18n 方式（例如 data 屬性自訂），交由維護者決定。
    const ms = multiSelect(page, "ms-preset");
    await expect(ms.removeBtn("bug")).toHaveAccessibleName(/remove.*bug/i);
  });
});
