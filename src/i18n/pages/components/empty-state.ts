import type { Locale } from '../../index';

export const emptyStatePage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    noResults: { title: string; description: string };
    withoutAction: { title: string; description: string };
    errorState: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Empty State — Cubby UI',
    description: 'A placeholder shown when there is no data to display, with optional call-to-action.',
    category: 'Feedback',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Compose an empty state using <code class="cu-code">cu-empty-state</code> as the container with <code class="cu-code">cu-empty-state-icon</code>, <code class="cu-code">cu-empty-state-title</code>, <code class="cu-code">cu-empty-state-description</code>, and <code class="cu-code">cu-empty-state-action</code> sub-elements.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      noResults: {
        title: 'No Results',
        description: 'Use for search or filter results that return no matches.',
      },
      withoutAction: {
        title: 'Without Action',
        description: 'The action button is optional. Use a minimal empty state for informational messages.',
      },
      errorState: {
        title: 'Error State',
        description: 'Use a destructive color icon with a retry button to indicate a loading failure.',
      },
    },
    classDescriptions: {
      'cu-empty-state': 'Empty state base container with centered flex layout',
      'cu-empty-state-icon': 'Icon container with circular background',
      'cu-empty-state-title': 'Empty state title',
      'cu-empty-state-description': 'Empty state description',
      'cu-empty-state-action': 'Action button area',
    },
  },
  'zh-tw': {
    title: 'Empty State — Cubby UI',
    description: '當沒有資料可顯示時的佔位元件，可搭配選用的行動呼籲按鈕。',
    category: '回饋',
    sections: {
      usage: {
        title: '使用方式',
        description: '使用 <code class="cu-code">cu-empty-state</code> 作為容器，搭配 <code class="cu-code">cu-empty-state-icon</code>、<code class="cu-code">cu-empty-state-title</code>、<code class="cu-code">cu-empty-state-description</code> 和 <code class="cu-code">cu-empty-state-action</code> 子元素組合而成。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      noResults: {
        title: '無結果',
        description: '用於搜尋或篩選結果為空的情境。',
      },
      withoutAction: {
        title: '不含操作按鈕',
        description: '操作按鈕為選用。使用精簡的空狀態來顯示資訊性訊息。',
      },
      errorState: {
        title: '錯誤狀態',
        description: '使用危險色圖示搭配重試按鈕，表示載入失敗的情境。',
      },
    },
    classDescriptions: {
      'cu-empty-state': '空狀態基礎容器，含置中 flex 佈局',
      'cu-empty-state-icon': '圖示容器，含圓形背景',
      'cu-empty-state-title': '空狀態標題',
      'cu-empty-state-description': '空狀態描述',
      'cu-empty-state-action': '操作按鈕區域',
    },
  },
};
