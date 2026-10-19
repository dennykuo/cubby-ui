import type { Locale } from "../../index";

export const ratingPage: Record<
  Locale,
  {
    title: string;
    description: string;
    category: string;
    sections: {
      usage: { title: string; description: string };
      classes: { title: string; classLabel: string; descriptionLabel: string };
      values: { title: string; description: string };
      halfStar: { title: string; description: string };
      sizes: { title: string; description: string };
      readonly: { title: string; description: string };
      interactive: { title: string; description: string };
      disabled: { title: string; description: string };
      accessibility: {
        title: string;
        description: string;
        keyLabel: string;
        actionLabel: string;
        keys: { key: string; action: string }[];
        names: string;
      };
    };
    classDescriptions: Record<string, string>;
  }
> = {
  en: {
    title: "Rating — Cubby UI",
    description: "Displays a star rating for reviews, feedback, or scoring.",
    category: "Forms",
    sections: {
      usage: {
        title: "Usage",
        description:
          'Use <code class="cu-code">cu-rating</code> with <code class="cu-code">cu-rating-item</code> spans. Add <code class="cu-code">cu-rating-item-active</code> to filled stars.',
      },
      classes: {
        title: "CSS Classes",
        classLabel: "Class",
        descriptionLabel: "Description",
      },
      values: {
        title: "Different Values",
        description: "Control the number of filled stars to represent different ratings.",
      },
      halfStar: {
        title: "Half Star",
        description:
          'Use <code class="cu-code">cu-rating-item-half</code> for half-star ratings with a CSS clip-path overlay.',
      },
      sizes: {
        title: "Sizes",
        description:
          'Use <code class="cu-code">cu-rating-sm</code> or <code class="cu-code">cu-rating-lg</code> for different sizes.',
      },
      readonly: {
        title: "Readonly",
        description:
          'Add <code class="cu-code">cu-rating-readonly</code> to display a non-interactive rating. On an interactive rating (<code class="cu-code">data-cu-rating</code>) the stars stop responding, stay focusable and are announced as read-only (<code class="cu-code">aria-readonly="true"</code>).',
      },
      interactive: {
        title: "Interactive",
        description:
          'Add <code class="cu-code">data-cu-rating</code> and use <code class="cu-code">&lt;button type="button"&gt;</code> stars with <code class="cu-code">data-cu-rating-star</code>. Click a star, or Tab to the rating and use the arrow keys, <code class="cu-code">Home</code> / <code class="cu-code">End</code>, <code class="cu-code">Space</code> or <code class="cu-code">Enter</code>. The value is stored in <code class="cu-code">data-cu-rating-value</code> (<code class="cu-code">0</code> = none) and a <code class="cu-code">cu:rating:change</code> event (<code class="cu-code">{ value }</code>) fires whenever it changes. Name the rating with <code class="cu-code">aria-label</code> or <code class="cu-code">aria-labelledby</code>. To change the value from code, set the attribute (for example <code class="cu-code">el.setAttribute("data-cu-rating-value", "3")</code>): the stars, <code class="cu-code">aria-checked</code> and the Tab stop follow without firing the event.',
      },
      disabled: {
        title: "Disabled",
        description:
          'Add <code class="cu-code">cu-rating-disabled</code> to dim and disable the rating. On an interactive rating the stars also leave the Tab order and the group gets <code class="cu-code">aria-disabled="true"</code>. Both <code class="cu-code">cu-rating-disabled</code> and <code class="cu-code">cu-rating-readonly</code> can be added or removed at any time.',
      },
      accessibility: {
        title: "Accessibility",
        description:
          'Interactive ratings follow the WAI-ARIA APG Rating Radio Group example: cubby-ui.js gives the root <code class="cu-code">role="radiogroup"</code> and every star <code class="cu-code">role="radio"</code> with <code class="cu-code">aria-checked</code>, so a screen reader announces something like "3 stars, radio button, checked, 3 of 5". A radio group is used instead of a single <code class="cu-code">role="slider"</code> because every star stays its own click / touch target with its own name — touch screen reader users can swipe to a star and double-tap it, which needs no slider gestures — and a rating is a choice between a few discrete values. Only one star is in the Tab order (the checked star, or the first star when nothing is selected); the arrow keys move between stars and select them at the same time. In right-to-left layouts Arrow Left and Arrow Right are swapped.',
        keyLabel: "Key",
        actionLabel: "Action",
        keys: [
          {
            key: "Tab / Shift + Tab",
            action: "Moves focus into the rating (to the checked star, or the first star) and out of it",
          },
          { key: "Arrow Right / Arrow Down", action: "Selects the next star; from the last star wraps to the first" },
          { key: "Arrow Left / Arrow Up", action: "Selects the previous star; from the first star wraps to the last" },
          { key: "Home / End", action: "Selects the first / last star" },
          { key: "Space / Enter", action: "Selects the focused star" },
        ],
        names:
          'The group is named by your <code class="cu-code">aria-label</code> / <code class="cu-code">aria-labelledby</code> (default "Rating") and the stars are named "1 star", "2 stars"… Localize the star names with <code class="cu-code">data-cu-rating-star-text</code> on the root, where <code class="cu-code">{value}</code> is replaced with the star number, or give a single star its own <code class="cu-code">aria-label</code>, which is never overwritten. In forced colors mode (such as Windows High Contrast) selected stars use the <code class="cu-code">Highlight</code> system color and unselected stars are drawn as outlines, so the rating does not rely on color alone; the focused star gets a system-color outline.',
      },
    },
    classDescriptions: {
      "cu-rating": "Container for rating stars",
      "cu-rating-item": 'Individual star element (<button type="button"> in interactive ratings)',
      "cu-rating-item-active": "Filled/active star (amber color)",
      "cu-rating-item-half": "Half-filled star with clip-path overlay",
      "cu-rating-input": "Hidden radio input for form submission",
      "cu-rating-readonly": "Non-interactive display mode",
      "cu-rating-disabled": "Dimmed disabled state",
      "cu-rating-sm": "Small size (16px)",
      "cu-rating-lg": "Large size (28px)",
    },
  },
  "zh-tw": {
    title: "Rating 評分 — Cubby UI",
    description: "用於評論、回饋或評分的星星評分元件。",
    category: "Forms",
    sections: {
      usage: {
        title: "使用方式",
        description:
          '使用 <code class="cu-code">cu-rating</code> 搭配 <code class="cu-code">cu-rating-item</code> span 元素。在已填滿的星星加上 <code class="cu-code">cu-rating-item-active</code>。',
      },
      classes: {
        title: "CSS 類別",
        classLabel: "類別",
        descriptionLabel: "說明",
      },
      values: {
        title: "不同數值",
        description: "透過控制填滿的星星數量來表示不同的評分。",
      },
      halfStar: {
        title: "半星",
        description: '使用 <code class="cu-code">cu-rating-item-half</code> 搭配 CSS clip-path 覆蓋實現半星評分。',
      },
      sizes: {
        title: "尺寸",
        description:
          '使用 <code class="cu-code">cu-rating-sm</code> 或 <code class="cu-code">cu-rating-lg</code> 設定不同尺寸。',
      },
      readonly: {
        title: "唯讀",
        description:
          '加上 <code class="cu-code">cu-rating-readonly</code> 顯示不可互動的評分。用在互動式評分（<code class="cu-code">data-cu-rating</code>）時，星星不再回應操作，但仍可聚焦，並以唯讀狀態（<code class="cu-code">aria-readonly="true"</code>）播報。',
      },
      interactive: {
        title: "互動式",
        description:
          '加上 <code class="cu-code">data-cu-rating</code>，星星使用帶 <code class="cu-code">data-cu-rating-star</code> 的 <code class="cu-code">&lt;button type="button"&gt;</code>。可點擊星星，或用 Tab 移到評分後以方向鍵、<code class="cu-code">Home</code> / <code class="cu-code">End</code>、<code class="cu-code">Space</code> 或 <code class="cu-code">Enter</code> 操作。選取值存放在 <code class="cu-code">data-cu-rating-value</code>（<code class="cu-code">0</code> 為未選取），值改變時觸發 <code class="cu-code">cu:rating:change</code> 事件（<code class="cu-code">{ value }</code>）。請以 <code class="cu-code">aria-label</code> 或 <code class="cu-code">aria-labelledby</code> 為評分命名。要以程式改值時直接設定屬性（例如 <code class="cu-code">el.setAttribute("data-cu-rating-value", "3")</code>），星星外觀、<code class="cu-code">aria-checked</code> 與 Tab 停駐點會跟著同步，不會觸發事件。',
      },
      disabled: {
        title: "停用",
        description:
          '加上 <code class="cu-code">cu-rating-disabled</code> 使評分元件變暗並停用。用在互動式評分時，星星也會移出 Tab 順序，群組帶 <code class="cu-code">aria-disabled="true"</code>。<code class="cu-code">cu-rating-disabled</code> 與 <code class="cu-code">cu-rating-readonly</code> 都可以隨時加上或移除。',
      },
      accessibility: {
        title: "無障礙",
        description:
          '互動式評分遵循 WAI-ARIA APG 的 Rating Radio Group 範例：cubby-ui.js 為根元素加上 <code class="cu-code">role="radiogroup"</code>，每顆星為帶 <code class="cu-code">aria-checked</code> 的 <code class="cu-code">role="radio"</code>，螢幕閱讀器會播報類似「3 stars，選項按鈕，已勾選，第 3 個，共 5 個」。採用 radio group 而非單一 <code class="cu-code">role="slider"</code>，是因為每顆星仍是各自的點擊 / 觸控目標並有自己的名稱，觸控螢幕閱讀器使用者可直接滑到某顆星點兩下，不需要 slider 的調整手勢；評分本身也是在少數幾個離散值中擇一。Tab 順序中只有一顆星（選取的星，未選取時為第一顆），方向鍵在星星間移動並同時選取。由右至左排版時左右方向鍵對調。',
        keyLabel: "按鍵",
        actionLabel: "動作",
        keys: [
          { key: "Tab / Shift + Tab", action: "將焦點移入評分（選取的星，未選取時為第一顆）或移出" },
          { key: "Arrow Right / Arrow Down", action: "選取下一顆星；在最後一顆時回到第一顆" },
          { key: "Arrow Left / Arrow Up", action: "選取上一顆星；在第一顆時回到最後一顆" },
          { key: "Home / End", action: "選取第一顆 / 最後一顆星" },
          { key: "Space / Enter", action: "選取目前聚焦的星" },
        ],
        names:
          '群組名稱來自你設定的 <code class="cu-code">aria-label</code> / <code class="cu-code">aria-labelledby</code>（預設 "Rating"），星星名稱預設為 "1 star"、"2 stars"…。可在根元素以 <code class="cu-code">data-cu-rating-star-text</code> 在地化星星名稱，其中 <code class="cu-code">{value}</code> 會替換為星等；或為單顆星設定自己的 <code class="cu-code">aria-label</code>，JS 不會覆寫。在 forced colors 模式（例如 Windows 高對比）下，選取的星使用 <code class="cu-code">Highlight</code> 系統色、未選取的星改為空心外框，評分不只靠顏色區分；聚焦的星以系統色外框標示。',
      },
    },
    classDescriptions: {
      "cu-rating": "評分星星的容器",
      "cu-rating-item": '單個星星元素（互動式評分使用 <button type="button">）',
      "cu-rating-item-active": "填滿/啟用的星星（琥珀色）",
      "cu-rating-item-half": "半填滿的星星，使用 clip-path 覆蓋",
      "cu-rating-input": "用於表單提交的隱藏 radio input",
      "cu-rating-readonly": "不可互動的展示模式",
      "cu-rating-disabled": "變暗的停用狀態",
      "cu-rating-sm": "小尺寸（16px）",
      "cu-rating-lg": "大尺寸（28px）",
    },
  },
};
