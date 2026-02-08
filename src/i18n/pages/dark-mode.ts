import type { Locale } from '../index';

export const darkModeTranslations: Record<Locale, {
  title: string;
  heading: string;
  description: string;
  basicUsage: {
    heading: string;
    description: string;
  };
  howItWorks: {
    heading: string;
    description: string;
    note: string;
  };
  themeToggle: {
    heading: string;
    description: string;
  };
  systemPreference: {
    heading: string;
    description: string;
  };
  preventFlash: {
    heading: string;
    description: string;
  };
  customDarkColors: {
    heading: string;
    description: string;
  };
  tailwindDark: {
    heading: string;
    description: string;
  };
  tips: {
    heading: string;
    items: string[];
  };
}> = {
  en: {
    title: 'Dark Mode — Cubby UI',
    heading: 'Dark Mode',
    description: 'Cubby UI includes built-in dark mode support with carefully tuned colors.',
    basicUsage: {
      heading: 'Basic usage',
      description: 'Add the <code class="cu-code">dark</code> class to the <code class="cu-code">&lt;html&gt;</code> element. All Cubby UI components will automatically switch to their dark variants.',
    },
    howItWorks: {
      heading: 'How it works',
      description: 'Dark mode overrides are defined in the <code class="cu-code">.dark</code> selector in <code class="cu-code">global.css</code>. When the class is present, CSS variables are updated to dark mode values.',
      note: 'Since components use these CSS variables, they adapt automatically — no extra classes needed on individual components.',
    },
    themeToggle: {
      heading: 'Theme toggle',
      description: 'Implement a theme toggle button with localStorage persistence.',
    },
    systemPreference: {
      heading: 'System preference',
      description: 'Respect the user\'s OS preference using <code class="cu-code">prefers-color-scheme</code>.',
    },
    preventFlash: {
      heading: 'Prevent flash of wrong theme',
      description: 'Add a blocking script to <code class="cu-code">&lt;head&gt;</code> to apply the theme before the page renders.',
    },
    customDarkColors: {
      heading: 'Custom dark mode colors',
      description: 'Override the default dark mode colors by adding your own <code class="cu-code">.dark</code> selector after importing Cubby UI.',
    },
    tailwindDark: {
      heading: 'Using Tailwind\'s dark: variant',
      description: 'Tailwind\'s <code class="cu-code">dark:</code> variant works alongside Cubby UI. Use it for custom styling that needs to change between themes.',
    },
    tips: {
      heading: 'Tips',
      items: [
        'Always add the <code class="cu-code">dark</code> class to <code class="cu-code">&lt;html&gt;</code>, not <code class="cu-code">&lt;body&gt;</code>.',
        'Use <code class="cu-code">localStorage</code> to persist the user\'s preference across page reloads.',
        'Consider providing three options: Light, Dark, and System (auto).',
        'Test your dark mode colors for sufficient contrast. Dark mode isn\'t just "invert the colors".',
      ],
    },
  },
  'zh-tw': {
    title: 'Dark Mode — Cubby UI',
    heading: '深色模式',
    description: 'Cubby UI 內建精心調校的深色模式支援。',
    basicUsage: {
      heading: '基本使用',
      description: '在 <code class="cu-code">&lt;html&gt;</code> 元素加上 <code class="cu-code">dark</code> 類別。所有 Cubby UI 元件將自動切換為深色變體。',
    },
    howItWorks: {
      heading: '運作原理',
      description: '深色模式覆蓋定義在 <code class="cu-code">global.css</code> 的 <code class="cu-code">.dark</code> 選擇器中。當該類別存在時，CSS 變數會更新為深色模式值。',
      note: '由於元件使用這些 CSS 變數，它們會自動適應 — 個別元件不需要額外的類別。',
    },
    themeToggle: {
      heading: '主題切換',
      description: '實作帶有 localStorage 持久化的主題切換按鈕。',
    },
    systemPreference: {
      heading: '系統偏好',
      description: '使用 <code class="cu-code">prefers-color-scheme</code> 遵循使用者的作業系統偏好。',
    },
    preventFlash: {
      heading: '防止主題閃爍',
      description: '在 <code class="cu-code">&lt;head&gt;</code> 中加入阻塞式腳本，在頁面渲染前套用主題。',
    },
    customDarkColors: {
      heading: '自訂深色模式色彩',
      description: '在引入 Cubby UI 後加入你自己的 <code class="cu-code">.dark</code> 選擇器，即可覆蓋預設深色模式色彩。',
    },
    tailwindDark: {
      heading: '使用 Tailwind 的 dark: 變體',
      description: 'Tailwind 的 <code class="cu-code">dark:</code> 變體可與 Cubby UI 並用。用於需要在主題之間切換的自訂樣式。',
    },
    tips: {
      heading: '提示',
      items: [
        '務必將 <code class="cu-code">dark</code> 類別加在 <code class="cu-code">&lt;html&gt;</code> 而非 <code class="cu-code">&lt;body&gt;</code>。',
        '使用 <code class="cu-code">localStorage</code> 來跨頁面保存使用者的偏好。',
        '考慮提供三種選項：淺色、深色與系統（自動）。',
        '測試你的深色模式色彩是否有足夠的對比度。深色模式不只是「反轉色彩」。',
      ],
    },
  },
};
