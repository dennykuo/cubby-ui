/**
 * Cubby UI — Interactive component scripts
 * Framework-agnostic, vanilla JS (UMD)
 *
 * Usage:
 *   import CubbyUI from 'cubby-ui';        // ES module
 *   const CubbyUI = require('cubby-ui');   // CommonJS
 *   window.CubbyUI                         // Browser global (script tag)
 *
 * All interactive components are initialized automatically on DOMContentLoaded.
 * For dynamically added elements, call CubbyUI.refresh().
 */

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

export interface ToastPromiseOptions<T = unknown> {
  loading: string | ToastOptions;
  success: string | ToastOptions | ((result: T) => string | ToastOptions);
  error: string | ToastOptions | ((err: unknown) => string | ToastOptions);
}

export interface ToastAPI {
  /** Programmatically show a toast notification. Returns the toast DOM element. */
  show(options: ToastOptions): HTMLElement;
  /** Show a loading toast, then update to success/error based on promise result. */
  promise<T>(promise: Promise<T>, options: ToastPromiseOptions<T>): Promise<T>;
}

export interface CubbyUI {
  /** Initialize all interactive components. Auto-called on DOMContentLoaded. Safe to call repeatedly for dynamically added elements. */
  init(): void;
  /** Clear all internal tracking arrays. Use with SPA route transitions before unmounting. */
  destroy(): void;
  /** Remove stale references for detached elements and re-run init(). Use after dynamic content updates. */
  refresh(): void;
  /** Programmatic toast API for showing notifications from JavaScript. */
  toast: ToastAPI;
}

declare const cubbyUI: CubbyUI;
export default cubbyUI;

declare global {
  interface Window {
    CubbyUI: CubbyUI;
  }
}

// ---------------------------------------------------------------------------
// Toast variant type (matches data-cu-toast-variant values)
// ---------------------------------------------------------------------------

export type ToastVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info';

// ---------------------------------------------------------------------------
// Alert / Badge / Button variant types (for reference when generating HTML)
// ---------------------------------------------------------------------------

export type AlertVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info';
export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info';
export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'ghost' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-xs';
export type DialogSize = 'sm' | 'md' | 'xl' | 'full';
export type DrawerDirection = 'right' | 'left' | 'top' | 'bottom';
export type ToastPosition =
  | 'bottom-right'
  | 'bottom-left'
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'bottom-center';

// ---------------------------------------------------------------------------
// Custom events dispatched by CubbyUI components
// ---------------------------------------------------------------------------

/** Custom events dispatched by CubbyUI components. Listen on the component root element. */
export interface CubbyUIEvents {
  /** Fired on [data-cu-combobox] when selection changes */
  "cu:combobox:change": CustomEvent<{ value: string; item: HTMLElement }>;
  /** Fired on [data-cu-multi-select] when selection changes */
  "cu:multiselect:change": CustomEvent<{ selected: string[] }>;
  /** Fired on [data-cu-toggle-group] when selection changes */
  "cu:toggle-group:change": CustomEvent<{ value: string | string[] }>;
  /** Fired on [data-cu-rating] when value changes */
  "cu:rating:change": CustomEvent<{ value: number }>;
  /** Fired on [data-cu-tag-input] when tags change */
  "cu:tag-input:change": CustomEvent<{ tags: string[] }>;
  /** Fired on [data-cu-sortable-list] when order changes */
  "cu:sortable:change": CustomEvent<{ order: Array<{ index: number; text: string }> }>;
  /** Fired on [data-cu-countdown] when countdown reaches zero */
  "cu:countdown:complete": CustomEvent<void>;
  /** Fired on [data-cu-kanban] when a card is moved between columns */
  "cu:kanban:change": CustomEvent<{ card: HTMLElement; column: HTMLElement }>;
  /** Fired on [data-cu-tour] when the tour completes */
  "cu:tour:complete": CustomEvent<void>;
  /** Fired on [data-cu-tabs] when a closable tab is removed */
  "cu:tabs:close": CustomEvent<{ value: string }>;
}

// ---------------------------------------------------------------------------
// data-* attribute constants — for use in TypeScript-driven HTML generation
// ---------------------------------------------------------------------------

/**
 * All data-* attributes used by Cubby UI interactive components.
 * Reference these when generating HTML programmatically to avoid typos.
 *
 * @example
 * el.setAttribute(DATA_ATTRS.TABS_TRIGGER, 'tab1');
 * el.setAttribute(DATA_ATTRS.DIALOG_TRIGGER, 'my-dialog');
 */
export declare const DATA_ATTRS: {
  // Tabs
  readonly TABS: 'data-cu-tabs';
  readonly TABS_TRIGGER: 'data-cu-tabs-trigger';
  readonly TABS_CONTENT: 'data-cu-tabs-content';
  readonly TABS_CLOSE: 'data-cu-tabs-close';
  readonly TABS_SCROLLABLE: 'data-cu-tabs-scrollable';
  readonly TABS_SCROLL_START: 'data-cu-tabs-scroll-start';
  readonly TABS_SCROLL_END: 'data-cu-tabs-scroll-end';

  // Dropdown
  readonly DROPDOWN: 'data-cu-dropdown';
  readonly DROPDOWN_TRIGGER: 'data-cu-dropdown-trigger';
  readonly DROPDOWN_CONTENT: 'data-cu-dropdown-content';

  // Combobox
  readonly COMBOBOX: 'data-cu-combobox';
  readonly COMBOBOX_TRIGGER: 'data-cu-combobox-trigger';
  readonly COMBOBOX_VALUE: 'data-cu-combobox-value';
  readonly COMBOBOX_CONTENT: 'data-cu-combobox-content';
  readonly COMBOBOX_INPUT: 'data-cu-combobox-input';
  readonly COMBOBOX_LIST: 'data-cu-combobox-list';
  readonly COMBOBOX_ITEM: 'data-cu-combobox-item';
  readonly COMBOBOX_EMPTY: 'data-cu-combobox-empty';

  // Multi Select
  readonly MULTI_SELECT: 'data-cu-multi-select';
  readonly MULTI_SELECT_TRIGGER: 'data-cu-multi-select-trigger';
  readonly MULTI_SELECT_CONTENT: 'data-cu-multi-select-content';
  readonly MULTI_SELECT_INPUT: 'data-cu-multi-select-input';
  readonly MULTI_SELECT_LIST: 'data-cu-multi-select-list';
  readonly MULTI_SELECT_ITEM: 'data-cu-multi-select-item';
  readonly MULTI_SELECT_TAGS: 'data-cu-multi-select-tags';
  readonly MULTI_SELECT_PLACEHOLDER: 'data-cu-multi-select-placeholder';
  readonly MULTI_SELECT_EMPTY: 'data-cu-multi-select-empty';
  readonly MULTI_SELECT_VALUE: 'data-cu-value'; // also used by Transfer List
  readonly MULTI_SELECT_REMOVE: 'data-cu-remove'; // tag remove button, value = item value

  // Number Input
  readonly NUMBER_INPUT: 'data-cu-number-input';
  readonly NUMBER_FIELD: 'data-cu-number-field';
  readonly NUMBER_DECREMENT: 'data-cu-number-decrement';
  readonly NUMBER_INCREMENT: 'data-cu-number-increment';

  // Dropzone
  readonly DROPZONE: 'data-cu-dropzone';
  readonly DROPZONE_INPUT: 'data-cu-dropzone-input';

  // Dialog
  readonly DIALOG_TRIGGER: 'data-cu-dialog-trigger';
  readonly DIALOG: 'data-cu-dialog';
  readonly DIALOG_CLOSE: 'data-cu-dialog-close';

  // Drawer
  readonly DRAWER_TRIGGER: 'data-cu-drawer-trigger';
  readonly DRAWER: 'data-cu-drawer';
  readonly DRAWER_CLOSE: 'data-cu-drawer-close';

  // Alert Dialog
  readonly ALERT_DIALOG_TRIGGER: 'data-cu-alert-dialog-trigger';
  readonly ALERT_DIALOG: 'data-cu-alert-dialog';
  readonly ALERT_DIALOG_CANCEL: 'data-cu-alert-dialog-cancel';
  readonly ALERT_DIALOG_ACTION: 'data-cu-alert-dialog-action';

  // Toast
  readonly TOAST_TRIGGER: 'data-cu-toast-trigger';
  readonly TOAST_TITLE: 'data-cu-toast-title';
  readonly TOAST_DESCRIPTION: 'data-cu-toast-description';
  readonly TOAST_VARIANT: 'data-cu-toast-variant';
  readonly TOAST_DURATION: 'data-cu-toast-duration';
  readonly TOAST_CONTAINER: 'data-cu-toast-container';
  readonly TOAST_MAX: 'data-cu-toast-max';
  readonly TOAST_CLOSE: 'data-cu-toast-close';

  // Popover
  readonly POPOVER: 'data-cu-popover';
  readonly POPOVER_TRIGGER: 'data-cu-popover-trigger';
  readonly POPOVER_CONTENT: 'data-cu-popover-content';

  // Menubar
  readonly MENUBAR: 'data-cu-menubar';
  readonly MENUBAR_MENU: 'data-cu-menubar-menu';
  readonly MENUBAR_TRIGGER: 'data-cu-menubar-trigger';
  readonly MENUBAR_CONTENT: 'data-cu-menubar-content';

  // Transfer List
  readonly TRANSFER_LIST: 'data-cu-transfer-list';
  readonly TRANSFER_PANEL: 'data-cu-transfer-panel';
  readonly TRANSFER_TO_RIGHT: 'data-cu-transfer-to-right';
  readonly TRANSFER_TO_LEFT: 'data-cu-transfer-to-left';
  readonly TRANSFER_CHECK: 'data-cu-transfer-check';
  readonly TRANSFER_CHECK_ALL: 'data-cu-transfer-check-all';
  readonly TRANSFER_COUNT: 'data-cu-transfer-count';
  readonly TRANSFER_SEARCH: 'data-cu-transfer-search';

  // Mobile Navigation
  readonly MOBILE_NAV_TRIGGER: 'data-cu-mobile-nav-trigger';
  readonly MOBILE_NAV: 'data-cu-mobile-nav';
  readonly MOBILE_NAV_PANEL: 'data-cu-mobile-nav-panel';
  readonly MOBILE_NAV_CLOSE: 'data-cu-mobile-nav-close';
  readonly MOBILE_NAV_OPEN: 'data-cu-mobile-nav-open';
  readonly MOBILE_NAV_CLONE: 'data-cu-mobile-nav-clone';

  // Toggle Group
  readonly TOGGLE_GROUP: 'data-cu-toggle-group';
  readonly TOGGLE_GROUP_MULTIPLE: 'data-cu-toggle-group-multiple';

  // Rating
  readonly RATING: 'data-cu-rating';
  readonly RATING_STAR: 'data-cu-rating-star';
  readonly RATING_VALUE: 'data-cu-rating-value';
  readonly RATING_MAX: 'data-cu-rating-max';

  // Tag Input
  readonly TAG_INPUT: 'data-cu-tag-input';
  readonly TAG_INPUT_FIELD: 'data-cu-tag-input-field';
  readonly TAG_MAX: 'data-cu-tag-max';
  readonly TAG_VALUE: 'data-cu-tag-value';

  // Sortable List
  readonly SORTABLE_LIST: 'data-cu-sortable-list';
  readonly SORTABLE_ITEM: 'data-cu-sortable-item';
  readonly SORTABLE_HANDLE: 'data-cu-sortable-handle';

  // Countdown
  readonly COUNTDOWN: 'data-cu-countdown';
  readonly COUNTDOWN_TARGET: 'data-cu-countdown-target';
  readonly COUNTDOWN_DAYS: 'data-cu-countdown-days';
  readonly COUNTDOWN_HOURS: 'data-cu-countdown-hours';
  readonly COUNTDOWN_MINUTES: 'data-cu-countdown-minutes';
  readonly COUNTDOWN_SECONDS: 'data-cu-countdown-seconds';

  // Image Compare
  readonly IMAGE_COMPARE: 'data-cu-image-compare';

  // Speed Dial
  readonly SPEED_DIAL: 'data-cu-speed-dial';
  readonly SPEED_DIAL_TRIGGER: 'data-cu-speed-dial-trigger';
  readonly SPEED_DIAL_ACTIONS: 'data-cu-speed-dial-actions';

  // Back to Top
  readonly BACK_TO_TOP: 'data-cu-back-to-top';
  readonly BACK_TO_TOP_THRESHOLD: 'data-cu-back-to-top-threshold';

  // Kanban
  readonly KANBAN: 'data-cu-kanban';
  readonly KANBAN_COLUMN: 'data-cu-kanban-column';
  readonly KANBAN_COLUMN_BODY: 'data-cu-kanban-column-body';
  readonly KANBAN_CARD: 'data-cu-kanban-card';

  // Tour
  readonly TOUR: 'data-cu-tour';
  readonly TOUR_STEPS: 'data-cu-tour-steps';
  readonly TOUR_AUTO: 'data-cu-tour-auto';

  // Data Table Expandable
  readonly DATA_TABLE_EXPANDABLE: 'data-cu-data-table-expandable';
  readonly EXPAND_ROW: 'data-cu-expand-row';

  // Input Clearable
  readonly INPUT_CLEARABLE: 'data-cu-input-clearable';
  readonly INPUT_CLEAR: 'data-cu-input-clear';

  // Alert Expandable
  readonly ALERT_EXPANDABLE: 'data-cu-alert-expandable';
  readonly ALERT_EXPAND_TRIGGER: 'data-cu-alert-expand-trigger';
  readonly ALERT_EXPANDABLE_CONTENT: 'data-cu-alert-expandable-content';

  // Password Input
  readonly PASSWORD_INPUT: 'data-cu-password-input';
  readonly PASSWORD_TOGGLE: 'data-cu-password-toggle';
  readonly PASSWORD_ICON_SHOW: 'data-cu-password-icon-show';
  readonly PASSWORD_ICON_HIDE: 'data-cu-password-icon-hide';

  // Segmented Control
  readonly SEGMENTED: 'data-cu-segmented';

  // Pin Input
  readonly PIN_INPUT: 'data-cu-pin-input';
  readonly PIN_INPUT_TYPE: 'data-cu-pin-input-type'; // "numeric" | "alphanumeric"

  // Checkbox Group
  readonly CHECKBOX_GROUP: 'data-cu-checkbox-group';
  readonly CHECKBOX_GROUP_ITEM: 'data-cu-checkbox-group-item';
  readonly CHECKBOX_GROUP_SELECTALL: 'data-cu-checkbox-group-selectall';

  // Code Block
  readonly CODE_BLOCK: 'data-cu-code-block';
  readonly CODE_BLOCK_COPY: 'data-cu-code-block-copy';
  readonly CODE_BLOCK_LABEL: 'data-cu-code-block-label';

  // Carousel
  readonly CAROUSEL: 'data-cu-carousel';
  readonly CAROUSEL_VIEWPORT: 'data-cu-carousel-viewport';
  readonly CAROUSEL_SLIDE: 'data-cu-carousel-slide';
  readonly CAROUSEL_PREV: 'data-cu-carousel-prev';
  readonly CAROUSEL_NEXT: 'data-cu-carousel-next';
  readonly CAROUSEL_DOT: 'data-cu-carousel-dot';

  // Context Menu
  readonly CONTEXT_MENU: 'data-cu-context-menu';
  readonly CONTEXT_MENU_CONTENT: 'data-cu-context-menu-content';

  // Resizable Panels
  readonly RESIZABLE: 'data-cu-resizable';
  readonly RESIZABLE_PANEL: 'data-cu-resizable-panel';
  readonly RESIZABLE_HANDLE: 'data-cu-resizable-handle';

  // Command Palette
  readonly COMMAND: 'data-cu-command';
  readonly COMMAND_TRIGGER: 'data-cu-command-trigger';
  readonly COMMAND_INPUT: 'data-cu-command-input';
  readonly COMMAND_LIST: 'data-cu-command-list';
  readonly COMMAND_GROUP: 'data-cu-command-group';
  readonly COMMAND_ITEM: 'data-cu-command-item';
  readonly COMMAND_VALUE: 'data-cu-command-value';
  readonly COMMAND_SEPARATOR: 'data-cu-command-separator';
  readonly COMMAND_EMPTY: 'data-cu-command-empty';

  // Calendar
  readonly CALENDAR: 'data-cu-calendar';
  readonly CALENDAR_GRID: 'data-cu-calendar-grid';
  readonly CALENDAR_TITLE: 'data-cu-calendar-title';
  readonly CALENDAR_PREV: 'data-cu-calendar-prev';
  readonly CALENDAR_NEXT: 'data-cu-calendar-next';
  readonly CALENDAR_MIN: 'data-cu-calendar-min';
  readonly CALENDAR_MAX: 'data-cu-calendar-max';

  // Date Picker
  readonly DATE_PICKER: 'data-cu-date-picker';
  readonly DATE_PICKER_TRIGGER: 'data-cu-date-picker-trigger';
  readonly DATE_PICKER_CONTENT: 'data-cu-date-picker-content';
  readonly DATE_PICKER_INPUT: 'data-cu-date-picker-input';
  readonly DATE_PICKER_VALUE: 'data-cu-date-picker-value';

  // Color Picker
  readonly COLOR_PICKER: 'data-cu-color-picker';
  readonly COLOR_PICKER_SATURATION: 'data-cu-color-picker-saturation';
  readonly COLOR_PICKER_SATURATION_POINTER: 'data-cu-color-picker-saturation-pointer';
  readonly COLOR_PICKER_HUE: 'data-cu-color-picker-hue';
  readonly COLOR_PICKER_HUE_POINTER: 'data-cu-color-picker-hue-pointer';
  readonly COLOR_PICKER_PREVIEW: 'data-cu-color-picker-preview';
  readonly COLOR_PICKER_INPUT: 'data-cu-color-picker-input';
  readonly COLOR_PICKER_HIDDEN: 'data-cu-color-picker-hidden';
  readonly COLOR_PICKER_SWATCH: 'data-cu-color-picker-swatch';

  // State attributes (set / removed by the runtime; useful as CSS hooks)
  readonly STATE_OPEN: 'data-cu-open'; // Speed Dial actions panel
  readonly STATE_EXPANDED: 'data-cu-expanded'; // Alert Expandable content
  readonly STATE_VISIBLE: 'data-cu-visible'; // Back to Top button
  readonly STATE_COPIED: 'data-cu-copied'; // Code Block copy button
  readonly STATE_RESIZING: 'data-cu-resizing'; // Resizable handle while dragging
  readonly STATE_COMMAND_ACTIVE: 'data-cu-command-active'; // Command Palette highlighted item
};
