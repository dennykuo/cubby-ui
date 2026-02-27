import type { Locale } from '../../index';

export const inputPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    sizes: { title: string; description: string };
    withLabel: { title: string; description: string };
    inputTypes: { title: string; description: string };
    withAddon: { title: string; description: string };
    withIcon: { title: string; description: string };
    validation: { title: string; description: string };
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
      sizes: {
        title: 'Sizes',
        description: 'Two additional sizes — <code class="cu-code">cu-input-sm</code> matches <code class="cu-code">cu-button-sm</code> height, and <code class="cu-code">cu-input-lg</code> matches <code class="cu-code">cu-button-lg</code>.',
      },
      withLabel: {
        title: 'With Label',
        description: 'Pair with a <code class="cu-code">cu-label</code> for accessible form fields.',
      },
      inputTypes: {
        title: 'Input Types',
        description: 'Set the <code class="cu-code">type</code> attribute for email, password, number, and other input types.',
      },
      withAddon: {
        title: 'With Addon',
        description: 'Wrap the input in a <code class="cu-code">cu-input-group</code> and add <code class="cu-code">cu-input-addon</code> elements for prefix/suffix text.',
      },
      withIcon: {
        title: 'With Icon',
        description: 'Use <code class="cu-code">cu-input-icon-wrapper</code> with <code class="cu-code">cu-input-icon</code> and <code class="cu-code">cu-input-has-icon</code> for an icon-prefixed input.',
      },
      validation: {
        title: 'Validation',
        description: 'Add <code class="cu-code">cu-input-error</code> or <code class="cu-code">cu-input-success</code> to visually indicate validation state. Combine with <code class="cu-code">cu-form-error</code> for accessible error messages.',
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
      'cu-input-error': 'Error state with destructive border and focus ring',
      'cu-input-success': 'Success state with success border and focus ring',
      'cu-input-group': 'Flex container for input + addon combinations',
      'cu-input-addon': 'Prefix/suffix text block with muted background',
      'cu-input-icon-wrapper': 'Relative wrapper for icon-prefixed input',
      'cu-input-icon': 'Absolutely positioned icon inside the input',
      'cu-input-has-icon': 'Input with left padding for icon',
      'cu-input-sm': 'Small size (h-8, matches cu-button-sm)',
      'cu-input-lg': 'Large size (h-10, matches cu-button-lg)',
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
      sizes: {
        title: '尺寸',
        description: '兩種額外尺寸 — <code class="cu-code">cu-input-sm</code> 對應 <code class="cu-code">cu-button-sm</code> 高度，<code class="cu-code">cu-input-lg</code> 對應 <code class="cu-code">cu-button-lg</code>。',
      },
      withLabel: {
        title: '帶標籤',
        description: '搭配 <code class="cu-code">cu-label</code> 以提供無障礙表單欄位。',
      },
      inputTypes: {
        title: '輸入類型',
        description: '設定 <code class="cu-code">type</code> 屬性以使用 email、password、number 及其他輸入類型。',
      },
      withAddon: {
        title: '搭配前後綴',
        description: '以 <code class="cu-code">cu-input-group</code> 包裹輸入框，加入 <code class="cu-code">cu-input-addon</code> 元素作為前綴/後綴文字。',
      },
      withIcon: {
        title: '搭配圖示',
        description: '使用 <code class="cu-code">cu-input-icon-wrapper</code> 搭配 <code class="cu-code">cu-input-icon</code> 和 <code class="cu-code">cu-input-has-icon</code> 建立帶圖示的輸入框。',
      },
      validation: {
        title: '驗證狀態',
        description: '加入 <code class="cu-code">cu-input-error</code> 或 <code class="cu-code">cu-input-success</code> 以視覺呈現驗證狀態。搭配 <code class="cu-code">cu-form-error</code> 提供無障礙錯誤訊息。',
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
      'cu-input-error': '錯誤狀態，帶 destructive 邊框和焦點環',
      'cu-input-success': '成功狀態，帶 success 邊框和焦點環',
      'cu-input-group': '輸入框 + 前後綴的 Flex 容器',
      'cu-input-addon': '前綴/後綴文字區塊，帶淡色背景',
      'cu-input-icon-wrapper': '帶圖示輸入框的相對定位包裝器',
      'cu-input-icon': '輸入框內的絕對定位圖示',
      'cu-input-has-icon': '帶圖示的輸入框，預留左側 padding',
      'cu-input-sm': '小尺寸（h-8，對應 cu-button-sm）',
      'cu-input-lg': '大尺寸（h-10，對應 cu-button-lg）',
    },
  },
};
