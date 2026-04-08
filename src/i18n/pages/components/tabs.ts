import type { Locale } from '../../index';

export const tabsPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withContent: { title: string; description: string };
    underline: { title: string; description: string };
    vertical: { title: string; description: string };
    withIcons: { title: string; description: string };
    disabledTab: { title: string; description: string };
    pills: { title: string; description: string };
    withBadge: { title: string; description: string };
    closable: { title: string; description: string };
    scrollable: { title: string; description: string };
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
      underline: {
        title: 'Underline',
        description: 'Replace <code class="cu-code">cu-tabs-list</code> with <code class="cu-code">cu-tabs-list-underline</code> for a bottom-border style instead of the pill background.',
      },
      vertical: {
        title: 'Vertical',
        description: 'Add <code class="cu-code">cu-tabs-vertical</code> to the container and <code class="cu-code">cu-tabs-list-vertical</code> to the tab list for a side-by-side vertical layout.',
      },
      withIcons: {
        title: 'With Icons',
        description: 'Add inline SVG icons alongside tab labels for improved visual identification.',
      },
      disabledTab: {
        title: 'Disabled Tab',
        description: 'Disable a tab by adding the <code class="cu-code">disabled</code> attribute and <code class="cu-code">opacity-50 pointer-events-none</code> styles.',
      },
      pills: {
        title: 'Pills',
        description: 'Use <code class="cu-code">cu-tabs-list-pills</code> for a pill-shaped tab style with transparent background and filled active state.',
      },
      withBadge: {
        title: 'With Badge',
        description: 'Add <code class="cu-code">cu-tabs-trigger-badge</code> inside a tab trigger to show a count or indicator. The badge color changes when the tab is active.',
      },
      closable: {
        title: 'Closable',
        description: 'Add a close button with <code class="cu-code">data-cu-tabs-close</code> inside a tab trigger. Clicking it removes the tab and its content panel.',
      },
      scrollable: {
        title: 'Scrollable',
        description: 'Wrap the tab list in <code class="cu-code">data-cu-tabs-scrollable</code> with scroll buttons to handle overflow when there are many tabs.',
      },
    },
    classDescriptions: {
      'cu-tabs': 'Tabs container',
      'cu-tabs-list': 'Tab list with background and rounded corners',
      'cu-tabs-trigger': 'Tab trigger button',
      'cu-tabs-trigger-active': 'Active tab with white background and shadow',
      'cu-tabs-content': 'Tab content panel',
      'cu-tabs-list-underline': 'Underline variant — bottom border instead of pill background',
      'cu-tabs-vertical': 'Vertical layout container (side-by-side)',
      'cu-tabs-list-vertical': 'Vertical tab list (stacked buttons)',
      'cu-tabs-list-pills': 'Pills variant — transparent bg, pill-shaped triggers',
      'cu-tabs-trigger-badge': 'Count badge inside tab trigger',
      'cu-tabs-trigger-close': 'Close button inside tab trigger',
      'cu-tabs-list-scrollable': 'Scrollable wrapper for tab list',
      'cu-tabs-scroll-btn': 'Scroll navigation button',
      'cu-tabs-scroll-btn-end': 'Right/end scroll button',
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
      underline: {
        title: '底線樣式',
        description: '將 <code class="cu-code">cu-tabs-list</code> 替換為 <code class="cu-code">cu-tabs-list-underline</code>，以底線邊框取代膠囊背景。',
      },
      vertical: {
        title: '垂直排列',
        description: '在容器上加入 <code class="cu-code">cu-tabs-vertical</code>，在分頁列表上加入 <code class="cu-code">cu-tabs-list-vertical</code>，建立左右並排的垂直佈局。',
      },
      withIcons: {
        title: '搭配圖示',
        description: '在分頁標籤旁加入 SVG 圖示，增強視覺辨識度。',
      },
      disabledTab: {
        title: '停用分頁',
        description: '在分頁上加入 <code class="cu-code">disabled</code> 屬性及 <code class="cu-code">opacity-50 pointer-events-none</code> 樣式即可停用。',
      },
      pills: {
        title: '膠囊樣式',
        description: '使用 <code class="cu-code">cu-tabs-list-pills</code> 呈現膠囊形分頁樣式，透明背景搭配填滿的啟用狀態。',
      },
      withBadge: {
        title: '帶徽章',
        description: '在 tab trigger 中加入 <code class="cu-code">cu-tabs-trigger-badge</code> 顯示計數或指示器。徽章顏色會在 tab 啟用時改變。',
      },
      closable: {
        title: '可關閉',
        description: '在 tab trigger 中加入帶有 <code class="cu-code">data-cu-tabs-close</code> 的關閉按鈕。點擊後會移除該 tab 及其內容面板。',
      },
      scrollable: {
        title: '可捲動',
        description: '將 tab list 包裝在 <code class="cu-code">data-cu-tabs-scrollable</code> 中並搭配捲動按鈕，處理多個 tab 時的溢出。',
      },
    },
    classDescriptions: {
      'cu-tabs': '分頁容器',
      'cu-tabs-list': '分頁列表，帶背景與圓角',
      'cu-tabs-trigger': '分頁觸發按鈕',
      'cu-tabs-trigger-active': '啟用的分頁，帶白色背景與陰影',
      'cu-tabs-content': '分頁內容面板',
      'cu-tabs-list-underline': '底線變體 — 以底部邊框取代膠囊背景',
      'cu-tabs-vertical': '垂直佈局容器（左右並排）',
      'cu-tabs-list-vertical': '垂直分頁列表（堆疊按鈕）',
      'cu-tabs-list-pills': '膠囊變體 — 透明背景、膠囊形觸發器',
      'cu-tabs-trigger-badge': 'Tab trigger 中的計數徽章',
      'cu-tabs-trigger-close': 'Tab trigger 中的關閉按鈕',
      'cu-tabs-list-scrollable': 'Tab list 的可捲動包裝器',
      'cu-tabs-scroll-btn': '捲動導航按鈕',
      'cu-tabs-scroll-btn-end': '右側/末端捲動按鈕',
    },
  },
};
