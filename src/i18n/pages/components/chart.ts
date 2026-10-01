import type { Locale } from '../../index';

export const chartPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    line: { title: string; description: string };
    donut: { title: string; description: string };
    colors: { title: string; description: string };
    legend: { title: string; description: string };
    tooltip: { title: string; description: string };
    empty: { title: string; description: string };
    loading: { title: string; description: string };
    chartjs: { title: string; description: string; note: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Chart — Cubby UI',
    description: 'A card-style container for charts drawn by an external library such as Chart.js, or by inline SVG. It provides the header, plot area, legend, tooltip, empty and loading states, plus a five-color categorical palette exposed as CSS variables (<code class="cu-code">--color-chart-1</code> ~ <code class="cu-code">--color-chart-5</code>) that adapts to dark mode. Cubby UI ships no charting JavaScript.',
    category: 'Data Display',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Wrap the chart in <code class="cu-code">cu-chart</code> with a <code class="cu-code">cu-chart-header</code>, a <code class="cu-code">cu-chart-body</code> and an optional <code class="cu-code">cu-chart-footer</code>. Put the <code class="cu-code">&lt;canvas&gt;</code> or <code class="cu-code">&lt;svg&gt;</code> inside <code class="cu-code">cu-chart-canvas</code>, a relatively positioned box with an explicit height, as Chart.js expects. The previews on this page use inline SVG with sample data.',
      },
      line: {
        title: 'Headline Value & Actions',
        description: 'Add <code class="cu-code">cu-chart-value</code> under the title for a headline number, and place filters in <code class="cu-code">cu-chart-actions</code> (here a Segmented Control). <code class="cu-code">cu-chart-canvas-sm</code> / <code class="cu-code">cu-chart-canvas-lg</code> change the plot height.',
      },
      donut: {
        title: 'Donut with Vertical Legend',
        description: 'Use <code class="cu-code">cu-chart-canvas-square</code> for pie and donut charts, add <code class="cu-code">cu-chart-body-split</code> to place the chart and legend side by side, and use <code class="cu-code">cu-chart-legend-vertical</code> with <code class="cu-code">cu-chart-legend-value</code> to list the values.',
      },
      colors: {
        title: 'Colors',
        description: 'Series colors come from five design tokens, assigned in fixed order (series 1 always uses <code class="cu-code">--color-chart-1</code>) and redefined under <code class="cu-code">.dark</code>. The palette is checked for lightness, color-vision-deficiency separation and 3:1 contrast against the card in both modes. <code class="cu-code">cu-chart-color-1</code> ~ <code class="cu-code">cu-chart-color-5</code> set <code class="cu-code">currentColor</code>, so legend swatches and SVG marks using <code class="cu-code">fill="currentColor"</code> share the same palette.',
      },
      legend: {
        title: 'Legend',
        description: 'Each <code class="cu-code">cu-chart-legend-item</code> pairs a <code class="cu-code">cu-chart-swatch</code> with a label. Use <code class="cu-code">cu-chart-swatch-dot</code> or <code class="cu-code">cu-chart-swatch-line</code> to match the mark type. When the legend toggles series, render items as <code class="cu-code">&lt;button aria-pressed&gt;</code> and add <code class="cu-code">cu-chart-legend-item-inactive</code> to hidden series.',
      },
      tooltip: {
        title: 'Tooltip',
        description: '<code class="cu-code">cu-chart-tooltip</code> styles the floating box with <code class="cu-code">cu-chart-tooltip-label</code>, <code class="cu-code">cu-chart-tooltip-item</code> and <code class="cu-code">cu-chart-tooltip-value</code>. It is not positioned by itself: set <code class="cu-code">left</code> / <code class="cu-code">top</code> in your chart library\'s tooltip callback (see the Chart.js example below).',
      },
      empty: {
        title: 'Empty State',
        description: 'Place <code class="cu-code">cu-chart-empty</code> inside <code class="cu-code">cu-chart-canvas</code> when there is no data, so the card keeps its height.',
      },
      loading: {
        title: 'Loading State',
        description: '<code class="cu-code">cu-chart-loading</code> fills the plot area with pulsing placeholder bars (heights vary automatically). Set <code class="cu-code">aria-busy="true"</code> on the canvas while loading.',
      },
      chartjs: {
        title: 'Chart.js Integration',
        description: 'Read the tokens with <code class="cu-code">getComputedStyle()</code>, disable Chart.js\'s built-in legend in favor of <code class="cu-code">cu-chart-legend</code>, and re-apply colors when the <code class="cu-code">.dark</code> class changes. The same approach works for ECharts, ApexCharts or any library that accepts color strings.',
        note: 'This example is shown as code only; the documentation site does not load Chart.js.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
    },
    classDescriptions: {
      'cu-chart': 'Card container (border, card background, subtle shadow)',
      'cu-chart-flat': 'No shadow',
      'cu-chart-ghost': 'No border, background or shadow (embed inside another card)',
      'cu-chart-header': 'Header row: title area on the left, actions on the right',
      'cu-chart-header-content': 'Wrapper for title, description and value',
      'cu-chart-title': 'Chart title',
      'cu-chart-description': 'Muted secondary text under the title',
      'cu-chart-value': 'Headline number',
      'cu-chart-actions': 'Right-aligned filters or controls',
      'cu-chart-body': 'Padded area holding the canvas and legend',
      'cu-chart-body-split': 'Canvas and legend side by side (stacked on small screens)',
      'cu-chart-canvas': 'Plot area: relative, full width, h-64',
      'cu-chart-canvas-sm / -lg': 'Plot height h-48 / h-80',
      'cu-chart-canvas-square': 'Square plot area for pie and donut charts',
      'cu-chart-footer': 'Bottom row with top border for notes or trends',
      'cu-chart-legend': 'Legend row (-center / -vertical modifiers)',
      'cu-chart-legend-item': 'Legend entry; as a <button> it gets hover and focus styles',
      'cu-chart-legend-item-inactive': 'Dimmed entry for a hidden series',
      'cu-chart-legend-value': 'Emphasized value inside a legend entry',
      'cu-chart-swatch': 'Color chip (square; -dot / -line shapes)',
      'cu-chart-color-1 ~ 5': 'Sets currentColor to --color-chart-1 ~ 5',
      'cu-chart-tooltip': 'Tooltip box (-label / -item / -value parts)',
      'cu-chart-grid / -axis / -axis-line': 'Recessive gridlines, axis labels and baseline for inline SVG',
      'cu-chart-empty': 'Empty state overlay inside the canvas (-title / -description)',
      'cu-chart-loading': 'Loading overlay with cu-chart-loading-bar placeholders',
    },
  },
  'zh-tw': {
    title: 'Chart — Cubby UI',
    description: '圖表的卡片式容器，搭配 Chart.js 等外部圖表庫或內嵌 SVG 使用。提供標頭、繪圖區、圖例、tooltip、空狀態與載入狀態，以及以 CSS 變數（<code class="cu-code">--color-chart-1</code> ~ <code class="cu-code">--color-chart-5</code>）提供、會隨暗色模式切換的五色類別色盤。Cubby UI 本身不含任何繪圖 JavaScript。',
    category: '資料展示',
    sections: {
      usage: {
        title: '使用方式',
        description: '以 <code class="cu-code">cu-chart</code> 包住圖表，內含 <code class="cu-code">cu-chart-header</code>、<code class="cu-code">cu-chart-body</code> 與選用的 <code class="cu-code">cu-chart-footer</code>。<code class="cu-code">&lt;canvas&gt;</code> 或 <code class="cu-code">&lt;svg&gt;</code> 放在 <code class="cu-code">cu-chart-canvas</code> 中，它是具明確高度的相對定位容器，符合 Chart.js 的需求。本頁預覽以內嵌 SVG 搭配範例資料呈現。',
      },
      line: {
        title: '主數值與操作區',
        description: '在標題下加入 <code class="cu-code">cu-chart-value</code> 顯示主要數字，篩選控制項放在 <code class="cu-code">cu-chart-actions</code>（此處為 Segmented Control）。<code class="cu-code">cu-chart-canvas-sm</code> / <code class="cu-code">cu-chart-canvas-lg</code> 可調整繪圖區高度。',
      },
      donut: {
        title: '環圈圖與垂直圖例',
        description: '圓餅圖與環圈圖使用 <code class="cu-code">cu-chart-canvas-square</code>，在 body 加上 <code class="cu-code">cu-chart-body-split</code> 讓圖表與圖例並排，並以 <code class="cu-code">cu-chart-legend-vertical</code> 搭配 <code class="cu-code">cu-chart-legend-value</code> 列出數值。',
      },
      colors: {
        title: '色彩',
        description: '系列色彩來自五個設計 token，依固定順序指派（系列 1 永遠使用 <code class="cu-code">--color-chart-1</code>），並在 <code class="cu-code">.dark</code> 下重新定義。色盤在兩種模式下皆通過亮度、色覺辨識差異與對卡片背景 3:1 對比的檢查。<code class="cu-code">cu-chart-color-1</code> ~ <code class="cu-code">cu-chart-color-5</code> 設定 <code class="cu-code">currentColor</code>，圖例色塊與使用 <code class="cu-code">fill="currentColor"</code> 的 SVG 圖形因此共用同一組色盤。',
      },
      legend: {
        title: '圖例',
        description: '每個 <code class="cu-code">cu-chart-legend-item</code> 由 <code class="cu-code">cu-chart-swatch</code> 色塊與文字組成。可用 <code class="cu-code">cu-chart-swatch-dot</code> 或 <code class="cu-code">cu-chart-swatch-line</code> 對應圖形種類。若圖例可切換系列顯示，請改用 <code class="cu-code">&lt;button aria-pressed&gt;</code>，並在隱藏的系列加上 <code class="cu-code">cu-chart-legend-item-inactive</code>。',
      },
      tooltip: {
        title: 'Tooltip',
        description: '<code class="cu-code">cu-chart-tooltip</code> 提供浮動框樣式，內含 <code class="cu-code">cu-chart-tooltip-label</code>、<code class="cu-code">cu-chart-tooltip-item</code> 與 <code class="cu-code">cu-chart-tooltip-value</code>。它本身不負責定位，請在圖表庫的 tooltip callback 中設定 <code class="cu-code">left</code> / <code class="cu-code">top</code>（見下方 Chart.js 範例）。',
      },
      empty: {
        title: '空狀態',
        description: '沒有資料時，在 <code class="cu-code">cu-chart-canvas</code> 內放入 <code class="cu-code">cu-chart-empty</code>，卡片高度維持不變。',
      },
      loading: {
        title: '載入狀態',
        description: '<code class="cu-code">cu-chart-loading</code> 以脈動的佔位長條填滿繪圖區（高度自動錯落）。載入期間請在 canvas 加上 <code class="cu-code">aria-busy="true"</code>。',
      },
      chartjs: {
        title: '整合 Chart.js',
        description: '以 <code class="cu-code">getComputedStyle()</code> 讀取 token，關閉 Chart.js 內建圖例改用 <code class="cu-code">cu-chart-legend</code>，並在 <code class="cu-code">.dark</code> class 變化時重新套用色彩。同樣做法也適用於 ECharts、ApexCharts 等接受色彩字串的圖表庫。',
        note: '此範例僅以程式碼呈現，文檔站不會載入 Chart.js。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
    },
    classDescriptions: {
      'cu-chart': '卡片容器（邊框、卡片背景、淡陰影）',
      'cu-chart-flat': '移除陰影',
      'cu-chart-ghost': '移除邊框、背景與陰影（嵌入其他卡片時使用）',
      'cu-chart-header': '標頭列：左側標題區、右側操作區',
      'cu-chart-header-content': '標題、描述與數值的包裝器',
      'cu-chart-title': '圖表標題',
      'cu-chart-description': '標題下方的次要說明文字',
      'cu-chart-value': '主要數值',
      'cu-chart-actions': '靠右的篩選或控制項',
      'cu-chart-body': '容納繪圖區與圖例的內距區塊',
      'cu-chart-body-split': '繪圖區與圖例並排（窄螢幕時上下堆疊）',
      'cu-chart-canvas': '繪圖區：相對定位、滿寬、h-64',
      'cu-chart-canvas-sm / -lg': '繪圖區高度 h-48 / h-80',
      'cu-chart-canvas-square': '圓餅圖與環圈圖用的正方形繪圖區',
      'cu-chart-footer': '帶上邊框的底部列，放註記或趨勢',
      'cu-chart-legend': '圖例列（-center / -vertical 修飾類別）',
      'cu-chart-legend-item': '圖例項目；使用 <button> 時具 hover 與 focus 樣式',
      'cu-chart-legend-item-inactive': '已隱藏系列的淡化項目',
      'cu-chart-legend-value': '圖例項目中強調的數值',
      'cu-chart-swatch': '色塊（方形；-dot / -line 形狀）',
      'cu-chart-color-1 ~ 5': '將 currentColor 設為 --color-chart-1 ~ 5',
      'cu-chart-tooltip': 'Tooltip 浮動框（-label / -item / -value 子元素）',
      'cu-chart-grid / -axis / -axis-line': '內嵌 SVG 用的低調格線、軸標籤與基準線',
      'cu-chart-empty': '繪圖區內的空狀態覆蓋層（-title / -description）',
      'cu-chart-loading': '載入覆蓋層，內含 cu-chart-loading-bar 佔位長條',
    },
  },
};
