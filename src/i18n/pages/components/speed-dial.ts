import type { Locale } from '../../index';

export const speedDialPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    expanded: { title: string; description: string };
    positions: { title: string; description: string };
    withLabels: { title: string; description: string };
    small: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Speed Dial — Cubby UI',
    description: 'A floating action button that reveals a set of related actions when triggered. Commonly used for quick access to primary actions.',
    category: 'Navigation',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Use <code class="cu-code">cu-speed-dial</code> with a <code class="cu-code">cu-speed-dial-trigger</code> button and <code class="cu-code">cu-speed-dial-actions</code> container holding <code class="cu-code">cu-speed-dial-action</code> buttons.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      expanded: {
        title: 'Expanded',
        description: 'The speed dial can be shown in its expanded state with actions visible. Click the trigger to toggle.',
      },
      positions: {
        title: 'Positions',
        description: 'Use position classes like <code class="cu-code">cu-speed-dial-bottom-right</code>, <code class="cu-code">cu-speed-dial-bottom-left</code>, <code class="cu-code">cu-speed-dial-top-right</code>, or <code class="cu-code">cu-speed-dial-top-left</code> to place the speed dial.',
      },
      withLabels: {
        title: 'With Labels',
        description: 'Add <code class="cu-code">cu-speed-dial-action-label</code> next to each action button to display descriptive text tooltips.',
      },
      small: {
        title: 'Small',
        description: 'Use <code class="cu-code">cu-speed-dial-sm</code> for a compact speed dial with smaller buttons.',
      },
    },
    classDescriptions: {
      'cu-speed-dial': 'Container for the speed dial component',
      'cu-speed-dial-trigger': 'Main floating action button',
      'cu-speed-dial-actions': 'Container for action buttons',
      'cu-speed-dial-action': 'Individual action wrapper (animation)',
      'cu-speed-dial-action-btn': 'Action button styling',
      'cu-speed-dial-action-label': 'Text label tooltip for an action',
      'cu-speed-dial-bottom-right': 'Position: bottom right (default)',
      'cu-speed-dial-bottom-left': 'Position: bottom left',
      'cu-speed-dial-top-right': 'Position: top right',
      'cu-speed-dial-top-left': 'Position: top left',
      'cu-speed-dial-sm': 'Small size variant',
    },
  },
  'zh-tw': {
    title: 'Speed Dial 快速撥號 — Cubby UI',
    description: '浮動操作按鈕，觸發時展開一組相關操作。常用於快速存取主要功能。',
    category: 'Navigation',
    sections: {
      usage: {
        title: '使用方式',
        description: '使用 <code class="cu-code">cu-speed-dial</code> 搭配 <code class="cu-code">cu-speed-dial-trigger</code> 按鈕和 <code class="cu-code">cu-speed-dial-actions</code> 容器，內含 <code class="cu-code">cu-speed-dial-action</code> 按鈕。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      expanded: {
        title: '展開狀態',
        description: '快速撥號可以展開顯示操作按鈕。點擊觸發按鈕切換展開/收合。',
      },
      positions: {
        title: '位置',
        description: '使用定位類別如 <code class="cu-code">cu-speed-dial-bottom-right</code>、<code class="cu-code">cu-speed-dial-bottom-left</code>、<code class="cu-code">cu-speed-dial-top-right</code> 或 <code class="cu-code">cu-speed-dial-top-left</code> 來放置快速撥號。',
      },
      withLabels: {
        title: '帶標籤',
        description: '在每個操作按鈕旁加入 <code class="cu-code">cu-speed-dial-action-label</code> 以顯示描述性的文字提示。',
      },
      small: {
        title: '小尺寸',
        description: '使用 <code class="cu-code">cu-speed-dial-sm</code> 獲得更緊湊的快速撥號按鈕。',
      },
    },
    classDescriptions: {
      'cu-speed-dial': '快速撥號元件容器',
      'cu-speed-dial-trigger': '主要浮動操作按鈕',
      'cu-speed-dial-actions': '操作按鈕容器',
      'cu-speed-dial-action': '單個操作包裝（動畫）',
      'cu-speed-dial-action-btn': '操作按鈕樣式',
      'cu-speed-dial-action-label': '操作的文字標籤提示',
      'cu-speed-dial-bottom-right': '位置：右下角（預設）',
      'cu-speed-dial-bottom-left': '位置：左下角',
      'cu-speed-dial-top-right': '位置：右上角',
      'cu-speed-dial-top-left': '位置：左上角',
      'cu-speed-dial-sm': '小尺寸變體',
    },
  },
};
