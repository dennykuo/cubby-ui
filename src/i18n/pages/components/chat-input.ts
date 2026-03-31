import type { Locale } from '../../index';

export const chatInputPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withAttach: { title: string; description: string };
    disabled: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Chat Input — Cubby UI',
    description: 'A composable chat input field with auto-growing textarea, send button, and optional attachment button.',
    category: 'AI',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Build a chat input with <code class="cu-code">cu-chat-input</code> container, a <code class="cu-code">cu-chat-input-field</code> textarea, and a <code class="cu-code">cu-chat-input-send</code> button.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withAttach: {
        title: 'With Attachment Button',
        description: 'Add a <code class="cu-code">cu-chat-input-attach</code> button for file upload or media attachment support.',
      },
      disabled: {
        title: 'Disabled State',
        description: 'Disable the send button when the input is empty or while waiting for a response.',
      },
    },
    classDescriptions: {
      'cu-chat-input': 'Input container with border and shadow',
      'cu-chat-input-field': 'Auto-growing textarea',
      'cu-chat-input-actions': 'Button actions container',
      'cu-chat-input-send': 'Send button (primary color)',
      'cu-chat-input-attach': 'Attachment button (ghost style)',
    },
  },
  'zh-tw': {
    title: 'Chat Input — Cubby UI',
    description: '可組合的聊天輸入框，含自動增高文字區域、送出按鈕和可選的附件按鈕。',
    category: 'AI',
    sections: {
      usage: {
        title: '使用方式',
        description: '使用 <code class="cu-code">cu-chat-input</code> 容器、<code class="cu-code">cu-chat-input-field</code> 文字區域和 <code class="cu-code">cu-chat-input-send</code> 按鈕建立聊天輸入框。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withAttach: {
        title: '搭配附件按鈕',
        description: '加入 <code class="cu-code">cu-chat-input-attach</code> 按鈕以支援檔案上傳或媒體附件。',
      },
      disabled: {
        title: '停用狀態',
        description: '當輸入框為空或等待回應時停用送出按鈕。',
      },
    },
    classDescriptions: {
      'cu-chat-input': '輸入容器，帶邊框和陰影',
      'cu-chat-input-field': '自動增高文字區域',
      'cu-chat-input-actions': '按鈕操作容器',
      'cu-chat-input-send': '送出按鈕（主色）',
      'cu-chat-input-attach': '附件按鈕（ghost 風格）',
    },
  },
};
