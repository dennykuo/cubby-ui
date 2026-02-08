import type { Locale } from '../index';

export const playgroundPage: Record<Locale, {
  title: string;
  heading: string;
  description: string;
  controls: {
    component: string;
    props: string;
    reset: string;
    showControls: string;
  };
  preview: {
    label: string;
    dark: string;
  };
  code: {
    label: string;
    copy: string;
    copied: string;
    reset: string;
    manualEditWarning: string;
  };
  theme: {
    label: string;
    colors: string;
    borderRadius: string;
    resetTheme: string;
  };
  categories: {
    basic: string;
    typography: string;
    forms: string;
    feedback: string;
    dataDisplay: string;
  };
}> = {
  en: {
    title: 'Playground — Cubby UI',
    heading: 'Playground',
    description: 'Explore components interactively. Adjust props, edit code, and customize theme tokens in real time.',
    controls: {
      component: 'Component',
      props: 'Props',
      reset: 'Reset',
      showControls: 'Controls',
    },
    preview: {
      label: 'Preview',
      dark: 'Dark mode',
    },
    code: {
      label: 'Code',
      copy: 'Copy',
      copied: 'Copied!',
      reset: 'Reset code',
      manualEditWarning: 'Code manually edited.',
    },
    theme: {
      label: 'Theme',
      colors: 'Colors',
      borderRadius: 'Border Radius',
      resetTheme: 'Reset Theme',
    },
    categories: {
      basic: 'Basic',
      typography: 'Typography',
      forms: 'Forms',
      feedback: 'Feedback',
      dataDisplay: 'Data Display',
    },
  },
  'zh-tw': {
    title: 'Playground — Cubby UI',
    heading: 'Playground',
    description: '互動式探索元件。即時調整 props、編輯程式碼、自訂主題 token。',
    controls: {
      component: '元件',
      props: 'Props',
      reset: '重設',
      showControls: '控制面板',
    },
    preview: {
      label: '預覽',
      dark: '深色模式',
    },
    code: {
      label: '程式碼',
      copy: '複製',
      copied: '已複製！',
      reset: '重設程式碼',
      manualEditWarning: '程式碼已手動編輯。',
    },
    theme: {
      label: '主題',
      colors: '色彩',
      borderRadius: '圓角',
      resetTheme: '重設主題',
    },
    categories: {
      basic: '基礎',
      typography: '排版',
      forms: '表單',
      feedback: '回饋',
      dataDisplay: '資料展示',
    },
  },
};
