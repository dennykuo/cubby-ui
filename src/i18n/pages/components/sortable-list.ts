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
      'cu-sortable-handle': 'Drag handle with grip cursor',
      'cu-sortable-content': 'Item content area',
      'cu-sortable-item-dragging': 'Active dragging state with shadow and ring',
      'cu-sortable-placeholder': 'Drop target placeholder with dashed border',
      'cu-sortable-list-bordered': 'Flat bordered variant',
      'cu-sortable-list-compact': 'Compact variant with less padding',
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
      'cu-sortable-handle': '帶有抓取游標的拖曳把手',
      'cu-sortable-content': '項目內容區域',
      'cu-sortable-item-dragging': '拖曳中狀態，帶有陰影和外環',
      'cu-sortable-placeholder': '放置目標佔位符，帶有虛線邊框',
      'cu-sortable-list-bordered': '扁平有邊框的變體',
      'cu-sortable-list-compact': '緊湊變體，較少內距',
      'cu-sortable-item-disabled': '停用項目（不可拖曳）',
    },
  },
};
