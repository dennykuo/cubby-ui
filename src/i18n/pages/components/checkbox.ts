import type { Locale } from '../../index';

export const checkboxPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withLabel: { title: string; description: string };
    checkedByDefault: { title: string; description: string };
    disabled: { title: string; description: string };
    checkboxGroup: { title: string; description: string };
    withDescription: { title: string; description: string };
    indeterminate: { title: string; description: string };
    inline: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Checkbox — Cubby UI',
    description: 'Displays a checkbox input for toggling individual options on or off.',
    category: 'Forms',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Apply <code class="cu-code">cu-checkbox</code> to an <code class="cu-code">&lt;input type="checkbox"&gt;</code> element.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withLabel: {
        title: 'With Label',
        description: 'Wrap in a <code class="cu-code">cu-checkbox-wrapper</code> with a <code class="cu-code">cu-label</code> for accessible labeling.',
      },
      checkedByDefault: {
        title: 'Checked by Default',
        description: 'Add the <code class="cu-code">checked</code> attribute for a pre-selected state.',
      },
      disabled: {
        title: 'Disabled',
        description: 'Add the <code class="cu-code">disabled</code> attribute to prevent interaction.',
      },
      checkboxGroup: {
        title: 'Checkbox Group',
        description: 'Group multiple checkboxes with a shared heading using a <code class="cu-code">&lt;fieldset&gt;</code> and <code class="cu-code">&lt;legend&gt;</code>.',
      },
      withDescription: {
        title: 'With Description',
        description: 'Add a description below the label for more context.',
      },
      indeterminate: {
        title: 'Indeterminate',
        description: 'Use JavaScript to set the <code class="cu-code">indeterminate</code> property for a parent checkbox that partially selects child items.',
      },
      inline: {
        title: 'Inline Layout',
        description: 'Arrange checkboxes horizontally with <code class="cu-code">flex flex-wrap gap-4</code>.',
      },
    },
    classDescriptions: {
      'cu-checkbox-wrapper': 'Flex container for Checkbox and Label',
      'cu-checkbox': 'Checkbox style with custom SVG checkmark, focus ring, and disabled state',
    },
  },
  'zh-tw': {
    title: 'Checkbox — Cubby UI',
    description: '顯示一個核取方塊輸入元件，用於切換個別選項的開啟或關閉。',
    category: '表單',
    sections: {
      usage: {
        title: '使用方式',
        description: '將 <code class="cu-code">cu-checkbox</code> 套用至 <code class="cu-code">&lt;input type="checkbox"&gt;</code> 元素。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withLabel: {
        title: '帶標籤',
        description: '包裹在 <code class="cu-code">cu-checkbox-wrapper</code> 中，搭配 <code class="cu-code">cu-label</code> 以提供無障礙標籤。',
      },
      checkedByDefault: {
        title: '預設勾選',
        description: '加入 <code class="cu-code">checked</code> 屬性以設定預選狀態。',
      },
      disabled: {
        title: '停用',
        description: '加入 <code class="cu-code">disabled</code> 屬性以防止互動。',
      },
      checkboxGroup: {
        title: '核取方塊群組',
        description: '使用 <code class="cu-code">&lt;fieldset&gt;</code> 和 <code class="cu-code">&lt;legend&gt;</code> 將多個核取方塊以共用標題分組。',
      },
      withDescription: {
        title: '帶描述',
        description: '在標籤下方加入描述文字以提供更多上下文。',
      },
      indeterminate: {
        title: '不定狀態',
        description: '使用 JavaScript 設定 <code class="cu-code">indeterminate</code> 屬性，用於父層核取方塊部分選取子項目的情境。',
      },
      inline: {
        title: '行內排列',
        description: '使用 <code class="cu-code">flex flex-wrap gap-4</code> 將核取方塊水平排列。',
      },
    },
    classDescriptions: {
      'cu-checkbox-wrapper': 'Checkbox 與 Label 的 Flex 容器',
      'cu-checkbox': '核取方塊樣式，含自訂 SVG 勾勾、焦點環與停用狀態',
    },
  },
};
