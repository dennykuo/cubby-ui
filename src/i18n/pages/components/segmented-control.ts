import type { Locale } from '../../index';

export const segmentedControlPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    sizes: { title: string; description: string };
    block: { title: string; description: string };
    accessible: { title: string; description: string };
    withIcons: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Segmented Control — Cubby UI',
    description: 'A toggle group for switching between a small set of options.',
    category: 'Navigation',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Wrap <code class="cu-code">cu-segmented-item</code> elements inside a <code class="cu-code">cu-segmented</code> container.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      sizes: {
        title: 'Sizes',
        description: 'Use <code class="cu-code">cu-segmented-sm</code> or <code class="cu-code">cu-segmented-lg</code> on the container for different sizes.',
      },
      block: {
        title: 'Block (Full Width)',
        description: 'Add <code class="cu-code">cu-segmented-block</code> to stretch the control to full width with equally-sized items.',
      },
      accessible: {
        title: 'Accessible (Radio Input)',
        description: 'Use hidden radio inputs with <code class="cu-code">cu-segmented-input</code> for native keyboard navigation and form submission. Add <code class="cu-code">data-cu-segmented</code> on the container for JS-managed active state.',
      },
      withIcons: {
        title: 'With Icons',
        description: 'Add SVG icons inside each item for visual cues.',
      },
    },
    classDescriptions: {
      'cu-segmented': 'Container with muted background and rounded corners',
      'cu-segmented-input': 'Hidden radio input for accessible keyboard navigation',
      'cu-segmented-item': 'Individual option with hover and focus states',
      'cu-segmented-item-active': 'Active option with elevated background',
      'cu-segmented-sm': 'Small size container',
      'cu-segmented-lg': 'Large size container',
      'cu-segmented-block': 'Full-width with equally-sized items',
    },
  },
  'zh-tw': {
    title: 'Segmented Control — Cubby UI',
    description: '切換群組控制項，用於在少量選項間切換。',
    category: '導航',
    sections: {
      usage: {
        title: '使用方式',
        description: '將 <code class="cu-code">cu-segmented-item</code> 元素包裹在 <code class="cu-code">cu-segmented</code> 容器中。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      sizes: {
        title: '尺寸',
        description: '在容器上使用 <code class="cu-code">cu-segmented-sm</code> 或 <code class="cu-code">cu-segmented-lg</code> 來調整尺寸。',
      },
      block: {
        title: '滿版',
        description: '加入 <code class="cu-code">cu-segmented-block</code> 使控制項填滿寬度，各選項等寬。',
      },
      accessible: {
        title: '無障礙（Radio Input）',
        description: '使用隱藏的 radio input 搭配 <code class="cu-code">cu-segmented-input</code> 以支援原生鍵盤導航和表單提交。在容器上加入 <code class="cu-code">data-cu-segmented</code> 讓 JS 管理啟用狀態。',
      },
      withIcons: {
        title: '搭配圖示',
        description: '在每個選項中加入 SVG 圖示以提供視覺提示。',
      },
    },
    classDescriptions: {
      'cu-segmented': '容器，帶淡色背景和圓角',
      'cu-segmented-input': '隱藏的 radio input，用於無障礙鍵盤導航',
      'cu-segmented-item': '個別選項，帶 hover 和 focus 狀態',
      'cu-segmented-item-active': '啟用選項，帶浮凸背景',
      'cu-segmented-sm': '小尺寸容器',
      'cu-segmented-lg': '大尺寸容器',
      'cu-segmented-block': '滿版，各選項等寬',
    },
  },
};
