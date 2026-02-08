import type { Locale } from '../../index';

export const headingsPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    allLevels: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Headings — Cubby UI',
    description: 'Semantic heading styles from H1 to H4 for page titles, section headers, and content hierarchy.',
    category: 'Typography',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Apply <code class="cu-code">cu-h1</code> through <code class="cu-code">cu-h4</code> to heading elements.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      allLevels: {
        title: 'All Levels',
        description: 'Four heading levels with progressively decreasing size and weight.',
      },
    },
    classDescriptions: {
      'cu-h1': 'Heading 1, extra-large bold',
      'cu-h2': 'Heading 2, large semi-bold',
      'cu-h3': 'Heading 3, medium semi-bold',
      'cu-h4': 'Heading 4, small semi-bold',
    },
  },
  'zh-tw': {
    title: 'Headings — Cubby UI',
    description: '從 H1 到 H4 的語意標題樣式，適用於頁面標題、區段標頭和內容層級。',
    category: '排版',
    sections: {
      usage: {
        title: '使用方式',
        description: '將 <code class="cu-code">cu-h1</code> 到 <code class="cu-code">cu-h4</code> 套用至標題元素。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      allLevels: {
        title: '所有層級',
        description: '四個標題層級，尺寸與字重依序遞減。',
      },
    },
    classDescriptions: {
      'cu-h1': '標題 1，超大粗體',
      'cu-h2': '標題 2，大半粗體',
      'cu-h3': '標題 3，中半粗體',
      'cu-h4': '標題 4，小半粗體',
    },
  },
};
