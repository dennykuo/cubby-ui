import type { Locale } from '../../index';

export const hoverCardPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    topPosition: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Hover Card — Cubby UI',
    description: 'For sighted users to preview content available behind a link. Pure CSS — no JavaScript required.',
    category: 'Overlay',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Wrap a trigger element and content with <code class="cu-code">cu-hover-card</code>. The <code class="cu-code">cu-hover-card-content</code> appears on hover. Pure CSS, no JavaScript required.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      topPosition: {
        title: 'Top Position',
        description: 'Use <code class="cu-code">cu-hover-card-content-top</code> to position the card above the trigger.',
      },
    },
    classDescriptions: {
      'cu-hover-card': 'Hover Card relatively positioned container',
      'cu-hover-card-content': 'Hover card panel, displayed below by default',
      'cu-hover-card-content-top': 'Card panel displayed above',
    },
  },
  'zh-tw': {
    title: 'Hover Card — Cubby UI',
    description: '供視覺使用者預覽連結背後的內容。純 CSS——不需要 JavaScript。',
    category: '浮層',
    sections: {
      usage: {
        title: '使用方式',
        description: '用 <code class="cu-code">cu-hover-card</code> 包裝觸發元素和內容。<code class="cu-code">cu-hover-card-content</code> 會在滑鼠懸停時顯示。純 CSS，不需要 JavaScript。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      topPosition: {
        title: '上方位置',
        description: '使用 <code class="cu-code">cu-hover-card-content-top</code> 將卡片定位在觸發元素上方。',
      },
    },
    classDescriptions: {
      'cu-hover-card': 'Hover Card 相對定位容器',
      'cu-hover-card-content': '懸停卡片面板，預設顯示在下方',
      'cu-hover-card-content-top': '卡片面板顯示在上方',
    },
  },
};
