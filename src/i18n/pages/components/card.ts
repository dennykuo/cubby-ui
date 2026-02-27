import type { Locale } from '../../index';

export const cardPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    outlined: { title: string; description: string };
    formCard: { title: string; description: string };
    notificationCard: { title: string; description: string };
    tableInCard: { title: string; description: string };
    profileCard: { title: string; description: string };
    hoverEffect: { title: string; description: string };
    metricCard: { title: string; description: string };
    pricingCards: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Card — Cubby UI',
    description: 'Displays a card with header, content, and footer.',
    category: 'Basic',
    sections: {
      usage: {
        title: 'Usage',
        description: 'A card is composed of <code class="cu-code">cu-card</code>, <code class="cu-code">cu-card-header</code>, <code class="cu-code">cu-card-content</code>, and <code class="cu-code">cu-card-footer</code>. Each part is optional.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      outlined: {
        title: 'Outlined',
        description: 'Add <code class="cu-code">cu-card-outlined</code> for a flat card with no shadow. Useful for dense layouts where shadow would add too much visual noise.',
      },
      formCard: {
        title: 'Form Card',
        description: 'Cards work well as containers for forms with actions in the footer.',
      },
      notificationCard: {
        title: 'Notification Card',
        description: 'Cards can contain lists of items with timestamps and a full-width action button.',
      },
      tableInCard: {
        title: 'Table in Card',
        description: 'Use <code class="cu-code">cu-card-content-flush</code> to remove the default padding when embedding a table. This is a common pattern for dashboard data grids.',
      },
      profileCard: {
        title: 'Profile Card',
        description: 'A centered profile card with avatar, stats grid, and action buttons.',
      },
      hoverEffect: {
        title: 'Hover Effect',
        description: 'Add <code class="cu-code">cu-card-hover</code> for an interactive shadow lift on hover. Ideal for feature grids and clickable cards.',
      },
      metricCard: {
        title: 'Metric Card',
        description: 'A minimal card without a footer — useful for dashboards and stats.',
      },
      pricingCards: {
        title: 'Pricing Cards',
        description: 'A pricing comparison grid. Highlight the recommended plan with a stronger border and shadow.',
      },
    },
    classDescriptions: {
      'cu-card': 'Base card',
      'cu-card-hover': 'Hover shadow effect (opt-in)',
      'cu-card-outlined': 'Flat card with no shadow',
      'cu-card-header': 'Card header',
      'cu-card-title': 'Card title',
      'cu-card-description': 'Card description',
      'cu-card-content': 'Card content area',
      'cu-card-content-flush': 'Flush content area (for table-in-card)',
      'cu-card-content-sm': 'Compact content padding',
      'cu-card-footer': 'Card footer',
      'cu-card-elevated': 'Higher shadow (shadow-md)',
    },
  },
  'zh-tw': {
    title: 'Card — Cubby UI',
    description: '顯示包含標頭、內容和頁尾的卡片。',
    category: '基礎',
    sections: {
      usage: {
        title: '使用方式',
        description: '卡片由 <code class="cu-code">cu-card</code>、<code class="cu-code">cu-card-header</code>、<code class="cu-code">cu-card-content</code> 和 <code class="cu-code">cu-card-footer</code> 組成。每個部分皆為選用。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      outlined: {
        title: 'Outlined',
        description: '加入 <code class="cu-code">cu-card-outlined</code> 以建立無陰影的扁平卡片。適用於陰影會造成過多視覺噪音的密集佈局。',
      },
      formCard: {
        title: '表單卡片',
        description: '卡片非常適合作為表單的容器，並在頁尾放置操作按鈕。',
      },
      notificationCard: {
        title: '通知卡片',
        description: '卡片可包含帶有時間戳記的項目列表和全寬操作按鈕。',
      },
      tableInCard: {
        title: '表格卡片',
        description: '使用 <code class="cu-code">cu-card-content-flush</code> 在嵌入表格時移除預設的內距。這是儀表板資料表格的常見模式。',
      },
      profileCard: {
        title: '個人檔案卡片',
        description: '包含頭像、統計數據網格和操作按鈕的置中個人檔案卡片。',
      },
      hoverEffect: {
        title: '懸停效果',
        description: '加入 <code class="cu-code">cu-card-hover</code> 使卡片在懸停時產生互動式陰影提升效果。適用於功能網格和可點擊的卡片。',
      },
      metricCard: {
        title: '指標卡片',
        description: '不含頁尾的簡約卡片 — 適用於儀表板和統計數據。',
      },
      pricingCards: {
        title: '定價卡片',
        description: '定價比較網格。使用更明顯的邊框和陰影突顯推薦方案。',
      },
    },
    classDescriptions: {
      'cu-card': '基礎卡片',
      'cu-card-hover': '懸停陰影效果（需主動啟用）',
      'cu-card-outlined': '無陰影的扁平卡片',
      'cu-card-header': '卡片標頭',
      'cu-card-title': '卡片標題',
      'cu-card-description': '卡片描述',
      'cu-card-content': '卡片內容區',
      'cu-card-content-flush': '無內距內容區（用於表格卡片）',
      'cu-card-content-sm': '緊湊內容內距',
      'cu-card-footer': '卡片頁尾',
      'cu-card-elevated': '更高陰影（shadow-md）',
    },
  },
};
