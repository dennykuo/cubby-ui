import type { Locale } from '../../index';

export const alertPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    variants: { title: string; description: string };
    iconsForEveryVariant: { title: string; description: string };
    withAction: { title: string; description: string };
    closable: { title: string; description: string };
    descriptionOnly: { title: string; description: string };
    accent: { title: string; description: string };
    expandable: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Alert — Cubby UI',
    description: 'Displays a callout for important information or feedback.',
    category: 'Feedback',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Use <code class="cu-code">cu-alert</code> as the base class with a variant. Add <code class="cu-code">cu-alert-title</code> and <code class="cu-code">cu-alert-description</code> inside.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      variants: {
        title: 'Variants',
        description: 'Use variant classes to convey different levels of importance.',
      },
      iconsForEveryVariant: {
        title: 'Icons for Every Variant',
        description: 'Each variant pairs well with a matching icon — checkmark for success, triangle for warning, info circle for info, and exclamation for errors.',
      },
      withAction: {
        title: 'With Action',
        description: 'Embed buttons inside the description for actionable alerts.',
      },
      closable: {
        title: 'Closable',
        description: 'Add <code class="cu-code">cu-alert-closable</code> for right padding and a <code class="cu-code">cu-alert-close</code> button to dismiss the alert.',
      },
      descriptionOnly: {
        title: 'Description Only',
        description: 'The title is optional — use description alone for a compact inline message.',
      },
      accent: {
        title: 'Accent Border',
        description: 'Add <code class="cu-code">cu-alert-accent</code> for a prominent left border stripe. Combines with any variant.',
      },
      expandable: {
        title: 'Expandable',
        description: 'Add <code class="cu-code">data-cu-alert-expandable</code> to create an alert with collapsible detail content. The expand trigger toggles the <code class="cu-code">cu-alert-expandable-content</code> area with a smooth height animation.',
      },
    },
    classDescriptions: {
      'cu-alert': 'Alert base container with rounded corners, border, and SVG icon positioning',
      'cu-alert-default': 'Default variant style',
      'cu-alert-destructive': 'Destructive / error variant style',
      'cu-alert-success': 'Success variant style',
      'cu-alert-warning': 'Warning variant style',
      'cu-alert-info': 'Info variant style',
      'cu-alert-title': 'Alert title',
      'cu-alert-description': 'Alert description text',
      'cu-alert-closable': 'Adds right padding for the close button',
      'cu-alert-close': 'Close button, absolutely positioned top-right',
      'cu-alert-accent': 'Left accent border stripe (use with a variant)',
      'cu-alert-expandable-content': 'Expandable content area with height animation',
      'cu-alert-expand-trigger': 'Toggle button for expandable content',
    },
  },
  'zh-tw': {
    title: 'Alert — Cubby UI',
    description: '顯示重要資訊或回饋的提示框。',
    category: '回饋',
    sections: {
      usage: {
        title: '使用方式',
        description: '使用 <code class="cu-code">cu-alert</code> 作為基礎類別並搭配變體。內部加入 <code class="cu-code">cu-alert-title</code> 和 <code class="cu-code">cu-alert-description</code>。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      variants: {
        title: '變體',
        description: '使用變體類別來傳達不同的重要程度。',
      },
      iconsForEveryVariant: {
        title: '各變體搭配圖示',
        description: '每種變體都適合搭配對應的圖示 — 勾號代表成功、三角形代表警告、資訊圓圈代表提示、驚嘆號代表錯誤。',
      },
      withAction: {
        title: '搭配操作按鈕',
        description: '在描述區塊內嵌入按鈕，打造可操作的提示。',
      },
      closable: {
        title: '可關閉',
        description: '加上 <code class="cu-code">cu-alert-closable</code> 預留右側空間，搭配 <code class="cu-code">cu-alert-close</code> 按鈕以關閉提示。',
      },
      descriptionOnly: {
        title: '僅描述',
        description: '標題為選用 — 單獨使用描述即可呈現精簡的行內訊息。',
      },
      accent: {
        title: '重音邊框',
        description: '加入 <code class="cu-code">cu-alert-accent</code> 以顯示醒目的左側邊框條紋。可搭配任何變體使用。',
      },
      expandable: {
        title: '可展開',
        description: '加入 <code class="cu-code">data-cu-alert-expandable</code> 建立帶有可摺疊詳細內容的警示。展開觸發器以平滑的高度動畫切換 <code class="cu-code">cu-alert-expandable-content</code> 區域。',
      },
    },
    classDescriptions: {
      'cu-alert': 'Alert 基礎容器，含圓角、邊框及 SVG 圖示定位',
      'cu-alert-default': '預設變體樣式',
      'cu-alert-destructive': '危險 / 錯誤變體樣式',
      'cu-alert-success': '成功變體樣式',
      'cu-alert-warning': '警告變體樣式',
      'cu-alert-info': '資訊變體樣式',
      'cu-alert-title': 'Alert 標題',
      'cu-alert-description': 'Alert 描述文字',
      'cu-alert-closable': '為關閉按鈕預留右側 padding',
      'cu-alert-close': '關閉按鈕，絕對定位於右上角',
      'cu-alert-accent': '左側重音邊框條紋（搭配變體使用）',
      'cu-alert-expandable-content': '帶高度動畫的可展開內容區',
      'cu-alert-expand-trigger': '可展開內容的切換按鈕',
    },
  },
};
