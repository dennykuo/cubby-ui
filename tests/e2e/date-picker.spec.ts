import { test, expect, type Page, type Locator } from "@playwright/test";
import { openFixture } from "./helpers";

declare const CubbyUI: any;

// 固定時區與「今天」，讓月曆內容可預期（2026-03-01 為星期日、2026-04-01 為星期三）
test.use({ timezoneId: "Asia/Taipei" });
const TODAY = "2026-03-18T10:00:00+08:00";

async function open(page: Page, now = TODAY) {
  await page.clock.setFixedTime(new Date(now));
  await openFixture(page, "date-picker");
}

const exact = (n: number | string) => new RegExp(`^${n}$`);

function calendar(root: Locator) {
  const grid = root.locator("[data-cu-calendar-grid]");
  return {
    title: root.locator("[data-cu-calendar-title]"),
    prev: root.locator("[data-cu-calendar-prev]"),
    next: root.locator("[data-cu-calendar-next]"),
    grid,
    cells: grid.locator(".cu-calendar-day"),
    /** 目前顯示月份中的某一天（排除前後月補位） */
    day: (n: number) => grid.locator(".cu-calendar-day:not(.cu-calendar-day-outside)").filter({ hasText: exact(n) }),
    outsideDay: (n: number) => grid.locator(".cu-calendar-day.cu-calendar-day-outside").filter({ hasText: exact(n) }),
    focused: grid.locator(".cu-calendar-day:focus"),
    selected: grid.locator(".cu-calendar-day-selected"),
    today: grid.locator(".cu-calendar-day-today"),
  };
}

function picker(page: Page, id: string) {
  const root = page.locator(`#${id}`);
  return {
    root,
    trigger: root.locator("[data-cu-date-picker-trigger]"),
    value: root.locator("[data-cu-date-picker-value]"),
    input: root.locator("[data-cu-date-picker-input]"),
    content: root.locator("[data-cu-date-picker-content]"),
    cal: calendar(root.locator("[data-cu-calendar]")),
  };
}

const changes = (page: Page) => page.evaluate(() => (window as any).__changes);

test.describe("Date Picker", () => {
  test("點擊 trigger 開關面板，初始顯示今天所在月份", async ({ page }) => {
    await open(page);
    const dp = picker(page, "dp-basic");
    await expect(dp.content).toBeHidden();

    await dp.trigger.click();
    await expect(dp.content).toBeVisible();
    await expect(dp.cal.title).toHaveText("March 2026");
    // 2026/03：1 號為星期日，31 天 + 4 天下月補位 = 35 格
    await expect(dp.cal.cells).toHaveCount(35);
    await expect(dp.cal.grid.locator(".cu-calendar-day-outside")).toHaveText(["1", "2", "3", "4"]);
    await expect(dp.cal.today).toHaveCount(1);
    await expect(dp.cal.today).toHaveText("18");
    await expect(dp.cal.selected).toHaveCount(0);

    await dp.trigger.click();
    await expect(dp.content).toBeHidden();
  });

  test("外部點擊與 Escape 關閉；Escape 後焦點回到 trigger", async ({ page }) => {
    await open(page);
    const dp = picker(page, "dp-basic");

    await dp.trigger.click();
    await dp.cal.next.click(); // 面板內點擊不應關閉
    await expect(dp.content).toBeVisible();
    await page.click("#outside");
    await expect(dp.content).toBeHidden();

    await dp.trigger.click();
    await dp.cal.day(12).focus();
    await page.keyboard.press("Escape");
    await expect(dp.content).toBeHidden();
    await expect(dp.trigger).toBeFocused();
    await expect(dp.input).toHaveValue("");
  });

  test("月份切換：上 / 下個月、跨年，補位日期正確", async ({ page }) => {
    await open(page);
    const dp = picker(page, "dp-basic");
    await dp.trigger.click();

    await dp.cal.next.click();
    await expect(dp.cal.title).toHaveText("April 2026");
    // 2026/04/01 為星期三：前補 3 天（3/29–3/31）、後補 2 天（5/1–5/2）
    await expect(dp.cal.grid.locator(".cu-calendar-day-outside")).toHaveText(["29", "30", "31", "1", "2"]);
    await expect(dp.cal.cells).toHaveCount(35);
    await expect(dp.cal.today).toHaveCount(0);

    await dp.cal.prev.click();
    await dp.cal.prev.click();
    await expect(dp.cal.title).toHaveText("February 2026");
    await dp.cal.prev.click();
    await expect(dp.cal.title).toHaveText("January 2026");
    await dp.cal.prev.click();
    await expect(dp.cal.title).toHaveText("December 2025");
    await dp.cal.next.click();
    await expect(dp.cal.title).toHaveText("January 2026");
    await expect(dp.content).toBeVisible();
  });

  test("點選日期：寫回顯示值與 hidden input、觸發 change、關閉面板並讓焦點回到 trigger", async ({ page }) => {
    await open(page);
    const dp = picker(page, "dp-basic");
    await dp.trigger.click();
    await dp.cal.day(20).click();

    await expect(dp.content).toBeHidden();
    await expect(dp.value).toHaveText("2026/03/20");
    await expect(dp.value).not.toHaveClass(/cu-date-picker-trigger-placeholder/);
    await expect(dp.input).toHaveValue("2026-03-20");
    await expect(dp.trigger).toBeFocused();
    expect(await changes(page)).toEqual([{ id: "dp-basic", value: "2026-03-20" }]);
    expect(await page.evaluate(() => new FormData(document.getElementById("form") as HTMLFormElement).get("date"))).toBe(
      "2026-03-20",
    );
    // 在 <form> 內點選日期、切換月份都不應送出表單
    expect(await page.evaluate(() => (window as any).__submits)).toBeUndefined();

    // 重新開啟：選取日標記 selected，今天仍標記 today
    await dp.trigger.click();
    await expect(dp.cal.selected).toHaveText("20");
    await expect(dp.cal.today).toHaveText("18");

    // 選取今天：只標 selected，不再同時標 today
    await dp.cal.day(18).click();
    await dp.trigger.click();
    await expect(dp.cal.selected).toHaveText("18");
    await expect(dp.cal.today).toHaveCount(0);
    expect((await changes(page)).map((c: any) => c.value)).toEqual(["2026-03-20", "2026-03-18"]);
  });

  test("點選補位日期：月份與年份補零格式正確，重新開啟時跳到該月", async ({ page }) => {
    await open(page);
    const dp = picker(page, "dp-basic");
    await dp.trigger.click();
    await dp.cal.outsideDay(2).click();

    await expect(dp.value).toHaveText("2026/04/02");
    await expect(dp.input).toHaveValue("2026-04-02");

    await dp.trigger.click();
    await expect(dp.cal.title).toHaveText("April 2026");
    await expect(dp.cal.selected).toHaveText("2");
    await expect(dp.cal.selected).not.toHaveClass(/cu-calendar-day-outside/);
  });

  test("預設值：hidden input 的初始值顯示在 trigger，月曆開在該月份並標記選取", async ({ page }) => {
    // 「今天」在其他月份，確認月曆不是開在今天的月份
    await open(page, "2026-06-10T10:00:00+08:00");
    const dp = picker(page, "dp-default");
    await expect(dp.value).toHaveText("2026/03/15");
    await expect(dp.input).toHaveValue("2026-03-15");

    await dp.trigger.click();
    await expect(dp.cal.title).toHaveText("March 2026");
    await expect(dp.cal.selected).toHaveCount(1);
    await expect(dp.cal.selected).toHaveText("15");

    await dp.cal.next.click();
    await dp.cal.day(1).click();
    await expect(dp.value).toHaveText("2026/04/01");
    await expect(dp.input).toHaveValue("2026-04-01");
    expect(await changes(page)).toEqual([{ id: "dp-default", value: "2026-04-01" }]);
  });

  test("min / max：範圍外日期停用、無法選取，月份按鈕在邊界停用", async ({ page }) => {
    await open(page);
    const dp = picker(page, "dp-range");
    await dp.trigger.click();
    await expect(dp.cal.title).toHaveText("March 2026");

    await expect(dp.cal.prev).toBeDisabled();
    await expect(dp.cal.next).toBeEnabled();
    for (const n of [1, 5, 9]) {
      await expect(dp.cal.day(n)).toBeDisabled();
      await expect(dp.cal.day(n)).toHaveClass(/cu-calendar-day-disabled/);
    }
    await expect(dp.cal.day(10)).toBeEnabled();
    await expect(dp.cal.day(10)).not.toHaveClass(/cu-calendar-day-disabled/);
    await expect(dp.cal.grid.locator(".cu-calendar-day:disabled")).toHaveCount(9);

    await dp.cal.next.click();
    await expect(dp.cal.title).toHaveText("April 2026");
    await expect(dp.cal.next).toBeDisabled();
    await expect(dp.cal.prev).toBeEnabled();
    await expect(dp.cal.day(20)).toBeEnabled();
    await expect(dp.cal.day(21)).toBeDisabled();
    await expect(dp.cal.outsideDay(29)).toBeEnabled(); // 3/29 在範圍內
    await expect(dp.cal.outsideDay(1)).toBeDisabled(); // 5/1 超出範圍

    // 停用日期無法選取
    await dp.cal.day(25).click({ force: true });
    await expect(dp.content).toBeVisible();
    await expect(dp.input).toHaveValue("");

    await dp.cal.day(20).click();
    await expect(dp.value).toHaveText("2026/04/20");
    await expect(dp.input).toHaveValue("2026-04-20");
  });

  test("min / max：鍵盤導航不會移到範圍外，End 停在 max", async ({ page }) => {
    await open(page);
    const dp = picker(page, "dp-range");
    await dp.trigger.click();
    const cal = dp.cal;

    await cal.day(10).focus();
    await page.keyboard.press("ArrowLeft");
    await expect(cal.focused).toHaveText("10");
    await page.keyboard.press("ArrowUp");
    await expect(cal.focused).toHaveText("10");
    await page.keyboard.press("Home");
    await expect(cal.focused).toHaveText("10");
    await page.keyboard.press("ArrowDown");
    await expect(cal.focused).toHaveText("17");
    await expect(cal.title).toHaveText("March 2026");

    await cal.next.click();
    await cal.day(14).focus();
    await page.keyboard.press("End");
    await expect(cal.focused).toHaveText("20");
    await page.keyboard.press("ArrowRight");
    await expect(cal.focused).toHaveText("20");
    await expect(cal.title).toHaveText("April 2026");
  });

  test("Calendar 鍵盤：方向鍵逐日 / 逐週移動，Home / End 跳至月首 / 月末", async ({ page }) => {
    await open(page);
    const cal = calendar(page.locator("#cal"));
    await expect(cal.title).toHaveText("March 2026");

    await cal.day(18).focus();
    await page.keyboard.press("ArrowRight");
    await expect(cal.focused).toHaveText("19");
    await page.keyboard.press("ArrowLeft");
    await expect(cal.focused).toHaveText("18");
    await page.keyboard.press("ArrowDown");
    await expect(cal.focused).toHaveText("25");
    await page.keyboard.press("ArrowUp");
    await page.keyboard.press("ArrowUp");
    await expect(cal.focused).toHaveText("11");
    await page.keyboard.press("Home");
    await expect(cal.focused).toHaveText("1");
    await expect(cal.focused).not.toHaveClass(/cu-calendar-day-outside/);
    await page.keyboard.press("End");
    await expect(cal.focused).toHaveText("31");
    await expect(cal.title).toHaveText("March 2026");
    // 鍵盤移動焦點不等於選取
    await expect(cal.selected).toHaveCount(0);
  });

  test("Calendar 鍵盤：跨月移動時切換月份並聚焦正確日期", async ({ page }) => {
    await open(page);
    const cal = calendar(page.locator("#cal"));

    // 3/31 → 4/1
    await cal.day(31).focus();
    await page.keyboard.press("ArrowRight");
    await expect(cal.title).toHaveText("April 2026");
    await expect(cal.focused).toHaveText("1");
    await expect(cal.focused).not.toHaveClass(/cu-calendar-day-outside/);

    // 4/1 → 3/31
    await page.keyboard.press("ArrowLeft");
    await expect(cal.title).toHaveText("March 2026");
    await expect(cal.focused).toHaveText("31");
    await expect(cal.focused).not.toHaveClass(/cu-calendar-day-outside/);

    // 3/1 → 2/28
    await page.keyboard.press("Home");
    await page.keyboard.press("ArrowLeft");
    await expect(cal.title).toHaveText("February 2026");
    await expect(cal.focused).toHaveText("28");
    await expect(cal.focused).not.toHaveClass(/cu-calendar-day-outside/);

    // 2/28 → 3/7（逐週）→ 2/28
    await page.keyboard.press("ArrowDown");
    await expect(cal.title).toHaveText("March 2026");
    await expect(cal.focused).toHaveText("7");
    await page.keyboard.press("ArrowUp");
    await expect(cal.title).toHaveText("February 2026");
    await expect(cal.focused).toHaveText("28");

    // 跨年：2026/01/01 ← 2025/12/31
    await cal.prev.click();
    await expect(cal.title).toHaveText("January 2026");
    await cal.day(1).focus();
    await page.keyboard.press("ArrowLeft");
    await expect(cal.title).toHaveText("December 2025");
    await expect(cal.focused).toHaveText("31");
    await page.keyboard.press("ArrowRight");
    await expect(cal.title).toHaveText("January 2026");
    await expect(cal.focused).toHaveText("1");
  });

  test("Calendar 鍵盤：Enter / Space 選取聚焦日期，焦點留在選取的日期上", async ({ page }) => {
    await open(page);
    const cal = calendar(page.locator("#cal"));

    await cal.day(5).focus();
    await page.keyboard.press("Enter");
    await expect(cal.selected).toHaveText("5");
    await expect(cal.focused).toHaveText("5");

    // 選取後可繼續用鍵盤操作
    await page.keyboard.press("ArrowRight");
    await expect(cal.focused).toHaveText("6");
    await page.keyboard.press("Space");
    await expect(cal.selected).toHaveCount(1);
    await expect(cal.selected).toHaveText("6");
    await expect(cal.focused).toHaveText("6");
  });

  test("Date Picker 鍵盤流程：Enter 開啟、方向鍵移動、Enter 選取後焦點回到 trigger", async ({ page }) => {
    await open(page);
    const dp = picker(page, "dp-basic");

    await dp.trigger.focus();
    await page.keyboard.press("Enter");
    await expect(dp.content).toBeVisible();

    await dp.cal.day(18).focus();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await expect(dp.cal.focused).toHaveText("1");
    await expect(dp.cal.title).toHaveText("April 2026");
    await page.keyboard.press("Enter");

    await expect(dp.content).toBeHidden();
    await expect(dp.value).toHaveText("2026/04/01");
    await expect(dp.input).toHaveValue("2026-04-01");
    await expect(dp.trigger).toBeFocused();

    // Space 選取：keyup 不應在焦點回到 trigger 後又把面板打開
    await page.keyboard.press("Enter");
    await expect(dp.content).toBeVisible();
    await expect(dp.cal.title).toHaveText("April 2026");
    await dp.cal.day(10).focus();
    await page.keyboard.press("Space");
    await expect(dp.input).toHaveValue("2026-04-10");
    await expect(dp.content).toBeHidden();
    await expect(dp.trigger).toBeFocused();
  });

  test("開啟另一個 Date Picker 時，先前開啟的會關閉", async ({ page }) => {
    await open(page);
    const a = picker(page, "dp-basic");
    const b = picker(page, "dp-range");
    await a.trigger.click();
    await expect(a.content).toBeVisible();
    await b.trigger.click();
    await expect(b.content).toBeVisible();
    await expect(a.content).toBeHidden();
  });

  test("獨立 Calendar：點選日期更新選取狀態且不影響 Date Picker", async ({ page }) => {
    await open(page);
    const cal = calendar(page.locator("#cal"));
    await cal.day(9).click();
    await expect(cal.selected).toHaveText("9");
    await cal.day(10).click();
    await expect(cal.selected).toHaveCount(1);
    await expect(cal.selected).toHaveText("10");
    await expect(cal.focused).toHaveText("10");
    expect(await changes(page)).toEqual([]);
  });

  test("重複呼叫 init() 不會重複綁定事件", async ({ page }) => {
    await open(page);
    await page.evaluate(() => {
      CubbyUI.init();
      CubbyUI.init();
    });
    const dp = picker(page, "dp-basic");
    await dp.trigger.click();
    await expect(dp.content).toBeVisible();
    await expect(dp.cal.cells).toHaveCount(35);
    await dp.cal.next.click();
    await expect(dp.cal.title).toHaveText("April 2026");
    await dp.cal.day(3).click();
    await expect(dp.input).toHaveValue("2026-04-03");
    expect(await changes(page)).toHaveLength(1);
  });

  test.fixme("trigger 帶 aria-haspopup / aria-expanded，開啟時焦點移到選取日或今天", async ({ page }) => {
    // Date Picker 目前沒有任何 ARIA 狀態，開啟後焦點也留在 trigger。WAI-ARIA Date Picker Dialog 範式
    // 建議 trigger 設 aria-haspopup="dialog" + aria-expanded、開啟時聚焦選取日（無則今天）。
    // 屬於新增 ARIA 行為（需同步 document 級關閉邏輯），交由維護者決定。
    await open(page);
    const dp = picker(page, "dp-basic");
    await expect(dp.trigger).toHaveAttribute("aria-haspopup", "dialog");
    await expect(dp.trigger).toHaveAttribute("aria-expanded", "false");
    await dp.trigger.click();
    await expect(dp.trigger).toHaveAttribute("aria-expanded", "true");
    await expect(dp.cal.focused).toHaveText("18");
  });

  test.fixme("日期按鈕帶完整日期的無障礙名稱與選取 / 今天狀態", async ({ page }) => {
    // 日期按鈕目前只有數字文字（螢幕閱讀器只會讀「18」），也沒有 aria-selected / aria-current="date"。
    // 需決定語系格式（Intl.DateTimeFormat？）與 grid 語意（role="grid" + gridcell），交由維護者決定。
    await open(page);
    const cal = calendar(page.locator("#cal"));
    await expect(cal.today).toHaveAttribute("aria-current", "date");
    await cal.day(20).click();
    await expect(cal.selected).toHaveAttribute("aria-selected", "true");
    await expect(cal.selected).toHaveAccessibleName(/2026/);
  });
});
