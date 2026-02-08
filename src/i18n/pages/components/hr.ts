import type { Locale } from '../../index';

export const hrPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withContent: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'HR — Cubby UI',
    description: 'A thematic break between content sections, rendered as a horizontal rule.',
    category: 'Typography',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Apply <code class="cu-code">cu-hr</code> to an <code class="cu-code">&lt;hr&gt;</code> element.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withContent: {
        title: 'With Content',
        description: 'Add vertical margin to separate content sections.',
      },
    },
    classDescriptions: {
      'cu-hr': 'Horizontal divider',
    },
  },
  'zh-tw': {
    title: 'HR — Cubby UI',
    description: '內容區段之間的主題分隔線，以水平線呈現。',
    category: '排版',
    sections: {
      usage: {
        title: '使用方式',
        description: '將 <code class="cu-code">cu-hr</code> 套用至 <code class="cu-code">&lt;hr&gt;</code> 元素。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withContent: {
        title: '搭配內容',
        description: '加入垂直間距以分隔內容區段。',
      },
    },
    classDescriptions: {
      'cu-hr': '水平分隔線',
    },
  },
};
