import type { Locale } from '../../index';

export const accordionPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    multipleItems: { title: string; description: string };
    defaultOpen: { title: string; description: string };
    withIcons: { title: string; description: string };
    bordered: { title: string; description: string };
    richContent: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Accordion — Cubby UI',
    description: 'A vertically stacked set of interactive headings that each reveal associated content.',
    category: 'Data Display',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Built with native <code class="cu-code">&lt;details&gt;</code> and <code class="cu-code">&lt;summary&gt;</code> elements. Use <code class="cu-code">cu-accordion</code> as the wrapper, <code class="cu-code">cu-accordion-item</code> on each <code class="cu-code">&lt;details&gt;</code>, <code class="cu-code">cu-accordion-trigger</code> on <code class="cu-code">&lt;summary&gt;</code>, and <code class="cu-code">cu-accordion-content</code> for the body.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      multipleItems: {
        title: 'Multiple Items',
        description: 'Stack multiple items inside the accordion. Each can be opened independently.',
      },
      defaultOpen: {
        title: 'Default Open',
        description: 'Add the <code class="cu-code">open</code> attribute to expand an item by default.',
      },
      withIcons: {
        title: 'With Icons',
        description: 'Add icons to the trigger for visual categorization.',
      },
      bordered: {
        title: 'Bordered',
        description: 'Separate each item with individual borders for a card-like appearance.',
      },
      richContent: {
        title: 'Rich Content',
        description: 'Accordion items can contain badges, lists, and other components. Useful for changelogs and release notes.',
      },
    },
    classDescriptions: {
      'cu-accordion': 'Accordion container with dividers',
      'cu-accordion-item': 'Accordion item (<code class="cu-code">&lt;details&gt;</code> element)',
      'cu-accordion-trigger': 'Expand / collapse trigger (<code class="cu-code">&lt;summary&gt;</code> element)',
      'cu-accordion-content': 'Collapsible content area',
    },
  },
  'zh-tw': {
    title: 'Accordion — Cubby UI',
    description: '一組垂直堆疊的互動式標題，各自展開對應的內容區塊。',
    category: '資料展示',
    sections: {
      usage: {
        title: '使用方式',
        description: '使用原生 <code class="cu-code">&lt;details&gt;</code> 和 <code class="cu-code">&lt;summary&gt;</code> 元素建構。以 <code class="cu-code">cu-accordion</code> 作為外層容器，每個 <code class="cu-code">&lt;details&gt;</code> 加上 <code class="cu-code">cu-accordion-item</code>，<code class="cu-code">&lt;summary&gt;</code> 加上 <code class="cu-code">cu-accordion-trigger</code>，內容區塊使用 <code class="cu-code">cu-accordion-content</code>。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      multipleItems: {
        title: '多個項目',
        description: '在手風琴內堆疊多個項目，每個項目可獨立展開。',
      },
      defaultOpen: {
        title: '預設展開',
        description: '加上 <code class="cu-code">open</code> 屬性可讓項目預設展開。',
      },
      withIcons: {
        title: '搭配圖示',
        description: '在觸發器中加入圖示以進行視覺分類。',
      },
      bordered: {
        title: '邊框樣式',
        description: '為每個項目加上獨立邊框，呈現卡片式外觀。',
      },
      richContent: {
        title: '豐富內容',
        description: '手風琴項目可包含徽章、列表和其他元件，適合用於更新日誌和版本說明。',
      },
    },
    classDescriptions: {
      'cu-accordion': '手風琴容器，帶分隔線',
      'cu-accordion-item': '手風琴項目（<code class="cu-code">&lt;details&gt;</code> 元素）',
      'cu-accordion-trigger': '展開 / 收合觸發器（<code class="cu-code">&lt;summary&gt;</code> 元素）',
      'cu-accordion-content': '可收合的內容區域',
    },
  },
};
