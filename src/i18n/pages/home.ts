import type { Locale } from '../index';

export const homePage: Record<Locale, {
  title: string;
  /** `<meta name="description">`（純文字） */
  metaDescription: string;
  builtOn: string;
  heroTitle: string;
  heroDescription: string;
  getStarted: string;
  browseComponents: string;
  whyCubbyUI: string;
  features: {
    frameworkAgnostic: { title: string; description: string };
    copyPaste: { title: string; description: string };
    semanticClasses: { title: string; description: string };
    minimalJS: { title: string; description: string };
  };
  quickStart: {
    heading: string;
    description: string;
    seeUsageGuide: string;
    usageGuide: string;
  };
  components: {
    heading: string;
    description: string;
  };
  categories: {
    typography: string;
    basic: string;
    forms: string;
    dataDisplay: string;
    feedback: string;
    overlay: string;
    navigation: string;
    layouts: string;
  };
}> = {
  en: {
    title: 'Cubby UI — Elegant Tailwind CSS Components',
    metaDescription: 'Beautifully crafted, framework-agnostic UI components built with pure HTML and Tailwind CSS v4. Semantic cu- classes, built-in dark mode, and minimal vanilla JS. Copy, paste, and ship.',
    builtOn: 'Built on Tailwind CSS v4',
    heroTitle: 'Beautifully crafted<br />UI components',
    heroDescription: 'Framework-agnostic. Pure HTML &amp; Tailwind CSS.<br class="hidden sm:block" />Copy, paste, and ship.',
    getStarted: 'Get Started',
    browseComponents: 'Browse Components',
    whyCubbyUI: 'Why Cubby UI?',
    features: {
      frameworkAgnostic: {
        title: 'Framework-agnostic',
        description: 'Pure HTML + Tailwind CSS. Works with any stack — React, Vue, Svelte, or vanilla HTML.',
      },
      copyPaste: {
        title: 'Copy & paste',
        description: 'Not an npm package. Copy what you need directly into your project. You own the code.',
      },
      semanticClasses: {
        title: 'Semantic classes',
        description: 'Consistent <code class="cu-code">cu-</code> prefix naming. Readable, composable, and easy to remember.',
      },
      minimalJS: {
        title: 'Minimal JS',
        description: 'Most components are CSS-only. Interactive ones use a tiny vanilla JS script with <code class="cu-code">data-*</code> attributes.',
      },
    },
    quickStart: {
      heading: 'Quick start',
      description: 'Include the CSS &amp; JS via CDN, then use <code class="cu-code">cu-</code> prefixed classes in your HTML. No build step required.',
      seeUsageGuide: 'See the',
      usageGuide: 'Usage guide',
    },
    components: {
      heading: 'Components',
      description: '60+ components across 8 categories, from buttons and forms to overlays and navigation.',
    },
    categories: {
      typography: 'Typography',
      basic: 'Basic',
      forms: 'Forms',
      dataDisplay: 'Data Display',
      feedback: 'Feedback',
      overlay: 'Overlay',
      navigation: 'Navigation',
      layouts: 'Layouts',
    },
  },
  'zh-tw': {
    title: 'Cubby UI — 優雅的 Tailwind CSS 元件',
    metaDescription: '精心打造的框架無關 UI 元件，以純 HTML 與 Tailwind CSS v4 構建。語意化 cu- class、內建深色模式、極少量原生 JS，複製、貼上即可上線。',
    builtOn: '基於 Tailwind CSS v4',
    heroTitle: '精心打造的<br />UI 元件',
    heroDescription: '框架無關。純 HTML 與 Tailwind CSS。<br class="hidden sm:block" />複製、貼上、上線。',
    getStarted: '開始使用',
    browseComponents: '瀏覽元件',
    whyCubbyUI: '為什麼選擇 Cubby UI？',
    features: {
      frameworkAgnostic: {
        title: '框架無關',
        description: '純 HTML + Tailwind CSS。適用於任何技術棧 — React、Vue、Svelte 或原生 HTML。',
      },
      copyPaste: {
        title: '複製即用',
        description: '不是 npm 套件。直接複製所需內容到你的專案中。程式碼由你掌控。',
      },
      semanticClasses: {
        title: '語意化類別',
        description: '統一的 <code class="cu-code">cu-</code> 前綴命名。可讀、可組合、容易記憶。',
      },
      minimalJS: {
        title: '極少 JS',
        description: '大部分元件僅需 CSS。互動元件使用輕量的原生 JS 腳本搭配 <code class="cu-code">data-*</code> 屬性。',
      },
    },
    quickStart: {
      heading: '快速開始',
      description: '透過 CDN 引入 CSS 和 JS，然後在 HTML 中使用 <code class="cu-code">cu-</code> 前綴類別。無需建置步驟。',
      seeUsageGuide: '詳細設定說明請參閱',
      usageGuide: '使用指南',
    },
    components: {
      heading: '元件',
      description: '超過 60 個元件涵蓋 8 大分類，從按鈕、表單到浮層與導航。',
    },
    categories: {
      typography: '排版',
      basic: '基礎',
      forms: '表單',
      dataDisplay: '資料展示',
      feedback: '回饋',
      overlay: '浮層',
      navigation: '導航',
      layouts: '佈局',
    },
  },
};
