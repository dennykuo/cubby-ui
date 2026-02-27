import type { Locale } from '../../index';

export const badgePage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    variants: { title: string; description: string };
    softVariants: { title: string; description: string };
    withIcon: { title: string; description: string };
    withDot: { title: string; description: string };
    dismissible: { title: string; description: string };
    count: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Badge — Cubby UI',
    description: 'Displays a badge or a component that looks like a badge.',
    category: 'Data Display',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Apply <code class="cu-code">cu-badge</code> as the base class, then add a variant class.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      variants: {
        title: 'Variants',
        description: 'Use variant classes to change the badge\'s visual style.',
      },
      softVariants: {
        title: 'Soft Variants',
        description: 'Soft variants use a tinted background with colored text, ideal for data tables and dense UIs where full-color badges may be too prominent.',
      },
      withIcon: {
        title: 'With Icon',
        description: 'Add inline SVG icons inside the badge for additional context.',
      },
      withDot: {
        title: 'With Dot',
        description: 'Add <code class="cu-code">cu-badge-dot</code> to display a small status dot before the label.',
      },
      dismissible: {
        title: 'Dismissible',
        description: 'Add <code class="cu-code">cu-badge-removable</code> to the badge and <code class="cu-code">cu-badge-remove</code> to the close button to make it removable.',
      },
      count: {
        title: 'Count',
        description: 'Use <code class="cu-code">cu-badge-count</code> for compact circular count badges, ideal for notification indicators.',
      },
    },
    classDescriptions: {
      'cu-badge': 'Badge base style',
      'cu-badge-default': 'Default variant (primary background)',
      'cu-badge-secondary': 'Secondary variant',
      'cu-badge-outline': 'Outline variant',
      'cu-badge-destructive': 'Destructive variant',
      'cu-badge-success': 'Success variant',
      'cu-badge-warning': 'Warning variant',
      'cu-badge-info': 'Info variant',
      'cu-badge-soft-*': 'Soft variant (light background + colored text), supports default / secondary / destructive / success / warning / info',
      'cu-badge-dot': 'Adds a status dot before the label via ::before pseudo-element',
      'cu-badge-removable': 'Badge with close button, adjusts padding',
      'cu-badge-remove': 'Close button inside removable badge',
      'cu-badge-count': 'Compact circular count badge for notifications',
      'cu-badge-sm': 'Small size',
      'cu-badge-lg': 'Large size',
    },
  },
  'zh-tw': {
    title: 'Badge — Cubby UI',
    description: '顯示徽章或外觀類似徽章的元件。',
    category: '資料展示',
    sections: {
      usage: {
        title: '使用方式',
        description: '以 <code class="cu-code">cu-badge</code> 作為基礎類別，再加上變體類別。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      variants: {
        title: '變體',
        description: '使用變體類別來改變徽章的視覺樣式。',
      },
      softVariants: {
        title: '柔和變體',
        description: '柔和變體使用淺色背景搭配彩色文字，適用於資料表格和密集 UI 中，全色徽章可能過於醒目的場景。',
      },
      withIcon: {
        title: '搭配圖示',
        description: '在徽章內加入 SVG 圖示以提供額外資訊。',
      },
      withDot: {
        title: '搭配圓點',
        description: '加入 <code class="cu-code">cu-badge-dot</code> 在標籤前方顯示小型狀態圓點。',
      },
      dismissible: {
        title: '可關閉',
        description: '在徽章上加入 <code class="cu-code">cu-badge-removable</code>，並在關閉按鈕上加入 <code class="cu-code">cu-badge-remove</code> 使其可被移除。',
      },
      count: {
        title: '計數',
        description: '使用 <code class="cu-code">cu-badge-count</code> 建立緊湊的圓形計數徽章，適用於通知指示器。',
      },
    },
    classDescriptions: {
      'cu-badge': '徽章基礎樣式',
      'cu-badge-default': '預設變體（主色背景）',
      'cu-badge-secondary': '次要變體',
      'cu-badge-outline': '外框變體',
      'cu-badge-destructive': '危險變體',
      'cu-badge-success': '成功變體',
      'cu-badge-warning': '警告變體',
      'cu-badge-info': '資訊變體',
      'cu-badge-soft-*': '柔和變體（淺色背景 + 彩色文字），支援 default / secondary / destructive / success / warning / info',
      'cu-badge-dot': '透過 ::before 偽元素在標籤前方加入狀態圓點',
      'cu-badge-removable': '帶關閉按鈕的徽章，調整 padding',
      'cu-badge-remove': '可移除徽章內的關閉按鈕',
      'cu-badge-count': '緊湊的圓形計數徽章，用於通知',
      'cu-badge-sm': '小尺寸',
      'cu-badge-lg': '大尺寸',
    },
  },
};
