import type { Locale } from '../../index';

export const copyButtonPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    label: { title: string; description: string };
    target: { title: string; description: string };
    field: { title: string; description: string };
    multiline: { title: string; description: string };
    sizes: { title: string; description: string };
    feedback: { title: string; description: string };
    accessibility: { title: string; description: string };
    events: { title: string; description: string };
    attributes: { title: string; attributeLabel: string; descriptionLabel: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
  };
  attributeDescriptions: Record<string, string>;
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Copy Button — Cubby UI',
    description: 'One-click copy for IDs, API keys and code snippets. Copies text from an attribute or from another element, swaps the icon to a check mark on success, announces the result to screen readers and falls back gracefully when the Clipboard API is unavailable.',
    category: 'Basic',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Put the text in <code class="cu-code">data-cu-copy</code> on a <code class="cu-code">cu-copy-button</code>. The button contains two icons: <code class="cu-code">cu-copy-button-icon</code> is shown by default and <code class="cu-code">cu-copy-button-check</code> replaces it while <code class="cu-code">data-cu-copied</code> is set. Icon-only buttons need an <code class="cu-code">aria-label</code>.',
      },
      label: {
        title: 'With Label',
        description: 'Add a child with <code class="cu-code">data-cu-copy-label</code> to show text; it switches to the success message and back. <code class="cu-code">cu-copy-button-outline</code> adds a border and background.',
      },
      target: {
        title: 'Copy from an Element',
        description: 'Use <code class="cu-code">data-cu-copy-target="#selector"</code> to copy another element\'s content: <code class="cu-code">input</code>, <code class="cu-code">textarea</code> and <code class="cu-code">select</code> copy their <code class="cu-code">value</code>, other elements copy their trimmed text. The value is read at click time, so edited inputs copy the latest text.',
      },
      field: {
        title: 'Copy Field',
        description: '<code class="cu-code">cu-copy-field</code> pairs a read-only value with a copy button, which suits IDs, API keys and install commands. <code class="cu-code">cu-copy-field-value</code> can be a <code class="cu-code">&lt;code&gt;</code>, <code class="cu-code">&lt;span&gt;</code> or <code class="cu-code">&lt;input readonly&gt;</code>; long values are truncated. <code class="cu-code">cu-copy-field-muted</code> gives a quieter tinted background.',
      },
      multiline: {
        title: 'Multiline Snippet',
        description: 'Add <code class="cu-code">cu-copy-field-multiline</code> to keep line breaks and scroll horizontally, with the button aligned to the top.',
      },
      sizes: {
        title: 'Sizes',
        description: 'Use <code class="cu-code">cu-copy-button-sm</code> (h-7) or <code class="cu-code">cu-copy-button-lg</code> (h-9). The default is h-8.',
      },
      feedback: {
        title: 'Custom Feedback',
        description: 'Set <code class="cu-code">data-cu-copy-success-text</code> and <code class="cu-code">data-cu-copy-error-text</code> to change the messages (defaults: "Copied!" and "Copy failed"), and <code class="cu-code">data-cu-copy-duration</code> to change how long the state lasts (default 2000 ms). When copying fails, the button gets <code class="cu-code">data-cu-copy-failed</code> instead.',
      },
      accessibility: {
        title: 'Accessibility',
        description: 'Messages are announced through a visually hidden <code class="cu-code">role="status"</code> <code class="cu-code">aria-live="polite"</code> region, created automatically and shared by all copy buttons. To control where it lives, add your own element with <code class="cu-code">data-cu-copy-live</code>. When the Clipboard API is missing (for example on plain <code class="cu-code">http://</code>) or rejected, the script falls back to <code class="cu-code">document.execCommand("copy")</code>; if that also fails, the error state and message are shown.',
      },
      events: {
        title: 'Events',
        description: 'Clicks are handled by one delegated document listener, so buttons added later work without calling <code class="cu-code">CubbyUI.init()</code>; <code class="cu-code">CubbyUI.destroy()</code> removes the listener. Each button dispatches bubbling <code class="cu-code">cu:copy-button:copy</code> and <code class="cu-code">cu:copy-button:error</code> events.',
      },
      attributes: {
        title: 'Data Attributes',
        attributeLabel: 'Attribute',
        descriptionLabel: 'Description',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
    },
    attributeDescriptions: {
      'data-cu-copy': 'Text to copy',
      'data-cu-copy-target': 'CSS selector of the element to copy from (takes priority over data-cu-copy)',
      'data-cu-copy-label': 'Child element whose text shows the success or error message',
      'data-cu-copy-success-text': 'Success message, also announced (default "Copied!")',
      'data-cu-copy-error-text': 'Error message, also announced (default "Copy failed")',
      'data-cu-copy-duration': 'Milliseconds before the state resets (default 2000)',
      'data-cu-copy-live': 'Optional custom aria-live region',
      'data-cu-copied': 'State: set after a successful copy',
      'data-cu-copy-failed': 'State: set when copying fails',
    },
    classDescriptions: {
      'cu-copy-button': 'Ghost button, h-8, square when icon-only',
      'cu-copy-button-outline': 'Bordered variant with background',
      'cu-copy-button-sm': 'Small size (h-7, 14px icon)',
      'cu-copy-button-lg': 'Large size (h-9)',
      'cu-copy-button-icon': 'Default copy icon, hidden while copied',
      'cu-copy-button-check': 'Check icon, shown while copied',
      'cu-copy-field': 'Read-only value with an inline copy button',
      'cu-copy-field-value': 'Monospace value (code, span or readonly input), truncated',
      'cu-copy-field-muted': 'Tinted background, no shadow',
      'cu-copy-field-multiline': 'Keeps line breaks, scrolls horizontally',
    },
  },
  'zh-tw': {
    title: 'Copy Button — Cubby UI',
    description: '一鍵複製 ID、API Key 與程式碼片段。可複製屬性中的文字或其他元素的內容，成功時圖示切換為勾勾、以螢幕閱讀器播報結果，並在 Clipboard API 不可用時優雅降級。',
    category: '基礎',
    sections: {
      usage: {
        title: '使用方式',
        description: '在 <code class="cu-code">cu-copy-button</code> 上以 <code class="cu-code">data-cu-copy</code> 指定要複製的文字。按鈕內含兩個圖示：預設顯示 <code class="cu-code">cu-copy-button-icon</code>，設定 <code class="cu-code">data-cu-copied</code> 期間改顯示 <code class="cu-code">cu-copy-button-check</code>。純圖示按鈕需加上 <code class="cu-code">aria-label</code>。',
      },
      label: {
        title: '搭配文字',
        description: '加入帶有 <code class="cu-code">data-cu-copy-label</code> 的子元素顯示文字，複製後會暫時換成成功訊息再還原。<code class="cu-code">cu-copy-button-outline</code> 加上邊框與背景。',
      },
      target: {
        title: '複製其他元素的內容',
        description: '以 <code class="cu-code">data-cu-copy-target="#selector"</code> 複製其他元素的內容：<code class="cu-code">input</code>、<code class="cu-code">textarea</code>、<code class="cu-code">select</code> 取其 <code class="cu-code">value</code>，其他元素取去除首尾空白的文字。內容在點擊當下讀取，因此修改過的輸入框會複製最新的值。',
      },
      field: {
        title: 'Copy Field',
        description: '<code class="cu-code">cu-copy-field</code> 將唯讀值與複製按鈕組合在一起，適合 ID、API Key 與安裝指令。<code class="cu-code">cu-copy-field-value</code> 可以是 <code class="cu-code">&lt;code&gt;</code>、<code class="cu-code">&lt;span&gt;</code> 或 <code class="cu-code">&lt;input readonly&gt;</code>，過長時截斷。<code class="cu-code">cu-copy-field-muted</code> 提供較安靜的淡底樣式。',
      },
      multiline: {
        title: '多行片段',
        description: '加上 <code class="cu-code">cu-copy-field-multiline</code> 保留換行並可水平捲動，按鈕對齊頂端。',
      },
      sizes: {
        title: '尺寸',
        description: '使用 <code class="cu-code">cu-copy-button-sm</code>（h-7）或 <code class="cu-code">cu-copy-button-lg</code>（h-9），預設為 h-8。',
      },
      feedback: {
        title: '自訂回饋',
        description: '以 <code class="cu-code">data-cu-copy-success-text</code> 與 <code class="cu-code">data-cu-copy-error-text</code> 修改訊息（預設 "Copied!" 與 "Copy failed"），以 <code class="cu-code">data-cu-copy-duration</code> 修改狀態維持時間（預設 2000 ms）。複製失敗時按鈕改為設定 <code class="cu-code">data-cu-copy-failed</code>。',
      },
      accessibility: {
        title: '無障礙',
        description: '訊息透過視覺隱藏的 <code class="cu-code">role="status"</code> <code class="cu-code">aria-live="polite"</code> 區域播報，此區域自動建立並由所有複製按鈕共用；若要自行決定位置，可放置帶有 <code class="cu-code">data-cu-copy-live</code> 的元素。Clipboard API 不存在（例如一般 <code class="cu-code">http://</code> 頁面）或被拒絕時，會改用 <code class="cu-code">document.execCommand("copy")</code>；仍失敗則顯示錯誤狀態與訊息。',
      },
      events: {
        title: '事件',
        description: '點擊由單一 document 級 delegated listener 處理，之後動態新增的按鈕不需呼叫 <code class="cu-code">CubbyUI.init()</code> 即可運作；<code class="cu-code">CubbyUI.destroy()</code> 會移除該 listener。每個按鈕會觸發可冒泡的 <code class="cu-code">cu:copy-button:copy</code> 與 <code class="cu-code">cu:copy-button:error</code> 事件。',
      },
      attributes: {
        title: 'Data 屬性',
        attributeLabel: '屬性',
        descriptionLabel: '說明',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
    },
    attributeDescriptions: {
      'data-cu-copy': '要複製的文字',
      'data-cu-copy-target': '複製來源元素的 CSS selector（優先於 data-cu-copy）',
      'data-cu-copy-label': '顯示成功或失敗訊息的子元素',
      'data-cu-copy-success-text': '成功訊息，同時用於播報（預設 "Copied!"）',
      'data-cu-copy-error-text': '失敗訊息，同時用於播報（預設 "Copy failed"）',
      'data-cu-copy-duration': '狀態還原前的毫秒數（預設 2000）',
      'data-cu-copy-live': '選用的自訂 aria-live 區域',
      'data-cu-copied': '狀態：複製成功後設定',
      'data-cu-copy-failed': '狀態：複製失敗時設定',
    },
    classDescriptions: {
      'cu-copy-button': 'Ghost 樣式按鈕，h-8，純圖示時為正方形',
      'cu-copy-button-outline': '帶邊框與背景的變體',
      'cu-copy-button-sm': '小尺寸（h-7，14px 圖示）',
      'cu-copy-button-lg': '大尺寸（h-9）',
      'cu-copy-button-icon': '預設的複製圖示，複製成功期間隱藏',
      'cu-copy-button-check': '勾勾圖示，複製成功期間顯示',
      'cu-copy-field': '唯讀值搭配內嵌複製按鈕',
      'cu-copy-field-value': '等寬字體的值（code、span 或 readonly input），過長截斷',
      'cu-copy-field-muted': '淡底、無陰影',
      'cu-copy-field-multiline': '保留換行並可水平捲動',
    },
  },
};
