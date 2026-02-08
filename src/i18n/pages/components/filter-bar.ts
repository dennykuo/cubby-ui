import type { Locale } from '../../index';

export const filterBarPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withDate: { title: string; description: string };
    simple: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Filter Bar — Cubby UI',
    description: 'A responsive filter bar combining search input and filter controls for data tables.',
    category: 'Layouts',
    sections: {
      usage: {
        title: 'Usage',
        description: 'The filter bar provides a card-like container with search and filter controls. It stacks vertically on mobile and aligns horizontally on larger screens.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withDate: {
        title: 'With Date Range',
        description: 'Combine with date range selectors for time-based filtering.',
      },
      simple: {
        title: 'Simple Search',
        description: 'For simple use cases, use only the search area without filters.',
      },
    },
    classDescriptions: {
      'cu-filter-bar': 'Filter bar container (card-like)',
      'cu-filter-bar-inner': 'Inner flex container (responsive)',
      'cu-filter-bar-search': 'Search input area (flex-1)',
      'cu-filter-bar-filters': 'Filter controls area',
    },
  },
  'zh-tw': {
    title: 'Filter Bar — Cubby UI',
    description: '結合搜尋輸入和篩選控制項的響應式篩選列，適用於資料表格。',
    category: '佈局',
    sections: {
      usage: {
        title: '使用方式',
        description: '篩選列提供一個類似卡片的容器，包含搜尋和篩選控制項。在行動裝置上垂直堆疊，在較大螢幕上水平對齊。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withDate: {
        title: '搭配日期範圍',
        description: '結合日期範圍選擇器進行時間篩選。',
      },
      simple: {
        title: '簡易搜尋',
        description: '簡單使用場景下，僅使用搜尋區域而不加篩選器。',
      },
    },
    classDescriptions: {
      'cu-filter-bar': '篩選列容器（卡片風格）',
      'cu-filter-bar-inner': '內部 flex 容器（響應式）',
      'cu-filter-bar-search': '搜尋輸入區域（flex-1）',
      'cu-filter-bar-filters': '篩選控制項區域',
    },
  },
};
