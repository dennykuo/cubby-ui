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

  test("程式設定 data-cu-rating-value：同步外觀、aria-checked 與 Tab 停駐點，不派發 change", async ({ page }) => {
    const root = page.locator("#preset");
    await root.evaluate((el) => el.setAttribute("data-cu-rating-value", "5"));
    await expectValue(root, 5);
    await root.evaluate((el) => el.setAttribute("data-cu-rating-value", "0"));
    await expectValue(root, 0);
    expect(await changes(page)).toEqual([]);

    // 之後的使用者操作以新值為基準
    await root.locator("[data-cu-rating-star='1']").focus();
    await page.keyboard.press("ArrowRight");
    await expectValue(root, 2);
    expect(await changes(page)).toEqual([["preset", 2]]);

    // 唯讀評分也會跟著程式設定的值更新
    const readonly = page.locator("#readonly");
    await readonly.evaluate((el) => el.setAttribute("data-cu-rating-value", "2"));
    await expect(readonly.locator('[data-cu-rating-star="2"]')).toHaveAttribute("aria-checked", "true");
    await expect(readonly.locator(".cu-rating-item-active")).toHaveCount(2);
  });

  test("執行期切換 cu-rating-disabled / cu-rating-readonly", async ({ page }) => {
    const root = page.locator("#basic");
    const first = root.locator("[data-cu-rating-star='1']");

    await root.evaluate((el) => el.classList.add("cu-rating-disabled"));
    await expect(root).toHaveAttribute("aria-disabled", "true");
    await expect(root.locator('[tabindex="0"]')).toHaveCount(0);
    await first.focus();
    await page.keyboard.press("ArrowRight");
    await expect(root).toHaveAttribute("data-cu-rating-value", "0");

    await root.evaluate((el) => el.classList.replace("cu-rating-disabled", "cu-rating-readonly"));
    await expect(root).not.toHaveAttribute("aria-disabled");
    await expect(root).toHaveAttribute("aria-readonly", "true");
    await expect(root.locator('[tabindex="0"]')).toHaveCount(1);
    await first.focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");
    await expect(root).toHaveAttribute("data-cu-rating-value", "0");
    expect(await changes(page)).toEqual([]);

    await root.evaluate((el) => el.classList.remove("cu-rating-readonly"));
    await expect(root).not.toHaveAttribute("aria-readonly");
    await first.focus();
    await page.keyboard.press("ArrowRight");
    await expectValue(root, 2);
    expect(await changes(page)).toEqual([["basic", 2]]);
  });

  test("forced colors：選取與未選取的星以系統色與實心 / 空心區分，焦點以 outline 顯示", async ({ page }) => {
    await page.emulateMedia({ forcedColors: "active" });
    const root = page.locator("#basic");
    await root.evaluate((el) => el.setAttribute("data-cu-rating-value", "2"));
    await expect(root.locator(".cu-rating-item-active")).toHaveCount(2);

    const look = (n: number) =>
      root.locator(`[data-cu-rating-star="${n}"]`).evaluate((el) => {
        const svg = getComputedStyle(el.querySelector("svg")!);
        return { color: getComputedStyle(el).color, fill: svg.fill, stroke: svg.stroke };
      });
    const on = await look(2);
    const off = await look(3);
    expect(on.color).not.toBe(off.color);
    expect(on.fill).not.toBe("none");
    expect(off.fill).toBe("none");
    expect(off.stroke).not.toBe("none"); // 空心星仍有外框

    await root.locator('[data-cu-rating-star="2"]').focus();
    await page.keyboard.press("ArrowRight");
    await expect(root.locator('[data-cu-rating-star="3"]')).toHaveCSS("outline-style", "solid");
  });
});

/**
 * Radio 寫法（不需 JS）：label.cu-rating-label 包住 visually hidden 的 radio.cu-rating-input，
 * 選取的星與其前面的星以 :has() 填滿，鍵盤與表單送出由原生 radio group 提供
 */
test.describe("Rating（radio 寫法）", () => {
  test.beforeEach(async ({ page }) => {
    await openFixture(page, "rating-radio");
    await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; }" });
  });

  const labelColors = (root: Locator) =>
    root.locator(".cu-rating-label").evaluateAll((labels) => labels.map((l) => getComputedStyle(l).color));

  /** 前 value 顆星為同一個填滿色，其餘為另一個（未選取）色 */
  async function expectFilled(root: Locator, value: number) {
    await expect
      .poll(async () => {
        const colors = await labelColors(root);
        const filled = colors.slice(0, value);
        const empty = colors.slice(value);
        return (
          new Set(filled).size <= 1 &&
          new Set(empty).size <= 1 &&
          (!filled.length || !empty.length || filled[0] !== empty[0])
        );
      })
      .toBe(true);
  }

  const checkedValue = (page: Page) =>
    page.evaluate(() => new FormData(document.getElementById("form") as HTMLFormElement).get("rating"));

  test("選取的星與其前面的星填滿，選取值隨表單送出", async ({ page }) => {
    const root = page.locator("#radio");
    await expectFilled(root, 3);
    expect(await checkedValue(page)).toBe("3");
    // 填滿色與未選取色確實不同（不是全部同色）
    const colors = await labelColors(root);
    expect(colors[2]).not.toBe(colors[3]);

    await root.locator(".cu-rating-label").nth(4).click();
    expect(await checkedValue(page)).toBe("5");
    await page.mouse.move(0, 0);
    await expectFilled(root, 5);
  });

  test("滑鼠預覽：指到的星與其前面的星換色，後面的星暫時恢復未選取", async ({ page }) => {
    const root = page.locator("#radio");
    const before = await labelColors(root);
    await root.locator(".cu-rating-label").nth(1).hover();
    await expectFilled(root, 2);
    const preview = await labelColors(root);
    expect(preview[0]).not.toBe(before[0]); // hover 色與選取色不同
    expect(preview[2]).toBe(before[4]); // 第 3 顆（已選取）暫時恢復未選取色
    await page.mouse.move(0, 0);
    await expect.poll(() => labelColors(root)).toEqual(before);
  });

  test("鍵盤：Tab 停在選取的星，方向鍵選取上一顆 / 下一顆，焦點環畫在 label 上", async ({ page }) => {
    const root = page.locator("#radio");
    await page.locator("#before").focus();
    await page.keyboard.press("Tab");
    const focused = () => page.evaluate(() => (document.activeElement as HTMLInputElement).value);
    expect(await focused()).toBe("3");
    const label = root.locator(".cu-rating-label").nth(2);
    await expect(label).not.toHaveCSS("box-shadow", "none");

    await page.keyboard.press("ArrowRight");
    expect(await checkedValue(page)).toBe("4");
    await expectFilled(root, 4);
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    expect(await checkedValue(page)).toBe("2");
    await expectFilled(root, 2);

    // 群組只有一個 Tab 停駐點；停用的評分不在 Tab 順序中
    await page.keyboard.press("Tab");
    await expect(page.locator("#after")).toBeFocused();
  });

  test("停用：disabled radio 的星變暗、不回應點擊", async ({ page }) => {
    const labels = page.locator("#disabled .cu-rating-label");
    await expect(labels.first()).toHaveCSS("opacity", "0.5");
    await expect(labels.first()).toHaveCSS("pointer-events", "none");
    await labels.nth(1).click({ force: true });
    await expect(page.locator('#disabled input[value="1"]')).toBeChecked();
  });

  test("forced colors：選取的星為系統色實心、未選取為空心，焦點以 outline 顯示", async ({ page }) => {
    await page.emulateMedia({ forcedColors: "active" });
    const root = page.locator("#radio");
    const look = (n: number) =>
      root
        .locator(".cu-rating-label")
        .nth(n)
        .evaluate((el) => {
          const svg = getComputedStyle(el.querySelector("svg")!);
          return { color: getComputedStyle(el).color, fill: svg.fill, stroke: svg.stroke };
        });
    const on = await look(2);
    const off = await look(3);
    expect(on.color).not.toBe(off.color);
    expect(on.fill).toBe(on.color);
    expect(off.fill).toBe("none");
    expect(off.stroke).not.toBe("none"); // 空心星仍有外框

    await page.locator("#before").focus();
    await page.keyboard.press("Tab");
    await expect(root.locator(".cu-rating-label").nth(2)).toHaveCSS("outline-style", "solid");
  });
});
