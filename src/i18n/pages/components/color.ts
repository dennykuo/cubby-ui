import type { Locale } from '../../index';

export const colorPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    semanticColors: { title: string; description: string };
    surfaceColors: { title: string; description: string };
    utilityColors: { title: string; description: string };
    customization: { title: string; description: string };
  };
}> = {
  en: {
    title: 'Color — Cubby UI',
    description: 'Semantic color tokens defined as CSS custom properties in <code class="cu-code">global.css</code>. Each semantic color has a paired foreground for text on that background.',
    category: 'Basic',
    sections: {
      semanticColors: {
        title: 'Semantic Colors',
        description: 'Used for interactive elements like buttons, badges, and alerts. Each color has a <code class="cu-code">-foreground</code> counterpart for legible text.',
      },
      surfaceColors: {
        title: 'Surface Colors',
        description: 'Used for page backgrounds, cards, popovers, and muted areas.',
      },
      utilityColors: {
        title: 'Utility Colors',
        description: 'Used for borders, input outlines, and focus rings.',
      },
      customization: {
        title: 'Customization',
        description: 'Override any color in <code class="cu-code">src/styles/global.css</code> inside the <code class="cu-code">@theme</code> block. For dark mode, override inside the <code class="cu-code">.dark</code> selector.',
      },
    },
  },
  'zh-tw': {
    title: 'Color — Cubby UI',
    description: '定義在 <code class="cu-code">global.css</code> 中的語意色彩 token（CSS 自訂屬性）。每個語意色彩都有配對的前景色，用於該背景上的文字。',
    category: '基礎',
    sections: {
      semanticColors: {
        title: '語意色彩',
        description: '用於按鈕、徽章和警示等互動元素。每個色彩都有 <code class="cu-code">-foreground</code> 對應色，確保文字可讀性。',
      },
      surfaceColors: {
        title: '表面色彩',
        description: '用於頁面背景、卡片、彈出層和柔和區域。',
      },
      utilityColors: {
        title: '工具色彩',
        description: '用於邊框、輸入框外框和聚焦環。',
      },
      customization: {
        title: '自訂',
        description: '在 <code class="cu-code">src/styles/global.css</code> 的 <code class="cu-code">@theme</code> 區塊中覆寫任何色彩。深色模式則在 <code class="cu-code">.dark</code> 選擇器內覆寫。',
      },
    },
  },
};
