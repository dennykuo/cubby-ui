import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import type { Page } from "@playwright/test";

const HERE = fileURLToPath(new URL(".", import.meta.url));
const ROOT = resolve(HERE, "../..");
const DIST_CSS = resolve(ROOT, "dist/core/cubby-ui.css");
const DIST_JS = resolve(ROOT, "dist/core/cubby-ui.js");

/** 回傳 fixture 頁面的 file:// URL；dist 未建置時直接拋錯提示 */
export function fixtureUrl(name: string): string {
  if (!existsSync(DIST_CSS) || !existsSync(DIST_JS)) {
    throw new Error("找不到 dist/core/cubby-ui.{css,js}，請先執行 `npm run build`。");
  }
  return pathToFileURL(resolve(HERE, "fixtures", `${name}.html`)).href;
}

/** 開啟 fixture 並等待 CubbyUI 完成初始化 */
export async function openFixture(page: Page, name: string): Promise<void> {
  await page.goto(fixtureUrl(name));
  await page.waitForFunction(() => typeof (window as any).CubbyUI !== "undefined");
}
