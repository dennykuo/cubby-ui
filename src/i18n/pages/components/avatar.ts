import type { Locale } from '../../index';

export const avatarPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    sizes: { title: string; description: string };
    withFallback: { title: string; description: string };
    avatarGroup: { title: string; description: string };
    withStatusIndicator: { title: string; description: string };
    status: { title: string; description: string };
    square: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Avatar — Cubby UI',
    description: 'An image element with a fallback for representing the user.',
    category: 'Data Display',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Use <code class="cu-code">cu-avatar</code> as the container with a size class. Inside, place <code class="cu-code">cu-avatar-image</code> and <code class="cu-code">cu-avatar-fallback</code>.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      sizes: {
        title: 'Sizes',
        description: 'Three sizes are available — <code class="cu-code">cu-avatar-sm</code>, <code class="cu-code">cu-avatar-md</code> (default), and <code class="cu-code">cu-avatar-lg</code>.',
      },
      withFallback: {
        title: 'With Fallback',
        description: 'When no image is provided, the fallback with initials is displayed.',
      },
      avatarGroup: {
        title: 'Avatar Group',
        description: 'Use <code class="cu-code">cu-avatar-group</code> to stack multiple avatars with overlapping negative margin and a background ring. Add <code class="cu-code">cu-avatar-group-count</code> to a fallback to show the remaining count.',
      },
      withStatusIndicator: {
        title: 'With Status Indicator',
        description: 'Add a status dot at the bottom-right corner to indicate online/offline state.',
      },
      status: {
        title: 'Status Indicator',
        description: 'Use <code class="cu-code">cu-avatar-status</code> with a size and color class to show online/offline/busy/away status.',
      },
      square: {
        title: 'Square Avatar',
        description: 'Add <code class="cu-code">cu-avatar-square</code> for a rounded-square shape instead of a circle. Useful for workspace or team icons.',
      },
    },
    classDescriptions: {
      'cu-avatar': 'Avatar container with circular clipping',
      'cu-avatar-sm': 'Small size (32px)',
      'cu-avatar-md': 'Medium size (40px, default)',
      'cu-avatar-lg': 'Large size (48px)',
      'cu-avatar-image': 'Avatar image, aspect-fill',
      'cu-avatar-fallback': 'Fallback display when image fails to load',
      'cu-avatar-group': 'Stacked avatar group with overlapping layout and ring',
      'cu-avatar-group-count': 'Smaller text for the "+N" count fallback',
      'cu-avatar-ring': 'Decorative ring around avatar',
      'cu-avatar-status': 'Positioned status indicator dot',
      'cu-avatar-status-sm': 'Small status dot',
      'cu-avatar-status-md': 'Medium status dot',
      'cu-avatar-status-lg': 'Large status dot',
      'cu-avatar-status-online': 'Online (green)',
      'cu-avatar-status-offline': 'Offline (gray)',
      'cu-avatar-status-busy': 'Busy (red)',
      'cu-avatar-status-away': 'Away (yellow)',
      'cu-avatar-square': 'Square shape (rounded-lg)',
    },
  },
  'zh-tw': {
    title: 'Avatar — Cubby UI',
    description: '帶有備用顯示的圖片元素，用於代表使用者。',
    category: '資料展示',
    sections: {
      usage: {
        title: '使用方式',
        description: '以 <code class="cu-code">cu-avatar</code> 作為容器並搭配尺寸類別。內部放置 <code class="cu-code">cu-avatar-image</code> 和 <code class="cu-code">cu-avatar-fallback</code>。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      sizes: {
        title: '尺寸',
        description: '提供三種尺寸 — <code class="cu-code">cu-avatar-sm</code>、<code class="cu-code">cu-avatar-md</code>（預設）和 <code class="cu-code">cu-avatar-lg</code>。',
      },
      withFallback: {
        title: '備用顯示',
        description: '當未提供圖片時，會顯示帶有首字母的備用內容。',
      },
      avatarGroup: {
        title: '頭像群組',
        description: '使用 <code class="cu-code">cu-avatar-group</code> 將多個頭像以重疊負邊距堆疊，並自動加上背景邊框環。在 fallback 上加入 <code class="cu-code">cu-avatar-group-count</code> 以顯示剩餘數量。',
      },
      withStatusIndicator: {
        title: '搭配狀態指示器',
        description: '在右下角加入狀態圓點，指示線上 / 離線狀態。',
      },
      status: {
        title: '狀態指示',
        description: '使用 <code class="cu-code">cu-avatar-status</code> 搭配尺寸和顏色類別以顯示在線/離線/忙碌/離開狀態。',
      },
      square: {
        title: '方形頭像',
        description: '加入 <code class="cu-code">cu-avatar-square</code> 將圓形改為圓角方形。適用於工作區或團隊圖示。',
      },
    },
    classDescriptions: {
      'cu-avatar': '頭像容器，圓形裁切',
      'cu-avatar-sm': '小尺寸（32px）',
      'cu-avatar-md': '中尺寸（40px，預設）',
      'cu-avatar-lg': '大尺寸（48px）',
      'cu-avatar-image': '頭像圖片，填滿裁切',
      'cu-avatar-fallback': '圖片載入失敗時的備用顯示',
      'cu-avatar-group': '堆疊式頭像群組，帶重疊佈局與邊框環',
      'cu-avatar-group-count': '「+N」計數的較小文字',
      'cu-avatar-ring': '頭像裝飾環',
      'cu-avatar-status': '定位狀態指示點',
      'cu-avatar-status-sm': '小狀態點',
      'cu-avatar-status-md': '中狀態點',
      'cu-avatar-status-lg': '大狀態點',
      'cu-avatar-status-online': '在線（綠色）',
      'cu-avatar-status-offline': '離線（灰色）',
      'cu-avatar-status-busy': '忙碌（紅色）',
      'cu-avatar-status-away': '離開（黃色）',
      'cu-avatar-square': '方形外觀（rounded-lg）',
    },
  },
};
