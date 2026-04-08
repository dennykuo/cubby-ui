import type { Locale } from '../../index';

export const backToTopPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    primary: { title: string; description: string };
    sizes: { title: string; description: string };
    threshold: { title: string; description: string };
    leftPosition: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Back to Top — Cubby UI',
    description: 'A floating button that appears after scrolling down, allowing users to quickly return to the top of the page.',
    category: 'Navigation',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Use <code class="cu-code">cu-back-to-top</code> with <code class="cu-code">data-cu-back-to-top</code>. The button automatically shows/hides based on scroll position.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      primary: {
        title: 'Primary',
        description: 'Use <code class="cu-code">cu-back-to-top-primary</code> to apply the primary color theme to the button.',
      },
      sizes: {
        title: 'Sizes',
        description: 'Use <code class="cu-code">cu-back-to-top-sm</code> or <code class="cu-code">cu-back-to-top-lg</code> for different sizes.',
      },
      threshold: {
        title: 'Scroll Threshold',
        description: 'Use <code class="cu-code">data-cu-back-to-top-threshold</code> to customize the scroll distance (in pixels) before the button appears. Defaults to 300.',
      },
      leftPosition: {
        title: 'Left Position',
        description: 'Use <code class="cu-code">cu-back-to-top-left</code> to position the button on the bottom-left instead of the default bottom-right.',
      },
    },
    classDescriptions: {
      'cu-back-to-top': 'Base class for the back-to-top button',
      'cu-back-to-top-visible': 'Visible state (applied via JS when scrolled past threshold)',
      'cu-back-to-top-primary': 'Primary color variant',
      'cu-back-to-top-sm': 'Small size (36px)',
      'cu-back-to-top-lg': 'Large size (52px)',
      'cu-back-to-top-left': 'Position on the bottom-left',
    },
  },
  'zh-tw': {
    title: 'Back to Top 回到頂部 — Cubby UI',
    description: '向下捲動後出現的浮動按鈕，讓使用者快速返回頁面頂部。',
    category: 'Navigation',
    sections: {
      usage: {
        title: '使用方式',
        description: '使用 <code class="cu-code">cu-back-to-top</code> 搭配 <code class="cu-code">data-cu-back-to-top</code>。按鈕會根據捲動位置自動顯示/隱藏。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      primary: {
        title: '主要色',
        description: '使用 <code class="cu-code">cu-back-to-top-primary</code> 套用主要色彩主題到按鈕上。',
      },
      sizes: {
        title: '尺寸',
        description: '使用 <code class="cu-code">cu-back-to-top-sm</code> 或 <code class="cu-code">cu-back-to-top-lg</code> 設定不同尺寸。',
      },
      threshold: {
        title: '捲動閾值',
        description: '使用 <code class="cu-code">data-cu-back-to-top-threshold</code> 自訂按鈕出現前的捲動距離（像素）。預設為 300。',
      },
      leftPosition: {
        title: '左側位置',
        description: '使用 <code class="cu-code">cu-back-to-top-left</code> 將按鈕定位在左下角，而非預設的右下角。',
      },
    },
    classDescriptions: {
      'cu-back-to-top': '回到頂部按鈕的基礎類別',
      'cu-back-to-top-visible': '可見狀態（捲動超過閾值時由 JS 套用）',
      'cu-back-to-top-primary': '主要色彩變體',
      'cu-back-to-top-sm': '小尺寸（36px）',
      'cu-back-to-top-lg': '大尺寸（52px）',
      'cu-back-to-top-left': '定位在左下角',
    },
  },
};
