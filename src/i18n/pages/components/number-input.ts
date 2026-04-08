import type { Locale } from '../../index';

export const numberInputPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withMinMax: { title: string; description: string };
    disabled: { title: string; description: string };
    withPrefixSuffix: { title: string; description: string };
    currency: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Number Input — Cubby UI',
    description: 'A numeric stepper with decrement and increment buttons.',
    category: 'Forms',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Use <code class="cu-code">data-cu-number-input</code> on the wrapper, <code class="cu-code">data-cu-number-decrement</code> and <code class="cu-code">data-cu-number-increment</code> on the buttons, and <code class="cu-code">data-cu-number-field</code> on the input. The <code class="cu-code">&lt;script&gt;</code> handles stepping, min/max clamping, and event dispatch.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withMinMax: {
        title: 'With Min/Max',
        description: 'Set <code class="cu-code">min</code>, <code class="cu-code">max</code>, and <code class="cu-code">step</code> attributes on the input to constrain values. This example allows values from 1 to 10.',
      },
      disabled: {
        title: 'Disabled',
        description: 'Add <code class="cu-code">cu-number-input-disabled</code> to the container and <code class="cu-code">disabled</code> to the buttons and input.',
      },
      withPrefixSuffix: {
        title: 'With Prefix / Suffix',
        description: 'Wrap the number input with prefix or suffix text to indicate the unit of measurement.',
      },
      currency: {
        title: 'Currency Input',
        description: 'Combine with a currency symbol prefix for price or monetary value inputs.',
      },
    },
    classDescriptions: {
      'cu-number-input': 'Number input container with border and focus-within ring',
      'cu-number-input-button': 'Increment/decrement button with hover background',
      'cu-number-input-field': 'Number input field, centered with hidden native arrows',
      'cu-number-input-disabled': 'Disabled state with reduced opacity and no interaction',
    },
  },
  'zh-tw': {
    title: 'Number Input — Cubby UI',
    description: '帶遞減與遞增按鈕的數字步進器。',
    category: '表單',
    sections: {
      usage: {
        title: '使用方式',
        description: '在外層容器使用 <code class="cu-code">data-cu-number-input</code>，按鈕使用 <code class="cu-code">data-cu-number-decrement</code> 和 <code class="cu-code">data-cu-number-increment</code>，輸入框使用 <code class="cu-code">data-cu-number-field</code>。<code class="cu-code">&lt;script&gt;</code> 處理步進、最小/最大值限制及事件派發。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withMinMax: {
        title: '帶最小/最大值',
        description: '在 input 上設定 <code class="cu-code">min</code>、<code class="cu-code">max</code> 和 <code class="cu-code">step</code> 屬性以限制數值。此範例允許 1 到 10 的值。',
      },
      disabled: {
        title: '停用',
        description: '在容器上加入 <code class="cu-code">cu-number-input-disabled</code>，並在按鈕和 input 上加入 <code class="cu-code">disabled</code>。',
      },
      withPrefixSuffix: {
        title: '前綴 / 後綴',
        description: '在數字輸入框前後加入前綴或後綴文字，指示計量單位。',
      },
      currency: {
        title: '貨幣輸入',
        description: '搭配貨幣符號前綴，用於價格或金額輸入。',
      },
    },
    classDescriptions: {
      'cu-number-input': '數字輸入容器，含邊框與 focus-within 焦點環',
      'cu-number-input-button': '遞增/遞減按鈕，含 hover 背景',
      'cu-number-input-field': '數字輸入欄位，置中且隱藏原生箭頭',
      'cu-number-input-disabled': '停用狀態，降低透明度且無法互動',
    },
  },
};
