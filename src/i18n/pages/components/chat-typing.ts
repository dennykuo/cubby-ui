import type { Locale } from '../../index';

export const chatTypingPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withAvatar: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Chat Typing — Cubby UI',
    description: 'An animated typing indicator that shows the AI assistant is generating a response.',
    category: 'AI',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Use <code class="cu-code">cu-chat-typing</code> with three <code class="cu-code">cu-chat-typing-dot</code> elements to show a bouncing dots animation.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withAvatar: {
        title: 'With Avatar',
        description: 'Combine with <code class="cu-code">cu-chat-bubble</code> structure to display the typing indicator alongside an avatar.',
      },
    },
    classDescriptions: {
      'cu-chat-typing': 'Typing indicator container (muted pill)',
      'cu-chat-typing-dot': 'Animated bouncing dot',
    },
  },
  'zh-tw': {
    title: 'Chat Typing — Cubby UI',
    description: '動畫打字指示器，顯示 AI 助手正在產生回應。',
    category: 'AI',
    sections: {
      usage: {
        title: '使用方式',
        description: '使用 <code class="cu-code">cu-chat-typing</code> 搭配三個 <code class="cu-code">cu-chat-typing-dot</code> 元素來顯示跳動圓點動畫。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withAvatar: {
        title: '搭配頭像',
        description: '結合 <code class="cu-code">cu-chat-bubble</code> 結構，在頭像旁顯示打字指示器。',
      },
    },
    classDescriptions: {
      'cu-chat-typing': '打字指示器容器（淡色藥丸形）',
      'cu-chat-typing-dot': '動畫跳動圓點',
    },
  },
};
