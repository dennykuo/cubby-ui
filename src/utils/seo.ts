/**
 * 文檔站 SEO 輔助函式（Layout 的 meta description、canonical、hreflang、Open Graph 使用）。
 */

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

/**
 * 把翻譯字串中的 HTML（`<code>`、`<kbd>`、`<br />`、`&lt;` 等）轉成純文字，
 * 供 `<meta name="description">` 等屬性使用（輸出時由 Astro 重新跳脫）。
 */
export function toPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity: string) => {
      if (entity[0] === "#") {
        const code = entity[1].toLowerCase() === "x"
          ? parseInt(entity.slice(2), 16)
          : parseInt(entity.slice(1), 10);
        return Number.isFinite(code) ? String.fromCodePoint(code) : match;
      }
      return NAMED_ENTITIES[entity.toLowerCase()] ?? match;
    })
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * 站內路徑（已含 base）轉為絕對網址：`/cubby-ui/components/button` → `https://…/cubby-ui/components/button/`。
 * 文檔站以 `build.format: "directory"` 輸出（`components/button/index.html`），
 * GitHub Pages 會把無尾端斜線的網址 301 到帶斜線的版本，因此一律補上尾端斜線，
 * 與 `@astrojs/sitemap` 產生的網址一致。
 */
export function absoluteUrl(pathWithBase: string, site: URL): string {
  const path = pathWithBase.endsWith("/") ? pathWithBase : `${pathWithBase}/`;
  return new URL(path, site).href;
}
