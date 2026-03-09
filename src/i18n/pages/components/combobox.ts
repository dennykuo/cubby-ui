import type { Locale } from '../../index';

export const comboboxPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withIcons: { title: string; description: string };
    withFormGroup: { title: string; description: string };
    disabled: { title: string; description: string };
    grouped: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Combobox — Cubby UI',
    description: 'A searchable dropdown for selecting a value from a list of options.',
    category: 'Forms',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Use <code class="cu-code">data-cu-combobox</code> on the wrapper, <code class="cu-code">data-cu-combobox-trigger</code> on the button, <code class="cu-code">data-cu-combobox-content</code> on the dropdown, and <code class="cu-code">data-cu-combobox-item</code> on each option. The <code class="cu-code">&lt;script&gt;</code> handles search filtering, selection, outside click, and Escape key.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withIcons: {
        title: 'With Icons',
        description: 'Add inline SVG icons before option text to provide visual context, such as status indicators or category markers.',
      },
      withFormGroup: {
        title: 'With Form Group',
        description: 'Pair the combobox with a Label and FormDescription for use in form layouts.',
      },
      disabled: {
        title: 'Disabled Items',
        description: 'Add <code class="cu-code">opacity-50 pointer-events-none</code> and <code class="cu-code">aria-disabled="true"</code> to prevent selection of specific options.',
      },
      grouped: {
        title: 'Grouped Options',
        description: 'Use label elements to group related options for better organization.',
      },
    },
    classDescriptions: {
      'cu-combobox': 'Combobox container, relatively positioned inline-block',
      'cu-combobox-trigger': 'Trigger button with border, rounded corners, and focus ring',
      'cu-combobox-trigger-placeholder': 'Placeholder text in trigger button',
      'cu-combobox-trigger-icon': 'Arrow icon on the right side of trigger',
      'cu-combobox-content': 'Floating dropdown panel with rounded corners and shadow',
      'cu-combobox-search': 'Search bar container with bottom border',
      'cu-combobox-search-icon': 'Search icon in the search bar',
      'cu-combobox-input': 'Search input with transparent background',
      'cu-combobox-list': 'Options list container, scrollable (max height 200px)',
      'cu-combobox-empty': 'Empty state text when no results found',
      'cu-combobox-item': 'Option item with hover background',
      'cu-combobox-item-active': 'Selected option item',
      'cu-combobox-item-check': 'Check icon on the right side of option',
    },
  },
  'zh-tw': {
    title: 'Combobox — Cubby UI',
    description: '可搜尋的下拉選單，用於從選項列表中選擇一個值。',
    category: '表單',
    sections: {
      usage: {
        title: '使用方式',
        description: '在外層容器使用 <code class="cu-code">data-cu-combobox</code>，按鈕使用 <code class="cu-code">data-cu-combobox-trigger</code>，下拉面板使用 <code class="cu-code">data-cu-combobox-content</code>，每個選項使用 <code class="cu-code">data-cu-combobox-item</code>。<code class="cu-code">&lt;script&gt;</code> 處理搜尋過濾、選取、外部點擊及 Escape 鍵。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withIcons: {
        title: '搭配圖示',
        description: '在選項文字前加入 SVG 圖示以提供視覺上下文，例如狀態指示器或類別標記。',
      },
      withFormGroup: {
        title: '搭配表單群組',
        description: '將 combobox 與 Label 和 FormDescription 搭配，用於表單佈局。',
      },
      disabled: {
        title: '停用選項',
        description: '加入 <code class="cu-code">opacity-50 pointer-events-none</code> 和 <code class="cu-code">aria-disabled="true"</code> 以防止選取特定選項。',
      },
      grouped: {
        title: '分組選項',
        description: '使用標籤元素將相關選項分組，提供更好的組織結構。',
      },
    },
    classDescriptions: {
      'cu-combobox': 'Combobox 容器，相對定位的行內區塊',
      'cu-combobox-trigger': '觸發按鈕，含邊框、圓角與焦點環',
      'cu-combobox-trigger-placeholder': '觸發按鈕中的佔位文字',
      'cu-combobox-trigger-icon': '觸發按鈕右側的箭頭圖示',
      'cu-combobox-content': '浮動下拉面板，含圓角與陰影',
      'cu-combobox-search': '搜尋列容器，含底部邊框',
      'cu-combobox-search-icon': '搜尋列中的搜尋圖示',
      'cu-combobox-input': '搜尋輸入框，透明背景',
      'cu-combobox-list': '選項列表容器，可捲動（最大高度 200px）',
      'cu-combobox-empty': '無結果時的空狀態文字',
      'cu-combobox-item': '選項項目，含 hover 背景',
      'cu-combobox-item-active': '已選取的選項項目',
      'cu-combobox-item-check': '選項右側的勾選圖示',
    },
  },
};
