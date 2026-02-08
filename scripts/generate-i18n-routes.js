/**
 * 自動產生 zh-tw 路由頁面
 *
 * 掃描 src/pages/ 下所有 .astro 檔案（排除 zh-tw/ 和 examples/），
 * 複製到 src/pages/zh-tw/ 對應路徑。
 * 因為頁面使用 @/ 別名匯入，複製後不需調整 import 路徑。
 */

import { readdir, cp, rm, mkdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { existsSync } from 'node:fs';

const PAGES_DIR = join(import.meta.dirname, '..', 'src', 'pages');
const TARGET_DIR = join(PAGES_DIR, 'zh-tw');
const EXCLUDE_DIRS = ['zh-tw', 'examples'];

async function collectFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    const relPath = relative(PAGES_DIR, fullPath);

    // 排除特定目錄
    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.includes(entry.name)) continue;
      files.push(...await collectFiles(fullPath));
    } else if (entry.name.endsWith('.astro')) {
      files.push(relPath);
    }
  }

  return files;
}

async function generate() {
  // 清除舊的 zh-tw 目錄
  if (existsSync(TARGET_DIR)) {
    await rm(TARGET_DIR, { recursive: true });
  }
  await mkdir(TARGET_DIR, { recursive: true });

  const files = await collectFiles(PAGES_DIR);

  for (const relPath of files) {
    const src = join(PAGES_DIR, relPath);
    const dest = join(TARGET_DIR, relPath);
    const destDir = join(dest, '..');
    await mkdir(destDir, { recursive: true });
    await cp(src, dest);
  }

  console.log(`[i18n] Generated ${files.length} zh-tw route(s) in src/pages/zh-tw/`);
}

generate().catch((err) => {
  console.error('[i18n] Failed to generate routes:', err);
  process.exit(1);
});
