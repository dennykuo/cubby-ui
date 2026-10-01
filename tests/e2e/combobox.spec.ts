import { test, expect, type Page } from "@playwright/test";
import { openFixture } from "./helpers";

declare const CubbyUI: any;

function combobox(page: Page, id: string) {
  const root = page.locator(`#${id}`);
  return {
    root,
    trigger: root.locator("[data-cu-combobox-trigger]"),
    value: root.locator("[data-cu-combobox-value]"),
    content: root.locator("[data-cu-combobox-content]"),
    input: root.locator("[data-cu-combobox-input]"),
    list: root.locator("[data-cu-combobox-list]"),
    items: root.locator("[data-cu-combobox-item]"),
    visibleItems: root.locator("[data-cu-combobox-item]:not([hidden])"),
    item: (text: string) => root.locator("[data-cu-combobox-item]", { hasText: text }),
    empty: root.locator("[data-cu-combobox-empty]"),
    highlighted: root.locator(".cu-combobox-item-highlight"),
    selected: root.locator('[data-cu-combobox-item][aria-selected="true"]'),
  };
}

const events = (page: Page) => page.evaluate(() => (window as any).__events);

test.describe("Combobox", () => {
  test.beforeEach(async ({ page }) => {
    await openFixture(page, "combobox");
  });

  test("初始 ARIA：trigger / listbox / option 角色與狀態", async ({ page }) => {
    const cb = combobox(page, "cb-framework");
    await expect(cb.trigger).toHaveAttribute("aria-haspopup", "listbox");
    await expect(cb.trigger).toHaveAttribute("aria-expanded", "false");
    await expect(cb.content).toBeHidden();
    await expect(cb.list).toHaveAttribute("role", "listbox");
    await expect(cb.items).toHaveCount(5);
    for (const item of await cb.items.all()) {
      await expect(item).toHaveAttribute("role", "option");
      await expect(item).toHaveAttribute("aria-selected", "false");
    }

    // 預先帶 cu-combobox-item-active 的項目應標記為已選取
    const pre = combobox(page, "cb-disabled");
    await expect(pre.selected).toHaveCount(1);
    await expect(pre.selected).toHaveText("Vue");
  });

  test("點擊 trigger 開關面板，開啟時焦點移到搜尋框", async ({ page }) => {
    const cb = combobox(page, "cb-framework");

    await cb.trigger.click();
    await expect(cb.content).toBeVisible();
    await expect(cb.trigger).toHaveAttribute("aria-expanded", "true");
    await expect(cb.input).toBeFocused();
    await expect(cb.empty).toBeHidden();

    await cb.trigger.click();
    await expect(cb.content).toBeHidden();
    await expect(cb.trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("鍵盤開啟：在 trigger 上按 Enter / Space", async ({ page }) => {
    const cb = combobox(page, "cb-framework");

    await cb.trigger.focus();
    await page.keyboard.press("Enter");
    await expect(cb.content).toBeVisible();
    await expect(cb.input).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(cb.content).toBeHidden();

    await cb.trigger.focus();
    await page.keyboard.press("Space");
    await expect(cb.content).toBeVisible();
    await expect(cb.trigger).toHaveAttribute("aria-expanded", "true");
  });

  test("點擊選項：更新顯示值、ARIA 與 change 事件，關閉後焦點回到 trigger", async ({ page }) => {
    const cb = combobox(page, "cb-framework");

    await cb.trigger.click();
    await cb.item("SvelteKit").click();

    await expect(cb.content).toBeHidden();
    await expect(cb.trigger).toHaveAttribute("aria-expanded", "false");
    await expect(cb.value).toHaveText("SvelteKit");
    await expect(cb.value).not.toHaveClass(/cu-combobox-trigger-placeholder/);
    await expect(cb.item("SvelteKit")).toHaveAttribute("aria-selected", "true");
    await expect(cb.item("SvelteKit")).toHaveClass(/cu-combobox-item-active/);
    await expect(cb.trigger).toBeFocused();
    expect(await events(page)).toEqual([{ id: "cb-framework", value: "svelte", item: "SvelteKit" }]);

    // 改選另一項：舊項目取消選取，任一時刻只有一個已選取項目
    await cb.trigger.click();
    await cb.item("Astro").click();
    await expect(cb.value).toHaveText("Astro");
    await expect(cb.selected).toHaveCount(1);
    await expect(cb.selected).toHaveText("Astro");
    await expect(cb.root.locator(".cu-combobox-item-active")).toHaveCount(1);
    await expect(cb.item("SvelteKit")).toHaveAttribute("aria-selected", "false");
    expect((await events(page)).map((e: any) => e.value)).toEqual(["svelte", "astro"]);
  });

  test("沒有 data-cu-value 時，change 事件以項目文字作為值", async ({ page }) => {
    const cb = combobox(page, "cb-form");
    await cb.trigger.click();
    await cb.item("Option 2").click();
    await expect(cb.value).toHaveText("Option 2");
    expect(await events(page)).toEqual([{ id: "cb-form", value: "Option 2", item: "Option 2" }]);
  });

  test("輸入篩選（不分大小寫）、無結果狀態與清除", async ({ page }) => {
    const cb = combobox(page, "cb-framework");
    await cb.trigger.click();

    await cb.input.fill("NU");
    await expect(cb.visibleItems).toHaveCount(1);
    await expect(cb.visibleItems).toHaveText("Nuxt.js");
    await expect(cb.empty).toBeHidden();

    await cb.input.fill(".js");
    await expect(cb.visibleItems).toHaveText(["Next.js", "Nuxt.js"]);

    await cb.input.fill("zzz");
    await expect(cb.visibleItems).toHaveCount(0);
    await expect(cb.empty).toBeVisible();

    await cb.input.fill("");
    await expect(cb.visibleItems).toHaveCount(5);
    await expect(cb.empty).toBeHidden();
  });

  test("鍵盤導航：方向鍵 / Home / End 循環並略過停用項目，Enter 選取", async ({ page }) => {
    const cb = combobox(page, "cb-disabled");
    await cb.trigger.click();
    await expect(cb.input).toBeFocused();

    await page.keyboard.press("ArrowDown");
    await expect(cb.highlighted).toHaveText("React");
    await page.keyboard.press("ArrowDown");
    await expect(cb.highlighted).toHaveText("Vue");
    // Angular 為停用項目（aria-disabled + pointer-events-none），應被略過
    await page.keyboard.press("ArrowDown");
    await expect(cb.highlighted).toHaveText("Svelte");
    await page.keyboard.press("ArrowDown");
    await expect(cb.highlighted).toHaveText("React");
    await page.keyboard.press("ArrowUp");
    await expect(cb.highlighted).toHaveText("Svelte");
    await page.keyboard.press("Home");
    await expect(cb.highlighted).toHaveText("React");
    await page.keyboard.press("End");
    await expect(cb.highlighted).toHaveText("Svelte");
    await expect(cb.highlighted).toHaveCount(1);
    // 方向鍵不應移動搜尋框游標以外的焦點
    await expect(cb.input).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(cb.content).toBeHidden();
    await expect(cb.value).toHaveText("Svelte");
    await expect(cb.selected).toHaveText("Svelte");
    await expect(cb.trigger).toBeFocused();
    expect((await events(page)).map((e: any) => e.value)).toEqual(["svelte"]);
  });

  test("篩選後鍵盤導航只在可見項目間移動，Enter 不會選到被篩掉的項目", async ({ page }) => {
    const cb = combobox(page, "cb-framework");
    await cb.trigger.click();

    await page.keyboard.press("ArrowDown");
    await expect(cb.highlighted).toHaveText("Next.js");

    // 已高亮的 Next.js 被篩掉：Enter 不應選取看不見的項目
    await cb.input.fill("astro");
    await expect(cb.visibleItems).toHaveText(["Astro"]);
    await page.keyboard.press("Enter");
    await expect(cb.content).toBeVisible();
    await expect(cb.value).toHaveText("Select framework...");
    expect(await events(page)).toEqual([]);

    // 方向鍵只在可見項目間移動，且畫面上只有一個高亮項目
    await page.keyboard.press("ArrowDown");
    await expect(cb.highlighted).toHaveCount(1);
    await expect(cb.highlighted).toHaveText("Astro");
    await page.keyboard.press("ArrowDown");
    await expect(cb.highlighted).toHaveText("Astro");

    await page.keyboard.press("Enter");
    await expect(cb.value).toHaveText("Astro");
    expect((await events(page)).map((e: any) => e.value)).toEqual(["astro"]);
  });

  test("Escape 關閉面板、重設搜尋，焦點回到 trigger", async ({ page }) => {
    const cb = combobox(page, "cb-framework");
    await cb.trigger.click();
    await cb.input.fill("re");
    await expect(cb.visibleItems).toHaveCount(1);

    await page.keyboard.press("Escape");
    await expect(cb.content).toBeHidden();
    await expect(cb.trigger).toHaveAttribute("aria-expanded", "false");
    await expect(cb.input).toHaveValue("");
    await expect(cb.items).toHaveCount(5);
    await expect(cb.visibleItems).toHaveCount(5);
    await expect(cb.trigger).toBeFocused();
    // Escape 不應改變已選值
    await expect(cb.value).toHaveText("Select framework...");
  });

  test("外部點擊關閉面板並重設搜尋", async ({ page }) => {
    const cb = combobox(page, "cb-framework");
    await cb.trigger.click();
    await cb.input.fill("zzz");
    await expect(cb.empty).toBeVisible();

    await page.click("#outside");
    await expect(cb.content).toBeHidden();
    await expect(cb.trigger).toHaveAttribute("aria-expanded", "false");
    await expect(cb.input).toHaveValue("");

    await cb.trigger.click();
    await expect(cb.visibleItems).toHaveCount(5);
    await expect(cb.empty).toBeHidden();
  });

  test("點擊面板內部（搜尋框、空白處）不會關閉", async ({ page }) => {
    const cb = combobox(page, "cb-framework");
    await cb.trigger.click();
    await cb.input.click();
    await cb.content.click({ position: { x: 4, y: 4 } });
    await expect(cb.content).toBeVisible();
    await expect(cb.trigger).toHaveAttribute("aria-expanded", "true");
  });

  test("開啟另一個 Combobox 時，先前開啟的會關閉，鍵盤只作用於目前的面板", async ({ page }) => {
    const a = combobox(page, "cb-framework");
    const b = combobox(page, "cb-disabled");

    await a.trigger.click();
    await expect(a.content).toBeVisible();
    await b.trigger.click();
    await expect(b.content).toBeVisible();
    await expect(a.content).toBeHidden();
    await expect(a.trigger).toHaveAttribute("aria-expanded", "false");

    await page.keyboard.press("ArrowDown");
    await expect(b.highlighted).toHaveText("React");
    await expect(a.highlighted).toHaveCount(0);
  });

  test("放在 <form> 內：開啟與選取都不會送出表單", async ({ page }) => {
    const cb = combobox(page, "cb-form");
    await cb.trigger.click();
    await expect(cb.content).toBeVisible();
    await cb.item("Option 1").click();
    await expect(cb.value).toHaveText("Option 1");

    await cb.trigger.focus();
    await page.keyboard.press("Enter");
    await expect(cb.content).toBeVisible();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(cb.content).toBeHidden();

    // 對照：真正的 submit 按鈕仍可送出
    await page.click("#submit");
    await expect.poll(() => page.evaluate(() => (window as any).__submits)).toBe(1);
  });

  test("重複呼叫 init() 不會重複綁定事件", async ({ page }) => {
    await page.evaluate(() => {
      CubbyUI.init();
      CubbyUI.init();
    });
    const cb = combobox(page, "cb-framework");
    await cb.trigger.click();
    await expect(cb.content).toBeVisible();
    await cb.item("Remix").click();
    await expect(cb.value).toHaveText("Remix");
    expect(await events(page)).toHaveLength(1);
  });

  test.fixme("高亮項目以 aria-activedescendant 告知輔助技術", async ({ page }) => {
    // 目前鍵盤高亮只靠 .cu-combobox-item-highlight 視覺 class，螢幕閱讀器無從得知目前項目。
    // 補上需為每個 option 產生 id，並在搜尋框（或 trigger）設定 aria-activedescendant / aria-controls，
    // 屬於 ARIA 規格擴充，交由維護者決定是否納入。
    const cb = combobox(page, "cb-framework");
    await cb.trigger.click();
    await page.keyboard.press("ArrowDown");
    const id = await cb.highlighted.getAttribute("id");
    expect(id).toBeTruthy();
    await expect(cb.input).toHaveAttribute("aria-activedescendant", id!);
  });
});
