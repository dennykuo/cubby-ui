import type { Locale } from '../../index';

export const dialogPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    sizes: { title: string; description: string };
    withForm: { title: string; description: string };
    destructiveConfirmation: { title: string; description: string };
    successState: { title: string; description: string };
    scrollable: { title: string; description: string };
    nested: { title: string; description: string };
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
      sizes: {
        title: 'Sizes',
        description: 'Four size variants are available — <code class="cu-code">cu-dialog-sm</code>, <code class="cu-code">cu-dialog-md</code>, <code class="cu-code">cu-dialog-xl</code>, and <code class="cu-code">cu-dialog-full</code>. The default is <code class="cu-code">max-w-lg</code>.',
      },
      withForm: {
        title: 'With Form',
        description: 'Dialogs can contain forms and other interactive content.',
      },
      destructiveConfirmation: {
        title: 'Destructive Confirmation',
        description: 'A confirmation dialog with a warning icon for dangerous actions like account deletion.',
      },
      successState: {
        title: 'Success State',
        description: 'A centered dialog for success confirmations. Use a smaller <code class="cu-code">max-w-sm</code> width.',
      },
      scrollable: {
        title: 'Scrollable Content',
        description: 'Use <code class="cu-code">cu-dialog-body</code> and <code class="cu-code">cu-dialog-scroll</code> to create a dialog with a fixed header/footer and scrollable middle section.',
      },
      nested: {
        title: 'Nested Dialog',
        description: 'Open a second dialog from within the first. Native <code class="cu-code">&lt;dialog&gt;</code> elements support stacking via the top-layer API.',
      },
    },
    classDescriptions: {
      'cu-dialog': 'Dialog container with centered positioning, rounded corners, and open/close animation',
      'cu-dialog-header': 'Flex container for title and description',
      'cu-dialog-title': 'Dialog title',
      'cu-dialog-description': 'Dialog description text',
      'cu-dialog-footer': 'Footer action button area',
      'cu-dialog-close': 'Top-right close button',
      'cu-dialog-sm': 'Small size (max-w-sm)',
      'cu-dialog-md': 'Medium size (max-w-md)',
      'cu-dialog-xl': 'Extra-large size (max-w-xl)',
      'cu-dialog-full': 'Full size (max-w-3xl)',
      'cu-dialog-body': 'Flex column with max height for scrollable layout',
      'cu-dialog-scroll': 'Scrollable content area inside dialog body',
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
      sizes: {
        title: '尺寸',
        description: '提供四種尺寸變體 — <code class="cu-code">cu-dialog-sm</code>、<code class="cu-code">cu-dialog-md</code>、<code class="cu-code">cu-dialog-xl</code> 和 <code class="cu-code">cu-dialog-full</code>。預設為 <code class="cu-code">max-w-lg</code>。',
      },
      withForm: {
        title: '包含表單',
        description: 'Dialog 可以包含表單和其他互動內容。',
      },
      destructiveConfirmation: {
        title: '危險確認',
        description: '帶有警告圖示的確認對話框，適用於帳號刪除等危險操作。',
      },
      successState: {
        title: '成功狀態',
        description: '置中的成功確認對話框。使用較小的 <code class="cu-code">max-w-sm</code> 寬度。',
      },
      scrollable: {
        title: '可捲動內容',
        description: '使用 <code class="cu-code">cu-dialog-body</code> 和 <code class="cu-code">cu-dialog-scroll</code> 建立固定標頭/頁尾、中間可捲動的對話框。',
      },
      nested: {
        title: '巢狀對話框',
        description: '從第一個對話框中開啟第二個。原生 <code class="cu-code">&lt;dialog&gt;</code> 元素透過 top-layer API 支援堆疊。',
      },
    },
    classDescriptions: {
      'cu-dialog': 'Dialog 容器，包含置中定位、圓角和開關動畫',
      'cu-dialog-header': '標題與描述的 Flex 容器',
      'cu-dialog-title': 'Dialog 標題',
      'cu-dialog-description': 'Dialog 描述文字',
      'cu-dialog-footer': '底部操作按鈕區域',
      'cu-dialog-close': '右上角關閉按鈕',
      'cu-dialog-sm': '小尺寸（max-w-sm）',
      'cu-dialog-md': '中尺寸（max-w-md）',
      'cu-dialog-xl': '超大尺寸（max-w-xl）',
      'cu-dialog-full': '完整尺寸（max-w-3xl）',
      'cu-dialog-body': '具有最大高度的 flex 欄佈局（用於可捲動版面）',
      'cu-dialog-scroll': '對話框主體內的可捲動內容區',
    },
  },
};
