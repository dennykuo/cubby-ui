import type { Locale } from '../../index';

export const countdownPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    sizes: { title: string; description: string };
    flush: { title: string; description: string };
    withSeparator: { title: string; description: string };
    complete: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Countdown — Cubby UI',
    description: 'Displays a countdown timer to a target date/time, with individual segments for days, hours, minutes, and seconds.',
    category: 'Content',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Use <code class="cu-code">cu-countdown</code> with <code class="cu-code">data-cu-countdown</code> and <code class="cu-code">data-cu-countdown-target</code> to set the target date. Each segment uses <code class="cu-code">cu-countdown-segment</code> with a value and label.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      sizes: {
        title: 'Sizes',
        description: 'Use <code class="cu-code">cu-countdown-sm</code> or <code class="cu-code">cu-countdown-lg</code> for different sizes.',
      },
      flush: {
        title: 'Flush',
        description: 'Use <code class="cu-code">cu-countdown-flush</code> to remove the background and border from segments, creating a minimal inline look.',
      },
      withSeparator: {
        title: 'With Separator',
        description: 'Add <code class="cu-code">cu-countdown-separator</code> elements between segments to display a colon separator.',
      },
      complete: {
        title: 'Complete State',
        description: 'When the countdown reaches zero, all values display <code class="cu-code">00</code>. You can use JavaScript to handle the completion event.',
      },
    },
    classDescriptions: {
      'cu-countdown': 'Container for the countdown timer',
      'cu-countdown-segment': 'Individual time segment (days, hours, etc.)',
      'cu-countdown-value': 'Numeric value display within a segment',
      'cu-countdown-label': 'Label text below the value (e.g. "Days")',
      'cu-countdown-separator': 'Colon separator between segments',
      'cu-countdown-sm': 'Small size variant',
      'cu-countdown-lg': 'Large size variant',
      'cu-countdown-flush': 'Removes background and border from segments',
    },
  },
  'zh-tw': {
    title: 'Countdown 倒數計時 — Cubby UI',
    description: '顯示目標日期/時間的倒數計時器，包含天、時、分、秒等獨立區段。',
    category: 'Content',
    sections: {
      usage: {
        title: '使用方式',
        description: '使用 <code class="cu-code">cu-countdown</code> 搭配 <code class="cu-code">data-cu-countdown</code> 和 <code class="cu-code">data-cu-countdown-target</code> 設定目標日期。每個區段使用 <code class="cu-code">cu-countdown-segment</code> 搭配數值和標籤。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      sizes: {
        title: '尺寸',
        description: '使用 <code class="cu-code">cu-countdown-sm</code> 或 <code class="cu-code">cu-countdown-lg</code> 設定不同尺寸。',
      },
      flush: {
        title: '無邊框',
        description: '使用 <code class="cu-code">cu-countdown-flush</code> 移除區段的背景和邊框，呈現簡約的行內樣式。',
      },
      withSeparator: {
        title: '帶分隔符',
        description: '在區段之間加入 <code class="cu-code">cu-countdown-separator</code> 元素以顯示冒號分隔符。',
      },
      complete: {
        title: '完成狀態',
        description: '當倒數計時歸零時，所有數值顯示為 <code class="cu-code">00</code>。可以使用 JavaScript 處理完成事件。',
      },
    },
    classDescriptions: {
      'cu-countdown': '倒數計時器容器',
      'cu-countdown-segment': '個別時間區段（天、時等）',
      'cu-countdown-value': '區段內的數值顯示',
      'cu-countdown-label': '數值下方的標籤文字（如「天」）',
      'cu-countdown-separator': '區段之間的冒號分隔符',
      'cu-countdown-sm': '小尺寸變體',
      'cu-countdown-lg': '大尺寸變體',
      'cu-countdown-flush': '移除區段的背景和邊框',
    },
  },
};
