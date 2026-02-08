import type { Locale } from '../../index';

export const headerPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withNavigation: { title: string; description: string };
    brandVariations: { title: string; description: string };
    mobileMenuToggle: { title: string; description: string };
    withActions: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Header — Cubby UI',
    description: 'A top navigation bar with brand, navigation, and actions areas.',
    category: 'Layouts',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Compose with <code class="cu-code">cu-header</code>, <code class="cu-code">cu-header-inner</code>, <code class="cu-code">cu-header-brand</code>, and <code class="cu-code">cu-header-actions</code>. The inner container handles height, flex layout, and responsive padding.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withNavigation: {
        title: 'With Navigation',
        description: 'Add a <code class="cu-code">cu-header-nav</code> section with a <code class="cu-code">cu-nav</code> inside. The nav area is hidden on mobile and visible from the <code class="cu-code">md</code> breakpoint.',
      },
      brandVariations: {
        title: 'Brand Variations',
        description: 'The brand area accepts any content — text only, icon with text, or a custom logo image.',
      },
      mobileMenuToggle: {
        title: 'Mobile Menu Toggle',
        description: 'For dashboard layouts, add a hamburger button before the brand using <code class="cu-code">cu-button cu-button-ghost cu-button-icon-sm</code>. Hide it on desktop with <code class="cu-code">md:hidden</code>.',
      },
      withActions: {
        title: 'With Actions',
        description: 'The actions area supports icon buttons, avatars, or any custom elements.',
      },
    },
    classDescriptions: {
      'cu-header': 'Top navigation bar container, sticky with blurred background',
      'cu-header-inner': 'Inner flex container controlling height and horizontal padding',
      'cu-header-brand': 'Left brand / logo area',
      'cu-header-nav': 'Center navigation links, hidden on mobile',
      'cu-header-actions': 'Right action button area',
    },
  },
  'zh-tw': {
    title: 'Header — Cubby UI',
    description: '包含品牌、導航和操作區域的頂部導航列。',
    category: '佈局',
    sections: {
      usage: {
        title: '使用方式',
        description: '使用 <code class="cu-code">cu-header</code>、<code class="cu-code">cu-header-inner</code>、<code class="cu-code">cu-header-brand</code> 和 <code class="cu-code">cu-header-actions</code> 組合。內部容器處理高度、flex 佈局和響應式內距。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withNavigation: {
        title: '帶導航',
        description: '加入 <code class="cu-code">cu-header-nav</code> 區塊，內部放入 <code class="cu-code">cu-nav</code>。導航區域在行動裝置上隱藏，從 <code class="cu-code">md</code> 斷點開始顯示。',
      },
      brandVariations: {
        title: '品牌變化',
        description: '品牌區域可接受任何內容 — 純文字、圖示加文字，或自訂 logo 圖片。',
      },
      mobileMenuToggle: {
        title: '行動端選單切換',
        description: '在儀表板佈局中，使用 <code class="cu-code">cu-button cu-button-ghost cu-button-icon-sm</code> 在品牌前加入漢堡按鈕。使用 <code class="cu-code">md:hidden</code> 在桌面端隱藏。',
      },
      withActions: {
        title: '帶操作按鈕',
        description: '操作區域支援圖示按鈕、頭像或任何自訂元素。',
      },
    },
    classDescriptions: {
      'cu-header': '頂部導航列容器，置頂並帶有模糊背景',
      'cu-header-inner': '內部 flex 容器，控制高度和水平內距',
      'cu-header-brand': '左側品牌 / logo 區域',
      'cu-header-nav': '中間導航連結，行動端隱藏',
      'cu-header-actions': '右側操作按鈕區域',
    },
  },
};
