import type { Locale } from '../../index';

export const imageComparePage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withLabels: { title: string; description: string };
    vertical: { title: string; description: string };
    initialPosition: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Image Compare — Cubby UI',
    description: 'A before/after image comparison slider with a draggable handle to reveal differences between two images.',
    category: 'Data Display',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Use <code class="cu-code">cu-image-compare</code> with <code class="cu-code">data-cu-image-compare</code>. Place the "after" image first and the "before" image inside <code class="cu-code">cu-image-compare-before</code>. Add a <code class="cu-code">cu-image-compare-handle</code> for the drag control.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withLabels: {
        title: 'With Labels',
        description: 'Add <code class="cu-code">cu-image-compare-label</code> elements inside the before and after containers to display descriptive labels.',
      },
      vertical: {
        title: 'Vertical',
        description: 'Add <code class="cu-code">cu-image-compare-vertical</code> to switch to a vertical comparison slider.',
      },
      initialPosition: {
        title: 'Initial Position',
        description: 'Use <code class="cu-code">data-cu-image-compare-position</code> to set the initial handle position (0\u2013100). Defaults to 50.',
      },
    },
    classDescriptions: {
      'cu-image-compare': 'Container for the image comparison slider',
      'cu-image-compare-before': 'Wrapper for the "before" image (clipped)',
      'cu-image-compare-after': 'Wrapper for the "after" image (background)',
      'cu-image-compare-handle': 'Draggable handle container',
      'cu-image-compare-handle-line': 'Vertical line on the handle',
      'cu-image-compare-handle-grip': 'Circular grip icon on the handle',
      'cu-image-compare-label': 'Label overlay on before/after images',
      'cu-image-compare-vertical': 'Vertical comparison mode',
    },
  },
  'zh-tw': {
    title: 'Image Compare 圖片比較 — Cubby UI',
    description: '前後對比的圖片比較滑桿，透過可拖曳的把手來揭示兩張圖片之間的差異。',
    category: 'Data Display',
    sections: {
      usage: {
        title: '使用方式',
        description: '使用 <code class="cu-code">cu-image-compare</code> 搭配 <code class="cu-code">data-cu-image-compare</code>。將「後」圖片放在前面，「前」圖片放在 <code class="cu-code">cu-image-compare-before</code> 內。加入 <code class="cu-code">cu-image-compare-handle</code> 作為拖曳控制。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withLabels: {
        title: '帶標籤',
        description: '在前後容器內加入 <code class="cu-code">cu-image-compare-label</code> 元素以顯示描述性標籤。',
      },
      vertical: {
        title: '垂直模式',
        description: '加上 <code class="cu-code">cu-image-compare-vertical</code> 切換為垂直比較滑桿。',
      },
      initialPosition: {
        title: '初始位置',
        description: '使用 <code class="cu-code">data-cu-image-compare-position</code> 設定把手的初始位置（0\u2013100）。預設為 50。',
      },
    },
    classDescriptions: {
      'cu-image-compare': '圖片比較滑桿容器',
      'cu-image-compare-before': '「前」圖片包裝器（裁切）',
      'cu-image-compare-after': '「後」圖片包裝器（背景）',
      'cu-image-compare-handle': '可拖曳的把手容器',
      'cu-image-compare-handle-line': '把手上的垂直線',
      'cu-image-compare-handle-grip': '把手上的圓形握把圖示',
      'cu-image-compare-label': '前後圖片上的標籤覆蓋',
      'cu-image-compare-vertical': '垂直比較模式',
    },
  },
};
