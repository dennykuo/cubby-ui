import { registry } from "../core/registry.js";
import {
  DEFAULT_COPY_ERROR,
  DEFAULT_COPY_SUCCESS,
  getLiveRegion,
  parseCopyDuration,
  showCopyResult,
  writeClipboard,
} from "../core/clipboard.js";

// ── Copy Button ───────────────────────────────────────────────
var COPY_SELECTOR = "[data-cu-copy], [data-cu-copy-target]";

/**
 * 一鍵複製：以 document 級 delegated click 處理所有複製按鈕（動態新增的按鈕不需重新 init）。
 *
 * 文字來源（擇一）：
 *   - `data-cu-copy="text"`              直接複製屬性值
 *   - `data-cu-copy-target="#selector"`  複製目標元素內容（input / textarea / select 取 value，其餘取 textContent 並去除首尾空白）
 *
 * 選用屬性：
 *   - `data-cu-copy-label`         按鈕內的文字元素，成功 / 失敗時暫時替換文字
 *   - `data-cu-copy-success-text`  成功訊息（預設 "Copied!"），同時作為 aria-live 播報內容
 *   - `data-cu-copy-error-text`    失敗訊息（預設 "Copy failed"）
 *   - `data-cu-copy-duration`      狀態還原時間（毫秒，預設 2000）
 *   - `data-cu-copy-live`          自備的 aria-live 區域；未提供時自動建立一個視覺隱藏的共用區域
 *
 * 狀態屬性（由 runtime 設定 / 移除，作為 CSS hook）：
 *   - `data-cu-copied`       複製成功
 *   - `data-cu-copy-failed`  複製失敗（Clipboard API 不可用或被拒，且 execCommand 後備方案也失敗）
 *
 * 事件：成功時於按鈕觸發 `cu:copy-button:copy`（detail: { text }），失敗時觸發 `cu:copy-button:error`（detail: { error }）。
 *
 * @example
 * <button type="button" class="cu-copy-button" data-cu-copy="sk_live_123" aria-label="Copy API key">
 *   <svg class="cu-copy-button-icon">…</svg>
 *   <svg class="cu-copy-button-check">…</svg>
 * </button>
 *
 * <code id="install">npm install cubby-ui</code>
 * <button type="button" class="cu-copy-button cu-copy-button-outline" data-cu-copy-target="#install">
 *   <svg class="cu-copy-button-icon">…</svg>
 *   <svg class="cu-copy-button-check">…</svg>
 *   <span data-cu-copy-label>Copy</span>
 * </button>
 */
export function setupCopyButtons() {
  if (!registry.copyClickHandler) {
    registry.copyClickHandler = function (e) {
      var btn = e.target && e.target.closest ? e.target.closest(COPY_SELECTOR) : null;
      if (!btn || btn.disabled || btn.getAttribute("aria-disabled") === "true") return;
      copyFromButton(btn);
    };
    document.addEventListener("click", registry.copyClickHandler);
  }

  // 頁面上已有複製按鈕時預先建立 live region，確保第一次播報能被螢幕閱讀器讀出
  if (document.querySelector(COPY_SELECTOR)) getLiveRegion();
}

function resolveText(btn) {
  var selector = btn.getAttribute("data-cu-copy-target");
  if (selector) {
    var target;
    try {
      target = document.querySelector(selector);
    } catch (_err) {
      target = null;
    }
    if (!target) return null;
    if ("value" in target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return target.value;
    return (target.textContent || "").trim();
  }
  return btn.getAttribute("data-cu-copy");
}

function copyFromButton(btn) {
  var text = resolveText(btn);
  if (text == null || text === "") {
    setState(btn, false, new Error("Nothing to copy"));
    return;
  }
  writeClipboard(text).then(
    function () {
      setState(btn, true, null, text);
    },
    function (err) {
      setState(btn, false, err);
    },
  );
}

function setState(btn, ok, err, text) {
  showCopyResult(btn, {
    ok: ok,
    message: ok
      ? btn.getAttribute("data-cu-copy-success-text") || DEFAULT_COPY_SUCCESS
      : btn.getAttribute("data-cu-copy-error-text") || DEFAULT_COPY_ERROR,
    label: btn.querySelector("[data-cu-copy-label]"),
    duration: parseCopyDuration(btn.getAttribute("data-cu-copy-duration")),
    event: ok ? "cu:copy-button:copy" : "cu:copy-button:error",
    detail: ok ? { text: text } : { error: err },
  });
}
