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
    expect(
      await page.evaluate(() => new FormData(document.getElementById("form") as HTMLFormElement).get("date")),
    ).toBe("2026-03-20");
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

  test("APG Date Picker Dialog：trigger 帶 aria-haspopup / aria-expanded / aria-controls，面板為以月份命名的 dialog", async ({
    page,
  }) => {
    await open(page);
    const dp = picker(page, "dp-basic");
    await expect(dp.trigger).toHaveAttribute("aria-haspopup", "dialog");
    await expect(dp.trigger).toHaveAttribute("aria-expanded", "false");
    const contentId = await dp.content.getAttribute("id");
    expect(contentId).toBeTruthy();
    await expect(dp.trigger).toHaveAttribute("aria-controls", contentId!);
    await expect(dp.content).toHaveAttribute("role", "dialog");
    // 非模態：點外部 / Escape 關閉，不困住焦點
    await expect(dp.content).not.toHaveAttribute("aria-modal");

    await dp.trigger.click();
    await expect(dp.trigger).toHaveAttribute("aria-expanded", "true");
    await expect(dp.content).toHaveAccessibleName("March 2026");

    // 每種關閉方式都同步 aria-expanded：Escape、外部點擊、選取日期、再點 trigger
    await page.keyboard.press("Escape");
    await expect(dp.content).toBeHidden();
    await expect(dp.trigger).toHaveAttribute("aria-expanded", "false");
    await dp.trigger.click();
    await page.click("#outside");
    await expect(dp.content).toBeHidden();
    await expect(dp.trigger).toHaveAttribute("aria-expanded", "false");
    await dp.trigger.click();
    await dp.cal.day(20).click();
    await expect(dp.content).toBeHidden();
    await expect(dp.trigger).toHaveAttribute("aria-expanded", "false");
    await dp.trigger.click();
    await expect(dp.trigger).toHaveAttribute("aria-expanded", "true");
    await dp.trigger.click();
    await expect(dp.content).toBeHidden();
    await expect(dp.trigger).toHaveAttribute("aria-expanded", "false");

    // 開啟另一個 Date Picker 會關閉這個
    await dp.trigger.click();
    await picker(page, "dp-range").trigger.click();
    await expect(dp.trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("開啟時焦點移到選取日；沒有選取時為今天，並切回該日所在月份", async ({ page }) => {
    await open(page);
    const dp = picker(page, "dp-basic");

    await dp.trigger.click();
    await expect(dp.cal.focused).toHaveText("18");
    await expect(dp.cal.focused).toHaveAttribute("aria-current", "date");

    // 瀏覽到其他月份後關閉，再開啟時回到今天所在月份
    await dp.cal.next.click();
    await expect(dp.cal.title).toHaveText("April 2026");
    await page.keyboard.press("Escape");
    await expect(dp.trigger).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(dp.cal.title).toHaveText("March 2026");
    await expect(dp.cal.focused).toHaveText("18");

    // 鍵盤選取 3/20 後重新開啟：焦點在選取日
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");
    await expect(dp.input).toHaveValue("2026-03-20");
    await expect(dp.trigger).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(dp.cal.focused).toHaveText("20");
    await expect(dp.cal.focused).toHaveAttribute("aria-selected", "true");
  });

  test("開啟時：選取日在其他月份時切到該月；今天不在 min / max 範圍內時聚焦範圍內第一個可選日期", async ({ page }) => {
    // 預設值 3/15、今天 6/10
    await open(page, "2026-06-10T10:00:00+08:00");
    const def = picker(page, "dp-default");
    await def.trigger.click();
    await expect(def.cal.title).toHaveText("March 2026");
    await expect(def.cal.focused).toHaveText("15");

    // 範圍 3/10–4/20，今天 6/10 在範圍之後 → 3/10
    const range = picker(page, "dp-range");
    await range.trigger.click();
    await expect(range.cal.title).toHaveText("March 2026");
    await expect(range.cal.focused).toHaveText("10");
    await expect(range.cal.focused).toBeEnabled();

    // 今天 2/1 在範圍之前 → 3/10
    await open(page, "2026-02-01T10:00:00+08:00");
    await range.trigger.click();
    await expect(range.cal.title).toHaveText("March 2026");
    await expect(range.cal.focused).toHaveText("10");
  });

  test("min / max：今天不在範圍內時，初始月份落在範圍內（不會開在全部停用的月份）", async ({ page }) => {
    // 今天 6/10 在範圍 3/10–4/20 之後
    await open(page, "2026-06-10T10:00:00+08:00");
    const cal = calendar(page.locator("#cal-range"));
    await expect(cal.title).toHaveText("March 2026");
    await expect(cal.day(10)).toBeEnabled();
    await expect(cal.day(10)).toHaveAttribute("tabindex", "0");
    await expect(cal.prev).toBeDisabled();
    // Date Picker 的月曆在開啟前就已落在範圍內
    await expect(picker(page, "dp-range").cal.title).toHaveText("March 2026");

    // 今天 2/1 在範圍之前
    await open(page, "2026-02-01T10:00:00+08:00");
    await expect(cal.title).toHaveText("March 2026");
    await expect(cal.grid.locator(".cu-calendar-day:not(.cu-calendar-day-outside):not(:disabled)")).toHaveCount(22);

    // 今天在範圍內時維持今天所在月份
    await open(page, "2026-04-05T10:00:00+08:00");
    await expect(cal.title).toHaveText("April 2026");
    await expect(cal.today).toHaveText("5");
  });

  test("APG grid：月曆為以月份命名的 grid，每週一列 row，日期為 gridcell", async ({ page }) => {
    await open(page);
    const cal = calendar(page.locator("#cal"));
    await expect(cal.grid).toHaveAttribute("role", "grid");
    await expect(cal.grid).toHaveAccessibleName("March 2026");
    const rows = cal.grid.locator(':scope > [role="row"]');
    await expect(rows).toHaveCount(5);
    for (const row of await rows.all()) {
      await expect(row.locator(':scope > [role="gridcell"]')).toHaveCount(7);
    }
    await expect(cal.grid.locator('[role="gridcell"]')).toHaveCount(35);
    // 6 週的月份：2026/08（1 號為星期六）
    await cal.next.click();
    await cal.next.click();
    await cal.next.click();
    await cal.next.click();
    await cal.next.click();
    await expect(cal.title).toHaveText("August 2026");
    await expect(rows).toHaveCount(6);
    await expect(cal.grid).toHaveAccessibleName("August 2026");
  });

  test("日期按鈕帶完整日期的無障礙名稱與選取 / 今天狀態", async ({ page }) => {
    await open(page);
    const cal = calendar(page.locator("#cal"));
    await expect(cal.day(18)).toHaveAccessibleName("Wednesday, March 18, 2026");
    await expect(cal.outsideDay(1)).toHaveAccessibleName("Wednesday, April 1, 2026");
    // 數字仍是視覺文字
    await expect(cal.day(18)).toHaveText("18");

    await expect(cal.today).toHaveAttribute("aria-current", "date");
    await expect(cal.grid.locator('[aria-current="date"]')).toHaveCount(1);
    await expect(cal.grid.locator("[aria-selected]")).toHaveCount(0);

    await cal.day(20).click();
    await expect(cal.selected).toHaveAttribute("aria-selected", "true");
    await expect(cal.selected).toHaveAccessibleName("Friday, March 20, 2026");
    await expect(cal.grid.locator("[aria-selected]")).toHaveCount(1);

    // 選取今天：視覺上只標 selected，語意上仍是今天
    await cal.day(18).click();
    await expect(cal.day(18)).toHaveAttribute("aria-selected", "true");
    await expect(cal.day(18)).toHaveAttribute("aria-current", "date");
    await expect(cal.grid.locator("[aria-selected]")).toHaveCount(1);

    // Date Picker 內的月曆同樣適用
    const dp = picker(page, "dp-range");
    await dp.trigger.click();
    await expect(dp.cal.day(18)).toHaveAccessibleName("Wednesday, March 18, 2026");
    await expect(dp.cal.day(18)).toHaveAttribute("aria-current", "date");
    await expect(dp.cal.day(9)).toBeDisabled();
    await expect(dp.cal.grid).toHaveAttribute("role", "grid");
  });

  test("Roving tabindex：月曆只有一個 Tab 停駐點，跟隨焦點移動", async ({ page }) => {
    await open(page);
    const cal = calendar(page.locator("#cal"));
    const stops = cal.grid.locator('[tabindex="0"]');
    // 沒有選取時為今天
    await expect(stops).toHaveCount(1);
    await expect(stops).toHaveText("18");
    await expect(cal.grid.locator('[tabindex="-1"]')).toHaveCount(34);

    await cal.day(18).focus();
    await page.keyboard.press("ArrowRight");
    await expect(cal.focused).toHaveText("19");
    await expect(stops).toHaveCount(1);
    await expect(stops).toHaveText("19");

    // Tab 離開月曆，Shift+Tab 回到最後聚焦的日期
    await page.keyboard.press("Tab");
    await expect(page.locator("#outside")).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(cal.focused).toHaveText("19");

    // 換月重繪後：選取日優先，其次今天，否則本月第一個可選日期
    await cal.day(5).click();
    await expect(stops).toHaveText("5");
    await cal.next.click();
    await expect(stops).toHaveCount(1);
    await expect(stops).toHaveText("1");
    await expect(stops).not.toHaveClass(/cu-calendar-day-outside/);

    // min / max：停駐點不會落在停用日期
    const dp = picker(page, "dp-range");
    await open(page, "2026-02-01T10:00:00+08:00");
    await dp.trigger.click();
    await expect(dp.cal.grid.locator('[tabindex="0"]')).toHaveText("10");
  });

  test("鍵盤焦點可見：日期按鈕 focus-visible 時有焦點環（含選取日）", async ({ page }) => {
    await open(page);
    const cal = calendar(page.locator("#cal"));
    const ring = () => cal.focused.evaluate((el) => getComputedStyle(el).boxShadow);
    await cal.day(18).focus();
    await page.keyboard.press("ArrowRight");
    await expect(cal.focused).toHaveText("19");
    expect(await ring()).not.toBe("none");
    await page.keyboard.press("Enter");
    await expect(cal.focused).toHaveClass(/cu-calendar-day-selected/);
    expect(await ring()).not.toBe("none");
  });

  // zh-TW 的日期與星期之間是否有空白取決於瀏覽器的 ICU 版本（本機 Chromium 有、CI 安裝的沒有）
  const ZH_TW_MAR_18 = /^2026年3月18日\s?星期三$/;

  test("日期名稱與月份標題語系：取最近祖先的 lang，data-cu-calendar-locale 可覆寫，無效語系略過", async ({ page }) => {
    await open(page);
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    const zh = calendar(page.locator("#cal-zh"));
    await expect(zh.day(18)).toHaveAccessibleName(ZH_TW_MAR_18);
    // 月份標題同樣跟著語系（也是 grid / 面板的名稱）
    await expect(zh.title).toHaveText("2026年3月");
    await expect(zh.grid).toHaveAccessibleName("2026年3月");

    const gb = calendar(page.locator("#cal-locale"));
    await expect(gb.day(18)).toHaveAccessibleName(/^Wednesday,? 18 March 2026$/);
    await expect(gb.title).toHaveText("March 2026");

    // 語系在每次重繪時讀取；無效的語系標籤不拋錯，退回瀏覽器預設語系
    const cal = calendar(page.locator("#cal"));
    await page.locator("#cal").evaluate((el) => el.setAttribute("data-cu-calendar-locale", "not a locale!"));
    await cal.next.click();
    await cal.prev.click();
    await expect(cal.day(18)).toHaveAccessibleName("Wednesday, March 18, 2026");
    await expect(cal.title).toHaveText("March 2026");
    await page.locator("#cal").evaluate((el) => el.setAttribute("data-cu-calendar-locale", "zh-TW"));
    await cal.next.click();
    await cal.prev.click();
    await expect(cal.day(18)).toHaveAccessibleName(ZH_TW_MAR_18);
    await expect(cal.title).toHaveText("2026年3月");
    expect(errors).toEqual([]);
  });

  test.describe("瀏覽器語系為 zh-TW", () => {
    test.use({ locale: "zh-TW" });

    test("頁面與月曆都沒有指定語系時退回 en-US，不跟著瀏覽器語系（與預設英文星期列一致）", async ({ page }) => {
      await open(page);
      await page.evaluate(() => document.querySelectorAll("[lang]").forEach((el) => el.removeAttribute("lang")));
      const cal = calendar(page.locator("#cal"));
      await cal.next.click();
      await cal.prev.click();
      await expect(cal.title).toHaveText("March 2026");
      await expect(cal.day(18)).toHaveAccessibleName("Wednesday, March 18, 2026");
      // 確認測試環境確實是 zh-TW，否則這個測試無法區分兩種退回方式
      expect(await page.evaluate(() => new Intl.DateTimeFormat().resolvedOptions().locale)).toMatch(/^zh/);
    });
  });
});
