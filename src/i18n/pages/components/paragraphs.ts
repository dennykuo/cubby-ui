import type { Locale } from '../../index';

export const paragraphsPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    lead: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Paragraphs — Cubby UI',
    description: 'Paragraph styles for body text and lead introductions.',
    category: 'Typography',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Apply <code class="cu-code">cu-p</code> to paragraph elements for consistent line height and spacing.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      lead: {
        title: 'Lead',
        description: 'Use <code class="cu-code">cu-p-lead</code> for introductory paragraphs with larger, muted text.',
      },
    },
    classDescriptions: {
      'cu-p': 'Base paragraph style with consistent line height',
      'cu-p-lead': 'Lead paragraph with larger font and muted color',
    },
  },
  'zh-tw': {
    title: 'Paragraphs — Cubby UI',
    description: '適用於內文和導言的段落樣式。',
    category: '排版',
    sections: {
      usage: {
        title: '使用方式',
        description: '將 <code class="cu-code">cu-p</code> 套用至段落元素，以獲得一致的行高和間距。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      lead: {
        title: '導言',
        description: '使用 <code class="cu-code">cu-p-lead</code> 設定較大且柔和的導言段落。',
      },
    },
    classDescriptions: {
      'cu-p': '基礎段落樣式，具有一致的行高',
      'cu-p-lead': '導言段落，較大字體搭配柔和色彩',
    },
  },
};
