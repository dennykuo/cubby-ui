import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import expressiveCode from 'astro-expressive-code';

// https://astro.build/config
export default defineConfig({
  outDir: 'docs',
  vite: {
    plugins: [tailwindcss()],
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
