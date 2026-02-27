import type { Locale } from '../../index';

export const kbdPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    sizes: { title: string; description: string };
    combinations: { title: string; description: string };
    inContext: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Kbd — Cubby UI',
    description: 'Displays a keyboard key or shortcut in a styled inline element.',
    category: 'Typography',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Apply <code class="cu-code">cu-kbd</code> to a <code class="cu-code">&lt;kbd&gt;</code> element to display a keyboard key.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      sizes: {
        title: 'Sizes',
        description: 'Three sizes are available — <code class="cu-code">cu-kbd-sm</code> for compact contexts and <code class="cu-code">cu-kbd-lg</code> for more prominent display.',
      },
      combinations: {
        title: 'Key Combinations',
        description: 'Combine multiple keys with a separator character to display keyboard shortcuts.',
      },
      inContext: {
        title: 'In Context',
        description: 'Kbd elements pair well with Menubar shortcuts and Tooltip hints.',
      },
    },
    classDescriptions: {
      'cu-kbd': 'Base keyboard key with raised border effect',
      'cu-kbd-sm': 'Small size',
      'cu-kbd-lg': 'Large size',
    },
  },
  'zh-tw': {
    title: 'Kbd — Cubby UI',
    description: '以樣式化行內元素顯示鍵盤按鍵或快捷鍵。',
    category: '排版',
    sections: {
      usage: {
        title: '使用方式',
        description: '將 <code class="cu-code">cu-kbd</code> 套用至 <code class="cu-code">&lt;kbd&gt;</code> 元素以顯示鍵盤按鍵。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      sizes: {
        title: '尺寸',
        description: '提供三種尺寸 — <code class="cu-code">cu-kbd-sm</code> 適用於緊湊場景，<code class="cu-code">cu-kbd-lg</code> 適用於更顯眼的展示。',
      },
      combinations: {
        title: '組合鍵',
        description: '結合多個按鍵和分隔字元來顯示鍵盤快捷鍵。',
      },
      inContext: {
        title: '實際使用',
        description: 'Kbd 元素與 Menubar 快捷鍵和 Tooltip 提示搭配使用效果良好。',
      },
    },
    classDescriptions: {
      'cu-kbd': '基礎鍵盤按鍵，帶浮凸邊框效果',
      'cu-kbd-sm': '小尺寸',
      'cu-kbd-lg': '大尺寸',
    },
  },
};
