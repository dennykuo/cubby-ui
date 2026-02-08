import type { Locale } from './index';

/** 共用 UI 翻譯（Header、Sidebar、ComponentPreview、Layout） */
export const uiTranslations: Record<Locale, {
  // Header
  searchPlaceholder: string;
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
  forms: string;
  feedback: string;
  overlay: string;

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
    forms: 'Forms',
    feedback: 'Feedback',
    overlay: 'Overlay',

    copy: 'Copy',
    copied: 'Copied!',
    expandCode: 'Expand Code',
    collapseCode: 'Collapse Code',

    clickToCopy: 'Click to copy',
    copiedMessage: 'Copied!',
  },
  'zh-tw': {
    searchPlaceholder: '搜尋元件...',
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
    forms: '表單',
    feedback: '回饋',
    overlay: '浮層',

    copy: '複製',
    copied: '已複製！',
    expandCode: '展開程式碼',
    collapseCode: '收合程式碼',

    clickToCopy: '點擊複製',
    copiedMessage: '已複製！',
  },
};
