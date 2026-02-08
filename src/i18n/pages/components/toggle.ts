import type { Locale } from '../../index';

export const togglePage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withLabel: { title: string; description: string };
    sizes: { title: string; description: string };
    checkedByDefault: { title: string; description: string };
    disabled: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Toggle — Cubby UI',
    description: 'Displays a toggle switch for binary on/off options. Pure CSS — no JavaScript required.',
    category: 'Forms',
    sections: {
      usage: {
        title: 'Usage',
        description: 'The toggle uses a hidden <code class="cu-code">&lt;input type="checkbox"&gt;</code> with <code class="cu-code">cu-toggle-input</code>, a visual track with <code class="cu-code">cu-toggle</code>, and a thumb with <code class="cu-code">cu-toggle-thumb</code>, all inside a <code class="cu-code">cu-toggle-wrapper</code> label.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withLabel: {
        title: 'With Label',
        description: 'Add label text as a sibling inside the wrapper. Clicking the text also toggles the switch.',
      },
      sizes: {
        title: 'Sizes',
        description: 'Three sizes are available — <code class="cu-code">cu-toggle-sm</code>, default, and <code class="cu-code">cu-toggle-lg</code>.',
      },
      checkedByDefault: {
        title: 'Checked by Default',
        description: 'Add the <code class="cu-code">checked</code> attribute to the hidden input for an initial on state.',
      },
      disabled: {
        title: 'Disabled',
        description: 'Add the <code class="cu-code">disabled</code> attribute to prevent interaction.',
      },
    },
    classDescriptions: {
      'cu-toggle-wrapper': 'Flex container for Toggle and Label',
      'cu-toggle-input': 'Hidden checkbox input, controls toggle state via sibling selector',
      'cu-toggle': 'Toggle track, default size',
      'cu-toggle-sm': 'Small toggle track',
      'cu-toggle-lg': 'Large toggle track',
      'cu-toggle-thumb': 'Toggle sliding dot',
    },
  },
  'zh-tw': {
    title: 'Toggle — Cubby UI',
    description: '顯示開關切換元件，用於二元開/關選項。純 CSS，不需要 JavaScript。',
    category: '表單',
    sections: {
      usage: {
        title: '使用方式',
        description: 'Toggle 使用隱藏的 <code class="cu-code">&lt;input type="checkbox"&gt;</code> 搭配 <code class="cu-code">cu-toggle-input</code>，視覺軌道使用 <code class="cu-code">cu-toggle</code>，滑塊使用 <code class="cu-code">cu-toggle-thumb</code>，全部包裹在 <code class="cu-code">cu-toggle-wrapper</code> label 中。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withLabel: {
        title: '帶標籤',
        description: '在包裝器內加入標籤文字作為 sibling。點擊文字也能切換開關。',
      },
      sizes: {
        title: '尺寸',
        description: '提供三種尺寸 — <code class="cu-code">cu-toggle-sm</code>、預設和 <code class="cu-code">cu-toggle-lg</code>。',
      },
      checkedByDefault: {
        title: '預設勾選',
        description: '在隱藏的 input 上加入 <code class="cu-code">checked</code> 屬性以設定初始開啟狀態。',
      },
      disabled: {
        title: '停用',
        description: '加入 <code class="cu-code">disabled</code> 屬性以防止互動。',
      },
    },
    classDescriptions: {
      'cu-toggle-wrapper': 'Toggle 與 Label 的 Flex 容器',
      'cu-toggle-input': '隱藏的 checkbox input，透過 sibling selector 控制 toggle 狀態',
      'cu-toggle': 'Toggle 軌道，預設尺寸',
      'cu-toggle-sm': '小尺寸 toggle 軌道',
      'cu-toggle-lg': '大尺寸 toggle 軌道',
      'cu-toggle-thumb': 'Toggle 滑動圓點',
    },
  },
};
