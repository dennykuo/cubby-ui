import type { Locale } from '../../index';

export const blockquotePage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withCitation: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Blockquote — Cubby UI',
    description: 'A styled block quotation for highlighting cited content.',
    category: 'Typography',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Apply <code class="cu-code">cu-blockquote</code> to a <code class="cu-code">&lt;blockquote&gt;</code> element.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withCitation: {
        title: 'With Citation',
        description: 'Wrap in a <code class="cu-code">&lt;figure&gt;</code> with a <code class="cu-code">&lt;figcaption&gt;</code> to attribute the quote.',
      },
    },
    classDescriptions: {
      'cu-blockquote': 'Blockquote with left border and italic text',
    },
  },
  'zh-tw': {
    title: 'Blockquote — Cubby UI',
    description: '用於醒目顯示引用內容的區塊引言樣式。',
    category: '排版',
    sections: {
      usage: {
        title: '使用方式',
        description: '將 <code class="cu-code">cu-blockquote</code> 套用至 <code class="cu-code">&lt;blockquote&gt;</code> 元素。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withCitation: {
        title: '附引用來源',
        description: '使用 <code class="cu-code">&lt;figure&gt;</code> 包裹，並搭配 <code class="cu-code">&lt;figcaption&gt;</code> 標註引用來源。',
      },
    },
    classDescriptions: {
      'cu-blockquote': '帶有左側邊框與斜體文字的區塊引言',
    },
  },
};
