import type { Locale } from '../../index';

export const paginationPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withEllipsis: { title: string; description: string };
    withPrevNext: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Pagination — Cubby UI',
    description: 'Pagination with page navigation, previous and next controls.',
    category: 'Navigation',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Use <code class="cu-code">cu-pagination</code> on the list, <code class="cu-code">cu-pagination-item</code> for page links, and <code class="cu-code">cu-pagination-item-active</code> for the current page.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withEllipsis: {
        title: 'With Ellipsis',
        description: 'Use <code class="cu-code">cu-pagination-ellipsis</code> to indicate skipped pages.',
      },
      withPrevNext: {
        title: 'With Prev/Next',
        description: 'Add <code class="cu-code">cu-pagination-prev</code> and <code class="cu-code">cu-pagination-next</code> for navigation arrows.',
      },
    },
    classDescriptions: {
      'cu-pagination': 'Pagination container, horizontally centered',
      'cu-pagination-item': 'Page number button',
      'cu-pagination-item-active': 'Active state for current page',
      'cu-pagination-ellipsis': 'Ellipsis',
      'cu-pagination-prev': 'Previous page button',
      'cu-pagination-next': 'Next page button',
    },
  },
  'zh-tw': {
    title: 'Pagination — Cubby UI',
    description: '帶有頁碼導航、上一頁與下一頁控制的分頁元件。',
    category: '導航',
    sections: {
      usage: {
        title: '使用方式',
        description: '在列表上使用 <code class="cu-code">cu-pagination</code>，頁碼連結使用 <code class="cu-code">cu-pagination-item</code>，當前頁面使用 <code class="cu-code">cu-pagination-item-active</code>。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withEllipsis: {
        title: '帶省略號',
        description: '使用 <code class="cu-code">cu-pagination-ellipsis</code> 表示省略的頁碼。',
      },
      withPrevNext: {
        title: '帶上 / 下一頁',
        description: '加入 <code class="cu-code">cu-pagination-prev</code> 和 <code class="cu-code">cu-pagination-next</code> 以顯示導航箭頭。',
      },
    },
    classDescriptions: {
      'cu-pagination': '分頁容器，水平置中',
      'cu-pagination-item': '頁碼按鈕',
      'cu-pagination-item-active': '當前頁面的啟用狀態',
      'cu-pagination-ellipsis': '省略號',
      'cu-pagination-prev': '上一頁按鈕',
      'cu-pagination-next': '下一頁按鈕',
    },
  },
};
