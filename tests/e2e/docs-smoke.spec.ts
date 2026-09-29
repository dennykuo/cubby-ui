import { test, expect } from "@playwright/test";
import { createServer, type Server } from "node:http";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { AddressInfo } from "node:net";

/**
 * 文檔站 smoke test
 * ---------------------------------------------------------------------------
 * 逐一載入 `npm run build:docs` 產出的所有元件頁與範例頁，確認：
 *   - 沒有未捕捉的 JS 例外（含 ComponentPreview 的 iframe）
 *   - 沒有來自 cubby-ui.js 的 console error
 *   - window.CubbyUI 已就緒，且重複呼叫 init() / refresh() 不會拋錯
 *   - 同源資源（CSS、JS、favicon、iframe 預覽載入的產物）沒有 4xx / 5xx
 * 這是 JS 打包產物的廣域行為驗證：每個元件頁都會實際初始化該元件的所有變體。
 * docs/ 不存在時整組略過（本機未建置文檔站）。
 *
 * 設定 BASE_PATH（如 `/cubby-ui`，需與 build:docs 時相同）時，伺服器只在該子路徑下
 * 提供 docs/，模擬 GitHub Pages 專案站；寫死根路徑的資源會 404 而使測試失敗。
 */
const ROOT = resolve(fileURLToPath(new URL(".", import.meta.url)), "../..");
const DOCS = resolve(ROOT, "docs");
const BASE = (process.env.BASE_PATH || "/").replace(/\/+$/, "");
const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".json": "application/json",
};

function collectPages(dir: string, prefix = ""): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) out.push(...collectPages(join(dir, entry.name), `${prefix}/${entry.name}`));
    else if (entry.name === "index.html") out.push(`${prefix}/`);
  }
  return out;
}

/** 只跑英文頁；zh-tw 是同一份頁面的複製，互動 JS 行為相同 */
const pages = existsSync(DOCS)
  ? collectPages(DOCS).filter((p) => !p.startsWith("/zh-tw/") && (p.startsWith("/components/") || p.startsWith("/examples/") || p === "/playground/"))
  : [];

let server: Server;
let origin: string;
let baseURL: string;

test.beforeAll(async () => {
  test.skip(pages.length === 0, "docs/ 尚未建置，請先執行 npm run build:docs");
  server = createServer((req, res) => {
    let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    if (BASE) {
      if (urlPath !== BASE && !urlPath.startsWith(`${BASE}/`)) { res.writeHead(404); res.end(); return; }
      urlPath = urlPath.slice(BASE.length) || "/";
    }
    let filePath = normalize(join(DOCS, urlPath));
    if (!filePath.startsWith(DOCS)) { res.writeHead(403); res.end(); return; }
    if (existsSync(filePath) && statSync(filePath).isDirectory()) filePath = join(filePath, "index.html");
    if (!existsSync(filePath)) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { "Content-Type": MIME[extname(filePath)] || "application/octet-stream" });
    res.end(readFileSync(filePath));
  });
  await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
  origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  baseURL = origin + BASE;
});

test.afterAll(async () => {
  if (server) await new Promise<void>((r) => server.close(() => r()));
});

for (const path of pages) {
  test(`docs ${path}`, async ({ page }) => {
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];
    const failedRequests: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));
    page.on("response", (res) => {
      if (res.url().startsWith(origin) && res.status() >= 400) failedRequests.push(`${res.status()} ${res.url()}`);
    });
    page.on("console", (msg) => {
      if (msg.type() !== "error") return;
      const text = msg.text();
      // 外部資源已被 route.abort() 封鎖，其載入失敗訊息不算 JS 錯誤
      if (/Failed to load resource|net::ERR_/.test(text)) return;
      consoleErrors.push(text);
    });

    // 封鎖所有外部請求（Google Fonts、CDN）：離線環境下才不會卡在 load，也避免測試依賴外網
    await page.route("**/*", (route) => {
      route.request().url().startsWith(origin) ? route.continue() : route.abort();
    });

    await page.goto(baseURL + path, { waitUntil: "load" });

    // 元件頁與 Playground 由 Layout.astro 載入 cubby-ui.js；範例頁（examples/）使用各自的
    // Dashboard layout，可能不載入互動 JS，只檢查無錯誤
    const expectsCubbyUI = path.startsWith("/components/") || path === "/playground/";
    if (expectsCubbyUI) {
      await page.waitForFunction(() => typeof (window as any).CubbyUI === "object");
      // 重複初始化必須是安全的（文檔站與 SPA 場景都會這麼用）
      await page.evaluate(() => {
        (window as any).CubbyUI.init();
        (window as any).CubbyUI.refresh();
      });
    }

    expect(pageErrors, `未捕捉例外：\n${pageErrors.join("\n")}`).toEqual([]);
    expect(consoleErrors, `console error：\n${consoleErrors.join("\n")}`).toEqual([]);
    expect(failedRequests, `同源資源載入失敗：\n${failedRequests.join("\n")}`).toEqual([]);
  });
}
