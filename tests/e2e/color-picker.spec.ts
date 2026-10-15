import { test, expect, type Page } from "@playwright/test";
import { openFixture } from "./helpers";

declare const CubbyUI: any;

function picker(page: Page, id: string) {
  const root = page.locator(`#${id}`);
  return {
    root,
    sat: root.locator("[data-cu-color-picker-saturation]"),
    hue: root.locator("[data-cu-color-picker-hue]"),
    input: root.locator("[data-cu-color-picker-input]"),
    hidden: root.locator("[data-cu-color-picker-hidden]"),
    swatch: (hex: string) => root.locator(`[data-cu-color-picker-swatch="${hex}"]`),
  };
}

const changes = (page: Page) => page.evaluate(() => (window as any).__changes);
const values = async (page: Page) => (await changes(page)).map((c: any) => c.value);

test.describe("Color Picker", () => {
  test.beforeEach(async ({ page }) => {
    await openFixture(page, "color-picker");
  });

  test("ARIA：飽和度面板與色相條為可聚焦的 slider，帶範圍、目前值與名稱", async ({ page }) => {
    const cp = picker(page, "cp");
    await expect(cp.sat).toHaveAttribute("role", "slider");
    await expect(cp.sat).toHaveAttribute("tabindex", "0");
    await expect(cp.sat).toHaveAccessibleName("Saturation and brightness");
    await expect(cp.sat).toHaveAttribute("aria-valuemin", "0");
    await expect(cp.sat).toHaveAttribute("aria-valuemax", "100");
    await expect(cp.sat).toHaveAttribute("aria-valuenow", "76");
    await expect(cp.sat).toHaveAttribute("aria-valuetext", "Saturation 76%, brightness 96%");

    await expect(cp.hue).toHaveAttribute("role", "slider");
    await expect(cp.hue).toHaveAttribute("tabindex", "0");
    await expect(cp.hue).toHaveAccessibleName("Hue");
    await expect(cp.hue).toHaveAttribute("aria-valuemax", "360");
    await expect(cp.hue).toHaveAttribute("aria-valuenow", "217");

    // 作者的 aria-label 保留
    await expect(picker(page, "cp-red").sat).toHaveAccessibleName("Shade");
    // 初始化不派發 change
    expect(await changes(page)).toEqual([]);
  });

  test("飽和度面板鍵盤：← / → 飽和度、↑ / ↓ 亮度、Shift ×10、Page Up / Down、Home / End", async ({ page }) => {
    const cp = picker(page, "cp-red");
    await cp.sat.focus();
    const expectSV = async (s: number, v: number) => {
      await expect(cp.sat).toHaveAttribute("aria-valuenow", String(s));
      await expect(cp.sat).toHaveAttribute("aria-valuetext", `Saturation ${s}%, brightness ${v}%`);
    };

    await page.keyboard.press("ArrowLeft");
    await expectSV(99, 100);
    await page.keyboard.press("Shift+ArrowLeft");
    await expectSV(89, 100);
    await page.keyboard.press("ArrowDown");
    await expectSV(89, 99);
    await page.keyboard.press("PageDown");
    await expectSV(89, 89);
    await page.keyboard.press("ArrowUp");
    await page.keyboard.press("PageUp");
    await expectSV(89, 100);
    await page.keyboard.press("ArrowUp"); // 夾在 100
    await expectSV(89, 100);
    await page.keyboard.press("Home");
    await expectSV(0, 100);
    await expect(cp.input).toHaveValue("#ffffff");
    await page.keyboard.press("End");
    await expectSV(100, 100);
    await expect(cp.input).toHaveValue("#ff0000");
    await expect(cp.hidden).toHaveValue("#ff0000");
    // 方向鍵不會捲動頁面
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });

  test("色相條鍵盤：方向鍵 ±1°、Shift ×10、Page Up / Down ±10°、Home / End，並更新色碼", async ({ page }) => {
    const cp = picker(page, "cp-red");
    await cp.hue.focus();
    await page.keyboard.press("ArrowRight");
    await expect(cp.hue).toHaveAttribute("aria-valuenow", "1");
    await page.keyboard.press("ArrowUp");
    await expect(cp.hue).toHaveAttribute("aria-valuenow", "2");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowLeft");
    await expect(cp.hue).toHaveAttribute("aria-valuenow", "0");
    await page.keyboard.press("ArrowLeft"); // 夾在 0
    await expect(cp.hue).toHaveAttribute("aria-valuenow", "0");
    await page.keyboard.press("Shift+ArrowRight");
    await expect(cp.hue).toHaveAttribute("aria-valuenow", "10");
    await page.keyboard.press("PageUp");
    await expect(cp.hue).toHaveAttribute("aria-valuenow", "20");
    await page.keyboard.press("PageDown");
    await expect(cp.hue).toHaveAttribute("aria-valuenow", "10");
    await page.keyboard.press("End");
    await expect(cp.hue).toHaveAttribute("aria-valuenow", "360");
    await page.keyboard.press("Home");
    for (let i = 0; i < 12; i++) await page.keyboard.press("Shift+ArrowRight");
    await expect(cp.hue).toHaveAttribute("aria-valuenow", "120");
    await expect(cp.input).toHaveValue("#00ff00");
  });

  test("cu:color-picker:change：鍵盤、hex 輸入、色票、拖曳時派發，色碼不變時不重複派發", async ({ page }) => {
    const cp = picker(page, "cp-red");
    await cp.hue.focus();
    await page.keyboard.press("End"); // 360° 與 0° 同為 #ff0000：色碼不變，不派發
    await page.keyboard.press("Home");
    expect(await changes(page)).toEqual([]);

    await cp.sat.focus();
    await page.keyboard.press("Home");
    expect(await changes(page)).toEqual([{ id: "cp-red", value: "#ffffff" }]);

    await cp.input.fill("#123456");
    expect((await values(page)).at(-1)).toBe("#123456");
    await cp.input.fill("#12"); // 不完整的色碼不派發
    expect(await values(page)).toEqual(["#ffffff", "#123456"]);

    const main = picker(page, "cp");
    await main.swatch("#22c55e").click();
    expect((await changes(page)).at(-1)).toEqual({ id: "cp", value: "#22c55e" });
    await main.swatch("#22c55e").click(); // 同色不重複派發
    expect(await changes(page)).toHaveLength(3);

    // 拖曳期間持續派發（先前在 cp-red 輸入時頁面可能已捲動）
    await main.sat.scrollIntoViewIfNeeded();
    const box = (await main.sat.boundingBox())!;
    await page.mouse.move(box.x + 5, box.y + 5);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width - 5, box.y + box.height / 2, { steps: 5 });
    await page.mouse.up();
    const dragged = (await changes(page)).slice(3);
    expect(dragged.length).toBeGreaterThan(2);
    expect(dragged.every((c: any) => c.id === "cp")).toBe(true);
    expect(dragged.at(-1).value).toBe(await main.hidden.inputValue());
  });

  test("拖曳後焦點在面板上，可直接用方向鍵微調", async ({ page }) => {
    const cp = picker(page, "cp-red");
    const box = (await cp.hue.boundingBox())!;
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await expect(cp.hue).toBeFocused();
    const now = Number(await cp.hue.getAttribute("aria-valuenow"));
    expect(Math.abs(now - 180)).toBeLessThanOrEqual(2);
    await page.keyboard.press("ArrowRight");
    await expect(cp.hue).toHaveAttribute("aria-valuenow", String(now + 1));
  });

  test("鍵盤焦點可見：面板與色相條 focus-visible 時有焦點環", async ({ page }) => {
    const cp = picker(page, "cp");
    const ring = (el: typeof cp.sat) => el.evaluate((n) => getComputedStyle(n).boxShadow);
    await page.keyboard.press("Tab");
    await expect(cp.sat).toBeFocused();
    expect(await ring(cp.sat)).not.toBe("none");
    await page.keyboard.press("Tab");
    await expect(cp.hue).toBeFocused();
    expect(await ring(cp.hue)).not.toBe("none");
  });

  test("重複呼叫 init() 不會重複綁定", async ({ page }) => {
    await page.evaluate(() => {
      CubbyUI.init();
      CubbyUI.refresh();
    });
    const cp = picker(page, "cp-red");
    await cp.hue.focus();
    await page.keyboard.press("ArrowRight");
    await expect(cp.hue).toHaveAttribute("aria-valuenow", "1");
    expect(await changes(page)).toHaveLength(1);
  });
});
