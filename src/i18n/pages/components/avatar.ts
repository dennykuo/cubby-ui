import type { Locale } from '../../index';

export const avatarPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    sizes: { title: string; description: string };
    withFallback: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Avatar — Cubby UI',
    description: 'An image element with a fallback for representing the user.',
    category: 'Data Display',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Use <code class="cu-code">cu-avatar</code> as the container with a size class. Inside, place <code class="cu-code">cu-avatar-image</code> and <code class="cu-code">cu-avatar-fallback</code>.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      sizes: {
        title: 'Sizes',
        description: 'Three sizes are available — <code class="cu-code">cu-avatar-sm</code>, <code class="cu-code">cu-avatar-md</code> (default), and <code class="cu-code">cu-avatar-lg</code>.',
      },
      withFallback: {
        title: 'With Fallback',
        description: 'When no image is provided, the fallback with initials is displayed.',
      },
    },
    classDescriptions: {
      'cu-avatar': 'Avatar container with circular clipping',
      'cu-avatar-sm': 'Small size (32px)',
      'cu-avatar-md': 'Medium size (40px, default)',
      'cu-avatar-lg': 'Large size (48px)',
      'cu-avatar-image': 'Avatar image, aspect-fill',
      'cu-avatar-fallback': 'Fallback display when image fails to load',
    },
  },
  'zh-tw': {
    title: 'Avatar — Cubby UI',
    description: '帶有備用顯示的圖片元素，用於代表使用者。',
    category: '資料展示',
    sections: {
      usage: {
        title: '使用方式',
        description: '以 <code class="cu-code">cu-avatar</code> 作為容器並搭配尺寸類別。內部放置 <code class="cu-code">cu-avatar-image</code> 和 <code class="cu-code">cu-avatar-fallback</code>。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      sizes: {
        title: '尺寸',
        description: '提供三種尺寸 — <code class="cu-code">cu-avatar-sm</code>、<code class="cu-code">cu-avatar-md</code>（預設）和 <code class="cu-code">cu-avatar-lg</code>。',
      },
      withFallback: {
        title: '備用顯示',
        description: '當未提供圖片時，會顯示帶有首字母的備用內容。',
      },
    },
    classDescriptions: {
      'cu-avatar': '頭像容器，圓形裁切',
      'cu-avatar-sm': '小尺寸（32px）',
      'cu-avatar-md': '中尺寸（40px，預設）',
      'cu-avatar-lg': '大尺寸（48px）',
      'cu-avatar-image': '頭像圖片，填滿裁切',
      'cu-avatar-fallback': '圖片載入失敗時的備用顯示',
    },
  },
};
