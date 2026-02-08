import type { Locale } from '../../index';

export const buttonGroupPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    variants: { title: string; description: string };
    withIcons: { title: string; description: string };
    iconOnly: { title: string; description: string };
    sizes: { title: string; description: string };
    vertical: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Button Group — Cubby UI',
    description: 'Groups a series of buttons together on a single line or vertically.',
    category: 'Basic',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Wrap buttons with <code class="cu-code">cu-button-group</code> to combine them into a single visual unit. Intermediate border-radius is automatically removed.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      variants: {
        title: 'Variants',
        description: 'Button groups work with any button variant. Mix and match as needed.',
      },
      withIcons: {
        title: 'With Icons',
        description: 'Buttons inside a group can include icons alongside text.',
      },
      iconOnly: {
        title: 'Icon Only',
        description: 'Use <code class="cu-code">cu-button-icon</code> sized buttons for compact icon-only groups.',
      },
      sizes: {
        title: 'Sizes',
        description: 'Button groups adapt to the size of the buttons inside them.',
      },
      vertical: {
        title: 'Vertical',
        description: 'Add <code class="cu-code">cu-button-group-vertical</code> to stack buttons vertically.',
      },
    },
    classDescriptions: {
      'cu-button-group': 'Button group container',
      'cu-button-group-vertical': 'Vertical layout',
    },
  },
  'zh-tw': {
    title: 'Button Group — Cubby UI',
    description: '將一系列按鈕水平或垂直地組合在一起。',
    category: '基礎',
    sections: {
      usage: {
        title: '使用方式',
        description: '使用 <code class="cu-code">cu-button-group</code> 包裹按鈕，將它們合併為一個視覺單元。中間的圓角會自動移除。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      variants: {
        title: '變體',
        description: '按鈕群組可搭配任何按鈕變體使用，可自由混搭。',
      },
      withIcons: {
        title: '帶圖示',
        description: '群組內的按鈕可以包含圖示與文字。',
      },
      iconOnly: {
        title: '純圖示',
        description: '使用 <code class="cu-code">cu-button-icon</code> 尺寸的按鈕建立緊湊的純圖示群組。',
      },
      sizes: {
        title: '尺寸',
        description: '按鈕群組會自動適應內部按鈕的尺寸。',
      },
      vertical: {
        title: '垂直排列',
        description: '加入 <code class="cu-code">cu-button-group-vertical</code> 將按鈕垂直堆疊。',
      },
    },
    classDescriptions: {
      'cu-button-group': '按鈕群組容器',
      'cu-button-group-vertical': '垂直排列',
    },
  },
};
