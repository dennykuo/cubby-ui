import type { Locale } from '../../index';

export const toolbarPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    textFormatting: { title: string; description: string };
    withSeparator: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Toolbar — Cubby UI',
    description: 'A container for grouping action buttons with visual separators.',
    category: 'Layouts',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Use <code class="cu-code">cu-toolbar</code> as the container, <code class="cu-code">cu-toolbar-group</code> for button groups, <code class="cu-code">cu-toolbar-button</code> for individual buttons, and <code class="cu-code">cu-toolbar-separator</code> between groups.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      textFormatting: {
        title: 'Text Formatting',
        description: 'A text editor toolbar with bold, italic, strikethrough, underline toggles and alignment options. Use <code class="cu-code">cu-toolbar-button-active</code> for active states.',
      },
      withSeparator: {
        title: 'With Separator',
        description: 'Use <code class="cu-code">cu-toolbar-separator</code> to visually separate button groups for different action categories.',
      },
    },
    classDescriptions: {
      'cu-toolbar': 'Toolbar container with border and rounded corners',
      'cu-toolbar-group': 'Button group container',
      'cu-toolbar-button': 'Toolbar button',
      'cu-toolbar-button-active': 'Button active state',
      'cu-toolbar-separator': 'Vertical separator between groups',
    },
  },
  'zh-tw': {
    title: 'Toolbar — Cubby UI',
    description: '用於分組操作按鈕並帶有視覺分隔線的容器。',
    category: '佈局',
    sections: {
      usage: {
        title: '使用方式',
        description: '使用 <code class="cu-code">cu-toolbar</code> 作為容器，<code class="cu-code">cu-toolbar-group</code> 用於按鈕群組，<code class="cu-code">cu-toolbar-button</code> 用於單個按鈕，<code class="cu-code">cu-toolbar-separator</code> 用於群組之間的分隔。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      textFormatting: {
        title: '文字格式化',
        description: '文字編輯器工具列，包含粗體、斜體、刪除線、底線切換和對齊選項。使用 <code class="cu-code">cu-toolbar-button-active</code> 表示啟用狀態。',
      },
      withSeparator: {
        title: '帶分隔線',
        description: '使用 <code class="cu-code">cu-toolbar-separator</code> 在不同操作類別的按鈕群組之間加入視覺分隔。',
      },
    },
    classDescriptions: {
      'cu-toolbar': '工具列容器，帶有邊框和圓角',
      'cu-toolbar-group': '按鈕群組容器',
      'cu-toolbar-button': '工具列按鈕',
      'cu-toolbar-button-active': '按鈕啟用狀態',
      'cu-toolbar-separator': '群組之間的垂直分隔線',
    },
  },
};
