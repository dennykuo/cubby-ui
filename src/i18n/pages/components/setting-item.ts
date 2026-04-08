import type { Locale } from '../../index';

export const settingItemPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withButton: { title: string; description: string };
    withSelect: { title: string; description: string };
    withToggle: { title: string; description: string };
    grouped: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Setting Item — Cubby UI',
    description: 'A consistent layout for settings pages with label, description, and action control.',
    category: 'Layouts',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Use <code class="cu-code">cu-setting-item</code> inside a card with <code class="cu-code">cu-card-content-flush</code> and <code class="cu-code">divide-y</code> for a clean settings list.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withButton: {
        title: 'With Button',
        description: 'Use buttons for settings that require navigation or additional actions.',
      },
      withSelect: {
        title: 'With Select',
        description: 'Use select dropdowns for settings with predefined options.',
      },
      withToggle: {
        title: 'With Toggle',
        description: 'Pair the setting item with a toggle switch for boolean preferences like notifications or dark mode.',
      },
      grouped: {
        title: 'Grouped Settings',
        description: 'Group multiple setting items in a card with separator dividers for organized settings pages.',
      },
    },
    classDescriptions: {
      'cu-setting-item': 'Setting item container (flex, responsive padding)',
      'cu-setting-item-content': 'Label and description wrapper',
      'cu-setting-item-label': 'Setting label text',
      'cu-setting-item-description': 'Setting description text',
      'cu-setting-item-action': 'Action control container',
    },
  },
  'zh-tw': {
    title: 'Setting Item — Cubby UI',
    description: '設定頁面的一致性佈局，包含標籤、說明和操作控制項。',
    category: '版面',
    sections: {
      usage: {
        title: '使用方式',
        description: '在卡片中使用 <code class="cu-code">cu-setting-item</code>，搭配 <code class="cu-code">cu-card-content-flush</code> 和 <code class="cu-code">divide-y</code> 建立整潔的設定列表。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withButton: {
        title: '搭配按鈕',
        description: '為需要導航或其他操作的設定項目使用按鈕。',
      },
      withSelect: {
        title: '搭配下拉選擇',
        description: '為具有預定義選項的設定項目使用下拉選擇框。',
      },
      withToggle: {
        title: '搭配開關',
        description: '將設定項搭配開關切換器，適用於通知或深色模式等布林偏好設定。',
      },
      grouped: {
        title: '分組設定',
        description: '在卡片中分組多個設定項並以分隔線區隔，建立有組織的設定頁面。',
      },
    },
    classDescriptions: {
      'cu-setting-item': '設定項目容器（flex，響應式內距）',
      'cu-setting-item-content': '標籤和說明的包裝器',
      'cu-setting-item-label': '設定標籤文字',
      'cu-setting-item-description': '設定說明文字',
      'cu-setting-item-action': '操作控制項容器',
    },
  },
};
