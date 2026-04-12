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
    responsive: { title: string; description: string };
    emptyState: { title: string; description: string };
    loading: { title: string; description: string };
    expandableRows: { title: string; description: string };
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
      responsive: {
        title: 'Responsive (Stacked)',
        description: 'Add <code class="cu-code">cu-table-stacked</code> to the table wrapper. On mobile (&le;640px), rows become stacked cards with column labels via <code class="cu-code">data-label</code> attributes on each <code class="cu-code">&lt;td&gt;</code>.',
      },
      emptyState: {
        title: 'Empty State',
        description: 'Display a meaningful empty state when the table has no data. Embed the Empty State component inside a full-width table cell.',
      },
      loading: {
        title: 'Loading Skeleton',
        description: 'Use skeleton placeholders to indicate data is being loaded.',
      },
      expandableRows: {
        title: 'Expandable Rows',
        description: 'Add <code class="cu-code">data-cu-data-table-expandable</code> to the table wrapper and <code class="cu-code">data-cu-expand-row</code> on expand trigger buttons. Each expandable row is followed by a hidden row containing the expanded content.',
      },
    },
    classDescriptions: {
      'cu-data-table': 'Data table container',
      'cu-data-table-check': 'Checkbox column cell (centered, narrow width)',
      'cu-data-table-toolbar': 'Toolbar (search, filter, etc.)',
      'cu-data-table-head-sortable': 'Sortable header column',
      'cu-data-table-head-sorted-asc': 'Ascending sort state',
      'cu-data-table-head-sorted-desc': 'Descending sort state',
      'cu-data-table-row-selected': 'Selected row',
      'cu-data-table-striped': 'Alternating row backgrounds',
      'cu-data-table-info': 'Footer info bar (selection count, pagination, etc.)',
      'cu-table-stacked': 'Mobile stacked card layout (≤640px)',
      'cu-data-table-expand-trigger': 'Expand/collapse trigger button for rows',
      'cu-data-table-expanded-row': 'Active state for parent row when expanded',
      'cu-data-table-expanded-content': 'Content area inside expanded row',
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
      responsive: {
        title: '響應式（堆疊）',
        description: '在表格包裝器加上 <code class="cu-code">cu-table-stacked</code>。行動端（&le;640px）時列會轉換成堆疊卡片，透過每個 <code class="cu-code">&lt;td&gt;</code> 的 <code class="cu-code">data-label</code> 屬性顯示欄位名稱。',
      },
      emptyState: {
        title: '空狀態',
        description: '當表格無資料時顯示有意義的空狀態。在全寬表格儲存格中嵌入 Empty State 元件。',
      },
      loading: {
        title: '載入骨架',
        description: '使用骨架佔位符來指示資料正在載入中。',
      },
      expandableRows: {
        title: '可展開列',
        description: '在表格包裝器上加入 <code class="cu-code">data-cu-data-table-expandable</code>，並在展開觸發按鈕上加入 <code class="cu-code">data-cu-expand-row</code>。每個可展開列後面跟著一個隱藏列，包含展開的內容。',
      },
    },
    classDescriptions: {
      'cu-data-table': '資料表格容器',
      'cu-data-table-check': '核取方塊欄位儲存格（置中、窄寬度）',
      'cu-data-table-toolbar': '工具列（搜尋、篩選等）',
      'cu-data-table-head-sortable': '可排序的標頭欄位',
      'cu-data-table-head-sorted-asc': '升冪排序狀態',
      'cu-data-table-head-sorted-desc': '降冪排序狀態',
      'cu-data-table-row-selected': '已選取的列',
      'cu-data-table-striped': '交替列背景',
      'cu-data-table-info': '底部資訊列（選取數量、分頁等）',
      'cu-table-stacked': '行動端堆疊卡片佈局（≤640px）',
      'cu-data-table-expand-trigger': '列的展開/收合觸發按鈕',
      'cu-data-table-expanded-row': '展開時父列的啟用狀態',
      'cu-data-table-expanded-content': '展開列內的內容區域',
    },
  },
};
