import type { Locale } from '../../index';

export const toggleGroupPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    sizes: { title: string; description: string };
    outline: { title: string; description: string };
    multiple: { title: string; description: string };
    block: { title: string; description: string };
    withIcons: { title: string; description: string };
    disabled: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Toggle Group — Cubby UI',
    description: 'A group of toggle buttons that can be used to select one or multiple options.',
    category: 'Forms',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Wrap <code class="cu-code">cu-toggle-group-item</code> buttons inside a <code class="cu-code">cu-toggle-group</code> container. Use <code class="cu-code">cu-toggle-group-item-active</code> to mark selected items.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      sizes: {
        title: 'Sizes',
        description: 'Use <code class="cu-code">cu-toggle-group-sm</code> or <code class="cu-code">cu-toggle-group-lg</code> for different sizes.',
      },
      outline: {
        title: 'Outline Variant',
        description: 'Use <code class="cu-code">cu-toggle-group-outline</code> for a bordered style.',
      },
      multiple: {
        title: 'Multiple Selection',
        description: 'Add <code class="cu-code">cu-toggle-group-multiple</code> to allow selecting multiple items with a softer active style.',
      },
      block: {
        title: 'Full Width',
        description: 'Use <code class="cu-code">cu-toggle-group-block</code> to make items fill the available width equally.',
      },
      withIcons: {
        title: 'With Icons',
        description: 'Toggle group items can include icons alongside text or as icon-only buttons.',
      },
      disabled: {
        title: 'Disabled',
        description: 'Add <code class="cu-code">disabled</code> attribute to individual items to disable them.',
      },
    },
    classDescriptions: {
      'cu-toggle-group': 'Container with muted background and rounded corners',
      'cu-toggle-group-item': 'Individual toggle button',
      'cu-toggle-group-item-active': 'Active/selected state with elevated background',
      'cu-toggle-group-multiple': 'Enables multi-select mode with softer active styling',
      'cu-toggle-group-outline': 'Bordered variant without background',
      'cu-toggle-group-sm': 'Small size',
      'cu-toggle-group-lg': 'Large size',
      'cu-toggle-group-block': 'Full width, items stretch equally',
    },
  },
  'zh-tw': {
    title: 'Toggle Group 切換群組 — Cubby UI',
    description: '一組切換按鈕，可用於選擇單一或多個選項。',
    category: 'Forms',
    sections: {
      usage: {
        title: '使用方式',
        description: '將 <code class="cu-code">cu-toggle-group-item</code> 按鈕放入 <code class="cu-code">cu-toggle-group</code> 容器中。使用 <code class="cu-code">cu-toggle-group-item-active</code> 標記已選取項目。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      sizes: {
        title: '尺寸',
        description: '使用 <code class="cu-code">cu-toggle-group-sm</code> 或 <code class="cu-code">cu-toggle-group-lg</code> 設定不同尺寸。',
      },
      outline: {
        title: '外框變體',
        description: '使用 <code class="cu-code">cu-toggle-group-outline</code> 呈現有邊框的樣式。',
      },
      multiple: {
        title: '多選模式',
        description: '加上 <code class="cu-code">cu-toggle-group-multiple</code> 允許選取多個項目，並使用較柔和的啟用樣式。',
      },
      block: {
        title: '滿版寬度',
        description: '使用 <code class="cu-code">cu-toggle-group-block</code> 讓項目等分填滿可用寬度。',
      },
      withIcons: {
        title: '搭配圖示',
        description: '切換按鈕可包含圖示搭配文字，或作為純圖示按鈕。',
      },
      disabled: {
        title: '停用',
        description: '在個別項目加上 <code class="cu-code">disabled</code> 屬性即可停用。',
      },
    },
    classDescriptions: {
      'cu-toggle-group': '帶有柔和背景與圓角的容器',
      'cu-toggle-group-item': '單個切換按鈕',
      'cu-toggle-group-item-active': '啟用/選取狀態，帶有浮起背景',
      'cu-toggle-group-multiple': '啟用多選模式，使用較柔和的啟用樣式',
      'cu-toggle-group-outline': '有邊框的變體，無背景色',
      'cu-toggle-group-sm': '小尺寸',
      'cu-toggle-group-lg': '大尺寸',
      'cu-toggle-group-block': '滿版寬度，項目等分排列',
    },
  },
};
