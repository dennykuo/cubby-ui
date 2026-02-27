import type { Locale } from '../../index';

export const searchInputPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    clearable: { title: string; description: string };
    withPlaceholder: { title: string; description: string };
    disabled: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Search Input — Cubby UI',
    description: 'Displays a search input with an embedded search icon.',
    category: 'Forms',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Wrap an input and search icon inside a <code class="cu-code">cu-input-search</code> container. The icon uses <code class="cu-code">cu-input-search-icon</code> and the input uses <code class="cu-code">cu-input-search-field</code>.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      clearable: {
        title: 'Clearable',
        description: 'Add a <code class="cu-code">cu-input-search-clear</code> button after the input. It appears only when the field has a value, using <code class="cu-code">:not(:placeholder-shown)</code>.',
      },
      withPlaceholder: {
        title: 'With Placeholder',
        description: 'Customize the placeholder text to hint at what can be searched.',
      },
      disabled: {
        title: 'Disabled',
        description: 'Add the <code class="cu-code">disabled</code> attribute to the input element.',
      },
    },
    classDescriptions: {
      'cu-input-search': 'Search input container, relatively positioned flex container',
      'cu-input-search-icon': 'Left search icon, absolutely positioned and non-interactive',
      'cu-input-search-field': 'Search input with left padding for icon',
      'cu-input-search-clear': 'Clear button, appears when input has a value',
    },
  },
  'zh-tw': {
    title: 'Search Input — Cubby UI',
    description: '顯示搜尋輸入框，內嵌搜尋圖示。',
    category: '表單',
    sections: {
      usage: {
        title: '使用方式',
        description: '將輸入框和搜尋圖示包裹在 <code class="cu-code">cu-input-search</code> 容器中。圖示使用 <code class="cu-code">cu-input-search-icon</code>，輸入框使用 <code class="cu-code">cu-input-search-field</code>。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      clearable: {
        title: '可清除',
        description: '在輸入框後方加上 <code class="cu-code">cu-input-search-clear</code> 按鈕。僅在欄位有值時顯示，使用 <code class="cu-code">:not(:placeholder-shown)</code> 控制。',
      },
      withPlaceholder: {
        title: '帶佔位文字',
        description: '自訂佔位文字以提示可搜尋的內容。',
      },
      disabled: {
        title: '停用',
        description: '在 input 元素上加入 <code class="cu-code">disabled</code> 屬性。',
      },
    },
    classDescriptions: {
      'cu-input-search': '搜尋輸入容器，相對定位的 Flex 容器',
      'cu-input-search-icon': '左側搜尋圖示，絕對定位且不可互動',
      'cu-input-search-field': '搜尋輸入框，含左側圖示的 padding',
      'cu-input-search-clear': '清除按鈕，輸入框有值時顯示',
    },
  },
};
