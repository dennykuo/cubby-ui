import { test, expect, type Page } from "@playwright/test";
import { openFixture } from "./helpers";

/**
 * 勾勾以 ::before + mask 繪製、背景色取 --color-primary-foreground，
 * 淺色 primary 的主題（例如暗色模式的品牌色）勾勾會自動變成深色，不再固定為白色。
 */
async function mark(page: Page, id: string) {
  return page.locator(`#${id}`).evaluate((el) => {
    const s = getComputedStyle(el, "::before");
    return { color: s.backgroundColor, scale: s.scale, mask: s.maskImage || s.webkitMaskImage };
  });
}

// Tailwind v4 的 scale-* 編譯為 CSS scale 屬性
const VISIBLE = "1";
const HIDDEN = "0";

test.describe("Checkbox", () => {
  test.beforeEach(async ({ page }) => {
    await openFixture(page, "checkbox");
  });

  test("未勾選時不顯示，勾選後顯示勾勾", async ({ page }) => {
    expect((await mark(page, "unchecked")).scale).toBe(HIDDEN);
    const checked = await mark(page, "checked");
    expect(checked.scale).toBe(VISIBLE);
    expect(checked.mask).toContain("M20 6");

    await page.locator("#unchecked").check();
    await expect.poll(async () => (await mark(page, "unchecked")).scale).toBe(VISIBLE);
  });

  test("勾勾顏色跟隨 --color-primary-foreground", async ({ page }) => {
    const brand = await mark(page, "brand");
    expect(brand.color).toBe("rgb(15, 23, 42)");
    const fg = await page.evaluate(() => {
      const probe = document.createElement("div");
      probe.style.color = "var(--color-primary-foreground)";
      document.body.appendChild(probe);
      const c = getComputedStyle(probe).color;
      probe.remove();
      return c;
    });
    expect((await mark(page, "checked")).color).toBe(fg);
  });

  test(":indeterminate 顯示橫線", async ({ page }) => {
    // indeterminate 由 fixture 的 script 設定；若瀏覽器在那之前已算過一次樣式，
    // 勾勾的 scale 與背景色會跑 150ms transition，因此等到過渡結束再比對
    await expect.poll(async () => (await mark(page, "mixed")).scale).toBe(VISIBLE);
    expect((await mark(page, "mixed")).mask).toContain("M6 12h12");
    const checkedBg = await page.locator("#checked").evaluate((el) => getComputedStyle(el).backgroundColor);
    await expect
      .poll(() => page.locator("#mixed").evaluate((el) => getComputedStyle(el).backgroundColor))
      .toBe(checkedBg);
  });
});
