import type { Locale } from '../../index';

export const passwordInputPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withLabel: { title: string; description: string };
    disabled: { title: string; description: string };
    strengthIndicator: { title: string; description: string };
    requirements: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Password Input — Cubby UI',
    description: 'A password input with a toggle button to show or hide the password.',
    category: 'Forms',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Wrap an input and toggle button inside a <code class="cu-code">cu-password-input</code> container with the <code class="cu-code">data-cu-password-input</code> attribute. The toggle button uses <code class="cu-code">cu-password-input-toggle</code> and the input uses <code class="cu-code">cu-password-input-field</code>.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withLabel: {
        title: 'With Label',
        description: 'Combine with <code class="cu-code">cu-form-group</code> and <code class="cu-code">cu-label</code> for a complete form field.',
      },
      disabled: {
        title: 'Disabled',
        description: 'Add the <code class="cu-code">disabled</code> attribute to both the input and toggle button.',
      },
      strengthIndicator: {
        title: 'Strength Indicator',
        description: 'Display a visual password strength meter below the input to guide users toward stronger passwords.',
      },
      requirements: {
        title: 'With Requirements',
        description: 'Show a checklist of password requirements that update in real-time as the user types.',
      },
    },
    classDescriptions: {
      'cu-password-input': 'Container, relatively positioned flex wrapper',
      'cu-password-input-field': 'Password input with right padding for toggle button',
      'cu-password-input-toggle': 'Absolutely positioned toggle button for show/hide',
    },
  },
  'zh-tw': {
    title: 'Password Input — Cubby UI',
    description: '帶有切換按鈕的密碼輸入框，可顯示或隱藏密碼。',
    category: '表單',
    sections: {
      usage: {
        title: '使用方式',
        description: '將輸入框和切換按鈕包裹在帶有 <code class="cu-code">data-cu-password-input</code> 屬性的 <code class="cu-code">cu-password-input</code> 容器中。切換按鈕使用 <code class="cu-code">cu-password-input-toggle</code>，輸入框使用 <code class="cu-code">cu-password-input-field</code>。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withLabel: {
        title: '搭配標籤',
        description: '搭配 <code class="cu-code">cu-form-group</code> 和 <code class="cu-code">cu-label</code> 組成完整的表單欄位。',
      },
      disabled: {
        title: '停用',
        description: '在輸入框和切換按鈕上同時加入 <code class="cu-code">disabled</code> 屬性。',
      },
      strengthIndicator: {
        title: '密碼強度指示',
        description: '在輸入框下方顯示視覺化密碼強度計，引導使用者建立更強的密碼。',
      },
      requirements: {
        title: '搭配需求條件',
        description: '顯示密碼需求條件的檢查清單，隨使用者輸入即時更新。',
      },
    },
    classDescriptions: {
      'cu-password-input': '容器，相對定位的 flex 包裝器',
      'cu-password-input-field': '密碼輸入框，右側留有切換按鈕的空間',
      'cu-password-input-toggle': '絕對定位的顯示 / 隱藏切換按鈕',
    },
  },
};
