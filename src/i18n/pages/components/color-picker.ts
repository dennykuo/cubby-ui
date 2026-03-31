import type { Locale } from '../../index';

export const colorPickerPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    defaultColor: { title: string; description: string };
    withPopover: { title: string; description: string };
    withSwatches: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Color Picker — Cubby UI',
    description: 'A color picker with a saturation/brightness panel, hue slider, hex input, and optional swatch presets. Supports drag selection, keyboard input, and bidirectional hex sync.',
    category: 'Forms',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Drag on the saturation panel to adjust saturation (horizontal) and brightness (vertical). Use the hue bar below to change the base hue. The hex input and preview swatch sync in real time.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      defaultColor: {
        title: 'Default Color',
        description: 'Set an initial color via <code class="cu-code">data-cu-color-picker-value</code> or the hidden input\'s value. The picker initializes with the specified color\'s hue, saturation, and brightness.',
      },
      withPopover: {
        title: 'With Popover',
        description: 'Combine with the Popover component for a compact trigger-based color picker. Remove the picker\'s border and shadow when nesting inside <code class="cu-code">cu-popover-content</code>.',
      },
      withSwatches: {
        title: 'With Swatches',
        description: 'Add preset color swatches for quick selection. Each swatch uses <code class="cu-code">data-cu-color-picker-swatch</code> with a hex value. Clicking a swatch updates the picker to that color.',
      },
    },
    classDescriptions: {
      'cu-color-picker': 'Main container with border, padding, and shadow',
      'cu-color-picker-saturation': 'Saturation/brightness panel with HSV gradient overlay',
      'cu-color-picker-saturation-pointer': 'Draggable circular pointer on the saturation panel',
      'cu-color-picker-hue': 'Hue slider bar with rainbow gradient',
      'cu-color-picker-hue-pointer': 'Draggable circular pointer on the hue bar',
      'cu-color-picker-controls': 'Flex row containing preview swatch and hex input',
      'cu-color-picker-preview': 'Color preview swatch reflecting the current selection',
      'cu-color-picker-input': 'Hex color input field with monospace font',
      'cu-color-picker-swatches': 'Flex-wrap container for preset color swatches',
      'cu-color-picker-swatch': 'Individual preset swatch button with hover scale effect',
    },
  },
  'zh-tw': {
    title: 'Color Picker — Cubby UI',
    description: '色彩選擇器，包含飽和度/亮度面板、色相滑桿、hex 輸入框和可選的預設色票。支援拖曳選色、鍵盤輸入和雙向 hex 同步。',
    category: '表單',
    sections: {
      usage: {
        title: '使用方式',
        description: '在飽和度面板上拖曳以調整飽和度（水平）和亮度（垂直）。使用下方的色相條來改變基礎色相。hex 輸入框和預覽色票會即時同步。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      defaultColor: {
        title: '預設顏色',
        description: '透過 <code class="cu-code">data-cu-color-picker-value</code> 或隱藏 input 的值設定初始顏色。選色器會以指定顏色的色相、飽和度和亮度進行初始化。',
      },
      withPopover: {
        title: '搭配 Popover',
        description: '搭配 Popover 元件建立緊湊的觸發式色彩選擇器。嵌套在 <code class="cu-code">cu-popover-content</code> 內時，移除選色器的邊框和陰影。',
      },
      withSwatches: {
        title: '預設色票',
        description: '加入預設色票以便快速選色。每個色票使用 <code class="cu-code">data-cu-color-picker-swatch</code> 搭配 hex 值。點擊色票會將選色器更新為該顏色。',
      },
    },
    classDescriptions: {
      'cu-color-picker': '主容器，含邊框、內距和陰影',
      'cu-color-picker-saturation': '飽和度/亮度面板，含 HSV 漸層覆蓋',
      'cu-color-picker-saturation-pointer': '飽和度面板上的可拖曳圓形指標',
      'cu-color-picker-hue': '色相滑桿條，含彩虹漸層',
      'cu-color-picker-hue-pointer': '色相條上的可拖曳圓形指標',
      'cu-color-picker-controls': '包含預覽色票和 hex 輸入框的 flex 列',
      'cu-color-picker-preview': '反映當前選色的預覽色票',
      'cu-color-picker-input': 'Hex 色碼輸入框，使用等寬字型',
      'cu-color-picker-swatches': '預設色票的 flex-wrap 容器',
      'cu-color-picker-swatch': '個別預設色票按鈕，含 hover 縮放效果',
    },
  },
};
