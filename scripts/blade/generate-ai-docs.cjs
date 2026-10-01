/**
 * Blade AI 文件生成器
 *
 * 根據元件 metadata 生成：
 * - README.md — AI 可讀的敘述式 Blade 元件文件
 * - components.json — 結構化元件清單
 */

const fs = require('fs');
const path = require('path');

// ── 分類顯示順序 ────────────────────────────────────────

const CATEGORY_ORDER = [
  { key: 'typography', label: 'Typography' },
  { key: 'basic', label: 'Basic' },
  { key: 'forms', label: 'Forms' },
  { key: 'dataDisplay', label: 'Data Display' },
  { key: 'feedback', label: 'Feedback' },
  { key: 'overlay', label: 'Overlay' },
  { key: 'navigation', label: 'Navigation' },
  { key: 'layout', label: 'Layout' },
  { key: 'ai', label: 'AI' },
];

// ── 巢狀結構定義（wrapper → nested children） ──────────

const NESTED_PARTS = {
  header: ['header-content', 'title', 'description'],
  'header-content': ['title', 'description', 'value'],
  footer: [],
  content: [],
  body: ['canvas', 'legend'],
  legend: ['legend-item'],
  list: ['item'],
};

/** 有 header-content 時，actions 與其並列於 header 內（Chart / Page Header 式標頭）；否則 actions 為獨立區塊（如 Transfer List） */
const HEADER_WITH_CONTENT_EXTRA = ['actions'];

// ── 工具函式 ──────────────────────────────────────────

/**
 * 從 cssClasses 推導 prop 的合法值
 * 例如 variants: ["cu-button-default", "cu-button-destructive"]
 *   → stripPrefix("cu-button-") → ["default", "destructive"]
 */
function derivePropValues(cssArray, componentKebab) {
  if (!cssArray || !Array.isArray(cssArray)) return null;
  const prefix = `cu-${componentKebab}-`;
  const values = cssArray
    .filter((cls) => cls.startsWith(prefix))
    .map((cls) => cls.slice(prefix.length));
  return values.length > 0 ? values : null;
}

/**
 * 將 display name 或 PascalCase 轉為 kebab-case（支援空格）
 * "Button Group" → "button-group", "AlertDialog" → "alert-dialog"
 */
function toKebab(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

function toBladeTag(kebab, parentKebab) {
  return parentKebab ? `x-cu.${parentKebab}.${kebab}` : `x-cu.${kebab}`;
}

/**
 * 組裝 props 屬性字串（用於範例）
 * 過濾掉 null default 和 href
 */
function buildPropsString(props) {
  const attrs = [];
  for (const [name, info] of Object.entries(props)) {
    if (info.default !== null && info.default !== undefined && name !== 'href') {
      attrs.push(`${name}="${info.default}"`);
    }
  }
  return attrs.length > 0 ? ' ' + attrs.join(' ') : '';
}

// ── README.md 生成 ─────────────────────────────────────

function generateBladeReadme(componentTree) {
  const lines = [];

  lines.push('# Cubby UI — Laravel Blade Components');
  lines.push('');
  lines.push('> Framework-agnostic UI components as Laravel Blade anonymous components. Use `<x-cu.component-name>` syntax.');
  lines.push('');

  lines.push('## Setup');
  lines.push('');
  lines.push('1. `npm install cubby-ui`');
  lines.push('2. Register in `AppServiceProvider::boot()`:');
  lines.push('');
  lines.push('```php');
  lines.push('// 從 node_modules 載入 Cubby UI Blade 元件，使用 <x-cu.*> 前綴');
  lines.push("Blade::anonymousComponentPath(base_path('node_modules/cubby-ui/dist/laravel/components'), 'cu');");
  lines.push('```');
  lines.push('');
  lines.push('3. Import CSS / JS via Vite in `resources/js/app.js`:');
  lines.push('');
  lines.push('```js');
  lines.push("import 'cubby-ui/css';  // CSS styles");
  lines.push("import 'cubby-ui';       // Interactive JS (auto-init)");
  lines.push('```');
  lines.push('');
  lines.push('- **CSS**: Required for all components');
  lines.push('- **JS**: Required only for interactive components (marked with ⚡)');
  lines.push('- **Dark mode**: Add `dark` class on `<html>` or `<body>`');
  lines.push('- **Update**: `npm update cubby-ui` updates everything automatically');
  lines.push('');

  lines.push('## Usage Convention');
  lines.push('');
  lines.push('```blade');
  lines.push('{{-- Simple component --}}');
  lines.push('<x-cu.button variant="destructive" size="sm">Delete</x-cu.button>');
  lines.push('');
  lines.push('{{-- Composite component (parent + children) --}}');
  lines.push('<x-cu.card>');
  lines.push('  <x-cu.card.header>');
  lines.push('    <x-cu.card.title>Title</x-cu.card.title>');
  lines.push('  </x-cu.card.header>');
  lines.push('  <x-cu.card.content>Content</x-cu.card.content>');
  lines.push('</x-cu.card>');
  lines.push('```');
  lines.push('');
  lines.push('- **Props**: Pass as Blade attributes — `<x-cu.button variant="outline">`');
  lines.push('- **Attribute pass-through**: Extra HTML attributes (id, class, data-*, aria-*) are automatically forwarded');
  lines.push('- **Class merging**: Your classes merge with `cu-*` base classes — `<x-cu.button class="mt-4">` works correctly');
  lines.push('- **Slot**: Content between tags becomes `{{ $slot }}`');
  lines.push('');

  lines.push('## Design Tokens');
  lines.push('');
  lines.push('Semantic color tokens (CSS variables):');
  lines.push('- `--color-primary` / `--color-primary-foreground`');
  lines.push('- `--color-secondary` / `--color-secondary-foreground`');
  lines.push('- `--color-destructive` / `--color-destructive-foreground`');
  lines.push('- `--color-success` / `--color-success-foreground`');
  lines.push('- `--color-warning` / `--color-warning-foreground`');
  lines.push('- `--color-info` / `--color-info-foreground`');
  lines.push('- `--color-muted` / `--color-muted-foreground`');
  lines.push('- `--color-accent` / `--color-accent-foreground`');
  lines.push('- `--color-background` / `--color-foreground`');
  lines.push('- `--color-card` / `--color-card-foreground`');
  lines.push('- `--color-border`, `--color-input`, `--color-ring`');
  lines.push('- `--color-chart-1` … `--color-chart-5` (chart series palette, fixed order)');
  lines.push('');

  lines.push('## JavaScript API');
  lines.push('');
  lines.push('```js');
  lines.push('CubbyUI.init()     // Initialize all interactive components (auto-runs on DOMContentLoaded)');
  lines.push('CubbyUI.destroy()  // Clear tracking arrays (use before SPA route transition)');
  lines.push('CubbyUI.refresh()  // Remove stale refs + re-init (use after dynamic content updates)');
  lines.push('');
  lines.push('// Toast API');
  lines.push('CubbyUI.toast.show({ title: "Saved", variant: "success" })');
  lines.push('CubbyUI.toast.promise(fetchData(), { loading: "Loading...", success: "Done!", error: "Failed" })');
  lines.push('```');
  lines.push('');

  lines.push('---');
  lines.push('');
  lines.push('## Components Reference');
  lines.push('');

  for (const { key: category, label } of CATEGORY_ORDER) {
    const components = componentTree.filter((c) => c.category === category);
    if (components.length === 0) continue;

    lines.push(`### ${label}`);
    lines.push('');

    for (const comp of components) {
      const interactiveMarker = comp.interactive ? ' ⚡' : '';
      lines.push(`**${comp.displayName}**${interactiveMarker}`);
      lines.push(`Tag: \`<${comp.tag}>\``);

      if (comp.props && Object.keys(comp.props).length > 0) {
        const propsDesc = Object.entries(comp.props)
          .map(([name, info]) => {
            let desc = name;
            if (info.values) desc += ` (${info.values.join(' | ')})`;
            if (info.default !== null && info.default !== undefined) desc += `, default: "${info.default}"`;
            return desc;
          })
          .join('; ');
        lines.push(`Props: ${propsDesc}`);
      }

      if (comp.children && comp.children.length > 0) {
        lines.push(`Sub-components: ${comp.children.map((c) => `\`<${c.tag}>\``).join(', ')}`);
      }

      if (comp.dataAttributes && Object.keys(comp.dataAttributes).length > 0) {
        lines.push(`Data attributes: ${Object.values(comp.dataAttributes).join(', ')}`);
      }

      if (comp.notes) lines.push(comp.notes);

      if (comp.bladeExample) {
        lines.push('```blade');
        lines.push(comp.bladeExample);
        lines.push('```');
      }

      lines.push('');
    }
  }

  return lines.join('\n');
}

// ── components.json 生成 ──────────────────────────────

function generateBladeManifest(componentTree) {
  const manifest = {
    name: 'cubby-ui-blade',
    prefix: 'x-cu',
    description: 'Laravel Blade anonymous components for Cubby UI',
    setup: {
      css: 'cubby-ui.min.css',
      js: 'cubby-ui.min.js',
      jsNote: 'Only needed for components with interactive: true',
    },
    components: componentTree.map((comp) => {
      const entry = {
        name: comp.displayName,
        tag: comp.tag,
        file: comp.file,
      };

      if (comp.props && Object.keys(comp.props).length > 0) {
        entry.props = comp.props;
      }

      entry.interactive = comp.interactive;

      if (comp.children && comp.children.length > 0) {
        entry.children = comp.children.map((child) => ({
          name: child.name,
          tag: child.tag,
          file: child.file,
        }));
      }

      if (comp.dataAttributes && Object.keys(comp.dataAttributes).length > 0) {
        entry.dataAttributes = comp.dataAttributes;
      }

      if (comp.notes) entry.notes = comp.notes;
      if (comp.bladeExample) entry.example = comp.bladeExample;

      return entry;
    }),
  };

  return JSON.stringify(manifest, null, 2);
}

// ── 組裝元件樹 ─────────────────────────────────────────

/**
 * 從收集的 metadata + 根目錄 components.json 組裝完整元件樹
 *
 * @param {Array} bladeComponents — 主迴圈收集的 metadata
 * @param {string} rootManifestPath — 根目錄 components.json 的路徑
 * @param {string} outDir — blade 輸出根目錄
 * @returns {Array} componentTree — 扁平陣列，parent 含 children
 */
function buildComponentTree(bladeComponents, rootManifestPath, outDir) {
  let rootComponents = [];
  try {
    const rootManifest = JSON.parse(fs.readFileSync(rootManifestPath, 'utf-8'));
    rootComponents = rootManifest.components || [];
  } catch {
    console.warn('⚠️  無法讀取根目錄 components.json，部分 metadata 可能不完整');
  }

  const rootLookup = new Map();
  for (const rc of rootComponents) {
    rootLookup.set(rc.name, rc);
    rootLookup.set(toKebab(rc.name), rc);
  }

  // 分離 parent 和 children，用 Map 加速 children 查找
  const parents = new Map();
  const childrenByParent = new Map();

  for (const bc of bladeComponents) {
    if (bc.compositeMapping) {
      const dir = bc.compositeMapping.dir;
      if (!childrenByParent.has(dir)) childrenByParent.set(dir, []);
      childrenByParent.get(dir).push(bc);
    } else {
      parents.set(bc.kebab, bc);
    }
  }

  const tree = [];

  for (const [kebab, bc] of parents) {
    const rootComp = rootLookup.get(bc.name) || rootLookup.get(kebab) || {};

    // 推導 props 合法值
    const propsWithValues = {};
    if (bc.parsedProps) {
      for (const [propName, defaultVal] of Object.entries(bc.parsedProps)) {
        const propInfo = { default: defaultVal };

        if (rootComp.cssClasses) {
          const cssKey = { variant: 'variants', size: 'sizes', direction: 'directions' }[propName];
          if (cssKey && rootComp.cssClasses[cssKey]) {
            propInfo.values = derivePropValues(rootComp.cssClasses[cssKey], kebab);
          }
        }

        propsWithValues[propName] = propInfo;
      }
    }

    // 組裝 children
    const myChildren = (childrenByParent.get(kebab) || [])
      .map((c) => ({
        name: c.compositeMapping.file,
        tag: toBladeTag(c.compositeMapping.file, kebab),
        file: path.relative(path.dirname(outDir), c.outputPath).replace(/\\/g, '/'),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const bladeExample = generateBladeExample(kebab, rootComp, propsWithValues, myChildren);

    tree.push({
      displayName: rootComp.name || bc.name,
      tag: toBladeTag(kebab),
      file: path.relative(path.dirname(outDir), bc.outputPath).replace(/\\/g, '/'),
      category: rootComp.category || 'basic',
      interactive: rootComp.interactive || false,
      props: propsWithValues,
      children: myChildren,
      dataAttributes: rootComp.dataAttributes || null,
      notes: rootComp.notes || null,
      bladeExample,
    });
  }

  // 排序：分類 → 名稱
  const categoryIndex = {};
  CATEGORY_ORDER.forEach((c, i) => { categoryIndex[c.key] = i; });
  tree.sort((a, b) => {
    const catDiff = (categoryIndex[a.category] ?? 99) - (categoryIndex[b.category] ?? 99);
    return catDiff !== 0 ? catDiff : a.displayName.localeCompare(b.displayName);
  });

  return tree;
}

// ── Blade 範例生成 ─────────────────────────────────────

function generateBladeExample(kebab, rootComp, props, children) {
  const tag = toBladeTag(kebab);
  if (children.length > 0) {
    return generateCompositeExample(tag, props, children);
  }
  return generateSimpleExample(tag, rootComp, props);
}

function generateSimpleExample(tag, rootComp, props) {
  const propsStr = buildPropsString(props);
  const content = getExampleContent(rootComp.name || 'Content');
  return `<${tag}${propsStr}>${content}</${tag}>`;
}

function generateCompositeExample(tag, props, children) {
  const propsStr = buildPropsString(props);
  const lines = [`<${tag}${propsStr}>`];

  const childMap = new Map(children.map((c) => [c.name, c]));

  // 常見組合模式
  const patterns = [
    ['header', 'title', 'description'],
    ['content'],
    ['body'],
    ['footer'],
    ['trigger'],
    ['list', 'item'],
    ['label', 'action'],
  ];

  const used = new Set();
  // 依 NESTED_PARTS 遞迴輸出（如 Chart：header > header-content > title）
  const renderPart = (part, depth) => {
    const child = childMap.get(part);
    used.add(part);
    const indent = '  '.repeat(depth);
    const candidates = (NESTED_PARTS[part] || []).concat(
      part === 'header' && childMap.has('header-content') ? HEADER_WITH_CONTENT_EXTRA : []
    );
    const nestedParts = candidates.filter((np) => childMap.has(np) && !used.has(np));
    if (nestedParts.length > 0) {
      lines.push(`${indent}<${child.tag}>`);
      for (const np of nestedParts) {
        if (!used.has(np)) renderPart(np, depth + 1);
      }
      lines.push(`${indent}</${child.tag}>`);
    } else {
      lines.push(`${indent}<${child.tag}>${getPartContent(part)}</${child.tag}>`);
    }
  };
  for (const pattern of patterns) {
    for (const part of pattern) {
      if (!childMap.has(part) || used.has(part)) continue;
      renderPart(part, 1);
    }
  }

  // 加入未使用的 children
  for (const child of children) {
    if (!used.has(child.name)) {
      lines.push(`  <${child.tag}>${getPartContent(child.name)}</${child.tag}>`);
    }
  }

  lines.push(`</${tag}>`);
  return lines.join('\n');
}

const PART_CONTENT = {
  title: 'Title',
  description: 'Description text',
  content: 'Content here',
  footer: 'Footer',
  trigger: 'Toggle',
  item: 'Item',
  label: 'Label',
  action: '<!-- control -->',
  close: '✕',
  body: 'Body content',
  separator: '',
  icon: '<!-- icon -->',
  name: 'User',
  message: 'Hello!',
  timestamp: '2 min ago',
  value: '$12,345',
  time: '2h ago',
  canvas: '<canvas></canvas>',
  'legend-item': 'Series',
};

function getPartContent(part) {
  return PART_CONTENT[part] ?? part.charAt(0).toUpperCase() + part.slice(1);
}

const EMPTY_CONTENT_COMPONENTS = new Set([
  'Input', 'Textarea', 'Checkbox', 'Radio', 'Toggle', 'Range',
  'Separator', 'HR', 'Skeleton', 'Spinner', 'Marquee', 'Progress',
]);

const COMPONENT_CONTENT = {
  Button: 'Click me',
  Badge: 'Badge',
  Label: 'Label',
};

function getExampleContent(displayName) {
  if (EMPTY_CONTENT_COMPONENTS.has(displayName)) return '';
  return COMPONENT_CONTENT[displayName] || displayName;
}

// ── 匯出 ──────────────────────────────────────────────

module.exports = {
  buildComponentTree,
  generateBladeReadme,
  generateBladeManifest,
};
