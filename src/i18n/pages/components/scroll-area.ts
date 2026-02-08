import type { Locale } from '../../index';

export const scrollAreaPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    horizontal: { title: string; description: string };
    withTags: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Scroll Area — Cubby UI',
    description: 'A container with custom-styled scrollbars for consistent cross-browser appearance.',
    category: 'Layouts',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Apply <code class="cu-code">cu-scroll-area</code> to a container with a fixed height. The scrollbar is styled to be thin and subtle.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      horizontal: {
        title: 'Horizontal',
        description: 'Use <code class="cu-code">cu-scroll-area-horizontal</code> for horizontal scrolling with a fixed width.',
      },
      withTags: {
        title: 'With Tags',
        description: 'Combine with badges for a horizontally scrollable tag list.',
      },
    },
    classDescriptions: {
      'cu-scroll-area': 'Custom scrollbar container, vertical scroll',
      'cu-scroll-area-horizontal': 'Horizontal scroll modifier',
    },
  },
  'zh-tw': {
    title: 'Scroll Area — Cubby UI',
    description: '帶有自訂樣式捲軸的容器，確保跨瀏覽器一致的外觀。',
    category: '佈局',
    sections: {
      usage: {
        title: '使用方式',
        description: '將 <code class="cu-code">cu-scroll-area</code> 套用到固定高度的容器上。捲軸樣式為細窄且低調。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      horizontal: {
        title: '水平捲動',
        description: '使用 <code class="cu-code">cu-scroll-area-horizontal</code> 在固定寬度下進行水平捲動。',
      },
      withTags: {
        title: '搭配標籤',
        description: '結合徽章建立可水平捲動的標籤列表。',
      },
    },
    classDescriptions: {
      'cu-scroll-area': '自訂捲軸容器，垂直捲動',
      'cu-scroll-area-horizontal': '水平捲動修飾器',
    },
  },
};
