#!/usr/bin/env node
/**
 * check-links.mjs
 * ---------------------------------------------------------------------------
 * 掃描 Astro 產出的文檔站（預設 `docs/`），檢查所有站內連結：
 *   1. 根路徑連結（`/xxx`）必須以 base 開頭 — 文檔站部署到 GitHub Pages 專案站時
 *      掛在子路徑（如 `/cubby-ui/`），寫死 `/components/...` 會在上線後 404
 *   2. 連結目標必須存在於建置結果（`x`、`x.html`、`x/index.html` 任一）
 *
 * 只檢查頁面實際的 `href` / `src` / `action` 屬性；`<template>` 內的元件預覽
 * 示範片段（渲染於 iframe srcdoc，示範用的 `href="/docs"` 等不指向站內頁面）
 * 與 `<pre>` / `<code>` 內容一律略過。
 *
 * 用法：BASE_PATH=/cubby-ui node scripts/check-links.mjs [outDir]
 *      （BASE_PATH 需與建置時相同；未設定時為 `/`）
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const outDir = resolve(ROOT, process.argv[2] || "docs");
const base = (process.env.BASE_PATH || "/").replace(/\/+$/, "");

/**
 * 已知的非建置頁面：`src/pages/examples/dashboard-v5/feedback/` 為提交進版控的
 * 舊建置快照（`.html`，內含寫死的根路徑與已不存在的 `/_astro/*.css`），不是由
 * `.astro` 原始碼產生，無法套用 base。
 */
const IGNORE_PREFIXES = ["examples/dashboard-v5/feedback/"];

if (!existsSync(outDir)) {
  console.error(`✗ 找不到建置目錄 ${relative(ROOT, outDir)}，請先執行 npm run build:docs`);
  process.exit(1);
}

function listHtml(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listHtml(full));
    else if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

/** 移除不屬於頁面本身連結的區段 */
function stripNonPageMarkup(html) {
  return html
    .replace(/<template\b[\s\S]*?<\/template>/gi, "")
    .replace(/<pre\b[\s\S]*?<\/pre>/gi, "")
    .replace(/<code\b[\s\S]*?<\/code>/gi, "")
    .replace(/<script\b[\s\S]*?<\/script>/gi, "");
}

/** 站內路徑（已去 base、去 query / hash）是否對應到建置結果中的檔案 */
function targetExists(sitePath) {
  const clean = decodeURIComponent(sitePath).replace(/^\/+/, "");
  const full = join(outDir, clean);
  if (!full.startsWith(outDir)) return false;
  const candidates = [full, `${full}.html`, join(full, "index.html")];
  return candidates.some((c) => existsSync(c) && statSync(c).isFile());
}

const ATTR_RE = /\s(?:href|src|action)\s*=\s*"([^"]*)"/gi;
const problems = [];
let checked = 0;

const pages = listHtml(outDir);
for (const file of pages) {
  const rel = relative(outDir, file).split(sep).join("/");
  if (IGNORE_PREFIXES.some((p) => rel.startsWith(p))) continue;

  // 頁面自身的站內 URL（供解析相對連結）
  const pageUrl = new URL(
    `${base}/${rel.replace(/(^|\/)index\.html$/, "$1")}`,
    "http://site.local"
  );

  const html = stripNonPageMarkup(readFileSync(file, "utf8"));
  for (const [, raw] of html.matchAll(ATTR_RE)) {
    const value = raw.replace(/&amp;/g, "&").trim();
    if (!value || value.startsWith("#") || value.startsWith("//")) continue;
    if (/^[a-z][a-z0-9+.-]*:/i.test(value)) continue; // http:, mailto:, data:, javascript: …

    checked++;
    if (value.startsWith("/") && base && value !== base && !value.startsWith(`${base}/`)) {
      problems.push(`${rel}: 缺少 base「${base}」→ ${value}`);
      continue;
    }

    const { pathname } = new URL(value, pageUrl);
    const sitePath = base && pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
    if (!targetExists(sitePath)) problems.push(`${rel}: 目標不存在 → ${value}`);
  }
}

if (problems.length === 0) {
  console.log(
    `✓ 站內連結檢查：${pages.length} 個頁面、${checked} 個連結皆指向存在的檔案` +
      `（base：${base || "/"}）`
  );
  process.exit(0);
}

const unique = [...new Set(problems)];
console.error(`✗ 站內連結檢查發現 ${unique.length} 處問題（base：${base || "/"}）：\n`);
for (const p of unique.slice(0, 100)) console.error("  • " + p);
if (unique.length > 100) console.error(`  … 另有 ${unique.length - 100} 處`);
process.exit(1);
