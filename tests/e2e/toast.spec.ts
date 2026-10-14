import { test, expect } from "@playwright/test";
import { openFixture } from "./helpers";

declare const CubbyUI: any;

test.describe("Toast", () => {
  test.beforeEach(async ({ page }) => {
    await openFixture(page, "toast");
  });

  test("trigger 建立 toast，容器具備 role=region", async ({ page }) => {
    const container = page.locator("[data-cu-toast-container]");
    await expect(container).toHaveAttribute("role", "region");
    await expect(container).toHaveCount(1);

    await page.click("#trigger");
    const toast = container.locator(".cu-toast");
    await expect(toast).toHaveCount(1);
    await expect(toast).toHaveClass(/cu-toast-success/);
    await expect(toast.locator(".cu-toast-title")).toHaveText("Saved!");
    await expect(toast.locator(".cu-toast-description")).toHaveText("Your changes have been saved.");
  });

  test("close 按鈕移除 toast", async ({ page }) => {
    await page.click("#trigger");
    const toast = page.locator(".cu-toast");
    await toast.locator("[data-cu-toast-close], .cu-toast-close").first().click();
    await expect(toast).toHaveCount(0);
  });

  test("close 按鈕有可讀名稱，預設 Close，可由容器 data-cu-toast-close-text 覆寫", async ({ page }) => {
    await page.click("#trigger");
    const closeBtn = page.locator(".cu-toast .cu-toast-close").first();
    await expect(closeBtn).toHaveAttribute("aria-label", "Close");
    await expect(closeBtn).toHaveAttribute("type", "button");
    await expect(closeBtn.locator("svg")).toHaveAttribute("aria-hidden", "true");
    await expect(page.getByRole("button", { name: "Close" })).toHaveCount(1);

    await page.evaluate(() => {
      document.querySelector("[data-cu-toast-container]")!.setAttribute("data-cu-toast-close-text", "關閉通知");
      CubbyUI.toast.show({ title: "Localized", duration: 0 });
    });
    await expect(page.getByRole("button", { name: "關閉通知" })).toHaveCount(1);
  });

  test("duration 到期自動消失", async ({ page }) => {
    await page.evaluate(() => CubbyUI.toast.show({ title: "Auto", duration: 200 }));
    const toast = page.locator(".cu-toast");
    await expect(toast).toHaveCount(1);
    await expect(toast).toHaveCount(0, { timeout: 3000 });
  });

  test('trigger 的 data-cu-toast-duration="0" 不自動消失', async ({ page }) => {
    await page.clock.install();
    await page.reload();
    await page.click("#trigger");
    await page.clock.runFor(10_000);
    await expect(page.locator(".cu-toast:not(.cu-toast-exit)")).toHaveCount(1);
  });

  test("trigger 未設定 data-cu-toast-duration 時沿用預設 5000ms", async ({ page }) => {
    await page.clock.install();
    await page.reload();
    await page.click("#trigger-default");
    const live = page.locator(".cu-toast:not(.cu-toast-exit)");
    await page.clock.runFor(4_900);
    await expect(live).toHaveCount(1);
    await page.clock.runFor(200);
    await expect(live).toHaveCount(0);
  });

  test("堆疊上限：超出 data-cu-toast-max 時移除最舊通知", async ({ page }) => {
    await page.evaluate(() => {
      for (let i = 1; i <= 5; i++) CubbyUI.toast.show({ title: "Toast " + i, duration: 0 });
    });
    const live = page.locator(".cu-toast:not(.cu-toast-exit)");
    await expect(live).toHaveCount(3);
    await expect(page.locator(".cu-toast")).toHaveCount(3);
    await expect(live.first().locator(".cu-toast-title")).toHaveText("Toast 3");
    await expect(live.last().locator(".cu-toast-title")).toHaveText("Toast 5");
  });

  test("XSS：title / description 以純文字呈現，不解析 HTML", async ({ page }) => {
    const payload = '<img src=x onerror="window.__xss = 1">';
    await page.evaluate((p) => CubbyUI.toast.show({ title: p, description: p, duration: 0 }), payload);
    const toast = page.locator(".cu-toast");
    await expect(toast.locator(".cu-toast-title")).toHaveText(payload);
    await expect(toast.locator("img")).toHaveCount(0);
    expect(await page.evaluate(() => (window as any).__xss)).toBeUndefined();
  });

  test("action：渲染按鈕，點擊呼叫 onClick 並關閉 toast", async ({ page }) => {
    await page.evaluate(() => {
      (window as any).__calls = [];
      CubbyUI.toast.show({
        title: "Event deleted",
        duration: 0,
        action: {
          label: "Undo",
          onClick: (e: MouseEvent, toast: HTMLElement) =>
            (window as any).__calls.push([e.type, toast.classList.contains("cu-toast")]),
        },
      });
    });
    const toast = page.locator(".cu-toast");
    const btn = toast.locator(".cu-toast-body .cu-toast-action .cu-toast-action-btn");
    await expect(btn).toHaveText("Undo");
    await expect(btn).toHaveAttribute("type", "button");
    await btn.click();
    expect(await page.evaluate(() => (window as any).__calls)).toEqual([["click", true]]);
    await expect(toast).toHaveCount(0);
  });

  test("action：onClick 呼叫 preventDefault 時保留 toast", async ({ page }) => {
    await page.evaluate(() =>
      CubbyUI.toast.show({
        title: "Keep",
        duration: 0,
        action: { label: "Retry", onClick: (e: MouseEvent) => e.preventDefault() },
      }),
    );
    await page.locator(".cu-toast-action-btn").click();
    await expect(page.locator(".cu-toast:not(.cu-toast-exit)")).toHaveCount(1);
  });

  test("action：label 以純文字呈現；未提供 action 時不渲染", async ({ page }) => {
    const payload = '<img src=x onerror="window.__xss = 1">';
    await page.evaluate((p) => {
      CubbyUI.toast.show({ title: "A", duration: 0, action: { label: p } });
      CubbyUI.toast.show({ title: "B", duration: 0 });
    }, payload);
    const toasts = page.locator(".cu-toast");
    await expect(toasts.nth(0).locator(".cu-toast-action-btn")).toHaveText(payload);
    await expect(toasts.nth(0).locator("img")).toHaveCount(0);
    await expect(toasts.nth(1).locator(".cu-toast-action")).toHaveCount(0);
    expect(await page.evaluate(() => (window as any).__xss)).toBeUndefined();
  });

  test("promise API：loading → success", async ({ page }) => {
    // 由測試控制 resolve 時機：先確認 loading 狀態再 resolve。
    // 原本用 150ms 計時器自動 resolve，高負載時斷言還沒輪到就已 resolve，偶發抓不到 loading。
    await page.evaluate(() => {
      (window as any).__p = CubbyUI.toast.promise(
        new Promise((resolve) => {
          (window as any).__resolve = resolve;
        }),
        { loading: "Saving…", success: "Saved", error: "Failed" },
      );
    });
    const toast = page.locator(".cu-toast");
    await expect(toast).toHaveCount(1);
    await expect(toast.locator(".cu-toast-title")).toHaveText("Saving…");
    await page.evaluate(() => (window as any).__resolve("ok"));
    await expect(toast.locator(".cu-toast-title")).toHaveText("Saved");
    await expect(toast).toHaveClass(/cu-toast-success/);
    expect(await page.evaluate(() => (window as any).__p)).toBe("ok");
  });

  test("promise API：loading → error 並重新拋出", async ({ page }) => {
    const result = await page.evaluate(() =>
      CubbyUI.toast
        .promise(Promise.reject(new Error("boom")), { loading: "Working", success: "Done", error: "Failed" })
        .then(
          () => "resolved",
          (e: Error) => e.message,
        ),
    );
    expect(result).toBe("boom");
    const toast = page.locator(".cu-toast");
    await expect(toast.locator(".cu-toast-title")).toHaveText("Failed");
    await expect(toast).toHaveClass(/cu-toast-destructive/);
  });
});
