import type { Locale } from '../../index';

export const textareaPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withLabel: { title: string; description: string };
    validation: { title: string; description: string };
    autoResize: { title: string; description: string };
    withDefaultValue: { title: string; description: string };
    disabled: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Textarea — Cubby UI',
    description: 'Displays a multi-line text input for longer form content.',
    category: 'Forms',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Apply <code class="cu-code">cu-textarea</code> to a <code class="cu-code">&lt;textarea&gt;</code> element.',
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
      validation: {
        title: 'Validation',
        description: 'Add <code class="cu-code">cu-textarea-error</code> or <code class="cu-code">cu-textarea-success</code> to visually indicate validation state.',
      },
      autoResize: {
        title: 'Auto Resize',
        description: 'Add <code class="cu-code">cu-textarea-auto</code> to make the textarea automatically grow with its content. Uses <code class="cu-code">field-sizing: content</code> (Chrome 123+, Edge 123+, Firefox 135+).',
      },
      withDefaultValue: {
        title: 'With Default Value',
        description: 'Place default text inside the <code class="cu-code">&lt;textarea&gt;</code> element.',
      },
      disabled: {
        title: 'Disabled',
        description: 'Add the <code class="cu-code">disabled</code> attribute to prevent editing.',
      },
    },
    classDescriptions: {
      'cu-textarea': 'Multi-line text input with vertical resize, hover border, focus ring, and disabled state',
      'cu-textarea-error': 'Error state with destructive border and focus ring',
      'cu-textarea-success': 'Success state with success border and focus ring',
      'cu-textarea-auto': 'Auto-resize to fit content (progressive enhancement)',
    },
  },
  'zh-tw': {
    title: 'Textarea — Cubby UI',
    description: '顯示多行文字輸入框，用於較長的表單內容。',
    category: '表單',
    sections: {
      usage: {
        title: '使用方式',
        description: '將 <code class="cu-code">cu-textarea</code> 套用至 <code class="cu-code">&lt;textarea&gt;</code> 元素。',
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
      validation: {
        title: '驗證狀態',
        description: '加入 <code class="cu-code">cu-textarea-error</code> 或 <code class="cu-code">cu-textarea-success</code> 以視覺呈現驗證狀態。',
      },
      autoResize: {
        title: '自動調整高度',
        description: '加入 <code class="cu-code">cu-textarea-auto</code> 讓文字區域隨內容自動增長。使用 <code class="cu-code">field-sizing: content</code>（Chrome 123+、Edge 123+、Firefox 135+）。',
      },
      withDefaultValue: {
        title: '帶預設值',
        description: '在 <code class="cu-code">&lt;textarea&gt;</code> 元素中放入預設文字。',
      },
      disabled: {
        title: '停用',
        description: '加入 <code class="cu-code">disabled</code> 屬性以防止編輯。',
      },
    },
    classDescriptions: {
      'cu-textarea': '多行文字輸入框，含垂直調整大小、hover 邊框、焦點環與停用狀態',
      'cu-textarea-error': '錯誤狀態，帶 destructive 邊框和焦點環',
      'cu-textarea-success': '成功狀態，帶 success 邊框和焦點環',
      'cu-textarea-auto': '隨內容自動調整高度（漸進增強）',
    },
  },
};
