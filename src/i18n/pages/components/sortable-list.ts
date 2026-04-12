import type { Locale } from '../../index';

export const sortableListPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    bordered: { title: string; description: string };
    compact: { title: string; description: string };
    card: { title: string; description: string };
    ghost: { title: string; description: string };
    striped: { title: string; description: string };
    numbered: { title: string; description: string };
    customHandle: { title: string; description: string };
    withContent: { title: string; description: string };
    disabled: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Sortable List — Cubby UI',
    description: 'A drag-and-drop reorderable list with handles. Uses the native HTML Drag and Drop API.',
    category: 'Data Display',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Use <code class="cu-code">cu-sortable-list</code> with <code class="cu-code">cu-sortable-item</code> elements and <code class="cu-code">data-cu-sortable-list</code> for interactive drag-and-drop reordering.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      bordered: {
        title: 'Bordered',
        description: 'Use <code class="cu-code">cu-sortable-list-bordered</code> for a flat, separated-line style.',
      },
      compact: {
        title: 'Compact',
        description: 'Use <code class="cu-code">cu-sortable-list-compact</code> for a denser layout.',
      },
      card: {
        title: 'Card',
        description: 'Use <code class="cu-code">cu-sortable-list-card</code> for elevated, card-like items with stronger shadows.',
      },
      ghost: {
        title: 'Ghost',
        description: 'Use <code class="cu-code">cu-sortable-list-ghost</code> for a borderless, minimal style that only highlights on hover.',
      },
      striped: {
        title: 'Striped',
        description: 'Use <code class="cu-code">cu-sortable-list-striped</code> for alternating row backgrounds.',
      },
      numbered: {
        title: 'Numbered',
        description: 'Use <code class="cu-code">cu-sortable-list-numbered</code> to add automatic counter badges to each item.',
      },
      customHandle: {
        title: 'Drag Icon',
        description: 'The <code class="cu-code">cu-sortable-handle</code> accepts any content — use a custom icon, text, or omit it entirely for a handleless style.',
      },
      withContent: {
        title: 'Rich Content',
        description: 'Items can contain any content inside <code class="cu-code">cu-sortable-content</code>, including titles, descriptions, and badges.',
      },
      disabled: {
        title: 'Disabled Items',
        description: 'Add <code class="cu-code">cu-sortable-item-disabled</code> to prevent dragging specific items.',
      },
    },
    classDescriptions: {
      'cu-sortable-list': 'Container for sortable items',
      'cu-sortable-item': 'Individual draggable item',
      'cu-sortable-handle': 'Drag handle — accepts any content (icon, text) or can be omitted',
      'cu-sortable-content': 'Item content area',
      'cu-sortable-item-dragging': 'Active dragging state with shadow and ring',
      'cu-sortable-placeholder': 'Drop target placeholder with dashed border',
      'cu-sortable-list-bordered': 'Flat bordered variant',
      'cu-sortable-list-compact': 'Compact variant with less padding',
      'cu-sortable-list-card': 'Elevated card variant with stronger shadows',
      'cu-sortable-list-ghost': 'Borderless minimal variant',
      'cu-sortable-list-striped': 'Alternating row background variant',
      'cu-sortable-list-numbered': 'Auto-numbered variant with counter badges',
      'cu-sortable-item-disabled': 'Disabled item (not draggable)',
    },
  },
  'zh-tw': {
    title: 'Sortable List 可排序列表 — Cubby UI',
    description: '可拖曳排序的列表，附帶拖曳把手。使用原生 HTML Drag and Drop API。',
    category: 'Data Display',
    sections: {
      usage: {
        title: '使用方式',
        description: '使用 <code class="cu-code">cu-sortable-list</code> 搭配 <code class="cu-code">cu-sortable-item</code> 元素，加上 <code class="cu-code">data-cu-sortable-list</code> 即可啟用互動式拖曳排序。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      bordered: {
        title: '分隔線',
        description: '使用 <code class="cu-code">cu-sortable-list-bordered</code> 呈現扁平的分隔線樣式。',
      },
      compact: {
        title: '緊湊',
        description: '使用 <code class="cu-code">cu-sortable-list-compact</code> 縮減間距。',
      },
      card: {
        title: '卡片',
        description: '使用 <code class="cu-code">cu-sortable-list-card</code> 呈現立體卡片風格，帶有較明顯的陰影。',
      },
      ghost: {
        title: '幽靈',
        description: '使用 <code class="cu-code">cu-sortable-list-ghost</code> 呈現無邊框極簡風格，僅在懸停時顯示背景。',
      },
      striped: {
        title: '斑馬紋',
        description: '使用 <code class="cu-code">cu-sortable-list-striped</code> 呈現交替列背景色。',
      },
      numbered: {
        title: '自動編號',
        description: '使用 <code class="cu-code">cu-sortable-list-numbered</code> 為每個項目自動加上編號徽章。',
      },
      customHandle: {
        title: '拖曳圖示',
        description: '<code class="cu-code">cu-sortable-handle</code> 可放入任意內容——使用自訂圖示、文字，或完全省略以呈現無圖示樣式。',
      },
      withContent: {
        title: '豐富內容',
        description: '項目可在 <code class="cu-code">cu-sortable-content</code> 內放置任何內容，包括標題、描述和徽章。',
      },
      disabled: {
        title: '停用項目',
        description: '加上 <code class="cu-code">cu-sortable-item-disabled</code> 以防止拖曳特定項目。',
      },
    },
    classDescriptions: {
      'cu-sortable-list': '可排序項目的容器',
      'cu-sortable-item': '單個可拖曳項目',
      'cu-sortable-handle': '拖曳把手——可放入任意內容（圖示、文字）或省略',
      'cu-sortable-content': '項目內容區域',
      'cu-sortable-item-dragging': '拖曳中狀態，帶有陰影和外環',
      'cu-sortable-placeholder': '放置目標佔位符，帶有虛線邊框',
      'cu-sortable-list-bordered': '扁平有邊框的變體',
      'cu-sortable-list-compact': '緊湊變體，較少內距',
      'cu-sortable-list-card': '立體卡片變體，帶有較強陰影',
      'cu-sortable-list-ghost': '無邊框極簡變體',
      'cu-sortable-list-striped': '交替列背景色變體',
      'cu-sortable-list-numbered': '自動編號變體，帶有計數徽章',
      'cu-sortable-item-disabled': '停用項目（不可拖曳）',
    },
  },
};
