import type { Locale } from '../../index';

export const buttonPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    variants: { title: string; description: string };
    sizes: { title: string; description: string };
    withIcons: { title: string; description: string };
    iconButtons: { title: string; description: string };
    loading: { title: string; description: string };
    asLink: { title: string; description: string };

    responsive: { title: string; description: string };
    buttonGroup: { title: string; description: string };
    disabled: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Button — Cubby UI',
    description: 'Displays a button or a component that looks like a button.',
    category: 'Basic',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Apply <code class="cu-code">cu-button</code> as the base class, then add a variant and size class.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      variants: {
        title: 'Variants',
        description: 'Use variant classes to change the button\'s visual style. Each variant conveys a different level of emphasis or intent.',
      },
      sizes: {
        title: 'Sizes',
        description: 'Five sizes are available — from <code class="cu-code">cu-button-xs</code> to <code class="cu-code">cu-button-xl</code>. The default size is <code class="cu-code">cu-button-md</code>.',
      },
      withIcons: {
        title: 'With Icons',
        description: 'Add inline SVG icons before or after the label text. Use <code class="cu-code">cu-button-icon</code> for icon-only buttons.',
      },
      iconButtons: {
        title: 'Icon Buttons',
        description: 'Icon-only buttons across different variants. Ideal for toolbars, actions, and compact UIs.',
      },
      loading: {
        title: 'Loading',
        description: 'Add <code class="cu-code">cu-button-loading</code> with a <code class="cu-code">cu-spinner cu-spinner-sm</code> to indicate a pending action. Unlike <code class="cu-code">disabled</code>, loading uses <code class="cu-code">opacity-70</code> for a subtler visual.',
      },
      asLink: {
        title: 'As Link',
        description: 'Apply button classes to an <code class="cu-code">&lt;a&gt;</code> element for link-styled buttons.',
      },
      buttonGroup: {
        title: 'Button Group',
        description: 'Wrap buttons in a <code class="cu-code">cu-button-group</code> to join them visually. See the <a href="{buttonGroupHref}" class="text-primary hover:underline">Button Group</a> page for more options.',
      },
      responsive: {
        title: 'Responsive',
        description: 'Use <code class="cu-code">cu-button-block</code> for always full-width, or <code class="cu-code">cu-button-block-sm</code> for full-width on mobile that auto-sizes on larger screens.',
      },
      disabled: {
        title: 'Disabled',
        description: 'Add the <code class="cu-code">disabled</code> attribute. The button becomes non-interactive with reduced opacity.',
      },
    },
    classDescriptions: {
      'cu-button': 'Base button',
      'cu-button-default': 'Default variant (Primary background)',
      'cu-button-secondary': 'Secondary variant',
      'cu-button-outline': 'Outline variant',
      'cu-button-ghost': 'Ghost variant (no background)',
      'cu-button-link': 'Link variant',
      'cu-button-destructive': 'Destructive variant',
      'cu-button-success': 'Success variant',
      'cu-button-warning': 'Warning variant',
      'cu-button-info': 'Info variant',
      'cu-button-xs': 'Extra-small size',
      'cu-button-sm': 'Small size',
      'cu-button-md': 'Medium size (default)',
      'cu-button-lg': 'Large size',
      'cu-button-xl': 'Extra-large size',
      'cu-button-icon': 'Icon button',
      'cu-button-icon-sm': 'Small icon button',
      'cu-button-icon-xs': 'Extra-small icon button',
      'cu-button-loading': 'Loading state (pointer-events-none, opacity-70)',
      'cu-button-block': 'Full-width button',
      'cu-button-block-sm': 'Full-width on mobile, auto on sm+',
    },
  },
  'zh-tw': {
    title: 'Button — Cubby UI',
    description: '顯示按鈕或外觀類似按鈕的元件。',
    category: '基礎',
    sections: {
      usage: {
        title: '使用方式',
        description: '以 <code class="cu-code">cu-button</code> 作為基礎類別，再加上變體和尺寸類別。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      variants: {
        title: '變體',
        description: '使用變體類別來改變按鈕的視覺風格。每種變體傳達不同程度的強調或意圖。',
      },
      sizes: {
        title: '尺寸',
        description: '提供五種尺寸 — 從 <code class="cu-code">cu-button-xs</code> 到 <code class="cu-code">cu-button-xl</code>。預設尺寸為 <code class="cu-code">cu-button-md</code>。',
      },
      withIcons: {
        title: '帶圖示',
        description: '在標籤文字前後加入行內 SVG 圖示。使用 <code class="cu-code">cu-button-icon</code> 建立純圖示按鈕。',
      },
      iconButtons: {
        title: '圖示按鈕',
        description: '不同變體的純圖示按鈕。適用於工具列、操作按鈕和緊湊型介面。',
      },
      loading: {
        title: '載入中',
        description: '加入 <code class="cu-code">cu-button-loading</code> 搭配 <code class="cu-code">cu-spinner cu-spinner-sm</code> 來表示待處理的操作。與 <code class="cu-code">disabled</code> 不同，loading 使用 <code class="cu-code">opacity-70</code> 呈現較柔和的視覺效果。',
      },
      asLink: {
        title: '作為連結',
        description: '將按鈕類別套用到 <code class="cu-code">&lt;a&gt;</code> 元素，建立連結樣式的按鈕。',
      },
      buttonGroup: {
        title: '按鈕群組',
        description: '將按鈕包裹在 <code class="cu-code">cu-button-group</code> 中以視覺上合併。請參閱 <a href="{buttonGroupHref}" class="text-primary hover:underline">Button Group</a> 頁面了解更多選項。',
      },
      responsive: {
        title: '響應式',
        description: '使用 <code class="cu-code">cu-button-block</code> 讓按鈕始終全寬，或使用 <code class="cu-code">cu-button-block-sm</code> 在行動端全寬、較大螢幕自動調整。',
      },
      disabled: {
        title: '停用',
        description: '加入 <code class="cu-code">disabled</code> 屬性。按鈕將變為不可互動，並降低透明度。',
      },
    },
    classDescriptions: {
      'cu-button': '基礎按鈕',
      'cu-button-default': '預設變體（Primary 背景）',
      'cu-button-secondary': 'Secondary 變體',
      'cu-button-outline': 'Outline 變體',
      'cu-button-ghost': 'Ghost 變體（無背景）',
      'cu-button-link': 'Link 變體',
      'cu-button-destructive': 'Destructive 變體',
      'cu-button-success': 'Success 變體',
      'cu-button-warning': 'Warning 變體',
      'cu-button-info': 'Info 變體',
      'cu-button-xs': '超小尺寸',
      'cu-button-sm': '小尺寸',
      'cu-button-md': '中尺寸（預設）',
      'cu-button-lg': '大尺寸',
      'cu-button-xl': '超大尺寸',
      'cu-button-icon': '圖示按鈕',
      'cu-button-icon-sm': '小圖示按鈕',
      'cu-button-icon-xs': '超小圖示按鈕',
      'cu-button-loading': '載入狀態（pointer-events-none, opacity-70）',
      'cu-button-block': '全寬按鈕',
      'cu-button-block-sm': '行動端全寬，sm+ 自動寬度',
    },
  },
};
