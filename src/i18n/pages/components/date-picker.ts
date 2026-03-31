import type { Locale } from '../../index';

export const datePickerPage: Record<Locale, {
  title: string;
  description: string;
  category: string;
  sections: {
    usage: { title: string; description: string };
    classes: { title: string; classLabel: string; descriptionLabel: string };
    defaultValue: { title: string; description: string };
    dateRange: { title: string; description: string };
    standaloneCalendar: { title: string; description: string };
  };
  classDescriptions: Record<string, string>;
}> = {
  en: {
    title: 'Date Picker — Cubby UI',
    description: 'A date picker with a calendar popup for selecting dates. Includes a standalone Calendar component for inline display.',
    category: 'Forms',
    sections: {
      usage: {
        title: 'Usage',
        description: 'Click the trigger button to open a calendar popover. Use arrow keys to navigate between days, <code class="cu-code">Enter</code> to select, and <code class="cu-code">Escape</code> to close. The selected date is formatted and shown in the trigger, and stored as ISO format in a hidden input.',
      },
      classes: {
        title: 'CSS Classes',
        classLabel: 'Class',
        descriptionLabel: 'Description',
      },
      defaultValue: {
        title: 'Default Value',
        description: 'Set a default date by providing a value in the hidden input (<code class="cu-code">data-cu-date-picker-input</code>) in ISO format (<code class="cu-code">YYYY-MM-DD</code>). The trigger text should also display the formatted date.',
      },
      dateRange: {
        title: 'Date Range Restriction',
        description: 'Use <code class="cu-code">data-cu-calendar-min</code> and <code class="cu-code">data-cu-calendar-max</code> on the calendar to restrict selectable dates. Dates outside the range are visually disabled and cannot be selected.',
      },
      standaloneCalendar: {
        title: 'Standalone Calendar',
        description: 'The Calendar can be used independently without the Date Picker wrapper. Add <code class="cu-code">data-cu-calendar</code> to the container for automatic initialization. Today\'s date is highlighted with <code class="cu-code">cu-calendar-day-today</code>.',
      },
    },
    classDescriptions: {
      'cu-calendar': 'Calendar container with border, rounded corners, and shadow',
      'cu-calendar-header': 'Month/year navigation header with prev/next buttons',
      'cu-calendar-title': 'Month and year text label',
      'cu-calendar-nav': 'Previous/next month navigation button',
      'cu-calendar-weekdays': 'Weekday labels row (7-column grid)',
      'cu-calendar-weekday': 'Individual weekday label (Su, Mo, Tu...)',
      'cu-calendar-grid': 'Day buttons grid (7-column)',
      'cu-calendar-day': 'Individual day button',
      'cu-calendar-day-today': 'Today\'s date highlight (accent background)',
      'cu-calendar-day-selected': 'Selected date highlight (primary background)',
      'cu-calendar-day-outside': 'Previous/next month days shown in current view',
      'cu-calendar-day-disabled': 'Disabled day (outside min/max range)',
      'cu-date-picker': 'Date picker wrapper (relative positioned)',
      'cu-date-picker-trigger': 'Trigger button with calendar icon and selected date text',
      'cu-date-picker-trigger-icon': 'Calendar icon in the trigger button',
      'cu-date-picker-trigger-placeholder': 'Placeholder text style (muted color)',
      'cu-date-picker-content': 'Popover container for the calendar dropdown',
    },
  },
  'zh-tw': {
    title: 'Date Picker — Cubby UI',
    description: '帶有日曆彈出視窗的日期選擇器。包含可獨立使用的 Calendar 元件，支援行內顯示。',
    category: '表單',
    sections: {
      usage: {
        title: '使用方式',
        description: '點擊觸發按鈕開啟日曆彈出視窗。使用方向鍵在日期間導航，<code class="cu-code">Enter</code> 選擇日期，<code class="cu-code">Escape</code> 關閉。選定的日期會格式化顯示在觸發按鈕中，並以 ISO 格式儲存在隱藏的 input 中。',
      },
      classes: {
        title: 'CSS 類別',
        classLabel: '類別',
        descriptionLabel: '說明',
      },
      defaultValue: {
        title: '預設值',
        description: '透過隱藏 input（<code class="cu-code">data-cu-date-picker-input</code>）設定 ISO 格式（<code class="cu-code">YYYY-MM-DD</code>）的預設日期。觸發按鈕的文字也應顯示格式化後的日期。',
      },
      dateRange: {
        title: '日期範圍限制',
        description: '在日曆上使用 <code class="cu-code">data-cu-calendar-min</code> 和 <code class="cu-code">data-cu-calendar-max</code> 限制可選日期。超出範圍的日期會顯示為停用狀態且無法選取。',
      },
      standaloneCalendar: {
        title: '獨立日曆',
        description: 'Calendar 可以不搭配 Date Picker 包裝器獨立使用。在容器上加入 <code class="cu-code">data-cu-calendar</code> 即可自動初始化。今天的日期會以 <code class="cu-code">cu-calendar-day-today</code> 高亮顯示。',
      },
    },
    classDescriptions: {
      'cu-calendar': '日曆容器，含邊框、圓角和陰影',
      'cu-calendar-header': '月份/年份導航標頭，含上/下月按鈕',
      'cu-calendar-title': '月份和年份文字標籤',
      'cu-calendar-nav': '上/下月導航按鈕',
      'cu-calendar-weekdays': '星期標籤列（7 欄網格）',
      'cu-calendar-weekday': '個別星期標籤（Su、Mo、Tu...）',
      'cu-calendar-grid': '日期按鈕網格（7 欄）',
      'cu-calendar-day': '個別日期按鈕',
      'cu-calendar-day-today': '今天日期高亮（accent 背景）',
      'cu-calendar-day-selected': '選中日期高亮（primary 背景）',
      'cu-calendar-day-outside': '顯示在當前月份中的上/下月日期',
      'cu-calendar-day-disabled': '停用日期（超出 min/max 範圍）',
      'cu-date-picker': 'Date Picker 包裝器（relative 定位）',
      'cu-date-picker-trigger': '觸發按鈕，含日曆圖示和選定日期文字',
      'cu-date-picker-trigger-icon': '觸發按鈕中的日曆圖示',
      'cu-date-picker-trigger-placeholder': '佔位文字樣式（淡色）',
      'cu-date-picker-content': '日曆下拉式 Popover 容器',
    },
  },
};
