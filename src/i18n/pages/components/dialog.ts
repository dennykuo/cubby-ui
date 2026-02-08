import type { Locale } from '../../index';

export const dialogPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withForm: { title: string; description: string };
    destructiveConfirmation: { title: string; description: string };
    feedbackForm: { title: string; description: string };
    successState: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Dialog — Cubby UI',
    description: 'A modal dialog that interrupts the user with important content and expects a response.',
    category: 'Overlay',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Built with the native <code class="cu-code">&lt;dialog&gt;</code> element. Use <code class="cu-code">data-cu-dialog-trigger</code> on buttons to open, <code class="cu-code">data-cu-dialog-close</code> to close, and <code class="cu-code">data-cu-dialog</code> on the dialog element.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withForm: {
        title: 'With Form',
        description: 'Dialogs can contain forms and other interactive content.',
      },
      destructiveConfirmation: {
        title: 'Destructive Confirmation',
        description: 'A confirmation dialog with a warning icon for dangerous actions like account deletion.',
      },
      feedbackForm: {
        title: 'Feedback Form',
        description: 'A richer form dialog with a select dropdown and textarea.',
      },
      successState: {
        title: 'Success State',
        description: 'A centered dialog for success confirmations. Use a smaller <code class="cu-code">max-w-sm</code> width.',
      },
    },
    classDescriptions: {
      'cu-dialog': 'Dialog container with centered positioning, rounded corners, and open/close animation',
      'cu-dialog-header': 'Flex container for title and description',
      'cu-dialog-title': 'Dialog title',
      'cu-dialog-description': 'Dialog description text',
      'cu-dialog-footer': 'Footer action button area',
      'cu-dialog-close': 'Top-right close button',
    },
  },
  'zh-tw': {
    title: 'Dialog — Cubby UI',
    description: '一個會中斷使用者操作的模態對話框，用於顯示重要內容並要求回應。',
    category: '浮層',
    sections: {
      usage: {
        title: '使用方式',
        description: '基於原生 <code class="cu-code">&lt;dialog&gt;</code> 元素構建。在按鈕上使用 <code class="cu-code">data-cu-dialog-trigger</code> 開啟，<code class="cu-code">data-cu-dialog-close</code> 關閉，以及在 dialog 元素上使用 <code class="cu-code">data-cu-dialog</code>。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withForm: {
        title: '包含表單',
        description: 'Dialog 可以包含表單和其他互動內容。',
      },
      destructiveConfirmation: {
        title: '危險確認',
        description: '帶有警告圖示的確認對話框，適用於帳號刪除等危險操作。',
      },
      feedbackForm: {
        title: '回饋表單',
        description: '包含下拉選單和文字區域的豐富表單對話框。',
      },
      successState: {
        title: '成功狀態',
        description: '置中的成功確認對話框。使用較小的 <code class="cu-code">max-w-sm</code> 寬度。',
      },
    },
    classDescriptions: {
      'cu-dialog': 'Dialog 容器，包含置中定位、圓角和開關動畫',
      'cu-dialog-header': '標題與描述的 Flex 容器',
      'cu-dialog-title': 'Dialog 標題',
      'cu-dialog-description': 'Dialog 描述文字',
      'cu-dialog-footer': '底部操作按鈕區域',
      'cu-dialog-close': '右上角關閉按鈕',
    },
  },
};
