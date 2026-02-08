import type { Locale } from '../../index';

export const progressPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    differentValues: { title: string; description: string };
    customColors: { title: string; description: string };
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
      differentValues: {
        title: 'Different Values',
        description: 'Adjust the <code class="cu-code">width</code> percentage to indicate progress.',
      },
      customColors: {
        title: 'Custom Colors',
        description: 'Override the bar color by adding a background utility class to <code class="cu-code">cu-progress-bar</code>.',
      },
    },
    classDescriptions: {
      'cu-progress': 'Progress bar outer track',
      'cu-progress-bar': 'Progress bar fill, width represents progress',
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
      differentValues: {
        title: '不同數值',
        description: '調整 <code class="cu-code">width</code> 百分比來表示進度。',
      },
      customColors: {
        title: '自訂顏色',
        description: '在 <code class="cu-code">cu-progress-bar</code> 上加入背景工具類別來覆蓋填充顏色。',
      },
    },
    classDescriptions: {
      'cu-progress': '進度條外層軌道',
      'cu-progress-bar': '進度條填充，寬度代表進度',
    },
  },
};
