import type { Locale } from '../../index';

export const inputPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withLabel: { title: string; description: string };
    inputTypes: { title: string; description: string };
    disabled: { title: string; description: string };
    withFormGroup: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Input — Cubby UI',
    description: 'Displays a text input field for user data entry.',
    category: 'Forms',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Apply <code class="cu-code">cu-input</code> to an <code class="cu-code">&lt;input&gt;</code> element.',
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
      inputTypes: {
        title: 'Input Types',
        description: 'Set the <code class="cu-code">type</code> attribute for email, password, number, and other input types.',
      },
      disabled: {
        title: 'Disabled',
        description: 'Add the <code class="cu-code">disabled</code> attribute. The input becomes non-interactive with reduced opacity.',
      },
      withFormGroup: {
        title: 'With Form Group',
        description: 'Combine with <code class="cu-code">cu-form-group</code>, <code class="cu-code">cu-form-description</code>, and <code class="cu-code">cu-form-error</code> for complete form fields.',
      },
    },
    classDescriptions: {
      'cu-input': 'Text input style with hover border, focus ring, and disabled state',
    },
  },
  'zh-tw': {
    title: 'Input — Cubby UI',
    description: '顯示文字輸入框，用於使用者資料輸入。',
    category: '表單',
    sections: {
      usage: {
        title: '使用方式',
        description: '將 <code class="cu-code">cu-input</code> 套用至 <code class="cu-code">&lt;input&gt;</code> 元素。',
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
      inputTypes: {
        title: '輸入類型',
        description: '設定 <code class="cu-code">type</code> 屬性以使用 email、password、number 及其他輸入類型。',
      },
      disabled: {
        title: '停用',
        description: '加入 <code class="cu-code">disabled</code> 屬性。輸入框將變為不可互動並降低透明度。',
      },
      withFormGroup: {
        title: '搭配 Form Group',
        description: '結合 <code class="cu-code">cu-form-group</code>、<code class="cu-code">cu-form-description</code> 和 <code class="cu-code">cu-form-error</code> 以建立完整的表單欄位。',
      },
    },
    classDescriptions: {
      'cu-input': '文字輸入框樣式，含 hover 邊框、焦點環與停用狀態',
    },
  },
};
