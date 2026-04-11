import type { Locale } from '../../index';

export const stepsPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withDescriptions: { title: string; description: string };
    vertical: { title: string; description: string };
    error: { title: string; description: string };
    clickable: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Steps — Cubby UI',
    description: 'A step indicator for multi-step workflows and wizards.',
    category: 'Navigation',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Use <code class="cu-code">cu-steps</code> as the container, with <code class="cu-code">cu-steps-item</code> for each step and <code class="cu-code">cu-steps-separator</code> between them. Apply <code class="cu-code">cu-steps-item-completed</code>, <code class="cu-code">cu-steps-item-active</code>, or <code class="cu-code">cu-steps-item-upcoming</code> for state styling.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withDescriptions: {
        title: 'With Descriptions',
        description: 'Add <code class="cu-code">cu-steps-description</code> below the title for additional context.',
      },
      vertical: {
        title: 'Vertical',
        description: 'Use <code class="cu-code">cu-steps-vertical</code> for a vertical layout, suitable for order tracking or timelines.',
      },
      error: {
        title: 'Error State',
        description: 'Highlight a failed step with destructive colors to indicate an issue that needs attention.',
      },
      clickable: {
        title: 'Clickable Steps',
        description: 'Use <code class="cu-code">&lt;button&gt;</code> elements for steps that allow navigation to previous stages.',
      },
    },
    classDescriptions: {
      'cu-steps': 'Steps container, horizontal layout',
      'cu-steps-vertical': 'Vertical layout modifier',
      'cu-steps-item': 'Single step item',
      'cu-steps-item-completed': 'Completed state',
      'cu-steps-item-active': 'Current / in-progress state',
      'cu-steps-item-upcoming': 'Pending state',
      'cu-steps-item-error': 'Error state with destructive styling',
      'cu-steps-number': 'Step number circle',
      'cu-steps-content': 'Step text content area',
      'cu-steps-title': 'Step title',
      'cu-steps-description': 'Step description text',
      'cu-steps-separator': 'Connector line between steps',
    },
  },
  'zh-tw': {
    title: 'Steps — Cubby UI',
    description: '用於多步驟流程與精靈的步驟指示器。',
    category: '導航',
    sections: {
      usage: {
        title: '使用方式',
        description: '使用 <code class="cu-code">cu-steps</code> 作為容器，每個步驟使用 <code class="cu-code">cu-steps-item</code>，步驟之間使用 <code class="cu-code">cu-steps-separator</code>。套用 <code class="cu-code">cu-steps-item-completed</code>、<code class="cu-code">cu-steps-item-active</code> 或 <code class="cu-code">cu-steps-item-upcoming</code> 來設定狀態樣式。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withDescriptions: {
        title: '帶描述',
        description: '在標題下方加入 <code class="cu-code">cu-steps-description</code> 以提供額外說明。',
      },
      vertical: {
        title: '垂直排列',
        description: '使用 <code class="cu-code">cu-steps-vertical</code> 切換為垂直佈局，適合訂單追蹤或時間軸。',
      },
      error: {
        title: '錯誤狀態',
        description: '以 destructive 色彩標示失敗的步驟，提示需要注意的問題。',
      },
      clickable: {
        title: '可點擊步驟',
        description: '使用 <code class="cu-code">&lt;button&gt;</code> 元素建立可導航至先前階段的步驟。',
      },
    },
    classDescriptions: {
      'cu-steps': '步驟容器，水平佈局',
      'cu-steps-vertical': '垂直佈局修飾器',
      'cu-steps-item': '單一步驟項目',
      'cu-steps-item-completed': '已完成狀態',
      'cu-steps-item-active': '目前 / 進行中狀態',
      'cu-steps-item-upcoming': '待進行狀態',
      'cu-steps-item-error': '錯誤狀態，使用破壞性樣式',
      'cu-steps-number': '步驟數字圓圈',
      'cu-steps-content': '步驟文字內容區域',
      'cu-steps-title': '步驟標題',
      'cu-steps-description': '步驟描述文字',
      'cu-steps-separator': '步驟之間的連接線',
    },
  },
};
