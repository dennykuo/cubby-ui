import { test, expect, type Page } from "@playwright/test";
import { openFixture } from "./helpers";

/**
 * Forced colors（Windows 高對比）：瀏覽器會把作者色彩換成系統色、移除 box-shadow 與背景圖，
 * 只靠底色 / 陰影表達的狀態與元素由各元件 CSS 的 `@media (forced-colors: active)` 改以系統色、外框或 outline 呈現。
 * fixture 為不帶 data-cu-* 的靜態狀態標記；系統色實際值以 probe 元素量測（forced colors 下 getComputedStyle 回傳實際使用的顏色）。
 */

type SystemColors = { highlight: string; highlightText: string; canvasText: string; grayText: string };

async function systemColors(page: Page): Promise<SystemColors> {
  return page.evaluate(() => {
    const style = (id: string) => getComputedStyle(document.getElementById(id)!);
    return {
      highlight: style("probe-highlight").backgroundColor,
      highlightText: style("probe-highlight").color,
      canvasText: style("probe-canvas-text").backgroundColor,
      grayText: style("probe-gray-text").backgroundColor,
    };
  });
}

/** 讀取元素（或其 ::before / ::after）的 computed style */
function computed(page: Page, selector: string, prop: string, pseudo = "") {
  return page
    .locator(selector)
    .evaluate((el, [p, ps]) => getComputedStyle(el, ps || null).getPropertyValue(p), [prop, pseudo]);
}

const TRANSPARENT = "rgba(0, 0, 0, 0)";

test.describe("forced colors", () => {
  let colors: SystemColors;

  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ forcedColors: "active" });
    await openFixture(page, "forced-colors");
    colors = await systemColors(page);
    // 系統色需彼此不同，下面的比較才有意義
    expect(new Set(Object.values(colors)).size).toBe(4);
  });

  // [選取中, 同類的一般項目]
  const SELECTED: [string, string][] = [
    ["#tab-active", "#tab"],
    ["#tab-underline-active", "#tab-underline"],
    ["#tab-pills-active", "#tab-pills"],
    ["#segmented-active", "#segmented"],
    ["#segmented-radio-active", "#segmented-radio"],
    ["#toggle-group-active", "#toggle-group"],
    ["#toggle-group-outline-active", "#toggle-group-outline"],
    ["#toolbar-active", "#toolbar"],
    ["#pagination-active", "#pagination"],
    ["#nav-active", "#nav"],
    ["#sidebar-active", "#sidebar"],
    ["#tree-active", "#tree"],
    ["#calendar-selected", "#calendar-day"],
    ["#dropdown-highlight", "#dropdown"],
    ["#combobox-highlight", "#combobox"],
    ["#multi-select-highlight", "#multi-select"],
    ["#command-active", "#command"],
    ["#menubar-expanded", "#menubar"],
  ];

  test("選取 / 高亮中的項目以 Highlight 填滿、文字為 HighlightText，與一般項目可區分", async ({ page }) => {
    for (const [selected, peer] of SELECTED) {
      await expect(page.locator(selected), selected).toHaveCSS("background-color", colors.highlight);
      await expect(page.locator(selected), selected).toHaveCSS("color", colors.highlightText);
      // 自行指定系統色：否則瀏覽器會在文字後補上頁面底色的襯底（backplate），HighlightText 文字會看不見
      await expect(page.locator(selected), selected).toHaveCSS("forced-color-adjust", "none");
      await expect(page.locator(peer), peer).not.toHaveCSS("background-color", colors.highlight);
    }
    // 內部元素（徽章）跟著用 HighlightText，不保留自己的底色
    await expect(page.locator("#tab-badge")).toHaveCSS("color", colors.highlightText);
    await expect(page.locator("#tab-badge")).toHaveCSS("background-color", TRANSPARENT);
  });

  test("Data Table 選取列以 Highlight 填滿儲存格（內容仍由瀏覽器套用系統色）", async ({ page }) => {
    await expect(page.locator("#data-table-cell-selected")).toHaveCSS("background-color", colors.highlight);
    await expect(page.locator("#data-table-cell-selected")).not.toHaveCSS("forced-color-adjust", "none");
    await expect(page.locator("#data-table-cell")).not.toHaveCSS("background-color", colors.highlight);
  });

  test("Calendar 今天加外框、非本月日期為 GrayText", async ({ page }) => {
    await expect(page.locator("#calendar-today")).toHaveCSS("border-top-width", "1px");
    await expect(page.locator("#calendar-today")).toHaveCSS("border-top-style", "solid");
    await expect(page.locator("#calendar-day")).toHaveCSS("border-top-width", "0px");
    await expect(page.locator("#calendar-outside")).toHaveCSS("color", colors.grayText);
  });

  test("Steps 以填滿 / outline / 一般外框區分已完成、進行中、未開始", async ({ page }) => {
    const completed = page.locator("#steps-completed .cu-steps-number");
    const active = page.locator("#steps-active .cu-steps-number");
    const upcoming = page.locator("#steps-upcoming .cu-steps-number");
    await expect(completed).toHaveCSS("background-color", colors.highlight);
    await expect(completed).toHaveCSS("color", colors.highlightText);
    await expect(active).toHaveCSS("outline-style", "solid");
    await expect(active).toHaveCSS("outline-color", colors.highlight);
    await expect(upcoming).toHaveCSS("outline-style", "none");
    await expect(upcoming).not.toHaveCSS("background-color", colors.highlight);
    await expect(page.locator("#steps-separator-completed")).toHaveCSS("background-color", colors.highlight);
    await expect(page.locator("#steps-separator")).toHaveCSS("background-color", colors.canvasText);
  });

  test("Toggle 的圓鈕可見，開啟時軌道以 Highlight 填滿", async ({ page }) => {
    await expect(page.locator("#toggle-on")).toHaveCSS("background-color", colors.highlight);
    await expect(page.locator("#toggle-on-thumb")).toHaveCSS("background-color", colors.highlightText);
    await expect(page.locator("#toggle-off")).not.toHaveCSS("background-color", colors.highlight);
    await expect(page.locator("#toggle-off-thumb")).toHaveCSS("background-color", colors.canvasText);
  });

  test("只靠底色的指示元素改用系統色（進度、骨架、分隔線、圓點）", async ({ page }) => {
    await expect(page.locator("#progress")).toHaveCSS("border-top-width", "1px");
    // 漸層背景會被移除，仍以 Highlight 填滿
    await expect(page.locator("#progress-bar")).toHaveCSS("background-color", colors.highlight);
    await expect(page.locator("#progress-circular-track")).toHaveCSS("stroke", colors.grayText);
    await expect(page.locator("#progress-circular-bar")).toHaveCSS("stroke", colors.highlight);

    for (const id of ["#skeleton", "#skeleton-shimmer"]) {
      await expect(page.locator(id), id).toHaveCSS("background-color", colors.grayText);
    }
    for (const id of [
      "#separator",
      "#hr",
      "#toolbar-separator",
      "#sidebar-separator",
      "#dropdown-separator",
      "#command-separator",
      "#chat-typing-dot",
    ]) {
      await expect(page.locator(id), id).toHaveCSS("background-color", colors.canvasText);
    }
    expect(await computed(page, "#timeline", "background-color", "::before")).toBe(colors.canvasText);
    expect(await computed(page, "#badge-dot", "background-color", "::before")).toBe(colors.canvasText);
    expect(await computed(page, "#notification-title", "background-color", "::before")).toBe(colors.canvasText);

    // 圓點：空心（外框）/ 實心（Highlight）
    for (const [active, dot] of [
      ["#carousel-dot-active", "#carousel-dot"],
      ["#tour-dot-active", "#tour-dot"],
    ]) {
      await expect(page.locator(dot), dot).toHaveCSS("border-top-width", "1px");
      await expect(page.locator(active), active).toHaveCSS("background-color", colors.highlight);
      await expect(page.locator(dot), dot).not.toHaveCSS("background-color", colors.highlight);
    }

    await expect(page.locator("#range")).toHaveCSS("border-top-width", "1px");
    // Spinner 保留缺口（框線色若交給瀏覽器會全部換成同一個系統色，看不出旋轉）
    await expect(page.locator("#spinner")).toHaveCSS("border-right-color", colors.canvasText);
    await expect(page.locator("#spinner")).toHaveCSS("border-top-color", TRANSPARENT);
  });

  test("失去底色的元件補上外框，選取的 Card 以 Highlight outline 表示", async ({ page }) => {
    await expect(page.locator("#button")).toHaveCSS("border-top-width", "1px");
    await expect(page.locator("#button")).toHaveCSS("border-top-style", "solid");
    await expect(page.locator("#button-ghost")).toHaveCSS("border-top-width", "0px");
    await expect(page.locator("#badge")).toHaveCSS("border-top-width", "1px");
    expect(await computed(page, "#tooltip", "border-top-width", "::after")).toBe("1px");
    // 箭頭由透明框線組成，forced colors 下會變成實心方塊，因此隱藏
    expect(await computed(page, "#tooltip", "display", "::before")).toBe("none");

    await expect(page.locator("#card-selected")).toHaveCSS("outline-style", "solid");
    await expect(page.locator("#card-selected")).toHaveCSS("outline-color", colors.highlight);
    await expect(page.locator("#card")).toHaveCSS("outline-style", "none");

    await expect(page.locator("#dropzone-active")).toHaveCSS("border-top-style", "solid");
    await expect(page.locator("#dropzone")).toHaveCSS("border-top-style", "dashed");
  });

  for (const [input, visible] of [
    ["#toggle-off-input", "#toggle-off"],
    ["#segmented-radio-a", "#segmented-radio-active"],
    ["#dropzone-input", "#dropzone"],
  ]) {
    test(`視覺隱藏的 input 取得鍵盤焦點時，outline 畫在可見元素上（${input}）`, async ({ page }) => {
      // 從文字輸入框移過去，程式聚焦也會符合 :focus-visible
      await page.locator("#before").focus();
      await page.locator(input).focus();
      expect(await page.locator(input).evaluate((el) => el.matches(":focus-visible"))).toBe(true);
      await expect(page.locator(visible)).toHaveCSS("outline-style", "solid");
      await expect(page.locator(visible)).toHaveCSS("outline-color", colors.highlight);
    });
  }

  test("色彩即內容的元件保留作者色彩（圖表色塊、色彩選擇器）", async ({ page }) => {
    await expect(page.locator("#chart-swatch")).toHaveCSS("forced-color-adjust", "none");
    await expect(page.locator("#chart-swatch")).not.toHaveCSS("background-color", TRANSPARENT);
    await expect(page.locator("#color-picker-hue")).toHaveCSS("forced-color-adjust", "none");
    await expect(page.locator("#color-picker-hue")).toHaveCSS("background-image", /linear-gradient/);
  });
});

test("一般模式不套用 forced colors 樣式", async ({ page }) => {
  await openFixture(page, "forced-colors");
  await expect(page.locator("#tab-active")).toHaveCSS("forced-color-adjust", "auto");
  await expect(page.locator("#button")).toHaveCSS("border-top-width", "0px");
  await expect(page.locator("#badge")).toHaveCSS("border-top-width", "0px");
  await expect(page.locator("#card-selected")).toHaveCSS("outline-style", "none");
  expect(await computed(page, "#tooltip", "display", "::before")).not.toBe("none");
});
