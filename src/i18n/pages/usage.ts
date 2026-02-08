import type { Locale } from '../index';

export const usagePage: Record<Locale, {
  // Page meta
  title: string;

  // Hero
  heading: string;
  description: string;

  // Installation section
  installation: {
    heading: string;
  };

  // CDN
  cdn: {
    heading: string;
    recommended: string;
    description: string;
    step1Label: string;
    step2Label: string;
    step2Optional: string;
    step2Note: string;
    jsdelivrNote: string;
  };

  // NPM
  npm: {
    heading: string;
    description: string;
  };

  // Manual
  manual: {
    heading: string;
    description: string;
    requires: string;
    copyFiles: string;
    themeFile: string;
    componentsFile: string;
    jsFile: string;
  };

  // Class Naming
  classNaming: {
    heading: string;
    description: string;
  };

  // CSS-only
  cssOnly: {
    heading: string;
    description: string;
  };

  // Interactive
  interactive: {
    heading: string;
    description: string;
    tableComponent: string;
    tableDataAttr: string;
  };

  // Dark Mode
  darkMode: {
    heading: string;
    description: string;
  };
}> = {
  en: {
    title: 'Usage — Cubby UI',

    heading: 'Usage',
    description: 'How to add Cubby UI to your project.',

    installation: {
      heading: 'Installation',
    },

    cdn: {
      heading: 'CDN',
      recommended: 'Recommended',
      description: 'The quickest way to get started. No build tools required.',
      step1Label: 'Add CSS to <code class="cu-code">&lt;head&gt;</code>',
      step2Label: 'Add JS before <code class="cu-code">&lt;/body&gt;</code>',
      step2Optional: 'Optional',
      step2Note: 'Only needed for interactive components (Dialog, Dropdown, Tabs, Combobox, etc.).',
      jsdelivrNote: 'Or use',
    },

    npm: {
      heading: 'NPM',
      description: 'For projects using a bundler like Vite, Webpack, or similar.',
    },

    manual: {
      heading: 'Manual (Tailwind CSS source)',
      description: 'For advanced users who want to customize the theme or use Tailwind CSS utilities. Requires',
      requires: 'Tailwind CSS v4',
      copyFiles: 'Copy these files from <code class="cu-code">src/styles/</code> into your project:',
      themeFile: 'Design tokens — colors, fonts, spacing, and theme variables',
      componentsFile: 'Component CSS classes — the core of Cubby UI',
      jsFile: 'Vanilla JS for interactive components',
    },

    classNaming: {
      heading: 'Class naming convention',
      description: 'All classes use the <code class="cu-code">cu-</code> prefix with a consistent pattern:',
    },

    cssOnly: {
      heading: 'CSS-only components',
      description: 'Most components work with just CSS classes — no JavaScript needed.',
    },

    interactive: {
      heading: 'Interactive components',
      description: 'Some components require JavaScript for interactivity. Include <code class="cu-code">cubby-ui.js</code> and use <code class="cu-code">data-cu-*</code> attributes to initialize them automatically.',
      tableComponent: 'Component',
      tableDataAttr: 'Data attribute',
    },

    darkMode: {
      heading: 'Dark mode',
      description: 'Cubby UI includes built-in dark mode support. Add the <code class="cu-code">dark</code> class to your root element.',
    },
  },

  'zh-tw': {
    title: 'Usage — Cubby UI',

    heading: '使用方式',
    description: '如何將 Cubby UI 加入你的專案。',

    installation: {
      heading: '安裝',
    },

    cdn: {
      heading: 'CDN',
      recommended: '推薦',
      description: '最快的入門方式。不需要建置工具。',
      step1Label: '將 CSS 加入 <code class="cu-code">&lt;head&gt;</code>',
      step2Label: '將 JS 加入 <code class="cu-code">&lt;/body&gt;</code> 前',
      step2Optional: '選用',
      step2Note: '僅互動元件（Dialog、Dropdown、Tabs、Combobox 等）需要。',
      jsdelivrNote: '或使用',
    },

    npm: {
      heading: 'NPM',
      description: '適用於使用 Vite、Webpack 或類似打包工具的專案。',
    },

    manual: {
      heading: '手動安裝（Tailwind CSS 原始碼）',
      description: '適合進階使用者，可自訂主題或使用 Tailwind CSS 工具類別。需要',
      requires: 'Tailwind CSS v4',
      copyFiles: '將以下檔案從 <code class="cu-code">src/styles/</code> 複製到你的專案中：',
      themeFile: '設計 token — 色彩、字型、間距與主題變數',
      componentsFile: '元件 CSS 類別 — Cubby UI 的核心',
      jsFile: '互動元件的原生 JS',
    },

    classNaming: {
      heading: '類別命名規則',
      description: '所有類別使用 <code class="cu-code">cu-</code> 前綴，搭配一致的命名模式：',
    },

    cssOnly: {
      heading: '純 CSS 元件',
      description: '大部分元件只需 CSS 類別，不需要 JavaScript。',
    },

    interactive: {
      heading: '互動元件',
      description: '部分元件需要 JavaScript 來實現互動功能。引入 <code class="cu-code">cubby-ui.js</code> 並使用 <code class="cu-code">data-cu-*</code> 屬性即可自動初始化。',
      tableComponent: '元件',
      tableDataAttr: '資料屬性',
    },

    darkMode: {
      heading: '深色模式',
      description: 'Cubby UI 內建深色模式支援。在根元素加上 <code class="cu-code">dark</code> 類別即可。',
    },
  },
};
