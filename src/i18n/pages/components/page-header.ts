import type { Locale } from '../../index';

export const pageHeaderPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withBreadcrumb: { title: string; description: string };
    withBadge: { title: string; description: string };
    iconActions: { title: string; description: string };
    minimal: { title: string; description: string };
    backButton: { title: string; description: string };
    withTabs: { title: string; description: string };
    bordered: { title: string; description: string };
    centered: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Page Header — Cubby UI',
    description: 'A consistent header layout for dashboard pages with title, description, and action buttons.',
    category: 'Layouts',
    sections: {
      usage: {
        title: 'Usage',
        description: 'The page header component provides a responsive layout that stacks vertically on mobile and aligns horizontally on larger screens.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withBreadcrumb: {
        title: 'With Breadcrumb',
        description: 'Pair with a breadcrumb navigation above the header to provide hierarchical context on detail or edit pages.',
      },
      withBadge: {
        title: 'With Badge',
        description: 'Include a badge alongside the title to display counts, statuses, or other contextual metadata.',
      },
      iconActions: {
        title: 'Icon Actions',
        description: 'Use icon-only buttons for a compact action area when the actions are self-explanatory.',
      },
      minimal: {
        title: 'Minimal',
        description: 'For pages without actions, use only the content section.',
      },
      backButton: {
        title: 'Back Button',
        description: 'A common pattern for detail or edit pages — place a ghost icon button before the title to let users navigate back.',
      },
      withTabs: {
        title: 'With Tabs',
        description: 'Pair with tabs for settings or multi-section pages.',
      },
      bordered: {
        title: 'Bordered',
        description: 'Add a bottom border to visually separate the header from the page content — ideal for dashboard layouts.',
      },
      centered: {
        title: 'Centered',
        description: 'Center-align the header content for marketing, landing, or content-focused pages.',
      },
    },
    classDescriptions: {
      'cu-page-header': 'Page header container (responsive flex)',
      'cu-page-header-content': 'Title and description wrapper',
      'cu-page-header-title': 'Page title (2xl, bold)',
      'cu-page-header-description': 'Page description text',
      'cu-page-header-actions': 'Action buttons container',
      'cu-page-header-bordered': 'Bottom border variant (opt-in)',
      'cu-page-header-centered': 'Center-aligned variant (opt-in)',
    },
  },
  'zh-tw': {
    title: 'Page Header — Cubby UI',
    description: '適用於儀表板頁面的統一標頭佈局，包含標題、描述和操作按鈕。',
    category: '佈局',
    sections: {
      usage: {
        title: '使用方式',
        description: '頁面標頭元件提供響應式佈局，在行動裝置上垂直堆疊，在較大螢幕上水平對齊。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withBreadcrumb: {
        title: '搭配麵包屑',
        description: '在標頭上方搭配麵包屑導航，為詳情或編輯頁面提供層級脈絡。',
      },
      withBadge: {
        title: '搭配徽章',
        description: '在標題旁加入徽章以顯示數量、狀態或其他上下文資訊。',
      },
      iconActions: {
        title: '圖示操作',
        description: '當操作含義明確時，使用純圖示按鈕呈現精簡的操作區域。',
      },
      minimal: {
        title: '精簡版',
        description: '不需要操作按鈕的頁面，僅使用內容區塊即可。',
      },
      backButton: {
        title: '返回按鈕',
        description: '詳情頁或編輯頁的常見模式——在標題左側放置一個 ghost 圖示按鈕，讓使用者可以導航返回。',
      },
      withTabs: {
        title: '搭配分頁標籤',
        description: '搭配分頁標籤，適用於設定頁或多區塊頁面。',
      },
      bordered: {
        title: '底部分隔線',
        description: '加入底部邊框，將標頭與頁面內容做視覺區隔——適合儀表板佈局。',
      },
      centered: {
        title: '置中',
        description: '將標頭內容置中對齊，適合行銷頁、著陸頁或內容導向頁面。',
      },
    },
    classDescriptions: {
      'cu-page-header': '頁面標頭容器（響應式 flex）',
      'cu-page-header-content': '標題和描述包裝器',
      'cu-page-header-title': '頁面標題（2xl、粗體）',
      'cu-page-header-description': '頁面描述文字',
      'cu-page-header-actions': '操作按鈕容器',
      'cu-page-header-bordered': '底部分隔線變體（opt-in）',
      'cu-page-header-centered': '置中對齊變體（opt-in）',
    },
  },
};
