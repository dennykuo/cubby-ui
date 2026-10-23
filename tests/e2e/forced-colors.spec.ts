import { test, expect, type Page } from "@playwright/test";
import { openFixture } from "./helpers";

/**
 * Forced colors（Windows 高對比）下的狀態辨識：
 * 背景色、文字色、邊框色會被換成系統色，box-shadow 被移除，只靠這些表達的狀態會看不出來。
 * - 選取 / 高亮 / 目前項目：以系統選取色填滿（`Highlight` + `HighlightText`），並設 `forced-color-adjust: none`，
 *   否則瀏覽器在文字後方墊上 Canvas 底板（backplate），HighlightText 會被蓋掉
 * - 其他狀態：外框、outline、GrayText 或實心 / 空心等形狀差異
 * fixture 以靜態 class 呈現各狀態（JS 不會改動），在載入前就切換 forced colors，避免 transition 影響 computed style。
 */

const SYSTEM_COLORS = ["Canvas", "CanvasText", "Highlight", "HighlightText", "GrayText"] as const;
type SystemColor = (typeof SYSTEM_COLORS)[number];

/** 目前模式下各系統色的 computed 值（與元素 computed style 同格式，可直接比對） */
function systemColors(page: Page): Promise<Record<SystemColor, string>> {
  return page.evaluate(
    (names) => {
      const probe = document.createElement("div");
      document.body.append(probe);
      const out: Record<string, string> = {};
      for (const name of names) {
        probe.style.backgroundColor = name;
        out[name] = getComputedStyle(probe).backgroundColor;
      }
      probe.remove();
      return out;
    },
    SYSTEM_COLORS as unknown as string[],
  ) as Promise<Record<SystemColor, string>>;
}

function css(page: Page, selector: string) {
  return page.locator(selector).evaluate((el) => {
    const s = getComputedStyle(el);
    return {
      backgroundColor: s.backgroundColor,
      color: s.color,
      forcedColorAdjust: s.getPropertyValue("forced-color-adjust"),
      borderTop: `${s.borderTopWidth} ${s.borderTopStyle}`,
      borderTopColor: s.borderTopColor,
      borderBottomColor: s.borderBottomColor,
      borderLeftWidth: s.borderLeftWidth,
      outline: `${s.outlineWidth} ${s.outlineStyle}`,
      outlineColor: s.outlineColor,
      outlineOffset: s.outlineOffset,
      stroke: s.stroke,
    };
  });
}

/** 透過鍵盤（Shift+Tab → Tab）聚焦，讓 :focus-visible 成立 */
async function focusByKeyboard(page: Page, selector: string) {
  await page.locator(selector).focus();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");
  await expect(page.locator(selector)).toBeFocused();
}

/** [選取 / 高亮中的元素, 同元件未選取的元素] */
const FILLED_STATES: Array<[string, string, string]> = [
  ["Dropdown / Context Menu 高亮項目", "#dropdown-highlight", "#dropdown-item"],
  ["Menubar 展開中的 trigger", "#menubar-trigger-open", "#menubar-trigger"],
  ["Combobox 高亮項目", "#combobox-highlight", "#combobox-item"],
  ["Multi Select 高亮項目", "#multi-highlight", "#multi-item"],
  ["Command Palette 選中項目", "#command-active", "#command-item"],
  ["Tabs 選取中的 tab", "#tab-active", "#tab"],
  ["Tabs pills 選取中的 tab", "#pill-active", "#pill"],
  ["Tabs underline 選取中的 tab", "#underline-active", "#underline"],
  ["Segmented Control（radio）", "#seg-checked", "#seg-unchecked"],
  ["Segmented Control（button）", "#seg-btn-active", "#seg-btn"],
  ["Toggle Group 按下的項目", "#toggle-group-active", "#toggle-group-item"],
  ["Toggle Group multiple + outline", "#toggle-group-multi-active", "#toggle-group-item"],
  ["Toolbar 按下的按鈕", "#toolbar-active", "#toolbar-button"],
  ["Calendar 選取日", "#day-selected", "#day"],
  ["Pagination 目前頁", "#page-active", "#page"],
  ["Nav 目前項目", "#nav-active", "#nav"],
  ["Sidebar 目前項目", "#sidebar-active", "#sidebar"],
  ["Tree View 選取項目", "#tree-leaf-active", "#tree-leaf"],
  ["Steps 完成步驟", "#step-completed .cu-steps-number", "#step-upcoming .cu-steps-number"],
];

test.describe("Forced colors 狀態辨識", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ forcedColors: "active" });
    await openFixture(page, "forced-colors");
  });

  test("選取 / 高亮 / 目前項目以系統選取色填滿，文字不墊 Canvas 底板", async ({ page }) => {
    const sys = await systemColors(page);
    for (const [name, on, off] of FILLED_STATES) {
      const selected = await css(page, on);
      const other = await css(page, off);
      expect(selected.backgroundColor, `${name}：選取`).toBe(sys.Highlight);
      expect(selected.color, `${name}：選取文字`).toBe(sys.HighlightText);
      expect(selected.forcedColorAdjust, `${name}：選取`).toBe("none");
      expect(other.backgroundColor, `${name}：未選取`).not.toBe(sys.Highlight);
      expect(other.forcedColorAdjust, `${name}：未選取`).toBe("auto");
    }
  });

  test("填滿項目內的子元素（快捷鍵、徽章、Kbd）改用 HighlightText", async ({ page }) => {
    const sys = await systemColors(page);
    expect((await css(page, "#dropdown-shortcut")).color).toBe(sys.HighlightText);
    expect((await css(page, "#tab-badge")).color).toBe(sys.HighlightText);
    const kbd = await css(page, "#command-kbd");
    expect(kbd.color).toBe(sys.HighlightText);
    expect(kbd.borderTopColor).toBe(sys.HighlightText);
    expect(kbd.backgroundColor).toBe("rgba(0, 0, 0, 0)");
  });

  test("Combobox / Multi Select 已選取項目以文字色內框標示，同時高亮時內框內縮", async ({ page }) => {
    const sys = await systemColors(page);
    const selected = await css(page, "#combobox-active");
    expect(selected.outline).toBe("2px solid");
    expect(selected.outlineColor).toBe(sys.CanvasText);
    expect(selected.outlineOffset).toBe("-2px");
    expect((await css(page, "#combobox-item")).outline).toContain("none");
    expect((await css(page, "#multi-active")).outline).toBe("2px solid");
    expect((await css(page, "#multi-item")).outline).toContain("none");

    const both = await css(page, "#multi-active-highlight");
    expect(both.backgroundColor).toBe(sys.Highlight);
    expect(both.outlineColor).toBe(sys.HighlightText);
    expect(both.outlineOffset).toBe("-4px");
  });

  test("Button：沒有邊框的變體補上與文字同色的外框，link 變體維持連結外觀", async ({ page }) => {
    for (const id of ["default", "secondary", "ghost", "destructive", "outline", "anchor"]) {
      const s = await css(page, `#btn-${id}`);
      expect(s.borderTop, id).toBe("1px solid");
      expect(s.borderTopColor, id).toBe(s.color);
    }
    expect((await css(page, "#btn-link")).borderTop).toBe("0px solid");
  });

  test("Tabs underline：只有選取中的 tab 有底線（未選取 tab 的透明底線不被換成文字色）", async ({ page }) => {
    const sys = await systemColors(page);
    expect((await css(page, "#underline-active")).borderBottomColor).toBe(sys.Highlight);
    expect((await css(page, "#underline")).borderBottomColor).toBe(sys.Canvas);
  });

  test("Calendar：今天加外框、非本月日期為 GrayText", async ({ page }) => {
    const sys = await systemColors(page);
    expect((await css(page, "#day-today")).borderTop).toBe("1px solid");
    expect((await css(page, "#day")).borderTop).toBe("0px solid");
    expect((await css(page, "#day-outside")).color).toBe(sys.GrayText);
    expect((await css(page, "#day")).color).not.toBe(sys.GrayText);
  });

  test("Steps：目前步驟外加 outline、未到的步驟為 GrayText，連接線以系統色顯示", async ({ page }) => {
    const sys = await systemColors(page);
    expect((await css(page, "#step-active .cu-steps-number")).outline).toBe("2px solid");
    const upcoming = await css(page, "#step-upcoming .cu-steps-number");
    expect(upcoming.outline).toContain("none");
    expect(upcoming.color).toBe(sys.GrayText);
    expect((await css(page, "#step-completed .cu-steps-number")).outline).toContain("none");
    expect((await css(page, "#step-separator-completed")).backgroundColor).toBe(sys.Highlight);
    expect((await css(page, "#step-separator")).backgroundColor).toBe(sys.GrayText);
  });

  test("Toggle：thumb 以文字色顯示，開啟時軌道填滿選取色、thumb 在另一側", async ({ page }) => {
    const sys = await systemColors(page);
    expect((await css(page, "#toggle-off .cu-toggle-thumb")).backgroundColor).toBe(sys.CanvasText);
    expect((await css(page, "#toggle-off")).backgroundColor).not.toBe(sys.Highlight);
    expect((await css(page, "#toggle-on")).backgroundColor).toBe(sys.Highlight);
    expect((await css(page, "#toggle-on .cu-toggle-thumb")).backgroundColor).toBe(sys.HighlightText);

    const offset = async (id: string) => {
      const track = (await page.locator(`#${id}`).boundingBox())!;
      const thumb = (await page.locator(`#${id} .cu-toggle-thumb`).boundingBox())!;
      return thumb.x - track.x;
    };
    expect(await offset("toggle-on")).toBeGreaterThan(await offset("toggle-off"));
  });

  test("Progress：軌道加外框、進度條填滿選取色（含色彩 / 漸層變體），多段以縫隙分段", async ({ page }) => {
    const sys = await systemColors(page);
    expect((await css(page, "#progress")).outline).toBe("1px solid");
    expect((await css(page, "#progress-multi")).outline).toBe("1px solid");
    for (const id of ["progress-bar", "progress-bar-gradient", "progress-segment"]) {
      expect((await css(page, `#${id}`)).backgroundColor, id).toBe(sys.Highlight);
    }
    expect((await css(page, "#progress-segment")).borderLeftWidth).toBe("2px");
    expect((await css(page, "#circular-bar")).stroke).toBe(sys.Highlight);
    expect((await css(page, "#circular-track")).stroke).toBe(sys.GrayText);
  });

  test("Radio：選取為較粗的選取色外圈", async ({ page }) => {
    const sys = await systemColors(page);
    const checked = await css(page, "#radio-checked");
    const unchecked = await css(page, "#radio");
    expect(checked.borderTop).toBe("5px solid");
    expect(checked.borderTopColor).toBe(sys.Highlight);
    expect(unchecked.borderTop).toBe("2px solid");
    expect(unchecked.borderTopColor).not.toBe(sys.Highlight);
  });

  test("Card / Carousel / Tour / Dropzone / Range 的狀態以外框或實心 / 空心區分", async ({ page }) => {
    const sys = await systemColors(page);

    const card = await css(page, "#card-selected");
    expect(card.borderTopColor).toBe(sys.Highlight);
    expect(card.outline).toBe("2px solid");
    expect((await css(page, "#card")).outline).toContain("none");

    for (const prefix of ["carousel-dot", "tour-dot"]) {
      const active = await css(page, `#${prefix}-active`);
      const inactive = await css(page, `#${prefix}`);
      expect(active.backgroundColor, prefix).toBe(sys.Highlight);
      expect(inactive.borderTop, prefix).toBe("1px solid");
      expect(inactive.backgroundColor, prefix).not.toBe(sys.Highlight);
    }

    const dropping = await css(page, "#dropzone-active");
    expect(dropping.borderTop).toBe("2px solid");
    expect(dropping.borderTopColor).toBe(sys.Highlight);
    expect((await css(page, "#dropzone")).borderTop).toBe("2px dashed");

    expect((await css(page, "#range")).backgroundColor).toBe(sys.GrayText);
  });

  test("Rating radio 模式：選取的星為系統選取色實心、未選取為文字色空心", async ({ page }) => {
    const sys = await systemColors(page);
    const look = (id: string) =>
      page.locator(id).evaluate((el) => ({
        color: getComputedStyle(el).color,
        fill: getComputedStyle(el.querySelector("svg")!).fill,
      }));
    const on = await look("#rate-1-label");
    const off = await look("#rate-2-label");
    expect(on.color).toBe(sys.Highlight);
    expect(on.fill).not.toBe("none");
    expect(off.color).toBe(sys.CanvasText);
    expect(off.fill).toBe("none");
  });

  test("焦點環畫在其他元素上的元件（sr-only input）以 outline 顯示焦點", async ({ page }) => {
    const cases: Array<[string, string]> = [
      ["#toggle-off-input", "#toggle-off"],
      ["#seg-1", "#seg-checked"],
      ["#dropzone-input", "#dropzone"],
      ["#rate-1", "#rate-1-label"],
    ];
    for (const [input, proxy] of cases) {
      expect((await css(page, proxy)).outline, proxy).toContain("none");
      await focusByKeyboard(page, input);
      expect((await css(page, proxy)).outline, proxy).toBe("2px solid");
    }
  });

  test("實際操作：Combobox 方向鍵高亮的項目（aria-activedescendant）以系統選取色填滿", async ({ page }) => {
    await openFixture(page, "combobox");
    const sys = await systemColors(page);
    const root = page.locator("#cb-framework");
    await root.locator("[data-cu-combobox-trigger]").click();
    await page.keyboard.press("ArrowDown");
    const highlighted = root.locator(".cu-combobox-item-highlight");
    await expect(highlighted).toHaveText("Next.js");
    await expect(highlighted).toHaveCSS("background-color", sys.Highlight);
    await expect(root.locator("[data-cu-combobox-item]", { hasText: "Nuxt.js" })).not.toHaveCSS(
      "background-color",
      sys.Highlight,
    );
  });

  test("一般模式不受影響", async ({ page }) => {
    await page.emulateMedia({ forcedColors: "none" });
    await openFixture(page, "forced-colors");
    const highlight = (await systemColors(page)).Highlight;
    for (const [name, on] of FILLED_STATES) {
      const s = await css(page, on);
      expect(s.forcedColorAdjust, name).toBe("auto");
      expect(s.backgroundColor, name).not.toBe(highlight);
    }
    expect((await css(page, "#btn-default")).borderTop).toBe("0px solid");
    expect((await css(page, "#combobox-active")).outline).toContain("none");
    expect((await css(page, "#toggle-off .cu-toggle-thumb")).backgroundColor).not.toBe(
      (await systemColors(page)).CanvasText,
    );
  });
});
