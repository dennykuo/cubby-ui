import type { Locale } from '../../index';

export const notificationPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    unread: { title: string; description: string };
    variants: { title: string; description: string };
    withActions: { title: string; description: string };
    list: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Notification — Cubby UI',
    description: 'Displays a notification item with icon, content, and optional actions. Ideal for notification panels and activity feeds.',
    category: 'Feedback',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Use <code class="cu-code">cu-notification</code> with <code class="cu-code">cu-notification-icon</code>, <code class="cu-code">cu-notification-content</code>, and an optional <code class="cu-code">cu-notification-close</code> button.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      unread: {
        title: 'Unread',
        description: 'Add <code class="cu-code">cu-notification-unread</code> to highlight unread notifications with a subtle background and a dot indicator.',
      },
      variants: {
        title: 'Variants',
        description: 'Use <code class="cu-code">cu-notification-info</code>, <code class="cu-code">cu-notification-success</code>, <code class="cu-code">cu-notification-warning</code>, or <code class="cu-code">cu-notification-destructive</code> for semantic color variants.',
      },
      withActions: {
        title: 'With Actions',
        description: 'Add <code class="cu-code">cu-notification-actions</code> inside the content area to display action buttons.',
      },
      list: {
        title: 'Notification List',
        description: 'Use <code class="cu-code">cu-notification-list</code> to stack multiple notifications with proper spacing and dividers.',
      },
    },
    classDescriptions: {
      'cu-notification': 'Container for a single notification item',
      'cu-notification-icon': 'Icon area on the left',
      'cu-notification-content': 'Main content area (title, description, time)',
      'cu-notification-title': 'Notification title text',
      'cu-notification-description': 'Notification description text',
      'cu-notification-time': 'Timestamp text',
      'cu-notification-close': 'Close/dismiss button',
      'cu-notification-actions': 'Action buttons container',
      'cu-notification-unread': 'Unread state with background highlight',
      'cu-notification-info': 'Info variant (blue)',
      'cu-notification-success': 'Success variant (green)',
      'cu-notification-warning': 'Warning variant (amber)',
      'cu-notification-destructive': 'Destructive variant (red)',
      'cu-notification-list': 'Container for stacking multiple notifications',
    },
  },
  'zh-tw': {
    title: 'Notification 通知 — Cubby UI',
    description: '顯示包含圖示、內容和可選操作的通知項目。適用於通知面板和活動動態。',
    category: 'Feedback',
    sections: {
      usage: {
        title: '使用方式',
        description: '使用 <code class="cu-code">cu-notification</code> 搭配 <code class="cu-code">cu-notification-icon</code>、<code class="cu-code">cu-notification-content</code>，以及可選的 <code class="cu-code">cu-notification-close</code> 按鈕。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      unread: {
        title: '未讀',
        description: '加上 <code class="cu-code">cu-notification-unread</code> 以淺色背景和圓點指示器標示未讀通知。',
      },
      variants: {
        title: '變體',
        description: '使用 <code class="cu-code">cu-notification-info</code>、<code class="cu-code">cu-notification-success</code>、<code class="cu-code">cu-notification-warning</code> 或 <code class="cu-code">cu-notification-destructive</code> 設定語意色彩變體。',
      },
      withActions: {
        title: '帶操作按鈕',
        description: '在內容區域內加入 <code class="cu-code">cu-notification-actions</code> 以顯示操作按鈕。',
      },
      list: {
        title: '通知列表',
        description: '使用 <code class="cu-code">cu-notification-list</code> 堆疊多個通知，並帶有適當的間距和分隔線。',
      },
    },
    classDescriptions: {
      'cu-notification': '單個通知項目的容器',
      'cu-notification-icon': '左側圖示區域',
      'cu-notification-content': '主要內容區域（標題、描述、時間）',
      'cu-notification-title': '通知標題文字',
      'cu-notification-description': '通知描述文字',
      'cu-notification-time': '時間戳文字',
      'cu-notification-close': '關閉/忽略按鈕',
      'cu-notification-actions': '操作按鈕容器',
      'cu-notification-unread': '未讀狀態，帶有背景高亮',
      'cu-notification-info': '資訊變體（藍色）',
      'cu-notification-success': '成功變體（綠色）',
      'cu-notification-warning': '警告變體（琥珀色）',
      'cu-notification-destructive': '危險變體（紅色）',
      'cu-notification-list': '堆疊多個通知的容器',
    },
  },
};
