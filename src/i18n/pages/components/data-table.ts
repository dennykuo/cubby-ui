import type { Locale } from '../../index';

export const dataTablePage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    columnSorting: { title: string; description: string };
    withPagination: { title: string; description: string };
    withRowActions: { title: string; description: string };
    stripedRows: { title: string; description: string };
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
      columnSorting: {
        title: 'Column Sorting',
        description: 'Click sortable column headers to toggle between ascending and descending order. Use <code class="cu-code">cu-data-table-head-sorted-asc</code> and <code class="cu-code">cu-data-table-head-sorted-desc</code> to indicate sort direction.',
      },
      withPagination: {
        title: 'With Pagination',
        description: 'Combine the data table with a Pagination component below for navigating large datasets.',
      },
      withRowActions: {
        title: 'With Row Actions',
        description: 'Add a Dropdown menu at the end of each row for contextual actions like edit, duplicate, or delete.',
      },
      stripedRows: {
        title: 'Striped Rows',
        description: 'Add <code class="cu-code">cu-data-table-striped</code> to the container for alternating row backgrounds, improving readability in dense tables.',
      },
    },
    classDescriptions: {
      'cu-data-table': 'Data table container',
      'cu-data-table-toolbar': 'Toolbar (search, filter, etc.)',
      'cu-data-table-head-sortable': 'Sortable header column',
      'cu-data-table-head-sorted-asc': 'Ascending sort state',
      'cu-data-table-head-sorted-desc': 'Descending sort state',
      'cu-data-table-row-selected': 'Selected row',
      'cu-data-table-striped': 'Alternating row backgrounds',
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
      columnSorting: {
        title: '欄位排序',
        description: '點擊可排序的欄位標頭可在升冪和降冪之間切換。使用 <code class="cu-code">cu-data-table-head-sorted-asc</code> 和 <code class="cu-code">cu-data-table-head-sorted-desc</code> 來指示排序方向。',
      },
      withPagination: {
        title: '搭配分頁',
        description: '在資料表格下方搭配 Pagination 元件，用於瀏覽大量資料集。',
      },
      withRowActions: {
        title: '搭配列操作',
        description: '在每列末端加入 Dropdown 選單，提供編輯、複製或刪除等情境操作。',
      },
      stripedRows: {
        title: '條紋列',
        description: '在容器加上 <code class="cu-code">cu-data-table-striped</code> 產生交替列背景，提升密集表格的可讀性。',
      },
    },
    classDescriptions: {
      'cu-data-table': '資料表格容器',
      'cu-data-table-toolbar': '工具列（搜尋、篩選等）',
      'cu-data-table-head-sortable': '可排序的標頭欄位',
      'cu-data-table-head-sorted-asc': '升冪排序狀態',
      'cu-data-table-head-sorted-desc': '降冪排序狀態',
      'cu-data-table-row-selected': '已選取的列',
      'cu-data-table-striped': '交替列背景',
      'cu-data-table-info': '底部資訊列（選取數量、分頁等）',
    },
  },
};
