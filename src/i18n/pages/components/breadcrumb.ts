import type { Locale } from '../../index';

export const breadcrumbPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withIcon: { title: string; description: string };
    customSeparator: { title: string; description: string };
    withEllipsis: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Breadcrumb — Cubby UI',
    description: 'Displays the path to the current resource using a hierarchy of links.',
    category: 'Navigation',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Use <code class="cu-code">cu-breadcrumb</code> on the <code class="cu-code">&lt;ol&gt;</code>, <code class="cu-code">cu-breadcrumb-item</code> on each <code class="cu-code">&lt;li&gt;</code>, <code class="cu-code">cu-breadcrumb-link</code> for links, <code class="cu-code">cu-breadcrumb-separator</code> between items, and <code class="cu-code">cu-breadcrumb-current</code> for the active page.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withIcon: {
        title: 'With Icon',
        description: 'Use an icon instead of text for the home link.',
      },
      customSeparator: {
        title: 'Custom Separator',
        description: 'Replace the default chevron with any character or element.',
      },
      withEllipsis: {
        title: 'With Ellipsis',
        description: 'Collapse intermediate levels with an ellipsis for long navigation paths.',
      },
    },
    classDescriptions: {
      'cu-breadcrumb': 'Breadcrumb container with horizontal items',
      'cu-breadcrumb-item': 'Breadcrumb item with link and separator',
      'cu-breadcrumb-link': 'Clickable navigation link',
      'cu-breadcrumb-separator': 'Separator between items',
      'cu-breadcrumb-current': 'Current page, bold foreground color',
    },
  },
  'zh-tw': {
    title: 'Breadcrumb — Cubby UI',
    description: '以階層式連結顯示目前資源的路徑。',
    category: '導航',
    sections: {
      usage: {
        title: '使用方式',
        description: '在 <code class="cu-code">&lt;ol&gt;</code> 上使用 <code class="cu-code">cu-breadcrumb</code>，在每個 <code class="cu-code">&lt;li&gt;</code> 上使用 <code class="cu-code">cu-breadcrumb-item</code>，連結使用 <code class="cu-code">cu-breadcrumb-link</code>，項目之間使用 <code class="cu-code">cu-breadcrumb-separator</code>，當前頁面使用 <code class="cu-code">cu-breadcrumb-current</code>。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withIcon: {
        title: '帶圖示',
        description: '使用圖示取代文字作為首頁連結。',
      },
      customSeparator: {
        title: '自訂分隔符',
        description: '以任意字元或元素取代預設的箭頭分隔符。',
      },
      withEllipsis: {
        title: '省略號',
        description: '對於較長的導航路徑，使用省略號折疊中間層級。',
      },
    },
    classDescriptions: {
      'cu-breadcrumb': '麵包屑容器，水平排列項目',
      'cu-breadcrumb-item': '麵包屑項目，包含連結與分隔符',
      'cu-breadcrumb-link': '可點擊的導航連結',
      'cu-breadcrumb-separator': '項目之間的分隔符',
      'cu-breadcrumb-current': '當前頁面，粗體前景色',
    },
  },
};
