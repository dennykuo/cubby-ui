import type { Locale } from '../../index';

export const floatingLabelPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withValue: { title: string; description: string };
    textarea: { title: string; description: string };
    validation: { title: string; description: string };
    disabled: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Floating Label — Cubby UI',
    description: 'An input field with a label that floats above the input when focused or filled, providing a compact and elegant form layout.',
    category: 'Forms',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Use <code class="cu-code">cu-floating-label</code> as a wrapper with <code class="cu-code">cu-floating-label-input</code> on the input and <code class="cu-code">cu-floating-label-text</code> on the label. The input must have <code class="cu-code">placeholder=" "</code> (a space) for the CSS to work.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withValue: {
        title: 'With Value',
        description: 'When the input has a value, the label automatically floats above it.',
      },
      textarea: {
        title: 'Textarea',
        description: 'The floating label pattern also works with <code class="cu-code">&lt;textarea&gt;</code> elements.',
      },
      validation: {
        title: 'Validation',
        description: 'Combine with <code class="cu-code">cu-floating-label-error</code> or <code class="cu-code">cu-floating-label-success</code> to indicate validation states.',
      },
      disabled: {
        title: 'Disabled',
        description: 'Add <code class="cu-code">disabled</code> to the input to show a disabled state.',
      },
    },
    classDescriptions: {
      'cu-floating-label': 'Container wrapper for the floating label pattern',
      'cu-floating-label-input': 'Applied to the input or textarea element',
      'cu-floating-label-text': 'Applied to the label element',
      'cu-floating-label-error': 'Error validation state (red border and label)',
      'cu-floating-label-success': 'Success validation state (green border and label)',
    },
  },
  'zh-tw': {
    title: 'Floating Label 浮動標籤 — Cubby UI',
    description: '輸入框搭配浮動標籤，在聚焦或填入內容時標籤會浮到上方，提供簡潔優雅的表單排版。',
    category: 'Forms',
    sections: {
      usage: {
        title: '使用方式',
        description: '使用 <code class="cu-code">cu-floating-label</code> 作為包裝器，在 input 上加 <code class="cu-code">cu-floating-label-input</code>，在 label 上加 <code class="cu-code">cu-floating-label-text</code>。input 必須設定 <code class="cu-code">placeholder=" "</code>（一個空格）才能讓 CSS 正常運作。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withValue: {
        title: '帶有值',
        description: '當輸入框有值時，標籤會自動浮到上方。',
      },
      textarea: {
        title: '多行輸入',
        description: '浮動標籤模式也適用於 <code class="cu-code">&lt;textarea&gt;</code> 元素。',
      },
      validation: {
        title: '驗證狀態',
        description: '搭配 <code class="cu-code">cu-floating-label-error</code> 或 <code class="cu-code">cu-floating-label-success</code> 來顯示驗證狀態。',
      },
      disabled: {
        title: '停用',
        description: '在 input 上加上 <code class="cu-code">disabled</code> 以顯示停用狀態。',
      },
    },
    classDescriptions: {
      'cu-floating-label': '浮動標籤模式的容器包裝器',
      'cu-floating-label-input': '套用在 input 或 textarea 元素上',
      'cu-floating-label-text': '套用在 label 元素上',
      'cu-floating-label-error': '錯誤驗證狀態（紅色邊框和標籤）',
      'cu-floating-label-success': '成功驗證狀態（綠色邊框和標籤）',
    },
  },
};
