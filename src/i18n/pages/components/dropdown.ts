import type { Locale } from '../../index';

export const dropdownPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withLabelsAndSeparators: { title: string; description: string };
    withIcons: { title: string; description: string };
    withShortcuts: { title: string; description: string };
    withDangerItem: { title: string; description: string };
    userMenu: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Dropdown Menu — Cubby UI',
    description: 'Displays a menu to the user — such as a set of actions or functions — triggered by a button.',
    category: 'Overlay',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Use <code class="cu-code">data-cu-dropdown</code> on the wrapper, <code class="cu-code">data-cu-dropdown-trigger</code> on the button, and <code class="cu-code">data-cu-dropdown-content</code> on the menu. The <code class="cu-code">&lt;script&gt;</code> handles click toggle, outside click, and Escape key.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withLabelsAndSeparators: {
        title: 'With Labels and Separators',
        description: 'Add <code class="cu-code">cu-dropdown-label</code> for section titles and <code class="cu-code">cu-dropdown-separator</code> for dividers.',
      },
      withIcons: {
        title: 'With Icons',
        description: 'Place an inline SVG before the label text. Use <code class="cu-code">mr-2 opacity-60</code> on icons for consistent spacing and subtlety.',
      },
      withShortcuts: {
        title: 'With Shortcuts',
        description: 'Use <code class="cu-code">cu-dropdown-shortcut</code> to display keyboard shortcuts aligned to the right. Add <code class="cu-code">cu-dropdown-content-wide</code> for extra width.',
      },
      withDangerItem: {
        title: 'With Danger Item',
        description: 'Use <code class="cu-code">cu-dropdown-item-danger</code> to highlight destructive actions in red.',
      },
      userMenu: {
        title: 'User Menu',
        description: 'Combine an avatar trigger with a profile header inside the dropdown for a complete user menu.',
      },
    },
    classDescriptions: {
      'cu-dropdown': 'Dropdown relatively positioned container',
      'cu-dropdown-content': 'Dropdown menu panel',
      'cu-dropdown-content-wide': 'Wide dropdown menu panel',
      'cu-dropdown-item': 'Menu item',
      'cu-dropdown-item-danger': 'Destructive action item (red)',
      'cu-dropdown-label': 'Menu group label',
      'cu-dropdown-separator': 'Menu separator',
      'cu-dropdown-shortcut': 'Keyboard shortcut hint',
    },
  },
  'zh-tw': {
    title: 'Dropdown Menu — Cubby UI',
    description: '向使用者顯示選單——例如一組操作或功能——由按鈕觸發。',
    category: '浮層',
    sections: {
      usage: {
        title: '使用方式',
        description: '在包裝元素上使用 <code class="cu-code">data-cu-dropdown</code>，在按鈕上使用 <code class="cu-code">data-cu-dropdown-trigger</code>，在選單上使用 <code class="cu-code">data-cu-dropdown-content</code>。<code class="cu-code">&lt;script&gt;</code> 處理點擊切換、外部點擊關閉和 Escape 鍵。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withLabelsAndSeparators: {
        title: '含標籤與分隔線',
        description: '使用 <code class="cu-code">cu-dropdown-label</code> 作為區段標題，<code class="cu-code">cu-dropdown-separator</code> 作為分隔線。',
      },
      withIcons: {
        title: '含圖示',
        description: '在標籤文字前放置行內 SVG。在圖示上使用 <code class="cu-code">mr-2 opacity-60</code> 以保持一致的間距與柔和感。',
      },
      withShortcuts: {
        title: '含快捷鍵',
        description: '使用 <code class="cu-code">cu-dropdown-shortcut</code> 顯示靠右對齊的鍵盤快捷鍵。加上 <code class="cu-code">cu-dropdown-content-wide</code> 以增加寬度。',
      },
      withDangerItem: {
        title: '含危險項目',
        description: '使用 <code class="cu-code">cu-dropdown-item-danger</code> 以紅色標示危險操作。',
      },
      userMenu: {
        title: '使用者選單',
        description: '結合頭像觸發器與下拉選單內的個人資料標頭，組成完整的使用者選單。',
      },
    },
    classDescriptions: {
      'cu-dropdown': 'Dropdown 相對定位容器',
      'cu-dropdown-content': '下拉選單面板',
      'cu-dropdown-content-wide': '寬版下拉選單面板',
      'cu-dropdown-item': '選單項目',
      'cu-dropdown-item-danger': '危險操作項目（紅色）',
      'cu-dropdown-label': '選單群組標籤',
      'cu-dropdown-separator': '選單分隔線',
      'cu-dropdown-shortcut': '鍵盤快捷鍵提示',
    },
  },
};
