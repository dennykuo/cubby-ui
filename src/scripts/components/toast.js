export function dismissToast(toast) {
  if (toast._cuDismissing) return;
  toast._cuDismissing = true;
  toast.classList.remove("cu-toast-enter");
  toast.classList.add("cu-toast-exit");
  toast.addEventListener(
    "animationend",
    function () {
      toast.remove();
    },
    { once: true },
  );
}

export function ensureToastContainer() {
  var container = document.querySelector("[data-cu-toast-container]");
  if (!container) {
    container = document.createElement("div");
    container.className = "cu-toast-container cu-toast-container-bottom-right";
    container.setAttribute("data-cu-toast-container", "");
    document.body.appendChild(container);
  }
  // 作者自行提供的容器也補上 landmark 語意（不覆寫既有值）
  if (!container.getAttribute("role")) container.setAttribute("role", "region");
  if (!container.getAttribute("aria-label")) container.setAttribute("aria-label", "Notifications");
  return container;
}

export function createToastEl(opts, closeText) {
  var title = opts.title || "";
  var desc = opts.description || "";
  var variant = opts.variant || "default";

  var toast = document.createElement("div");
  toast.className = "cu-toast cu-toast-" + variant + " cu-toast-enter";
  if (variant === "destructive") {
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");
  } else {
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
  }

  var body = document.createElement("div");
  body.className = "cu-toast-body";
  var titleEl = document.createElement("div");
  titleEl.className = "cu-toast-title";
  titleEl.textContent = title;
  body.appendChild(titleEl);
  if (desc) {
    var descEl = document.createElement("div");
    descEl.className = "cu-toast-description";
    descEl.textContent = desc;
    body.appendChild(descEl);
  }
  var actionBtn = null;
  if (opts.action && opts.action.label) {
    var actionWrap = document.createElement("div");
    actionWrap.className = "cu-toast-action";
    actionBtn = document.createElement("button");
    actionBtn.type = "button";
    actionBtn.className = "cu-toast-action-btn";
    actionBtn.textContent = opts.action.label;
    actionWrap.appendChild(actionBtn);
    body.appendChild(actionWrap);
  }
  toast.appendChild(body);

  var svgNS = "http://www.w3.org/2000/svg";
  var closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "cu-toast-close";
  closeBtn.setAttribute("data-cu-toast-close", "");
  closeBtn.setAttribute("aria-label", closeText || "Close");
  var svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("width", "14");
  svg.setAttribute("height", "14");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  var p1 = document.createElementNS(svgNS, "path");
  p1.setAttribute("d", "M18 6 6 18");
  var p2 = document.createElementNS(svgNS, "path");
  p2.setAttribute("d", "m6 6 12 12");
  svg.appendChild(p1);
  svg.appendChild(p2);
  closeBtn.appendChild(svg);
  toast.appendChild(closeBtn);

  return { toast: toast, body: body, titleEl: titleEl, closeBtn: closeBtn, actionBtn: actionBtn };
}

/**
 * Programmatic toast API
 *
 * CubbyUI.toast.show({ title, description?, variant?, duration?, action? })
 * action: { label, onClick?(event, toast) } — renders a .cu-toast-action-btn;
 * clicking it calls onClick then dismisses the toast unless onClick calls
 * event.preventDefault().
 */
export var toastAPI = {
  show: function (opts) {
    var c = ensureToastContainer();
    var result = createToastEl(opts, c.getAttribute("data-cu-toast-close-text"));
    c.appendChild(result.toast);

    var maxToasts = parseInt(c.getAttribute("data-cu-toast-max"), 10) || 5;
    var existing = c.querySelectorAll(".cu-toast:not(.cu-toast-exit)");
    if (existing.length > maxToasts) {
      for (var ti = 0; ti < existing.length - maxToasts; ti++) {
        dismissToast(existing[ti]);
      }
    }

    var duration = opts.duration !== undefined ? opts.duration : 5000;
    var timer;
    if (duration > 0) {
      timer = setTimeout(function () {
        dismissToast(result.toast);
      }, duration);
    }
    result.closeBtn.addEventListener("click", function () {
      if (timer) clearTimeout(timer);
      dismissToast(result.toast);
    });
    // action 點擊後預設關閉 toast；onClick 內呼叫 event.preventDefault() 可保留
    if (result.actionBtn) {
      result.actionBtn.addEventListener("click", function (e) {
        if (typeof opts.action.onClick === "function") opts.action.onClick(e, result.toast);
        if (e.defaultPrevented) return;
        if (timer) clearTimeout(timer);
        dismissToast(result.toast);
      });
    }

    return result.toast;
  },
  promise: function (promise, opts) {
    var loadingOpts = typeof opts.loading === "string" ? { title: opts.loading } : opts.loading;
    loadingOpts.duration = 0;
    loadingOpts.variant = loadingOpts.variant || "default";
    var el = toastAPI.show(loadingOpts);

    return promise
      .then(function (result) {
        var successOpts = typeof opts.success === "function" ? opts.success(result) : opts.success;
        successOpts = typeof successOpts === "string" ? { title: successOpts } : successOpts;
        var variant = successOpts.variant || "success";
        // Update existing toast
        el.className = "cu-toast cu-toast-" + variant + " cu-toast-enter";
        var titleEl = el.querySelector(".cu-toast-title");
        if (titleEl) titleEl.textContent = successOpts.title || "";
        var descEl = el.querySelector(".cu-toast-description");
        if (successOpts.description) {
          if (!descEl) {
            descEl = document.createElement("div");
            descEl.className = "cu-toast-description";
            el.querySelector(".cu-toast-body").appendChild(descEl);
          }
          descEl.textContent = successOpts.description;
        } else if (descEl) {
          descEl.remove();
        }
        setTimeout(function () {
          dismissToast(el);
        }, successOpts.duration || 5000);
        return result;
      })
      .catch(function (err) {
        var errorOpts = typeof opts.error === "function" ? opts.error(err) : opts.error;
        errorOpts = typeof errorOpts === "string" ? { title: errorOpts } : errorOpts;
        var variant = errorOpts.variant || "destructive";
        el.className = "cu-toast cu-toast-" + variant + " cu-toast-enter";
        var titleEl = el.querySelector(".cu-toast-title");
        if (titleEl) titleEl.textContent = errorOpts.title || "";
        var descEl = el.querySelector(".cu-toast-description");
        if (errorOpts.description) {
          if (!descEl) {
            descEl = document.createElement("div");
            descEl.className = "cu-toast-description";
            el.querySelector(".cu-toast-body").appendChild(descEl);
          }
          descEl.textContent = errorOpts.description;
        } else if (descEl) {
          descEl.remove();
        }
        setTimeout(function () {
          dismissToast(el);
        }, errorOpts.duration || 5000);
        throw err;
      });
  },
};

/**
 * Toast — auto-dismissing notification triggered by button click.
 *
 * Trigger HTML:
 * ```html
 * <button
 *   data-cu-toast-trigger
 *   data-cu-toast-title="Title text"
 *   data-cu-toast-description="Optional description"
 *   data-cu-toast-variant="success"
 *   data-cu-toast-duration="4000">
 *   Click me
 * </button>
 * ```
 *
 * Variants: default | destructive | success | warning | info
 * Duration: milliseconds before auto-dismiss (default: 5000; 0 = stay until closed)
 *
 * Optional explicit container (auto-created at bottom-right if not present):
 * ```html
 * <div class="cu-toast-container cu-toast-container-bottom-right"
 *   data-cu-toast-container
 *   data-cu-toast-max="5">
 * </div>
 * ```
 * Container positions: bottom-right | bottom-left | top-right | top-left | top-center | bottom-center
 * Max stack: data-cu-toast-max (default 5) — oldest toast auto-dismissed when exceeded.
 * Close button name: data-cu-toast-close-text (default "Close"), e.g. data-cu-toast-close-text="關閉通知".
 *
 * Toast content is built with DOM API (no innerHTML) to prevent XSS.
 */
export function setupToasts() {
  ensureToastContainer();

  document.querySelectorAll("[data-cu-toast-trigger]").forEach(function (trigger) {
    if (trigger._cuInit) return;
    trigger._cuInit = true;

    trigger.addEventListener("click", function () {
      var title = trigger.getAttribute("data-cu-toast-title") || "";
      var desc = trigger.getAttribute("data-cu-toast-description") || "";
      var variant = trigger.getAttribute("data-cu-toast-variant") || "default";
      // 0 代表不自動消失，只有缺少或無法解析時才回退預設值（不可用 ||，會吃掉 0）
      var duration = parseInt(trigger.getAttribute("data-cu-toast-duration"), 10);
      if (isNaN(duration)) duration = 5000;
      toastAPI.show({ title: title, description: desc, variant: variant, duration: duration });
    });
  });
}
