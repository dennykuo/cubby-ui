#!/usr/bin/env node
/**
 * build-js.mjs
 * ---------------------------------------------------------------------------
 * 以 esbuild 將 ESM 原始碼（src/scripts/index.js + core/ + components/）打包成
 * 單一 UMD 檔 dist/core/cubby-ui.js，支援 `require()`、AMD `define()` 與
 * `window.CubbyUI` 三種載入方式，行為與拆分前的手寫 UMD 檔一致。
 *
 * esbuild 本身不輸出 UMD，因此以 iife + globalName 產生內層，再用 banner / footer
 * 包上 UMD wrapper。壓縮版（cubby-ui.min.js）仍由 package.json 的 terser 步驟產生。
 *
 * 用法：
 *   node scripts/build-js.mjs            # 輸出 dist/core/cubby-ui.js
 *   import { buildCubbyUiJs } from "./scripts/build-js.mjs"  // astro.config.mjs 於 dev / build 前呼叫
 */
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildSync } from "esbuild";

const ROOT = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
export const ENTRY = resolve(ROOT, "src/scripts/index.js");
export const OUTFILE = resolve(ROOT, "dist/core/cubby-ui.js");

const BANNER = `/**
 * Cubby UI — Interactive component scripts
 * Framework-agnostic, vanilla JS (UMD)
 * Built from src/scripts/ — do not edit directly.
 */
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.CubbyUI = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {`;

const FOOTER = `  return __cubbyUI.default;
});`;

/**
 * 同步打包，讓 Vite plugin 能在模組解析前完成（dev server 啟動 / astro build 開始時）。
 * @param {{ outfile?: string, minify?: boolean }} [options]
 * @returns {string} 輸出檔路徑
 */
export function buildCubbyUiJs(options = {}) {
  const outfile = options.outfile || OUTFILE;
  mkdirSync(dirname(outfile), { recursive: true });
  buildSync({
    entryPoints: [ENTRY],
    outfile,
    bundle: true,
    format: "iife",
    globalName: "__cubbyUI",
    target: "es2015",
    charset: "utf8",
    banner: { js: BANNER },
    footer: { js: FOOTER },
    legalComments: "none",
    minify: !!options.minify,
    logLevel: "warning",
  });
  return outfile;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const out = buildCubbyUiJs();
  console.log("✓ cubby-ui.js →", out);
}
