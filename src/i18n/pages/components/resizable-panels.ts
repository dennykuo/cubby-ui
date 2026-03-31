import type { Locale } from '../../index';

export const resizablePanelsPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    vertical: { title: string; description: string };
    threePanels: { title: string; description: string };
    nested: { title: string; description: string };
    dataAttributes: { title: string; attributeLabel: string; descriptionLabel: string };
  };
  classDescriptions: Record<string, string>;
  dataAttributeDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Resizable Panels — Cubby UI',
    description: 'Draggable split panels for building resizable layouts like IDE interfaces. Supports horizontal and vertical splits, min/max constraints, multi-panel, and nested layouts.',
    category: 'Layout',
    sections: {
      usage: {
        title: 'Usage',
        description: 'A basic horizontal split with two panels. Set initial sizes using <code class="cu-code">flex-grow</code> values (or the <code class="cu-code">defaultSize</code> prop). Drag the handle to resize.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      vertical: {
        title: 'Vertical Split',
        description: 'Add <code class="cu-code">cu-resizable-vertical</code> (or the <code class="cu-code">vertical</code> prop) to split panels vertically. The container needs a fixed height.',
      },
      threePanels: {
        title: 'Three Panels',
        description: 'Add more panels and handles for multi-panel layouts. Use <code class="cu-code">data-cu-min-size</code> and <code class="cu-code">data-cu-max-size</code> attributes to set percentage constraints.',
      },
      nested: {
        title: 'Nested Panels',
        description: 'Nest resizable containers to create complex IDE-like layouts. The inner container uses <code class="cu-code">border-0 rounded-none</code> to blend seamlessly.',
      },
      dataAttributes: {
        title: 'Data Attributes',
        attributeLabel: 'Attribute',
        descriptionLabel: 'Description',
      },
    },
    classDescriptions: {
      'cu-resizable': 'Flex container with border and rounded corners',
      'cu-resizable-vertical': 'Vertical split modifier (flex-direction: column)',
      'cu-resizable-panel': 'Individual panel, sized by flex-grow ratio',
      'cu-resizable-handle': 'Draggable separator between panels',
    },
    dataAttributeDescriptions: {
      'data-cu-resizable': 'Initializes the resizable container via JS',
      'data-cu-resizable-panel': 'Marks element as a resizable panel',
      'data-cu-resizable-handle': 'Marks element as a drag handle',
      'data-cu-min-size': 'Minimum panel size as a percentage (e.g. <code class="cu-code">20</code>)',
      'data-cu-max-size': 'Maximum panel size as a percentage (e.g. <code class="cu-code">80</code>)',
    },
  },
  'zh-tw': {
    title: 'Resizable Panels — Cubby UI',
    description: '可拖曳的分割面板，用於建構類似 IDE 介面的可調整大小布局。支援水平和垂直分割、最小/最大限制、多面板和巢狀布局。',
    category: '布局',
    sections: {
      usage: {
        title: '使用方式',
        description: '基本的水平分割，包含兩個面板。使用 <code class="cu-code">flex-grow</code> 值（或 <code class="cu-code">defaultSize</code> prop）設定初始大小。拖曳把手以調整大小。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      vertical: {
        title: '垂直分割',
        description: '加入 <code class="cu-code">cu-resizable-vertical</code>（或 <code class="cu-code">vertical</code> prop）以垂直分割面板。容器需要固定高度。',
      },
      threePanels: {
        title: '三面板',
        description: '加入更多面板和把手以建構多面板布局。使用 <code class="cu-code">data-cu-min-size</code> 和 <code class="cu-code">data-cu-max-size</code> 屬性設定百分比限制。',
      },
      nested: {
        title: '巢狀面板',
        description: '巢狀可調整大小的容器以建立複雜的類 IDE 布局。內層容器使用 <code class="cu-code">border-0 rounded-none</code> 以無縫融合。',
      },
      dataAttributes: {
        title: 'Data 屬性',
        attributeLabel: '屬性',
        descriptionLabel: '說明',
      },
    },
    classDescriptions: {
      'cu-resizable': '帶有邊框和圓角的 flex 容器',
      'cu-resizable-vertical': '垂直分割修飾類別（flex-direction: column）',
      'cu-resizable-panel': '單個面板，由 flex-grow 比例決定大小',
      'cu-resizable-handle': '面板之間可拖曳的分隔把手',
    },
    dataAttributeDescriptions: {
      'data-cu-resizable': '透過 JS 初始化可調整大小的容器',
      'data-cu-resizable-panel': '標記元素為可調整大小的面板',
      'data-cu-resizable-handle': '標記元素為拖曳把手',
      'data-cu-min-size': '面板最小尺寸百分比（例如 <code class="cu-code">20</code>）',
      'data-cu-max-size': '面板最大尺寸百分比（例如 <code class="cu-code">80</code>）',
    },
  },
};
