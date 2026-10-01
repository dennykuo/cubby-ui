/**
 * 互動元件 JS（src/scripts/）型別檢查專用的 global augmentation。
 *
 * 宣告各模組掛在 DOM 元素上的自訂 expando 屬性（`_cu*`），供 `tsconfig.scripts.json`
 * 的 checkJs 使用。僅用於開發期型別檢查，不會被打包或複製到 dist/；
 * 對外公開的型別定義是 `cubby-ui.d.ts`，兩者互不影響。
 */
export {};

declare global {
  interface Element {
    /** 元件已初始化旗標，避免重複呼叫 `CubbyUI.init()` 時重複綁定事件 */
    _cuInit?: boolean;
    /** Resizable Panels 容器已初始化旗標 */
    _cuResizableInit?: boolean;
    /** Dialog / Drawer / Alert Dialog：開啟它的觸發元素，關閉時把焦點還給它 */
    _cuTrigger?: HTMLElement | null;
    /** Calendar：目前選取的日期（Date Picker 開啟時由輸入值同步） */
    _cuSelectedDate?: Date | null;
    /** Calendar：重新繪製月曆（Date Picker 開啟時呼叫） */
    _cuRender?: () => void;
    /** Toast：正在執行關閉動畫，避免重複關閉 */
    _cuDismissing?: boolean;
  }

  interface Document {
    /** Command Palette：document 級 ⌘K / Ctrl+K 快捷鍵已註冊 */
    _cuCommandPaletteGlobal?: boolean;
  }

  interface Window {
    /** 舊版 IE 的非標準剪貼簿 API；Pin Input 的 paste 事件在 `e.clipboardData` 不存在時退回使用 */
    clipboardData?: DataTransfer;
  }
}
