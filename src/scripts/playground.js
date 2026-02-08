(function () {
  'use strict';

  var root = document.getElementById('cu-playground');
  if (!root) return;

  // ── i18n helpers ──────────────────────────────────────────────────
  function t(key) {
    return root.getAttribute('data-cu-pg-t-' + key) || key;
  }
  var catLabels = {
    basic: root.getAttribute('data-cu-pg-t-cat-basic') || 'Basic',
    typography: root.getAttribute('data-cu-pg-t-cat-typography') || 'Typography',
    forms: root.getAttribute('data-cu-pg-t-cat-forms') || 'Forms',
    feedback: root.getAttribute('data-cu-pg-t-cat-feedback') || 'Feedback',
    dataDisplay: root.getAttribute('data-cu-pg-t-cat-dataDisplay') || 'Data Display',
  };

  // ── Component registry ────────────────────────────────────────────
  var COMPONENTS = [
    // ── Basic ─────────
    {
      id: 'button', name: 'Button', category: 'basic',
      controls: [
        { type: 'select', prop: 'variant', label: 'Variant', defaultValue: 'default',
          options: ['default','secondary','outline','ghost','link','destructive','success','warning','info'] },
        { type: 'select', prop: 'size', label: 'Size', defaultValue: 'md',
          options: ['xs','sm','md','lg','xl'] },
        { type: 'text', prop: 'content', label: 'Text', defaultValue: 'Button' },
        { type: 'toggle', prop: 'disabled', label: 'Disabled', defaultValue: false },
      ],
      codeTemplate: function (p) {
        var cls = ['cu-button'];
        if (p.variant !== 'default') cls.push('cu-button-' + p.variant);
        if (p.size !== 'md') cls.push('cu-button-' + p.size);
        var attrs = p.disabled ? ' disabled' : '';
        return '<button class="' + cls.join(' ') + '"' + attrs + '>' + esc(p.content) + '</button>';
      }
    },
    {
      id: 'badge', name: 'Badge', category: 'basic',
      controls: [
        { type: 'select', prop: 'variant', label: 'Variant', defaultValue: 'default',
          options: ['default','secondary','outline','destructive','success','warning','info'] },
        { type: 'text', prop: 'content', label: 'Text', defaultValue: 'Badge' },
      ],
      codeTemplate: function (p) {
        var cls = ['cu-badge'];
        if (p.variant !== 'default') cls.push('cu-badge-' + p.variant);
        return '<span class="' + cls.join(' ') + '">' + esc(p.content) + '</span>';
      }
    },
    {
      id: 'card', name: 'Card', category: 'basic',
      controls: [
        { type: 'toggle', prop: 'hover', label: 'Hover shadow', defaultValue: false },
        { type: 'text', prop: 'title', label: 'Title', defaultValue: 'Card Title' },
        { type: 'text', prop: 'description', label: 'Description', defaultValue: 'Card description goes here.' },
        { type: 'text', prop: 'content', label: 'Content', defaultValue: 'Card content area.' },
      ],
      codeTemplate: function (p) {
        var cls = ['cu-card'];
        if (p.hover) cls.push('cu-card-hover');
        return '<div class="' + cls.join(' ') + ' w-[350px]">\n' +
          '  <div class="cu-card-header">\n' +
          '    <h3 class="cu-card-title">' + esc(p.title) + '</h3>\n' +
          '    <p class="cu-card-description">' + esc(p.description) + '</p>\n' +
          '  </div>\n' +
          '  <div class="cu-card-content">\n' +
          '    <p>' + esc(p.content) + '</p>\n' +
          '  </div>\n' +
          '</div>';
      }
    },
    {
      id: 'separator', name: 'Separator', category: 'basic',
      controls: [
        { type: 'select', prop: 'orientation', label: 'Orientation', defaultValue: 'horizontal',
          options: ['horizontal','vertical'] },
      ],
      codeTemplate: function (p) {
        if (p.orientation === 'vertical') {
          return '<div class="flex h-8 items-center">\n  <div class="cu-separator cu-separator-vertical"></div>\n</div>';
        }
        return '<div class="cu-separator cu-separator-horizontal"></div>';
      }
    },
    // ── Typography ────
    {
      id: 'headings', name: 'Headings', category: 'typography',
      controls: [
        { type: 'select', prop: 'level', label: 'Level', defaultValue: '1',
          options: ['1','2','3','4'] },
        { type: 'text', prop: 'content', label: 'Text', defaultValue: 'The quick brown fox' },
      ],
      codeTemplate: function (p) {
        var tag = 'h' + p.level;
        return '<' + tag + ' class="cu-h' + p.level + '">' + esc(p.content) + '</' + tag + '>';
      }
    },
    // ── Forms ─────────
    {
      id: 'input', name: 'Input', category: 'forms',
      controls: [
        { type: 'select', prop: 'type', label: 'Type', defaultValue: 'text',
          options: ['text','email','password','number','url','tel'] },
        { type: 'text', prop: 'placeholder', label: 'Placeholder', defaultValue: 'Enter text...' },
        { type: 'toggle', prop: 'disabled', label: 'Disabled', defaultValue: false },
      ],
      codeTemplate: function (p) {
        var attrs = ' type="' + p.type + '"';
        attrs += ' placeholder="' + esc(p.placeholder) + '"';
        if (p.disabled) attrs += ' disabled';
        return '<input class="cu-input max-w-sm"' + attrs + ' />';
      }
    },
    {
      id: 'textarea', name: 'Textarea', category: 'forms',
      controls: [
        { type: 'text', prop: 'placeholder', label: 'Placeholder', defaultValue: 'Type something...' },
        { type: 'toggle', prop: 'disabled', label: 'Disabled', defaultValue: false },
      ],
      codeTemplate: function (p) {
        var attrs = ' placeholder="' + esc(p.placeholder) + '"';
        if (p.disabled) attrs += ' disabled';
        return '<textarea class="cu-textarea max-w-sm"' + attrs + '></textarea>';
      }
    },
    {
      id: 'select', name: 'Select', category: 'forms',
      controls: [
        { type: 'toggle', prop: 'disabled', label: 'Disabled', defaultValue: false },
      ],
      codeTemplate: function (p) {
        var attrs = p.disabled ? ' disabled' : '';
        return '<div class="cu-select-wrapper max-w-sm">\n' +
          '  <select class="cu-select"' + attrs + '>\n' +
          '    <option>Option 1</option>\n' +
          '    <option>Option 2</option>\n' +
          '    <option>Option 3</option>\n' +
          '  </select>\n' +
          '  <svg class="cu-select-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>\n' +
          '</div>';
      }
    },
    {
      id: 'checkbox', name: 'Checkbox', category: 'forms',
      controls: [
        { type: 'text', prop: 'label', label: 'Label', defaultValue: 'Accept terms and conditions' },
        { type: 'toggle', prop: 'checked', label: 'Checked', defaultValue: false },
        { type: 'toggle', prop: 'disabled', label: 'Disabled', defaultValue: false },
      ],
      codeTemplate: function (p) {
        var attrs = '';
        if (p.checked) attrs += ' checked';
        if (p.disabled) attrs += ' disabled';
        return '<label class="cu-checkbox-wrapper">\n' +
          '  <input type="checkbox" class="cu-checkbox"' + attrs + ' />\n' +
          '  <span class="cu-label">' + esc(p.label) + '</span>\n' +
          '</label>';
      }
    },
    {
      id: 'radio', name: 'Radio', category: 'forms',
      controls: [
        { type: 'toggle', prop: 'disabled', label: 'Disabled', defaultValue: false },
      ],
      codeTemplate: function (p) {
        var attrs = p.disabled ? ' disabled' : '';
        return '<div class="cu-radio-group">\n' +
          '  <label class="cu-radio-wrapper">\n' +
          '    <input type="radio" name="pg-radio" class="cu-radio" checked' + attrs + ' />\n' +
          '    <span class="cu-label">Option A</span>\n' +
          '  </label>\n' +
          '  <label class="cu-radio-wrapper">\n' +
          '    <input type="radio" name="pg-radio" class="cu-radio"' + attrs + ' />\n' +
          '    <span class="cu-label">Option B</span>\n' +
          '  </label>\n' +
          '  <label class="cu-radio-wrapper">\n' +
          '    <input type="radio" name="pg-radio" class="cu-radio"' + attrs + ' />\n' +
          '    <span class="cu-label">Option C</span>\n' +
          '  </label>\n' +
          '</div>';
      }
    },
    {
      id: 'toggle', name: 'Toggle', category: 'forms',
      controls: [
        { type: 'select', prop: 'size', label: 'Size', defaultValue: 'default',
          options: ['sm','default','lg'] },
        { type: 'text', prop: 'label', label: 'Label', defaultValue: 'Airplane mode' },
        { type: 'toggle', prop: 'checked', label: 'Checked', defaultValue: false },
        { type: 'toggle', prop: 'disabled', label: 'Disabled', defaultValue: false },
      ],
      codeTemplate: function (p) {
        var inputAttrs = '';
        if (p.checked) inputAttrs += ' checked';
        if (p.disabled) inputAttrs += ' disabled';
        var sizeCls = p.size !== 'default' ? ' cu-toggle-' + p.size : '';
        return '<label class="cu-toggle-wrapper">\n' +
          '  <input type="checkbox" class="cu-toggle-input"' + inputAttrs + ' />\n' +
          '  <span class="cu-toggle' + sizeCls + '"><span class="cu-toggle-thumb"></span></span>\n' +
          '  <span class="cu-label">' + esc(p.label) + '</span>\n' +
          '</label>';
      }
    },
    {
      id: 'range', name: 'Range', category: 'forms',
      controls: [
        { type: 'range', prop: 'value', label: 'Value', defaultValue: 50, min: 0, max: 100, step: 1 },
        { type: 'toggle', prop: 'disabled', label: 'Disabled', defaultValue: false },
      ],
      codeTemplate: function (p) {
        var attrs = ' value="' + p.value + '"';
        if (p.disabled) attrs += ' disabled';
        return '<input type="range" class="cu-range max-w-sm"' + attrs + ' />';
      }
    },
    // ── Feedback ──────
    {
      id: 'alert', name: 'Alert', category: 'feedback',
      controls: [
        { type: 'select', prop: 'variant', label: 'Variant', defaultValue: 'default',
          options: ['default','destructive','success','warning','info'] },
        { type: 'text', prop: 'title', label: 'Title', defaultValue: 'Heads up!' },
        { type: 'text', prop: 'description', label: 'Description', defaultValue: 'You can add components to your app using the CLI.' },
      ],
      codeTemplate: function (p) {
        var cls = ['cu-alert'];
        if (p.variant !== 'default') cls.push('cu-alert-' + p.variant);
        else cls.push('cu-alert-default');
        return '<div class="' + cls.join(' ') + '">\n' +
          '  <h5 class="cu-alert-title">' + esc(p.title) + '</h5>\n' +
          '  <div class="cu-alert-description">' + esc(p.description) + '</div>\n' +
          '</div>';
      }
    },
    {
      id: 'progress', name: 'Progress', category: 'feedback',
      controls: [
        { type: 'range', prop: 'value', label: 'Value', defaultValue: 60, min: 0, max: 100, step: 1 },
      ],
      codeTemplate: function (p) {
        return '<div class="cu-progress max-w-sm">\n' +
          '  <div class="cu-progress-bar" style="width: ' + p.value + '%;"></div>\n' +
          '</div>';
      }
    },
    {
      id: 'skeleton', name: 'Skeleton', category: 'feedback',
      controls: [
        { type: 'select', prop: 'animation', label: 'Animation', defaultValue: 'pulse',
          options: ['pulse','shimmer'] },
      ],
      codeTemplate: function (p) {
        var cls = p.animation === 'shimmer' ? 'cu-skeleton-shimmer' : 'cu-skeleton';
        return '<div class="flex items-center gap-4">\n' +
          '  <div class="' + cls + ' h-12 w-12 rounded-full"></div>\n' +
          '  <div class="space-y-2">\n' +
          '    <div class="' + cls + ' h-4 w-[200px]"></div>\n' +
          '    <div class="' + cls + ' h-4 w-[160px]"></div>\n' +
          '  </div>\n' +
          '</div>';
      }
    },
    // ── Data Display ──
    {
      id: 'avatar', name: 'Avatar', category: 'dataDisplay',
      controls: [
        { type: 'select', prop: 'size', label: 'Size', defaultValue: 'md',
          options: ['sm','md','lg'] },
        { type: 'text', prop: 'fallback', label: 'Fallback', defaultValue: 'CN' },
      ],
      codeTemplate: function (p) {
        var cls = ['cu-avatar', 'cu-avatar-' + p.size];
        return '<div class="' + cls.join(' ') + '">\n' +
          '  <span class="cu-avatar-fallback">' + esc(p.fallback) + '</span>\n' +
          '</div>';
      }
    },
  ];

  // ── Utility ───────────────────────────────────────────────────────
  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'className') node.className = attrs[k];
        else if (k.indexOf('data-') === 0) node.setAttribute(k, attrs[k]);
        else node[k] = attrs[k];
      });
    }
    if (typeof children === 'string') node.textContent = children;
    else if (Array.isArray(children)) children.forEach(function (c) { if (c) node.appendChild(c); });
    else if (children) node.appendChild(children);
    return node;
  }

  // ── State ─────────────────────────────────────────────────────────
  var currentComponentId = COMPONENTS[0].id;
  var propValues = {};
  var isCodeManuallyEdited = false;
  var codeDebounceTimer = null;

  // ── DOM refs ──────────────────────────────────────────────────────
  var controlsDesktop = document.getElementById('cu-pg-controls-inner');
  var controlsMobile = document.getElementById('cu-pg-controls-inner-mobile');
  var previewEl = document.getElementById('cu-pg-preview');
  var codeEl = document.getElementById('cu-pg-code');
  var darkToggle = document.getElementById('cu-pg-dark-toggle');
  var copyBtn = document.getElementById('cu-pg-copy-code');
  var resetCodeBtn = document.getElementById('cu-pg-reset-code');
  var manualWarning = document.getElementById('cu-pg-manual-warning');
  var resetThemeBtn = document.getElementById('cu-pg-reset-theme');
  var themeColorsEl = document.getElementById('cu-pg-theme-colors');
  var radiusInput = document.getElementById('cu-pg-radius');
  var radiusValue = document.getElementById('cu-pg-radius-value');
  var tabs = root.querySelectorAll('.cu-pg-tab');
  var panelCode = document.getElementById('cu-pg-panel-code');
  var panelTheme = document.getElementById('cu-pg-panel-theme');

  // ── Helpers ───────────────────────────────────────────────────────
  function getComponent(id) {
    for (var i = 0; i < COMPONENTS.length; i++) {
      if (COMPONENTS[i].id === id) return COMPONENTS[i];
    }
    return null;
  }

  function getDefaultProps(comp) {
    var p = {};
    comp.controls.forEach(function (c) { p[c.prop] = c.defaultValue; });
    return p;
  }

  // ── Controls rendering ────────────────────────────────────────────
  function renderControls(container) {
    container.innerHTML = '';

    // Component selector
    var selectorSection = el('div', { className: 'mb-5' });
    selectorSection.appendChild(el('label', { className: 'cu-label block mb-1.5' }, t('component')));

    var selectWrapper = el('div', { className: 'cu-select-wrapper' });
    var select = el('select', { className: 'cu-select', id: container === controlsDesktop ? 'cu-pg-select' : 'cu-pg-select-mobile' });

    // Group by category
    var categories = ['basic','typography','forms','feedback','dataDisplay'];
    categories.forEach(function (cat) {
      var group = el('optgroup', { label: catLabels[cat] || cat });
      COMPONENTS.forEach(function (comp) {
        if (comp.category === cat) {
          var opt = el('option', { value: comp.id }, comp.name);
          if (comp.id === currentComponentId) opt.selected = true;
          group.appendChild(opt);
        }
      });
      select.appendChild(group);
    });

    select.addEventListener('change', function () {
      currentComponentId = this.value;
      isCodeManuallyEdited = false;
      propValues = getDefaultProps(getComponent(currentComponentId));
      syncAllControls();
      updatePreviewAndCode();
    });

    selectWrapper.appendChild(select);
    // chevron icon
    var icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('class', 'cu-select-icon');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('fill', 'none');
    icon.setAttribute('stroke', 'currentColor');
    icon.setAttribute('stroke-width', '2');
    icon.setAttribute('stroke-linecap', 'round');
    icon.setAttribute('stroke-linejoin', 'round');
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'm6 9 6 6 6-6');
    icon.appendChild(path);
    selectWrapper.appendChild(icon);
    selectorSection.appendChild(selectWrapper);
    container.appendChild(selectorSection);

    // Props section
    var comp = getComponent(currentComponentId);
    if (!comp || comp.controls.length === 0) return;

    var propsHeader = el('div', { className: 'flex items-center justify-between mb-3' });
    propsHeader.appendChild(el('span', { className: 'cu-label' }, t('props')));
    var resetBtn = el('button', { className: 'cu-button cu-button-ghost cu-button-xs' }, t('reset'));
    resetBtn.addEventListener('click', function () {
      propValues = getDefaultProps(comp);
      isCodeManuallyEdited = false;
      syncAllControls();
      updatePreviewAndCode();
    });
    propsHeader.appendChild(resetBtn);
    container.appendChild(propsHeader);

    var propsContainer = el('div', { className: 'space-y-3' });

    comp.controls.forEach(function (ctrl) {
      var wrapper = el('div');
      var label = el('label', { className: 'cu-label block mb-1' }, ctrl.label);
      wrapper.appendChild(label);

      if (ctrl.type === 'select') {
        var sw = el('div', { className: 'cu-select-wrapper' });
        var sel = el('select', { className: 'cu-select cu-pg-control', 'data-prop': ctrl.prop });
        ctrl.options.forEach(function (opt) {
          var o = el('option', { value: opt }, opt);
          if (propValues[ctrl.prop] === opt) o.selected = true;
          sel.appendChild(o);
        });
        sel.addEventListener('change', function () {
          propValues[ctrl.prop] = this.value;
          isCodeManuallyEdited = false;
          syncControlsInOtherContainer(container, ctrl.prop, this.value);
          updatePreviewAndCode();
        });
        sw.appendChild(sel);
        // chevron
        var si = icon.cloneNode(true);
        sw.appendChild(si);
        wrapper.appendChild(sw);
      } else if (ctrl.type === 'toggle') {
        var tw = el('label', { className: 'cu-toggle-wrapper mt-0.5' });
        var ti = el('input', { type: 'checkbox', className: 'cu-toggle-input cu-pg-control', 'data-prop': ctrl.prop });
        ti.checked = !!propValues[ctrl.prop];
        ti.addEventListener('change', function () {
          propValues[ctrl.prop] = this.checked;
          isCodeManuallyEdited = false;
          syncControlsInOtherContainer(container, ctrl.prop, this.checked);
          updatePreviewAndCode();
        });
        tw.appendChild(ti);
        var ts = el('span', { className: 'cu-toggle cu-toggle-sm' });
        ts.appendChild(el('span', { className: 'cu-toggle-thumb' }));
        tw.appendChild(ts);
        wrapper.replaceChild(tw, label);
        // Reconstruct: label text after toggle
        var wrapOuter = el('div', { className: 'flex items-center justify-between' });
        wrapOuter.appendChild(el('span', { className: 'cu-label' }, ctrl.label));
        wrapOuter.appendChild(tw);
        wrapper = wrapOuter;
      } else if (ctrl.type === 'text') {
        var inp = el('input', {
          type: 'text',
          className: 'cu-input cu-pg-control',
          value: propValues[ctrl.prop] || '',
          'data-prop': ctrl.prop,
        });
        inp.addEventListener('input', function () {
          propValues[ctrl.prop] = this.value;
          isCodeManuallyEdited = false;
          syncControlsInOtherContainer(container, ctrl.prop, this.value);
          updatePreviewAndCode();
        });
        wrapper.appendChild(inp);
      } else if (ctrl.type === 'range') {
        var rd = el('div', { className: 'flex items-center gap-2' });
        var ri = el('input', {
          type: 'range',
          className: 'cu-range flex-1 cu-pg-control',
          'data-prop': ctrl.prop,
          min: ctrl.min != null ? ctrl.min : 0,
          max: ctrl.max != null ? ctrl.max : 100,
          step: ctrl.step != null ? ctrl.step : 1,
        });
        ri.value = propValues[ctrl.prop];
        var rv = el('span', { className: 'text-xs text-muted-foreground w-8 text-right font-mono' }, String(propValues[ctrl.prop]));
        ri.addEventListener('input', function () {
          var val = Number(this.value);
          propValues[ctrl.prop] = val;
          rv.textContent = String(val);
          isCodeManuallyEdited = false;
          syncControlsInOtherContainer(container, ctrl.prop, val);
          updatePreviewAndCode();
        });
        rd.appendChild(ri);
        rd.appendChild(rv);
        wrapper.appendChild(rd);
      }

      propsContainer.appendChild(wrapper);
    });

    container.appendChild(propsContainer);
  }

  // Sync matching control in the other container (desktop <-> mobile)
  function syncControlsInOtherContainer(sourceContainer, prop, value) {
    var otherContainer = sourceContainer === controlsDesktop ? controlsMobile : controlsDesktop;
    if (!otherContainer) return;
    var ctrl = otherContainer.querySelector('.cu-pg-control[data-prop="' + prop + '"]');
    if (!ctrl) return;
    if (ctrl.type === 'checkbox') ctrl.checked = !!value;
    else ctrl.value = value;
  }

  function syncAllControls() {
    [controlsDesktop, controlsMobile].forEach(function (container) {
      if (!container) return;
      renderControls(container);
    });
  }

  // ── Preview & Code ────────────────────────────────────────────────
  function updatePreviewAndCode() {
    var comp = getComponent(currentComponentId);
    if (!comp) return;

    var code = comp.codeTemplate(propValues);

    // Update preview
    previewEl.innerHTML = code;
    if (typeof CubbyUI !== 'undefined') CubbyUI.refresh();

    // Update code textarea (unless manually edited)
    if (!isCodeManuallyEdited) {
      codeEl.value = code;
    }

    updateManualEditUI();
  }

  function updateManualEditUI() {
    if (isCodeManuallyEdited) {
      resetCodeBtn.classList.remove('hidden');
      manualWarning.classList.remove('hidden');
      manualWarning.textContent = t('manual-warning');
    } else {
      resetCodeBtn.classList.add('hidden');
      manualWarning.classList.add('hidden');
    }
  }

  // ── Code textarea editing ─────────────────────────────────────────
  codeEl.addEventListener('input', function () {
    isCodeManuallyEdited = true;
    updateManualEditUI();
    clearTimeout(codeDebounceTimer);
    codeDebounceTimer = setTimeout(function () {
      previewEl.innerHTML = codeEl.value;
      if (typeof CubbyUI !== 'undefined') CubbyUI.refresh();
    }, 300);
  });

  resetCodeBtn.addEventListener('click', function () {
    isCodeManuallyEdited = false;
    updatePreviewAndCode();
  });

  // ── Copy code ─────────────────────────────────────────────────────
  copyBtn.addEventListener('click', function () {
    navigator.clipboard.writeText(codeEl.value).then(function () {
      var original = copyBtn.textContent;
      copyBtn.textContent = t('copied');
      setTimeout(function () { copyBtn.textContent = original; }, 1200);
    });
  });

  // ── Dark mode toggle ──────────────────────────────────────────────
  var darkVars = {
    '--color-background': 'hsl(224 71% 4%)',
    '--color-foreground': 'hsl(213 31% 91%)',
    '--color-border': 'hsl(217 33% 17.5%)',
    '--color-input': 'hsl(217 33% 17.5%)',
    '--color-ring': 'hsl(224 64% 33%)',
    '--color-primary': 'hsl(217 91% 60%)',
    '--color-primary-foreground': 'hsl(0 0% 100%)',
    '--color-secondary': 'hsl(217 33% 17.5%)',
    '--color-secondary-foreground': 'hsl(213 31% 91%)',
    '--color-destructive': 'hsl(0 63% 31%)',
    '--color-destructive-foreground': 'hsl(0 86% 97%)',
    '--color-success': 'hsl(142 71% 29%)',
    '--color-success-foreground': 'hsl(0 0% 100%)',
    '--color-warning': 'hsl(38 92% 30%)',
    '--color-warning-foreground': 'hsl(0 0% 100%)',
    '--color-info': 'hsl(199 89% 28%)',
    '--color-info-foreground': 'hsl(0 0% 100%)',
    '--color-muted': 'hsl(223 47% 11%)',
    '--color-muted-foreground': 'hsl(215 20% 65%)',
    '--color-accent': 'hsl(217 33% 17.5%)',
    '--color-accent-foreground': 'hsl(213 31% 91%)',
    '--color-popover': 'hsl(224 71% 4%)',
    '--color-popover-foreground': 'hsl(213 31% 91%)',
    '--color-card': 'hsl(224 71% 4%)',
    '--color-card-foreground': 'hsl(213 31% 91%)',
  };

  darkToggle.addEventListener('change', function () {
    if (this.checked) {
      previewEl.classList.add('dark');
      previewEl.style.colorScheme = 'dark';
      Object.keys(darkVars).forEach(function (k) {
        previewEl.style.setProperty(k, darkVars[k]);
      });
    } else {
      previewEl.classList.remove('dark');
      previewEl.style.colorScheme = '';
      // Remove dark overrides (keep any theme customizations)
      Object.keys(darkVars).forEach(function (k) {
        previewEl.style.removeProperty(k);
      });
    }
  });

  // ── Tabs ──────────────────────────────────────────────────────────
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = this.getAttribute('data-cu-pg-tab');
      tabs.forEach(function (t) {
        if (t.getAttribute('data-cu-pg-tab') === target) {
          t.classList.add('border-primary', 'text-foreground');
          t.classList.remove('border-transparent', 'text-muted-foreground');
        } else {
          t.classList.remove('border-primary', 'text-foreground');
          t.classList.add('border-transparent', 'text-muted-foreground');
        }
      });
      panelCode.classList.toggle('hidden', target !== 'code');
      panelTheme.classList.toggle('hidden', target !== 'theme');
    });
  });

  // ── Theme customization ───────────────────────────────────────────
  var THEME_COLORS = [
    { key: 'primary', label: 'Primary' },
    { key: 'primary-foreground', label: 'Primary FG' },
    { key: 'secondary', label: 'Secondary' },
    { key: 'secondary-foreground', label: 'Secondary FG' },
    { key: 'destructive', label: 'Destructive' },
    { key: 'destructive-foreground', label: 'Destructive FG' },
    { key: 'success', label: 'Success' },
    { key: 'success-foreground', label: 'Success FG' },
    { key: 'background', label: 'Background' },
    { key: 'foreground', label: 'Foreground' },
    { key: 'border', label: 'Border' },
    { key: 'muted', label: 'Muted' },
    { key: 'muted-foreground', label: 'Muted FG' },
  ];

  function hslToHex(h, s, l) {
    h = h / 360; s = s / 100; l = l / 100;
    var r, g, b;
    if (s === 0) { r = g = b = l; }
    else {
      var hue2rgb = function (p, q, t) {
        if (t < 0) t += 1; if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    var toHex = function (x) { var hex = Math.round(x * 255).toString(16); return hex.length === 1 ? '0' + hex : hex; };
    return '#' + toHex(r) + toHex(g) + toHex(b);
  }

  function hexToHsl(hex) {
    var r = parseInt(hex.slice(1, 3), 16) / 255;
    var g = parseInt(hex.slice(3, 5), 16) / 255;
    var b = parseInt(hex.slice(5, 7), 16) / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; }
    else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return {
      h: Math.round(h * 360 * 10) / 10,
      s: Math.round(s * 100 * 10) / 10,
      l: Math.round(l * 100 * 10) / 10,
    };
  }

  function parseHslString(str) {
    var match = str.match(/hsl\(\s*([\d.]+)\s+([\d.]+)%?\s+([\d.]+)%?\s*\)/);
    if (!match) return null;
    return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
  }

  function getDefaultColorHex(key) {
    // Read from theme.css defaults (light mode)
    var defaults = {
      'primary': 'hsl(221 83% 53%)',
      'primary-foreground': 'hsl(0 0% 100%)',
      'secondary': 'hsl(210 40% 94.2%)',
      'secondary-foreground': 'hsl(222.2 47.4% 11.2%)',
      'destructive': 'hsl(0 84% 60%)',
      'destructive-foreground': 'hsl(0 0% 100%)',
      'success': 'hsl(142 71% 41%)',
      'success-foreground': 'hsl(0 0% 100%)',
      'background': 'hsl(210 40% 98.8%)',
      'foreground': 'hsl(222.2 47.4% 11.2%)',
      'border': 'hsl(242 7% 88%)',
      'muted': 'hsl(210 40% 96.1%)',
      'muted-foreground': 'hsl(215 20% 41.5%)',
    };
    var hslStr = defaults[key];
    if (!hslStr) return '#000000';
    var hsl = parseHslString(hslStr);
    if (!hsl) return '#000000';
    return hslToHex(hsl.h, hsl.s, hsl.l);
  }

  function renderThemeColors() {
    themeColorsEl.innerHTML = '';
    THEME_COLORS.forEach(function (c) {
      var row = el('div', { className: 'flex items-center gap-2' });
      var colorInput = el('input', { type: 'color', className: 'size-8 shrink-0 cursor-pointer rounded border border-border bg-transparent p-0.5' });
      colorInput.value = getDefaultColorHex(c.key);
      colorInput.setAttribute('data-theme-key', c.key);
      var labelEl = el('span', { className: 'text-xs text-muted-foreground truncate' }, c.label);

      colorInput.addEventListener('input', function () {
        var hsl = hexToHsl(this.value);
        var hslValue = 'hsl(' + hsl.h + ' ' + hsl.s + '% ' + hsl.l + '%)';
        previewEl.style.setProperty('--color-' + c.key, hslValue);
      });

      row.appendChild(colorInput);
      row.appendChild(labelEl);
      themeColorsEl.appendChild(row);
    });
  }

  // Border radius
  radiusInput.addEventListener('input', function () {
    var val = parseFloat(this.value);
    radiusValue.textContent = val + 'rem';
    previewEl.style.setProperty('--radius-lg', val + 'rem');
    previewEl.style.setProperty('--radius-md', 'calc(' + val + 'rem - 2px)');
    previewEl.style.setProperty('--radius-sm', 'calc(' + val + 'rem - 4px)');
  });

  // Reset theme
  resetThemeBtn.addEventListener('click', function () {
    // Remove all inline CSS variable overrides
    THEME_COLORS.forEach(function (c) {
      previewEl.style.removeProperty('--color-' + c.key);
    });
    previewEl.style.removeProperty('--radius-lg');
    previewEl.style.removeProperty('--radius-md');
    previewEl.style.removeProperty('--radius-sm');
    radiusInput.value = '0.5';
    radiusValue.textContent = '0.5rem';
    // Reset color inputs
    themeColorsEl.querySelectorAll('input[type="color"]').forEach(function (inp) {
      var key = inp.getAttribute('data-theme-key');
      inp.value = getDefaultColorHex(key);
    });
    // Re-apply dark vars if dark is toggled
    if (darkToggle.checked) {
      Object.keys(darkVars).forEach(function (k) {
        previewEl.style.setProperty(k, darkVars[k]);
      });
    }
  });

  // ── Init ──────────────────────────────────────────────────────────
  propValues = getDefaultProps(COMPONENTS[0]);
  syncAllControls();
  renderThemeColors();
  updatePreviewAndCode();
})();
