import { test, expect, type Page } from "@playwright/test";
import { openFixture } from "./helpers";

declare const CubbyUI: any;

/**
 * Copy Button
 * ---------------------------------------------------------------------------
 * fixture 以 file:// 載入；Chromium 將 file:// 視為 secure context，
 * 授予 clipboard-read / clipboard-write 後 navigator.clipboard 可正常讀寫，
 * 因此直接以 readText() 驗證實際寫入剪貼簿的內容。
 */

// 同一檔案的測試依序在同一 worker 執行，避免共用剪貼簿互相干擾
test.describe.configure({ mode: "default" });

const SENTINEL = "__sentinel__";

async function readClipboard(page: Page): Promise<string> {
  return page.evaluate(() => navigator.clipboard.readText());
}

test.describe("Copy Button", () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await openFixture(page, "copy-button");
    await page.evaluate((s) => navigator.clipboard.writeText(s), SENTINEL);
  });

  test("data-cu-copy 寫入剪貼簿、切換圖示並在 duration 後還原", async ({ page }) => {
    const btn = page.locator("#by-value");
    await expect(btn.locator(".cu-copy-button-icon")).toBeVisible();
    await expect(btn.locator(".cu-copy-button-check")).toBeHidden();

    await btn.click();
    await expect(btn).toHaveAttribute("data-cu-copied", "");
    expect(await readClipboard(page)).toBe("usr_8f2a91c4");
    await expect(btn.locator(".cu-copy-button-icon")).toBeHidden();
    await expect(btn.locator(".cu-copy-button-check")).toBeVisible();

    // data-cu-copy-duration="400"
    await expect(btn).not.toHaveAttribute("data-cu-copied", { timeout: 2000 });
    await expect(btn.locator(".cu-copy-button-icon")).toBeVisible();
  });

  test("data-cu-copy-target 複製元素文字（去除首尾空白）並切換 label", async ({ page }) => {
    const btn = page.locator("#by-target");
    const label = btn.locator("[data-cu-copy-label]");
    await btn.click();
    await expect(btn).toHaveAttribute("data-cu-copied", "");
    expect(await readClipboard(page)).toBe("ord_01J9ZK4X7M2QH8");
    await expect(label).toHaveText("ID copied");
    await expect(label).toHaveText("Copy", { timeout: 2000 });
    await expect(btn).not.toHaveAttribute("data-cu-copied");
  });

  test("目標為 input 時複製點擊當下的 value", async ({ page }) => {
    await page.fill("#api-key", "sk_live_updated");
    await page.click("#by-input");
    await expect(page.locator("#by-input")).toHaveAttribute("data-cu-copied", "");
    expect(await readClipboard(page)).toBe("sk_live_updated");
  });

  test("aria-live 區域播報成功訊息，且整頁共用單一區域", async ({ page }) => {
    const live = page.locator("[data-cu-copy-live]");
    await expect(live).toHaveCount(1);
    await expect(live).toHaveAttribute("role", "status");
    await expect(live).toHaveAttribute("aria-live", "polite");
    await expect(live).toBeAttached();

    await page.click("#by-target");
    await expect(live).toHaveText("ID copied");
    await page.click("#by-value");
    await expect(live).toHaveText("Copied!");

    // 重複 init 不會建立第二個區域
    await page.evaluate(() => { CubbyUI.init(); CubbyUI.refresh(); });
    await expect(live).toHaveCount(1);
  });

  test("找不到目標時設定 data-cu-copy-failed、顯示錯誤訊息且不改動剪貼簿", async ({ page }) => {
    const btn = page.locator("#missing-target");
    await btn.click();
    await expect(btn).toHaveAttribute("data-cu-copy-failed", "");
    await expect(btn).not.toHaveAttribute("data-cu-copied");
    await expect(btn.locator("[data-cu-copy-label]")).toHaveText("Nothing to copy");
    await expect(page.locator("[data-cu-copy-live]")).toHaveText("Nothing to copy");
    expect(await readClipboard(page)).toBe(SENTINEL);
    await expect(btn).not.toHaveAttribute("data-cu-copy-failed", { timeout: 2000 });
    await expect(btn.locator("[data-cu-copy-label]")).toHaveText("Copy");
  });

  test("Clipboard API 被拒時改用 execCommand 後備方案", async ({ page }) => {
    await page.evaluate(() => {
      (window as any).__execCalls = 0;
      navigator.clipboard.writeText = () => Promise.reject(new Error("denied"));
      document.execCommand = ((cmd: string) => {
        (window as any).__execCalls++;
        return cmd === "copy";
      }) as typeof document.execCommand;
    });
    const btn = page.locator("#by-value");
    await btn.click();
    await expect(btn).toHaveAttribute("data-cu-copied", "");
    expect(await page.evaluate(() => (window as any).__execCalls)).toBe(1);
    // 後備方案的暫存 textarea 已移除，焦點還原到按鈕
    await expect(page.locator("textarea")).toHaveCount(0);
    await expect(btn).toBeFocused();
  });

  test("Clipboard API 不存在且 execCommand 失敗時顯示失敗狀態並觸發 error 事件", async ({ page }) => {
    await page.evaluate(() => {
      Object.defineProperty(navigator, "clipboard", { value: undefined, configurable: true });
      document.execCommand = (() => false) as typeof document.execCommand;
    });
    const btn = page.locator("#by-value");
    await btn.click();
    await expect(btn).toHaveAttribute("data-cu-copy-failed", "");
    await expect(page.locator("[data-cu-copy-live]")).toHaveText("Copy failed");
    expect(await page.evaluate(() => (window as any).__events)).toEqual([{ type: "error" }]);
  });

  test("成功時觸發可冒泡的 cu:copy-button:copy 事件", async ({ page }) => {
    await page.click("#by-value");
    await expect(page.locator("#by-value")).toHaveAttribute("data-cu-copied", "");
    expect(await page.evaluate(() => (window as any).__events)).toEqual([{ type: "copy", text: "usr_8f2a91c4" }]);
  });

  test("disabled 按鈕不會複製", async ({ page }) => {
    await page.locator("#disabled").click({ force: true });
    await page.waitForTimeout(150);
    await expect(page.locator("#disabled")).not.toHaveAttribute("data-cu-copied");
    expect(await readClipboard(page)).toBe(SENTINEL);
  });

  test("delegated listener：init 後動態新增的按鈕不需重新 init", async ({ page }) => {
    await page.evaluate(() => {
      document.getElementById("host")!.innerHTML =
        '<button id="dynamic" type="button" class="cu-copy-button" data-cu-copy="dynamic-value" aria-label="Copy">Copy</button>';
    });
    await page.click("#dynamic");
    await expect(page.locator("#dynamic")).toHaveAttribute("data-cu-copied", "");
    expect(await readClipboard(page)).toBe("dynamic-value");
  });

  test("destroy 移除 click listener，重新 init 後恢復且不重複註冊", async ({ page }) => {
    const initial = await page.evaluate(() => ({ ...(window as any).__listeners }));

    await page.evaluate(() => CubbyUI.destroy());
    const afterDestroy = await page.evaluate(() => ({ ...(window as any).__listeners }));
    expect(afterDestroy.click, "destroy 後 click listener 應歸零").toBe(0);

    const btn = page.locator("#by-value");
    await btn.click();
    await page.waitForTimeout(150);
    await expect(btn).not.toHaveAttribute("data-cu-copied");
    expect(await readClipboard(page)).toBe(SENTINEL);

    await page.evaluate(() => { CubbyUI.init(); CubbyUI.init(); });
    const afterInit = await page.evaluate(() => ({ ...(window as any).__listeners }));
    expect(afterInit.click, "重新 init 後 click listener 數量應與首次 init 相同").toBe(initial.click);

    await btn.click();
    await expect(btn).toHaveAttribute("data-cu-copied", "");
    expect(await readClipboard(page)).toBe("usr_8f2a91c4");
    // 單次點擊只觸發一次 copy 事件（listener 未重複綁定）
    expect(await page.evaluate(() => (window as any).__events.length)).toBe(1);
  });
});
