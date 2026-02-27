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

export interface CubbyUI {
  /** Initialize all interactive components. Auto-called on DOMContentLoaded. Safe to call repeatedly for dynamically added elements. */
  init(): void;
  /** Clear all internal tracking arrays. Use with SPA route transitions before unmounting. */
  destroy(): void;
  /** Remove stale references for detached elements and re-run init(). Use after dynamic content updates. */
  refresh(): void;
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
};
