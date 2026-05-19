#!/usr/bin/env node

/**
 * Astro → Blade 元件轉換器
 *
 * 掃描 src/components/ui/*.astro，自動生成 Laravel Blade 匿名元件。
 * 輸出至 dist/laravel/components/cu/。
 *
 * 用法：
 *   node scripts/generate-blade-components.js [--dry-run] [--verbose]
 */

const fs = require('fs');
const path = require('path');
const { parseComponent, toPhpDefault } = require('./blade/parser.cjs');
const { transformTemplate } = require('./blade/transformers.cjs');
const { buildComponentTree, generateBladeReadme, generateBladeManifest } = require('./blade/generate-ai-docs.cjs');

// ── 設定 ──────────────────────────────────────────────

const SRC_DIR = path.join(__dirname, '..', 'src', 'components', 'ui');
const OUT_DIR = path.join(__dirname, '..', 'dist', 'laravel', 'components', 'cu');
const OVERRIDES_DIR = path.join(__dirname, 'blade', 'overrides');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const VERBOSE = args.includes('--verbose');

// ── 複合元件映射 ────────────────────────────────────────

const COMPOSITES = [
  'AlertDialog', 'CommandPalette', 'ContextMenu', 'ButtonGroup',
  'CheckboxGroup', 'ToggleGroup', 'InputGroup', 'HoverCard',
  'ChatBubble', 'PageHeader', 'FilterBar', 'SettingItem',
  'EmptyState', 'Resizable', 'SegmentedControl', 'Sortable',
  'TransferList', 'MultiSelect', 'Combobox', 'Dropzone',
  'Accordion', 'Alert', 'Avatar', 'Breadcrumb', 'Card', 'Carousel',
  'Collapsible', 'Dialog', 'Drawer', 'Dropdown', 'Header', 'Form',
  'Menubar', 'Nav', 'Pagination', 'Popover', 'Sidebar', 'Stat',
  'Steps', 'Table', 'Tabs', 'Timeline', 'Toast', 'Toolbar', 'TreeView', 'Tree',
].sort((a, b) => b.length - a.length);

/**
 * 判斷元件名稱是否為複合元件的子元件，並回傳對應的目錄和檔名
 * @param {string} name - PascalCase 元件名（如 CardHeader）
 * @returns {{ dir: string, file: string } | null}
 */
function getCompositeMapping(name) {
  for (const prefix of COMPOSITES) {
    if (name === prefix) return null; // 主元件本身不算子元件
    if (name.startsWith(prefix)) {
      const suffix = name.slice(prefix.length);
      if (suffix && /^[A-Z]/.test(suffix)) {
        return {
          dir: toKebab(prefix),
          file: toKebab(suffix),
        };
      }
    }
  }

  return null;
}

/**
 * PascalCase → kebab-case
 */
function toKebab(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

/**
 * 從已生成的 Blade 內容中提取 @props 宣告
 * @param {string} bladeContent
 * @returns {Record<string, any>}
 */
function extractPropsFromBlade(bladeContent) {
  const props = {};
  const match = bladeContent.match(/@props\(\[([\s\S]*?)\]\)/);
  if (!match) return props;

  const entries = match[1].matchAll(/'(\w+)'\s*=>\s*(.+?)(?:,\s*$|\s*$)/gm);
  for (const [, name, val] of entries) {
    if (val.trim() === 'null') props[name] = null;
    else if (val.trim() === 'true') props[name] = true;
    else if (val.trim() === 'false') props[name] = false;
    else {
      const strMatch = val.trim().match(/^'(.*)'$/);
      props[name] = strMatch ? strMatch[1] : val.trim();
    }
  }
  return props;
}

// ── 主流程 ────────────────────────────────────────────

function main() {
  console.log('🔨 Astro → Blade 元件轉換器\n');

  // 掃描 Astro 元件
  const files = fs.readdirSync(SRC_DIR)
    .filter((f) => f.endsWith('.astro'))
    .sort();

  console.log(`📁 找到 ${files.length} 個 Astro 元件\n`);

  // 載入 overrides
  const overrides = loadOverrides();
  if (overrides.size > 0) {
    console.log(`📝 找到 ${overrides.size} 個手動 override: ${[...overrides.keys()].join(', ')}\n`);
  }

  // 預算複合元件的 parent set（避免 getOutputPath 每次重新掃描）
  const parentDirs = new Set();
  for (const f of files) {
    const mapping = getCompositeMapping(f.replace('.astro', ''));
    if (mapping) parentDirs.add(mapping.dir);
  }

  // 建立輸出目錄
  if (!DRY_RUN) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  // 統計
  const stats = { total: 0, auto: 0, override: 0, failed: 0, warnings: [] };

  // 收集 metadata（供 AI 文件生成）
  const bladeMetadata = [];

  for (const file of files) {
    const name = file.replace('.astro', '');
    stats.total++;

    try {
      let bladeContent;
      let parsedProps;

      const kebab = toKebab(name);
      const compositeMapping = getCompositeMapping(name);

      if (overrides.has(kebab)) {
        bladeContent = `{{-- Auto-generated from ${file} (manual override) — do not edit --}}\n${overrides.get(kebab)}`;
        parsedProps = extractPropsFromBlade(bladeContent);
        stats.override++;
      } else {
        const source = fs.readFileSync(path.join(SRC_DIR, file), 'utf-8');
        const result = convertComponent(source, file);
        bladeContent = result.content;
        parsedProps = result.props;
        stats.auto++;
      }

      const warnings = validateBlade(bladeContent, file);
      if (warnings.length > 0) {
        stats.warnings.push(...warnings);
      }

      const outPath = getOutputPath(name, parentDirs, compositeMapping);

      bladeMetadata.push({
        name,
        kebab,
        outputPath: outPath,
        parsedProps,
        compositeMapping,
        bladeContent,
      });

      if (DRY_RUN) {
        console.log(`✅ ${file} → ${path.relative(OUT_DIR, outPath)}`);
        if (VERBOSE) {
          console.log(bladeContent);
          console.log('---');
        }
      } else {
        // 建立子目錄
        const dir = path.dirname(outPath);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(outPath, bladeContent, 'utf-8');
        if (VERBOSE) {
          console.log(`✅ ${file} → ${path.relative(OUT_DIR, outPath)}`);
        }
      }
    } catch (err) {
      stats.failed++;
      console.error(`❌ ${file}: ${err.message}`);
      if (VERBOSE) {
        console.error(err.stack);
      }
    }
  }

  // 報告
  console.log('\n── 轉換結果 ──────────────────────');
  console.log(`  總計: ${stats.total}`);
  console.log(`  自動: ${stats.auto}`);
  console.log(`  Override: ${stats.override}`);
  console.log(`  失敗: ${stats.failed}`);

  if (stats.warnings.length > 0) {
    console.log(`\n⚠️  ${stats.warnings.length} 個警告:`);
    for (const w of stats.warnings) {
      console.log(`  - ${w}`);
    }
  }

  if (stats.failed > 0) {
    process.exit(1);
  }

  // ── 生成 AI 文件 ────────────────────────────────────
  if (!DRY_RUN) {
    const ROOT_MANIFEST = path.join(__dirname, '..', 'components.json');

    try {
      const componentTree = buildComponentTree(bladeMetadata, ROOT_MANIFEST, OUT_DIR);
      const readme = generateBladeReadme(componentTree);
      const manifest = generateBladeManifest(componentTree);

      fs.writeFileSync(path.join(OUT_DIR, 'README.md'), readme, 'utf-8');
      fs.writeFileSync(path.join(OUT_DIR, 'components.json'), manifest, 'utf-8');
      console.log(`\n📄 AI 文件已生成: README.md + components.json`);
    } catch (err) {
      console.error(`\n⚠️  AI 文件生成失敗: ${err.message}`);
      if (VERBOSE) console.error(err.stack);
    }
  }

  console.log(DRY_RUN ? '\n（dry-run 模式，未寫入檔案）' : `\n✅ 輸出至 ${OUT_DIR}`);
}

/**
 * 轉換單一 Astro 元件為 Blade
 * @returns {{ content: string, props: Record<string, any> }}
 */
function convertComponent(source, fileName) {
  const parsed = parseComponent(source);

  const propsLine = buildPropsDirective(parsed.props);
  const bladeTemplate = transformTemplate(parsed.template, parsed);

  const parts = [
    `{{-- Auto-generated from ${fileName} — do not edit --}}`,
  ];

  if (propsLine) {
    parts.push(propsLine);
  }

  parts.push('');
  parts.push(bladeTemplate);

  return { content: parts.join('\n'), props: parsed.props };
}

/**
 * 建構 @props([...]) 指令
 */
function buildPropsDirective(props) {
  const entries = Object.entries(props);
  if (entries.length === 0) return null;

  const items = entries.map(([name, val]) => `    '${name}' => ${toPhpDefault(val)}`);
  return `@props([\n${items.join(',\n')},\n])`;
}

/**
 * 決定輸出檔案路徑
 */
function getOutputPath(componentName, parentDirs, composite) {
  if (composite) {
    return path.join(OUT_DIR, composite.dir, `${composite.file}.blade.php`);
  }

  const kebab = toKebab(componentName);

  if (parentDirs.has(kebab)) {
    return path.join(OUT_DIR, kebab, 'index.blade.php');
  }

  return path.join(OUT_DIR, `${kebab}.blade.php`);
}

/**
 * 驗證生成的 Blade 是否有殘留 Astro 語法
 */
function validateBlade(content, fileName) {
  const warnings = [];
  const checks = [
    { pattern: /class:list=/, msg: '殘留 class:list' },
    { pattern: /Astro\.props/, msg: '殘留 Astro.props' },
    { pattern: /<slot\s*\/?>/, msg: '殘留 <slot />' },
    { pattern: /<slot\s+name=/, msg: '殘留 <slot name=>' },
    { pattern: /\$\{TOP_CLASS\}/, msg: '殘留 ${TOP_CLASS}' },
    { pattern: /\{\.\.\.rest\}/, msg: '殘留 {...rest}' },
    { pattern: /\{\.\.\.\(/, msg: '殘留條件 spread {...(cond ? ... : ...)}' },
    { pattern: /<\/slot>/, msg: '殘留 </slot> 閉合標籤' },
  ];

  for (const { pattern, msg } of checks) {
    if (pattern.test(content)) {
      warnings.push(`${fileName}: ${msg}`);
    }
  }

  return warnings;
}

/**
 * 載入手動 override Blade 檔案
 */
function loadOverrides() {
  const overrides = new Map();

  if (!fs.existsSync(OVERRIDES_DIR)) return overrides;

  const files = fs.readdirSync(OVERRIDES_DIR)
    .filter((f) => f.endsWith('.blade.php'));

  for (const file of files) {
    const name = file.replace('.blade.php', '');
    const content = fs.readFileSync(path.join(OVERRIDES_DIR, file), 'utf-8');
    overrides.set(name, content);
  }

  return overrides;
}

// ── 執行 ──────────────────────────────────────────────
main();
