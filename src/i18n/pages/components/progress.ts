import type { Locale } from '../../index';

export const progressPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    sizes: { title: string; description: string };
    differentValues: { title: string; description: string };
    colorVariants: { title: string; description: string };
    withLabel: { title: string; description: string };
    customColors: { title: string; description: string };
    striped: { title: string; description: string };
    multiSegment: { title: string; description: string };
    circular: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Progress — Cubby UI',
    description: 'Displays an indicator showing the completion progress of a task.',
    category: 'Feedback',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Use <code class="cu-code">cu-progress</code> as the track and <code class="cu-code">cu-progress-bar</code> as the fill. Set the width with an inline style.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      sizes: {
        title: 'Sizes',
        description: 'Add <code class="cu-code">cu-progress-sm</code> or <code class="cu-code">cu-progress-lg</code> to the track to change the bar height.',
      },
      differentValues: {
        title: 'Different Values',
        description: 'Adjust the <code class="cu-code">width</code> percentage to indicate progress.',
      },
      colorVariants: {
        title: 'Color Variants',
        description: 'Use semantic color classes on the bar: <code class="cu-code">cu-progress-bar-success</code>, <code class="cu-code">cu-progress-bar-warning</code>, <code class="cu-code">cu-progress-bar-destructive</code>, or <code class="cu-code">cu-progress-bar-info</code>.',
      },
      withLabel: {
        title: 'With Label',
        description: 'Wrap the progress bar in <code class="cu-code">cu-progress-wrapper</code> and add <code class="cu-code">cu-progress-label</code> and <code class="cu-code">cu-progress-value</code> for context.',
      },
      customColors: {
        title: 'Custom Colors',
        description: 'Override the bar color by adding a background utility class to <code class="cu-code">cu-progress-bar</code>.',
      },
      striped: {
        title: 'Striped',
        description: 'Add <code class="cu-code">cu-progress-bar-striped</code> for a striped pattern. Combine with <code class="cu-code">cu-progress-bar-striped-animated</code> for a moving stripe animation.',
      },
      multiSegment: {
        title: 'Multi-Segment',
        description: 'Use <code class="cu-code">cu-progress-multi</code> to display multiple colored segments in a single progress bar, useful for usage breakdowns or category distributions.',
      },
      circular: {
        title: 'Circular Progress',
        description: 'Use <code class="cu-code">cu-progress-circular</code> for SVG-based ring progress indicators. Set <code class="cu-code">stroke-dasharray</code> to the circle circumference and <code class="cu-code">stroke-dashoffset</code> to control the fill level.',
      },
    },
    classDescriptions: {
      'cu-progress': 'Progress bar outer track',
      'cu-progress-bar': 'Progress bar fill, width represents progress',
      'cu-progress-sm': 'Small track height (4px)',
      'cu-progress-lg': 'Large track height (16px)',
      'cu-progress-bar-success': 'Success color fill',
      'cu-progress-bar-warning': 'Warning color fill',
      'cu-progress-bar-destructive': 'Destructive color fill',
      'cu-progress-bar-info': 'Info color fill',
      'cu-progress-wrapper': 'Flex container for label + bar + value layout',
      'cu-progress-label': 'Text label on the left',
      'cu-progress-value': 'Percentage value on the right',
      'cu-progress-bar-striped': 'Striped pattern overlay on progress bar',
      'cu-progress-bar-striped-animated': 'Animated stripes (add with cu-progress-bar-striped)',
      'cu-progress-multi': 'Multi-segment progress container',
      'cu-progress-circular': 'Circular SVG progress container',
      'cu-progress-circular-track': 'Circular background track',
      'cu-progress-circular-bar': 'Circular progress bar stroke',
      'cu-progress-circular-value': 'Centered value label',
      'cu-progress-circular-indeterminate': 'Spinning animation for indeterminate state',
    },
  },
  'zh-tw': {
    title: 'Progress — Cubby UI',
    description: '顯示任務完成進度的指示器。',
    category: '回饋',
    sections: {
      usage: {
        title: '使用方式',
        description: '使用 <code class="cu-code">cu-progress</code> 作為軌道，<code class="cu-code">cu-progress-bar</code> 作為填充。透過行內樣式設定寬度。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      sizes: {
        title: '尺寸',
        description: '在軌道上加入 <code class="cu-code">cu-progress-sm</code> 或 <code class="cu-code">cu-progress-lg</code> 以改變高度。',
      },
      differentValues: {
        title: '不同數值',
        description: '調整 <code class="cu-code">width</code> 百分比來表示進度。',
      },
      colorVariants: {
        title: '顏色變體',
        description: '在填充條上使用語意顏色類別：<code class="cu-code">cu-progress-bar-success</code>、<code class="cu-code">cu-progress-bar-warning</code>、<code class="cu-code">cu-progress-bar-destructive</code> 或 <code class="cu-code">cu-progress-bar-info</code>。',
      },
      withLabel: {
        title: '帶標籤',
        description: '以 <code class="cu-code">cu-progress-wrapper</code> 包裹進度條，加入 <code class="cu-code">cu-progress-label</code> 和 <code class="cu-code">cu-progress-value</code> 提供上下文資訊。',
      },
      customColors: {
        title: '自訂顏色',
        description: '在 <code class="cu-code">cu-progress-bar</code> 上加入背景工具類別來覆蓋填充顏色。',
      },
      striped: {
        title: '條紋',
        description: '加入 <code class="cu-code">cu-progress-bar-striped</code> 以顯示條紋圖案。搭配 <code class="cu-code">cu-progress-bar-striped-animated</code> 可產生移動條紋動畫。',
      },
      multiSegment: {
        title: '多段進度條',
        description: '使用 <code class="cu-code">cu-progress-multi</code> 在單一進度條中顯示多個彩色段落，適用於用量分佈或類別佔比。',
      },
      circular: {
        title: '環形進度條',
        description: '使用 <code class="cu-code">cu-progress-circular</code> 建立基於 SVG 的環形進度指示器。設定 <code class="cu-code">stroke-dasharray</code> 為圓周長，<code class="cu-code">stroke-dashoffset</code> 控制填充量。',
      },
    },
    classDescriptions: {
      'cu-progress': '進度條外層軌道',
      'cu-progress-bar': '進度條填充，寬度代表進度',
      'cu-progress-sm': '較小的軌道高度（4px）',
      'cu-progress-lg': '較大的軌道高度（16px）',
      'cu-progress-bar-success': '成功色填充',
      'cu-progress-bar-warning': '警告色填充',
      'cu-progress-bar-destructive': '危險色填充',
      'cu-progress-bar-info': '資訊色填充',
      'cu-progress-wrapper': '標籤 + 進度條 + 數值的 Flex 容器',
      'cu-progress-label': '左側文字標籤',
      'cu-progress-value': '右側百分比數值',
      'cu-progress-bar-striped': '進度條條紋圖案',
      'cu-progress-bar-striped-animated': '條紋動畫（搭配 cu-progress-bar-striped）',
      'cu-progress-multi': '多段進度條容器',
      'cu-progress-circular': '環形 SVG 進度條容器',
      'cu-progress-circular-track': '環形背景軌道',
      'cu-progress-circular-bar': '環形進度條描邊',
      'cu-progress-circular-value': '置中數值標籤',
      'cu-progress-circular-indeterminate': '不確定狀態旋轉動畫',
    },
  },
};
