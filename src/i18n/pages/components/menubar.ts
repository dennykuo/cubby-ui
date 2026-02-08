import type { Locale } from '../../index';

export const menubarPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withLabels: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Menubar — Cubby UI',
    description: 'A visually persistent menu common in desktop applications that provides quick access to a consistent set of commands.',
    category: 'Navigation',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Use <code class="cu-code">cu-menubar</code> as the wrapper with <code class="cu-code">data-cu-menubar</code>. Each menu uses <code class="cu-code">cu-menubar-menu</code>, <code class="cu-code">cu-menubar-trigger</code>, and <code class="cu-code">cu-menubar-content</code>. Click a trigger to open; hover to switch between menus while one is open.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withLabels: {
        title: 'With Labels & Disabled Items',
        description: 'Use <code class="cu-code">cu-menubar-label</code> for section titles, <code class="cu-code">cu-menubar-item-inset</code> for indented items, and <code class="cu-code">cu-menubar-item-disabled</code> for disabled state.',
      },
    },
    classDescriptions: {
      'cu-menubar': 'Menubar container with border and rounded corners',
      'cu-menubar-menu': 'Positioning container for a single menu',
      'cu-menubar-trigger': 'Menu trigger button',
      'cu-menubar-content': 'Dropdown menu panel, absolutely positioned overlay',
      'cu-menubar-item': 'Menu item',
      'cu-menubar-item-disabled': 'Disabled menu item',
      'cu-menubar-item-inset': 'Indented menu item',
      'cu-menubar-label': 'Menu group label',
      'cu-menubar-separator': 'Separator between menu items',
      'cu-menubar-shortcut': 'Keyboard shortcut hint, right-aligned',
    },
  },
  'zh-tw': {
    title: 'Menubar — Cubby UI',
    description: '桌面應用程式中常見的持久性選單，提供快速存取一組固定指令。',
    category: '導航',
    sections: {
      usage: {
        title: '使用方式',
        description: '使用 <code class="cu-code">cu-menubar</code> 作為外層容器，搭配 <code class="cu-code">data-cu-menubar</code>。每個選單使用 <code class="cu-code">cu-menubar-menu</code>、<code class="cu-code">cu-menubar-trigger</code> 和 <code class="cu-code">cu-menubar-content</code>。點擊觸發器開啟選單；當選單已開啟時，滑過可切換不同選單。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withLabels: {
        title: '帶標籤與停用項目',
        description: '使用 <code class="cu-code">cu-menubar-label</code> 作為區段標題，<code class="cu-code">cu-menubar-item-inset</code> 用於縮排項目，<code class="cu-code">cu-menubar-item-disabled</code> 用於停用狀態。',
      },
    },
    classDescriptions: {
      'cu-menubar': '選單列容器，帶邊框與圓角',
      'cu-menubar-menu': '單一選單的定位容器',
      'cu-menubar-trigger': '選單觸發按鈕',
      'cu-menubar-content': '下拉選單面板，絕對定位浮層',
      'cu-menubar-item': '選單項目',
      'cu-menubar-item-disabled': '停用的選單項目',
      'cu-menubar-item-inset': '縮排的選單項目',
      'cu-menubar-label': '選單群組標籤',
      'cu-menubar-separator': '選單項目之間的分隔線',
      'cu-menubar-shortcut': '鍵盤快捷鍵提示，靠右對齊',
    },
  },
};
