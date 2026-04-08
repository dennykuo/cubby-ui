import type { Locale } from '../../index';

export const ratingPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    values: { title: string; description: string };
    halfStar: { title: string; description: string };
    sizes: { title: string; description: string };
    readonly: { title: string; description: string };
    interactive: { title: string; description: string };
    disabled: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Rating — Cubby UI',
    description: 'Displays a star rating for reviews, feedback, or scoring.',
    category: 'Forms',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Use <code class="cu-code">cu-rating</code> with <code class="cu-code">cu-rating-item</code> spans. Add <code class="cu-code">cu-rating-item-active</code> to filled stars.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      values: {
        title: 'Different Values',
        description: 'Control the number of filled stars to represent different ratings.',
      },
      halfStar: {
        title: 'Half Star',
        description: 'Use <code class="cu-code">cu-rating-item-half</code> for half-star ratings with a CSS clip-path overlay.',
      },
      sizes: {
        title: 'Sizes',
        description: 'Use <code class="cu-code">cu-rating-sm</code> or <code class="cu-code">cu-rating-lg</code> for different sizes.',
      },
      readonly: {
        title: 'Readonly',
        description: 'Add <code class="cu-code">cu-rating-readonly</code> to display a non-interactive rating.',
      },
      interactive: {
        title: 'Interactive (Form)',
        description: 'Use hidden radio inputs with <code class="cu-code">cu-rating-input</code> for form submission.',
      },
      disabled: {
        title: 'Disabled',
        description: 'Add <code class="cu-code">cu-rating-disabled</code> to dim and disable the rating.',
      },
    },
    classDescriptions: {
      'cu-rating': 'Container for rating stars',
      'cu-rating-item': 'Individual star element',
      'cu-rating-item-active': 'Filled/active star (amber color)',
      'cu-rating-item-half': 'Half-filled star with clip-path overlay',
      'cu-rating-input': 'Hidden radio input for form submission',
      'cu-rating-readonly': 'Non-interactive display mode',
      'cu-rating-disabled': 'Dimmed disabled state',
      'cu-rating-sm': 'Small size (16px)',
      'cu-rating-lg': 'Large size (28px)',
    },
  },
  'zh-tw': {
    title: 'Rating 評分 — Cubby UI',
    description: '用於評論、回饋或評分的星星評分元件。',
    category: 'Forms',
    sections: {
      usage: {
        title: '使用方式',
        description: '使用 <code class="cu-code">cu-rating</code> 搭配 <code class="cu-code">cu-rating-item</code> span 元素。在已填滿的星星加上 <code class="cu-code">cu-rating-item-active</code>。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      values: {
        title: '不同數值',
        description: '透過控制填滿的星星數量來表示不同的評分。',
      },
      halfStar: {
        title: '半星',
        description: '使用 <code class="cu-code">cu-rating-item-half</code> 搭配 CSS clip-path 覆蓋實現半星評分。',
      },
      sizes: {
        title: '尺寸',
        description: '使用 <code class="cu-code">cu-rating-sm</code> 或 <code class="cu-code">cu-rating-lg</code> 設定不同尺寸。',
      },
      readonly: {
        title: '唯讀',
        description: '加上 <code class="cu-code">cu-rating-readonly</code> 顯示不可互動的評分。',
      },
      interactive: {
        title: '互動式（表單）',
        description: '使用隱藏的 radio input 搭配 <code class="cu-code">cu-rating-input</code> 進行表單提交。',
      },
      disabled: {
        title: '停用',
        description: '加上 <code class="cu-code">cu-rating-disabled</code> 使評分元件變暗並停用。',
      },
    },
    classDescriptions: {
      'cu-rating': '評分星星的容器',
      'cu-rating-item': '單個星星元素',
      'cu-rating-item-active': '填滿/啟用的星星（琥珀色）',
      'cu-rating-item-half': '半填滿的星星，使用 clip-path 覆蓋',
      'cu-rating-input': '用於表單提交的隱藏 radio input',
      'cu-rating-readonly': '不可互動的展示模式',
      'cu-rating-disabled': '變暗的停用狀態',
      'cu-rating-sm': '小尺寸（16px）',
      'cu-rating-lg': '大尺寸（28px）',
    },
  },
};
