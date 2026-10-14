import type { Locale } from "../../index";

export const comboboxPage: Record<
  Locale,
  {
    title: string;
    description: string;
    category: string;
    sections: {
      usage: { title: string; description: string };
      classes: { title: string; classLabel: string; descriptionLabel: string };
      withIcons: { title: string; description: string };
      withFormGroup: { title: string; description: string };
      disabled: { title: string; description: string };
      grouped: { title: string; description: string };
      debounce: { title: string; description: string };
      accessibility: { title: string; description: string };
    };
    classDescriptions: Record<string, string>;
  }
> = {
  en: {
    title: "Combobox — Cubby UI",
    description: "A searchable dropdown for selecting a value from a list of options.",
    category: "Forms",
    sections: {
      usage: {
        title: "Usage",
        description:
          'Use <code class="cu-code">data-cu-combobox</code> on the wrapper, <code class="cu-code">data-cu-combobox-trigger</code> on the button, <code class="cu-code">data-cu-combobox-content</code> on the dropdown, and <code class="cu-code">data-cu-combobox-item</code> on each option. Use a <code class="cu-code">&lt;button type="button"&gt;</code> as the trigger. <code class="cu-code">cubby-ui.js</code> handles search filtering, selection, keyboard navigation, outside click, and the Escape key — no extra script needed.',
      },
      classes: {
        title: "CSS Classes",
        classLabel: "Class",
        descriptionLabel: "Description",
      },
      withIcons: {
        title: "With Icons",
        description:
          "Add inline SVG icons before option text to provide visual context, such as status indicators or category markers.",
      },
      withFormGroup: {
        title: "With Form Group",
        description: "Pair the combobox with a Label and FormDescription for use in form layouts.",
      },
      disabled: {
        title: "Disabled Items",
        description:
          'Add <code class="cu-code">opacity-50 pointer-events-none</code> and <code class="cu-code">aria-disabled="true"</code> to prevent selection of specific options.',
      },
      grouped: {
        title: "Grouped Options",
        description: "Use label elements to group related options for better organization.",
      },
      debounce: {
        title: "Search Debounce",
        description:
          'By default the list filters on every keystroke, which is the most responsive choice for in-page lists. Add <code class="cu-code">data-cu-combobox-debounce="300"</code> to the wrapper to filter only after typing pauses for that many milliseconds — useful for long lists, or when you load results remotely by listening to the <code class="cu-code">cu:combobox:search</code> event (<code class="cu-code">event.detail.query</code>, fired only when the applied query changes). Clearing the query applies immediately, and arrow keys / Enter apply any pending filter first, so a stale result is never selected.',
      },
      accessibility: {
        title: "Accessibility",
        description:
          'Follows the WAI-ARIA combobox pattern. The search input gets <code class="cu-code">role="combobox"</code>, <code class="cu-code">aria-controls</code> (the listbox), <code class="cu-code">aria-autocomplete="list"</code> and <code class="cu-code">aria-expanded="true"</code>. While you move with the arrow keys, <code class="cu-code">aria-activedescendant</code> points at the highlighted option (option ids are generated automatically), so screen readers announce it while focus stays in the input; it is cleared when the option is filtered out or the panel closes. Without a search input, the trigger itself becomes <code class="cu-code">role="combobox"</code> and owns <code class="cu-code">aria-activedescendant</code>. A combobox is not named by its text, so give that trigger an accessible name with <code class="cu-code">aria-label</code> or <code class="cu-code">&lt;label for&gt;</code>.',
      },
    },
    classDescriptions: {
      "cu-combobox": "Combobox container, relatively positioned inline-block",
      "cu-combobox-trigger": "Trigger button with border, rounded corners, and focus ring",
      "cu-combobox-trigger-placeholder": "Placeholder text in trigger button",
      "cu-combobox-trigger-icon": "Arrow icon on the right side of trigger",
      "cu-combobox-content": "Floating dropdown panel with rounded corners and shadow",
      "cu-combobox-search": "Search bar container with bottom border",
      "cu-combobox-search-icon": "Search icon in the search bar",
      "cu-combobox-input": "Search input with transparent background",
      "cu-combobox-list": "Options list container, scrollable (max height 200px)",
      "cu-combobox-empty": "Empty state text when no results found",
      "cu-combobox-item": "Option item with hover background",
      "cu-combobox-item-active": "Selected option item",
      "cu-combobox-item-check": "Check icon on the right side of option",
    },
  },
  "zh-tw": {
    title: "Combobox — Cubby UI",
    description: "可搜尋的下拉選單，用於從選項列表中選擇一個值。",
    category: "表單",
    sections: {
      usage: {
        title: "使用方式",
        description:
          '在外層容器使用 <code class="cu-code">data-cu-combobox</code>，按鈕使用 <code class="cu-code">data-cu-combobox-trigger</code>，下拉面板使用 <code class="cu-code">data-cu-combobox-content</code>，每個選項使用 <code class="cu-code">data-cu-combobox-item</code>。Trigger 請使用 <code class="cu-code">&lt;button type="button"&gt;</code>。<code class="cu-code">cubby-ui.js</code> 會處理搜尋過濾、選取、鍵盤導覽、外部點擊及 Escape 鍵，不需要額外撰寫 script。',
      },
      classes: {
        title: "CSS 類別",
        classLabel: "類別",
        descriptionLabel: "說明",
      },
      withIcons: {
        title: "搭配圖示",
        description: "在選項文字前加入 SVG 圖示以提供視覺上下文，例如狀態指示器或類別標記。",
      },
      withFormGroup: {
        title: "搭配表單群組",
        description: "將 combobox 與 Label 和 FormDescription 搭配，用於表單佈局。",
      },
      disabled: {
        title: "停用選項",
        description:
          '加入 <code class="cu-code">opacity-50 pointer-events-none</code> 和 <code class="cu-code">aria-disabled="true"</code> 以防止選取特定選項。',
      },
      grouped: {
        title: "分組選項",
        description: "使用標籤元素將相關選項分組，提供更好的組織結構。",
      },
      debounce: {
        title: "搜尋 Debounce",
        description:
          '預設每次輸入都會立即過濾，對頁面內的清單反應最快。在外層容器加上 <code class="cu-code">data-cu-combobox-debounce="300"</code>，會在停止輸入指定毫秒數後才過濾，適合長清單，或監聽 <code class="cu-code">cu:combobox:search</code> 事件（<code class="cu-code">event.detail.query</code>，僅在實際套用的查詢改變時觸發）自行串接遠端搜尋。清空查詢會立即生效；方向鍵與 Enter 會先套用待執行的過濾，不會選到過期的結果。',
      },
      accessibility: {
        title: "無障礙",
        description:
          '遵循 WAI-ARIA combobox 模式。搜尋框會加上 <code class="cu-code">role="combobox"</code>、指向 listbox 的 <code class="cu-code">aria-controls</code>、<code class="cu-code">aria-autocomplete="list"</code> 與 <code class="cu-code">aria-expanded="true"</code>。以方向鍵移動時，<code class="cu-code">aria-activedescendant</code> 會指向目前高亮的選項（選項 id 自動產生），焦點留在搜尋框，螢幕閱讀器仍會播報該選項；選項被過濾掉或面板關閉時清除。沒有搜尋框時，trigger 本身改為 <code class="cu-code">role="combobox"</code> 並持有 <code class="cu-code">aria-activedescendant</code>。combobox 不以文字內容命名，請以 <code class="cu-code">aria-label</code> 或 <code class="cu-code">&lt;label for&gt;</code> 為該 trigger 提供無障礙名稱。',
      },
    },
    classDescriptions: {
      "cu-combobox": "Combobox 容器，相對定位的行內區塊",
      "cu-combobox-trigger": "觸發按鈕，含邊框、圓角與焦點環",
      "cu-combobox-trigger-placeholder": "觸發按鈕中的佔位文字",
      "cu-combobox-trigger-icon": "觸發按鈕右側的箭頭圖示",
      "cu-combobox-content": "浮動下拉面板，含圓角與陰影",
      "cu-combobox-search": "搜尋列容器，含底部邊框",
      "cu-combobox-search-icon": "搜尋列中的搜尋圖示",
      "cu-combobox-input": "搜尋輸入框，透明背景",
      "cu-combobox-list": "選項列表容器，可捲動（最大高度 200px）",
      "cu-combobox-empty": "無結果時的空狀態文字",
      "cu-combobox-item": "選項項目，含 hover 背景",
      "cu-combobox-item-active": "已選取的選項項目",
      "cu-combobox-item-check": "選項右側的勾選圖示",
    },
  },
};
