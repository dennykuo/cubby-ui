import { test, expect, type Page } from "@playwright/test";
import { openFixture } from "./helpers";

declare const CubbyUI: any;

function menu(page: Page, id: string) {
  const root = page.locator(`#${id}`);
  const content = root.locator("[data-cu-context-menu-content]");
  return {
    root,
    area: root.locator(".area"),
    content,
    items: content.locator(".cu-dropdown-item"),
    item: (text: string) => content.locator(".cu-dropdown-item", { hasText: text }),
    highlighted: content.locator(".cu-dropdown-item-highlight"),
  };
}

const clicked = (page: Page) => page.evaluate(() => (window as any).__clicked);

/** 選單的 aria-activedescendant 指向目前高亮的項目 */
async function expectActive(m: ReturnType<typeof menu>, text: string) {
  await expect(m.highlighted).toHaveCount(1);
  await expect(m.highlighted).toHaveText(text);
  await expect(m.content).toHaveAttribute("aria-activedescendant", (await m.highlighted.getAttribute("id"))!);
}

test.describe("Context Menu", () => {
  test.beforeEach(async ({ page }) => {
    await openFixture(page, "context-menu");
  });

  test("ARIA：容器可聚焦，選單為 menu、項目為 menuitem、分隔線為 separator", async ({ page }) => {
    const docs = menu(page, "cm-docs");
    await expect(docs.root).toHaveAttribute("tabindex", "0");
    await expect(docs.content).toHaveAttribute("role", "menu");
    await expect(docs.content).toHaveAttribute("tabindex", "-1");
    for (const item of await docs.items.all()) await expect(item).toHaveAttribute("role", "menuitem");
    await expect(menu(page, "cm-buttons").content.locator(".cu-dropdown-separator")).toHaveAttribute("role", "separator");
    // 作者指定的 tabindex 保留
    await expect(page.locator("#cm-optout")).toHaveAttribute("tabindex", "-1");

    // Tab 可到達容器
    await page.locator("#before").focus();
    await page.keyboard.press("Tab");
    await expect(docs.root).toBeFocused();
  });

  test("Shift+F10 開啟：選單取得焦點、高亮第一個項目，位置在聚焦元素上", async ({ page }) => {
    const m = menu(page, "cm-docs");
    await m.root.focus();
    await page.keyboard.press("Shift+F10");
    await expect(m.content).toBeVisible();
    await expect(m.content).toBeFocused();
    await expectActive(m, "Cut");

    const [area, box] = await Promise.all([m.root.boundingBox(), m.content.boundingBox()]);
    expect(box!.x).toBeGreaterThanOrEqual(area!.x);
    expect(box!.x).toBeLessThan(area!.x + area!.width);
    expect(box!.y).toBeGreaterThanOrEqual(area!.y);
    expect(box!.y).toBeLessThan(area!.y + area!.height);
  });

  test("ContextMenu 鍵開啟", async ({ page }) => {
    const m = menu(page, "cm-buttons");
    await m.root.focus();
    await page.keyboard.press("ContextMenu");
    await expect(m.content).toBeVisible();
    await expect(m.content).toBeFocused();
    await expectActive(m, "Rename");
  });

  test("方向鍵循環、Home / End，略過停用項目，且不捲動頁面", async ({ page }) => {
    const m = menu(page, "cm-buttons");
    await m.root.focus();
    await page.keyboard.press("Shift+F10");
    await expectActive(m, "Rename");
    await page.keyboard.press("ArrowDown");
    await expectActive(m, "Delete"); // Archive 停用
    await page.keyboard.press("ArrowDown");
    await expectActive(m, "Rename");
    await page.keyboard.press("ArrowUp");
    await expectActive(m, "Delete");
    await page.keyboard.press("Home");
    await expectActive(m, "Rename");
    await page.keyboard.press("End");
    await expectActive(m, "Delete");
    // 捲動會關閉選單：方向鍵不可捲動頁面
    await expect(m.content).toBeVisible();
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });

  test("Enter 執行高亮項目（<div> 項目），關閉選單並把焦點還給容器", async ({ page }) => {
    const m = menu(page, "cm-docs");
    await m.root.focus();
    await page.keyboard.press("Shift+F10");
    await page.keyboard.press("ArrowDown");
    await expectActive(m, "Copy");
    await page.keyboard.press("Enter");
    expect(await clicked(page)).toEqual(["copy"]);
    await expect(m.content).toBeHidden();
    await expect(m.root).toBeFocused();
  });

  test("Space 執行 <button> 項目只觸發一次", async ({ page }) => {
    const m = menu(page, "cm-buttons");
    await m.root.focus();
    await page.keyboard.press("Shift+F10");
    await page.keyboard.press("End");
    await page.keyboard.press("Space");
    expect(await clicked(page)).toEqual(["delete"]);
    await expect(m.content).toBeHidden();
    await expect(m.root).toBeFocused();

    await page.keyboard.press("Shift+F10");
    await page.keyboard.press("Enter");
    expect(await clicked(page)).toEqual(["delete", "rename"]);
  });

  test("Escape / Tab 關閉並把焦點還給開啟前的元素", async ({ page }) => {
    const m = menu(page, "cm-docs");
    await m.root.focus();
    await page.keyboard.press("Shift+F10");
    await page.keyboard.press("Escape");
    await expect(m.content).toBeHidden();
    await expect(m.root).toBeFocused();
    await expect(m.content).not.toHaveAttribute("aria-activedescendant");

    await page.keyboard.press("Shift+F10");
    await expect(m.content).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(m.content).toBeHidden();
    await expect(m.root).toBeFocused();
    expect(await clicked(page)).toEqual([]);
  });

  test("容器內的可聚焦元素按 Shift+F10 也會開啟，關閉後焦點回到該元素", async ({ page }) => {
    const m = menu(page, "cm-optout");
    await page.locator("#row").focus();
    await page.keyboard.press("Shift+F10");
    await expect(m.content).toBeVisible();
    await expectActive(m, "Open");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    expect(await clicked(page)).toEqual(["share"]);
    await expect(page.locator("#row")).toBeFocused();
  });

  test("滑鼠右鍵：開在游標處、選單取得焦點但不預先高亮；方向鍵可接手，hover 帶動高亮", async ({ page }) => {
    const m = menu(page, "cm-docs");
    const area = (await m.area.boundingBox())!;
    await page.mouse.click(area.x + 40, area.y + 30, { button: "right" });
    await expect(m.content).toBeVisible();
    // 以 style 比對（boundingBox 會受 cu-float-in 開啟動畫的位移影響）
    const pos = await m.content.evaluate((el) => [parseFloat(el.style.left), parseFloat(el.style.top)]);
    expect(pos).toEqual([area.x + 40, area.y + 30]);
    await expect(m.content).toBeFocused();
    await expect(m.highlighted).toHaveCount(0);

    await page.keyboard.press("ArrowDown");
    await expectActive(m, "Cut");
    await m.item("Paste").hover();
    await expectActive(m, "Paste");
    await page.keyboard.press("ArrowUp");
    await expectActive(m, "Copy");

    await m.item("Cut").click();
    expect(await clicked(page)).toEqual(["cut"]);
    await expect(m.content).toBeHidden();
  });

  test("開啟另一個右鍵選單時關閉先前的；外部點擊關閉", async ({ page }) => {
    const a = menu(page, "cm-docs");
    const b = menu(page, "cm-buttons");
    await a.root.focus();
    await page.keyboard.press("Shift+F10");
    await expect(a.content).toBeVisible();
    await b.area.click({ button: "right" });
    await expect(a.content).toBeHidden();
    await expect(b.content).toBeVisible();
    await expect(b.content).toBeFocused();

    await page.locator("#outside").click();
    await expect(b.content).toBeHidden();
    await expect(page.locator("#outside")).toBeFocused();
  });

  test("destroy() 後再 init()：鍵盤開啟與關閉仍可用", async ({ page }) => {
    await page.evaluate(() => {
      CubbyUI.destroy();
      CubbyUI.init();
      CubbyUI.init();
    });
    const m = menu(page, "cm-docs");
    await m.root.focus();
    await page.keyboard.press("Shift+F10");
    await expectActive(m, "Cut");
    await page.keyboard.press("Escape");
    await expect(m.content).toBeHidden();
    await expect(m.root).toBeFocused();
  });
});
