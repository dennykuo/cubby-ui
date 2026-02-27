import type { Locale } from '../../index';

export const alertDialogPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    destructiveAction: { title: string; description: string };
    withIcon: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Alert Dialog — Cubby UI',
    description: 'A modal dialog that interrupts the user with important content and expects a response. Unlike Dialog, it does not have a close button and cannot be dismissed by clicking the backdrop.',
    category: 'Overlay',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Built with the native <code class="cu-code">&lt;dialog&gt;</code> element. Use <code class="cu-code">data-cu-alert-dialog-trigger</code> on buttons to open, <code class="cu-code">data-cu-alert-dialog-cancel</code> to cancel, and <code class="cu-code">data-cu-alert-dialog-action</code> to confirm. Unlike <code class="cu-code">cu-dialog</code>, clicking the backdrop does not close the dialog.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      destructiveAction: {
        title: 'Destructive Action',
        description: 'Pair with a destructive trigger button for dangerous actions.',
      },
      withIcon: {
        title: 'With Icon',
        description: 'Add a warning icon alongside the title for extra visual emphasis.',
      },
    },
    classDescriptions: {
      'cu-alert-dialog': 'Alert Dialog container with centered positioning, rounded corners, and open/close animation',
      'cu-alert-dialog-header': 'Flex container for title and description',
      'cu-alert-dialog-title': 'Alert Dialog title',
      'cu-alert-dialog-description': 'Alert Dialog description text',
      'cu-alert-dialog-footer': 'Footer action button area',
    },
  },
  'zh-tw': {
    title: 'Alert Dialog — Cubby UI',
    description: '一個會中斷使用者操作的模態對話框，用於顯示重要內容並要求回應。與 Dialog 不同，它沒有關閉按鈕，也無法透過點擊背景遮罩關閉。',
    category: '浮層',
    sections: {
      usage: {
        title: '使用方式',
        description: '基於原生 <code class="cu-code">&lt;dialog&gt;</code> 元素構建。在按鈕上使用 <code class="cu-code">data-cu-alert-dialog-trigger</code> 開啟，<code class="cu-code">data-cu-alert-dialog-cancel</code> 取消，以及 <code class="cu-code">data-cu-alert-dialog-action</code> 確認。與 <code class="cu-code">cu-dialog</code> 不同，點擊背景遮罩不會關閉對話框。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      destructiveAction: {
        title: '危險操作',
        description: '搭配危險觸發按鈕，用於危險操作場景。',
      },
      withIcon: {
        title: '帶圖示',
        description: '在標題旁加上警告圖示，提供額外的視覺強調。',
      },
    },
    classDescriptions: {
      'cu-alert-dialog': 'Alert Dialog 容器，包含置中定位、圓角和開關動畫',
      'cu-alert-dialog-header': '標題與描述的 Flex 容器',
      'cu-alert-dialog-title': 'Alert Dialog 標題',
      'cu-alert-dialog-description': 'Alert Dialog 描述文字',
      'cu-alert-dialog-footer': '底部操作按鈕區域',
    },
  },
};
