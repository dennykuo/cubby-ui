import type { Locale } from '../../index';

export const toastPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    variants: { title: string; description: string };
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
    },
    classDescriptions: {
      'cu-toast-container': 'Toast fixed position container',
      'cu-toast-container-bottom-right': 'Container position: bottom-right',
      'cu-toast-container-bottom-left': 'Container position: bottom-left',
      'cu-toast-container-top-right': 'Container position: top-right',
      'cu-toast-container-top-left': 'Container position: top-left',
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
    },
    classDescriptions: {
      'cu-toast-container': 'Toast 固定定位容器',
      'cu-toast-container-bottom-right': '容器位置：右下',
      'cu-toast-container-bottom-left': '容器位置：左下',
      'cu-toast-container-top-right': '容器位置：右上',
      'cu-toast-container-top-left': '容器位置：左上',
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
