import type { Locale } from '../../index';

export const toastPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    variants: { title: string; description: string };
    withAction: { title: string; description: string };
    customDuration: { title: string; description: string };
    positions: { title: string; description: string };
    withIcon: { title: string; description: string };
    persistent: { title: string; description: string };
    stacked: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Toast — Cubby UI',
    description: 'A succinct message that is displayed temporarily. Toasts auto-dismiss after 5 seconds.',
    category: 'Feedback',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Add <code class="cu-code">data-cu-toast-trigger</code> on a button with <code class="cu-code">data-cu-toast-title</code> and <code class="cu-code">data-cu-toast-description</code> attributes. Place a <code class="cu-code">cu-toast-container</code> at a fixed position to receive toasts.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      variants: {
        title: 'Variants',
        description: 'Use <code class="cu-code">data-cu-toast-variant</code> to set the visual style: <code class="cu-code">default</code>, <code class="cu-code">destructive</code>, <code class="cu-code">success</code>, <code class="cu-code">warning</code>, <code class="cu-code">info</code>.',
      },
      withAction: {
        title: 'With Action',
        description: 'Add an action button inside the toast for quick actions like undo or retry.',
      },
      customDuration: {
        title: 'Custom Duration',
        description: 'Use <code class="cu-code">data-cu-toast-duration</code> to customize how long the toast stays visible (in milliseconds). Default is 5000ms.',
      },
      positions: {
        title: 'Positions',
        description: 'Use position classes on the container to place toasts at different screen corners or centered positions.',
      },
      withIcon: {
        title: 'With Icon',
        description: 'Add a leading icon to the toast for stronger visual feedback across different variants.',
      },
      persistent: {
        title: 'Persistent',
        description: 'Set <code class="cu-code">duration: 0</code> (or <code class="cu-code">data-cu-toast-duration="0"</code> on the container) to create toasts that remain until manually dismissed.',
      },
      stacked: {
        title: 'Stack Limit',
        description: 'Use <code class="cu-code">data-cu-toast-max</code> on the container to limit visible toasts. When exceeded, the oldest toast is automatically removed. Default is 5.',
      },
    },
    classDescriptions: {
      'cu-toast-container': 'Toast fixed position container',
      'cu-toast-container-bottom-right': 'Container position: bottom-right',
      'cu-toast-container-bottom-left': 'Container position: bottom-left',
      'cu-toast-container-bottom-center': 'Container position: bottom-center',
      'cu-toast-container-top-right': 'Container position: top-right',
      'cu-toast-container-top-left': 'Container position: top-left',
      'cu-toast-container-top-center': 'Container position: top-center',
      'cu-toast': 'Toast base style',
      'cu-toast-default': 'Default variant style',
      'cu-toast-destructive': 'Destructive / error variant style',
      'cu-toast-success': 'Success variant style',
      'cu-toast-warning': 'Warning variant style',
      'cu-toast-info': 'Info variant style',
      'cu-toast-body': 'Toast content wrapper',
      'cu-toast-title': 'Toast title',
      'cu-toast-description': 'Toast description text',
      'cu-toast-close': 'Toast close button',
      'cu-toast-enter': 'Toast enter animation',
    },
  },
  'zh-tw': {
    title: 'Toast — Cubby UI',
    description: '暫時顯示的簡短訊息。Toast 會在 5 秒後自動消失。',
    category: '回饋',
    sections: {
      usage: {
        title: '使用方式',
        description: '在按鈕上加入 <code class="cu-code">data-cu-toast-trigger</code>，並搭配 <code class="cu-code">data-cu-toast-title</code> 和 <code class="cu-code">data-cu-toast-description</code> 屬性。放置一個 <code class="cu-code">cu-toast-container</code> 在固定位置來接收 toast。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      variants: {
        title: '變體',
        description: '使用 <code class="cu-code">data-cu-toast-variant</code> 設定視覺樣式：<code class="cu-code">default</code>、<code class="cu-code">destructive</code>、<code class="cu-code">success</code>、<code class="cu-code">warning</code>、<code class="cu-code">info</code>。',
      },
      withAction: {
        title: '帶操作按鈕',
        description: '在 toast 中加入操作按鈕，用於快速操作如復原或重試。',
      },
      customDuration: {
        title: '自訂顯示時間',
        description: '使用 <code class="cu-code">data-cu-toast-duration</code> 自訂 toast 顯示時長（毫秒）。預設為 5000ms。',
      },
      positions: {
        title: '位置',
        description: '在容器上使用位置類別，將 toast 放置在螢幕不同角落或置中位置。',
      },
      withIcon: {
        title: '搭配圖示',
        description: '在 toast 前方加入圖示，為不同變體提供更強烈的視覺回饋。',
      },
      persistent: {
        title: '持續顯示',
        description: '設定 <code class="cu-code">duration: 0</code>（或在容器上設定 <code class="cu-code">data-cu-toast-duration="0"</code>）以建立需手動關閉的通知。',
      },
      stacked: {
        title: '堆疊上限',
        description: '在容器上使用 <code class="cu-code">data-cu-toast-max</code> 限制可見通知數量。超出時自動移除最舊的通知。預設為 5。',
      },
    },
    classDescriptions: {
      'cu-toast-container': 'Toast 固定定位容器',
      'cu-toast-container-bottom-right': '容器位置：右下',
      'cu-toast-container-bottom-left': '容器位置：左下',
      'cu-toast-container-bottom-center': '容器位置：下方置中',
      'cu-toast-container-top-right': '容器位置：右上',
      'cu-toast-container-top-left': '容器位置：左上',
      'cu-toast-container-top-center': '容器位置：上方置中',
      'cu-toast': 'Toast 基礎樣式',
      'cu-toast-default': '預設變體樣式',
      'cu-toast-destructive': '危險 / 錯誤變體樣式',
      'cu-toast-success': '成功變體樣式',
      'cu-toast-warning': '警告變體樣式',
      'cu-toast-info': '資訊變體樣式',
      'cu-toast-body': 'Toast 內容包裝器',
      'cu-toast-title': 'Toast 標題',
      'cu-toast-description': 'Toast 描述文字',
      'cu-toast-close': 'Toast 關閉按鈕',
      'cu-toast-enter': 'Toast 進場動畫',
    },
  },
};
