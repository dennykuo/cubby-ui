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

  test("duration 到期自動消失", async ({ page }) => {
    await page.evaluate(() => CubbyUI.toast.show({ title: "Auto", duration: 200 }));
    const toast = page.locator(".cu-toast");
    await expect(toast).toHaveCount(1);
    await expect(toast).toHaveCount(0, { timeout: 3000 });
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

  test("promise API：loading → success", async ({ page }) => {
    await page.evaluate(() => {
      (window as any).__p = CubbyUI.toast.promise(
        new Promise((resolve) => setTimeout(() => resolve("ok"), 150)),
        { loading: "Saving…", success: "Saved", error: "Failed" }
      );
    });
    const toast = page.locator(".cu-toast");
    await expect(toast).toHaveCount(1);
    await expect(toast.locator(".cu-toast-title")).toHaveText("Saving…");
    await expect(toast.locator(".cu-toast-title")).toHaveText("Saved");
    await expect(toast).toHaveClass(/cu-toast-success/);
    expect(await page.evaluate(() => (window as any).__p)).toBe("ok");
  });

  test("promise API：loading → error 並重新拋出", async ({ page }) => {
    const result = await page.evaluate(() =>
      CubbyUI.toast
        .promise(Promise.reject(new Error("boom")), { loading: "Working", success: "Done", error: "Failed" })
        .then(() => "resolved", (e: Error) => e.message)
    );
    expect(result).toBe("boom");
    const toast = page.locator(".cu-toast");
    await expect(toast.locator(".cu-toast-title")).toHaveText("Failed");
    await expect(toast).toHaveClass(/cu-toast-destructive/);
  });
});
