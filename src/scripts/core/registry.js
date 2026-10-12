/**
 * 共享的執行期狀態：各元件的追蹤陣列與 document 級 delegated handler。
 * 使用單一物件（而非各自的 module binding）是因為 destroy() / refresh() 需要整個重新指派。
 */
export const registry = {
  dropdowns: [],
  comboboxes: [],
  multiSelects: [],
  popovers: [],
  menubars: [],
  tabs: [],
  numberInputs: [],
  dropzones: [],
  transferLists: [],
  mobileNavs: [],
  tagInputs: [],
  sortableLists: [],
  toggleGroups: [],
  ratings: [],
  countdowns: [],
  imageCompares: [],
  speedDials: [],
  backToTops: [],
  kanbans: [],
  tours: [],
  inputClearables: [],
  alertExpandables: [],
  dataTableExpandables: [],
  docListenersReady: false,
  docClickHandler: null,
  docKeydownHandler: null,
  cmdPaletteKeyHandler: null,
  copyClickHandler: null,
  docContextmenuHandler: null,
  docScrollHandler: null,
  contextMenus: [],
  datePickers: [],
};

/**
 * 登記元件到追蹤清單，並把登記資料存在元素上（`_cuEntries`），供 destroy() 後的 init() 還原。
 * @param {string} list registry 上的清單名稱（例如 "dropdowns"）
 * @param {{ el: Element, resume?: () => void, [key: string]: any }} entry
 */
export function track(list, entry) {
  registry[list].push(entry);
  if (!entry.el._cuEntries) entry.el._cuEntries = {};
  entry.el._cuEntries[list] = entry;
  return entry;
}

/**
 * 已初始化的元素（帶 `_cuInit`）再次 init() 時呼叫：元素本身的事件監聽器仍在，不重新綁定，
 * 但 destroy() 會清空追蹤清單，這裡把原登記資料放回清單，讓 document 級 handler（外部點擊、
 * Escape、方向鍵等）重新認得它；若登記資料有 `resume()`（destroy 時停掉的計時器 / window 監聽器），
 * 一併恢復。已在清單中（未經 destroy）時不做任何事。
 * @param {string} list
 * @param {Element} el
 */
export function restore(list, el) {
  var entry = el._cuEntries && el._cuEntries[list];
  if (!entry || registry[list].indexOf(entry) !== -1) return;
  registry[list].push(entry);
  if (entry.resume) entry.resume();
}
