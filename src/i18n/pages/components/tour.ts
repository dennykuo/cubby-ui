import type { Locale } from '../../index';

export const tourPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    steps: { title: string; description: string };
    placement: { title: string; description: string };
    autoStart: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Tour — Cubby UI',
    description: 'A guided tour overlay that walks users through interface elements step by step. Configured via data attributes and JSON step definitions.',
    category: 'Overlay',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Add <code class="cu-code">data-cu-tour</code> to a container element and define steps via <code class="cu-code">data-cu-tour-steps</code> as a JSON array. Each step targets an element by selector.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      steps: {
        title: 'Step Format',
        description: 'Each step object accepts <code class="cu-code">target</code> (CSS selector), <code class="cu-code">title</code>, <code class="cu-code">content</code>, and optional <code class="cu-code">placement</code>. Steps are shown in array order.',
      },
      placement: {
        title: 'Placement',
        description: 'Control tooltip position relative to the target element using the <code class="cu-code">placement</code> property. Supported values: <code class="cu-code">top</code>, <code class="cu-code">bottom</code>, <code class="cu-code">left</code>, <code class="cu-code">right</code>.',
      },
      autoStart: {
        title: 'Auto Start',
        description: 'Add <code class="cu-code">data-cu-tour-auto</code> to automatically start the tour when the page loads, without requiring a manual trigger.',
      },
    },
    classDescriptions: {
      'cu-tour-overlay': 'Full-screen backdrop overlay',
      'cu-tour-spotlight': 'Highlight cutout around the target element',
      'cu-tour-tooltip': 'Tooltip container for step content',
      'cu-tour-tooltip-title': 'Step title text',
      'cu-tour-tooltip-content': 'Step description text',
      'cu-tour-tooltip-footer': 'Footer with navigation buttons',
      'cu-tour-btn': 'Base tour button style',
      'cu-tour-btn-primary': 'Primary action button (Next / Finish)',
      'cu-tour-btn-secondary': 'Secondary action button (Back / Skip)',
      'cu-tour-progress': 'Step progress indicator (e.g. 1/3)',
    },
  },
  'zh-tw': {
    title: 'Tour — Cubby UI',
    description: '引導式導覽覆蓋層，逐步帶領使用者認識介面元素。透過 data 屬性和 JSON 步驟定義進行配置。',
    category: '覆蓋層',
    sections: {
      usage: {
        title: '使用方式',
        description: '在容器元素上加入 <code class="cu-code">data-cu-tour</code>，並透過 <code class="cu-code">data-cu-tour-steps</code> 以 JSON 陣列定義步驟。每個步驟透過選擇器指向目標元素。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      steps: {
        title: '步驟格式',
        description: '每個步驟物件接受 <code class="cu-code">target</code>（CSS 選擇器）、<code class="cu-code">title</code>、<code class="cu-code">content</code>，以及可選的 <code class="cu-code">placement</code>。步驟按陣列順序顯示。',
      },
      placement: {
        title: '位置',
        description: '使用 <code class="cu-code">placement</code> 屬性控制工具提示相對於目標元素的位置。支援的值：<code class="cu-code">top</code>、<code class="cu-code">bottom</code>、<code class="cu-code">left</code>、<code class="cu-code">right</code>。',
      },
      autoStart: {
        title: '自動啟動',
        description: '加入 <code class="cu-code">data-cu-tour-auto</code> 即可在頁面載入時自動開始導覽，無需手動觸發。',
      },
    },
    classDescriptions: {
      'cu-tour-overlay': '全螢幕背景遮罩',
      'cu-tour-spotlight': '目標元素周圍的高亮切口',
      'cu-tour-tooltip': '步驟內容的工具提示容器',
      'cu-tour-tooltip-title': '步驟標題文字',
      'cu-tour-tooltip-content': '步驟描述文字',
      'cu-tour-tooltip-footer': '含導航按鈕的底部區域',
      'cu-tour-btn': '導覽按鈕基礎樣式',
      'cu-tour-btn-primary': '主要操作按鈕（下一步 / 完成）',
      'cu-tour-btn-secondary': '次要操作按鈕（上一步 / 跳過）',
      'cu-tour-progress': '步驟進度指示器（如 1/3）',
    },
  },
};
