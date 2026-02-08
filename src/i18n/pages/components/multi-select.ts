import type { Locale } from '../../index';

export const multiSelectPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withSearch: { title: string; description: string };
    presetValues: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Multi Select — Cubby UI',
    description: 'A multi-selection dropdown with tag display, supporting search filtering and removal.',
    category: 'Forms',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Use <code class="cu-code">data-cu-multi-select</code> on the wrapper, <code class="cu-code">data-cu-multi-select-trigger</code> on the button, <code class="cu-code">data-cu-multi-select-content</code> on the dropdown, and <code class="cu-code">data-cu-multi-select-item</code> on each option. Selected items appear as removable tags in the trigger area.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withSearch: {
        title: 'With Search',
        description: 'Add a search input with <code class="cu-code">cu-multi-select-search</code> to filter options.',
      },
      presetValues: {
        title: 'Preset Values',
        description: 'Pre-select items by adding <code class="cu-code">cu-multi-select-item-active</code> to items and rendering tags in the trigger area on initial load.',
      },
    },
    classDescriptions: {
      'cu-multi-select': 'Multi Select container, relatively positioned inline-block',
      'cu-multi-select-trigger': 'Trigger button with multi-line tag display',
      'cu-multi-select-tags': 'Flex wrap container for selected tags',
      'cu-multi-select-tag': 'Selected item tag style',
      'cu-multi-select-tag-remove': 'Remove button on tag',
      'cu-multi-select-placeholder': 'Placeholder text when nothing selected',
      'cu-multi-select-icon': 'Arrow icon on the right side of trigger',
      'cu-multi-select-content': 'Floating dropdown panel with rounded corners and shadow',
      'cu-multi-select-search': 'Search bar container with bottom border',
      'cu-multi-select-search-icon': 'Search icon in the search bar',
      'cu-multi-select-input': 'Search input with transparent background',
      'cu-multi-select-list': 'Options list container, scrollable (max height 200px)',
      'cu-multi-select-empty': 'Empty state text when no results found',
      'cu-multi-select-item': 'Option item with hover background and left check space',
      'cu-multi-select-item-active': 'Selected option item',
      'cu-multi-select-item-check': 'Check icon on the left side of option',
    },
  },
  'zh-tw': {
    title: 'Multi Select — Cubby UI',
    description: '多選下拉選單，以標籤顯示已選項目，支援搜尋過濾與移除。',
    category: '表單',
    sections: {
      usage: {
        title: '使用方式',
        description: '在外層容器使用 <code class="cu-code">data-cu-multi-select</code>，按鈕使用 <code class="cu-code">data-cu-multi-select-trigger</code>，下拉面板使用 <code class="cu-code">data-cu-multi-select-content</code>，每個選項使用 <code class="cu-code">data-cu-multi-select-item</code>。已選項目會以可移除的標籤顯示在觸發區域。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withSearch: {
        title: '帶搜尋',
        description: '加入 <code class="cu-code">cu-multi-select-search</code> 搜尋輸入框以過濾選項。',
      },
      presetValues: {
        title: '預設值',
        description: '在項目上加入 <code class="cu-code">cu-multi-select-item-active</code> 並在初始載入時於觸發區域渲染標籤，以預選項目。',
      },
    },
    classDescriptions: {
      'cu-multi-select': 'Multi Select 容器，相對定位的行內區塊',
      'cu-multi-select-trigger': '觸發按鈕，含多行標籤顯示',
      'cu-multi-select-tags': '已選標籤的 Flex wrap 容器',
      'cu-multi-select-tag': '已選項目的標籤樣式',
      'cu-multi-select-tag-remove': '標籤上的移除按鈕',
      'cu-multi-select-placeholder': '未選取任何項目時的佔位文字',
      'cu-multi-select-icon': '觸發按鈕右側的箭頭圖示',
      'cu-multi-select-content': '浮動下拉面板，含圓角與陰影',
      'cu-multi-select-search': '搜尋列容器，含底部邊框',
      'cu-multi-select-search-icon': '搜尋列中的搜尋圖示',
      'cu-multi-select-input': '搜尋輸入框，透明背景',
      'cu-multi-select-list': '選項列表容器，可捲動（最大高度 200px）',
      'cu-multi-select-empty': '無結果時的空狀態文字',
      'cu-multi-select-item': '選項項目，含 hover 背景與左側勾選空間',
      'cu-multi-select-item-active': '已選取的選項項目',
      'cu-multi-select-item-check': '選項左側的勾選圖示',
    },
  },
};
