import type { Locale } from './index';

/** 共用 UI 翻譯（Header、Sidebar、ComponentPreview、Layout） */
export const uiTranslations: Record<Locale, {
  // Header
  searchPlaceholder: string;
  searchLabel: string;
  searchInputPlaceholder: string;
  searchEmpty: string;
  toggleDarkMode: string;
  openMenu: string;
  closeMenu: string;

  // Language switcher
  switchLanguageLabel: string;

  // Sidebar sections
  gettingStarted: string;
  components: string;
  examples: string;

  // Sidebar groups
  layouts: string;
  basic: string;
  typography: string;
  navigation: string;
  dataDisplay: string;
  content: string;
  forms: string;
  feedback: string;
  overlay: string;
  ai: string;

  // ComponentPreview
  copy: string;
  copied: string;
  expandCode: string;
  collapseCode: string;

  // Layout — inline code copy
  clickToCopy: string;
  copiedMessage: string;
}> = {
  en: {
    searchPlaceholder: 'Search components...',
    searchLabel: 'Search documentation',
    searchInputPlaceholder: 'Search components, guides and examples...',
    searchEmpty: 'No results found.',
    toggleDarkMode: 'Toggle dark mode',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    switchLanguageLabel: 'Switch language',

    gettingStarted: 'Getting Started',
    components: 'Components',
    examples: 'Examples',

    layouts: 'Layouts',
    basic: 'Basic',
    typography: 'Typography',
    navigation: 'Navigation',
    dataDisplay: 'Data Display',
    content: 'Content',
    forms: 'Forms',
    feedback: 'Feedback',
    overlay: 'Overlay',
    ai: 'AI',

    copy: 'Copy',
    copied: 'Copied!',
    expandCode: 'Expand Code',
    collapseCode: 'Collapse Code',

    clickToCopy: 'Click to copy',
    copiedMessage: 'Copied!',
  },
  'zh-tw': {
    searchPlaceholder: '搜尋元件...',
    searchLabel: '搜尋文件',
    searchInputPlaceholder: '搜尋元件、指南與範例...',
    searchEmpty: '找不到符合的結果。',
    toggleDarkMode: '切換深色模式',
    openMenu: '開啟選單',
    closeMenu: '關閉選單',
    switchLanguageLabel: '切換語言',

    gettingStarted: '入門指南',
    components: '元件',
    examples: '範例',

    layouts: '佈局',
    basic: '基礎',
    typography: '排版',
    navigation: '導航',
    dataDisplay: '資料展示',
    content: '內容展示',
    forms: '表單',
    feedback: '回饋',
    overlay: '浮層',
    ai: 'AI',

    copy: '複製',
    copied: '已複製！',
    expandCode: '展開程式碼',
    collapseCode: '收合程式碼',

    clickToCopy: '點擊複製',
    copiedMessage: '已複製！',
  },
};
