import type { Locale } from '../../index';

export const tablePage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withFooter: { title: string; description: string };
    withToolbar: { title: string; description: string };
    withRowActions: { title: string; description: string };
    stickyHeader: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Table — Cubby UI',
    description: 'A responsive table component for displaying tabular data.',
    category: 'Data Display',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Wrap a <code class="cu-code">&lt;table&gt;</code> in <code class="cu-code">cu-table-wrapper</code> for horizontal scrolling. Use semantic table elements with the corresponding <code class="cu-code">cu-table-*</code> classes.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withFooter: {
        title: 'With Footer',
        description: 'Add a <code class="cu-code">cu-table-footer</code> for summary rows and <code class="cu-code">cu-table-caption</code> for a description.',
      },
      withToolbar: {
        title: 'With Toolbar',
        description: 'Add a <code class="cu-code">cu-table-toolbar</code> for batch selection and actions. Use <code class="cu-code">cu-table-toolbar-select</code> for the selection indicator and <code class="cu-code">cu-table-toolbar-actions</code> for action buttons.',
      },
      withRowActions: {
        title: 'With Row Actions',
        description: 'Add <code class="cu-code">cu-table-actions</code> to a cell for row-level action buttons.',
      },
      stickyHeader: {
        title: 'Sticky Header',
        description: 'Add <code class="cu-code">cu-table-header-sticky</code> to the <code class="cu-code">&lt;thead&gt;</code> to keep column headers visible while scrolling. The table wrapper needs a fixed height and <code class="cu-code">overflow-y: auto</code>.',
      },
    },
    classDescriptions: {
      'cu-table-wrapper': 'Table outer container with horizontal scroll',
      'cu-table': 'Table element',
      'cu-table-header': 'Table header area (<code class="cu-code">&lt;thead&gt;</code>)',
      'cu-table-body': 'Table body area (<code class="cu-code">&lt;tbody&gt;</code>)',
      'cu-table-footer': 'Table footer area (<code class="cu-code">&lt;tfoot&gt;</code>)',
      'cu-table-row': 'Table row with hover highlight',
      'cu-table-head': 'Table header cell (<code class="cu-code">&lt;th&gt;</code>)',
      'cu-table-cell': 'Table data cell (<code class="cu-code">&lt;td&gt;</code>)',
      'cu-table-caption': 'Table caption',
      'cu-table-header-sticky': 'Sticky header, keeps <code class="cu-code">&lt;th&gt;</code> fixed at top while scrolling',
      'cu-table-toolbar': 'Toolbar container for batch actions',
      'cu-table-toolbar-select': 'Select all area in toolbar',
      'cu-table-toolbar-actions': 'Actions area in toolbar',
      'cu-table-actions': 'Row actions container',
    },
  },
  'zh-tw': {
    title: 'Table — Cubby UI',
    description: '響應式表格元件，用於顯示表格式資料。',
    category: '資料展示',
    sections: {
      usage: {
        title: '使用方式',
        description: '以 <code class="cu-code">cu-table-wrapper</code> 包裹 <code class="cu-code">&lt;table&gt;</code> 以支援水平捲動。使用語意化表格元素搭配對應的 <code class="cu-code">cu-table-*</code> 類別。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withFooter: {
        title: '搭配頁尾',
        description: '加上 <code class="cu-code">cu-table-footer</code> 作為摘要列，以及 <code class="cu-code">cu-table-caption</code> 作為描述。',
      },
      withToolbar: {
        title: '搭配工具列',
        description: '加上 <code class="cu-code">cu-table-toolbar</code> 以進行批次選取和操作。使用 <code class="cu-code">cu-table-toolbar-select</code> 作為選取指示器，<code class="cu-code">cu-table-toolbar-actions</code> 放置操作按鈕。',
      },
      withRowActions: {
        title: '搭配列操作',
        description: '在儲存格中加上 <code class="cu-code">cu-table-actions</code> 以放置列操作按鈕。',
      },
      stickyHeader: {
        title: '固定標頭',
        description: '在 <code class="cu-code">&lt;thead&gt;</code> 加上 <code class="cu-code">cu-table-header-sticky</code>，捲動時欄位標頭保持可見。表格外層容器需設定固定高度和 <code class="cu-code">overflow-y: auto</code>。',
      },
    },
    classDescriptions: {
      'cu-table-wrapper': '表格外層容器，支援水平捲動',
      'cu-table': '表格元素',
      'cu-table-header': '表格標頭區域（<code class="cu-code">&lt;thead&gt;</code>）',
      'cu-table-body': '表格主體區域（<code class="cu-code">&lt;tbody&gt;</code>）',
      'cu-table-footer': '表格頁尾區域（<code class="cu-code">&lt;tfoot&gt;</code>）',
      'cu-table-row': '表格列，帶懸停高亮',
      'cu-table-head': '表格標頭儲存格（<code class="cu-code">&lt;th&gt;</code>）',
      'cu-table-cell': '表格資料儲存格（<code class="cu-code">&lt;td&gt;</code>）',
      'cu-table-caption': '表格標題',
      'cu-table-header-sticky': '固定標頭，捲動時 <code class="cu-code">&lt;th&gt;</code> 保持在頂端',
      'cu-table-toolbar': '工具列容器，用於批次操作',
      'cu-table-toolbar-select': '工具列中的全選區域',
      'cu-table-toolbar-actions': '工具列中的操作區域',
      'cu-table-actions': '列操作容器',
    },
  },
};
