import type { Locale } from '../../index';

export const commandPalettePage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withGroups: { title: string; description: string };
    withShortcuts: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Command Palette — Cubby UI',
    description: 'A global search and command panel triggered by <kbd class="cu-kbd">⌘</kbd><kbd class="cu-kbd">K</kbd> or a button. Features real-time filtering, keyboard navigation, and grouped results.',
    category: 'Overlay',
    sections: {
      usage: {
        title: 'Usage',
        description: 'The command palette uses a <code class="cu-code">&lt;dialog&gt;</code> element with <code class="cu-code">data-cu-command</code>. Open it with <code class="cu-code">data-cu-command-trigger</code> buttons or the global <kbd class="cu-kbd">⌘</kbd><kbd class="cu-kbd">K</kbd> shortcut. Items are filtered in real-time as you type.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withGroups: {
        title: 'With Groups',
        description: 'Use <code class="cu-code">cu-command-group</code> with <code class="cu-code">cu-command-group-heading</code> to organize items into sections. Add <code class="cu-code">cu-command-separator</code> between groups for visual separation. Groups are automatically hidden when all their items are filtered out.',
      },
      withShortcuts: {
        title: 'With Keyboard Shortcuts',
        description: 'Use <code class="cu-code">cu-command-shortcut</code> with <code class="cu-code">cu-kbd</code> elements to display keyboard shortcut hints on the right side of each item.',
      },
    },
    classDescriptions: {
      'cu-command': 'Dialog container (centered modal with backdrop)',
      'cu-command-input-wrapper': 'Search input area with icon and bottom border',
      'cu-command-input-icon': 'Search icon in the input area',
      'cu-command-input': 'Text input for searching/filtering',
      'cu-command-list': 'Scrollable results list container',
      'cu-command-group': 'Group wrapper for categorizing items',
      'cu-command-group-heading': 'Group heading label',
      'cu-command-item': 'Selectable command item with hover/active state',
      'cu-command-separator': 'Horizontal divider between groups',
      'cu-command-shortcut': 'Right-aligned shortcut hint container',
      'cu-command-empty': 'Empty state message when no items match',
    },
  },
  'zh-tw': {
    title: 'Command Palette — Cubby UI',
    description: '透過 <kbd class="cu-kbd">⌘</kbd><kbd class="cu-kbd">K</kbd> 或按鈕觸發的全域搜尋與指令面板。支援即時篩選、鍵盤導航和分組結果。',
    category: '浮層',
    sections: {
      usage: {
        title: '使用方式',
        description: 'Command Palette 使用 <code class="cu-code">&lt;dialog&gt;</code> 元素搭配 <code class="cu-code">data-cu-command</code>。透過 <code class="cu-code">data-cu-command-trigger</code> 按鈕或全域快捷鍵 <kbd class="cu-kbd">⌘</kbd><kbd class="cu-kbd">K</kbd> 開啟。輸入時會即時篩選項目。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withGroups: {
        title: '分組',
        description: '使用 <code class="cu-code">cu-command-group</code> 搭配 <code class="cu-code">cu-command-group-heading</code> 將項目組織為分類區塊。在群組之間加入 <code class="cu-code">cu-command-separator</code> 作為視覺分隔。當群組中所有項目都被篩選掉時，群組會自動隱藏。',
      },
      withShortcuts: {
        title: '鍵盤快捷鍵',
        description: '使用 <code class="cu-code">cu-command-shortcut</code> 搭配 <code class="cu-code">cu-kbd</code> 元素，在每個項目右側顯示鍵盤快捷鍵提示。',
      },
    },
    classDescriptions: {
      'cu-command': 'Dialog 容器（置中 modal 搭配背景遮罩）',
      'cu-command-input-wrapper': '搜尋輸入區域，含圖示與底部邊框',
      'cu-command-input-icon': '輸入區域的搜尋圖示',
      'cu-command-input': '搜尋/篩選用文字輸入框',
      'cu-command-list': '可捲動的結果列表容器',
      'cu-command-group': '項目分類群組包裝器',
      'cu-command-group-heading': '群組標題標籤',
      'cu-command-item': '可選取的指令項目，含 hover/active 狀態',
      'cu-command-separator': '群組之間的水平分隔線',
      'cu-command-shortcut': '右對齊的快捷鍵提示容器',
      'cu-command-empty': '無匹配項目時的空狀態訊息',
    },
  },
};
