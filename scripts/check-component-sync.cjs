#!/usr/bin/env node
/**
 * check-component-sync.cjs
 * ---------------------------------------------------------------------------
 * 防止元件清單在多個來源間漂移。以 src/data/component-nav.ts（sidebar 與
 * prev/next 導航的 single source of truth）為基準，交叉比對：
 *   1. 文檔頁面    src/pages/components/<slug>.astro      （依 slug 逐字比對）
 *   2. i18n 翻譯   src/i18n/pages/components/<slug>.ts     （依 slug 逐字比對）
 *   3. CSS 檔案    src/styles/components/<slug>.css        （依 slug，套 CSS_ALIAS）
 *   4. components.json 的 components[].name                （依 name，套 NAME_ALIAS）
 *   5. llms.txt    行首 **元件名**                          （依 name，套 NAME_ALIAS）
 *
 * 三種來源使用三套命名（slug / CSS 檔名 / 顯示名），下方別名表記錄已知分歧；
 * 任一來源缺漏或出現孤兒頁面時以非 0 結束，方便併入 CI / npm test。
 *
 * 用法：node scripts/check-component-sync.cjs [--verbose]
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const VERBOSE = process.argv.includes("--verbose");

/** 純文檔頁，無對應 cu- CSS class，不需出現在 CSS / components.json / llms.txt */
const DOC_ONLY = new Set(["color"]);

/** 顯示名稱的單複數分歧（nav 用複數，manifest 用單數）：正規化後視為等價 */
const NAME_ALIAS = { paragraphs: "paragraph", lists: "list", links: "link" };

/** nav slug 與 CSS 檔名分歧（nav 用全名，CSS 檔用短名） */
const CSS_ALIAS = {
  "resizable-panels": "resizable",
  "segmented-control": "segmented",
  "stat-card": "stat",
};

/** 顯示名稱 → 可比對 key */
function normName(s) {
  const k = s.toLowerCase().replace(/\s+/g, "-");
  return NAME_ALIAS[k] || k;
}

const read = (rel) => fs.readFileSync(path.join(ROOT, rel), "utf8");
const listSlugs = (rel, ext) =>
  fs
    .readdirSync(path.join(ROOT, rel))
    .filter((f) => f.endsWith(ext))
    .map((f) => f.slice(0, -ext.length));

// --- 基準：component-nav.ts 的 /components/ 導航項 --------------------------
const navItems = [
  ...read("src/data/component-nav.ts").matchAll(
    /name:\s*"([^"]+)",\s*path:\s*"\/components\/([^"]+)"/g
  ),
].map((m) => ({ name: m[1], slug: m[2] }));
const navSlugs = new Set(navItems.map((i) => i.slug));

// --- 其餘來源 ---------------------------------------------------------------
const pageSlugs = new Set(listSlugs("src/pages/components", ".astro"));
const i18nSlugs = new Set(listSlugs("src/i18n/pages/components", ".ts"));
const cssFiles = new Set(listSlugs("src/styles/components", ".css"));

const cj = JSON.parse(read("components.json"));
const cjNameKeys = new Set((cj.components || []).map((c) => normName(c.name)));

const llmsNameKeys = new Set(
  [...read("llms.txt").matchAll(/^\*\*([^*]+?)\*\*/gm)].map((m) =>
    normName(m[1].trim())
  )
);

// --- 比對 -------------------------------------------------------------------
const problems = [];

for (const { name, slug } of navItems) {
  if (!pageSlugs.has(slug))
    problems.push(`頁面缺漏：nav「${name}」(${slug}) 無 src/pages/components/${slug}.astro`);
  if (!i18nSlugs.has(slug))
    problems.push(`i18n 缺漏：nav「${name}」(${slug}) 無 src/i18n/pages/components/${slug}.ts`);

  if (DOC_ONLY.has(slug)) continue;
  const cssRaw = CSS_ALIAS[slug] || slug;
  const cssSlug = NAME_ALIAS[cssRaw] || cssRaw; // 同時消化短名與單複數分歧
  if (!cssFiles.has(cssSlug))
    problems.push(`CSS 缺漏：nav「${name}」無 src/styles/components/${cssSlug}.css`);
  const nameKey = normName(name);
  if (!cjNameKeys.has(nameKey))
    problems.push(`components.json 缺漏：nav「${name}」未列入`);
  if (!llmsNameKeys.has(nameKey))
    problems.push(`llms.txt 缺漏：nav「${name}」未列入`);
}

for (const slug of pageSlugs)
  if (!navSlugs.has(slug))
    problems.push(`孤兒頁面：src/pages/components/${slug}.astro 未列於 component-nav.ts`);

// --- 輸出 -------------------------------------------------------------------
const counts = {
  nav: navItems.length,
  pages: pageSlugs.size,
  i18n: i18nSlugs.size,
  css: cssFiles.size,
  "components.json": cjNameKeys.size,
  "llms.txt": llmsNameKeys.size,
};
if (VERBOSE) console.log("來源計數：", JSON.stringify(counts, null, 2));

if (problems.length === 0) {
  console.log(
    `✓ 元件清單同步：${navItems.length} 個導航項在所有來源一致` +
      `（DOC_ONLY 例外：${[...DOC_ONLY].join(", ")}）`
  );
  process.exit(0);
}
console.error(`✗ 元件清單同步發現 ${problems.length} 處問題：\n`);
for (const p of problems) console.error("  • " + p);
console.error("\n各來源計數：", JSON.stringify(counts));
process.exit(1);
