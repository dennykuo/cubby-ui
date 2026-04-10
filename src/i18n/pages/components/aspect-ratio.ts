import type { Locale } from '../../index';

export const aspectRatioPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    ratios: { title: string; description: string };
    iframe: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Aspect Ratio — Cubby UI',
    description: 'Displays content within a fixed aspect ratio container.',
    category: 'Layout',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Apply <code class="cu-code">cu-aspect-ratio</code> as the base class with a ratio modifier such as <code class="cu-code">cu-aspect-ratio-16/9</code>.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      ratios: {
        title: 'Ratios',
        description: 'Compare different aspect ratios side by side.',
      },
      iframe: {
        title: 'With Iframe',
        description: 'Embed maps, videos, or other iframe content in a fixed ratio.',
      },
    },
    classDescriptions: {
      'cu-aspect-ratio': 'Base container with child positioning',
      'cu-aspect-ratio-16/9': '16:9 widescreen ratio',
      'cu-aspect-ratio-4/3': '4:3 standard ratio',
      'cu-aspect-ratio-1/1': '1:1 square ratio',
      'cu-aspect-ratio-21/9': '21:9 ultra-wide ratio',
      'cu-aspect-ratio-3/2': '3:2 photography ratio',
      'cu-aspect-ratio-2/3': '2:3 portrait photography ratio',
      'cu-aspect-ratio-9/16': '9:16 vertical video ratio (Stories, Reels)',
      'cu-aspect-ratio-3/4': '3:4 portrait ratio',
      'cu-aspect-ratio-5/4': '5:4 large format ratio',
    },
  },
  'zh-tw': {
    title: 'Aspect Ratio — Cubby UI',
    description: '在固定長寬比容器中顯示內容。',
    category: '版面',
    sections: {
      usage: {
        title: '使用方式',
        description: '以 <code class="cu-code">cu-aspect-ratio</code> 作為基礎類別，搭配比例修飾類別如 <code class="cu-code">cu-aspect-ratio-16/9</code>。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      ratios: {
        title: '比例',
        description: '並排比較不同的長寬比。',
      },
      iframe: {
        title: '搭配 Iframe',
        description: '在固定比例中嵌入地圖、影片或其他 iframe 內容。',
      },
    },
    classDescriptions: {
      'cu-aspect-ratio': '基礎容器，含子元素定位',
      'cu-aspect-ratio-16/9': '16:9 寬螢幕比例',
      'cu-aspect-ratio-4/3': '4:3 標準比例',
      'cu-aspect-ratio-1/1': '1:1 正方形比例',
      'cu-aspect-ratio-21/9': '21:9 超寬比例',
      'cu-aspect-ratio-3/2': '3:2 攝影比例',
      'cu-aspect-ratio-2/3': '2:3 直式攝影比例',
      'cu-aspect-ratio-9/16': '9:16 直式影片比例（Stories、Reels）',
      'cu-aspect-ratio-3/4': '3:4 直式比例',
      'cu-aspect-ratio-5/4': '5:4 大片幅比例',
    },
  },
};
