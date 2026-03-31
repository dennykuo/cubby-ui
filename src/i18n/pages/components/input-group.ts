import type { Locale } from '../../index';

export const inputGroupPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    textPrefix: { title: string; description: string };
    textSuffix: { title: string; description: string };
    iconPrefix: { title: string; description: string };
    buttonSuffix: { title: string; description: string };
    combined: { title: string; description: string };
    disabled: { title: string; description: string };
    withLabel: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Input Group — Cubby UI',
    description: 'Extend inputs with text, icons, or buttons as prefix/suffix decorations.',
    category: 'Forms',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Wrap an <code class="cu-code">cu-input</code> and one or more <code class="cu-code">cu-input-group-text</code> elements inside a <code class="cu-code">cu-input-group</code> container.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      textPrefix: {
        title: 'Text Prefix',
        description: 'Use <code class="cu-code">cu-input-group-text</code> as a prefix for static text like protocol or currency.',
      },
      textSuffix: {
        title: 'Text Suffix',
        description: 'Place <code class="cu-code">cu-input-group-text</code> after the input for suffix decoration.',
      },
      iconPrefix: {
        title: 'Icon Prefix',
        description: 'Place an SVG icon inside <code class="cu-code">cu-input-group-text</code> for icon decoration.',
      },
      buttonSuffix: {
        title: 'Button Suffix',
        description: 'Append a <code class="cu-code">cu-button</code> directly as a suffix for action buttons.',
      },
      combined: {
        title: 'Combined',
        description: 'Combine icon prefix and button suffix for a complete input group.',
      },
      disabled: {
        title: 'Disabled',
        description: 'Add <code class="cu-code">cu-input-group-disabled</code> to the container and <code class="cu-code">disabled</code> to the input.',
      },
      withLabel: {
        title: 'With Label',
        description: 'Wrap in a <code class="cu-code">cu-form-group</code> with a <code class="cu-code">cu-label</code> for accessible form fields.',
      },
    },
    classDescriptions: {
      'cu-input-group': 'Flex container for grouping input with prefix/suffix elements',
      'cu-input-group-text': 'Static text or icon decoration with muted background',
      'cu-input-group-disabled': 'Disabled state with reduced opacity and no pointer events',
    },
  },
  'zh-tw': {
    title: 'Input Group — Cubby UI',
    description: '以文字、圖示或按鈕作為前綴/後綴裝飾來擴展輸入框。',
    category: '表單',
    sections: {
      usage: {
        title: '使用方式',
        description: '將 <code class="cu-code">cu-input</code> 和一個或多個 <code class="cu-code">cu-input-group-text</code> 元素包裹在 <code class="cu-code">cu-input-group</code> 容器中。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      textPrefix: {
        title: '文字前綴',
        description: '使用 <code class="cu-code">cu-input-group-text</code> 作為靜態文字的前綴，如協定或貨幣。',
      },
      textSuffix: {
        title: '文字後綴',
        description: '將 <code class="cu-code">cu-input-group-text</code> 放在輸入框之後作為後綴裝飾。',
      },
      iconPrefix: {
        title: '圖示前綴',
        description: '在 <code class="cu-code">cu-input-group-text</code> 中放入 SVG 圖示作為圖示裝飾。',
      },
      buttonSuffix: {
        title: '按鈕後綴',
        description: '直接附加 <code class="cu-code">cu-button</code> 作為操作按鈕後綴。',
      },
      combined: {
        title: '組合',
        description: '結合圖示前綴和按鈕後綴，組成完整的輸入群組。',
      },
      disabled: {
        title: '停用',
        description: '對容器加入 <code class="cu-code">cu-input-group-disabled</code>，並對輸入框加入 <code class="cu-code">disabled</code>。',
      },
      withLabel: {
        title: '搭配標籤',
        description: '使用 <code class="cu-code">cu-form-group</code> 搭配 <code class="cu-code">cu-label</code> 包裹，建立具無障礙性的表單欄位。',
      },
    },
    classDescriptions: {
      'cu-input-group': '用於將輸入框與前綴/後綴元素組合的 Flex 容器',
      'cu-input-group-text': '帶有柔和背景的靜態文字或圖示裝飾',
      'cu-input-group-disabled': '停用狀態，降低透明度且無指標事件',
    },
  },
};
