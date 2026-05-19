#!/usr/bin/env node

/**
 * Blade 檔案語法回歸測試
 *
 * 對 dist/laravel/ 下所有 .blade.php 做兩層檢查：
 *
 *   (1) 已知 bug pattern — 以字串 / regex 方式確保產生器不會再輸出：
 *       - `,,`（空陣列元素；PHP 8.3+ Fatal）
 *       - `@class([,`、`, ]`（純空白前後的空元素）
 *       - 未轉譯的 JSX 表達式片段 `=\{.+\}`（屬性值殘留 JS）
 *
 *   (2) PHP 8.3 parse — 將 `@class([...])`、`@props([...])`、`@if(...)`
 *       等 Blade directive 內的 PHP 片段萃取出來，包進最小 PHP 檔後以 `php -l`
 *       驗證語法可被 8.3 parse（`.blade.php` 直接餵 `php -l` 會因 `@class`
 *       等 directive 被當成識別字而失敗，需先萃取）。
 *
 * 使用：
 *   node scripts/blade/test-blade-syntax.cjs
 *   node scripts/blade/test-blade-syntax.cjs --verbose
 *   node scripts/blade/test-blade-syntax.cjs --skip-php   # 沒裝 php 時跳過
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const cp = require('child_process');

const ROOT = path.join(__dirname, '..', '..');
const DIST_DIR = path.join(ROOT, 'dist', 'laravel');

const args = process.argv.slice(2);
const VERBOSE = args.includes('--verbose');
const SKIP_PHP = args.includes('--skip-php');

/** 已知壞 pattern：在 dist/ 裡任何 blade 檔出現即視為失敗 */
const BAD_PATTERNS = [
  {
    name: 'double-comma',
    regex: /,,/,
    hint: 'PHP 8.3+ 會拋 "Cannot use empty array elements"；檢查 class-resolver 的 @class([...]) 輸出邏輯',
  },
  {
    name: 'empty-array-leading-comma',
    regex: /\[\s*,/,
    hint: '陣列以 `,` 開頭，PHP 會解析為空元素',
  },
  {
    name: 'empty-array-double-comma-newline',
    regex: /,\s*,\s*\]/,
    hint: '陣列尾部出現 `, ,]`，將產生空元素',
  },
  {
    name: 'unconverted-jsx-attr',
    // 屬性值為 `={...}` 但 `...` 裡含 `||` 或未包 `{{ }}` 的純 JS 表達式
    regex: /=\{[^{}\n]*\|\|[^{}\n]*\}/,
    hint: '殘留未轉譯的 JSX 屬性表達式（如 {prop || undefined}）',
  },
];

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, acc);
    else if (entry.isFile() && entry.name.endsWith('.blade.php')) acc.push(p);
  }
  return acc;
}

function checkBadPatterns(files) {
  const failures = [];
  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8');
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
 *   @class([...]) / @props([...]) / @if(...) / @elseif(...) / {{ ... }}
 */
function extractPhpSnippets(src) {
  const snippets = [];
  const cleaned = src.replace(BLADE_COMMENT_RE, '');

  let m;
  while ((m = ARRAY_DIRECTIVE_RE.exec(cleaned)) !== null) {
    snippets.push({ kind: `@${m[1]}`, code: `$__ = ${m[2]};` });
  }
  while ((m = IF_DIRECTIVE_RE.exec(cleaned)) !== null) {
    snippets.push({ kind: '@if', code: `if(${m[1]}){}` });
  }
  while ((m = ECHO_DIRECTIVE_RE.exec(cleaned)) !== null) {
    const inner = m[1].trim();
    if (inner) snippets.push({ kind: '{{ }}', code: `$__ = (${inner});` });
  }
  return snippets;
}

/**
 * 將所有檔案的片段串成一個 PHP 檔，一次 `php -l` 快速過 happy path。
 * 回傳 null 代表全部通過；回傳 { stdout } 代表至少一個檔案有語法問題，
 * 此時呼叫端會 fallback 到 per-file lint 以精準定位（慢路徑）。
 */
function runPhpLintBatch(fileSnippets) {
  const parts = ['<?php'];
  for (const { snippets } of fileSnippets) {
    for (const s of snippets) parts.push(s.code);
  }
  if (parts.length === 1) return null;

  const tmp = path.join(os.tmpdir(), `blade-lint-batch-${process.pid}-${Date.now()}.php`);
  fs.writeFileSync(tmp, parts.join('\n') + '\n');
  try {
    const out = cp.spawnSync('php', ['-l', tmp], { encoding: 'utf8' });
    if (out.status === 0) return null;
    return { stdout: (out.stdout || '').trim() };
  } finally {
    try { fs.unlinkSync(tmp); } catch {}
  }
}

/**
 * 對單一檔案跑 `php -l` — 僅在 batch 失敗時用來精準定位哪個檔案壞掉。
 */
function runPhpLintSingle(file, snippets) {
  if (snippets.length === 0) return null;
  const tmp = path.join(os.tmpdir(), `blade-lint-${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.php`);
  fs.writeFileSync(tmp, '<?php\n' + snippets.map((s) => s.code).join('\n') + '\n');
  try {
    const out = cp.spawnSync('php', ['-l', tmp], { encoding: 'utf8' });
    if (out.status === 0) return null;
    return (out.stdout || '').trim();
  } finally {
    try { fs.unlinkSync(tmp); } catch {}
  }
}

function checkPhpSyntax(files) {
  const fileSnippets = files.map((file) => ({
    file,
    snippets: extractPhpSnippets(fs.readFileSync(file, 'utf8')),
  }));

  const batchError = runPhpLintBatch(fileSnippets);
  if (!batchError) {
    if (VERBOSE) {
      const total = fileSnippets.reduce((s, f) => s + f.snippets.length, 0);
      console.log(`  ✓ ${files.length} 檔案 / ${total} 片段 一次 php -l 通過`);
    }
    return [];
  }

  console.warn('  ⚠  批次 php -l 失敗，逐檔定位中…');
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
  const patternFails = checkBadPatterns(files);
  if (patternFails.length > 0) {
    exitCode = 1;
    console.error(`\n✗ 發現 ${patternFails.length} 個壞 pattern：`);
    for (const f of patternFails) {
      console.error(`  [${f.pattern}] ${f.file}:${f.line}`);
      console.error(`    ${f.snippet}`);
      console.error(`    → ${f.hint}`);
    }
  } else {
    console.log('✓ 無已知壞 pattern（`,,`、空陣列元素、未轉譯 JSX）');
  }

  // (2) PHP lint
  if (SKIP_PHP) {
    console.log('⏭  略過 php -l 驗證（--skip-php）');
  } else {
    const hasPhp = cp.spawnSync('php', ['--version'], { encoding: 'utf8' }).status === 0;
    if (!hasPhp) {
      console.warn('⚠  系統未安裝 php，略過語法驗證（可用 --skip-php 隱藏此訊息）');
    } else {
      const phpFails = checkPhpSyntax(files);
      if (phpFails.length > 0) {
        exitCode = 1;
        console.error(`\n✗ ${phpFails.length} 個檔案含無效 PHP 片段：`);
        for (const f of phpFails) {
          console.error(`  ${f.file}`);
          if (f.stdout) console.error(`    ${f.stdout.split('\n').join('\n    ')}`);
        }
      } else {
        console.log('✓ 所有 @class / @props / @if / {{ }} 片段通過 php -l');
      }
    }
  }

  process.exit(exitCode);
}

main();
