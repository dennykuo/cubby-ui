import type { Locale } from '../../index';

export const spinnerPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    sizes: { title: string; description: string };
    colors: { title: string; description: string };
    buttonLoading: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Spinner — Cubby UI',
    description: 'A loading indicator for asynchronous operations.',
    category: 'Feedback',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Apply <code class="cu-code">cu-spinner</code> as the base class with a size modifier. The spinner uses <code class="cu-code">border</code> and <code class="cu-code">animate-spin</code> for a pure CSS animation.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      sizes: {
        title: 'Sizes',
        description: 'Three sizes are available — <code class="cu-code">cu-spinner-sm</code> (16px), <code class="cu-code">cu-spinner-md</code> (24px, default), and <code class="cu-code">cu-spinner-lg</code> (32px).',
      },
      colors: {
        title: 'Colors',
        description: 'Use color variant classes like <code class="cu-code">cu-spinner-primary</code> to apply semantic colors. The spinner also inherits the current text color via <code class="cu-code">border-current</code>.',
      },
      buttonLoading: {
        title: 'Button Loading',
        description: 'Combine with a button to indicate a loading state.',
      },
    },
    classDescriptions: {
      'cu-spinner': 'Spinner base with border animation',
      'cu-spinner-sm': 'Small size (16px)',
      'cu-spinner-md': 'Medium size (24px, default)',
      'cu-spinner-lg': 'Large size (32px)',
      'cu-spinner-primary': 'Primary color',
      'cu-spinner-secondary': 'Secondary color',
      'cu-spinner-destructive': 'Destructive color',
      'cu-spinner-success': 'Success color',
      'cu-spinner-warning': 'Warning color',
      'cu-spinner-info': 'Info color',
      'cu-spinner-muted': 'Muted color',
    },
  },
  'zh-tw': {
    title: 'Spinner — Cubby UI',
    description: '非同步操作的載入指示器。',
    category: '回饋',
    sections: {
      usage: {
        title: '使用方式',
        description: '以 <code class="cu-code">cu-spinner</code> 作為基礎類別並搭配尺寸修飾符。Spinner 使用 <code class="cu-code">border</code> 和 <code class="cu-code">animate-spin</code> 實現純 CSS 動畫。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      sizes: {
        title: '尺寸',
        description: '提供三種尺寸 — <code class="cu-code">cu-spinner-sm</code>（16px）、<code class="cu-code">cu-spinner-md</code>（24px，預設）和 <code class="cu-code">cu-spinner-lg</code>（32px）。',
      },
      colors: {
        title: '顏色',
        description: '使用顏色變體類別（如 <code class="cu-code">cu-spinner-primary</code>）套用語意色彩。Spinner 也透過 <code class="cu-code">border-current</code> 繼承當前文字顏色。',
      },
      buttonLoading: {
        title: '按鈕載入',
        description: '搭配按鈕使用以指示載入狀態。',
      },
    },
    classDescriptions: {
      'cu-spinner': 'Spinner 基礎樣式，帶邊框動畫',
      'cu-spinner-sm': '小尺寸（16px）',
      'cu-spinner-md': '中尺寸（24px，預設）',
      'cu-spinner-lg': '大尺寸（32px）',
      'cu-spinner-primary': 'Primary 顏色',
      'cu-spinner-secondary': 'Secondary 顏色',
      'cu-spinner-destructive': 'Destructive 顏色',
      'cu-spinner-success': 'Success 顏色',
      'cu-spinner-warning': 'Warning 顏色',
      'cu-spinner-info': 'Info 顏色',
      'cu-spinner-muted': 'Muted 顏色',
    },
  },
};
