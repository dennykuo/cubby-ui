import { registry } from "./registry.js";
import { closeMobileNav } from "../components/mobile-nav.js";
import { navigateItems } from "./utils.js";

export function setupDocumentListeners() {
  if (registry.docListenersReady) return;
  registry.docListenersReady = true;

  registry.docClickHandler = function (e) {
    registry.dropdowns.forEach(function (d) {
      if (!d.el.contains(e.target) && d.content) {
        d.content.setAttribute("hidden", "");
        if (d.trigger) d.trigger.setAttribute("aria-expanded", "false");
      }
    });
    registry.comboboxes.forEach(function (c) {
      if (!c.el.contains(e.target)) {
        if (c.content) c.content.setAttribute("hidden", "");
        if (c.trigger) c.trigger.setAttribute("aria-expanded", "false");
        if (c.input) {
          c.input.value = "";
          c.input.dispatchEvent(new Event("input"));
        }
      }
    });
    registry.multiSelects.forEach(function (ms) {
      if (!ms.el.contains(e.target)) {
        if (ms.content) ms.content.setAttribute("hidden", "");
        if (ms.trigger) ms.trigger.setAttribute("aria-expanded", "false");
        if (ms.input) {
          ms.input.value = "";
          ms.input.dispatchEvent(new Event("input"));
        }
      }
    });
    registry.popovers.forEach(function (p) {
      if (!p.el.contains(e.target)) {
        p.content.setAttribute("hidden", "");
        if (p.trigger) p.trigger.setAttribute("aria-expanded", "false");
      }
    });
    registry.menubars.forEach(function (b) {
      if (!b.el.contains(e.target)) {
        b.menus.forEach(function (m) {
          var mc = m.querySelector("[data-cu-menubar-content]");
          var mt = m.querySelector("[data-cu-menubar-trigger]");
          if (mc) mc.setAttribute("hidden", "");
          if (mt) mt.setAttribute("aria-expanded", "false");
        });
      }
    });
    registry.speedDials.forEach(function (sd) {
      if (!sd.el.contains(e.target) && sd.actions && sd.actions.hasAttribute("data-cu-open")) {
        sd.actions.removeAttribute("data-cu-open");
        if (sd.trigger) sd.trigger.setAttribute("aria-expanded", "false");
      }
    });
    registry.datePickers.forEach(function (dp) {
      if (dp.content && !dp.el.contains(e.target)) dp.content.style.display = "none";
    });
    registry.contextMenus.forEach(function (cm) {
      if (cm.content) cm.content.setAttribute("hidden", "");
    });
  };

  registry.docKeydownHandler = function (e) {
    // --- Escape: close all floating panels ---
    if (e.key === "Escape") {
      registry.dropdowns.forEach(function (d) {
        if (d.content && !d.content.hasAttribute("hidden")) {
          d.content.setAttribute("hidden", "");
          if (d.trigger) d.trigger.setAttribute("aria-expanded", "false");
        }
      });
      registry.comboboxes.forEach(function (c) {
        if (c.content && !c.content.hasAttribute("hidden")) {
          c.content.setAttribute("hidden", "");
          if (c.trigger) c.trigger.setAttribute("aria-expanded", "false");
          if (c.input) {
            c.input.value = "";
            c.input.dispatchEvent(new Event("input"));
          }
        }
      });
      registry.multiSelects.forEach(function (ms) {
        if (ms.content && !ms.content.hasAttribute("hidden")) {
          ms.content.setAttribute("hidden", "");
          if (ms.trigger) ms.trigger.setAttribute("aria-expanded", "false");
          if (ms.input) {
            ms.input.value = "";
            ms.input.dispatchEvent(new Event("input"));
          }
        }
      });
      registry.popovers.forEach(function (p) {
        if (!p.content.hasAttribute("hidden")) {
          p.content.setAttribute("hidden", "");
          if (p.trigger) p.trigger.setAttribute("aria-expanded", "false");
        }
      });
      registry.mobileNavs.forEach(function (mn) {
        if (mn.panel.hasAttribute("data-cu-mobile-nav-open")) {
          closeMobileNav(mn);
        }
      });
      registry.speedDials.forEach(function (sd) {
        if (sd.actions && sd.actions.hasAttribute("data-cu-open")) {
          sd.actions.removeAttribute("data-cu-open");
          if (sd.trigger) sd.trigger.setAttribute("aria-expanded", "false");
        }
      });
      registry.contextMenus.forEach(function (cm) {
        if (cm.content) cm.content.setAttribute("hidden", "");
      });
      registry.datePickers.forEach(function (dp) {
        if (dp.content) dp.content.style.display = "none";
      });
      return;
    }

    // --- Arrow / Home / End / Enter: navigate items in open floating panels ---
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Home" || e.key === "End" || e.key === "Enter") {
      // Dropdown
      registry.dropdowns.forEach(function (d) {
        if (!d.content || d.content.hasAttribute("hidden")) return;
        var items = d.content.querySelectorAll(".cu-dropdown-item:not([hidden])");
        if (items.length === 0) return;
        if (e.key === "Enter") {
          var active = d.content.querySelector(".cu-dropdown-item-highlight");
          if (active) { active.click(); e.preventDefault(); }
          return;
        }
        e.preventDefault();
        navigateItems(items, e.key, "cu-dropdown-item-highlight");
      });

      // Combobox
      registry.comboboxes.forEach(function (c) {
        if (!c.content || c.content.hasAttribute("hidden")) return;
        var items = c.getItems();
        if (!items || items.length === 0) return;
        if (e.key === "Enter") {
          var active = c.content.querySelector(".cu-combobox-item-highlight");
          if (active) { active.click(); e.preventDefault(); }
          return;
        }
        e.preventDefault();
        navigateItems(items, e.key, "cu-combobox-item-highlight");
      });

      // Multi Select
      registry.multiSelects.forEach(function (ms) {
        if (!ms.content || ms.content.hasAttribute("hidden")) return;
        var items = ms.getItems();
        if (!items || items.length === 0) return;
        if (e.key === "Enter") {
          var active = ms.content.querySelector(".cu-multi-select-item-highlight");
          if (active) { active.click(); e.preventDefault(); }
          return;
        }
        e.preventDefault();
        navigateItems(items, e.key, "cu-multi-select-item-highlight");
      });
    }
  };

  registry.docContextmenuHandler = function (e) {
    registry.contextMenus.forEach(function (cm) {
      if (cm.content && !cm.el.contains(e.target)) cm.content.setAttribute("hidden", "");
    });
  };
  registry.docScrollHandler = function () {
    registry.contextMenus.forEach(function (cm) {
      if (cm.content) cm.content.setAttribute("hidden", "");
    });
  };

  document.addEventListener("click", registry.docClickHandler);
  document.addEventListener("keydown", registry.docKeydownHandler);
  document.addEventListener("contextmenu", registry.docContextmenuHandler);
  document.addEventListener("scroll", registry.docScrollHandler);
}
