import type { Locale } from '../../index';

export const headerPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withNavigation: { title: string; description: string };
    navStart: { title: string; description: string };
    navEnd: { title: string; description: string };
    brandVariations: { title: string; description: string };
    mobileNav: { title: string; description: string };
    triggerVisibility: { title: string; description: string; alwaysVisible: string; hiddenAboveLg: string; breakpointList: string };
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
        description: 'Add a <code class="cu-code">cu-header-nav</code> section with a <code class="cu-code">cu-nav</code> inside. Use a breakpoint modifier like <code class="cu-code">cu-header-nav-md</code> to hide on mobile and show from the <code class="cu-code">md</code> breakpoint.',
      },
      navStart: {
        title: 'Navigation Start-Aligned',
        description: 'Add <code class="cu-code">cu-header-nav-start</code> to keep navigation next to the brand, pushing actions to the far right.',
      },
      navEnd: {
        title: 'Navigation End-Aligned',
        description: 'Add <code class="cu-code">cu-header-nav-end</code> to push navigation to the right, adjacent to the actions area.',
      },
      brandVariations: {
        title: 'Brand Variations',
        description: 'The brand area accepts any content — text only, icon with text, or a custom logo image.',
      },
      mobileNav: {
        title: 'Mobile Navigation',
        description: 'Add a slide-in mobile navigation panel with <code class="cu-code">cu-header-mobile-nav</code>. Use <code class="cu-code">data-cu-mobile-nav-trigger</code> on the hamburger button, and <code class="cu-code">data-cu-mobile-nav-clone</code> on the panel to auto-clone desktop navigation. Supports Escape key, backdrop click, scroll lock, and focus management.',
      },
      triggerVisibility: {
        title: 'Trigger Visibility',
        description: 'Control when the hamburger button is visible by adding a responsive <code class="cu-code">{breakpoint}:hidden</code> class. Omit the hidden class entirely for an always-visible trigger — useful for app-style layouts where the sidebar is toggled at all screen sizes.',
        alwaysVisible: 'Always visible — no breakpoint class',
        hiddenAboveLg: 'Hidden above lg — visible on mobile and tablet',
        breakpointList: 'Available breakpoint classes: <code class="cu-code">sm:hidden</code> (≥640px), <code class="cu-code">md:hidden</code> (≥768px), <code class="cu-code">lg:hidden</code> (≥1024px), <code class="cu-code">xl:hidden</code> (≥1280px). Pair with the matching <code class="cu-code">cu-header-nav-{breakpoint}</code> to keep the trigger and nav in sync.',
      },
    },
    classDescriptions: {
      'cu-header': 'Top navigation bar container, sticky with blurred background',
      'cu-header-inner': 'Inner flex container controlling height and horizontal padding',
      'cu-header-brand': 'Left brand / logo area',
      'cu-header-nav': 'Center navigation links container (always visible by default, pair with breakpoint modifier)',
      'cu-header-nav-sm': 'Show nav from sm breakpoint (hidden below sm)',
      'cu-header-nav-md': 'Show nav from md breakpoint (hidden below md, default for Astro component)',
      'cu-header-nav-lg': 'Show nav from lg breakpoint (hidden below lg)',
      'cu-header-nav-xl': 'Show nav from xl breakpoint (hidden below xl)',
      'cu-header-nav-start': 'Keep navigation next to the brand, push actions to the far right',
      'cu-header-nav-end': 'Push navigation to the right, adjacent to the actions area',
      'cu-header-actions': 'Right action button area',
      'cu-header-mobile-nav': 'Slide-in mobile navigation panel (fixed left, w-72)',
      'cu-header-mobile-backdrop': 'Semi-transparent overlay behind mobile nav panel',
      'cu-header-mobile-header': 'Mobile nav panel header with brand and close button',
      'cu-header-mobile-content': 'Scrollable content area inside mobile nav panel',
      'cu-header-mobile-close': 'Close button inside mobile nav panel header',
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
        description: '加入 <code class="cu-code">cu-header-nav</code> 區塊，內部放入 <code class="cu-code">cu-nav</code>。使用斷點修飾類別如 <code class="cu-code">cu-header-nav-md</code> 在行動裝置上隱藏，從 <code class="cu-code">md</code> 斷點開始顯示。',
      },
      navStart: {
        title: '導航左對齊',
        description: '加入 <code class="cu-code">cu-header-nav-start</code> 將導航保持在品牌旁邊，操作區域推至最右側。',
      },
      navEnd: {
        title: '導航右對齊',
        description: '加入 <code class="cu-code">cu-header-nav-end</code> 將導航推至右側，緊鄰操作區域。',
      },
      brandVariations: {
        title: '品牌變化',
        description: '品牌區域可接受任何內容 — 純文字、圖示加文字，或自訂 logo 圖片。',
      },
      mobileNav: {
        title: '行動端導航',
        description: '使用 <code class="cu-code">cu-header-mobile-nav</code> 加入滑入式行動導航面板。在漢堡按鈕上使用 <code class="cu-code">data-cu-mobile-nav-trigger</code>，在面板上加入 <code class="cu-code">data-cu-mobile-nav-clone</code> 可自動複製桌面導航。支援 Escape 鍵、遮罩點擊關閉、滾動鎖定和焦點管理。',
      },
      triggerVisibility: {
        title: '觸發按鈕可見性',
        description: '透過添加響應式 <code class="cu-code">{breakpoint}:hidden</code> class 來控制漢堡按鈕的顯示時機。完全省略 hidden class 可讓按鈕永遠可見 — 適用於側邊欄需要在所有螢幕尺寸下切換的應用程式佈局。',
        alwaysVisible: '永遠可見 — 不加斷點 class',
        hiddenAboveLg: 'lg 以上隱藏 — 行動端與平板可見',
        breakpointList: '可用的斷點 class：<code class="cu-code">sm:hidden</code>（≥640px）、<code class="cu-code">md:hidden</code>（≥768px）、<code class="cu-code">lg:hidden</code>（≥1024px）、<code class="cu-code">xl:hidden</code>（≥1280px）。搭配對應的 <code class="cu-code">cu-header-nav-{breakpoint}</code> 使觸發按鈕與導航列保持同步。',
      },
    },
    classDescriptions: {
      'cu-header': '頂部導航列容器，置頂並帶有模糊背景',
      'cu-header-inner': '內部 flex 容器，控制高度和水平內距',
      'cu-header-brand': '左側品牌 / logo 區域',
      'cu-header-nav': '中間導航連結容器（預設永遠可見，需搭配斷點修飾類別）',
      'cu-header-nav-sm': '從 sm 斷點顯示導航（sm 以下隱藏）',
      'cu-header-nav-md': '從 md 斷點顯示導航（md 以下隱藏，Astro 元件預設值）',
      'cu-header-nav-lg': '從 lg 斷點顯示導航（lg 以下隱藏）',
      'cu-header-nav-xl': '從 xl 斷點顯示導航（xl 以下隱藏）',
      'cu-header-nav-start': '將導航保持在品牌旁邊，操作區域推至最右側',
      'cu-header-nav-end': '將導航推至右側，緊鄰操作區域',
      'cu-header-actions': '右側操作按鈕區域',
      'cu-header-mobile-nav': '滑入式行動導航面板（固定左側，寬度 w-72）',
      'cu-header-mobile-backdrop': '行動導航面板後方的半透明遮罩',
      'cu-header-mobile-header': '行動導航面板頂部列，含品牌和關閉按鈕',
      'cu-header-mobile-content': '行動導航面板內的可捲動內容區域',
      'cu-header-mobile-close': '行動導航面板頂部列內的關閉按鈕',
    },
  },
};
