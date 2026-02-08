import type { Locale } from '../../index';

export const rangePage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withLabel: { title: string; description: string };
    minMaxStep: { title: string; description: string };
    disabled: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Range — Cubby UI',
    description: 'Displays a range slider for selecting a numeric value within a range.',
    category: 'Forms',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Apply <code class="cu-code">cu-range</code> to an <code class="cu-code">&lt;input type="range"&gt;</code> element.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withLabel: {
        title: 'With Label',
        description: 'Pair with a <code class="cu-code">cu-label</code> for accessible form fields.',
      },
      minMaxStep: {
        title: 'Min / Max / Step',
        description: 'Customize the range with <code class="cu-code">min</code>, <code class="cu-code">max</code>, and <code class="cu-code">step</code> attributes.',
      },
      disabled: {
        title: 'Disabled',
        description: 'Add the <code class="cu-code">disabled</code> attribute to prevent interaction.',
      },
    },
    classDescriptions: {
      'cu-range': 'Slider style with custom thumb and hover glow effect',
    },
  },
  'zh-tw': {
    title: 'Range — Cubby UI',
    description: '顯示範圍滑桿，用於在範圍內選擇數值。',
    category: '表單',
    sections: {
      usage: {
        title: '使用方式',
        description: '將 <code class="cu-code">cu-range</code> 套用至 <code class="cu-code">&lt;input type="range"&gt;</code> 元素。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withLabel: {
        title: '帶標籤',
        description: '搭配 <code class="cu-code">cu-label</code> 以提供無障礙表單欄位。',
      },
      minMaxStep: {
        title: '最小 / 最大 / 步進',
        description: '使用 <code class="cu-code">min</code>、<code class="cu-code">max</code> 和 <code class="cu-code">step</code> 屬性自訂範圍。',
      },
      disabled: {
        title: '停用',
        description: '加入 <code class="cu-code">disabled</code> 屬性以防止互動。',
      },
    },
    classDescriptions: {
      'cu-range': '滑桿樣式，含自訂滑塊與 hover 光暈效果',
    },
  },
};
