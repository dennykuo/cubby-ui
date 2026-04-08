import type { Locale } from '../../index';

export const contextMenuPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withLabels: { title: string; description: string };
    withIcons: { title: string; description: string };
    withCheckbox: { title: string; description: string };
    withSubmenu: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Context Menu — Cubby UI',
    description: 'Displays a custom context menu at the cursor position when the user right-clicks within a designated area.',
    category: 'Overlay',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Wrap the trigger area and menu in <code class="cu-code">data-cu-context-menu</code>. The menu uses <code class="cu-code">cu-context-menu-content</code> for fixed positioning at the cursor. Menu items reuse <code class="cu-code">cu-dropdown-item</code> classes.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withLabels: {
        title: 'With Labels and Separators',
        description: 'Add <code class="cu-code">cu-dropdown-label</code> for section titles, <code class="cu-code">cu-dropdown-separator</code> for dividers, and <code class="cu-code">cu-dropdown-shortcut</code> for keyboard hints.',
      },
      withIcons: {
        title: 'With Icons',
        description: 'Place inline SVGs before the label text. Use <code class="cu-code">cu-dropdown-item-danger</code> for destructive actions.',
      },
      withCheckbox: {
        title: 'With Checkbox Items',
        description: 'Include checkable items in the context menu for toggling options like visibility or status.',
      },
      withSubmenu: {
        title: 'With Submenu',
        description: 'Nest a submenu inside a context menu item for hierarchical navigation of options.',
      },
    },
    classDescriptions: {
      'cu-context-menu': 'Trigger area container',
      'cu-context-menu-content': 'Fixed-position menu panel (appears at cursor)',
      'cu-dropdown-item': 'Menu item (reused from Dropdown)',
      'cu-dropdown-item-danger': 'Destructive action item (reused from Dropdown)',
      'cu-dropdown-label': 'Menu group label (reused from Dropdown)',
      'cu-dropdown-separator': 'Menu separator (reused from Dropdown)',
      'cu-dropdown-shortcut': 'Keyboard shortcut hint (reused from Dropdown)',
    },
  },
  'zh-tw': {
    title: 'Context Menu — Cubby UI',
    description: '當使用者在指定區域內按右鍵時，在游標位置顯示自訂右鍵選單。',
    category: '覆蓋層',
    sections: {
      usage: {
        title: '使用方式',
        description: '將觸發區域和選單包裹在 <code class="cu-code">data-cu-context-menu</code> 中。選單使用 <code class="cu-code">cu-context-menu-content</code> 以固定定位顯示於游標處。選單項目複用 <code class="cu-code">cu-dropdown-item</code> 類別。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withLabels: {
        title: '標籤與分隔線',
        description: '加入 <code class="cu-code">cu-dropdown-label</code> 作為分組標題、<code class="cu-code">cu-dropdown-separator</code> 作為分隔線、<code class="cu-code">cu-dropdown-shortcut</code> 作為鍵盤快捷鍵提示。',
      },
      withIcons: {
        title: '帶圖示',
        description: '在標籤文字前放置行內 SVG。使用 <code class="cu-code">cu-dropdown-item-danger</code> 標示具破壞性的操作。',
      },
      withCheckbox: {
        title: '帶核取項目',
        description: '在右鍵選單中加入可勾選項目，用於切換可見性或狀態等選項。',
      },
      withSubmenu: {
        title: '帶子選單',
        description: '在右鍵選單項目中巢狀子選單，實現選項的層級導航。',
      },
    },
    classDescriptions: {
      'cu-context-menu': '觸發區域容器',
      'cu-context-menu-content': '固定定位的選單面板（顯示於游標處）',
      'cu-dropdown-item': '選單項目（複用自 Dropdown）',
      'cu-dropdown-item-danger': '具破壞性的操作項目（複用自 Dropdown）',
      'cu-dropdown-label': '選單分組標籤（複用自 Dropdown）',
      'cu-dropdown-separator': '選單分隔線（複用自 Dropdown）',
      'cu-dropdown-shortcut': '鍵盤快捷鍵提示（複用自 Dropdown）',
    },
  },
};
