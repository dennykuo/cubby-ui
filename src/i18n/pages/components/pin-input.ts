import type { Locale } from '../../index';

export const pinInputPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    sixDigit: { title: string; description: string };
    alphanumeric: { title: string; description: string };
    sizes: { title: string; description: string };
    error: { title: string; description: string };
    disabled: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Pin Input — Cubby UI',
    description: 'A one-character-per-field verification code input with auto-advance, Backspace navigation, and paste support. Ideal for OTP codes, PINs, and similar scenarios.',
    category: 'Forms',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Use <code class="cu-code">cu-pin-input</code> as the flex container with <code class="cu-code">data-cu-pin-input</code> for JS initialization. Each field uses <code class="cu-code">cu-pin-input-field</code> with <code class="cu-code">maxlength="1"</code>. Set <code class="cu-code">data-cu-pin-input-type="numeric"</code> to restrict input to digits only.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      sixDigit: {
        title: '6-Digit Code',
        description: 'Set the <code class="cu-code">length</code> prop to generate more fields. Commonly used for 6-digit OTP codes.',
      },
      alphanumeric: {
        title: 'Alphanumeric',
        description: 'Set <code class="cu-code">data-cu-pin-input-type="alphanumeric"</code> to allow both letters and numbers.',
      },
      sizes: {
        title: 'Sizes',
        description: 'Use <code class="cu-code">cu-pin-input-sm</code> or <code class="cu-code">cu-pin-input-lg</code> on the container for different sizes.',
      },
      error: {
        title: 'Error',
        description: 'Add <code class="cu-code">cu-pin-input-error</code> to the container for a destructive border style.',
      },
      disabled: {
        title: 'Disabled',
        description: 'Add the <code class="cu-code">disabled</code> attribute to each input field.',
      },
    },
    classDescriptions: {
      'cu-pin-input': 'Flex container with gap for pin fields',
      'cu-pin-input-field': 'Individual square input field, text-center with large font',
      'cu-pin-input-sm': 'Small size variant (32\u00d732px)',
      'cu-pin-input-lg': 'Large size variant (48\u00d748px)',
      'cu-pin-input-error': 'Error state with destructive border color',
    },
  },
  'zh-tw': {
    title: 'Pin Input — Cubby UI',
    description: '一格一字元的驗證碼輸入元件，支援自動跳格、Backspace 返回和整組貼上。適用於 OTP 驗證碼、PIN 碼等場景。',
    category: '表單',
    sections: {
      usage: {
        title: '使用方式',
        description: '以 <code class="cu-code">cu-pin-input</code> 作為 flex 容器，搭配 <code class="cu-code">data-cu-pin-input</code> 進行 JS 初始化。每個欄位使用 <code class="cu-code">cu-pin-input-field</code> 並設定 <code class="cu-code">maxlength="1"</code>。設定 <code class="cu-code">data-cu-pin-input-type="numeric"</code> 可限制僅輸入數字。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      sixDigit: {
        title: '6 位數驗證碼',
        description: '設定 <code class="cu-code">length</code> prop 以產生更多欄位。常用於 6 位數 OTP 驗證碼。',
      },
      alphanumeric: {
        title: '英數字模式',
        description: '設定 <code class="cu-code">data-cu-pin-input-type="alphanumeric"</code> 以允許字母和數字。',
      },
      sizes: {
        title: '尺寸',
        description: '在容器上使用 <code class="cu-code">cu-pin-input-sm</code> 或 <code class="cu-code">cu-pin-input-lg</code> 調整尺寸。',
      },
      error: {
        title: '錯誤',
        description: '在容器上加入 <code class="cu-code">cu-pin-input-error</code> 以顯示錯誤邊框樣式。',
      },
      disabled: {
        title: '停用',
        description: '在每個輸入欄位上加入 <code class="cu-code">disabled</code> 屬性。',
      },
    },
    classDescriptions: {
      'cu-pin-input': '帶有間距的 flex 容器',
      'cu-pin-input-field': '單個方形輸入欄位，文字置中搭配大字體',
      'cu-pin-input-sm': '小尺寸變體（32\u00d732px）',
      'cu-pin-input-lg': '大尺寸變體（48\u00d748px）',
      'cu-pin-input-error': '錯誤狀態，使用 destructive 邊框顏色',
    },
  },
};
