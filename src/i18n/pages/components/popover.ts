import type { Locale } from '../../index';

export const popoverPage: Record<Locale, {
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
    title: 'Popover — Cubby UI',
    description: 'Displays rich content in a portal, triggered by a button.',
    category: 'Overlay',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Use <code class="cu-code">cu-popover</code> as the wrapper with <code class="cu-code">data-cu-popover</code>, <code class="cu-code">data-cu-popover-trigger</code> on the button, and <code class="cu-code">cu-popover-content</code> with <code class="cu-code">data-cu-popover-content</code> for the panel.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      topPosition: {
        title: 'Top Position',
        description: 'Add <code class="cu-code">bottom-full mb-2</code> utility classes to the content to position above the trigger.',
      },
    },
    classDescriptions: {
      'cu-popover': 'Popover relatively positioned container',
      'cu-popover-content': 'Popover panel, supports absolute positioning and Popover API',
    },
  },
  'zh-tw': {
    title: 'Popover — Cubby UI',
    description: '在浮層中顯示豐富內容，由按鈕觸發。',
    category: '浮層',
    sections: {
      usage: {
        title: '使用方式',
        description: '使用 <code class="cu-code">cu-popover</code> 作為包裝元素並加上 <code class="cu-code">data-cu-popover</code>，在按鈕上使用 <code class="cu-code">data-cu-popover-trigger</code>，面板使用 <code class="cu-code">cu-popover-content</code> 搭配 <code class="cu-code">data-cu-popover-content</code>。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      topPosition: {
        title: '上方位置',
        description: '在內容元素上加上 <code class="cu-code">bottom-full mb-2</code> 工具類別，使其定位在觸發元素上方。',
      },
    },
    classDescriptions: {
      'cu-popover': 'Popover 相對定位容器',
      'cu-popover-content': 'Popover 面板，支援絕對定位和 Popover API',
    },
  },
};
