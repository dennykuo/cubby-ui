import { registry } from "../core/registry.js";

// Tag Input
/**
 * Tag Input — add/remove tags with keyboard.
 *
 * HTML structure:
 *   <div class="cu-tag-input" data-cu-tag-input>
 *     <span class="cu-tag-input-tag">Tag <button class="cu-tag-input-tag-remove">&times;</button></span>
 *     <input class="cu-tag-input-field" data-cu-tag-input-field placeholder="Add tag..." />
 *   </div>
 */
export function setupTagInputs() {
  document.querySelectorAll("[data-cu-tag-input]").forEach(function (el) {
    if (el._cuInit) return;
    el._cuInit = true;
    var field = el.querySelector("[data-cu-tag-input-field]");
    if (!field) return;

    var maxTags = parseInt(el.getAttribute("data-cu-tag-max") || "0", 10) || Infinity;

    function createTag(text) {
      var tag = document.createElement("span");
      tag.className = "cu-tag-input-tag";
      tag.setAttribute("data-cu-tag-value", text);
      tag.textContent = text;

      var removeBtn = document.createElement("button");
      removeBtn.className = "cu-tag-input-tag-remove";
      removeBtn.setAttribute("type", "button");
      removeBtn.setAttribute("aria-label", "Remove " + text);
      var svgNs = "http://www.w3.org/2000/svg";
      var svg = document.createElementNS(svgNs, "svg");
      svg.setAttribute("width", "10");
      svg.setAttribute("height", "10");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("fill", "none");
      svg.setAttribute("stroke", "currentColor");
      svg.setAttribute("stroke-width", "2.5");
      svg.setAttribute("stroke-linecap", "round");
      svg.setAttribute("stroke-linejoin", "round");
      var line1 = document.createElementNS(svgNs, "line");
      line1.setAttribute("x1", "18"); line1.setAttribute("y1", "6");
      line1.setAttribute("x2", "6"); line1.setAttribute("y2", "18");
      var line2 = document.createElementNS(svgNs, "line");
      line2.setAttribute("x1", "6"); line2.setAttribute("y1", "6");
      line2.setAttribute("x2", "18"); line2.setAttribute("y2", "18");
      svg.appendChild(line1);
      svg.appendChild(line2);
      removeBtn.appendChild(svg);
      removeBtn.addEventListener("click", function () {
        tag.remove();
        dispatchChange();
      });
      tag.appendChild(removeBtn);
      return tag;
    }

    function getTags() {
      return Array.from(el.querySelectorAll(".cu-tag-input-tag")).map(function (t) { return t.getAttribute("data-cu-tag-value"); });
    }

    function dispatchChange() {
      el.dispatchEvent(new CustomEvent("cu:tag-input:change", { detail: { tags: getTags() }, bubbles: true }));
    }

    function addTag(text) {
      text = text.trim();
      if (!text) return;
      var tags = getTags();
      if (tags.length >= maxTags) return;
      if (tags.indexOf(text) !== -1) return; // no duplicates
      el.insertBefore(createTag(text), field);
      field.value = "";
      dispatchChange();
    }

    field.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        addTag(field.value);
      } else if (e.key === "Backspace" && !field.value) {
        var lastTag = el.querySelector(".cu-tag-input-tag:last-of-type");
        if (lastTag) {
          lastTag.remove();
          dispatchChange();
        }
      }
    });

    // Wire up existing remove buttons
    el.querySelectorAll(".cu-tag-input-tag-remove").forEach(function (btn) {
      btn.addEventListener("click", function () {
        btn.closest(".cu-tag-input-tag").remove();
        dispatchChange();
      });
    });

    // Add data-cu-tag-value to existing tags if missing
    el.querySelectorAll(".cu-tag-input-tag").forEach(function (tag) {
      if (!tag.hasAttribute("data-cu-tag-value")) {
        var removeBtn = tag.querySelector(".cu-tag-input-tag-remove");
        var text = removeBtn ? tag.textContent.replace(removeBtn.textContent, "").trim() : tag.textContent.trim();
        tag.setAttribute("data-cu-tag-value", text);
      }
    });

    registry.tagInputs.push({ el: el });
  });
}
