import type { Locale } from '../../index';

export const listsPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    ordered: { title: string; description: string };
    nested: { title: string; description: string };
    iconList: { title: string; description: string };
    bordered: { title: string; description: string };
    inline: { title: string; description: string };
    descriptionList: { title: string; description: string };
    horizontalDescriptionList: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Lists — Cubby UI',
    description: 'Styled lists with refined marker colors, spacing, and multiple layout variants including bordered, inline, and description lists.',
    category: 'Typography',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Apply <code class="cu-code">cu-list</code> as the base class, then add a variant class such as <code class="cu-code">cu-list-disc</code> for bullet-point lists. Markers are styled with a muted color for a subtle look.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      ordered: {
        title: 'Ordered',
        description: 'Use <code class="cu-code">cu-list cu-list-decimal</code> for numbered lists. Numbers use a medium font weight with muted color.',
      },
      nested: {
        title: 'Nested',
        description: 'Lists can be nested by adding another <code class="cu-code">cu-list</code> inside a list item. Spacing between levels is handled automatically.',
      },
      iconList: {
        title: 'Icon List',
        description: 'Use <code class="cu-code">cu-list cu-list-none</code> with inline SVG icons for check lists, feature lists, or any custom marker.',
      },
      bordered: {
        title: 'Bordered',
        description: 'Use <code class="cu-code">cu-list cu-list-bordered</code> for a clean divider-separated list. Ideal for settings panels, notification preferences, or any key-value layout.',
      },
      inline: {
        title: 'Inline',
        description: 'Use <code class="cu-code">cu-list cu-list-inline</code> for horizontal lists. Useful for footer links, tags, or breadcrumb-like navigation.',
      },
      descriptionList: {
        title: 'Description List',
        description: 'Use <code class="cu-code">cu-dl</code> with <code class="cu-code">cu-dl-item</code>, <code class="cu-code">cu-dl-term</code>, and <code class="cu-code">cu-dl-detail</code> for key-value pairs. Defaults to a vertical stacked layout.',
      },
      horizontalDescriptionList: {
        title: 'Horizontal Description List',
        description: 'Add <code class="cu-code">cu-dl-horizontal</code> to render terms and details side by side. The term column has a fixed width for alignment.',
      },
    },
    classDescriptions: {
      'cu-list': 'Base list style with consistent indentation and spacing',
      'cu-list-disc': 'Unordered list with disc markers',
      'cu-list-decimal': 'Ordered list with decimal markers',
      'cu-list-none': 'No-marker list, suitable for icon lists',
      'cu-list-bordered': 'Divided list with border separators between items',
      'cu-list-inline': 'Horizontal list',
      'cu-dl': 'Description list container',
      'cu-dl-item': 'Description list item',
      'cu-dl-term': 'Description list term (title)',
      'cu-dl-detail': 'Description list detail (content)',
      'cu-dl-horizontal': 'Horizontal description list with term and detail side by side',
    },
  },
  'zh-tw': {
    title: 'Lists — Cubby UI',
    description: '帶有精緻標記色彩、間距的列表樣式，包含邊框、行內和描述列表等多種佈局變體。',
    category: '排版',
    sections: {
      usage: {
        title: '使用方式',
        description: '將 <code class="cu-code">cu-list</code> 作為基礎類別，再加上變體類別如 <code class="cu-code">cu-list-disc</code> 來建立項目符號列表。標記使用柔和色彩呈現。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      ordered: {
        title: '有序列表',
        description: '使用 <code class="cu-code">cu-list cu-list-decimal</code> 建立編號列表。數字使用中等字重搭配柔和色彩。',
      },
      nested: {
        title: '巢狀列表',
        description: '在列表項目內加入另一個 <code class="cu-code">cu-list</code> 即可建立巢狀列表。層級間距會自動處理。',
      },
      iconList: {
        title: '圖示列表',
        description: '使用 <code class="cu-code">cu-list cu-list-none</code> 搭配行內 SVG 圖示，適用於勾選清單、功能列表或任何自訂標記。',
      },
      bordered: {
        title: '邊框列表',
        description: '使用 <code class="cu-code">cu-list cu-list-bordered</code> 建立乾淨的分隔線列表。適合設定面板、通知偏好或任何鍵值佈局。',
      },
      inline: {
        title: '行內列表',
        description: '使用 <code class="cu-code">cu-list cu-list-inline</code> 建立水平列表。適合頁尾連結、標籤或類似麵包屑的導航。',
      },
      descriptionList: {
        title: '描述列表',
        description: '使用 <code class="cu-code">cu-dl</code> 搭配 <code class="cu-code">cu-dl-item</code>、<code class="cu-code">cu-dl-term</code> 和 <code class="cu-code">cu-dl-detail</code> 建立鍵值配對。預設為垂直堆疊佈局。',
      },
      horizontalDescriptionList: {
        title: '水平描述列表',
        description: '加入 <code class="cu-code">cu-dl-horizontal</code> 使標題和內容並排顯示。標題欄位具有固定寬度以對齊。',
      },
    },
    classDescriptions: {
      'cu-list': '基礎列表樣式，具有一致的縮排和間距',
      'cu-list-disc': '帶有圓點標記的無序列表',
      'cu-list-decimal': '帶有數字標記的有序列表',
      'cu-list-none': '無標記列表，適合圖示列表',
      'cu-list-bordered': '帶有邊框分隔線的列表',
      'cu-list-inline': '水平列表',
      'cu-dl': '描述列表容器',
      'cu-dl-item': '描述列表項目',
      'cu-dl-term': '描述列表術語（標題）',
      'cu-dl-detail': '描述列表內容（細節）',
      'cu-dl-horizontal': '水平描述列表，術語與內容並排顯示',
    },
  },
};
