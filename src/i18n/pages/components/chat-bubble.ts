import type { Locale } from '../../index';

export const chatBubblePage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    userMessage: { title: string; description: string };
    withAvatar: { title: string; description: string };
    withActions: { title: string; description: string };
    prose: { title: string; description: string };
    conversation: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Chat Bubble — Cubby UI',
    description: 'Displays a chat message bubble with support for user and assistant variants, avatars, timestamps, and action buttons.',
    category: 'AI',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Build a chat bubble with <code class="cu-code">cu-chat-bubble</code> container. Use <code class="cu-code">cu-chat-bubble-assistant</code> for AI messages and <code class="cu-code">cu-chat-bubble-user</code> for user messages.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      userMessage: {
        title: 'User Message',
        description: 'Add <code class="cu-code">cu-chat-bubble-user</code> for right-aligned user messages with primary color background.',
      },
      withAvatar: {
        title: 'With Avatar',
        description: 'Use <code class="cu-code">cu-chat-bubble-avatar</code> to display sender avatar alongside the message.',
      },
      withActions: {
        title: 'With Actions',
        description: 'Add <code class="cu-code">cu-chat-bubble-actions</code> with <code class="cu-code">cu-chat-bubble-action</code> buttons for copy, regenerate, or feedback.',
      },
      prose: {
        title: 'Markdown / Prose',
        description: 'Add <code class="cu-code">cu-chat-bubble-message-prose</code> to support formatted content like code blocks, lists, and paragraphs inside assistant messages.',
      },
      conversation: {
        title: 'Full Conversation',
        description: 'Combine user and assistant bubbles with avatars, timestamps, and actions for a complete AI chat interface.',
      },
    },
    classDescriptions: {
      'cu-chat-bubble': 'Chat message container',
      'cu-chat-bubble-user': 'User message variant (right-aligned, primary bg)',
      'cu-chat-bubble-assistant': 'Assistant message variant (left-aligned, muted bg)',
      'cu-chat-bubble-avatar': 'Avatar wrapper (size-8 circle)',
      'cu-chat-bubble-content': 'Content wrapper (max-width 75%)',
      'cu-chat-bubble-name': 'Sender name text',
      'cu-chat-bubble-message': 'Message bubble with rounded corners',
      'cu-chat-bubble-message-prose': 'Formatted message content (markdown)',
      'cu-chat-bubble-timestamp': 'Timestamp text',
      'cu-chat-bubble-actions': 'Action buttons container',
      'cu-chat-bubble-action': 'Individual action button',
    },
  },
  'zh-tw': {
    title: 'Chat Bubble — Cubby UI',
    description: '顯示聊天訊息氣泡，支援使用者和 AI 助手變體、頭像、時間戳和操作按鈕。',
    category: 'AI',
    sections: {
      usage: {
        title: '使用方式',
        description: '使用 <code class="cu-code">cu-chat-bubble</code> 容器建立聊天氣泡。使用 <code class="cu-code">cu-chat-bubble-assistant</code> 表示 AI 訊息，<code class="cu-code">cu-chat-bubble-user</code> 表示使用者訊息。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      userMessage: {
        title: '使用者訊息',
        description: '加入 <code class="cu-code">cu-chat-bubble-user</code> 來顯示靠右對齊、主色背景的使用者訊息。',
      },
      withAvatar: {
        title: '搭配頭像',
        description: '使用 <code class="cu-code">cu-chat-bubble-avatar</code> 在訊息旁顯示發送者頭像。',
      },
      withActions: {
        title: '搭配操作按鈕',
        description: '加入 <code class="cu-code">cu-chat-bubble-actions</code> 和 <code class="cu-code">cu-chat-bubble-action</code> 按鈕，適合複製、重新生成或回饋功能。',
      },
      prose: {
        title: 'Markdown / 文章格式',
        description: '加入 <code class="cu-code">cu-chat-bubble-message-prose</code> 以支援格式化內容，如程式碼區塊、列表和段落。',
      },
      conversation: {
        title: '完整對話',
        description: '結合使用者和 AI 助手氣泡，搭配頭像、時間戳和操作按鈕，打造完整的 AI 聊天介面。',
      },
    },
    classDescriptions: {
      'cu-chat-bubble': '聊天訊息容器',
      'cu-chat-bubble-user': '使用者訊息變體（靠右、主色背景）',
      'cu-chat-bubble-assistant': 'AI 助手訊息變體（靠左、淡色背景）',
      'cu-chat-bubble-avatar': '頭像包裝器（size-8 圓形）',
      'cu-chat-bubble-content': '內容包裝器（最大寬度 75%）',
      'cu-chat-bubble-name': '發送者名稱',
      'cu-chat-bubble-message': '訊息氣泡（圓角）',
      'cu-chat-bubble-message-prose': '格式化訊息內容（markdown）',
      'cu-chat-bubble-timestamp': '時間戳文字',
      'cu-chat-bubble-actions': '操作按鈕容器',
      'cu-chat-bubble-action': '單一操作按鈕',
    },
  },
};
