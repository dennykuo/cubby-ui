import { registry } from "../core/registry.js";

/**
 * Generic overlay initializer — shared logic for Dialog, Drawer, Alert Dialog.
 *
 * @param {Object} config
 * @param {string} config.triggerAttr     - data attribute on trigger element (value = dialog id)
 * @param {string} config.dialogAttr      - data attribute on <dialog> element
 * @param {string[]} config.closeAttrs    - data attributes that close the dialog when clicked
 * @param {boolean} config.closeOnBackdrop - whether clicking outside closes the dialog
 * @param {string} [config.titleClass]    - class of title element for aria-labelledby
 * @param {string} [config.descClass]     - class of description element for aria-describedby
 * @param {string} [config.role]          - ARIA role override (e.g. "alertdialog")
 *
 * Uses native <dialog> element with showModal() for proper focus trap and backdrop.
 * Focus is restored to the trigger element when dialog closes.
 */
// --- Mobile Nav helpers ---
export function closeMobileNav(mn) {
  mn.panel.removeAttribute("data-cu-mobile-nav-open");
  mn.backdrop.removeAttribute("data-cu-mobile-nav-open");
  mn.trigger.setAttribute("aria-expanded", "false");
  // Only restore scroll if we locked it (skip for absolute-positioned demo panels)
  if (getComputedStyle(mn.panel).position !== "absolute") {
    document.body.style.overflow = "";
  }
  mn.trigger.focus();
}

/**
 * Mobile Navigation — slide-in panel for mobile header navigation.
 *
 * HTML structure:
 * ```html
 * <header class="cu-header">
 *   <div class="cu-header-inner">
 *     <button data-cu-mobile-nav-trigger="main-nav" aria-label="Open menu" aria-expanded="false">☰</button>
 *     <div class="cu-header-brand">Brand</div>
 *     <div class="cu-header-nav">
 *       <nav class="cu-nav">
 *         <a class="cu-nav-item" href="#">Home</a>
 *       </nav>
 *     </div>
 *   </div>
 * </header>
 * <div id="main-nav" class="cu-header-mobile-backdrop" data-cu-mobile-nav></div>
 * <nav id="main-nav-panel" class="cu-header-mobile-nav"
 *      data-cu-mobile-nav-panel="main-nav" data-cu-mobile-nav-clone
 *      role="dialog" aria-modal="true" aria-label="Navigation menu">
 *   <div class="cu-header-mobile-header">
 *     <span>Brand</span>
 *     <button data-cu-mobile-nav-close class="cu-header-mobile-close" aria-label="Close menu">✕</button>
 *   </div>
 *   <div class="cu-header-mobile-content"></div>
 * </nav>
 * ```
 * Add `data-cu-mobile-nav-clone` to auto-clone desktop nav into the panel.
 */
export function setupMobileNav() {
  document.querySelectorAll("[data-cu-mobile-nav-trigger]").forEach(function (trigger) {
    if (trigger._cuInit) return;
    trigger._cuInit = true;

    var backdropId = trigger.getAttribute("data-cu-mobile-nav-trigger");
    var backdrop = document.getElementById(backdropId);
    var panel = document.querySelector("[data-cu-mobile-nav-panel='" + backdropId + "']");
    if (!backdrop || !panel) return;

    // Auto-clone desktop nav if panel has data-cu-mobile-nav-clone
    if (panel.hasAttribute("data-cu-mobile-nav-clone")) {
      var content = panel.querySelector(".cu-header-mobile-content");
      if (content && content.children.length === 0) {
        var header = trigger.closest(".cu-header");
        if (header) {
          var desktopNav = header.querySelector(".cu-header-nav");
          if (desktopNav) {
            var clone = desktopNav.cloneNode(true);
            // Convert to vertical mobile nav
            clone.classList.remove("cu-header-nav");
            clone.classList.remove("hidden");
            clone.removeAttribute("class");
            var navEl = clone.querySelector(".cu-nav");
            if (navEl) {
              navEl.classList.add("cu-nav-vertical");
              content.appendChild(navEl);
            } else {
              // The clone itself might be the nav wrapper
              var items = clone.querySelectorAll(".cu-nav-item");
              if (items.length > 0) {
                var newNav = document.createElement("nav");
                newNav.className = "cu-nav cu-nav-vertical";
                items.forEach(function (item) {
                  newNav.appendChild(item.cloneNode(true));
                });
                content.appendChild(newNav);
              }
            }
          }
        }
      }
    }

    var closeBtn = panel.querySelector("[data-cu-mobile-nav-close]");

    var mn = { trigger: trigger, backdrop: backdrop, panel: panel, el: trigger };
    registry.mobileNavs.push(mn);

    trigger.addEventListener("click", function () {
      // Drop the FOUC-guard `hidden` attribute (UA-hidden until CSS loads) so
      // the panel re-enters the a11y tree; the closed state is governed by the
      // CSS display:none from here on.
      panel.removeAttribute("hidden");
      backdrop.removeAttribute("hidden");
      panel.setAttribute("data-cu-mobile-nav-open", "");
      backdrop.setAttribute("data-cu-mobile-nav-open", "");
      trigger.setAttribute("aria-expanded", "true");
      // Skip scroll lock when panel is absolutely positioned (e.g. inside a demo preview)
      if (getComputedStyle(panel).position !== "absolute") {
        document.body.style.overflow = "hidden";
      }
      if (closeBtn) closeBtn.focus({ preventScroll: true });
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        closeMobileNav(mn);
      });
    }

    backdrop.addEventListener("click", function () {
      closeMobileNav(mn);
    });
  });
}
