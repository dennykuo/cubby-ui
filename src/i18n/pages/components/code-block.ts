import type { Locale } from '../../index';

export const codeBlockPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    language: { title: string; description: string };
    filename: { title: string; description: string };
    multiline: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Code Block — Cubby UI',
    description: 'A block-level code display container with a copy-to-clipboard button. Does not handle syntax highlighting — use Prism, Shiki, or similar tools for that. For inline code, use the <code class="cu-code">cu-code</code> class instead.',
    category: 'Data Display',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Wrap your <code class="cu-code">&lt;pre&gt;&lt;code&gt;</code> in a <code class="cu-code">cu-code-block</code> container. A copy button appears at the top right.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      language: {
        title: 'With Language Label',
        description: 'Pass a <code class="cu-code">language</code> prop to show a header with the language name. The copy button moves into the header.',
      },
      filename: {
        title: 'With Filename',
        description: 'Use the <code class="cu-code">filename</code> prop to display a file path in the header. When both <code class="cu-code">filename</code> and <code class="cu-code">language</code> are set, <code class="cu-code">filename</code> takes priority.',
      },
      multiline: {
        title: 'Multiline Code',
        description: 'Long code blocks scroll horizontally. The container uses <code class="cu-code">overflow-x: auto</code> to handle wide content without breaking the layout.',
      },
    },
    classDescriptions: {
      'cu-code-block': 'Container with dark background and rounded corners',
      'cu-code-block-header': 'Optional header area for language name or filename',
      'cu-code-block-copy': 'Copy-to-clipboard button',
      'cu-code-block-pre': 'Pre-formatted text wrapper with horizontal scroll',
    },
  },
  'zh-tw': {
    title: 'Code Block — Cubby UI',
    description: '區塊級的程式碼顯示容器，附帶複製到剪貼簿按鈕。不處理語法高亮 — 請使用 Prism、Shiki 或類似工具。行內程式碼請改用 <code class="cu-code">cu-code</code> class。',
    category: '資料展示',
    sections: {
      usage: {
        title: '使用方式',
        description: '將 <code class="cu-code">&lt;pre&gt;&lt;code&gt;</code> 包裹在 <code class="cu-code">cu-code-block</code> 容器中。複製按鈕會出現在右上角。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      language: {
        title: '搭配語言標籤',
        description: '傳入 <code class="cu-code">language</code> prop 以顯示帶有語言名稱的標頭。複製按鈕會移到標頭中。',
      },
      filename: {
        title: '搭配檔案名稱',
        description: '使用 <code class="cu-code">filename</code> prop 在標頭中顯示檔案路徑。當同時設定 <code class="cu-code">filename</code> 和 <code class="cu-code">language</code> 時，以 <code class="cu-code">filename</code> 為優先。',
      },
      multiline: {
        title: '多行程式碼',
        description: '較長的程式碼區塊會水平捲動。容器使用 <code class="cu-code">overflow-x: auto</code> 處理寬內容，不會破壞版面配置。',
      },
    },
    classDescriptions: {
      'cu-code-block': '帶有深色背景和圓角的容器',
      'cu-code-block-header': '選用的標頭區域，顯示語言名稱或檔案名稱',
      'cu-code-block-copy': '複製到剪貼簿按鈕',
      'cu-code-block-pre': '預格式化文字包裝器，支援水平捲動',
    },
  },
};
