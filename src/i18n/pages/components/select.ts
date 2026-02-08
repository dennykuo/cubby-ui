import type { Locale } from '../../index';

export const selectPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withLabel: { title: string; description: string };
    withPlaceholder: { title: string; description: string };
    disabled: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Select — Cubby UI',
    description: 'Displays a native select dropdown for choosing from a list of options.',
    category: 'Forms',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Wrap a <code class="cu-code">&lt;select&gt;</code> with <code class="cu-code">cu-select</code> inside a <code class="cu-code">cu-select-wrapper</code> container with a chevron icon.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withLabel: {
        title: 'With Label',
        description: 'Pair with a <code class="cu-code">cu-label</code> for accessible form fields.',
      },
      withPlaceholder: {
        title: 'With Placeholder',
        description: 'Use a disabled first option as a placeholder prompt.',
      },
      disabled: {
        title: 'Disabled',
        description: 'Add the <code class="cu-code">disabled</code> attribute to prevent interaction.',
      },
    },
    classDescriptions: {
      'cu-select-wrapper': 'Positioning container for Select and arrow icon',
      'cu-select': 'Select style with hover border, focus ring, and disabled state',
      'cu-select-icon': 'Right decorative arrow icon, absolutely positioned and non-interactive',
    },
  },
  'zh-tw': {
    title: 'Select — Cubby UI',
    description: '顯示原生下拉選單，用於從選項列表中選擇。',
    category: '表單',
    sections: {
      usage: {
        title: '使用方式',
        description: '將帶有 <code class="cu-code">cu-select</code> 的 <code class="cu-code">&lt;select&gt;</code> 包裹在 <code class="cu-code">cu-select-wrapper</code> 容器中，搭配箭頭圖示。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withLabel: {
        title: '帶標籤',
        description: '搭配 <code class="cu-code">cu-label</code> 以提供無障礙表單欄位。',
      },
      withPlaceholder: {
        title: '帶佔位文字',
        description: '使用停用的第一個選項作為佔位提示。',
      },
      disabled: {
        title: '停用',
        description: '加入 <code class="cu-code">disabled</code> 屬性以防止互動。',
      },
    },
    classDescriptions: {
      'cu-select-wrapper': 'Select 與箭頭圖示的定位容器',
      'cu-select': '下拉選單樣式，含 hover 邊框、焦點環與停用狀態',
      'cu-select-icon': '右側裝飾箭頭圖示，絕對定位且不可互動',
    },
  },
};
