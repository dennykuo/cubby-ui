import type { Locale } from '../../index';

export const radioPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    radioGroup: { title: string; description: string };
    defaultSelected: { title: string; description: string };
    disabled: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Radio — Cubby UI',
    description: 'Displays a radio button for selecting one option from a group.',
    category: 'Forms',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Apply <code class="cu-code">cu-radio</code> to an <code class="cu-code">&lt;input type="radio"&gt;</code> element.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      radioGroup: {
        title: 'Radio Group',
        description: 'Group radios with the same <code class="cu-code">name</code> attribute inside a <code class="cu-code">cu-radio-group</code> container, using <code class="cu-code">cu-radio-wrapper</code> for each option.',
      },
      defaultSelected: {
        title: 'Default Selected',
        description: 'Add the <code class="cu-code">checked</code> attribute to pre-select an option.',
      },
      disabled: {
        title: 'Disabled',
        description: 'Add the <code class="cu-code">disabled</code> attribute to prevent interaction.',
      },
    },
    classDescriptions: {
      'cu-radio-group': 'Vertical container for Radio group',
      'cu-radio-wrapper': 'Flex container for Radio and Label',
      'cu-radio': 'Radio button style, shows inner dot via thick border when selected',
    },
  },
  'zh-tw': {
    title: 'Radio — Cubby UI',
    description: '顯示單選按鈕，用於從群組中選擇一個選項。',
    category: '表單',
    sections: {
      usage: {
        title: '使用方式',
        description: '將 <code class="cu-code">cu-radio</code> 套用至 <code class="cu-code">&lt;input type="radio"&gt;</code> 元素。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      radioGroup: {
        title: '單選按鈕群組',
        description: '在 <code class="cu-code">cu-radio-group</code> 容器中，使用相同 <code class="cu-code">name</code> 屬性分組單選按鈕，每個選項使用 <code class="cu-code">cu-radio-wrapper</code>。',
      },
      defaultSelected: {
        title: '預設選取',
        description: '加入 <code class="cu-code">checked</code> 屬性以預選一個選項。',
      },
      disabled: {
        title: '停用',
        description: '加入 <code class="cu-code">disabled</code> 屬性以防止互動。',
      },
    },
    classDescriptions: {
      'cu-radio-group': 'Radio 群組的垂直容器',
      'cu-radio-wrapper': 'Radio 與 Label 的 Flex 容器',
      'cu-radio': '單選按鈕樣式，選取時透過粗邊框顯示內圓點',
    },
  },
};
