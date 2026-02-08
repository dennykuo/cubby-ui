import type { Locale } from '../../index';

export const pageHeaderPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withIcons: { title: string; description: string };
    minimal: { title: string; description: string };
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
      withIcons: {
        title: 'With Icons',
        description: 'Action buttons can include icons for better visual clarity.',
      },
      minimal: {
        title: 'Minimal',
        description: 'For pages without actions, use only the content section.',
      },
    },
    classDescriptions: {
      'cu-page-header': 'Page header container (responsive flex)',
      'cu-page-header-content': 'Title and description wrapper',
      'cu-page-header-title': 'Page title (2xl, bold)',
      'cu-page-header-description': 'Page description text',
      'cu-page-header-actions': 'Action buttons container',
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
      withIcons: {
        title: '帶圖示',
        description: '操作按鈕可包含圖示以提升視覺清晰度。',
      },
      minimal: {
        title: '精簡版',
        description: '不需要操作按鈕的頁面，僅使用內容區塊即可。',
      },
    },
    classDescriptions: {
      'cu-page-header': '頁面標頭容器（響應式 flex）',
      'cu-page-header-content': '標題和描述包裝器',
      'cu-page-header-title': '頁面標題（2xl、粗體）',
      'cu-page-header-description': '頁面描述文字',
      'cu-page-header-actions': '操作按鈕容器',
    },
  },
};
