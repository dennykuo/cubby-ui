import {
  DEFAULT_COPY_DURATION,
  DEFAULT_COPY_ERROR,
  DEFAULT_COPY_SUCCESS,
  getLiveRegion,
  showCopyResult,
  writeClipboard,
} from "../core/clipboard.js";

// ── Code Block ────────────────────────────────────────────────
/**
 * Code Block 複製按鈕：複製 `.cu-code-block-pre` 的 textContent（保留換行與空白）。
 * 寫入方式、狀態屬性與 aria-live 播報與 Copy Button 共用（core/clipboard.js）。
 *
 * 選用屬性（加在 `[data-cu-code-block]` 根元素）：
 *   - `data-cu-code-block-success-text`  成功訊息（預設 "Copied!"），同時作為 aria-live 播報內容
 *   - `data-cu-code-block-error-text`    失敗訊息（預設 "Copy failed"）
 *
 * 狀態屬性（設在 `[data-cu-code-block-copy]` 按鈕上，2000ms 後移除）：
 *   - `data-cu-copied`       複製成功
 *   - `data-cu-copy-failed`  複製失敗（Clipboard API 不可用或被拒，且 execCommand 後備方案也失敗）
 *
 * `[data-cu-code-block-label]` 的文字會暫時替換為訊息，之後還原為原本的文字。
 * 事件：成功時於按鈕觸發 `cu:code-block:copy`（detail: { text }），失敗時觸發 `cu:code-block:error`（detail: { error }），皆可冒泡。
 *
 * @example
 * <div class="cu-code-block" data-cu-code-block data-cu-code-block-success-text="已複製">
 *   <button type="button" class="cu-code-block-copy" data-cu-code-block-copy>
 *     <svg aria-hidden="true">…</svg>
 *     <span data-cu-code-block-label>複製</span>
 *   </button>
 *   <pre class="cu-code-block-pre"><code>npm install cubby-ui</code></pre>
 * </div>
 */
export function setupCodeBlocks() {
  document.querySelectorAll("[data-cu-code-block]").forEach(function (block) {
    if (block._cuInit) return;
    block._cuInit = true;

    var btn = /** @type {HTMLElement} */ (block.querySelector("[data-cu-code-block-copy]"));
    if (!btn) return;

    // 預先建立共用 live region，確保第一次播報能被螢幕閱讀器讀出
    getLiveRegion();

    btn.addEventListener("click", function () {
      var pre = block.querySelector(".cu-code-block-pre");
      if (!pre) return;

      var text = pre.textContent || "";
      writeClipboard(text).then(
        function () {
          setCopyState(block, btn, true, null, text);
        },
        function (err) {
          setCopyState(block, btn, false, err);
        },
      );
    });
  });
}

function setCopyState(block, btn, ok, err, text) {
  showCopyResult(btn, {
    ok: ok,
    message: ok
      ? block.getAttribute("data-cu-code-block-success-text") || DEFAULT_COPY_SUCCESS
      : block.getAttribute("data-cu-code-block-error-text") || DEFAULT_COPY_ERROR,
    label: btn.querySelector("[data-cu-code-block-label]"),
    duration: DEFAULT_COPY_DURATION,
    event: ok ? "cu:code-block:copy" : "cu:code-block:error",
    detail: ok ? { text: text } : { error: err },
  });
}
