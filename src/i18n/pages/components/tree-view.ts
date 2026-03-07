import type { Locale } from '../../index';

export const treeViewPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    fileExplorer: { title: string; description: string };
    defaultOpen: { title: string; description: string };
    activeState: { title: string; description: string };
    withCheckboxes: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Tree View — Cubby UI',
    description: 'A hierarchical tree structure with expandable/collapsible nodes, built with native <code class="cu-code">&lt;details&gt;</code> elements.',
    category: 'Data Display',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Use <code class="cu-code">cu-tree</code> as the root container, <code class="cu-code">cu-tree-item</code> on <code class="cu-code">&lt;details&gt;</code> for expandable nodes, <code class="cu-code">cu-tree-trigger</code> on <code class="cu-code">&lt;summary&gt;</code> for the node title, and <code class="cu-code">cu-tree-leaf</code> for leaf nodes.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      fileExplorer: {
        title: 'File Explorer',
        description: 'Combine folder and file icons with the tree structure for a file explorer pattern.',
      },
      defaultOpen: {
        title: 'Default Open',
        description: 'Add the <code class="cu-code">open</code> attribute to <code class="cu-code">&lt;details&gt;</code> elements to expand nodes by default.',
      },
      activeState: {
        title: 'Active / Selected State',
        description: 'Use <code class="cu-code">cu-tree-leaf-active</code> to highlight the currently selected leaf node, ideal for navigation tree views.',
      },
      withCheckboxes: {
        title: 'With Checkboxes',
        description: 'Combine with <code class="cu-code">cu-checkbox</code> for a selectable tree, useful for permission management or file selection.',
      },
    },
    classDescriptions: {
      'cu-tree': 'Tree view container',
      'cu-tree-item': 'Expandable tree node (<code class="cu-code">&lt;details&gt;</code> element)',
      'cu-tree-trigger': 'Node expand / collapse trigger (<code class="cu-code">&lt;summary&gt;</code> element)',
      'cu-tree-trigger-icon': 'Expand arrow icon, rotates 90\u00B0 when expanded',
      'cu-tree-content': 'Child node content area with left connector line',
      'cu-tree-leaf': 'Leaf node (non-expandable)',
      'cu-tree-leaf-active': 'Active / selected leaf node highlight',
    },
  },
  'zh-tw': {
    title: 'Tree View — Cubby UI',
    description: '階層式樹狀結構，具有可展開 / 收合的節點，使用原生 <code class="cu-code">&lt;details&gt;</code> 元素建構。',
    category: '資料展示',
    sections: {
      usage: {
        title: '使用方式',
        description: '以 <code class="cu-code">cu-tree</code> 作為根容器，在 <code class="cu-code">&lt;details&gt;</code> 加上 <code class="cu-code">cu-tree-item</code> 作為可展開節點，在 <code class="cu-code">&lt;summary&gt;</code> 加上 <code class="cu-code">cu-tree-trigger</code> 作為節點標題，使用 <code class="cu-code">cu-tree-leaf</code> 作為葉節點。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      fileExplorer: {
        title: '檔案總管',
        description: '結合資料夾和檔案圖示與樹狀結構，呈現檔案總管模式。',
      },
      defaultOpen: {
        title: '預設展開',
        description: '在 <code class="cu-code">&lt;details&gt;</code> 元素上加上 <code class="cu-code">open</code> 屬性，可讓節點預設展開。',
      },
      activeState: {
        title: '啟用 / 選取狀態',
        description: '使用 <code class="cu-code">cu-tree-leaf-active</code> 來高亮當前選取的葉節點，適合導航用途的樹狀檢視。',
      },
      withCheckboxes: {
        title: '搭配核取方塊',
        description: '結合 <code class="cu-code">cu-checkbox</code> 建立可勾選的樹，適用於權限管理或檔案選取。',
      },
    },
    classDescriptions: {
      'cu-tree': '樹狀檢視容器',
      'cu-tree-item': '可展開的樹節點（<code class="cu-code">&lt;details&gt;</code> 元素）',
      'cu-tree-trigger': '節點展開 / 收合觸發器（<code class="cu-code">&lt;summary&gt;</code> 元素）',
      'cu-tree-trigger-icon': '展開箭頭圖示，展開時旋轉 90\u00B0',
      'cu-tree-content': '子節點內容區域，帶左側連接線',
      'cu-tree-leaf': '葉節點（不可展開）',
      'cu-tree-leaf-active': '啟用 / 選取狀態的葉節點高亮',
    },
  },
};
