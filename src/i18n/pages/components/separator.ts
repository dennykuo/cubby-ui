import type { Locale } from '../../index';

export const separatorPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withText: { title: string; description: string };
    vertical: { title: string; description: string };
    inToolbar: { title: string; description: string };
    withIcon: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Separator — Cubby UI',
    description: 'Visually or semantically separates content.',
    category: 'Basic',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Apply <code class="cu-code">cu-separator</code> as the base class with <code class="cu-code">cu-separator-horizontal</code> or <code class="cu-code">cu-separator-vertical</code> for orientation.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withText: {
        title: 'With Text',
        description: 'Combine horizontal and vertical separators to create structured layouts.',
      },
      vertical: {
        title: 'Vertical',
        description: 'Use <code class="cu-code">cu-separator-vertical</code> to separate inline items.',
      },
      inToolbar: {
        title: 'In Toolbar',
        description: 'Use a vertical separator to visually divide groups of actions in a toolbar.',
      },
      withIcon: {
        title: 'With Icon',
        description: 'Combine a separator with a centered icon or label for decorative section breaks.',
      },
    },
    classDescriptions: {
      'cu-separator': 'Base separator',
      'cu-separator-horizontal': 'Horizontal separator',
      'cu-separator-vertical': 'Vertical separator',
    },
  },
  'zh-tw': {
    title: 'Separator — Cubby UI',
    description: '以視覺或語意方式分隔內容。',
    category: '基礎',
    sections: {
      usage: {
        title: '使用方式',
        description: '以 <code class="cu-code">cu-separator</code> 作為基礎類別，搭配 <code class="cu-code">cu-separator-horizontal</code> 或 <code class="cu-code">cu-separator-vertical</code> 指定方向。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withText: {
        title: '搭配文字',
        description: '結合水平和垂直分隔線來建立結構化的版面。',
      },
      vertical: {
        title: '垂直',
        description: '使用 <code class="cu-code">cu-separator-vertical</code> 來分隔行內項目。',
      },
      inToolbar: {
        title: '工具列中使用',
        description: '在工具列中使用垂直分隔線來視覺區分操作群組。',
      },
      withIcon: {
        title: '搭配圖示',
        description: '將分隔線與置中圖示或標籤結合，作為裝飾性段落分隔。',
      },
    },
    classDescriptions: {
      'cu-separator': '基礎分隔線',
      'cu-separator-horizontal': '水平分隔線',
      'cu-separator-vertical': '垂直分隔線',
    },
  },
};
