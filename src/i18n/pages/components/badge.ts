import type { Locale } from '../../index';

export const badgePage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    variants: { title: string; description: string };
    withIcon: { title: string; description: string };
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
      withIcon: {
        title: 'With Icon',
        description: 'Add inline SVG icons inside the badge for additional context.',
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
      withIcon: {
        title: '搭配圖示',
        description: '在徽章內加入 SVG 圖示以提供額外資訊。',
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
    },
  },
};
