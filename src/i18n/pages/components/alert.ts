import type { Locale } from '../../index';

export const alertPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    variants: { title: string; description: string };
    withIcon: { title: string; description: string };
    iconsForEveryVariant: { title: string; description: string };
    withAction: { title: string; description: string };
    descriptionOnly: { title: string; description: string };
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
      withIcon: {
        title: 'With Icon',
        description: 'Place an SVG icon as the first child. The alert will automatically add left padding via <code class="cu-code">[&:has(svg)]:pl-10</code>.',
      },
      iconsForEveryVariant: {
        title: 'Icons for Every Variant',
        description: 'Each variant pairs well with a matching icon — checkmark for success, triangle for warning, info circle for info, and exclamation for errors.',
      },
      withAction: {
        title: 'With Action',
        description: 'Embed buttons inside the description for actionable alerts.',
      },
      descriptionOnly: {
        title: 'Description Only',
        description: 'The title is optional — use description alone for a compact inline message.',
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
      withIcon: {
        title: '搭配圖示',
        description: '將 SVG 圖示放在第一個子元素。Alert 會透過 <code class="cu-code">[&:has(svg)]:pl-10</code> 自動加入左側內距。',
      },
      iconsForEveryVariant: {
        title: '各變體搭配圖示',
        description: '每種變體都適合搭配對應的圖示 — 勾號代表成功、三角形代表警告、資訊圓圈代表提示、驚嘆號代表錯誤。',
      },
      withAction: {
        title: '搭配操作按鈕',
        description: '在描述區塊內嵌入按鈕，打造可操作的提示。',
      },
      descriptionOnly: {
        title: '僅描述',
        description: '標題為選用 — 單獨使用描述即可呈現精簡的行內訊息。',
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
    },
  },
};
