import type { Locale } from '../../index';

export const multiSelectPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withSearch: { title: string; description: string };
    debounce: { title: string; description: string };
    presetValues: { title: string; description: string };
    withFormGroup: { title: string; description: string };
    accessibility: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Multi Select — Cubby UI',
    description: 'A multi-selection dropdown with tag display, supporting search filtering and removal.',
    category: 'Forms',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Use <code class="cu-code">data-cu-multi-select</code> on the wrapper, <code class="cu-code">data-cu-multi-select-trigger</code> on the button, <code class="cu-code">data-cu-multi-select-content</code> on the dropdown, and <code class="cu-code">data-cu-multi-select-item</code> on each option. Selected items appear as removable tags in the trigger area.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withSearch: {
        title: 'With Search',
        description: 'Add a search input with <code class="cu-code">cu-multi-select-search</code> to filter options.',
      },
      debounce: {
        title: 'Search Debounce',
        description: 'By default the list filters on every keystroke. Add <code class="cu-code">data-cu-multi-select-debounce="300"</code> to the wrapper to filter only after typing pauses for that many milliseconds — useful for long lists, or when you load results remotely by listening to the <code class="cu-code">cu:multiselect:search</code> event (<code class="cu-code">event.detail.query</code>, fired only when the applied query changes). Clearing the query applies immediately, and arrow keys / Enter apply any pending filter first, so a stale result is never toggled.',
      },
      presetValues: {
        title: 'Preset Values',
        description: 'Pre-select items by adding <code class="cu-code">cu-multi-select-item-active</code> to them. The tags are rendered in the trigger automatically on initialization, so do not write them in the markup (a <code class="cu-code">&lt;button&gt;</code> nested inside the trigger button breaks HTML parsing).',
      },
      withFormGroup: {
        title: 'With Form Group',
        description: 'Pair the multi select with a Label and FormDescription for use in form layouts. Point the label\'s for attribute at the trigger\'s id so it becomes the trigger\'s accessible name.',
      },
      accessibility: {
        title: 'Accessibility',
        description: 'Uses the same WAI-ARIA combobox semantics as Combobox, and the listbox has <code class="cu-code">aria-multiselectable="true"</code>. The search input — or, without one, the trigger, which becomes <code class="cu-code">role="combobox"</code> — points <code class="cu-code">aria-activedescendant</code> at the highlighted option. A combobox is not named by its text, so name a trigger without a search input with <code class="cu-code">aria-label</code> or <code class="cu-code">&lt;label for&gt;</code> (see With Form Group). Each generated tag remove button is named "Remove {label}" (for example "Remove React") instead of the visual ×; set <code class="cu-code">data-cu-multi-select-remove-text</code> on the wrapper to translate it, where <code class="cu-code">{label}</code> is replaced with the item text, e.g. <code class="cu-code">data-cu-multi-select-remove-text="移除 {label}"</code>.',
      },
    },
    classDescriptions: {
      'cu-multi-select': 'Multi Select container, relatively positioned inline-block',
      'cu-multi-select-trigger': 'Trigger button with multi-line tag display',
      'cu-multi-select-tags': 'Flex wrap container for selected tags',
      'cu-multi-select-tag': 'Selected item tag style',
      'cu-multi-select-tag-remove': 'Remove button on tag',
      'cu-multi-select-placeholder': 'Placeholder text when nothing selected',
      'cu-multi-select-icon': 'Arrow icon on the right side of trigger',
      'cu-multi-select-content': 'Floating dropdown panel with rounded corners and shadow',
      'cu-multi-select-search': 'Search bar container with bottom border',
      'cu-multi-select-search-icon': 'Search icon in the search bar',
      'cu-multi-select-input': 'Search input with transparent background',
      'cu-multi-select-list': 'Options list container, scrollable (max height 200px)',
      'cu-multi-select-empty': 'Empty state text when no results found',
      'cu-multi-select-item': 'Option item with hover background and left check space',
      'cu-multi-select-item-active': 'Selected option item',
      'cu-multi-select-item-check': 'Check icon on the left side of option',
    },
  },
  'zh-tw': {
    title: 'Multi Select — Cubby UI',
    description: '多選下拉選單，以標籤顯示已選項目，支援搜尋過濾與移除。',
    category: '表單',
    sections: {
      usage: {
        title: '使用方式',
        description: '在外層容器使用 <code class="cu-code">data-cu-multi-select</code>，按鈕使用 <code class="cu-code">data-cu-multi-select-trigger</code>，下拉面板使用 <code class="cu-code">data-cu-multi-select-content</code>，每個選項使用 <code class="cu-code">data-cu-multi-select-item</code>。已選項目會以可移除的標籤顯示在觸發區域。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withSearch: {
        title: '帶搜尋',
        description: '加入 <code class="cu-code">cu-multi-select-search</code> 搜尋輸入框以過濾選項。',
      },
      debounce: {
        title: '搜尋 Debounce',
        description: '預設每次輸入都會立即過濾。在外層容器加上 <code class="cu-code">data-cu-multi-select-debounce="300"</code>，會在停止輸入指定毫秒數後才過濾，適合長清單，或監聽 <code class="cu-code">cu:multiselect:search</code> 事件（<code class="cu-code">event.detail.query</code>，僅在實際套用的查詢改變時觸發）自行串接遠端搜尋。清空查詢會立即生效；方向鍵與 Enter 會先套用待執行的過濾，不會切換到過期的結果。',
      },
      presetValues: {
        title: '預設值',
        description: '在項目上加入 <code class="cu-code">cu-multi-select-item-active</code> 即可預選。標籤會在初始化時自動渲染到觸發區域，不需要寫在標記中（在觸發按鈕內巢狀 <code class="cu-code">&lt;button&gt;</code> 會破壞 HTML 解析）。',
      },
      withFormGroup: {
        title: '搭配表單群組',
        description: '將 multi select 與 Label 和 FormDescription 搭配，用於表單佈局。以 label 的 for 屬性指向 trigger 的 id，label 文字即成為 trigger 的無障礙名稱。',
      },
      accessibility: {
        title: '無障礙',
        description: '與 Combobox 相同的 WAI-ARIA combobox 語意，listbox 另帶 <code class="cu-code">aria-multiselectable="true"</code>。搜尋框（沒有搜尋框時為 trigger，會改為 <code class="cu-code">role="combobox"</code>）以 <code class="cu-code">aria-activedescendant</code> 指向高亮選項。combobox 不以文字內容命名，沒有搜尋框的 trigger 請以 <code class="cu-code">aria-label</code> 或 <code class="cu-code">&lt;label for&gt;</code> 命名（見「搭配表單群組」）。JS 產生的標籤移除按鈕以「Remove {label}」（例如「Remove React」）命名，取代視覺上的 ×；在外層容器設定 <code class="cu-code">data-cu-multi-select-remove-text</code> 即可翻譯，<code class="cu-code">{label}</code> 會替換為項目文字，例如 <code class="cu-code">data-cu-multi-select-remove-text="移除 {label}"</code>。',
      },
    },
    classDescriptions: {
      'cu-multi-select': 'Multi Select 容器，相對定位的行內區塊',
      'cu-multi-select-trigger': '觸發按鈕，含多行標籤顯示',
      'cu-multi-select-tags': '已選標籤的 Flex wrap 容器',
      'cu-multi-select-tag': '已選項目的標籤樣式',
      'cu-multi-select-tag-remove': '標籤上的移除按鈕',
      'cu-multi-select-placeholder': '未選取任何項目時的佔位文字',
      'cu-multi-select-icon': '觸發按鈕右側的箭頭圖示',
      'cu-multi-select-content': '浮動下拉面板，含圓角與陰影',
      'cu-multi-select-search': '搜尋列容器，含底部邊框',
      'cu-multi-select-search-icon': '搜尋列中的搜尋圖示',
      'cu-multi-select-input': '搜尋輸入框，透明背景',
      'cu-multi-select-list': '選項列表容器，可捲動（最大高度 200px）',
      'cu-multi-select-empty': '無結果時的空狀態文字',
      'cu-multi-select-item': '選項項目，含 hover 背景與左側勾選空間',
      'cu-multi-select-item-active': '已選取的選項項目',
      'cu-multi-select-item-check': '選項左側的勾選圖示',
    },
  },
};
