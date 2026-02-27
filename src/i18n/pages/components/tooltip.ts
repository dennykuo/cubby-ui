import type { Locale } from '../../index';

export const tooltipPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    positions: { title: string; description: string };
    iconButtons: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Tooltip — Cubby UI',
    description: 'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
    category: 'Overlay',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Add <code class="cu-code">cu-tooltip</code> class and <code class="cu-code">data-cu-tooltip</code> attribute with your tooltip text. Pure CSS — no JavaScript required.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      positions: {
        title: 'Positions',
        description: 'Control placement with direction classes: top (default), <code class="cu-code">cu-tooltip-bottom</code>, <code class="cu-code">cu-tooltip-left</code>, and <code class="cu-code">cu-tooltip-right</code>.',
      },
      iconButtons: {
        title: 'On Icon Buttons',
        description: 'Tooltips are essential for icon-only buttons to convey their purpose.',
      },
    },
    classDescriptions: {
      'cu-tooltip': 'Tooltip container, use <code class="cu-code">data-cu-tooltip</code> attribute to set text',
      'cu-tooltip-top': 'Tooltip displayed on top (default)',
      'cu-tooltip-bottom': 'Tooltip displayed on bottom',
      'cu-tooltip-left': 'Tooltip displayed on left',
      'cu-tooltip-right': 'Tooltip displayed on right',
    },
  },
  'zh-tw': {
    title: 'Tooltip — Cubby UI',
    description: '當元素獲得鍵盤焦點或滑鼠懸停時，顯示與該元素相關資訊的彈出提示。',
    category: '浮層',
    sections: {
      usage: {
        title: '使用方式',
        description: '加上 <code class="cu-code">cu-tooltip</code> 類別和 <code class="cu-code">data-cu-tooltip</code> 屬性來設定提示文字。純 CSS——不需要 JavaScript。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      positions: {
        title: '位置',
        description: '透過方向類別控制擺放位置：上方（預設）、<code class="cu-code">cu-tooltip-bottom</code>、<code class="cu-code">cu-tooltip-left</code>、以及 <code class="cu-code">cu-tooltip-right</code>。',
      },
      iconButtons: {
        title: '搭配圖示按鈕',
        description: 'Tooltip 對於僅含圖示的按鈕至關重要，用來傳達按鈕的用途。',
      },
    },
    classDescriptions: {
      'cu-tooltip': 'Tooltip 容器，使用 <code class="cu-code">data-cu-tooltip</code> 屬性設定文字',
      'cu-tooltip-top': 'Tooltip 顯示在上方（預設）',
      'cu-tooltip-bottom': 'Tooltip 顯示在下方',
      'cu-tooltip-left': 'Tooltip 顯示在左側',
      'cu-tooltip-right': 'Tooltip 顯示在右側',
    },
  },
};
