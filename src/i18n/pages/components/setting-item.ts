import type { Locale } from '../../index';

export const settingItemPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withIcon: { title: string; description: string };
    withToggle: { title: string; description: string };
    withButton: { title: string; description: string };
    withSelect: { title: string; description: string };
    mixedControls: { title: string; description: string };
    grouped: { title: string; description: string };
    dangerZone: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Setting Item — Cubby UI',
    description: 'A consistent layout for settings pages with label, description, and action control.',
    category: 'Data Display',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Use <code class="cu-code">cu-setting-item</code> inside a card with <code class="cu-code">cu-card-content-flush</code> and <code class="cu-code">divide-y</code> for a clean settings list. The action slot accepts toggles, buttons, selects, or any control.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withIcon: {
        title: 'With Icon',
        description: 'Add a leading <code class="cu-code">cu-setting-item-icon</code> to visually distinguish each setting. Wrap the icon and content together with <code class="cu-code">flex items-center gap-3</code>.',
      },
      withToggle: {
        title: 'With Toggle',
        description: 'Toggles are ideal for on/off settings. Pair with <code class="cu-code">cu-toggle</code> for a clean boolean switch.',
      },
      withButton: {
        title: 'With Button',
        description: 'Use buttons for settings that require navigation or additional actions.',
      },
      withSelect: {
        title: 'With Select',
        description: 'Use select dropdowns for settings with predefined options.',
      },
      mixedControls: {
        title: 'Mixed Controls',
        description: 'Combine toggles, selects, and buttons in a single settings card. Use <code class="cu-code">cu-button-sm</code> and <code class="cu-code">cu-select</code> with <code class="cu-code">cu-toggle</code> for visually balanced controls.',
      },
      grouped: {
        title: 'Grouped Settings',
        description: 'Group related setting items in a card with a header title and separator dividers.',
      },
      dangerZone: {
        title: 'Danger Zone',
        description: 'Use a destructive-bordered card with <code class="cu-code">border-destructive/20</code> to visually separate irreversible actions from other settings.',
      },
    },
    classDescriptions: {
      'cu-setting-item': 'Setting item container (flex, responsive padding)',
      'cu-setting-item-content': 'Label and description wrapper',
      'cu-setting-item-label': 'Setting label text',
      'cu-setting-item-description': 'Setting description text',
      'cu-setting-item-action': 'Action control container',
      'cu-setting-item-icon': 'Leading icon container (rounded, muted background)',
    },
  },
  'zh-tw': {
    title: 'Setting Item — Cubby UI',
    description: '設定頁面的一致性佈局，包含標籤、說明和操作控制項。',
    category: '資料展示',
    sections: {
      usage: {
        title: '使用方式',
        description: '在卡片中使用 <code class="cu-code">cu-setting-item</code>，搭配 <code class="cu-code">cu-card-content-flush</code> 和 <code class="cu-code">divide-y</code> 建立整潔的設定列表。操作區可放置開關、按鈕、下拉選擇或任何控制項。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withIcon: {
        title: '搭配圖示',
        description: '加入前導 <code class="cu-code">cu-setting-item-icon</code> 以視覺區分各設定項。將圖示和內容以 <code class="cu-code">flex items-center gap-3</code> 包裹在一起。',
      },
      withToggle: {
        title: '搭配開關',
        description: '開關適合用於布林值的開啟/關閉設定。搭配 <code class="cu-code">cu-toggle</code> 實現簡潔的切換效果。',
      },
      withButton: {
        title: '搭配按鈕',
        description: '為需要導航或其他操作的設定項目使用按鈕。',
      },
      withSelect: {
        title: '搭配下拉選擇',
        description: '為具有預定義選項的設定項目使用下拉選擇框。',
      },
      mixedControls: {
        title: '混合控制項',
        description: '在同一設定卡片中組合開關、下拉選擇和按鈕。使用 <code class="cu-code">cu-button-sm</code> 和 <code class="cu-code">cu-select</code> 搭配 <code class="cu-code">cu-toggle</code>，確保控制項的視覺大小一致。',
      },
      grouped: {
        title: '分組設定',
        description: '在卡片中搭配標題和分隔線將相關設定項分組。',
      },
      dangerZone: {
        title: '危險區域',
        description: '使用 <code class="cu-code">border-destructive/20</code> 的破壞性邊框卡片，在視覺上將不可逆操作與其他設定區隔。',
      },
    },
    classDescriptions: {
      'cu-setting-item': '設定項目容器（flex，響應式內距）',
      'cu-setting-item-content': '標籤和說明的包裝器',
      'cu-setting-item-label': '設定標籤文字',
      'cu-setting-item-description': '設定說明文字',
      'cu-setting-item-action': '操作控制項容器',
      'cu-setting-item-icon': '前導圖示容器（圓角、淡色背景）',
    },
  },
};
