import type { Locale } from '../../index';

export const sidebarPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withHeaderFooter: { title: string; description: string };
    withSections: { title: string; description: string };
    stickySidebar: { title: string; description: string };
    withIcons: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Sidebar — Cubby UI',
    description: 'A vertical navigation panel composed of header, content, footer, sections, and items.',
    category: 'Layouts',
    sections: {
      usage: {
        title: 'Usage',
        description: 'A sidebar is built with <code class="cu-code">cu-sidebar</code> as the container and <code class="cu-code">cu-sidebar-item</code> for each navigation link. Wrap items in <code class="cu-code">cu-sidebar-content</code> for a scrollable area.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withHeaderFooter: {
        title: 'With Header & Footer',
        description: 'Use <code class="cu-code">cu-sidebar-header</code> for branding and <code class="cu-code">cu-sidebar-footer</code> for user info or actions. Both are optional.',
      },
      withSections: {
        title: 'With Sections',
        description: 'Use <code class="cu-code">cu-sidebar-section</code> and <code class="cu-code">cu-sidebar-section-title</code> for first-level headings. Nest <code class="cu-code">cu-sidebar-group</code> and <code class="cu-code">cu-sidebar-group-title</code> inside a section for second-level sub-headings with a decorative line.',
      },
      stickySidebar: {
        title: 'Sticky Sidebar',
        description: 'To keep the sidebar fixed while the main content scrolls, apply <code class="cu-code">sticky</code> positioning with a <code class="cu-code">top</code> offset matching your header height and a corresponding <code class="cu-code">height</code> of the remaining viewport. Add <code class="cu-code">shrink-0</code> to prevent flex from compressing the sidebar. <code class="cu-code">cu-sidebar-content</code> already includes <code class="cu-code">overflow-y-auto</code>, so a scrollbar appears automatically when navigation items exceed the available height.',
      },
      withIcons: {
        title: 'With Icons',
        description: 'Items support inline SVG icons. The <code class="cu-code">cu-sidebar-item</code> class includes <code class="cu-code">gap-2</code> for icon spacing.',
      },
    },
    classDescriptions: {
      'cu-sidebar': 'Sidebar container, fixed width 14rem',
      'cu-sidebar-header': 'Sidebar header area',
      'cu-sidebar-content': 'Scrollable content area',
      'cu-sidebar-footer': 'Sidebar footer area',
      'cu-sidebar-section': 'First-level section block',
      'cu-sidebar-section-title': 'First-level section title, uppercase with wide letter-spacing',
      'cu-sidebar-group': 'Second-level group block',
      'cu-sidebar-group-title': 'Second-level group title with decorative line',
      'cu-sidebar-item': 'Navigation item link',
      'cu-sidebar-item-active': 'Active state with primary background and text',
      'cu-sidebar-separator': 'Horizontal separator',
    },
  },
  'zh-tw': {
    title: 'Sidebar — Cubby UI',
    description: '由標頭、內容、頁尾、分區和項目組成的垂直導航面板。',
    category: '佈局',
    sections: {
      usage: {
        title: '使用方式',
        description: '使用 <code class="cu-code">cu-sidebar</code> 作為容器，<code class="cu-code">cu-sidebar-item</code> 用於每個導航連結。將項目包裹在 <code class="cu-code">cu-sidebar-content</code> 中以建立可捲動區域。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withHeaderFooter: {
        title: '帶標頭和頁尾',
        description: '使用 <code class="cu-code">cu-sidebar-header</code> 放置品牌標誌，<code class="cu-code">cu-sidebar-footer</code> 放置使用者資訊或操作。兩者皆為選用。',
      },
      withSections: {
        title: '帶分區',
        description: '使用 <code class="cu-code">cu-sidebar-section</code> 和 <code class="cu-code">cu-sidebar-section-title</code> 建立第一層標題。在分區內嵌套 <code class="cu-code">cu-sidebar-group</code> 和 <code class="cu-code">cu-sidebar-group-title</code> 建立帶有裝飾線的第二層子標題。',
      },
      stickySidebar: {
        title: '固定側邊欄',
        description: '若要在主內容捲動時保持側邊欄固定，使用 <code class="cu-code">sticky</code> 定位，搭配與標頭高度對應的 <code class="cu-code">top</code> 偏移和剩餘視窗的 <code class="cu-code">height</code>。加入 <code class="cu-code">shrink-0</code> 防止 flex 壓縮側邊欄。<code class="cu-code">cu-sidebar-content</code> 已包含 <code class="cu-code">overflow-y-auto</code>，當導航項目超出可用高度時會自動出現捲軸。',
      },
      withIcons: {
        title: '帶圖示',
        description: '項目支援行內 SVG 圖示。<code class="cu-code">cu-sidebar-item</code> 類別包含 <code class="cu-code">gap-2</code> 提供圖示間距。',
      },
    },
    classDescriptions: {
      'cu-sidebar': '側邊欄容器，固定寬度 14rem',
      'cu-sidebar-header': '側邊欄標頭區域',
      'cu-sidebar-content': '可捲動內容區域',
      'cu-sidebar-footer': '側邊欄頁尾區域',
      'cu-sidebar-section': '第一層分區區塊',
      'cu-sidebar-section-title': '第一層分區標題，大寫並加寬字距',
      'cu-sidebar-group': '第二層群組區塊',
      'cu-sidebar-group-title': '第二層群組標題，帶有裝飾線',
      'cu-sidebar-item': '導航項目連結',
      'cu-sidebar-item-active': '啟用狀態，帶有 Primary 背景和文字',
      'cu-sidebar-separator': '水平分隔線',
    },
  },
};
