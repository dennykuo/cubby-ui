import type { Locale } from '../../index';

export const drawerPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    leftSide: { title: string; description: string };
    topBottom: { title: string; description: string };
    scrollableContent: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Drawer — Cubby UI',
    description: 'Extends the Dialog component to display content that complements the main content of the screen. Slides in from the edge of the screen.',
    category: 'Overlay',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Built with the native <code class="cu-code">&lt;dialog&gt;</code> element. Use <code class="cu-code">data-cu-drawer-trigger</code> on buttons to open, <code class="cu-code">data-cu-drawer-close</code> to close, and <code class="cu-code">data-cu-drawer</code> on the dialog element. Add a side class like <code class="cu-code">cu-drawer-right</code> to control the position.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      leftSide: {
        title: 'Left Side',
        description: 'Use <code class="cu-code">cu-drawer-left</code> for a navigation-style drawer.',
      },
      topBottom: {
        title: 'Top & Bottom',
        description: 'Use <code class="cu-code">cu-drawer-top</code> or <code class="cu-code">cu-drawer-bottom</code> for horizontal drawers.',
      },
      scrollableContent: {
        title: 'With Scrollable Content',
        description: 'The <code class="cu-code">cu-drawer-content</code> area automatically scrolls when content overflows.',
      },
    },
    classDescriptions: {
      'cu-drawer': 'Drawer base container with fixed positioning and open/close animation',
      'cu-drawer-right': 'Slides in from right',
      'cu-drawer-left': 'Slides in from left',
      'cu-drawer-top': 'Slides in from top',
      'cu-drawer-bottom': 'Slides in from bottom',
      'cu-drawer-header': 'Drawer header area',
      'cu-drawer-title': 'Drawer title',
      'cu-drawer-description': 'Drawer description text',
      'cu-drawer-content': 'Drawer scrollable content area',
      'cu-drawer-footer': 'Footer action button area',
      'cu-drawer-close': 'Top-right close button',
    },
  },
  'zh-tw': {
    title: 'Drawer — Cubby UI',
    description: '擴展 Dialog 元件，用於顯示補充主畫面內容的資訊。從螢幕邊緣滑入。',
    category: '浮層',
    sections: {
      usage: {
        title: '使用方式',
        description: '基於原生 <code class="cu-code">&lt;dialog&gt;</code> 元素構建。在按鈕上使用 <code class="cu-code">data-cu-drawer-trigger</code> 開啟，<code class="cu-code">data-cu-drawer-close</code> 關閉，以及在 dialog 元素上使用 <code class="cu-code">data-cu-drawer</code>。加上方向類別如 <code class="cu-code">cu-drawer-right</code> 來控制位置。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      leftSide: {
        title: '左側',
        description: '使用 <code class="cu-code">cu-drawer-left</code> 建立導航風格的抽屜。',
      },
      topBottom: {
        title: '上方與下方',
        description: '使用 <code class="cu-code">cu-drawer-top</code> 或 <code class="cu-code">cu-drawer-bottom</code> 建立水平抽屜。',
      },
      scrollableContent: {
        title: '可捲動內容',
        description: '<code class="cu-code">cu-drawer-content</code> 區域在內容超出時自動捲動。',
      },
    },
    classDescriptions: {
      'cu-drawer': 'Drawer 基礎容器，包含固定定位和開關動畫',
      'cu-drawer-right': '從右側滑入',
      'cu-drawer-left': '從左側滑入',
      'cu-drawer-top': '從上方滑入',
      'cu-drawer-bottom': '從下方滑入',
      'cu-drawer-header': 'Drawer 標頭區域',
      'cu-drawer-title': 'Drawer 標題',
      'cu-drawer-description': 'Drawer 描述文字',
      'cu-drawer-content': 'Drawer 可捲動內容區域',
      'cu-drawer-footer': '底部操作按鈕區域',
      'cu-drawer-close': '右上角關閉按鈕',
    },
  },
};
