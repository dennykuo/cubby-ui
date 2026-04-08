import type { Locale } from '../../index';

export const kanbanPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withTags: { title: string; description: string };
    compact: { title: string; description: string };
    addCard: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Kanban — Cubby UI',
    description: 'A draggable kanban board for organizing tasks into columns. Supports cards with tags, compact mode, and add-card actions.',
    category: 'Data Display',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Build a kanban board with <code class="cu-code">data-cu-kanban</code> container, <code class="cu-code">data-cu-kanban-column</code> columns, and <code class="cu-code">data-cu-kanban-card</code> draggable cards.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withTags: {
        title: 'With Tags',
        description: 'Add a <code class="cu-code">cu-kanban-card-footer</code> with <code class="cu-code">cu-kanban-card-tag</code> elements to categorize cards with color-coded labels.',
      },
      compact: {
        title: 'Compact',
        description: 'Use <code class="cu-code">cu-kanban-compact</code> on the container for a denser layout with reduced spacing, suitable for dashboards.',
      },
      addCard: {
        title: 'Add Card',
        description: 'Place a <code class="cu-code">cu-kanban-add</code> button at the bottom of a column to allow users to create new cards.',
      },
    },
    classDescriptions: {
      'cu-kanban': 'Board container with horizontal scroll',
      'cu-kanban-column': 'Individual column',
      'cu-kanban-column-header': 'Column header with title and count',
      'cu-kanban-column-title': 'Column title text',
      'cu-kanban-column-count': 'Card count badge in column header',
      'cu-kanban-column-body': 'Scrollable card area within a column',
      'cu-kanban-card': 'Draggable task card',
      'cu-kanban-card-title': 'Card title text',
      'cu-kanban-card-description': 'Card description text',
      'cu-kanban-card-footer': 'Card footer for tags and metadata',
      'cu-kanban-card-tag': 'Tag label inside card footer',
      'cu-kanban-card-tag-primary': 'Primary color tag',
      'cu-kanban-card-tag-success': 'Success color tag',
      'cu-kanban-card-tag-warning': 'Warning color tag',
      'cu-kanban-card-tag-destructive': 'Destructive color tag',
      'cu-kanban-card-tag-info': 'Info color tag',
      'cu-kanban-compact': 'Compact layout modifier',
      'cu-kanban-add': 'Add card button at column bottom',
    },
  },
  'zh-tw': {
    title: 'Kanban — Cubby UI',
    description: '可拖曳的看板，用於將任務組織到欄位中。支援帶標籤的卡片、緊湊模式及新增卡片操作。',
    category: '資料展示',
    sections: {
      usage: {
        title: '使用方式',
        description: '使用 <code class="cu-code">data-cu-kanban</code> 容器、<code class="cu-code">data-cu-kanban-column</code> 欄位和 <code class="cu-code">data-cu-kanban-card</code> 可拖曳卡片建立看板。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withTags: {
        title: '搭配標籤',
        description: '在 <code class="cu-code">cu-kanban-card-footer</code> 中加入 <code class="cu-code">cu-kanban-card-tag</code> 元素，用色彩標籤為卡片分類。',
      },
      compact: {
        title: '緊湊模式',
        description: '在容器上使用 <code class="cu-code">cu-kanban-compact</code> 以減少間距，適合儀表板等需要密集佈局的場景。',
      },
      addCard: {
        title: '新增卡片',
        description: '在欄位底部放置 <code class="cu-code">cu-kanban-add</code> 按鈕，讓使用者可以建立新卡片。',
      },
    },
    classDescriptions: {
      'cu-kanban': '看板容器，支援水平捲動',
      'cu-kanban-column': '個別欄位',
      'cu-kanban-column-header': '欄位標頭，含標題與計數',
      'cu-kanban-column-title': '欄位標題文字',
      'cu-kanban-column-count': '欄位標頭中的卡片數量徽章',
      'cu-kanban-column-body': '欄位內的可捲動卡片區域',
      'cu-kanban-card': '可拖曳的任務卡片',
      'cu-kanban-card-title': '卡片標題文字',
      'cu-kanban-card-description': '卡片描述文字',
      'cu-kanban-card-footer': '卡片底部，放標籤和中繼資料',
      'cu-kanban-card-tag': '卡片底部的標籤',
      'cu-kanban-card-tag-primary': '主色標籤',
      'cu-kanban-card-tag-success': '成功色標籤',
      'cu-kanban-card-tag-warning': '警告色標籤',
      'cu-kanban-card-tag-destructive': '錯誤色標籤',
      'cu-kanban-card-tag-info': '資訊色標籤',
      'cu-kanban-compact': '緊湊佈局修飾類別',
      'cu-kanban-add': '欄位底部的新增卡片按鈕',
    },
  },
};
