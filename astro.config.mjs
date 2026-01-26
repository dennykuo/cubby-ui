import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import expressiveCode from 'astro-expressive-code';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [expressiveCode({
    themes: ['github-dark', 'github-light'],
    frames: {
      showCopyToClipboardButton: false,
    },
    styleOverrides: {
      frames: {
        shadowColor: 'transparent',
      }
    }
  })],
});