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
    },
    classDescriptions: {
      'cu-separator': '基礎分隔線',
      'cu-separator-horizontal': '水平分隔線',
      'cu-separator-vertical': '垂直分隔線',
    },
  },
};
