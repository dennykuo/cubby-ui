import type { Locale } from '../../index';

export const timelinePage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    withColors: { title: string; description: string };
    withIcons: { title: string; description: string };
    withCardContent: { title: string; description: string };
    horizontal: { title: string; description: string };
    alternating: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Timeline — Cubby UI',
    description: 'Displays a vertical timeline of events in chronological order.',
    category: 'Data Display',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Build a timeline with <code class="cu-code">cu-timeline</code> container and <code class="cu-code">cu-timeline-item</code> elements.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      withColors: {
        title: 'With Colors',
        description: 'Use dot color variants like <code class="cu-code">cu-timeline-dot-success</code> to indicate different event types.',
      },
      withIcons: {
        title: 'With Icons',
        description: 'Place an SVG icon with <code class="cu-code">cu-timeline-dot-icon</code> inside the dot for richer visual cues.',
      },
      withCardContent: {
        title: 'With Card Content',
        description: 'Wrap timeline content in a <code class="cu-code">cu-card</code> for richer entries like commit details or deployment logs.',
      },
      horizontal: {
        title: 'Horizontal',
        description: 'Use <code class="cu-code">cu-timeline-horizontal</code> for a horizontal step-based timeline, suitable for order tracking or workflow progress.',
      },
      alternating: {
        title: 'Alternating',
        description: 'Use <code class="cu-code">cu-timeline-alternating</code> for a centered timeline with items alternating between left and right sides.',
      },
    },
    classDescriptions: {
      'cu-timeline': 'Container with vertical connector line',
      'cu-timeline-item': 'Individual timeline entry',
      'cu-timeline-dot': 'Circle marker on the timeline',
      'cu-timeline-dot-icon': 'Icon inside the dot',
      'cu-timeline-dot-primary': 'Primary colored dot',
      'cu-timeline-dot-success': 'Success colored dot',
      'cu-timeline-dot-warning': 'Warning colored dot',
      'cu-timeline-dot-destructive': 'Destructive colored dot',
      'cu-timeline-dot-info': 'Info colored dot',
      'cu-timeline-content': 'Content area for title, description, and time',
      'cu-timeline-title': 'Event title',
      'cu-timeline-description': 'Event description text',
      'cu-timeline-time': 'Timestamp text',
      'cu-timeline-horizontal': 'Horizontal timeline layout',
      'cu-timeline-alternating': 'Centered alternating left-right layout',
    },
  },
  'zh-tw': {
    title: 'Timeline — Cubby UI',
    description: '以垂直時間軸形式按時間順序展示事件。',
    category: '資料展示',
    sections: {
      usage: {
        title: '使用方式',
        description: '使用 <code class="cu-code">cu-timeline</code> 容器和 <code class="cu-code">cu-timeline-item</code> 元素建立時間軸。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      withColors: {
        title: '搭配顏色',
        description: '使用圓點顏色變體如 <code class="cu-code">cu-timeline-dot-success</code> 來標示不同事件類型。',
      },
      withIcons: {
        title: '搭配圖示',
        description: '在圓點內放入帶有 <code class="cu-code">cu-timeline-dot-icon</code> 的 SVG 圖示，以提供更豐富的視覺提示。',
      },
      withCardContent: {
        title: '搭配卡片內容',
        description: '將時間軸內容包裹在 <code class="cu-code">cu-card</code> 中，適合呈現 commit 詳情或部署日誌等豐富內容。',
      },
      horizontal: {
        title: '水平佈局',
        description: '使用 <code class="cu-code">cu-timeline-horizontal</code> 建立水平步驟式時間軸，適合訂單追蹤或流程進度。',
      },
      alternating: {
        title: '交錯排列',
        description: '使用 <code class="cu-code">cu-timeline-alternating</code> 建立置中時間軸，項目在左右兩側交替排列。',
      },
    },
    classDescriptions: {
      'cu-timeline': '容器，帶垂直連接線',
      'cu-timeline-item': '個別時間軸項目',
      'cu-timeline-dot': '時間軸上的圓形標記',
      'cu-timeline-dot-icon': '圓點內的圖示',
      'cu-timeline-dot-primary': '主色圓點',
      'cu-timeline-dot-success': '成功色圓點',
      'cu-timeline-dot-warning': '警告色圓點',
      'cu-timeline-dot-destructive': '錯誤色圓點',
      'cu-timeline-dot-info': '資訊色圓點',
      'cu-timeline-content': '標題、描述和時間的內容區域',
      'cu-timeline-title': '事件標題',
      'cu-timeline-description': '事件描述文字',
      'cu-timeline-time': '時間戳文字',
      'cu-timeline-horizontal': '水平時間軸佈局',
      'cu-timeline-alternating': '置中左右交替佈局',
    },
  },
};
