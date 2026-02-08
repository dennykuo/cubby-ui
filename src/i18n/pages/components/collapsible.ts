import type { Locale } from '../../index';

export const collapsiblePage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    bordered: { title: string; description: string };
    group: { title: string; description: string };
    withIcon: { title: string; description: string };
    nested: { title: string; description: string };
    defaultOpen: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Collapsible — Cubby UI',
    description: 'An interactive component which expands/collapses a panel.',
    category: 'Data Display',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Built with native <code class="cu-code">&lt;details&gt;</code> and <code class="cu-code">&lt;summary&gt;</code> elements. Use <code class="cu-code">cu-collapsible</code> on the wrapper, <code class="cu-code">cu-collapsible-trigger</code> on the <code class="cu-code">&lt;summary&gt;</code>, and <code class="cu-code">cu-collapsible-content</code> for the body.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      bordered: {
        title: 'Bordered',
        description: 'Add a border and rounded corners with <code class="cu-code">cu-collapsible-bordered</code>. Opens with a subtle background and shadow.',
      },
      group: {
        title: 'Group',
        description: 'Stack multiple collapsibles with <code class="cu-code">cu-collapsible-group</code> using dividers. Great for FAQ sections.',
      },
      withIcon: {
        title: 'With Icon',
        description: 'Add an icon to the trigger for enhanced visual cues.',
      },
      nested: {
        title: 'Nested',
        description: 'Supports nesting for multi-level settings or category panels.',
      },
      defaultOpen: {
        title: 'Default Open',
        description: 'Add the <code class="cu-code">open</code> attribute to expand the panel by default. Useful for release notes or important announcements.',
      },
    },
    classDescriptions: {
      'cu-collapsible': 'Collapsible container (<code class="cu-code">&lt;details&gt;</code> element)',
      'cu-collapsible-trigger': 'Expand / collapse trigger (<code class="cu-code">&lt;summary&gt;</code> element)',
      'cu-collapsible-content': 'Collapsible content area',
      'cu-collapsible-bordered': 'Bordered variant, shows card background and shadow when expanded',
      'cu-collapsible-group': 'Group container for stacking multiple collapsibles with dividers',
    },
  },
  'zh-tw': {
    title: 'Collapsible — Cubby UI',
    description: '可展開 / 收合面板的互動式元件。',
    category: '資料展示',
    sections: {
      usage: {
        title: '使用方式',
        description: '使用原生 <code class="cu-code">&lt;details&gt;</code> 和 <code class="cu-code">&lt;summary&gt;</code> 元素建構。在外層容器加上 <code class="cu-code">cu-collapsible</code>，<code class="cu-code">&lt;summary&gt;</code> 加上 <code class="cu-code">cu-collapsible-trigger</code>，內容區塊使用 <code class="cu-code">cu-collapsible-content</code>。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      bordered: {
        title: '邊框樣式',
        description: '使用 <code class="cu-code">cu-collapsible-bordered</code> 加上邊框和圓角。展開時帶有淡色背景和陰影。',
      },
      group: {
        title: '群組',
        description: '使用 <code class="cu-code">cu-collapsible-group</code> 搭配分隔線堆疊多個摺疊元件，適合用於 FAQ 區塊。',
      },
      withIcon: {
        title: '搭配圖示',
        description: '在觸發器中加入圖示以增強視覺提示。',
      },
      nested: {
        title: '巢狀',
        description: '支援巢狀結構，適用於多層級設定或分類面板。',
      },
      defaultOpen: {
        title: '預設展開',
        description: '加上 <code class="cu-code">open</code> 屬性可讓面板預設展開。適合用於版本說明或重要公告。',
      },
    },
    classDescriptions: {
      'cu-collapsible': '摺疊容器（<code class="cu-code">&lt;details&gt;</code> 元素）',
      'cu-collapsible-trigger': '展開 / 收合觸發器（<code class="cu-code">&lt;summary&gt;</code> 元素）',
      'cu-collapsible-content': '可收合的內容區域',
      'cu-collapsible-bordered': '邊框變體，展開時顯示卡片背景和陰影',
      'cu-collapsible-group': '群組容器，用於以分隔線堆疊多個摺疊元件',
    },
  },
};
