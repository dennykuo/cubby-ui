import type { APIRoute } from "astro";
import { withBase } from "@/utils/paths";

/**
 * robots.txt（建置為 `docs/robots.txt`）
 *
 * 需要含 base 的 sitemap 絕對網址（如 `https://dennykuo.github.io/cubby-ui/sitemap-index.xml`），
 * 因此以 endpoint 動態產生而非放在 `public/`。未設定 SITE_URL 時不產生 sitemap，也就不列 `Sitemap:`。
 * i18n 路由同步（scripts/generate-i18n-routes.js、astro.config.mjs 的 i18nHotSync）只複製 `.astro`，
 * 不會產生 `/zh-tw/robots.txt`。
 */
export const GET: APIRoute = ({ site }) => {
  const lines = ["User-agent: *", "Allow: /"];
  if (site) lines.push("", `Sitemap: ${new URL(withBase("/sitemap-index.xml"), site).href}`);
  return new Response(`${lines.join("\n")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
