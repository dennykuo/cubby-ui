import type { Locale } from '../../index';

export const skeletonPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    cardSkeleton: { title: string; description: string };
    shimmer: { title: string; description: string };
    tableSkeleton: { title: string; description: string };
    listSkeleton: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Skeleton — Cubby UI',
    description: 'Use to show a placeholder while content is loading.',
    category: 'Feedback',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Apply <code class="cu-code">cu-skeleton</code> to an empty element and set its dimensions with utility classes.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      cardSkeleton: {
        title: 'Card Skeleton',
        description: 'Combine multiple skeletons to mimic a card layout.',
      },
      shimmer: {
        title: 'Shimmer',
        description: 'Use <code class="cu-code">cu-skeleton-shimmer</code> for a sweeping light effect instead of the default pulse.',
      },
      tableSkeleton: {
        title: 'Table Skeleton',
        description: 'A skeleton layout mimicking a data table with header and rows, useful as a loading state for table views.',
      },
      listSkeleton: {
        title: 'List Skeleton',
        description: 'A skeleton layout for list items with avatar and text lines, common for feeds and contact lists.',
      },
    },
    classDescriptions: {
      'cu-skeleton': 'Skeleton default style with pulse animation',
      'cu-skeleton-shimmer': 'Skeleton shimmer animation variant',
      'cu-skeleton-circle': 'Circle shape (rounded-full)',
      'cu-skeleton-text': 'Text line shape (h-4, rounded)',
    },
  },
  'zh-tw': {
    title: 'Skeleton — Cubby UI',
    description: '在內容載入時顯示佔位元素。',
    category: '回饋',
    sections: {
      usage: {
        title: '使用方式',
        description: '將 <code class="cu-code">cu-skeleton</code> 套用至空元素，並以工具類別設定尺寸。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      cardSkeleton: {
        title: '卡片骨架',
        description: '組合多個骨架元素來模擬卡片佈局。',
      },
      shimmer: {
        title: '掃光效果',
        description: '使用 <code class="cu-code">cu-skeleton-shimmer</code> 產生掃光效果，取代預設的脈動動畫。',
      },
      tableSkeleton: {
        title: '表格骨架屏',
        description: '模擬資料表格的骨架佈局，包含表頭和行列，適用於表格視圖的載入狀態。',
      },
      listSkeleton: {
        title: '列表骨架屏',
        description: '帶頭像和文字行的列表項目骨架佈局，常見於動態消息和聯絡人列表。',
      },
    },
    classDescriptions: {
      'cu-skeleton': '骨架預設樣式，含脈動動畫',
      'cu-skeleton-shimmer': '骨架掃光動畫變體',
      'cu-skeleton-circle': '圓形（rounded-full）',
      'cu-skeleton-text': '文字行形狀（h-4、rounded）',
    },
  },
};
