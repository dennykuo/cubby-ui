import type { Locale } from '../../index';

export const dataTablePage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Data Table — Cubby UI',
    description: 'An enhanced table with toolbar filtering, row selection, and sortable column headers. Built on top of the existing Table component.',
    category: 'Data Display',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Wrap the table in <code class="cu-code">cu-data-table</code>. Add <code class="cu-code">cu-data-table-toolbar</code> for a search/filter bar above the table, <code class="cu-code">cu-data-table-head-sortable</code> on sortable column headers, and <code class="cu-code">cu-data-table-info</code> for a selection summary below. Row selection uses <code class="cu-code">cu-checkbox</code> with <code class="cu-code">data-cu-data-table-select</code>.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
    },
    classDescriptions: {
      'cu-data-table': 'Data table container',
      'cu-data-table-toolbar': 'Toolbar (search, filter, etc.)',
      'cu-data-table-head-sortable': 'Sortable header column',
      'cu-data-table-head-sorted-asc': 'Ascending sort state',
      'cu-data-table-head-sorted-desc': 'Descending sort state',
      'cu-data-table-row-selected': 'Selected row',
      'cu-data-table-info': 'Footer info bar (selection count, pagination, etc.)',
    },
  },
  'zh-tw': {
    title: 'Data Table — Cubby UI',
    description: '增強型表格，具備工具列篩選、列選取和可排序欄位標頭功能。建構於現有 Table 元件之上。',
    category: '資料展示',
    sections: {
      usage: {
        title: '使用方式',
        description: '以 <code class="cu-code">cu-data-table</code> 包裹表格。使用 <code class="cu-code">cu-data-table-toolbar</code> 在表格上方加入搜尋 / 篩選列，在可排序欄位標頭加上 <code class="cu-code">cu-data-table-head-sortable</code>，以及使用 <code class="cu-code">cu-data-table-info</code> 在下方顯示選取摘要。列選取使用 <code class="cu-code">cu-checkbox</code> 搭配 <code class="cu-code">data-cu-data-table-select</code>。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
    },
    classDescriptions: {
      'cu-data-table': '資料表格容器',
      'cu-data-table-toolbar': '工具列（搜尋、篩選等）',
      'cu-data-table-head-sortable': '可排序的標頭欄位',
      'cu-data-table-head-sorted-asc': '升冪排序狀態',
      'cu-data-table-head-sorted-desc': '降冪排序狀態',
      'cu-data-table-row-selected': '已選取的列',
      'cu-data-table-info': '底部資訊列（選取數量、分頁等）',
    },
  },
};
