// ── Clipboard（Copy Button / Code Block 共用）──────────────────
// 寫入剪貼簿（Clipboard API → execCommand 後備）、共用 aria-live 播報區域，
// 以及成功 / 失敗狀態屬性（data-cu-copied / data-cu-copy-failed）的設定與還原。

export var DEFAULT_COPY_SUCCESS = "Copied!";
export var DEFAULT_COPY_ERROR = "Copy failed";
export var DEFAULT_COPY_DURATION = 2000;

/**
 * 寫入剪貼簿：優先使用 Clipboard API，不存在或被拒時退回 execCommand("copy")。
 * @param {string} text
 * @returns {Promise<void>}
 */
export function writeClipboard(text) {
  if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text).catch(function (err) {
      if (legacyCopy(text)) return;
      throw err;
    });
  }
  return new Promise(function (resolve, reject) {
    if (legacyCopy(text)) resolve();
    else reject(new Error("Clipboard API unavailable"));
  });
}

/** 後備方案：非安全來源（http）或舊瀏覽器沒有 Clipboard API 時，以隱藏 textarea + execCommand 複製 */
function legacyCopy(text) {
  if (!document.queryCommandSupported || !document.queryCommandSupported("copy")) return false;
  var active = /** @type {HTMLElement | null} */ (document.activeElement);
  var ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.setAttribute("aria-hidden", "true");
  ta.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none;";
  document.body.appendChild(ta);
  ta.select();
  var ok;
  try {
    ok = document.execCommand("copy");
  } catch (_err) {
    ok = false;
  }
  document.body.removeChild(ta);
  if (active && active.focus) active.focus();
  return ok;
}

/**
 * 取得共用的 `[data-cu-copy-live]` aria-live 區域；不存在時建立一個視覺隱藏的 role="status" 區域。
 * @returns {HTMLElement}
 */
export function getLiveRegion() {
  var live = /** @type {HTMLElement | null} */ (document.querySelector("[data-cu-copy-live]"));
  if (live) return live;
  live = document.createElement("div");
  live.setAttribute("data-cu-copy-live", "");
  live.setAttribute("role", "status");
  live.setAttribute("aria-live", "polite");
  live.setAttribute("aria-atomic", "true");
  // 視覺隱藏（不依賴 CSS 檔）
  live.style.cssText =
    "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;";
  document.body.appendChild(live);
  return live;
}

function announce(message) {
  var live = getLiveRegion();
  // 先清空再寫入，連續複製相同訊息時也能重新播報
  live.textContent = "";
  setTimeout(function () {
    live.textContent = message;
  }, 50);
}

/**
 * 解析狀態維持時間（毫秒）；空值、非數字或負數時回傳預設值。
 * @param {string | null} value
 * @returns {number}
 */
export function parseCopyDuration(value) {
  var duration = parseInt(value, 10);
  return isNaN(duration) || duration < 0 ? DEFAULT_COPY_DURATION : duration;
}

/**
 * 顯示複製結果：在按鈕設定 data-cu-copied（成功）或 data-cu-copy-failed（失敗）、
 * 暫時把 label 文字換成訊息、經共用 aria-live 區域播報、觸發事件，duration 毫秒後還原。
 *
 * @param {HTMLElement} btn 複製按鈕（狀態屬性的掛載點）
 * @param {{
 *   ok: boolean,
 *   message: string,
 *   label?: Element | null,
 *   duration: number,
 *   event?: string,
 *   detail?: unknown,
 * }} result
 */
export function showCopyResult(btn, result) {
  var ok = result.ok;
  var message = result.message;
  var label = result.label;
  if (label && btn._cuCopyLabel == null) btn._cuCopyLabel = label.textContent;

  btn.removeAttribute(ok ? "data-cu-copy-failed" : "data-cu-copied");
  btn.setAttribute(ok ? "data-cu-copied" : "data-cu-copy-failed", "");
  if (label) label.textContent = message;
  announce(message);

  if (result.event) {
    btn.dispatchEvent(new CustomEvent(result.event, { bubbles: true, detail: result.detail }));
  }

  clearTimeout(btn._cuCopyTimer);
  btn._cuCopyTimer = setTimeout(function () {
    btn.removeAttribute("data-cu-copied");
    btn.removeAttribute("data-cu-copy-failed");
    if (label && btn._cuCopyLabel != null) label.textContent = btn._cuCopyLabel;
    btn._cuCopyLabel = null;
    var live = document.querySelector("[data-cu-copy-live]");
    if (live && live.textContent === message) live.textContent = "";
  }, result.duration);
}
