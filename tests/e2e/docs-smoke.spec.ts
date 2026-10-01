import { test, expect } from "@playwright/test";
import { createServer, type Server } from "node:http";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { AddressInfo } from "node:net";
import { uiTranslations } from "../../src/i18n/ui";

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
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
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

// ── 文檔站搜尋（DocsSearch：Header 觸發按鈕 + Command Palette）────────────────
test.describe("docs search", () => {
  const SEARCH = "#docs-search";
  const visibleItems = `${SEARCH} [data-cu-command-item]:visible`;

  /** 封鎖外部請求並開啟頁面（與 smoke test 相同理由：離線環境不能卡在 Google Fonts） */
  async function open(page: import("@playwright/test").Page, path: string) {
    await page.route("**/*", (route) => {
      route.request().url().startsWith(origin) ? route.continue() : route.abort();
    });
    await page.goto(baseURL + path, { waitUntil: "load" });
    await page.waitForFunction(() => typeof (window as any).CubbyUI === "object");
  }

  test("按鈕開啟、輸入過濾、Enter 導航到第一個結果", async ({ page }) => {
    await open(page, "/components/button/");
    const dialog = page.locator(SEARCH);
    await expect(dialog).toBeHidden();

    await page.locator('button[data-cu-command-trigger="docs-search"]:visible').click();
    await expect(dialog).toBeVisible();
    const input = dialog.locator("[data-cu-command-input]");
    await expect(input).toBeFocused();

    // 項目與導航資料一致：入門指南 + 所有元件 + 範例，且 dialog 有可及名稱
    expect(await dialog.locator("[data-cu-command-item]").count()).toBeGreaterThan(100);
    await expect(dialog).toHaveAttribute("aria-label", "Search documentation");

    await input.fill("date picker");
    await expect(page.locator(visibleItems)).toHaveText(["Date Picker"]);
    await expect(page.locator(visibleItems).first()).toHaveAttribute("data-cu-command-active", "");
    // 只剩含結果的分組
    await expect(dialog.locator("[data-cu-command-group]:visible")).toHaveCount(1);

    await input.press("Enter");
    await expect(page).toHaveURL(new RegExp(`${BASE}/components/date-picker/?$`));
  });

  test("⌘K / Ctrl+K 開關、Esc 關閉，關閉後清空查詢", async ({ page }) => {
    await open(page, "/components/button/");
    const dialog = page.locator(SEARCH);
    const input = dialog.locator("[data-cu-command-input]");

    await page.keyboard.press("Control+k");
    await expect(dialog).toBeVisible();
    await input.fill("tabs");
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();

    await page.keyboard.press("Meta+k");
    await expect(dialog).toBeVisible();
    await expect(input).toHaveValue("");
    expect(await page.locator(visibleItems).count()).toBeGreaterThan(100);
    await page.keyboard.press("Control+k");
    await expect(dialog).toBeHidden();
  });

  test("方向鍵移動選取，無結果時顯示提示", async ({ page }) => {
    await open(page, "/");
    const dialog = page.locator(SEARCH);
    const input = dialog.locator("[data-cu-command-input]");
    await page.keyboard.press("Control+k");

    await input.fill("input");
    const items = page.locator(visibleItems);
    expect(await items.count()).toBeGreaterThan(3);
    await input.press("ArrowDown");
    await expect(items.nth(1)).toHaveAttribute("data-cu-command-active", "");
    await expect(items.nth(0)).not.toHaveAttribute("data-cu-command-active", "");

    await input.fill("zzzz-no-such-component");
    await expect(page.locator(visibleItems)).toHaveCount(0);
    await expect(dialog.locator("[data-cu-command-empty]")).toBeVisible();
    await expect(dialog.locator("[data-cu-command-empty]")).toHaveText("No results found.");
  });

  test("繁中頁：連結帶 /zh-tw 前綴，可用中文分類名搜尋", async ({ page }) => {
    await open(page, "/zh-tw/components/button/");
    const dialog = page.locator(SEARCH);
    const input = dialog.locator("[data-cu-command-input]");
    await page.keyboard.press("Control+k");
    await expect(input).toHaveAttribute("placeholder", "搜尋元件、指南與範例...");

    await input.fill("表單");
    const items = page.locator(visibleItems);
    expect(await items.count()).toBeGreaterThan(20);
    await expect(dialog.locator("[data-cu-command-group]:visible")).toHaveCount(1);
    for (const href of await items.evaluateAll((els) => els.map((el) => el.getAttribute("href")))) {
      expect(href).toMatch(new RegExp(`^${BASE}/zh-tw/components/`));
    }

    // 範例頁不翻譯：不加 /zh-tw
    await input.fill("dashboard v5");
    await expect(items).toHaveCount(1);
    await expect(items.first()).toHaveAttribute("href", `${BASE}/examples/dashboard-v5`);
  });

  test("手機寬度：改用圖示按鈕開啟", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await open(page, "/components/button/");
    const triggers = page.locator('button[data-cu-command-trigger="docs-search"]');
    await expect(triggers).toHaveCount(2);
    await expect(triggers.locator("visible=true")).toHaveCount(1);
    await triggers.locator("visible=true").click();
    await expect(page.locator(SEARCH)).toBeVisible();
  });

  test("非 Apple 平台的快捷鍵提示顯示 Ctrl K", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "platform", { get: () => "Linux x86_64" });
      Object.defineProperty(navigator, "userAgentData", { get: () => undefined });
    });
    await open(page, "/components/button/");
    await expect(page.locator("[data-docs-search-shortcut]")).toHaveText("Ctrl K");
  });

  test("Apple 平台的快捷鍵提示維持 ⌘K", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "platform", { get: () => "MacIntel" });
      Object.defineProperty(navigator, "userAgentData", { get: () => undefined });
    });
    await open(page, "/components/button/");
    await expect(page.locator("[data-docs-search-shortcut]")).toHaveText("⌘K");
  });
});

/**
 * 文檔站 SEO
 * ---------------------------------------------------------------------------
 * - 每個使用 Layout 的頁面（核心頁 + 元件頁，en / zh-tw）都有專屬、非預設、純文字的 meta description
 * - Open Graph / Twitter card / hreflang（含 x-default）標籤存在，og:locale 依語系
 * - 建置時有設定 SITE_URL（HTML 有 canonical）時：canonical / og:url / hreflang 為含 base 的絕對網址，
 *   sitemap-index.xml 與 robots.txt 存在且指向含 base 的網址；未設定時改驗證不輸出 canonical 與 sitemap
 */
test.describe("docs SEO", () => {
  /** 使用 Layout.astro 的文檔頁（排除各自 layout 的範例頁），回傳不含 base 的路徑 */
  const layoutPages = existsSync(DOCS) ? collectPages(DOCS).filter((p) => !p.includes("/examples/")) : [];
  const readHtml = (path: string) => readFileSync(join(DOCS, path, "index.html"), "utf8");
  const attr = (html: string, re: RegExp) => html.match(re)?.[1];
  const NAMED: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };
  /** 讀取 meta description 並還原一層屬性跳脫（Astro 會把 `&`、`"` 轉成 `&#38;`、`&#34;`） */
  const metaDescription = (html: string) =>
    attr(html, /<meta name="description" content="([^"]*)"/)?.replace(/&(#\d+|#x[0-9a-f]+|[a-z]+);/gi, (m, e: string) =>
      e[0] !== "#" ? NAMED[e] ?? m : String.fromCodePoint(e[1] === "x" ? parseInt(e.slice(2), 16) : Number(e.slice(1))));
  const canonicalOf = (html: string) => attr(html, /<link rel="canonical" href="([^"]*)"/);

  /** 建置時是否設定 site：由首頁是否輸出 canonical 判斷（與 SITE_URL 環境變數無關，測試可單獨執行） */
  const indexCanonical = layoutPages.includes("/") ? canonicalOf(readHtml("/")) : undefined;
  const hasSite = Boolean(indexCanonical);
  /** 站台根網址（含 base、尾端斜線），如 https://dennykuo.github.io/cubby-ui/ */
  const siteRoot = indexCanonical ?? "";

  // 封鎖外部請求（Google Fonts 等），與上方逐頁 smoke 相同
  test.beforeEach(async ({ page }) => {
    await page.route("**/*", (route) => {
      route.request().url().startsWith(origin) ? route.continue() : route.abort();
    });
  });
  const goto = (page: import("@playwright/test").Page, path: string) =>
    page.goto(baseURL + path, { waitUntil: "domcontentloaded" });
  const content = (page: import("@playwright/test").Page, selector: string) =>
    page.locator(selector).first().getAttribute(selector.startsWith("link") ? "href" : "content");

  test("每頁有專屬、非預設的純文字 description", () => {
    expect(layoutPages.length).toBeGreaterThan(100);
    const defaults = new Set(Object.values(uiTranslations).map((t) => t.siteDescription));
    const seen = new Map<string, string>();
    for (const path of layoutPages) {
      const desc = metaDescription(readHtml(path));
      expect(desc, `${path} 缺少 description`).toBeTruthy();
      expect(defaults.has(desc!), `${path} 使用站台預設 description（未傳入 description prop）`).toBe(false);
      // 翻譯字串中的 <code> / <kbd> / <br /> / &lt; 等須轉為純文字（原文的 `<details>` 這類文字可保留）
      expect(desc, `${path} description 含 HTML`).not.toMatch(/<\/?(code|kbd|br|a|span)\b|class=|&(lt|gt|amp|quot|nbsp|#\d+);/);
      expect(seen.get(desc!), `${path} 與 ${seen.get(desc!)} description 重複`).toBeUndefined();
      seen.set(desc!, path);
      if (path.startsWith("/zh-tw/")) expect(desc, `${path} 繁中頁描述應為中文`).toMatch(/[\u4e00-\u9fff]/);
    }
  });

  test("Open Graph / Twitter / hreflang 標籤", async ({ page }) => {
    for (const [path, locale, alternate] of [
      ["/components/button/", "en_US", "zh_TW"],
      ["/zh-tw/components/button/", "zh_TW", "en_US"],
    ] as const) {
      await goto(page, path);
      const description = await content(page, 'meta[name="description"]');
      expect(await content(page, 'meta[property="og:title"]')).toBe(await page.title());
      expect(await content(page, 'meta[property="og:description"]')).toBe(description);
      expect(await content(page, 'meta[property="og:type"]')).toBe("website");
      expect(await content(page, 'meta[property="og:site_name"]')).toBe("Cubby UI");
      expect(await content(page, 'meta[property="og:locale"]')).toBe(locale);
      expect(await content(page, 'meta[property="og:locale:alternate"]')).toBe(alternate);
      expect(await content(page, 'meta[name="twitter:card"]')).toBe("summary");
      for (const lang of ["en", "zh-TW", "x-default"]) {
        await expect(page.locator(`link[rel="alternate"][hreflang="${lang}"]`)).toHaveCount(1);
      }
      expect(await content(page, 'link[rel="alternate"][hreflang="x-default"]'))
        .toBe(await content(page, 'link[rel="alternate"][hreflang="en"]'));
    }

    // 不同頁面、不同語系的 description 各不相同
    await goto(page, "/components/button/");
    const buttonEn = await content(page, 'meta[name="description"]');
    await goto(page, "/components/card/");
    const cardEn = await content(page, 'meta[name="description"]');
    await goto(page, "/zh-tw/components/button/");
    const buttonZh = await content(page, 'meta[name="description"]');
    expect(new Set([buttonEn, cardEn, buttonZh]).size).toBe(3);
    expect(buttonZh).toMatch(/[\u4e00-\u9fff]/);
  });

  test("canonical / og:url / hreflang 為含 base 的絕對網址", async ({ page }) => {
    test.skip(!hasSite, "建置時未設定 SITE_URL，不輸出 canonical");
    const root = new URL(siteRoot);
    expect(root.pathname).toBe(`${BASE}/`);
    if (process.env.SITE_URL) expect(root.origin).toBe(new URL(process.env.SITE_URL).origin);

    for (const [path, en, zh] of [
      ["/components/button/", "components/button/", "zh-tw/components/button/"],
      ["/zh-tw/components/button/", "components/button/", "zh-tw/components/button/"],
      ["/zh-tw/", "", "zh-tw/"],
    ] as const) {
      await goto(page, path);
      const self = path.startsWith("/zh-tw/") ? zh : en;
      expect(await content(page, 'link[rel="canonical"]')).toBe(siteRoot + self);
      expect(await content(page, 'meta[property="og:url"]')).toBe(siteRoot + self);
      expect(await content(page, 'link[rel="alternate"][hreflang="en"]')).toBe(siteRoot + en);
      expect(await content(page, 'link[rel="alternate"][hreflang="zh-TW"]')).toBe(siteRoot + zh);
      expect(await content(page, 'link[rel="alternate"][hreflang="x-default"]')).toBe(siteRoot + en);
      expect(await content(page, 'link[rel="sitemap"]')).toBe(`${BASE}/sitemap-index.xml`);
    }
  });

  test("sitemap 含 base 路徑與 i18n 對應，排除 404 示範頁", async ({ request }) => {
    test.skip(!hasSite, "建置時未設定 SITE_URL，不產生 sitemap");
    const index = await request.get(`${baseURL}/sitemap-index.xml`);
    expect(index.status()).toBe(200);
    const indexXml = await index.text();
    const sitemapUrls = [...indexXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(sitemapUrls.length).toBeGreaterThan(0);

    const locs: string[] = [];
    let xml = "";
    for (const url of sitemapUrls) {
      expect(url.startsWith(siteRoot), `${url} 應以 ${siteRoot} 開頭`).toBe(true);
      const res = await request.get(baseURL + "/" + url.slice(siteRoot.length));
      expect(res.status()).toBe(200);
      const body = await res.text();
      xml += body;
      locs.push(...[...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
    }
    expect(locs).toContain(siteRoot);
    expect(locs).toContain(`${siteRoot}components/button/`);
    expect(locs).toContain(`${siteRoot}zh-tw/components/button/`);
    expect(locs.every((loc) => loc.startsWith(siteRoot)), "所有網址都應含 base").toBe(true);
    expect(locs.filter((loc) => /\/404\/$/.test(loc)), "404 示範頁不應收錄").toEqual([]);
    expect(locs.filter((loc) => !loc.endsWith("/")), "只收錄頁面（不含 robots.txt 等端點）").toEqual([]);
    expect(xml).toContain(`hreflang="zh-TW" href="${siteRoot}zh-tw/components/button/"`);
  });

  test("robots.txt 指向含 base 的 sitemap，且沒有 zh-tw 版本", async ({ request }) => {
    const res = await request.get(`${baseURL}/robots.txt`);
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toMatch(/^User-agent: \*$/m);
    expect((await request.get(`${baseURL}/zh-tw/robots.txt`)).status()).toBe(404);
    if (hasSite) expect(body).toContain(`Sitemap: ${siteRoot}sitemap-index.xml`);
    else expect(body).not.toContain("Sitemap:");
  });

  test("未設定 site 時不輸出 canonical / og:url / sitemap", async ({ page }) => {
    test.skip(hasSite, "建置時有設定 SITE_URL");
    expect(existsSync(join(DOCS, "sitemap-index.xml"))).toBe(false);
    await goto(page, "/components/button/");
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    await expect(page.locator('meta[property="og:url"]')).toHaveCount(0);
    await expect(page.locator('link[rel="sitemap"]')).toHaveCount(0);
  });
});
