import { registry } from "../core/registry.js";

/**
 * Menubar — top-level application menu bar with sub-menus.
 *
 * HTML structure:
 * ```html
 * <div class="cu-menubar" data-cu-menubar>
 *   <div class="cu-menubar-menu" data-cu-menubar-menu>
 *     <button class="cu-menubar-trigger" data-cu-menubar-trigger>File</button>
 *     <div class="cu-menubar-content" data-cu-menubar-content hidden>
 *       <button class="cu-menubar-item">New</button>
 *       <div class="cu-menubar-separator"></div>
 *       <button class="cu-menubar-item">
 *         Save <span class="cu-menubar-shortcut">⌘S</span>
 *       </button>
 *     </div>
 *   </div>
 *   <!-- More data-cu-menubar-menu elements... -->
 * </div>
 * ```
 * - Add `hidden` to each content element initially.
 * - Hovering another trigger while one menu is open auto-switches.
 * - Closes on outside click or Escape key.
 */
export function setupMenubars() {
  document.querySelectorAll("[data-cu-menubar]").forEach(function (bar) {
    if (bar._cuInit) return;
    bar._cuInit = true;

    var menus = bar.querySelectorAll("[data-cu-menubar-menu]");
    menus.forEach(function (menu) {
      var trigger = menu.querySelector("[data-cu-menubar-trigger]");
      var content = menu.querySelector("[data-cu-menubar-content]");

      if (trigger) {
        trigger.addEventListener("click", function () {
          var open = content && !content.hasAttribute("hidden");
          // Close all menus in this bar
          menus.forEach(function (m) {
            var mc = m.querySelector("[data-cu-menubar-content]");
            var mt = m.querySelector("[data-cu-menubar-trigger]");
            if (mc) mc.setAttribute("hidden", "");
            if (mt) mt.setAttribute("aria-expanded", "false");
          });
          if (!open && content) {
            content.removeAttribute("hidden");
            trigger.setAttribute("aria-expanded", "true");
          }
        });

        // Hover to switch while one is open
        trigger.addEventListener("mouseenter", function () {
          var anyOpen = bar.querySelector(
            "[data-cu-menubar-content]:not([hidden])"
          );
          if (anyOpen && anyOpen !== content) {
            menus.forEach(function (m) {
              var mc = m.querySelector("[data-cu-menubar-content]");
              var mt = m.querySelector("[data-cu-menubar-trigger]");
              if (mc) mc.setAttribute("hidden", "");
              if (mt) mt.setAttribute("aria-expanded", "false");
            });
            if (content) {
              content.removeAttribute("hidden");
              trigger.setAttribute("aria-expanded", "true");
            }
          }
        });
      }
    });

    registry.menubars.push({ el: bar, menus: menus });
  });
}
