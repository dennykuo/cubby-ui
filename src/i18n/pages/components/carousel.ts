import type { Locale } from '../../index';

export const carouselPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    outsideNav: { title: string; description: string };
    cards: { title: string; description: string };
    dots: { title: string; description: string };
    multi: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Carousel — Cubby UI',
    description: 'A horizontal carousel component built with native CSS <code class="cu-code">scroll-snap</code>. Supports navigation arrows, dot indicators, mouse drag, and touch swipe.',
    category: 'Content',
    sections: {
      usage: {
        title: 'Usage',
        description: 'A basic image carousel with left/right navigation arrows. Uses <code class="cu-code">scroll-snap-type: x mandatory</code> for smooth snapping.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      outsideNav: {
        title: 'Outside Navigation',
        description: 'Use <code class="cu-code">cu-carousel-nav-outside</code> to place arrow buttons outside the carousel viewport. This is ideal for card carousels and content-heavy slides where arrows would overlap the content.',
      },
      cards: {
        title: 'Card Carousel',
        description: 'Carousel slides can contain any content, including cards. Add horizontal margin to the card for spacing between slides.',
      },
      dots: {
        title: 'With Dot Indicators',
        description: 'Add <code class="cu-code">cu-carousel-dots</code> with one <code class="cu-code">cu-carousel-dot</code> button per slide. The active dot updates automatically on scroll, and clicking a dot navigates to that slide.',
      },
      multi: {
        title: 'Multi-Visible',
        description: 'Use <code class="cu-code">cu-carousel-multi-3</code> (or <code class="cu-code">cu-carousel-multi-2</code>) to show multiple slides at once. The arrow buttons still advance one slide at a time.',
      },
    },
    classDescriptions: {
      'cu-carousel': 'Outer container with relative positioning',
      'cu-carousel-viewport': 'Scrollable flex container with scroll-snap',
      'cu-carousel-slide': 'Individual slide, full-width by default',
      'cu-carousel-prev': 'Previous arrow button, left-positioned',
      'cu-carousel-next': 'Next arrow button, right-positioned',
      'cu-carousel-dots': 'Dot indicator container',
      'cu-carousel-dot': 'Individual dot button',
      'cu-carousel-dot-active': 'Active dot state (primary color)',
      'cu-carousel-multi-2': 'Show 2 slides at a time',
      'cu-carousel-multi-3': 'Show 3 slides at a time',
      'cu-carousel-nav-outside': 'Place arrows outside the carousel viewport',
    },
  },
  'zh-tw': {
    title: 'Carousel — Cubby UI',
    description: '使用原生 CSS <code class="cu-code">scroll-snap</code> 建構的水平輪播元件。支援導航箭頭、圓點指示器、滑鼠拖曳和觸控滑動。',
    category: '內容展示',
    sections: {
      usage: {
        title: '使用方式',
        description: '基本的圖片輪播，附帶左右導航箭頭。使用 <code class="cu-code">scroll-snap-type: x mandatory</code> 實現平滑對齊。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      outsideNav: {
        title: '外側導航',
        description: '使用 <code class="cu-code">cu-carousel-nav-outside</code> 將箭頭按鈕放置在輪播區域外側。適用於卡片輪播和內容較多的幻燈片，避免箭頭遮擋內容。',
      },
      cards: {
        title: '卡片輪播',
        description: '輪播幻燈片可包含任何內容，包括卡片。為卡片加上水平 margin 以在幻燈片之間產生間距。',
      },
      dots: {
        title: '圓點指示器',
        description: '加入 <code class="cu-code">cu-carousel-dots</code>，並為每張幻燈片建立一個 <code class="cu-code">cu-carousel-dot</code> 按鈕。圓點會在捲動時自動更新啟用狀態，點擊圓點可跳轉至對應幻燈片。',
      },
      multi: {
        title: '多張可見',
        description: '使用 <code class="cu-code">cu-carousel-multi-3</code>（或 <code class="cu-code">cu-carousel-multi-2</code>）同時顯示多張幻燈片。箭頭按鈕仍然每次前進一張幻燈片。',
      },
    },
    classDescriptions: {
      'cu-carousel': '外層容器，帶有相對定位',
      'cu-carousel-viewport': '可捲動的 flex 容器，帶有 scroll-snap',
      'cu-carousel-slide': '單張幻燈片，預設全寬',
      'cu-carousel-prev': '上一張箭頭按鈕，靠左定位',
      'cu-carousel-next': '下一張箭頭按鈕，靠右定位',
      'cu-carousel-dots': '圓點指示器容器',
      'cu-carousel-dot': '單個圓點按鈕',
      'cu-carousel-dot-active': '啟用狀態的圓點（primary 色）',
      'cu-carousel-multi-2': '同時顯示 2 張幻燈片',
      'cu-carousel-multi-3': '同時顯示 3 張幻燈片',
      'cu-carousel-nav-outside': '將箭頭放置在輪播區域外側',
    },
  },
};
