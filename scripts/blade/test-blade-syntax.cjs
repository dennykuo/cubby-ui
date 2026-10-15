#!/usr/bin/env node

/**
 * Blade 檔案語法回歸測試
 *
 * 對 dist/laravel/ 下所有 .blade.php 做四層檢查：
 *
 *   (1) 已知 bug pattern — 以字串 / regex 方式確保產生器不會再輸出：
 *       - `,,`（空陣列元素；PHP 8.3+ Fatal）
 *       - `@class([,`、`, ]`（純空白前後的空元素）
 *       - 未轉譯的 JSX 屬性 `attr={...}`、內容中的單層 `{expr}` / `{cond && <tag>}`
 *       - 未轉譯的 Astro 元件 / 動態 tag（`<Calendar />`、`<Tag>`）
 *       - 單層 `{...}` 內殘留 JS 的 `||` / `??`（如文字位置的 `{filename || language}`）
 *       - 單引號字串以 `$` 開頭（如 `'$light'`：字串字面量被誤轉成 PHP 變數）
 *       - 同一個開頭標籤重複輸出屬性：
 *         · `@class(` / 靜態 `class="…"` 搭配裸 `{{ $attributes }}`
 *           → 使用者的 class 變成第二個 class 屬性，瀏覽器只採用第一個
 *         · `$attributes->class(` 搭配 `$attributes->except('class')`
 *           → 使用者的非 class 屬性（id、data-* …）輸出兩次
 *         · 靜態 `style="…"` 搭配會帶出使用者 style 的 `$attributes`
 *           → 元件或使用者其中一方的 style 被忽略（應改用 ->merge(['style' => …])）
 *       - 非 void 元素自閉合（如 `<span … />`）：HTML 會忽略 `/>`，後續兄弟元素被包進去
 *
 *   (2) 未宣告變數 — PHP 片段中引用的 `$var` 必須來自 `@props`、`@php` 指派、
 *       `@foreach ... as`、Blade 內建變數（`$attributes`、`$slot` …），
 *       或以 `isset($x)` / `$x ??` 防護的 named slot；否則 Laravel 會拋
 *       `Undefined variable`。
 *
 *   (3) PHP 8.3 parse — 將 `@class([...])`、`@props([...])`、`@if(...)`、
 *       `@php` 區塊、`{{ }}`、元件 `:attr="..."` 綁定等 PHP 片段萃取出來，
 *       包進最小 PHP 檔後以 `php -l` 驗證語法（`.blade.php` 直接餵 `php -l`
 *       會因 `@class` 等 directive 被當成識別字而失敗，需先萃取）。
 *
 *   (4) Render smoke test — 以 illuminate/view 實際渲染每個元件（見
 *       render-smoke.cjs；需 php + composer，未安裝時略過）。
 *
 * 使用：
 *   node scripts/blade/test-blade-syntax.cjs
 *   node scripts/blade/test-blade-syntax.cjs --verbose
 *   node scripts/blade/test-blade-syntax.cjs --skip-php        # 沒裝 php 時跳過 (3)(4)
 *   node scripts/blade/test-blade-syntax.cjs --skip-render     # 只跳過 (4)
 *   node scripts/blade/test-blade-syntax.cjs --require-render  # (4) 無法執行時視為失敗（CI 用）
 */

const fs = require("fs");
const path = require("path");
const os = require("os");
const cp = require("child_process");

const { runRenderSmoke } = require("./render-smoke.cjs");

const ROOT = path.join(__dirname, "..", "..");
const DIST_DIR = path.join(ROOT, "dist", "laravel");

const args = process.argv.slice(2);
const VERBOSE = args.includes("--verbose");
const SKIP_PHP = args.includes("--skip-php");
const SKIP_RENDER = args.includes("--skip-render");
const REQUIRE_RENDER = args.includes("--require-render");

/** 已知壞 pattern：在 dist/ 裡任何 blade 檔出現即視為失敗 */
const BAD_PATTERNS = [
  {
    name: "double-comma",
    regex: /,,/,
    hint: 'PHP 8.3+ 會拋 "Cannot use empty array elements"；檢查 class-resolver 的 @class([...]) 輸出邏輯',
  },
  {
    name: "empty-array-leading-comma",
    regex: /\[\s*,/,
    hint: "陣列以 `,` 開頭，PHP 會解析為空元素",
  },
  {
    name: "empty-array-double-comma-newline",
    regex: /,\s*,\s*\]/,
    hint: "陣列尾部出現 `, ,]`，將產生空元素",
  },
  {
    name: "unconverted-jsx-attr",
    // 任何 `attr={...}`（`attr={{ $x }}` 這類 Blade echo 除外）
    regex: /[\w:@.-]=\{(?!\{)/,
    hint: '殘留未轉譯的 JSX 屬性表達式（如 draggable={!disabled ? "true" : "false"}）；擴充 transformers.cjs 或改用 override',
  },
  {
    name: "unconverted-astro-tag",
    // Astro 元件（<Calendar />）或動態 tag（<Tag>）；HTML / SVG 元素皆為小寫開頭
    regex: /<\/?[A-Z][\w.]*[\s>/]/,
    hint: "殘留 Astro 元件或動態 tag；應轉為 <x-cu.*> 或 <{{ $Tag }}>",
  },
  {
    name: "unconverted-jsx-logical-expr",
    // 單層 `{...}`（非 Blade 的 `{{ }}`）內含 JS 的 `||` / `??`，例如文字位置的 {filename || language}
    regex: /(?:^|[^{])\{[^{}\n]*(?:\|\||\?\?)[^{}\n]*\}/,
    hint: "殘留未轉譯的 JSX 邏輯表達式（如 {filename || language}）；檢查 transformers 的 transformTextInterpolation",
  },
  {
    name: "php-var-in-string-literal",
    // PHP 單引號字串不做變數插值，`'$light'` 只會是字面字串 "$light"
    regex: /'\$[A-Za-z_]/,
    hint: "字串字面量被當成變數轉換（如 $codeTheme === '$light'）；檢查 class-resolver 的 conditionToPhp",
  },
  {
    name: "half-collapsed-class-array",
    // 多行 class 陣列被壓成一行、只剩結尾 `])` 換行：`class(['a', 'b' => $c,` + 換行 + `])`
    regex: /(?:->class|@class)\(\[.*,\s*$/,
    hint: "class 陣列應為單行 `class([...])` 或每項一行；檢查 transformers.cjs cleanup() 的多行 class 陣列對齊",
  },
];

/**
 * 以等長空白取代（保留換行），讓遮蔽後的行號與原始檔一致
 */
function blank(text) {
  return text.replace(/[^\n]/g, " ");
}

/**
 * 遮蔽 Blade 合法使用大括號的區段：註解、echo、raw echo、@php 區塊、<script> / <style>
 */
function maskBladeConstructs(src) {
  return src
    .replace(/\{\{--[\s\S]*?--\}\}/g, blank)
    .replace(/\{!![\s\S]*?!!\}/g, blank)
    .replace(/\{\{[\s\S]*?\}\}/g, blank)
    .replace(/@php\b(?!\s*\()[\s\S]*?@endphp/g, blank)
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/g, blank);
}

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, acc);
    else if (entry.isFile() && entry.name.endsWith(".blade.php")) acc.push(p);
  }
  return acc;
}

function checkBadPatterns(files) {
  const failures = [];
  for (const file of files) {
    const src = fs.readFileSync(file, "utf8");
    const lines = src.split(/\r?\n/);
    for (const pattern of BAD_PATTERNS) {
      for (let i = 0; i < lines.length; i++) {
        if (pattern.regex.test(lines[i])) {
          failures.push({
            file: path.relative(ROOT, file),
            line: i + 1,
            pattern: pattern.name,
            hint: pattern.hint,
            snippet: lines[i].trim().slice(0, 160),
          });
        }
      }
    }

    // 遮蔽 Blade 語法後仍殘留的單層大括號 = 未轉譯的 JSX 表達式（{expr}、{cond && <tag>}、.map()）
    const relFile = path.relative(ROOT, file);
    const maskedLines = maskBladeConstructs(src).split(/\r?\n/);
    for (let i = 0; i < maskedLines.length; i++) {
      const alreadyReported = failures.some((f) => f.file === relFile && f.line === i + 1);
      if (/[{}]/.test(maskedLines[i]) && !alreadyReported) {
        failures.push({
          file: relFile,
          line: i + 1,
          pattern: "unconverted-jsx-expression",
          hint: "殘留未轉譯的 JSX 表達式（如 {a || b}、{cond && <div>}）；擴充 transformers.cjs 或改用 override",
          snippet: lines[i].trim().slice(0, 160),
        });
      }
    }
  }
  return failures;
}

// ── 未宣告變數檢查 ─────────────────────────────────────

/** Blade 元件 / view 作用域中一定存在的變數 */
const BLADE_BUILTIN_VARS = new Set(["attributes", "slot", "component", "componentName", "errors", "__env", "__data"]);

/**
 * 從 `start`（指向 `(`）掃描到對應的 `)`，略過字串內的括號
 * @returns {number} 對應 `)` 的 index；找不到回傳 -1
 */
function matchParen(src, start) {
  let depth = 0;
  let quote = null;
  for (let i = start; i < src.length; i++) {
    const ch = src[i];
    if (quote) {
      if (ch === "\\") i++;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") quote = ch;
    else if (ch === "(") depth++;
    else if (ch === ")" && --depth === 0) return i;
  }
  return -1;
}

/**
 * 萃取檔案中所有會被當成 PHP 執行的程式碼片段
 * @returns {Array<{ kind: string, code: string }>}
 */
function extractPhpRegions(src) {
  const cleaned = src.replace(BLADE_COMMENT_RE, "");
  const regions = [];
  let m;

  // @php ... @endphp（區塊）
  const phpBlock = /@php\b(?!\s*\()([\s\S]*?)@endphp/g;
  while ((m = phpBlock.exec(cleaned)) !== null) regions.push({ kind: "@php", code: m[1] });

  // {{ ... }} / {!! ... !!}
  const echo = /\{\{([\s\S]*?)\}\}|\{!!([\s\S]*?)!!\}/g;
  while ((m = echo.exec(cleaned)) !== null) regions.push({ kind: "{{ }}", code: m[1] ?? m[2] });

  // @directive(...)（含 @php(...) 單行形式、@foreach、@for 等）
  const directive = /@(\w+)\s*\(/g;
  while ((m = directive.exec(cleaned)) !== null) {
    const open = m.index + m[0].length - 1;
    const close = matchParen(cleaned, open);
    if (close === -1) continue;
    regions.push({ kind: `@${m[1]}`, code: cleaned.slice(open + 1, close) });
  }

  // Blade 元件 tag 上的 :attr="expr" 綁定
  const componentTag = /<x-[\w.:-]+\b([^>]*)>/g;
  while ((m = componentTag.exec(cleaned)) !== null) {
    for (const [, expr] of m[1].matchAll(/\s:[\w-]+="([^"]*)"/g)) {
      regions.push({ kind: ":attr", code: expr });
    }
  }

  return regions;
}

/**
 * 檢查 PHP 片段中引用、卻沒有在 @props / @php / 迴圈中宣告的變數
 */
function checkUndeclaredVariables(files) {
  const failures = [];

  for (const file of files) {
    const src = fs.readFileSync(file, "utf8");
    const regions = extractPhpRegions(src);
    const declared = new Set(BLADE_BUILTIN_VARS);

    for (const { kind, code } of regions) {
      // @props(['name' => default, 'other'])
      if (kind === "@props") {
        for (const [, name] of code.matchAll(/(?:^|[[,])\s*['"](\w+)['"]\s*(?==>|,|\])/g)) declared.add(name);
      }
      // $name = ...（@php 指派、@for 初始化）；排除 == / => 比較與陣列語法
      for (const [, name] of code.matchAll(/\$(\w+)\s*=(?![=>])/g)) declared.add(name);
      // @foreach($items as $key => $value)
      if (kind === "@foreach" || kind === "@forelse") {
        declared.add("loop");
        const asMatch = code.match(/\bas\s+\$(\w+)(?:\s*=>\s*\$(\w+))?/);
        if (asMatch) {
          declared.add(asMatch[1]);
          if (asMatch[2]) declared.add(asMatch[2]);
        }
      }
      // named slot 等可能不存在的變數：以 isset($x) / $x ?? 防護即視為安全
      for (const [, name] of code.matchAll(/isset\(\s*\$(\w+)/g)) declared.add(name);
      for (const [, name] of code.matchAll(/\$(\w+)\s*\?\?/g)) declared.add(name);
    }

    const reported = new Set();
    for (const { kind, code } of regions) {
      for (const [, name] of code.matchAll(/\$(\w+)/g)) {
        if (declared.has(name) || reported.has(name)) continue;
        reported.add(name);
        failures.push({ file: path.relative(ROOT, file), name, kind });
      }
    }
  }

  return failures;
}

/** 將區塊內容換成空白（保留換行），讓後續掃描的行號不變 */
function blankOut(match) {
  return match.replace(/[^\n]/g, " ");
}

/**
 * 找出 Blade 開頭標籤結尾 `>` 的位置。略過 `{{ }}` / `{!! !!}` echo、
 * `@directive(...)` 參數與屬性引號內的字元（`->`、`=>`、比較運算子都含 `>`）。
 *
 * @returns {number} `>` 的位置；找不到時回傳 -1
 */
function findBladeTagEnd(src, start) {
  let i = start + 1;
  while (i < src.length) {
    if (src.startsWith("{{", i) || src.startsWith("{!!", i)) {
      const close = src.startsWith("{!!", i) ? "!!}" : "}}";
      const end = src.indexOf(close, i + 2);
      if (end === -1) return -1;
      i = end + close.length;
      continue;
    }

    const ch = src[i];
    if (ch === "@") {
      const directive = /^@\w+\(/.exec(src.slice(i, i + 64));
      if (directive) {
        i = skipBalancedParens(src, i + directive[0].length - 1);
        if (i === -1) return -1;
        continue;
      }
    } else if (ch === '"' || ch === "'") {
      let j = i + 1;
      while (j < src.length && src[j] !== ch) {
        if (src.startsWith("{{", j)) {
          const end = src.indexOf("}}", j + 2);
          if (end === -1) return -1;
          j = end + 2;
        } else {
          j++;
        }
      }
      i = j + 1;
      continue;
    } else if (ch === ">") {
      return i;
    }
    i++;
  }
  return -1;
}

/** 從 `(` 的位置跳到對應 `)` 之後；略過 PHP 字串內的括號 */
function skipBalancedParens(src, open) {
  let depth = 0;
  let quote = null;
  for (let i = open; i < src.length; i++) {
    const ch = src[i];
    if (quote) {
      if (ch === "\\") i++;
      else if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === "(") {
      depth++;
    } else if (ch === ")") {
      depth--;
      if (depth === 0) return i + 1;
    }
  }
  return -1;
}

/**
 * 列出 blade 檔中所有 HTML 開頭標籤（含行號）
 * @returns {Array<{ tag: string, line: number }>}
 */
function extractOpeningTags(src) {
  const cleaned = src.replace(BLADE_COMMENT_RE, blankOut).replace(/@php\b[\s\S]*?@endphp/g, blankOut);

  const tags = [];
  // 含動態 tag：<{{ $Tag }} ...>
  const tagStart = /<(?:[A-Za-z]|\{\{)/g;
  let m;
  while ((m = tagStart.exec(cleaned)) !== null) {
    const end = findBladeTagEnd(cleaned, m.index);
    if (end === -1) continue;
    tags.push({
      tag: cleaned.slice(m.index, end + 1),
      line: cleaned.slice(0, m.index).split("\n").length,
    });
    tagStart.lastIndex = end + 1;
  }
  return tags;
}

const ATTRIBUTES_ECHO_RE = /\{\{\s*\$attributes\b([\s\S]*?)\}\}/g;

/**
 * 統計單一開頭標籤會輸出幾次 class 屬性、幾次使用者的其他屬性、幾次 style 屬性
 *
 *   - 靜態 `class="…"` / `@class(...)`：各算一次 class
 *   - 靜態 `style="…"`：算一次 style
 *   - `{{ $attributes }}`：使用者 class + 其他屬性（含 style）
 *   - `{{ $attributes->class([...]) }}`：合併後 class + 其他屬性（含 style）
 *   - `{{ $attributes->only('class')->class([...]) }}`：只有 class
 *   - `{{ $attributes->except('class') }}`：只有其他屬性（含 style）
 *   - `->merge(['style' => …])`：元件與使用者的 style 合併為一個，仍算一次
 */
function countAttributeOutputs(tag) {
  const withoutEchoes = tag.replace(ATTRIBUTES_ECHO_RE, "").replace(/\{\{[\s\S]*?\}\}/g, "");
  let classOutputs =
    (withoutEchoes.match(/\sclass=["']/g) || []).length + (withoutEchoes.match(/@class\(/g) || []).length;
  let styleOutputs = (withoutEchoes.match(/\sstyle=["']/g) || []).length;
  let restOutputs = 0;

  for (const [, chain] of tag.matchAll(ATTRIBUTES_ECHO_RE)) {
    const onlyClass = /^\s*->only\(\s*\[?\s*'class'\s*\]?\s*\)/.test(chain);
    const exceptClass = /->except\(\s*\[?\s*'class'\s*\]?\s*\)/.test(chain);
    const exceptStyle = /->except\(\s*\[[^\]]*'style'/.test(chain);
    if (!exceptClass) classOutputs++;
    if (!onlyClass) restOutputs++;
    if (!onlyClass && !exceptStyle) styleOutputs++;
  }

  return { classOutputs, restOutputs, styleOutputs };
}

function checkDuplicateAttributes(files) {
  const failures = [];
  for (const file of files) {
    for (const { tag, line } of extractOpeningTags(fs.readFileSync(file, "utf8"))) {
      const { classOutputs, restOutputs, styleOutputs } = countAttributeOutputs(tag);
      const snippet = tag.replace(/\s+/g, " ").slice(0, 160);
      if (classOutputs > 1) {
        failures.push({
          file: path.relative(ROOT, file),
          line,
          pattern: "duplicate-class-attr",
          hint: "同一標籤輸出多個 class 屬性，瀏覽器只採用第一個、使用者的 class 會遺失；根元素改用 {{ $attributes->class([...]) }}（勿再搭配裸 {{ $attributes }}）",
          snippet,
        });
      }
      if (restOutputs > 1) {
        failures.push({
          file: path.relative(ROOT, file),
          line,
          pattern: "duplicate-attributes",
          hint: "同一標籤輸出兩次 attribute bag（如 $attributes->class() + $attributes->except('class')），使用者的 id / data-* 等屬性會重複",
          snippet,
        });
      }
      if (styleOutputs > 1) {
        failures.push({
          file: path.relative(ROOT, file),
          line,
          pattern: "duplicate-style-attr",
          hint: "同一標籤輸出靜態 style 與帶使用者 style 的 $attributes，瀏覽器只採用第一個 style；改用 $attributes->merge(['style' => …])",
          snippet,
        });
      }
    }
  }
  return failures;
}

/** void 元素：可自閉合（與 transformers.cjs 的清單獨立維護，作為交叉檢查） */
const VOID_ELEMENTS = new Set("area base br col embed hr img input link meta source track wbr".split(" "));

/** SVG 元素（小寫）：位於 <svg> 內為 foreign content，自閉合合法；fe* 濾鏡元素以前綴判斷 */
const SVG_ELEMENTS = new Set(
  (
    "svg g defs symbol use path circle ellipse line polyline polygon rect text tspan image stop " +
    "lineargradient radialgradient pattern mask clippath marker filter animate animatetransform set desc " +
    "metadata foreignobject"
  ).split(" "),
);

/**
 * 非 void 的 HTML 元素自閉合（`<span … />`）：HTML 解析器忽略 `/>`，標籤不會關閉，
 * 後面的兄弟元素被包進去。void 元素、SVG 元素、<x-*> 元件 tag 除外。
 */
function checkSelfClosingTags(files) {
  const failures = [];
  for (const file of files) {
    for (const { tag, line } of extractOpeningTags(fs.readFileSync(file, "utf8"))) {
      const m = tag.match(/^<([a-z][\w-]*)\b[\s\S]*\/>$/);
      if (!m) continue;
      const name = m[1].toLowerCase();
      if (VOID_ELEMENTS.has(name) || SVG_ELEMENTS.has(name) || name.startsWith("fe") || name.startsWith("x-")) continue;
      failures.push({
        file: path.relative(ROOT, file),
        line,
        pattern: "self-closing-non-void",
        hint: `<${m[1]} /> 不是 void 元素，HTML 會忽略 /> 而不關閉標籤；應輸出 <${m[1]} …></${m[1]}>（transformers.cjs 的 expandSelfClosingTags）`,
        snippet: tag.replace(/\s+/g, " ").slice(0, 160),
      });
    }
  }
  return failures;
}

const BLADE_COMMENT_RE = /\{\{--[\s\S]*?--\}\}/g;
const ARRAY_DIRECTIVE_RE = /@(class|props)\(\s*(\[[\s\S]*?\])\s*\)/g;
// 允許條件式內含一層巢狀括號（如 `$slot->isEmpty()` 或 `! is_null($x)`）
const IF_DIRECTIVE_RE = /@(?:else)?if\(((?:[^()\n]|\([^()\n]*\))+)\)/g;
const ECHO_DIRECTIVE_RE = /\{\{\s*([\s\S]*?)\s*\}\}/g;

/**
 * 抽出 blade 檔中可獨立驗證的 PHP 片段：
 *   @class([...]) / @props([...]) / @if(...) / @elseif(...) / {{ ... }} /
 *   @php ... @endphp / 元件 :attr="..." 綁定
 */
function extractPhpSnippets(src) {
  const snippets = [];
  const cleaned = src.replace(BLADE_COMMENT_RE, "");

  let m;
  while ((m = ARRAY_DIRECTIVE_RE.exec(cleaned)) !== null) {
    snippets.push({ kind: `@${m[1]}`, code: `$__ = ${m[2]};` });
  }
  while ((m = IF_DIRECTIVE_RE.exec(cleaned)) !== null) {
    snippets.push({ kind: "@if", code: `if(${m[1]}){}` });
  }
  while ((m = ECHO_DIRECTIVE_RE.exec(cleaned)) !== null) {
    const inner = m[1].trim();
    if (inner) snippets.push({ kind: "{{ }}", code: `$__ = (${inner});` });
  }
  for (const region of extractPhpRegions(src)) {
    if (region.kind === "@php") {
      snippets.push({ kind: "@php", code: `${region.code.trim()}\n` });
    } else if (region.kind === ":attr") {
      snippets.push({ kind: ":attr", code: `$__ = (${region.code});` });
    }
  }
  return snippets;
}

/**
 * 將所有檔案的片段串成一個 PHP 檔，一次 `php -l` 快速過 happy path。
 * 回傳 null 代表全部通過；回傳 { stdout } 代表至少一個檔案有語法問題，
 * 此時呼叫端會 fallback 到 per-file lint 以精準定位（慢路徑）。
 */
function runPhpLintBatch(fileSnippets) {
  const parts = ["<?php"];
  for (const { snippets } of fileSnippets) {
    for (const s of snippets) parts.push(s.code);
  }
  if (parts.length === 1) return null;

  const tmp = path.join(os.tmpdir(), `blade-lint-batch-${process.pid}-${Date.now()}.php`);
  fs.writeFileSync(tmp, parts.join("\n") + "\n");
  try {
    const out = cp.spawnSync("php", ["-l", tmp], { encoding: "utf8" });
    if (out.status === 0) return null;
    return { stdout: (out.stdout || "").trim() };
  } finally {
    try {
      fs.unlinkSync(tmp);
    } catch {}
  }
}

/**
 * 對單一檔案跑 `php -l` — 僅在 batch 失敗時用來精準定位哪個檔案壞掉。
 */
function runPhpLintSingle(file, snippets) {
  if (snippets.length === 0) return null;
  const tmp = path.join(
    os.tmpdir(),
    `blade-lint-${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.php`,
  );
  fs.writeFileSync(tmp, "<?php\n" + snippets.map((s) => s.code).join("\n") + "\n");
  try {
    const out = cp.spawnSync("php", ["-l", tmp], { encoding: "utf8" });
    if (out.status === 0) return null;
    return (out.stdout || "").trim();
  } finally {
    try {
      fs.unlinkSync(tmp);
    } catch {}
  }
}

function checkPhpSyntax(files) {
  const fileSnippets = files.map((file) => ({
    file,
    snippets: extractPhpSnippets(fs.readFileSync(file, "utf8")),
  }));

  const batchError = runPhpLintBatch(fileSnippets);
  if (!batchError) {
    if (VERBOSE) {
      const total = fileSnippets.reduce((s, f) => s + f.snippets.length, 0);
      console.log(`  ✓ ${files.length} 檔案 / ${total} 片段 一次 php -l 通過`);
    }
    return [];
  }

  console.warn("  ⚠  批次 php -l 失敗，逐檔定位中…");
  const failures = [];
  for (const { file, snippets } of fileSnippets) {
    const err = runPhpLintSingle(file, snippets);
    if (err) failures.push({ file: path.relative(ROOT, file), stdout: err });
  }
  return failures;
}

function main() {
  if (!fs.existsSync(DIST_DIR)) {
    console.error(`✗ 找不到 ${DIST_DIR}，請先執行 \`npm run build:blade\``);
    process.exit(1);
  }

  const files = walk(DIST_DIR);
  console.log(`🔍 檢查 ${files.length} 個 .blade.php 檔案`);

  let exitCode = 0;

  // (1) Pattern check
  const patternFails = [...checkBadPatterns(files), ...checkDuplicateAttributes(files), ...checkSelfClosingTags(files)];
  if (patternFails.length > 0) {
    exitCode = 1;
    console.error(`\n✗ 發現 ${patternFails.length} 個壞 pattern：`);
    for (const f of patternFails) {
      console.error(`  [${f.pattern}] ${f.file}:${f.line}`);
      console.error(`    ${f.snippet}`);
      console.error(`    → ${f.hint}`);
    }
  } else {
    console.log(
      "✓ 無已知壞 pattern（`,,`、空陣列元素、未轉譯 JSX / Astro 語法、'$ 開頭的字串、同標籤重複 class / style / attribute bag、非 void 自閉合、半壓縮的 class 陣列）",
    );
  }

  // (2) Undeclared variables
  const varFails = checkUndeclaredVariables(files);
  if (varFails.length > 0) {
    exitCode = 1;
    console.error(`\n✗ 發現 ${varFails.length} 個未宣告變數（Laravel 會拋 Undefined variable）：`);
    for (const f of varFails) {
      console.error(`  ${f.file}: $${f.name}（於 ${f.kind}）`);
    }
    console.error("    → frontmatter const 需靜態內聯或輸出為 @php 指派（parser.cjs buildPhpAssignments）");
  } else {
    console.log("✓ 所有 $變數 皆已於 @props / @php / 迴圈宣告");
  }

  // (3) PHP lint
  if (SKIP_PHP) {
    console.log("⏭  略過 php -l 驗證與 render smoke test（--skip-php）");
  } else {
    const hasPhp = cp.spawnSync("php", ["--version"], { encoding: "utf8" }).status === 0;
    if (!hasPhp) {
      console.warn("⚠  系統未安裝 php，略過語法驗證與 render smoke test（可用 --skip-php 隱藏此訊息）");
      if (REQUIRE_RENDER) exitCode = 1;
    } else {
      const phpFails = checkPhpSyntax(files);
      if (phpFails.length > 0) {
        exitCode = 1;
        console.error(`\n✗ ${phpFails.length} 個檔案含無效 PHP 片段：`);
        for (const f of phpFails) {
          console.error(`  ${f.file}`);
          if (f.stdout) console.error(`    ${f.stdout.split("\n").join("\n    ")}`);
        }
      } else {
        console.log("✓ 所有 @class / @props / @if / @php / {{ }} 片段通過 php -l");
      }

      // (4) Render smoke test
      if (SKIP_RENDER) {
        console.log("⏭  略過 render smoke test（--skip-render）");
      } else if (
        !runRenderSmoke({
          componentsDir: path.join(DIST_DIR, "components"),
          verbose: VERBOSE,
          required: REQUIRE_RENDER,
        })
      ) {
        exitCode = 1;
      }
    }
  }

  process.exit(exitCode);
}

main();
