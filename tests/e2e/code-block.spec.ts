import { test, expect, type Page } from "@playwright/test";
import { openFixture } from "./helpers";

declare const CubbyUI: any;

/**
 * Code Block 複製
 * ---------------------------------------------------------------------------
 * 與 copy-button.spec.ts 相同：fixture 以 file:// 載入（Chromium 視為 secure context），
 * 授予 clipboard-read / clipboard-write 後以 readText() 驗證實際寫入剪貼簿的內容。
 * 狀態固定在 2000ms 後還原。
 */

// 同一檔案的測試依序在同一 worker 執行，避免共用剪貼簿互相干擾
test.describe.configure({ mode: "default" });

const SENTINEL = "__sentinel__";
const RESET_TIMEOUT = 4000;

/** fixture #multiline 的 <pre> textContent：entity 解碼、保留 Tab / 空行 / 尾端空白 / 結尾換行 */
const MULTILINE_TEXT =
  "const html = `<a href=\"/?q=1&r=2\">${name}</a>`;\n" +
  "\tif (a && b || c) { console.log('它\\'s \"ok\" 🎉'); }\n" +
  "\n" +
  "// trailing   spaces   \n";

async function readClipboard(page: Page): Promise<string> {
  return page.evaluate(() => navigator.clipboard.readText());
}

/** 移除 navigator.clipboard（模擬 http:// 或舊瀏覽器），原物件保留在 window.__clip 供讀取 */
async function removeClipboardApi(page: Page): Promise<void> {
  await page.evaluate(() => {
    (window as any).__clip = navigator.clipboard;
    Object.defineProperty(navigator, "clipboard", { value: undefined, configurable: true });
  });
}

async function events(page: Page): Promise<any[]> {
  return page.evaluate(() => (window as any).__events);
}

test.describe("Code Block", () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await openFixture(page, "code-block");
    await page.evaluate((s) => navigator.clipboard.writeText(s), SENTINEL);
  });

  test("複製單行內容：設定 data-cu-copied、label 顯示訊息，之後還原", async ({ page }) => {
    const btn = page.locator("#basic-copy");
    const label = btn.locator("[data-cu-code-block-label]");

    await btn.click();
    await expect(btn).toHaveAttribute("data-cu-copied", "");
    await expect(btn).not.toHaveAttribute("data-cu-copy-failed");
    expect(await readClipboard(page)).toBe("npm install cubby-ui");
    await expect(label).toHaveText("Copied!");
    expect(await events(page)).toEqual([{ type: "copy", id: "basic-copy", text: "npm install cubby-ui" }]);

    await expect(btn).not.toHaveAttribute("data-cu-copied", { timeout: RESET_TIMEOUT });
    await expect(label).toHaveText("Copy");
    // 還原時清掉自己寫入的播報內容
    await expect(page.locator("[data-cu-copy-live]")).toHaveText("");
  });

  test("多行與特殊字元原樣寫入剪貼簿（換行、Tab、HTML entity、引號、emoji、尾端空白）", async ({ page }) => {
    await page.click("#multiline-copy");
    await expect(page.locator("#multiline-copy")).toHaveAttribute("data-cu-copied", "");
    const copied = await readClipboard(page);
    expect(copied).toBe(MULTILINE_TEXT);
    // 與 <pre> 的 textContent 完全一致（不 trim、不改寫）
    expect(copied).toBe(await page.locator("#multiline .cu-code-block-pre").evaluate((el) => el.textContent));
    // header 內的檔名不會混入
    expect(copied).not.toContain("example.js");
  });

  test("自訂訊息：label 與播報使用 data-cu-code-block-success-text，還原為原本的 label 文字", async ({ page }) => {
    const btn = page.locator("#custom-copy");
    const label = btn.locator("[data-cu-code-block-label]");

    await btn.click();
    await expect(btn).toHaveAttribute("data-cu-copied", "");
    expect(await readClipboard(page)).toBe("pnpm add cubby-ui");
    await expect(label).toHaveText("已複製");
    await expect(page.locator("[data-cu-copy-live]")).toHaveText("已複製");

    await expect(label).toHaveText("複製", { timeout: RESET_TIMEOUT });
    await expect(btn).not.toHaveAttribute("data-cu-copied");
  });

  test("aria-live：載入時即建立，並與 Copy Button 共用單一 [data-cu-copy-live] 區域", async ({ page }) => {
    const live = page.locator("[data-cu-copy-live]");
    await expect(live).toHaveCount(1);
    await expect(live).toHaveAttribute("role", "status");
    await expect(live).toHaveAttribute("aria-live", "polite");
    await expect(live).toHaveAttribute("aria-atomic", "true");

    await page.click("#basic-copy");
    await expect(live).toHaveText("Copied!");
    await page.click("#copy-button");
    await expect(live).toHaveText("ID copied");
    await page.click("#custom-copy");
    await expect(live).toHaveText("已複製");
    await expect(live).toHaveCount(1);
  });

  test("Clipboard API 被拒時改用 execCommand 後備方案", async ({ page }) => {
    await page.evaluate(() => {
      (window as any).__execCalls = [];
      navigator.clipboard.writeText = () => Promise.reject(new Error("denied"));
      document.execCommand = ((cmd: string) => {
        // 記錄執行當下的暫存 textarea 內容
        (window as any).__execCalls.push({ cmd, value: document.querySelector("textarea")!.value });
        return cmd === "copy";
      }) as typeof document.execCommand;
    });
    const btn = page.locator("#multiline-copy");
    await btn.click();
    await expect(btn).toHaveAttribute("data-cu-copied", "");
    expect(await page.evaluate(() => (window as any).__execCalls)).toEqual([{ cmd: "copy", value: MULTILINE_TEXT }]);
    // 暫存 textarea 已移除，焦點還原到按鈕
    await expect(page.locator("textarea")).toHaveCount(0);
    await expect(btn).toBeFocused();
    expect(await events(page)).toEqual([{ type: "copy", id: "multiline-copy", text: MULTILINE_TEXT }]);
  });

  test("Clipboard API 不存在時以 execCommand 實際寫入剪貼簿", async ({ page }) => {
    await removeClipboardApi(page);
    const btn = page.locator("#multiline-copy");
    await btn.click();
    await expect(btn).toHaveAttribute("data-cu-copied", "");
    expect(await page.evaluate(() => (window as any).__clip.readText())).toBe(MULTILINE_TEXT);
  });

  test("Clipboard API 不存在且 execCommand 失敗：設定 data-cu-copy-failed、播報錯誤並觸發 error 事件，之後還原", async ({ page }) => {
    await removeClipboardApi(page);
    await page.evaluate(() => { document.execCommand = (() => false) as typeof document.execCommand; });

    const btn = page.locator("#basic-copy");
    const label = btn.locator("[data-cu-code-block-label]");
    await btn.click();
    await expect(btn).toHaveAttribute("data-cu-copy-failed", "");
    await expect(btn).not.toHaveAttribute("data-cu-copied");
    await expect(label).toHaveText("Copy failed");
    await expect(page.locator("[data-cu-copy-live]")).toHaveText("Copy failed");
    expect(await events(page)).toEqual([{ type: "error", id: "basic-copy" }]);
    expect(await page.evaluate(() => (window as any).__clip.readText())).toBe(SENTINEL);

    await expect(btn).not.toHaveAttribute("data-cu-copy-failed", { timeout: RESET_TIMEOUT });
    await expect(label).toHaveText("Copy");
  });

  test("自訂錯誤訊息 data-cu-code-block-error-text", async ({ page }) => {
    await removeClipboardApi(page);
    await page.evaluate(() => { document.execCommand = (() => false) as typeof document.execCommand; });

    const btn = page.locator("#custom-copy");
    await btn.click();
    await expect(btn).toHaveAttribute("data-cu-copy-failed", "");
    await expect(btn.locator("[data-cu-code-block-label]")).toHaveText("複製失敗");
    await expect(page.locator("[data-cu-copy-live]")).toHaveText("複製失敗");
  });

  test("失敗後再次複製成功時改為 data-cu-copied 並移除 data-cu-copy-failed", async ({ page }) => {
    await page.evaluate(() => {
      const clip = navigator.clipboard;
      (window as any).__origWrite = clip.writeText.bind(clip);
      (window as any).__origExec = document.execCommand.bind(document);
      clip.writeText = () => Promise.reject(new Error("denied"));
      document.execCommand = (() => false) as typeof document.execCommand;
    });
    const btn = page.locator("#basic-copy");
    await btn.click();
    await expect(btn).toHaveAttribute("data-cu-copy-failed", "");

    await page.evaluate(() => {
      navigator.clipboard.writeText = (window as any).__origWrite;
      document.execCommand = (window as any).__origExec;
    });
    await btn.click();
    await expect(btn).toHaveAttribute("data-cu-copied", "");
    await expect(btn).not.toHaveAttribute("data-cu-copy-failed");
    await expect(btn.locator("[data-cu-code-block-label]")).toHaveText("Copied!");
    expect(await readClipboard(page)).toBe("npm install cubby-ui");

    // 連續觸發只保留最後一次的計時器，最終還原為原本的 label
    await expect(btn).not.toHaveAttribute("data-cu-copied", { timeout: RESET_TIMEOUT });
    await expect(btn.locator("[data-cu-code-block-label]")).toHaveText("Copy");
  });

  test("重複 init() / refresh() 不重複綁定：單次點擊只複製一次", async ({ page }) => {
    await page.evaluate(() => { CubbyUI.init(); CubbyUI.init(); CubbyUI.refresh(); });
    await page.click("#basic-copy");
    await expect(page.locator("#basic-copy")).toHaveAttribute("data-cu-copied", "");
    expect(await events(page)).toEqual([{ type: "copy", id: "basic-copy", text: "npm install cubby-ui" }]);
    await expect(page.locator("[data-cu-copy-live]")).toHaveCount(1);
  });

  test("destroy() 後再 init()：不拋錯、仍只綁定一次且 live region 不重複", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.evaluate(() => { CubbyUI.destroy(); CubbyUI.init(); CubbyUI.init(); });
    const btn = page.locator("#multiline-copy");
    await btn.click();
    await expect(btn).toHaveAttribute("data-cu-copied", "");
    expect(await readClipboard(page)).toBe(MULTILINE_TEXT);
    expect(await events(page)).toEqual([{ type: "copy", id: "multiline-copy", text: MULTILINE_TEXT }]);
    await expect(page.locator("[data-cu-copy-live]")).toHaveCount(1);
    expect(errors).toEqual([]);
  });

  test("init() 後動態新增的 Code Block 呼叫 CubbyUI.init() 即可複製", async ({ page }) => {
    await page.evaluate(() => {
      document.getElementById("host")!.innerHTML =
        '<div class="cu-code-block" data-cu-code-block>' +
        '<button id="dynamic-copy" type="button" class="cu-code-block-copy" data-cu-code-block-copy><span data-cu-code-block-label>Copy</span></button>' +
        '<pre class="cu-code-block-pre"><code>echo "dynamic"</code></pre></div>';
      CubbyUI.init();
    });
    await page.click("#dynamic-copy");
    await expect(page.locator("#dynamic-copy")).toHaveAttribute("data-cu-copied", "");
    expect(await readClipboard(page)).toBe('echo "dynamic"');
  });
});
