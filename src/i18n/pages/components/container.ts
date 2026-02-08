import type { Locale } from '../../index';

export const containerPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    sizes: { title: string; description: string };
    prose: { title: string; description: string };
    noMaxWidth: { title: string; description: string };
    withLayout: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Container — Cubby UI',
    description: 'A content wrapper that controls max-width and provides responsive horizontal padding.',
    category: 'Layouts',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Combine <code class="cu-code">cu-container</code> with a size class like <code class="cu-code">cu-container-lg</code>. The base class provides <code class="cu-code">mx-auto</code>, <code class="cu-code">w-full</code>, and responsive padding.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      sizes: {
        title: 'Sizes',
        description: 'Six size variants are available — <code class="cu-code">sm</code> (640px), <code class="cu-code">md</code> (768px), <code class="cu-code">lg</code> (1024px), <code class="cu-code">xl</code> (1280px), <code class="cu-code">2xl</code> (1536px), and <code class="cu-code">prose</code> (65ch).',
      },
      prose: {
        title: 'Prose',
        description: 'Use <code class="cu-code">cu-container-prose</code> for long-form text content. It limits width to 65ch — the optimal line length for readability.',
      },
      noMaxWidth: {
        title: 'No Max Width',
        description: 'Use <code class="cu-code">cu-container</code> alone without a size class for a full-width container with only responsive horizontal padding.',
      },
      withLayout: {
        title: 'With Layout',
        description: 'Containers work well as wrappers for page layouts with sidebars or multi-column structures.',
      },
    },
    classDescriptions: {
      'cu-container': 'Base container, centered with responsive horizontal padding',
      'cu-container-sm': 'Max width <code class="cu-code">sm</code> (640px)',
      'cu-container-md': 'Max width <code class="cu-code">md</code> (768px)',
      'cu-container-lg': 'Max width <code class="cu-code">lg</code> (1024px)',
      'cu-container-xl': 'Max width <code class="cu-code">xl</code> (1280px)',
      'cu-container-2xl': 'Max width <code class="cu-code">2xl</code> (1536px)',
      'cu-container-prose': 'Max width for comfortable reading',
    },
  },
  'zh-tw': {
    title: 'Container — Cubby UI',
    description: '控制最大寬度並提供響應式水平內距的內容包裝器。',
    category: '佈局',
    sections: {
      usage: {
        title: '使用方式',
        description: '將 <code class="cu-code">cu-container</code> 與尺寸類別如 <code class="cu-code">cu-container-lg</code> 組合使用。基礎類別提供 <code class="cu-code">mx-auto</code>、<code class="cu-code">w-full</code> 和響應式內距。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      sizes: {
        title: '尺寸',
        description: '提供六種尺寸變體 — <code class="cu-code">sm</code> (640px)、<code class="cu-code">md</code> (768px)、<code class="cu-code">lg</code> (1024px)、<code class="cu-code">xl</code> (1280px)、<code class="cu-code">2xl</code> (1536px) 和 <code class="cu-code">prose</code> (65ch)。',
      },
      prose: {
        title: 'Prose',
        description: '使用 <code class="cu-code">cu-container-prose</code> 用於長篇文字內容。它將寬度限制在 65ch — 最適合閱讀的行寬。',
      },
      noMaxWidth: {
        title: '無最大寬度',
        description: '單獨使用 <code class="cu-code">cu-container</code> 而不加尺寸類別，可建立僅有響應式水平內距的全寬容器。',
      },
      withLayout: {
        title: '搭配佈局',
        description: '容器非常適合作為帶側邊欄或多欄結構的頁面佈局包裝器。',
      },
    },
    classDescriptions: {
      'cu-container': '基礎容器，置中並帶有響應式水平內距',
      'cu-container-sm': '最大寬度 <code class="cu-code">sm</code>（640px）',
      'cu-container-md': '最大寬度 <code class="cu-code">md</code>（768px）',
      'cu-container-lg': '最大寬度 <code class="cu-code">lg</code>（1024px）',
      'cu-container-xl': '最大寬度 <code class="cu-code">xl</code>（1280px）',
      'cu-container-2xl': '最大寬度 <code class="cu-code">2xl</code>（1536px）',
      'cu-container-prose': '適合舒適閱讀的最大寬度',
    },
  },
};
