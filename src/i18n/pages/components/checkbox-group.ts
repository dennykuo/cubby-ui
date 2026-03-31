import type { Locale } from '../../index';

export const checkboxGroupPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    selectAll: { title: string; description: string };
    preSelected: { title: string; description: string };
    disabled: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Checkbox Group — Cubby UI',
    description: 'A grouped set of checkboxes with an optional select-all control that supports all / none / indeterminate states.',
    category: 'Forms',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Use <code class="cu-code">cu-checkbox-group</code> as the container with <code class="cu-code">cu-checkbox-group-items</code> for the indented checkbox list. Add <code class="cu-code">data-cu-checkbox-group</code> and <code class="cu-code">data-cu-checkbox-group-item</code> to enable JS functionality.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      selectAll: {
        title: 'Select All',
        description: 'Add a checkbox with <code class="cu-code">data-cu-checkbox-group-selectall</code> to control all items. It automatically enters an indeterminate state when only some items are checked. Wrap it in <code class="cu-code">cu-checkbox-group-selectall</code> for a separator below.',
      },
      preSelected: {
        title: 'Pre-selected (Indeterminate)',
        description: 'When some items are pre-checked, the select-all checkbox enters an indeterminate state automatically on initialization.',
      },
      disabled: {
        title: 'Disabled',
        description: 'Add the <code class="cu-code">disabled</code> attribute to individual checkboxes. Disabled items are skipped during select-all toggling.',
      },
    },
    classDescriptions: {
      'cu-checkbox-group': 'Group container with vertical flex layout',
      'cu-checkbox-group-label': 'Group heading label',
      'cu-checkbox-group-selectall': 'Wrapper for select-all checkbox with bottom border',
      'cu-checkbox-group-items': 'Indented container for child checkboxes',
    },
  },
  'zh-tw': {
    title: 'Checkbox Group — Cubby UI',
    description: '一組核取方塊，附帶可選的全選控制，支援全選 / 全不選 / 不確定狀態。',
    category: '表單',
    sections: {
      usage: {
        title: '使用方式',
        description: '使用 <code class="cu-code">cu-checkbox-group</code> 作為容器，搭配 <code class="cu-code">cu-checkbox-group-items</code> 放置縮排的核取方塊列表。加入 <code class="cu-code">data-cu-checkbox-group</code> 和 <code class="cu-code">data-cu-checkbox-group-item</code> 以啟用 JS 功能。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      selectAll: {
        title: '全選',
        description: '加入帶有 <code class="cu-code">data-cu-checkbox-group-selectall</code> 的核取方塊來控制所有項目。當僅部分項目被勾選時，會自動進入不確定狀態。使用 <code class="cu-code">cu-checkbox-group-selectall</code> 包裹可在下方加上分隔線。',
      },
      preSelected: {
        title: '預選（不確定狀態）',
        description: '當部分項目已預先勾選時，全選核取方塊會在初始化時自動進入不確定狀態。',
      },
      disabled: {
        title: '停用',
        description: '對個別核取方塊加入 <code class="cu-code">disabled</code> 屬性。已停用的項目在全選切換時會被跳過。',
      },
    },
    classDescriptions: {
      'cu-checkbox-group': '群組容器，垂直 flex 排列',
      'cu-checkbox-group-label': '群組標題標籤',
      'cu-checkbox-group-selectall': '全選核取方塊的包裝器，含底部分隔線',
      'cu-checkbox-group-items': '子核取方塊的縮排容器',
    },
  },
};
