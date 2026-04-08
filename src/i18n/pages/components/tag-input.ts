import type { Locale } from '../../index';

export const tagInputPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withTags: { title: string; description: string };
    variants: { title: string; description: string };
    maxTags: { title: string; description: string };
    validation: { title: string; description: string };
    disabled: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Tag Input — Cubby UI',
    description: 'An input field for adding and removing tags or chips. Supports keyboard interaction with Enter to add and Backspace to remove.',
    category: 'Forms',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Use <code class="cu-code">cu-tag-input</code> with <code class="cu-code">data-cu-tag-input</code> for interactive tag management. Tags are added with Enter and removed with Backspace or the remove button.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withTags: {
        title: 'With Initial Tags',
        description: 'Pre-populate tags by adding <code class="cu-code">cu-tag-input-tag</code> elements inside the container.',
      },
      variants: {
        title: 'Variants',
        description: 'Use <code class="cu-code">cu-tag-input-primary</code> for primary-colored tags or <code class="cu-code">cu-tag-input-outline</code> for bordered tags.',
      },
      maxTags: {
        title: 'Max Tags',
        description: 'Set <code class="cu-code">data-cu-tag-max</code> to limit the number of tags allowed.',
      },
      validation: {
        title: 'Validation',
        description: 'Use <code class="cu-code">cu-tag-input-error</code> or <code class="cu-code">cu-tag-input-success</code> for validation states.',
      },
      disabled: {
        title: 'Disabled',
        description: 'Add <code class="cu-code">cu-tag-input-disabled</code> to prevent interaction.',
      },
    },
    classDescriptions: {
      'cu-tag-input': 'Container with flex-wrap layout and input styling',
      'cu-tag-input-field': 'The text input inside the container',
      'cu-tag-input-tag': 'Individual tag/chip element',
      'cu-tag-input-tag-remove': 'Remove button inside a tag',
      'cu-tag-input-primary': 'Primary-colored tag variant',
      'cu-tag-input-outline': 'Bordered/outlined tag variant',
      'cu-tag-input-error': 'Error validation state',
      'cu-tag-input-success': 'Success validation state',
      'cu-tag-input-disabled': 'Disabled state',
    },
  },
  'zh-tw': {
    title: 'Tag Input 標籤輸入 — Cubby UI',
    description: '用於新增和移除標籤的輸入框。支援鍵盤操作：Enter 新增、Backspace 移除。',
    category: 'Forms',
    sections: {
      usage: {
        title: '使用方式',
        description: '使用 <code class="cu-code">cu-tag-input</code> 搭配 <code class="cu-code">data-cu-tag-input</code> 進行互動式標籤管理。按 Enter 新增標籤，按 Backspace 或點擊移除按鈕刪除。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withTags: {
        title: '初始標籤',
        description: '在容器內放置 <code class="cu-code">cu-tag-input-tag</code> 元素即可預設標籤。',
      },
      variants: {
        title: '變體',
        description: '使用 <code class="cu-code">cu-tag-input-primary</code> 設定主色調標籤，或使用 <code class="cu-code">cu-tag-input-outline</code> 設定有邊框的標籤。',
      },
      maxTags: {
        title: '最大標籤數',
        description: '設定 <code class="cu-code">data-cu-tag-max</code> 限制可新增的標籤數量。',
      },
      validation: {
        title: '驗證',
        description: '使用 <code class="cu-code">cu-tag-input-error</code> 或 <code class="cu-code">cu-tag-input-success</code> 設定驗證狀態。',
      },
      disabled: {
        title: '停用',
        description: '加上 <code class="cu-code">cu-tag-input-disabled</code> 以防止互動。',
      },
    },
    classDescriptions: {
      'cu-tag-input': '帶有 flex-wrap 佈局和輸入框樣式的容器',
      'cu-tag-input-field': '容器內的文字輸入框',
      'cu-tag-input-tag': '單個標籤/晶片元素',
      'cu-tag-input-tag-remove': '標籤內的移除按鈕',
      'cu-tag-input-primary': '主色調標籤變體',
      'cu-tag-input-outline': '有邊框的標籤變體',
      'cu-tag-input-error': '錯誤驗證狀態',
      'cu-tag-input-success': '成功驗證狀態',
      'cu-tag-input-disabled': '停用狀態',
    },
  },
};
