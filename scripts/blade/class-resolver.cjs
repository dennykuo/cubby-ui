/**
 * Class Resolver
 *
 * 將 Astro class:list 陣列中的 JS 表達式轉為 PHP 表達式，
 * 用於 Blade 的 $attributes->class([]) 或 @class([])。
 *
 * 支援的 pattern：
 * - 靜態 base class: `cu-card`
 * - Prop 後綴: `cu-button-${variant}`
 * - Default 跳過: size && size !== "default" ? `cu-input-${size}` : undefined
 * - Boolean 條件: disabled ? `cu-rating-disabled` : undefined
 * - Helper 函式結果（已由 parser 內聯展開）
 * - Conditional &&: filled && `cu-rating-item-active`
 * - Inline ternary: cond ? 'class' : ''
 * - Object 語法: { [`cu-xxx-placeholder`]: !value }
 * - Template literal 內引用靜態 frontmatter const: `${baseClass}-vertical`
 */

const { TOP_CLASS, substituteHelperParam } = require('./parser.cjs');

/** falsy 字面量集合（用於判斷 ternary false 分支是否為「無值」） */
const FALSY_LITERALS = new Set(['undefined', 'null', '""', "''"]);

/**
 * 將 class:list 陣列中的單個項目轉為 PHP 表達式
 *
 * @param {string} item - class:list 陣列中的一個元素（trimmed）
 * @param {Record<string, { raw: string, resolved: string }>} variables - 變數對照表
 * @param {Record<string, string>} renamedProps - renamed props map
 * @param {Record<string, { param: string, body: string }>} helpers - helper functions
 * @returns {{ phpClass: string, condition?: string } | null}
 *   phpClass: PHP class 字串表達式
 *   condition: 若有條件則為 PHP 條件表達式
 */
function resolveClassItem(item, variables = {}, renamedProps = {}, helpers = {}) {
  // 1. className（使用者傳入的 class） — 跳過，由 $attributes->class() 自動合併
  if (item === 'className' || item === 'class') return null;

  // 1b. Object 語法：{ [`cu-xxx`]: cond, "cu-yyy": cond }（回傳多個 item）
  if (/^\{[\s\S]*\}$/.test(item)) {
    return resolveClassObject(item, variables, renamedProps);
  }

  // 2. 變數引用（如 baseClass, variantClass, sizeClass）
  if (variables[item]) {
    return resolveVariableExpression(item, variables, renamedProps, helpers);
  }

  // 3. 靜態 template literal: `cu-xxx`
  const staticLiteral = item.match(/^`([^$`]+)`$/);
  if (staticLiteral) {
    return { phpClass: staticLiteral[1] };
  }

  // 4. 靜態字串: "cu-xxx"
  const staticString = item.match(/^["']([^"']+)["']$/);
  if (staticString) {
    return { phpClass: staticString[1] };
  }

  // 5. Template literal with interpolation: `cu-button-${variant}`
  const templateLiteral = item.match(/^`(.+)`$/);
  if (templateLiteral) {
    return { phpClass: templateLiteralToPhp(templateLiteral[1], renamedProps, variables) };
  }

  // 6. Conditional && class: `word && expr` or `compound_expr && expr`
  const condAndMatch = item.match(/^(.+?)\s*&&\s*(.+)$/);
  if (condAndMatch) {
    const [, cond, classExpr] = condAndMatch;
    const resolved = resolveClassItem(classExpr.trim(), variables, renamedProps, helpers);
    if (resolved) {
      const phpCond = /^\w+$/.test(cond.trim())
        ? propToPhp(cond.trim(), renamedProps)
        : conditionToPhp(cond.trim(), renamedProps);
      return {
        phpClass: resolved.phpClass,
        condition: phpCond,
      };
    }
  }

  // 7. Inline ternary: cond ? 'class' : ''
  const inlineTernary = item.match(/^(.+?)\s*\?\s*(.+?)\s*:\s*(.+)$/);
  if (inlineTernary) {
    const [, cond, trueExpr, falseExpr] = inlineTernary;
    if (FALSY_LITERALS.has(falseExpr.trim())) {
      const resolved = resolveClassItem(trueExpr.trim(), variables, renamedProps, helpers);
      if (resolved) {
        return {
          phpClass: resolved.phpClass,
          condition: conditionToPhp(cond.trim(), renamedProps),
        };
      }
    }
  }

  return null;
}

/**
 * 解析變數引用為 PHP class 表達式
 */
function resolveVariableExpression(varName, variables, renamedProps, helpers) {
  const v = variables[varName];
  if (!v) return null;
  const raw = v.raw.trim();

  // Pattern 1: 靜態字串 — `cu-card` or "cu-card"
  const staticMatch = raw.match(/^`([^$`]+)`$/) || raw.match(/^["']([^"']+)["']$/);
  if (staticMatch) {
    return { phpClass: staticMatch[1] };
  }

  // Pattern 2: Template literal with prop — `cu-button-${variant}`
  const templateMatch = raw.match(/^`(.+)`$/);
  if (templateMatch) {
    return { phpClass: templateLiteralToPhp(templateMatch[1], renamedProps, variables) };
  }

  // Pattern 3: Conditional with default skip — size && size !== "default" ? expr : undefined
  const condDefaultMatch = raw.match(
    /^(\w+)\s*&&\s*\1\s*!==?\s*["'](\w+)["']\s*\?\s*(.+?)\s*:\s*(?:undefined|null|""|'')$/
  );
  if (condDefaultMatch) {
    const [, prop, defaultVal, trueExpr] = condDefaultMatch;
    const phpProp = propToPhp(prop, renamedProps);
    const resolvedClass = resolveTemplateOrString(trueExpr.trim(), renamedProps, variables);
    return {
      phpClass: resolvedClass,
      condition: `${phpProp} && ${phpProp} !== '${defaultVal}'`,
    };
  }

  // Pattern 3b: 簡化版 — prop !== "default" ? expr : undefined
  const simpleCondMatch = raw.match(
    /^(\w+)\s*!==?\s*["'](\w+)["']\s*\?\s*(.+?)\s*:\s*(?:undefined|null|""|'')$/
  );
  if (simpleCondMatch) {
    const [, prop, defaultVal, trueExpr] = simpleCondMatch;
    const phpProp = propToPhp(prop, renamedProps);
    const resolvedClass = resolveTemplateOrString(trueExpr.trim(), renamedProps, variables);
    return {
      phpClass: resolvedClass,
      condition: `${phpProp} !== '${defaultVal}'`,
    };
  }

  // Pattern 4: Boolean conditional — disabled ? `cu-xxx` : undefined
  const boolMatch = raw.match(
    /^(\w+)\s*\?\s*(.+?)\s*:\s*(?:undefined|null|""|'')$/
  );
  if (boolMatch) {
    const [, prop, trueExpr] = boolMatch;
    const phpProp = propToPhp(prop, renamedProps);
    const resolvedClass = resolveTemplateOrString(trueExpr.trim(), renamedProps, variables);
    return {
      phpClass: resolvedClass,
      condition: phpProp,
    };
  }

  // Pattern 4b: Full ternary — prop === "x" ? `class-a` : `class-b`（兩邊都有值）
  const fullTernary = raw.match(
    /^(\w+)\s*(===?|!==?)\s*["']([^"']+)["']\s*\?\s*(.+?)\s*:\s*(.+?)$/
  );
  if (fullTernary) {
    const [, prop, op, val, trueExpr, falseExpr] = fullTernary;
    const trimFalse = falseExpr.trim();
    // 只處理兩邊都是有效 class 的情況（非 undefined）
    if (!FALSY_LITERALS.has(trimFalse)) {
      const phpProp = propToPhp(prop, renamedProps);
      const trueClass = resolveTemplateOrString(trueExpr.trim(), renamedProps, variables);
      const falseClass = resolveTemplateOrString(trimFalse, renamedProps, variables);
      return {
        phpClass: `${phpProp} ${op} '${val}' ? '${trueClass}' : ${falseClass.includes("'") || falseClass.includes(' . ') ? falseClass : `'${falseClass}'`}`,
      };
    }
  }

  // Pattern 5: Helper function 呼叫（已由 parser inlineHelper 處理，
  //   此處處理殘留的 resolved 結果）
  // 如果 resolved 不同於 raw，代表已被展開
  if (v.resolved && v.resolved !== raw) {
    // 遞迴解析展開後的結果
    const tempVars = { [varName]: { raw: v.resolved, resolved: v.resolved } };
    return resolveVariableExpression(varName, tempVars, renamedProps, helpers);
  }

  // Pattern 6: Helper function call — getVariantClass(variant)
  const callMatch = raw.match(/^(\w+)\((\w+)\)$/);
  if (callMatch && helpers[callMatch[1]]) {
    const [, funcName, arg] = callMatch;
    const helper = helpers[funcName];
    const inlined = substituteHelperParam(helper.body, helper.param, arg);
    const tempVars = { [varName]: { raw: inlined, resolved: inlined } };
    return resolveVariableExpression(varName, tempVars, renamedProps, helpers);
  }

  return null;
}

/**
 * 解析 template literal 或字串為 PHP 表達式
 */
function resolveTemplateOrString(expr, renamedProps, variables) {
  // `cu-button-${variant}`
  const tpl = expr.match(/^`(.+)`$/);
  if (tpl) return templateLiteralToPhp(tpl[1], renamedProps, variables);

  // "cu-card"
  const str = expr.match(/^["']([^"']+)["']$/);
  if (str) return str[1];

  // ${TOP_CLASS}-xxx 已被替換
  return expr.replace(/"/g, '');
}

/**
 * 解析 class:list 的 object 語法為多個條件 class item
 *   { [`${TOP_CLASS}-x`]: !value, "cu-y": active } → [{ phpClass: 'cu-x', condition: '!$value' }, ...]
 * @returns {Array<{ phpClass: string, condition: string }>}
 */
function resolveClassObject(item, variables, renamedProps) {
  const body = item.trim().slice(1, -1);
  const entries = [];
  let depth = 0;
  let inTemplate = false;
  let current = '';
  for (const ch of body) {
    if (ch === '`') inTemplate = !inTemplate;
    else if (!inTemplate && '[({'.includes(ch)) depth++;
    else if (!inTemplate && '])}'.includes(ch)) depth--;
    if (ch === ',' && depth === 0 && !inTemplate) {
      entries.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  entries.push(current);

  const items = [];
  for (const entry of entries.map((e) => e.trim()).filter(Boolean)) {
    const m = entry.match(/^(\[\s*`([^`]+)`\s*\]|["']([^"']+)["']|([\w-]+))\s*:\s*([\s\S]+)$/);
    if (!m) {
      throw new Error(`無法解析 class:list object 項目：${entry}`);
    }
    const [, , tplKey, strKey, identKey, cond] = m;
    const phpClass = tplKey !== undefined
      ? templateLiteralToPhp(tplKey, renamedProps, variables)
      : (strKey ?? identKey);
    items.push({ phpClass, condition: conditionToPhp(cond.trim(), renamedProps) });
  }
  return items;
}

/**
 * 回傳 frontmatter const 的靜態字串值（由 parser 預先計算），非靜態回傳 undefined
 */
function staticVariable(variables, name) {
  const v = variables && variables[name];
  return v && typeof v.staticValue === 'string' ? v.staticValue : undefined;
}

/**
 * 將 JS template literal 內容轉為 PHP 字串拼接
 * 如：cu-button-${variant} → 'cu-button-' . $variant
 *     ${baseClass}-vertical → cu-steps-vertical（baseClass 為靜態 const 時直接內聯）
 * @param {string} content - template literal 內容（不含反引號）
 * @param {Record<string, string>} renamedProps
 * @param {Record<string, { staticValue?: string | null }>} [variables] - frontmatter const
 * @returns {string} PHP 表達式（全靜態時回傳不含引號的字串）
 */
function templateLiteralToPhp(content, renamedProps = {}, variables = {}) {
  // 先替換 ${TOP_CLASS} 為 cu，並內聯可靜態求值的 frontmatter const
  content = content
    .replace(/\$\{TOP_CLASS\}/g, TOP_CLASS)
    .replace(/\$\{(\w+)\}/g, (m, name) => staticVariable(variables, name) ?? m);

  // 檢查是否有插值
  if (!content.includes('${')) return content;

  // 拆分為靜態部分和插值部分
  const parts = [];
  let lastIndex = 0;
  const interpRegex = /\$\{(\w+)\}/g;
  let m;

  while ((m = interpRegex.exec(content)) !== null) {
    if (m.index > lastIndex) {
      parts.push(`'${content.slice(lastIndex, m.index)}'`);
    }
    parts.push(propToPhp(m[1], renamedProps));
    lastIndex = m.index + m[0].length;
  }

  if (lastIndex < content.length) {
    parts.push(`'${content.slice(lastIndex)}'`);
  }

  return parts.join(' . ');
}

/**
 * 將 JS prop 名轉為 PHP 變數
 * @param {string} name - JS 變數名
 * @param {Record<string, string>} renamedProps - renamed props (如 readonly → isReadonly)
 * @returns {string} PHP 變數，如 $variant
 */
function propToPhp(name, renamedProps = {}) {
  // 反向查找：如果 renamedProps 有 { readonly: "isReadonly" }，
  // 且 name 是 "isReadonly"，PHP 變數應該是 $readonly
  for (const [original, alias] of Object.entries(renamedProps)) {
    if (alias === name && original !== 'class') {
      return `$${original}`;
    }
  }
  return `$${name}`;
}

/**
 * 將 JS 條件表達式轉為 PHP 條件
 */
function conditionToPhp(cond, renamedProps = {}) {
  // 字串字面量原樣保留（僅轉為單引號），避免 "light" 被當成變數變成 '$light'
  return cond.replace(/("[^"]*"|'[^']*')|\b(\w+)\b/g, (match, str, word) => {
    if (str) return `'${str.slice(1, -1)}'`;
    if (word === 'undefined') return 'null';
    if (/^(true|false|null|typeof|instanceof)$/.test(word)) return word;
    if (/^\d+$/.test(word)) return word;
    return propToPhp(word, renamedProps);
  });
}

/**
 * 將解析後的 class items 陣列轉為 Blade @class() / $attributes->class() 格式
 *
 * @param {Array<{ phpClass: string, condition?: string }>} items
 * @param {boolean} useAttributes - 是否使用 $attributes->class()（root 元素用）
 * @param {string} [attributesExpr] - attribute bag 表達式；className 與 {...rest} 分在不同元素時
 *   傳 `$attributes->only('class')`，只把使用者的 class 合併到此元素
 * @returns {string}
 */
function buildBladeClassString(items, useAttributes = true, attributesExpr = '$attributes') {
  if (items.length === 0) {
    return useAttributes ? `{{ ${attributesExpr} }}` : '';
  }

  const entries = items.map((item) => {
    if (item.condition) {
      // 條件 class
      const classExpr = item.phpClass.includes(' . ')
        ? item.phpClass  // 動態拼接
        : `'${item.phpClass}'`;
      return `${classExpr} => ${item.condition}`;
    }
    // 靜態 class
    if (item.phpClass.includes(' . ') || item.phpClass.includes('?') || item.phpClass.includes('$')) {
      return item.phpClass;
    }
    return `'${item.phpClass}'`;
  });

  // 單行 or 多行判斷
  const joined = entries.join(', ');
  const isShort = joined.length < 80 && entries.length <= 3;

  if (isShort) {
    if (useAttributes) {
      return `{{ ${attributesExpr}->class([${joined}]) }}`;
    }
    return `@class([${joined}])`;
  }

  // 多行格式（entries 的每行已以 `,` 結尾，勿再重複追加）
  const inner = entries.map((e) => `    ${e},`).join('\n');
  if (useAttributes) {
    return `{{ ${attributesExpr}->class([\n${inner}\n]) }}`;
  }
  return `@class([\n${inner}\n])`;
}

module.exports = {
  resolveClassItem,
  resolveVariableExpression,
  staticVariable,
  templateLiteralToPhp,
  propToPhp,
  conditionToPhp,
  buildBladeClassString,
};
