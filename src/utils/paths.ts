/**
 * 站內路徑與 Astro `base` 的轉換。
 *
 * 文檔站部署到 GitHub Pages 專案站時掛在子路徑（如 `/cubby-ui/`），
 * `astro.config.mjs` 由 `BASE_PATH` 環境變數設定 `base`；本機 dev / build 未設定時為 `/`。
 * 站內連結一律以「不含 base 的根路徑」撰寫（`/components/button`），輸出前經 `withBase()`；
 * 比對目前頁面路徑前先以 `stripBase()` 去掉 base，兩種部署方式共用同一份資料。
 */

/** 正規化後的 base（無尾端斜線；根目錄部署時為空字串） */
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, "");

/**
 * 為站內根路徑加上 base：`/components/button` → `/cubby-ui/components/button`。
 * 非根路徑（`#`、相對路徑、`https://…`、`//cdn…`）原樣回傳。
 */
export function withBase(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  return BASE + path;
}

/** 去掉 pathname 開頭的 base：`/cubby-ui/zh-tw/usage` → `/zh-tw/usage` */
export function stripBase(pathname: string): string {
  if (!BASE) return pathname;
  if (pathname === BASE) return "/";
  return pathname.startsWith(`${BASE}/`) ? pathname.slice(BASE.length) : pathname;
}
