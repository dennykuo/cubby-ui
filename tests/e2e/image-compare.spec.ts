import { test, expect, type Page } from "@playwright/test";
import { openFixture } from "./helpers";

declare const CubbyUI: any;

function compare(page: Page, id: string) {
  const root = page.locator(`#${id}`);
  return {
    root,
    handle: root.locator(".cu-image-compare-handle"),
    /** 目前的 --cu-compare-position（例如 "25%"） */
    position: () => root.evaluate((el) => (el as HTMLElement).style.getPropertyValue("--cu-compare-position")),
  };
}

test.describe("Image Compare", () => {
  test.beforeEach(async ({ page }) => {
    await openFixture(page, "image-compare");
  });

  test("data-cu-image-compare-position 設定初始位置；未設定為 50，超出範圍夾住，無效值退回 50", async ({ page }) => {
    const def = compare(page, "ic-default");
    await expect.poll(def.position).toBe("50%");
    await expect(def.handle).toHaveAttribute("aria-valuenow", "50");

    const ic = compare(page, "ic-25");
    await expect.poll(ic.position).toBe("25%");
    await expect(ic.handle).toHaveAttribute("aria-valuenow", "25");
    await expect(ic.handle).toHaveAttribute("aria-valuetext", "25%");
    // CSS 依變數定位把手：把手中心約在 25% 處
    const [box, handleBox] = await Promise.all([ic.root.boundingBox(), ic.handle.boundingBox()]);
    expect(Math.abs(handleBox!.x + handleBox!.width / 2 - (box!.x + box!.width * 0.25))).toBeLessThan(2);

    await expect.poll(compare(page, "ic-over").position).toBe("100%");
    await expect.poll(compare(page, "ic-invalid").position).toBe("50%");
  });

  test("把手為可聚焦的 slider，帶範圍、方向與無障礙名稱", async ({ page }) => {
    const ic = compare(page, "ic-default");
    await expect(ic.handle).toHaveAttribute("role", "slider");
    await expect(ic.handle).toHaveAttribute("tabindex", "0");
    await expect(ic.handle).toHaveAttribute("aria-valuemin", "0");
    await expect(ic.handle).toHaveAttribute("aria-valuemax", "100");
    await expect(ic.handle).toHaveAttribute("aria-orientation", "horizontal");
    await expect(ic.handle).toHaveAccessibleName("Image comparison");
    await expect(page.getByRole("slider", { name: "Before / after" })).toHaveAttribute("aria-valuenow", "25");
    await expect(compare(page, "ic-vertical").handle).toHaveAttribute("aria-orientation", "vertical");
  });

  test("鍵盤：方向鍵 ±1、Page Up / Page Down ±10、Home / End 到兩端，並夾在 0–100", async ({ page }) => {
    const ic = compare(page, "ic-25");
    await ic.handle.focus();
    const expectValue = async (n: number) => {
      await expect(ic.handle).toHaveAttribute("aria-valuenow", String(n));
      await expect.poll(ic.position).toBe(`${n}%`);
    };

    await page.keyboard.press("ArrowRight");
    await expectValue(26);
    await page.keyboard.press("ArrowUp");
    await expectValue(27);
    await page.keyboard.press("ArrowLeft");
    await expectValue(26);
    await page.keyboard.press("ArrowDown");
    await expectValue(25);
    await page.keyboard.press("PageUp");
    await expectValue(35);
    await page.keyboard.press("PageDown");
    await expectValue(25);
    await page.keyboard.press("End");
    await expectValue(100);
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("PageUp");
    await expectValue(100);
    await page.keyboard.press("Home");
    await expectValue(0);
    await page.keyboard.press("ArrowLeft");
    await expectValue(0);
    await expect(ic.handle).toHaveAttribute("aria-valuetext", "0%");

    // 方向鍵 / Page 鍵不會捲動頁面
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });

  test("垂直模式：數值由上往下增加，↓ / → 增加、↑ / ← 減少", async ({ page }) => {
    const ic = compare(page, "ic-vertical");
    await ic.handle.focus();
    await page.keyboard.press("ArrowDown");
    await expect(ic.handle).toHaveAttribute("aria-valuenow", "41");
    await page.keyboard.press("ArrowRight");
    await expect(ic.handle).toHaveAttribute("aria-valuenow", "42");
    await page.keyboard.press("ArrowUp");
    await page.keyboard.press("ArrowLeft");
    await expect(ic.handle).toHaveAttribute("aria-valuenow", "40");
    await page.keyboard.press("PageDown");
    await expect(ic.handle).toHaveAttribute("aria-valuenow", "50");
    await page.keyboard.press("PageUp");
    await expect(ic.handle).toHaveAttribute("aria-valuenow", "40");
  });

  test("拖曳同步 aria-valuenow，鍵盤從拖曳後的位置繼續", async ({ page }) => {
    const ic = compare(page, "ic-default");
    const box = (await ic.root.boundingBox())!;
    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.75, box.y + box.height / 2, { steps: 4 });
    await page.mouse.up();
    await expect(ic.handle).toHaveAttribute("aria-valuenow", "75");

    await ic.handle.focus();
    await page.keyboard.press("ArrowRight");
    await expect(ic.handle).toHaveAttribute("aria-valuenow", "76");
  });

  test("鍵盤焦點可見：把手 focus-visible 時握把有焦點環", async ({ page }) => {
    const ic = compare(page, "ic-default");
    const grip = ic.root.locator(".cu-image-compare-handle-grip");
    const ring = () => grip.evaluate((el) => getComputedStyle(el).boxShadow);
    const before = await ring();
    await page.keyboard.press("Tab");
    await expect(ic.handle).toBeFocused();
    await expect.poll(ring).not.toBe(before);
  });

  test("destroy() 後再 init()：鍵盤與拖曳仍可用，不重複綁定", async ({ page }) => {
    await page.evaluate(() => {
      CubbyUI.destroy();
      CubbyUI.init();
      CubbyUI.init();
    });
    const ic = compare(page, "ic-25");
    await ic.handle.focus();
    await page.keyboard.press("ArrowRight");
    await expect(ic.handle).toHaveAttribute("aria-valuenow", "26");

    const box = (await ic.root.boundingBox())!;
    await page.mouse.move(box.x + box.width * 0.3, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.6, box.y + box.height / 2, { steps: 4 });
    await page.mouse.up();
    await expect(ic.handle).toHaveAttribute("aria-valuenow", "60");
  });
});
