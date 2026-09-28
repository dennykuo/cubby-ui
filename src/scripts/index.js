/**
 * Cubby UI — Interactive component scripts
 * ESM 入口；由 scripts/build-js.mjs 以 esbuild 打包成 UMD（dist/core/cubby-ui.js）。
 */
import { registry } from "./core/registry.js";
import { setupAlertDialogs } from "./components/alert-dialog.js";
import { setupAlertExpandables } from "./components/alert-expandable.js";
import { setupBackToTops } from "./components/back-to-top.js";
import { setupCarousels } from "./components/carousel.js";
import { setupCheckboxGroups } from "./components/checkbox-group.js";
import { setupCodeBlocks } from "./components/code-block.js";
import { setupColorPickers } from "./components/color-picker.js";
import { setupComboboxes } from "./components/combobox.js";
import { setupCommandPalettes } from "./components/command-palette.js";
import { setupContextMenus } from "./components/context-menu.js";
import { setupCountdowns } from "./components/countdown.js";
import { setupDataTableExpandables } from "./components/data-table-expandable.js";
import { setupDatePickers } from "./components/date-picker.js";
import { setupDialogs } from "./components/dialog.js";
import { setupDrawers } from "./components/drawer.js";
import { setupDropdowns } from "./components/dropdown.js";
import { setupDropzones } from "./components/dropzone.js";
import { setupImageCompares } from "./components/image-compare.js";
import { setupInputClearables } from "./components/input-clearable.js";
import { setupKanbans } from "./components/kanban.js";
import { setupMenubars } from "./components/menubar.js";
import { setupMobileNav } from "./components/mobile-nav.js";
import { setupMultiSelects } from "./components/multi-select.js";
import { setupNumberInputs } from "./components/number-input.js";
import { setupPasswordInputs } from "./components/password-input.js";
import { setupPinInputs } from "./components/pin-input.js";
import { setupPopovers } from "./components/popover.js";
import { setupRatings } from "./components/rating.js";
import { setupResizables } from "./components/resizable.js";
import { setupSegmentedControls } from "./components/segmented-control.js";
import { setupSortableLists } from "./components/sortable-list.js";
import { setupSpeedDials } from "./components/speed-dial.js";
import { setupTabs } from "./components/tabs.js";
import { setupTagInputs } from "./components/tag-input.js";
import { toastAPI, setupToasts } from "./components/toast.js";
import { setupToggleGroups } from "./components/toggle-group.js";
import { setupTours } from "./components/tour.js";
import { setupTransferLists } from "./components/transfer-list.js";
import { setupDocumentListeners } from "./core/document-listeners.js";

function init() {
  setupDocumentListeners();
  setupTabs();
  setupDropdowns();
  setupComboboxes();
  setupMultiSelects();
  setupNumberInputs();
  setupDropzones();
  setupTransferLists();
  setupDialogs();
  setupDrawers();
  setupAlertDialogs();
  setupToasts();
  setupPopovers();
  setupMenubars();
  setupMobileNav();
  setupPasswordInputs();
  setupSegmentedControls();
  setupPinInputs();
  setupCheckboxGroups();
  setupCodeBlocks();
  setupCarousels();
  setupContextMenus();
  setupResizables();
  setupCommandPalettes();
  setupDatePickers();
  setupColorPickers();
  setupToggleGroups();
  setupRatings();
  setupTagInputs();
  setupSortableLists();
  setupCountdowns();
  setupImageCompares();
  setupSpeedDials();
  setupBackToTops();
  setupKanbans();
  setupTours();
  setupInputClearables();
  setupAlertExpandables();
  setupDataTableExpandables();
}

function destroy() {
  registry.dropdowns = [];
  registry.comboboxes = [];
  registry.multiSelects = [];
  registry.popovers = [];
  registry.menubars = [];
  registry.tabs = [];
  registry.numberInputs = [];
  registry.dropzones = [];
  registry.transferLists = [];
  registry.mobileNavs = [];
  registry.tagInputs = [];
  registry.sortableLists = [];
  registry.toggleGroups = [];
  registry.ratings = [];
  registry.countdowns.forEach(function (c) { clearTimeout(c.timer); });
  registry.countdowns = [];
  registry.imageCompares.forEach(function (c) { if (c.cleanup) c.cleanup(); });
  registry.imageCompares = [];
  registry.speedDials = [];
  registry.backToTops.forEach(function (b) { if (b.cleanup) b.cleanup(); });
  registry.backToTops = [];
  registry.kanbans = [];
  registry.tours.forEach(function (t) { if (t.close) t.close(); });
  registry.tours = [];
  registry.inputClearables = [];
  registry.alertExpandables = [];
  registry.dataTableExpandables = [];

  // 完整卸載 document 級 delegated listener(init() 會在重新初始化時重新註冊)
  if (registry.docClickHandler) document.removeEventListener("click", registry.docClickHandler);
  if (registry.docKeydownHandler) document.removeEventListener("keydown", registry.docKeydownHandler);
  if (registry.cmdPaletteKeyHandler) document.removeEventListener("keydown", registry.cmdPaletteKeyHandler);
  if (registry.docContextmenuHandler) document.removeEventListener("contextmenu", registry.docContextmenuHandler);
  if (registry.docScrollHandler) document.removeEventListener("scroll", registry.docScrollHandler);
  registry.docClickHandler = null;
  registry.docKeydownHandler = null;
  registry.cmdPaletteKeyHandler = null;
  registry.docContextmenuHandler = null;
  registry.docScrollHandler = null;
  registry.contextMenus = [];
  registry.datePickers = [];
  registry.docListenersReady = false;
  document._cuCommandPaletteGlobal = false;
}

function refresh() {
  var inBody = function (o) { return document.body.contains(o.el); };
  registry.dropdowns = registry.dropdowns.filter(inBody);
  registry.comboboxes = registry.comboboxes.filter(inBody);
  registry.multiSelects = registry.multiSelects.filter(inBody);
  registry.popovers = registry.popovers.filter(inBody);
  registry.menubars = registry.menubars.filter(inBody);
  registry.tabs = registry.tabs.filter(inBody);
  registry.numberInputs = registry.numberInputs.filter(inBody);
  registry.dropzones = registry.dropzones.filter(inBody);
  registry.transferLists = registry.transferLists.filter(inBody);
  registry.mobileNavs = registry.mobileNavs.filter(inBody);
  registry.tagInputs = registry.tagInputs.filter(inBody);
  registry.sortableLists = registry.sortableLists.filter(inBody);
  registry.toggleGroups = registry.toggleGroups.filter(inBody);
  registry.ratings = registry.ratings.filter(inBody);
  registry.contextMenus = registry.contextMenus.filter(inBody);
  registry.datePickers = registry.datePickers.filter(inBody);
  registry.countdowns.forEach(function (c) { if (!inBody(c)) clearTimeout(c.timer); });
  registry.countdowns = registry.countdowns.filter(inBody);
  registry.imageCompares.forEach(function (c) { if (!inBody(c) && c.cleanup) c.cleanup(); });
  registry.imageCompares = registry.imageCompares.filter(inBody);
  registry.speedDials = registry.speedDials.filter(inBody);
  registry.backToTops.forEach(function (b) { if (!inBody(b) && b.cleanup) b.cleanup(); });
  registry.backToTops = registry.backToTops.filter(inBody);
  registry.kanbans = registry.kanbans.filter(inBody);
  registry.tours = registry.tours.filter(inBody);
  registry.inputClearables = registry.inputClearables.filter(inBody);
  registry.alertExpandables = registry.alertExpandables.filter(inBody);
  registry.dataTableExpandables = registry.dataTableExpandables.filter(inBody);
  init();
}

// Auto-init
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}

const CubbyUI = { init: init, destroy: destroy, refresh: refresh, toast: toastAPI };

export default CubbyUI;
