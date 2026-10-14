import { test, expect, type Page } from "@playwright/test";
import { openFixture } from "./helpers";

declare const CubbyUI: any;

function multiSelect(page: Page, id: string) {
  const root = page.locator(`#${id}`);
  return {
    root,
    control: root.locator(".cu-multi-select-control"),
    tagsEl: root.locator("[data-cu-multi-select-tags]"),
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

  test("鍵盤刪除：移除按鈕在 trigger 之前的 Tab 順序；移除後焦點移到下一個標籤，最後一個之後為 trigger", async ({ page }) => {
    const ms = multiSelect(page, "ms-frameworks");
    await ms.trigger.click();
    await ms.item("React").click();
    await ms.item("Vue").click();
    await ms.item("Angular").click();
    await page.keyboard.press("Escape");
    await expect(ms.content).toBeHidden();

    // Tab 順序與視覺順序一致：標籤（移除按鈕）在前、trigger 在後
    await ms.trigger.focus();
    await page.keyboard.press("Shift+Tab");
    await expect(ms.removeBtn("angular")).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Shift+Tab");
    await expect(ms.removeBtn("react")).toBeFocused();

    await page.keyboard.press("Enter");
    await expect.poll(ms.tagLabels).toEqual(["Vue", "Angular"]);
    await expect(ms.content).toBeHidden();
    await expect(ms.removeBtn("vue")).toBeFocused();

    await ms.removeBtn("angular").focus();
    await page.keyboard.press("Space");
    await expect.poll(ms.tagLabels).toEqual(["Vue"]);
    await expect(ms.trigger).toBeFocused();

    await page.keyboard.press("Shift+Tab");
    await expect(ms.removeBtn("vue")).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(ms.tags).toHaveCount(0);
    await expect(ms.placeholder).toBeVisible();
    await expect(ms.trigger).toBeFocused();
    expect((await events(page)).map((e: any) => e.selected).slice(-3)).toEqual([["vue", "angular"], ["vue"], []]);
  });

  test("結構：標籤與移除按鈕在 trigger 之外（不是巢狀互動元素），移除按鈕為 type=\"button\"", async ({ page }) => {
    const ms = multiSelect(page, "ms-preset");
    await expect.poll(ms.tagLabels).toEqual(["Bug", "Feature"]);
    // trigger 內沒有任何互動元素；標籤容器是 trigger 的兄弟、包在 control 內
    await expect(ms.trigger.locator("button, [tabindex]")).toHaveCount(0);
    await expect(ms.control.locator(":scope > [data-cu-multi-select-tags] + [data-cu-multi-select-trigger]")).toHaveCount(1);
    for (const btn of await ms.root.locator(".cu-multi-select-tag-remove").all()) {
      await expect(btn).toHaveAttribute("type", "button");
    }
    // 沒有寫 type 的 trigger 由 JS 補上
    await expect(ms.trigger).toHaveAttribute("type", "button");
    // 沒有標籤時標籤容器不佔空間
    await expect(multiSelect(page, "ms-frameworks").tagsEl).toBeHidden();
  });

  test("舊版結構（標籤容器在 trigger 內）初始化時轉為 control 結構，外觀與互動相同", async ({ page }) => {
    const ms = multiSelect(page, "ms-legacy");
    await expect(ms.control).toHaveCount(1);
    await expect(ms.trigger.locator("[data-cu-multi-select-tags]")).toHaveCount(0);
    await expect(ms.control.locator(":scope > [data-cu-multi-select-tags] + [data-cu-multi-select-trigger]")).toHaveCount(1);
    await expect(ms.trigger.locator("[data-cu-multi-select-placeholder]")).toHaveCount(1);
    await expect.poll(ms.tagLabels).toEqual(["Red"]);
    await expect(ms.trigger.locator("button")).toHaveCount(0);

    // 外框由 control 繪製，trigger 本身無邊框
    const border = (l: typeof ms.control) => l.evaluate((el) => getComputedStyle(el).borderTopWidth);
    expect(await border(ms.control)).toBe("1px");
    expect(await border(ms.trigger)).toBe("0px");

    await ms.trigger.click();
    await ms.item("Blue").click();
    await expect.poll(ms.tagLabels).toEqual(["Red", "Blue"]);
    await ms.removeBtn("red").click();
    await expect.poll(ms.tagLabels).toEqual(["Blue"]);
  });

  test("點擊 control 的空白處（標籤之間 / padding）開啟面板並聚焦 trigger；點標籤文字也會開啟", async ({ page }) => {
    const ms = multiSelect(page, "ms-preset");
    const box = (await ms.control.boundingBox())!;
    await page.mouse.click(box.x + 3, box.y + box.height / 2); // 左側 padding
    await expect(ms.content).toBeVisible();
    await expect(ms.trigger).toBeFocused();
    await expect(ms.trigger).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Escape");
    await expect(ms.content).toBeHidden();
    await ms.tags.first().click({ position: { x: 4, y: 4 } });
    await expect(ms.content).toBeVisible();
    // 有搜尋框時焦點移到搜尋框
    const members = multiSelect(page, "ms-members");
    const mbox = (await members.control.boundingBox())!;
    await page.mouse.click(mbox.x + 3, mbox.y + mbox.height / 2);
    await expect(members.content).toBeVisible();
    await expect(members.input).toBeFocused();
  });

  test("trigger 的無障礙名稱：標籤隱藏 placeholder 後仍以其文字命名；<label for> 優先", async ({ page }) => {
    const ms = multiSelect(page, "ms-members");
    await expect(ms.trigger).toHaveAccessibleName("Select members...");
    await ms.trigger.click();
    await ms.item("Bob").click();
    await expect(ms.placeholder).toBeHidden();
    await expect(ms.trigger).toHaveAccessibleName("Select members...");

    const labelled = multiSelect(page, "ms-labelled");
    await expect(labelled.trigger).not.toHaveAttribute("aria-labelledby");
    await expect(labelled.trigger).toHaveAccessibleName("Technologies");
  });

  test("鍵盤焦點可見：trigger focus-visible 時 control 顯示焦點環，移除按鈕也有焦點環", async ({ page }) => {
    const ms = multiSelect(page, "ms-preset");
    const ring = (l: typeof ms.control) => l.evaluate((el) => getComputedStyle(el).boxShadow);
    const before = await ring(ms.control);
    await ms.removeBtn("feature").focus();
    await page.keyboard.press("Tab");
    await expect(ms.trigger).toBeFocused();
    await expect.poll(() => ring(ms.control)).not.toBe(before);

    await page.keyboard.press("Shift+Tab");
    await expect(ms.removeBtn("feature")).toBeFocused();
    expect(await ring(ms.removeBtn("feature"))).not.toBe("none");
    await expect.poll(() => ring(ms.control)).toBe(before);
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

  test("標籤移除按鈕有可辨識的無障礙名稱，可用 data-cu-multi-select-remove-text 自訂", async ({ page }) => {
    // 預設英文 "Remove {label}"：只有「×」時螢幕閱讀器會讀成 "times"
    const ms = multiSelect(page, "ms-preset");
    await expect(ms.removeBtn("bug")).toHaveAccessibleName("Remove Bug");
    await expect(ms.removeBtn("feature")).toHaveAccessibleName("Remove Feature");
    await ms.trigger.click();
    await ms.item('12" Display').click();
    await expect(ms.removeBtn('12" display')).toHaveAccessibleName('Remove 12" Display');

    // 自訂模板：{label} 替換為項目文字
    const zh = multiSelect(page, "ms-members");
    await zh.trigger.click();
    await zh.item("Bob").click();
    await expect(zh.removeBtn("bob")).toHaveAccessibleName("移除 Bob");
    // 視覺上仍是「×」
    await expect(zh.removeBtn("bob")).toHaveText("×");
  });

  test("APG select-only combobox：沒有搜尋框時 trigger 為 combobox，以 aria-activedescendant 指向高亮項目", async ({ page }) => {
    const ms = multiSelect(page, "ms-frameworks");
    const listId = await ms.list.getAttribute("id");
    expect(listId).toBeTruthy();
    // role="button" 不支援 aria-activedescendant，trigger 改為 combobox（保留 aria-haspopup / aria-expanded）
    await expect(ms.trigger).toHaveAttribute("role", "combobox");
    await expect(ms.trigger).toHaveAttribute("aria-controls", listId!);
    await expect(ms.trigger).toHaveAttribute("aria-haspopup", "listbox");
    await expect(ms.trigger).not.toHaveAttribute("aria-activedescendant");

    await ms.trigger.focus();
    await page.keyboard.press("Enter");
    await expect(ms.content).toBeVisible();
    await page.keyboard.press("ArrowDown");
    await expect(ms.highlighted).toHaveText("React");
    const react = await ms.highlighted.getAttribute("id");
    expect(react).toBeTruthy();
    await expect(ms.trigger).toHaveAttribute("aria-activedescendant", react!);
    await page.keyboard.press("End");
    await expect(ms.trigger).toHaveAttribute("aria-activedescendant", (await ms.item("Astro").getAttribute("id"))!);
    await expect(ms.trigger).toBeFocused();

    // 關閉後清除；重新開啟時保留的高亮再次對應
    await page.keyboard.press("Escape");
    await expect(ms.content).toBeHidden();
    await expect(ms.trigger).not.toHaveAttribute("aria-activedescendant");
    await page.keyboard.press("Enter");
    await expect(ms.content).toBeVisible();
    await expect(ms.trigger).toHaveAttribute("aria-activedescendant", (await ms.item("Astro").getAttribute("id"))!);
  });

  test("APG combobox：有搜尋框時由搜尋框持有 aria-activedescendant", async ({ page }) => {
    const ms = multiSelect(page, "ms-members");
    const listId = await ms.list.getAttribute("id");
    await expect(ms.input).toHaveAttribute("role", "combobox");
    await expect(ms.input).toHaveAttribute("aria-controls", listId!);
    await expect(ms.input).toHaveAttribute("aria-autocomplete", "list");
    await expect(ms.input).toHaveAttribute("aria-expanded", "true");
    await expect(ms.trigger).not.toHaveAttribute("role");

    await ms.trigger.click();
    await page.keyboard.press("ArrowDown");
    await expect(ms.input).toHaveAttribute("aria-activedescendant", (await ms.item("Alice").getAttribute("id"))!);
    await expect(ms.trigger).not.toHaveAttribute("aria-activedescendant");
    await ms.input.fill("ev");
    await expect(ms.input).not.toHaveAttribute("aria-activedescendant");
  });
});
