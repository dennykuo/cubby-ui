import type { Locale } from '../../index';

export const textPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    small: { title: string; description: string };
    muted: { title: string; description: string };
    inlineCode: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Text — Cubby UI',
    description: 'Utility classes for common text styles — large, small, muted, and inline code.',
    category: 'Typography',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Use <code class="cu-code">cu-text-large</code> for emphasized, larger text.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      small: {
        title: 'Small',
        description: 'Use <code class="cu-code">cu-text-small</code> for compact, secondary text.',
      },
      muted: {
        title: 'Muted',
        description: 'Use <code class="cu-code">cu-text-muted</code> for de-emphasized helper text.',
      },
      inlineCode: {
        title: 'Inline Code',
        description: 'Use <code class="cu-code">cu-code</code> for inline code snippets within text content.',
      },
    },
    classDescriptions: {
      'cu-text-large': 'Large text, semi-bold',
      'cu-text-small': 'Small text, medium weight',
      'cu-text-muted': 'Muted helper text',
    },
  },
  'zh-tw': {
    title: 'Text — Cubby UI',
    description: '常用文字樣式的工具類別 — 大、小、柔和及行內程式碼。',
    category: '排版',
    sections: {
      usage: {
        title: '使用方式',
        description: '使用 <code class="cu-code">cu-text-large</code> 設定強調的大字文字。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      small: {
        title: 'Small',
        description: '使用 <code class="cu-code">cu-text-small</code> 設定精簡的次要文字。',
      },
      muted: {
        title: 'Muted',
        description: '使用 <code class="cu-code">cu-text-muted</code> 設定低調的輔助文字。',
      },
      inlineCode: {
        title: '行內程式碼',
        description: '使用 <code class="cu-code">cu-code</code> 在文字內容中插入行內程式碼片段。',
      },
    },
    classDescriptions: {
      'cu-text-large': '大字文字，半粗體',
      'cu-text-small': '小字文字，中等字重',
      'cu-text-muted': '柔和輔助文字',
    },
  },
};
