import type { Locale } from '../../index';

export const dropzonePage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withFileList: { title: string; description: string };
    disabled: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Dropzone — Cubby UI',
    description: 'A drag-and-drop file upload area. Supports both drag & drop and click to browse.',
    category: 'Forms',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Use <code class="cu-code">data-cu-dropzone</code> on the container and <code class="cu-code">data-cu-dropzone-input</code> on a hidden <code class="cu-code">&lt;input type="file"&gt;</code>. The <code class="cu-code">&lt;script&gt;</code> handles click-to-browse and drag & drop events.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withFileList: {
        title: 'With File List',
        description: 'Show selected file names below the dropzone using a <code class="cu-code">change</code> event listener on the hidden input.',
      },
      disabled: {
        title: 'Disabled',
        description: 'Add <code class="cu-code">cu-dropzone-disabled</code> to prevent interaction. No hidden input or <code class="cu-code">data-cu-dropzone</code> attribute needed.',
      },
    },
    classDescriptions: {
      'cu-dropzone': 'Dropzone container with dashed border and hover effect',
      'cu-dropzone-active': 'Active state on drag enter, primary border and light background',
      'cu-dropzone-icon': 'Icon in dropzone',
      'cu-dropzone-title': 'Dropzone title text',
      'cu-dropzone-description': 'Dropzone description text',
      'cu-dropzone-disabled': 'Disabled state with reduced opacity and no interaction',
    },
  },
  'zh-tw': {
    title: 'Dropzone — Cubby UI',
    description: '拖放式檔案上傳區域。支援拖放與點擊瀏覽兩種方式。',
    category: '表單',
    sections: {
      usage: {
        title: '使用方式',
        description: '在容器上使用 <code class="cu-code">data-cu-dropzone</code>，在隱藏的 <code class="cu-code">&lt;input type="file"&gt;</code> 上使用 <code class="cu-code">data-cu-dropzone-input</code>。<code class="cu-code">&lt;script&gt;</code> 處理點擊瀏覽與拖放事件。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withFileList: {
        title: '帶檔案列表',
        description: '使用隱藏 input 的 <code class="cu-code">change</code> 事件監聽器，在 dropzone 下方顯示已選取的檔案名稱。',
      },
      disabled: {
        title: '停用',
        description: '加入 <code class="cu-code">cu-dropzone-disabled</code> 以防止互動。不需要隱藏的 input 或 <code class="cu-code">data-cu-dropzone</code> 屬性。',
      },
    },
    classDescriptions: {
      'cu-dropzone': 'Dropzone 容器，含虛線邊框與 hover 效果',
      'cu-dropzone-active': '拖曳進入時的啟用狀態，主色邊框與淺色背景',
      'cu-dropzone-icon': 'Dropzone 中的圖示',
      'cu-dropzone-title': 'Dropzone 標題文字',
      'cu-dropzone-description': 'Dropzone 說明文字',
      'cu-dropzone-disabled': '停用狀態，降低透明度且無法互動',
    },
  },
};
