import type { Locale } from '../../index';

export const transferListPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withSearch: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Transfer List — Cubby UI',
    description: 'A dual-panel list for moving items between two groups via checkboxes and directional buttons.',
    category: 'Forms',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Use <code class="cu-code">data-cu-transfer-list</code> on the container, <code class="cu-code">data-cu-transfer-panel</code> on each panel, <code class="cu-code">data-cu-transfer-check</code> on item checkboxes, and <code class="cu-code">data-cu-transfer-to-right</code> / <code class="cu-code">data-cu-transfer-to-left</code> on the action buttons. The <code class="cu-code">&lt;script&gt;</code> handles checking, moving, and count updates.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withSearch: {
        title: 'With Search',
        description: 'Add a search input with <code class="cu-code">data-cu-transfer-search</code> to filter items within each panel.',
      },
    },
    classDescriptions: {
      'cu-transfer-list': 'Transfer List container with horizontal panels and action buttons',
      'cu-transfer-list-panel': 'Left/right panel with border and rounded corners',
      'cu-transfer-list-header': 'Panel header row with bottom border',
      'cu-transfer-list-header-title': 'Panel title text',
      'cu-transfer-list-header-count': 'Count text on the right of panel title',
      'cu-transfer-list-search': 'Search bar container with bottom border',
      'cu-transfer-list-search-icon': 'Search icon in the search bar',
      'cu-transfer-list-search-input': 'Search input with transparent background',
      'cu-transfer-list-content': 'Item list container, scrollable with custom scrollbar',
      'cu-transfer-list-item': 'List item with hover background',
      'cu-transfer-list-item-checked': 'Checked list item',
      'cu-transfer-list-actions': 'Center action button group container',
      'cu-transfer-list-actions-button': 'Move left/right action buttons',
    },
  },
  'zh-tw': {
    title: 'Transfer List — Cubby UI',
    description: '雙面板列表，透過核取方塊和方向按鈕在兩個群組之間移動項目。',
    category: '表單',
    sections: {
      usage: {
        title: '使用方式',
        description: '在容器上使用 <code class="cu-code">data-cu-transfer-list</code>，每個面板使用 <code class="cu-code">data-cu-transfer-panel</code>，項目核取方塊使用 <code class="cu-code">data-cu-transfer-check</code>，操作按鈕使用 <code class="cu-code">data-cu-transfer-to-right</code> / <code class="cu-code">data-cu-transfer-to-left</code>。<code class="cu-code">&lt;script&gt;</code> 處理勾選、移動與計數更新。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withSearch: {
        title: '帶搜尋',
        description: '加入帶有 <code class="cu-code">data-cu-transfer-search</code> 的搜尋輸入框，以在各面板中過濾項目。',
      },
    },
    classDescriptions: {
      'cu-transfer-list': 'Transfer List 容器，含水平面板與操作按鈕',
      'cu-transfer-list-panel': '左/右面板，含邊框與圓角',
      'cu-transfer-list-header': '面板標頭列，含底部邊框',
      'cu-transfer-list-header-title': '面板標題文字',
      'cu-transfer-list-header-count': '面板標題右側的計數文字',
      'cu-transfer-list-search': '搜尋列容器，含底部邊框',
      'cu-transfer-list-search-icon': '搜尋列中的搜尋圖示',
      'cu-transfer-list-search-input': '搜尋輸入框，透明背景',
      'cu-transfer-list-content': '項目列表容器，可捲動含自訂捲軸',
      'cu-transfer-list-item': '列表項目，含 hover 背景',
      'cu-transfer-list-item-checked': '已勾選的列表項目',
      'cu-transfer-list-actions': '中間操作按鈕群組容器',
      'cu-transfer-list-actions-button': '左移/右移操作按鈕',
    },
  },
};
