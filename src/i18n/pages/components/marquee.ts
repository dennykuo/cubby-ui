import type { Locale } from '../../index';

export const marqueePage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    reverse: { title: string; description: string };
    fade: { title: string; description: string };
    pauseOnHover: { title: string; description: string };
    vertical: { title: string; description: string };
    speed: { title: string; description: string };
    logos: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Marquee — Cubby UI',
    description: 'An infinitely scrolling content area, perfect for logo walls, testimonials, or any repeating content.',
    category: 'Data Display',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Place items inside <code class="cu-code">cu-marquee</code>. The content is automatically duplicated to create a seamless loop. Use <code class="cu-code">cu-marquee-item</code> for each item.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      reverse: {
        title: 'Reverse Direction',
        description: 'Add <code class="cu-code">cu-marquee-reverse</code> to scroll in the opposite direction.',
      },
      fade: {
        title: 'Fade Edges',
        description: 'Add <code class="cu-code">cu-marquee-fade</code> to fade the edges for a smoother visual effect.',
      },
      pauseOnHover: {
        title: 'Pause on Hover',
        description: 'Add <code class="cu-code">cu-marquee-pause-on-hover</code> to pause the animation when hovered.',
      },
      vertical: {
        title: 'Vertical',
        description: 'Add <code class="cu-code">cu-marquee-vertical</code> to scroll vertically.',
      },
      speed: {
        title: 'Custom Speed',
        description: 'Set <code class="cu-code">--cu-marquee-duration</code> CSS variable to control speed (default: 30s).',
      },
      logos: {
        title: 'Logo Wall',
        description: 'A common use case: displaying partner or client logos in a continuous loop.',
      },
    },
    classDescriptions: {
      'cu-marquee': 'Container with hidden overflow',
      'cu-marquee-content': 'Inner scrolling track (auto-duplicated)',
      'cu-marquee-item': 'Individual item in the marquee',
      'cu-marquee-reverse': 'Reverse scroll direction',
      'cu-marquee-vertical': 'Vertical scroll mode',
      'cu-marquee-fade': 'Fade edges using CSS mask',
      'cu-marquee-pause-on-hover': 'Pause animation on hover',
    },
  },
  'zh-tw': {
    title: 'Marquee 跑馬燈 — Cubby UI',
    description: '無限滾動的內容區域，適合用於 Logo 牆、客戶評價或任何重複內容的展示。',
    category: 'Data Display',
    sections: {
      usage: {
        title: '使用方式',
        description: '將項目放入 <code class="cu-code">cu-marquee</code> 中。內容會自動複製以建立無縫循環。每個項目使用 <code class="cu-code">cu-marquee-item</code>。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      reverse: {
        title: '反向滾動',
        description: '加上 <code class="cu-code">cu-marquee-reverse</code> 以反向滾動。',
      },
      fade: {
        title: '邊緣淡出',
        description: '加上 <code class="cu-code">cu-marquee-fade</code> 讓邊緣淡出，視覺效果更柔和。',
      },
      pauseOnHover: {
        title: '懸停暫停',
        description: '加上 <code class="cu-code">cu-marquee-pause-on-hover</code> 在滑鼠懸停時暫停動畫。',
      },
      vertical: {
        title: '垂直滾動',
        description: '加上 <code class="cu-code">cu-marquee-vertical</code> 改為垂直滾動。',
      },
      speed: {
        title: '自訂速度',
        description: '設定 <code class="cu-code">--cu-marquee-duration</code> CSS 變數來控制速度（預設 30 秒）。',
      },
      logos: {
        title: 'Logo 牆',
        description: '常見用例：以連續循環方式展示合作夥伴或客戶 Logo。',
      },
    },
    classDescriptions: {
      'cu-marquee': '帶有隱藏溢出的容器',
      'cu-marquee-content': '內部滾動軌道（自動複製）',
      'cu-marquee-item': '跑馬燈中的單個項目',
      'cu-marquee-reverse': '反向滾動方向',
      'cu-marquee-vertical': '垂直滾動模式',
      'cu-marquee-fade': '使用 CSS mask 的邊緣淡出效果',
      'cu-marquee-pause-on-hover': '懸停時暫停動畫',
    },
  },
};
