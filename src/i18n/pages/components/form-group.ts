import type { Locale } from '../../index';

export const formGroupPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withDescription: { title: string; description: string };
    withError: { title: string; description: string };
    completeForm: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Form Group — Cubby UI',
    description: 'Composes a label, form control, description, and error message with consistent spacing.',
    category: 'Forms',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Use <code class="cu-code">cu-form-group</code> as a wrapper to apply consistent spacing between a label and its control.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withDescription: {
        title: 'With Description',
        description: 'Add <code class="cu-code">cu-form-description</code> for helper text below the control.',
      },
      withError: {
        title: 'With Error',
        description: 'Add <code class="cu-code">cu-form-error</code> and a <code class="cu-code">border-destructive</code> class on the input for error states.',
      },
      completeForm: {
        title: 'Complete Form',
        description: 'A full form example combining Input, Select, Textarea, Checkbox, and Toggle inside a Card.',
      },
    },
    classDescriptions: {
      'cu-form-group': 'Form group container with vertical layout and spacing',
      'cu-form-description': 'Form description text, small and muted',
      'cu-form-error': 'Form error message, small and red',
    },
  },
  'zh-tw': {
    title: 'Form Group — Cubby UI',
    description: '組合標籤、表單控制項、說明與錯誤訊息，提供一致的間距。',
    category: '表單',
    sections: {
      usage: {
        title: '使用方式',
        description: '使用 <code class="cu-code">cu-form-group</code> 作為包裝器，在標籤與控制項之間套用一致的間距。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withDescription: {
        title: '帶說明',
        description: '加入 <code class="cu-code">cu-form-description</code> 在控制項下方顯示輔助文字。',
      },
      withError: {
        title: '帶錯誤',
        description: '加入 <code class="cu-code">cu-form-error</code> 並在 input 上加入 <code class="cu-code">border-destructive</code> 類別以呈現錯誤狀態。',
      },
      completeForm: {
        title: '完整表單',
        description: '在 Card 中組合 Input、Select、Textarea、Checkbox 和 Toggle 的完整表單範例。',
      },
    },
    classDescriptions: {
      'cu-form-group': '表單群組容器，含垂直排列與間距',
      'cu-form-description': '表單說明文字，小字且淡色',
      'cu-form-error': '表單錯誤訊息，小字且紅色',
    },
  },
};
