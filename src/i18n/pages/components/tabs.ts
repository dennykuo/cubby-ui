import type { Locale } from '../../index';

export const tabsPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withContent: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Tabs — Cubby UI',
    description: 'A set of layered sections of content — known as tab panels — that are displayed one at a time.',
    category: 'Navigation',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Use <code class="cu-code">data-cu-tabs</code> on the container, <code class="cu-code">data-cu-tabs-trigger</code> on each button with a value, and <code class="cu-code">data-cu-tabs-content</code> on each panel with a matching value. Include the <code class="cu-code">&lt;script&gt;</code> snippet for interactivity.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withContent: {
        title: 'With Content',
        description: 'Tabs work well with cards or any other content blocks.',
      },
    },
    classDescriptions: {
      'cu-tabs': 'Tabs container',
      'cu-tabs-list': 'Tab list with background and rounded corners',
      'cu-tabs-trigger': 'Tab trigger button',
      'cu-tabs-trigger-active': 'Active tab with white background and shadow',
      'cu-tabs-content': 'Tab content panel',
    },
  },
  'zh-tw': {
    title: 'Tabs — Cubby UI',
    description: '一組分層的內容區塊 — 稱為分頁面板 — 一次顯示一個。',
    category: '導航',
    sections: {
      usage: {
        title: '使用方式',
        description: '在容器上使用 <code class="cu-code">data-cu-tabs</code>，在每個按鈕上使用 <code class="cu-code">data-cu-tabs-trigger</code> 並指定值，在每個面板上使用 <code class="cu-code">data-cu-tabs-content</code> 並匹配對應的值。加入 <code class="cu-code">&lt;script&gt;</code> 程式碼片段以啟用互動功能。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withContent: {
        title: '帶內容',
        description: '分頁可搭配卡片或任何其他內容區塊使用。',
      },
    },
    classDescriptions: {
      'cu-tabs': '分頁容器',
      'cu-tabs-list': '分頁列表，帶背景與圓角',
      'cu-tabs-trigger': '分頁觸發按鈕',
      'cu-tabs-trigger-active': '啟用的分頁，帶白色背景與陰影',
      'cu-tabs-content': '分頁內容面板',
    },
  },
};
