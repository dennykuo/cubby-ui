import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import expressiveCode from 'astro-expressive-code';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [expressiveCode({
    themes: ['min-light', 'min-dark'],
    frames: {
      showCopyToClipboardButton: false,
    },
    styleOverrides: {
      codeBackground: 'transparent',
      borderColor: 'transparent',
      frames: {
        shadowColor: 'transparent',
      }
    }
  })],
});