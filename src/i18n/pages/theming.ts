import type { Locale } from '../index';

export const themingTranslations: Record<Locale, {
  title: string;
  heading: string;
  description: string;
  themeStructure: {
    heading: string;
    description: string;
  };
  colorSystem: {
    heading: string;
  };
  semanticColors: {
    heading: string;
    description: string;
    tableHeaders: {
      variable: string;
      usage: string;
    };
    primary: string;
    secondary: string;
    destructive: string;
    success: string;
    warning: string;
    info: string;
    muted: string;
  };
  semiTransparent: {
    heading: string;
    description: string;
  };
  customization: {
    heading: string;
  };
  overridePrimary: {
    heading: string;
    description: string;
  };
  brandColors: {
    heading: string;
    description: string;
    labels: {
      default: string;
      emerald: string;
      purple: string;
      orange: string;
      rose: string;
    };
  };
  customFont: {
    heading: string;
    description: string;
  };
  borderRadius: {
    heading: string;
    description: string;
  };
  tips: {
    heading: string;
    items: string[];
  };
}> = {
  en: {
    title: 'Theming — Cubby UI',
    heading: 'Theming',
    description: 'Customize Cubby UI to match your brand using CSS variables.',
    themeStructure: {
      heading: 'Theme structure',
      description: 'Cubby UI uses Tailwind CSS v4\'s <code class="cu-code">@theme</code> directive to define design tokens. All colors, fonts, and spacing are defined as CSS custom properties in <code class="cu-code">theme.css</code>.',
    },
    colorSystem: {
      heading: 'Color system',
    },
    semanticColors: {
      heading: 'Semantic colors',
      description: 'Each semantic color has a paired <code class="cu-code">-foreground</code> variant for text contrast.',
      tableHeaders: {
        variable: 'Variable',
        usage: 'Usage',
      },
      primary: 'Primary actions, links, focus rings',
      secondary: 'Secondary buttons, subtle backgrounds',
      destructive: 'Destructive actions, errors',
      success: 'Success states, confirmations',
      warning: 'Warnings, cautions',
      info: 'Informational messages',
      muted: 'Muted backgrounds, disabled states',
    },
    semiTransparent: {
      heading: 'Semi-transparent colors',
      description: 'Use <code class="cu-code">color-mix()</code> for semi-transparent semantic colors instead of hardcoding HSL values.',
    },
    customization: {
      heading: 'Customization',
    },
    overridePrimary: {
      heading: 'Override primary color',
      description: 'Add your own <code class="cu-code">@theme</code> block after importing Cubby UI to override any token.',
    },
    brandColors: {
      heading: 'Brand colors',
      description: 'Some common brand color examples. Remember to also update <code class="cu-code">--color-ring</code> to match.',
      labels: {
        default: 'Default (Blue)',
        emerald: 'Emerald',
        purple: 'Purple',
        orange: 'Orange',
        rose: 'Rose',
      },
    },
    customFont: {
      heading: 'Custom font',
      description: 'Override the default font stack with your preferred typeface.',
    },
    borderRadius: {
      heading: 'Border radius',
      description: 'Adjust the global border radius for a different visual style.',
    },
    tips: {
      heading: 'Tips',
      items: [
        'Always define both <code class="cu-code">--color-*</code> and <code class="cu-code">--color-*-foreground</code> pairs for proper contrast.',
        'Use HSL format for colors to maintain consistency with the default theme.',
        'Remember to define dark mode overrides in a <code class="cu-code">.dark</code> selector. See the <a href="{darkModePath}" class="text-primary hover:underline underline-offset-4">Dark Mode</a> guide.',
        'Test your color choices for accessibility — ensure sufficient contrast ratios (WCAG 2.1 AA minimum).',
      ],
    },
  },
  'zh-tw': {
    title: 'Theming — Cubby UI',
    heading: '主題設定',
    description: '使用 CSS 變數自訂 Cubby UI 以符合你的品牌。',
    themeStructure: {
      heading: '主題結構',
      description: 'Cubby UI 使用 Tailwind CSS v4 的 <code class="cu-code">@theme</code> 指令定義設計 token。所有色彩、字型和間距都在 <code class="cu-code">theme.css</code> 中以 CSS 自訂屬性定義。',
    },
    colorSystem: {
      heading: '色彩系統',
    },
    semanticColors: {
      heading: '語意色彩',
      description: '每個語意色彩都有配對的 <code class="cu-code">-foreground</code> 變體，用於文字對比。',
      tableHeaders: {
        variable: '變數',
        usage: '用途',
      },
      primary: '主要操作、連結、焦點環',
      secondary: '次要按鈕、淡背景',
      destructive: '危險操作、錯誤',
      success: '成功狀態、確認',
      warning: '警告、注意',
      info: '資訊訊息',
      muted: '淡背景、停用狀態',
    },
    semiTransparent: {
      heading: '半透明色彩',
      description: '使用 <code class="cu-code">color-mix()</code> 處理半透明語意色彩，避免硬編碼 HSL 值。',
    },
    customization: {
      heading: '自訂',
    },
    overridePrimary: {
      heading: '覆蓋主色',
      description: '在引入 Cubby UI 後加入你自己的 <code class="cu-code">@theme</code> 區塊，即可覆蓋任何 token。',
    },
    brandColors: {
      heading: '品牌色彩',
      description: '一些常見品牌色彩範例。記得同時更新 <code class="cu-code">--color-ring</code> 以保持一致。',
      labels: {
        default: '預設（藍色）',
        emerald: '翠綠',
        purple: '紫色',
        orange: '橘色',
        rose: '玫瑰',
      },
    },
    customFont: {
      heading: '自訂字型',
      description: '以你偏好的字體覆蓋預設字型堆疊。',
    },
    borderRadius: {
      heading: '圓角',
      description: '調整全域圓角以呈現不同視覺風格。',
    },
    tips: {
      heading: '提示',
      items: [
        '務必同時定義 <code class="cu-code">--color-*</code> 和 <code class="cu-code">--color-*-foreground</code> 配對，以確保正確的對比度。',
        '使用 HSL 格式的色彩以維持與預設主題的一致性。',
        '記得在 <code class="cu-code">.dark</code> 選擇器中定義深色模式覆蓋。參見<a href="{darkModePath}" class="text-primary hover:underline underline-offset-4">深色模式</a>指南。',
        '測試你的色彩選擇是否符合無障礙標準 — 確保足夠的對比度（WCAG 2.1 AA 最低要求）。',
      ],
    },
  },
};
