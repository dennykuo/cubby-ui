import type { Locale } from '../../index';

export const labelPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withInput: { title: string; description: string };
    requiredIndicator: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Label — Cubby UI',
    description: 'Displays a label for form controls with consistent typography.',
    category: 'Forms',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Apply <code class="cu-code">cu-label</code> to a <code class="cu-code">&lt;label&gt;</code> element.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withInput: {
        title: 'With Input',
        description: 'Pair with an input using the <code class="cu-code">for</code> and <code class="cu-code">id</code> attributes.',
      },
      requiredIndicator: {
        title: 'Required Indicator',
        description: 'Add <code class="cu-code">cu-label-required</code> to automatically append a red asterisk, or manually add one with <code class="cu-code">text-destructive</code>.',
      },
    },
    classDescriptions: {
      'cu-label': 'Form label style with peer-disabled opacity reduction',
      'cu-label-required': 'Appends a red asterisk (*) after the label text',
    },
  },
  'zh-tw': {
    title: 'Label — Cubby UI',
    description: '為表單控制項顯示標籤，提供一致的排版樣式。',
    category: '表單',
    sections: {
      usage: {
        title: '使用方式',
        description: '將 <code class="cu-code">cu-label</code> 套用至 <code class="cu-code">&lt;label&gt;</code> 元素。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withInput: {
        title: '搭配輸入框',
        description: '使用 <code class="cu-code">for</code> 和 <code class="cu-code">id</code> 屬性與輸入框配對。',
      },
      requiredIndicator: {
        title: '必填標記',
        description: '加入 <code class="cu-code">cu-label-required</code> 自動在文字後方附加紅色星號，或手動以 <code class="cu-code">text-destructive</code> 加入。',
      },
    },
    classDescriptions: {
      'cu-label': '表單標籤樣式，含 peer-disabled 透明度降低',
      'cu-label-required': '在標籤文字後顯示紅色星號（*）',
    },
  },
};
