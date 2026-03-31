import type { Locale } from '../../index';

export const navPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    activeItem: { title: string; description: string };
    disabled: { title: string; description: string };
    vertical: { title: string; description: string };
    withIcons: { title: string; description: string };
    verticalWithIcons: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Nav — Cubby UI',
    description: 'A navigation menu that can be used horizontally in headers or vertically in sidebars.',
    category: 'Layouts',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Use <code class="cu-code">cu-nav</code> as the container and <code class="cu-code">cu-nav-item</code> for each link.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      activeItem: {
        title: 'Active Item',
        description: 'Add <code class="cu-code">cu-nav-item-active</code> to mark the current page.',
      },
      disabled: {
        title: 'Disabled',
        description: 'Add <code class="cu-code">cu-nav-item-disabled</code> to make a nav item non-interactive.',
      },
      vertical: {
        title: 'Vertical',
        description: 'Add <code class="cu-code">cu-nav-vertical</code> for vertical layout, suitable for use inside sidebars.',
      },
      withIcons: {
        title: 'With Icons',
        description: 'Items support inline SVG icons. The <code class="cu-code">cu-nav-item</code> class includes <code class="cu-code">gap-2</code> for icon spacing.',
      },
      verticalWithIcons: {
        title: 'Vertical With Icons',
        description: 'Combine vertical layout with icons for a sidebar-style navigation.',
      },
    },
    classDescriptions: {
      'cu-nav': 'Navigation menu container, horizontal layout',
      'cu-nav-vertical': 'Vertical layout modifier',
      'cu-nav-item': 'Navigation item link',
      'cu-nav-item-active': 'Active state with primary background and text',
      'cu-nav-item-disabled': 'Disabled state, non-interactive',
    },
  },
  'zh-tw': {
    title: 'Nav — Cubby UI',
    description: '可在頂部列中水平使用或在側邊欄中垂直使用的導航選單。',
    category: '佈局',
    sections: {
      usage: {
        title: '使用方式',
        description: '使用 <code class="cu-code">cu-nav</code> 作為容器，<code class="cu-code">cu-nav-item</code> 用於每個連結。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      activeItem: {
        title: '啟用項目',
        description: '加入 <code class="cu-code">cu-nav-item-active</code> 標記當前頁面。',
      },
      disabled: {
        title: '停用狀態',
        description: '加入 <code class="cu-code">cu-nav-item-disabled</code> 使導航項目不可互動。',
      },
      vertical: {
        title: '垂直排列',
        description: '加入 <code class="cu-code">cu-nav-vertical</code> 實現垂直佈局，適合在側邊欄中使用。',
      },
      withIcons: {
        title: '帶圖示',
        description: '項目支援行內 SVG 圖示。<code class="cu-code">cu-nav-item</code> 類別包含 <code class="cu-code">gap-2</code> 提供圖示間距。',
      },
      verticalWithIcons: {
        title: '垂直帶圖示',
        description: '結合垂直佈局與圖示，打造側邊欄風格的導航。',
      },
    },
    classDescriptions: {
      'cu-nav': '導航選單容器，水平佈局',
      'cu-nav-vertical': '垂直佈局修飾器',
      'cu-nav-item': '導航項目連結',
      'cu-nav-item-active': '啟用狀態，帶有 Primary 背景和文字',
      'cu-nav-item-disabled': '停用狀態，不可互動',
    },
  },
};
