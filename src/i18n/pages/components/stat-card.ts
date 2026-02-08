import type { Locale } from '../../index';

export const statCardPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    dashboardGrid: { title: string; description: string };
    iconBox: { title: string; description: string };
    trendPill: { title: string; description: string };
    accentBorder: { title: string; description: string };
    withProgress: { title: string; description: string };
    hoverEffect: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Stat Card — Cubby UI',
    description: 'Displays key metrics with label, value, and optional trend indicator.',
    category: 'Data Display',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Use <code class="cu-code">cu-stat</code> as container, with <code class="cu-code">cu-stat-header</code>, <code class="cu-code">cu-stat-value</code>, and <code class="cu-code">cu-stat-description</code> sub-elements.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      dashboardGrid: {
        title: 'Dashboard Grid',
        description: 'Responsive grid layout for dashboard overview.',
      },
      iconBox: {
        title: 'Icon Box',
        description: 'Use <code class="cu-code">cu-stat-icon-box</code> to add a soft background to icons for better visual hierarchy. With color variants such as <code class="cu-code">cu-stat-icon-box-success</code>, <code class="cu-code">cu-stat-icon-box-warning</code>, <code class="cu-code">cu-stat-icon-box-destructive</code>.',
      },
      trendPill: {
        title: 'Trend Pill',
        description: 'Add <code class="cu-code">cu-stat-trend-pill</code> for pill-shaped trend background for quick identification.',
      },
      accentBorder: {
        title: 'Accent Border',
        description: 'Use <code class="cu-code">cu-stat-accent</code> to add a colored accent stripe on the left for category identification. With variants such as <code class="cu-code">cu-stat-accent-success</code>, <code class="cu-code">cu-stat-accent-warning</code>.',
      },
      withProgress: {
        title: 'With Progress',
        description: 'Use <code class="cu-code">cu-stat-footer</code> with progress bar, suitable for quota or goal completion.',
      },
      hoverEffect: {
        title: 'Hover Effect',
        description: 'Add <code class="cu-code">cu-stat-hover</code> to enable hover shadow elevation, suitable for clickable stat cards.',
      },
    },
    classDescriptions: {
      'cu-stat': 'Stat card container',
      'cu-stat-hover': 'Enable hover shadow effect',
      'cu-stat-header': 'Top area (label and icon)',
      'cu-stat-label': 'Stat name label',
      'cu-stat-icon': 'Small icon',
      'cu-stat-icon-box': 'Icon box container (primary color)',
      'cu-stat-icon-box-*': 'Icon box color variant, supports secondary / success / warning / destructive / info',
      'cu-stat-value': 'Primary value',
      'cu-stat-description': 'Description text',
      'cu-stat-trend': 'Trend indicator base style',
      'cu-stat-trend-up': 'Upward trend (green)',
      'cu-stat-trend-down': 'Downward trend (red)',
      'cu-stat-trend-pill': 'Trend pill style (with background color)',
      'cu-stat-footer': 'Footer area with top border',
      'cu-stat-accent': 'Left accent stripe (primary color)',
      'cu-stat-accent-*': 'Accent color variant, supports success / warning / destructive / info',
    },
  },
  'zh-tw': {
    title: 'Stat Card — Cubby UI',
    description: '顯示關鍵指標，包含標籤、數值和可選的趨勢指示器。',
    category: '資料展示',
    sections: {
      usage: {
        title: '使用方式',
        description: '以 <code class="cu-code">cu-stat</code> 作為容器，搭配 <code class="cu-code">cu-stat-header</code>、<code class="cu-code">cu-stat-value</code> 和 <code class="cu-code">cu-stat-description</code> 子元素。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      dashboardGrid: {
        title: '儀表板網格',
        description: '響應式網格佈局，適合儀表板總覽。',
      },
      iconBox: {
        title: '圖示方框',
        description: '使用 <code class="cu-code">cu-stat-icon-box</code> 為圖示加上柔和背景，增強視覺層次。支援顏色變體如 <code class="cu-code">cu-stat-icon-box-success</code>、<code class="cu-code">cu-stat-icon-box-warning</code>、<code class="cu-code">cu-stat-icon-box-destructive</code>。',
      },
      trendPill: {
        title: '趨勢膠囊',
        description: '加上 <code class="cu-code">cu-stat-trend-pill</code> 以膠囊形狀的趨勢背景快速辨識。',
      },
      accentBorder: {
        title: '強調邊線',
        description: '使用 <code class="cu-code">cu-stat-accent</code> 在左側加上彩色強調條紋以識別類別。支援變體如 <code class="cu-code">cu-stat-accent-success</code>、<code class="cu-code">cu-stat-accent-warning</code>。',
      },
      withProgress: {
        title: '搭配進度條',
        description: '使用 <code class="cu-code">cu-stat-footer</code> 搭配進度條，適合用於配額或目標完成度。',
      },
      hoverEffect: {
        title: '懸停效果',
        description: '加上 <code class="cu-code">cu-stat-hover</code> 啟用懸停陰影提升效果，適合可點擊的指標卡片。',
      },
    },
    classDescriptions: {
      'cu-stat': '指標卡片容器',
      'cu-stat-hover': '啟用懸停陰影效果',
      'cu-stat-header': '頂部區域（標籤和圖示）',
      'cu-stat-label': '指標名稱標籤',
      'cu-stat-icon': '小圖示',
      'cu-stat-icon-box': '圖示方框容器（主色）',
      'cu-stat-icon-box-*': '圖示方框顏色變體，支援 secondary / success / warning / destructive / info',
      'cu-stat-value': '主要數值',
      'cu-stat-description': '說明文字',
      'cu-stat-trend': '趨勢指示器基礎樣式',
      'cu-stat-trend-up': '上升趨勢（綠色）',
      'cu-stat-trend-down': '下降趨勢（紅色）',
      'cu-stat-trend-pill': '趨勢膠囊樣式（帶背景色）',
      'cu-stat-footer': '底部區域，帶上邊框',
      'cu-stat-accent': '左側強調條紋（主色）',
      'cu-stat-accent-*': '強調色變體，支援 success / warning / destructive / info',
    },
  },
};
