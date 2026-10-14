import { test, expect, type Locator, type Page } from "@playwright/test";
import { openFixture } from "./helpers";

declare const CubbyUI: any;

const changes = (page: Page) => page.evaluate(() => (window as any).__changes as Array<[string, number]>);

/** 目前的值、勾選的星與唯一的 Tab 停駐點三者一致 */
async function expectValue(root: Locator, value: number) {
  await expect(root).toHaveAttribute("data-cu-rating-value", String(value));
  const stars = root.locator("[data-cu-rating-star]");
  const n = await stars.count();
  for (let i = 0; i < n; i++) {
    const star = stars.nth(i);
    await expect(star).toHaveAttribute("aria-checked", i + 1 === value ? "true" : "false");
    await expect(star).toHaveAttribute("tabindex", i + 1 === (value || 1) ? "0" : "-1");
  }
  await expect(root.locator(".cu-rating-item-active")).toHaveCount(value);
}

test.describe("Rating", () => {
  test.beforeEach(async ({ page }) => {
    await openFixture(page, "rating");
  });

  test("radiogroup / radio 角色、預設名稱與 roving tabindex", async ({ page }) => {
    const group = page.locator("#basic");
    await expect(group).toHaveRole("radiogroup");
    await expect(group).toHaveAccessibleName("Rating");
    await expect(group.getByRole("radio")).toHaveCount(5);
    await expect(group.getByRole("radio", { name: "1 star", exact: true })).toHaveAttribute("aria-checked", "false");
    await expect(group.getByRole("radio", { name: "3 stars" })).toHaveAttribute("aria-checked", "false");
    // 未選取時 Tab 停在第一顆
    await expectValue(group, 0);
    // 表單內沒有 type 的 <button> 星星被補上 type="button"
    await expect(group.locator("button:not([type='button'])")).toHaveCount(0);
  });

  test("自訂群組名稱、data-cu-rating-star-text 模板與自帶 aria-label", async ({ page }) => {
    const group = page.getByRole("radiogroup", { name: "Rate this product" });
    await expect(group.getByRole("radio", { name: "1 顆星" })).toHaveCount(1);
    await expect(group.getByRole("radio", { name: "3 顆星", checked: true })).toHaveCount(1);
    await expect(group.getByRole("radio", { name: "Excellent" })).toHaveAttribute("data-cu-rating-star", "5");
    await expectValue(group, 3);

    await expect(page.getByRole("radiogroup", { name: "Service" })).toHaveAttribute("id", "spans");
  });

  test("鍵盤：Tab 只停一顆星，方向鍵移動並選取（頭尾循環），Home / End、Space / Enter", async ({ page }) => {
    const root = page.locator("#basic");
    const stars = root.locator("[data-cu-rating-star]");

    await page.locator("#before").focus();
    await page.keyboard.press("Tab");
    await expect(stars.nth(0)).toBeFocused();
    expect(await changes(page)).toEqual([]);

    await page.keyboard.press("Space");
    await expectValue(root, 1);
    await page.keyboard.press("ArrowRight");
    await expect(stars.nth(1)).toBeFocused();
    await expectValue(root, 2);
    await page.keyboard.press("ArrowDown");
    await expectValue(root, 3);
    await page.keyboard.press("ArrowLeft");
    await expectValue(root, 2);
    await page.keyboard.press("ArrowUp");
    await expectValue(root, 1);
    await page.keyboard.press("ArrowUp"); // 第一顆往前 → 最後一顆
    await expect(stars.nth(4)).toBeFocused();
    await expectValue(root, 5);
    await page.keyboard.press("ArrowRight"); // 最後一顆往後 → 第一顆
    await expectValue(root, 1);
    await page.keyboard.press("End");
    await expect(stars.nth(4)).toBeFocused();
    await expectValue(root, 5);
    await page.keyboard.press("Home");
    await expect(stars.nth(0)).toBeFocused();
    await expectValue(root, 1);
    await page.keyboard.press("Control+ArrowRight"); // 帶修飾鍵不處理
    await expectValue(root, 1);

    await stars.nth(3).focus();
    await page.keyboard.press("Enter");
    await expectValue(root, 4);
    await page.keyboard.press("Enter"); // 值沒變不重複派發
    expect(await changes(page)).toEqual([
      ["basic", 1],
      ["basic", 2],
      ["basic", 3],
      ["basic", 2],
      ["basic", 1],
      ["basic", 5],
      ["basic", 1],
      ["basic", 5],
      ["basic", 1],
      ["basic", 4],
    ]);

    // 離開群組再回來：Tab 停在下一個群組選取的星，Shift+Tab 回到這裡選取的星
    await page.keyboard.press("Tab");
    await expect(page.locator("#preset [data-cu-rating-star='3']")).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(stars.nth(3)).toBeFocused();
    expect(await page.evaluate(() => (window as any).__submits)).toBe(0);
  });

  test("點擊選取、滑鼠預覽，放在 <form> 內不送出", async ({ page }) => {
    const root = page.locator("#basic");
    const stars = root.locator("[data-cu-rating-star]");

    await stars.nth(3).click();
    await expectValue(root, 4);
    await stars.nth(3).click(); // 同一顆不重複派發
    expect(await changes(page)).toEqual([["basic", 4]]);

    await stars.nth(4).hover();
    await expect(root.locator(".cu-rating-item-active")).toHaveCount(5);
    await expect(stars.nth(4)).toHaveAttribute("aria-checked", "false"); // 預覽不改變語意
    await page.mouse.move(0, 0);
    await expect(root.locator(".cu-rating-item-active")).toHaveCount(4);

    expect(await page.evaluate(() => (window as any).__submits)).toBe(0);
  });

  test("<span> 星星同樣可用鍵盤操作", async ({ page }) => {
    const root = page.locator("#spans");
    await expectValue(root, 2);
    await root.locator("[data-cu-rating-star='2']").focus();
    await page.keyboard.press("ArrowRight");
    await expect(root.locator("[data-cu-rating-star='3']")).toBeFocused();
    await expectValue(root, 3);
    expect(await changes(page)).toEqual([["spans", 3]]);
  });

  test("RTL：左右方向鍵對調", async ({ page }) => {
    const root = page.locator("#rtl");
    await root.locator("[data-cu-rating-star='2']").focus();
    await page.keyboard.press("ArrowLeft");
    await expectValue(root, 3);
    await page.keyboard.press("ArrowRight");
    await expectValue(root, 2);
  });

  test("唯讀：aria-readonly、保留一個 Tab 停駐點，點擊與按鍵都不改變值", async ({ page }) => {
    const root = page.locator("#readonly");
    await expect(root).toHaveAttribute("role", "radiogroup");
    await expect(root).toHaveAttribute("aria-readonly", "true");
    const stars = root.locator("[data-cu-rating-star]");
    await expect(stars.nth(3)).toHaveAttribute("aria-checked", "true");
    await expect(stars.nth(3)).toHaveAttribute("tabindex", "0");
    await expect(root.locator('[tabindex="0"]')).toHaveCount(1);

    await stars.nth(4).click({ force: true });
    await stars.nth(3).focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");
    await expect(root).toHaveAttribute("data-cu-rating-value", "4");
    await expect(root.locator(".cu-rating-item-active")).toHaveCount(4);
    expect(await changes(page)).toEqual([]);
  });

  test("停用：aria-disabled，星星不在 Tab 順序中", async ({ page }) => {
    const root = page.locator("#disabled");
    await expect(root).toHaveAttribute("aria-disabled", "true");
    await expect(root.locator('[tabindex="0"]')).toHaveCount(0);
    await expect(root.locator('[data-cu-rating-star="2"]')).toHaveAttribute("aria-checked", "true");

    await page.locator("#readonly [data-cu-rating-star='4']").focus();
    await page.keyboard.press("Tab"); // 跳過停用的評分
    await expect(page.locator("#rtl [data-cu-rating-star='2']")).toBeFocused();

    await root.locator('[data-cu-rating-star="3"]').click({ force: true });
    await expect(root).toHaveAttribute("data-cu-rating-value", "2");
    expect(await changes(page)).toEqual([]);
  });

  test("destroy() 後再 init() / refresh()：不重複綁定，仍可操作", async ({ page }) => {
    await page.evaluate(() => {
      CubbyUI.destroy();
      CubbyUI.init();
      CubbyUI.refresh();
    });
    const root = page.locator("#basic");
    await root.locator("[data-cu-rating-star='1']").focus();
    await page.keyboard.press("End");
    await expectValue(root, 5);
    expect(await changes(page)).toEqual([["basic", 5]]);
  });
});
