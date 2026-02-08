import type { Locale } from '../../index';

export const fileInputPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withLabel: { title: string; description: string };
    acceptTypes: { title: string; description: string };
    multipleFiles: { title: string; description: string };
    disabled: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'File Input — Cubby UI',
    description: 'Displays a file upload input for selecting files from the user\'s device.',
    category: 'Forms',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Apply <code class="cu-code">cu-input-file</code> to an <code class="cu-code">&lt;input type="file"&gt;</code> element.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withLabel: {
        title: 'With Label',
        description: 'Pair with a <code class="cu-code">cu-label</code> for accessible file uploads.',
      },
      acceptTypes: {
        title: 'Accept Types',
        description: 'Use the <code class="cu-code">accept</code> attribute to restrict file types.',
      },
      multipleFiles: {
        title: 'Multiple Files',
        description: 'Add the <code class="cu-code">multiple</code> attribute to allow selecting multiple files.',
      },
      disabled: {
        title: 'Disabled',
        description: 'Add the <code class="cu-code">disabled</code> attribute to prevent file selection.',
      },
    },
    classDescriptions: {
      'cu-input-file': 'File upload input with custom browse button style',
    },
  },
  'zh-tw': {
    title: 'File Input — Cubby UI',
    description: '顯示檔案上傳輸入元件，用於從使用者裝置選取檔案。',
    category: '表單',
    sections: {
      usage: {
        title: '使用方式',
        description: '將 <code class="cu-code">cu-input-file</code> 套用至 <code class="cu-code">&lt;input type="file"&gt;</code> 元素。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withLabel: {
        title: '帶標籤',
        description: '搭配 <code class="cu-code">cu-label</code> 以提供無障礙的檔案上傳。',
      },
      acceptTypes: {
        title: '接受類型',
        description: '使用 <code class="cu-code">accept</code> 屬性來限制檔案類型。',
      },
      multipleFiles: {
        title: '多檔案',
        description: '加入 <code class="cu-code">multiple</code> 屬性以允許選取多個檔案。',
      },
      disabled: {
        title: '停用',
        description: '加入 <code class="cu-code">disabled</code> 屬性以防止檔案選取。',
      },
    },
    classDescriptions: {
      'cu-input-file': '檔案上傳輸入框，含自訂瀏覽按鈕樣式',
    },
  },
};
