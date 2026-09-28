import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { cpSync, mkdirSync, rmSync, existsSync, readdirSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import expressiveCode from 'astro-expressive-code';
import { buildCubbyUiJs } from './scripts/build-js.mjs';

/**
 * Vite plugin: dev 模式下 watch src/pages/ 變動，自動同步至 zh-tw/
 */
function i18nHotSync() {
  const pagesDir = fileURLToPath(new URL('./src/pages/', import.meta.url));
  const targetDir = join(pagesDir, 'zh-tw');
  const excludeDirs = ['zh-tw', 'examples'];

  function collectFiles(dir) {
    const files = [];
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (excludeDirs.includes(entry.name)) continue;
        files.push(...collectFiles(fullPath));
      } else if (entry.name.endsWith('.astro')) {
        files.push(relative(pagesDir, fullPath));
      }
    }
    return files;
  }

  function syncAll() {
    if (existsSync(targetDir)) rmSync(targetDir, { recursive: true });
    mkdirSync(targetDir, { recursive: true });
    const files = collectFiles(pagesDir);
    for (const relPath of files) {
      const dest = join(targetDir, relPath);
      mkdirSync(dirname(dest), { recursive: true });
      cpSync(join(pagesDir, relPath), dest);
    }
  }

  function syncOne(filePath) {
    const relPath = relative(pagesDir, filePath);
    if (relPath.startsWith('zh-tw') || relPath.startsWith('examples')) return;
    if (!relPath.endsWith('.astro')) return;
    const dest = join(targetDir, relPath);
    mkdirSync(dirname(dest), { recursive: true });
    cpSync(filePath, dest);
  }

  // 立即執行初始同步（模組載入時，早於 Astro 路由掃描）
  syncAll();

  return {
    name: 'i18n-hot-sync',
    apply: 'serve',
    configureServer(server) {
      server.watcher.on('change', (filePath) => {
        if (filePath.startsWith(pagesDir) && !filePath.startsWith(targetDir)) {
          syncOne(filePath);
        }
      });

      server.watcher.on('add', (filePath) => {
        if (filePath.startsWith(pagesDir) && !filePath.startsWith(targetDir)) {
          syncOne(filePath);
        }
      });
    },
  };
}

/**
 * Vite plugin: 以 esbuild 將 src/scripts/（ESM 模組）打包成 dist/core/cubby-ui.js（UMD）。
 * 文檔站的 Layout / ComponentPreview 以 `?url` 載入該產物（頁面與 iframe 預覽都需要
 * window.CubbyUI 全域），因此必須在模組解析前就緒；dev 模式監看 src/scripts/ 變動自動重建。
 */
function cubbyUiJsBundle() {
  const scriptsDir = fileURLToPath(new URL('./src/scripts/', import.meta.url));
  const isLibSource = (filePath) =>
    filePath.startsWith(scriptsDir) && filePath.endsWith('.js') && !filePath.endsWith('playground.js');

  return {
    name: 'cubby-ui-js-bundle',
    configResolved() {
      buildCubbyUiJs();
    },
    configureServer(server) {
      server.watcher.add(scriptsDir);
      const rebuild = (filePath) => {
        if (!isLibSource(filePath)) return;
        try {
          buildCubbyUiJs();
          server.ws.send({ type: 'full-reload' });
        } catch (err) {
          server.config.logger.error(`[cubby-ui-js-bundle] ${err.message}`);
        }
      };
      server.watcher.on('change', rebuild);
      server.watcher.on('add', rebuild);
      server.watcher.on('unlink', rebuild);
    },
  };
}

// https://astro.build/config
export default defineConfig({
  outDir: 'docs',
  vite: {
    plugins: [tailwindcss(), cubbyUiJsBundle(), i18nHotSync()],
    server: {
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-tw'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },

  integrations: [expressiveCode({
    themes: ['min-light', 'min-dark'],
    frames: {
      showCopyToClipboardButton: false,
    },
    styleOverrides: {
      codeBackground: 'transparent',
      borderColor: 'transparent',
      codeFontSize: '13px',
      codePaddingBlock: '0',
      codePaddingInline: '0',
      frames: {
        shadowColor: 'transparent',
      }
    }
  })],
});
