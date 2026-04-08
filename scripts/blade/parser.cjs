/**
 * Astro Frontmatter Parser
 *
 * 解析 Astro 元件的 frontmatter 區塊，提取：
 * - props 名稱和預設值
 * - 變數對照表（const declarations）
 * - helper functions（內聯展開）
 *
 * TOP_CLASS 固定解析為 "cu"。
 */

const TOP_CLASS = 'cu';

/**
 * 將 Astro 元件分割為 frontmatter 和 template
 * @param {string} source - Astro 原始碼
 * @returns {{ frontmatter: string, template: string }}
 */
function splitComponent(source) {
  const parts = source.split('---');
  if (parts.length < 3) {
    return { frontmatter: '', template: source.trim() };
  }
  return {
    frontmatter: parts[1].trim(),
    template: parts.slice(2).join('---').trim(),
  };
}

/**
 * 解析 props destructuring，提取名稱和預設值
 *
 * 支援格式：
 *   const { variant = "default", class: className, ...rest } = Astro.props;
 *
 * @param {string} frontmatter
 * @returns {{ props: Record<string, any>, renamedProps: Record<string, string> }}
 *   props: { variant: "default", size: "default", href: null }
 *   renamedProps: { "class": "className", "readonly": "isReadonly" }
 */
function parseProps(frontmatter) {
  const props = {};
  const renamedProps = {};

  // 找到 Astro.props destructuring（可能跨多行）
  const propsMatch = frontmatter.match(
    /const\s*\{([^}]+)\}\s*=\s*Astro\.props/s
  );
  if (!propsMatch) return { props, renamedProps };

  const body = propsMatch[1];

  // 拆分各個 prop（以逗號分隔，但要處理跨行）
  const items = body.split(',').map((s) => s.trim()).filter(Boolean);

  for (const item of items) {
    // 跳過 ...rest
    if (item.startsWith('...')) continue;

    // 處理 rename: class: className, readonly: isReadonly
    const renameMatch = item.match(
      /^(\w+)\s*:\s*(\w+)(?:\s*=\s*(.+))?$/
    );
    if (renameMatch) {
      const [, original, alias, defaultVal] = renameMatch;
      if (original === 'class') {
        // class 不加入 props（Blade 的 $attributes->class() 自動處理）
        renamedProps['class'] = alias;
      } else {
        renamedProps[original] = alias;
        props[original] = defaultVal ? parseDefaultValue(defaultVal) : null;
      }
      continue;
    }

    // 一般 prop: variant = "default"
    const propMatch = item.match(/^(\w+)(?:\s*=\s*(.+))?$/);
    if (propMatch) {
      const [, name, defaultVal] = propMatch;
      props[name] = defaultVal ? parseDefaultValue(defaultVal.trim()) : null;
    }
  }

  return { props, renamedProps };
}

/**
 * 解析預設值字串為 JS 值
 * @param {string} val
 * @returns {string|number|boolean|null}
 */
function parseDefaultValue(val) {
  // 字串
  if (/^["'](.*)["']$/.test(val)) return val.slice(1, -1);
  // 數字
  if (/^\d+(\.\d+)?$/.test(val)) return Number(val);
  // boolean
  if (val === 'true') return true;
  if (val === 'false') return false;
  return val;
}

/**
 * 將 JS 預設值轉為 PHP 預設值字串
 * @param {*} val
 * @returns {string}
 */
function toPhpDefault(val) {
  if (val === null || val === undefined) return 'null';
  if (typeof val === 'string') return `'${val.replace(/'/g, "\\'")}'`;
  if (typeof val === 'number') return String(val);
  if (typeof val === 'boolean') return val ? 'true' : 'false';
  return 'null';
}

/**
 * 建立變數對照表（frontmatter 中的 const 宣告）
 *
 * 解析格式：
 *   const baseClass = `${TOP_CLASS}-button`;
 *   const variantClass = `${TOP_CLASS}-badge-${variant}`;
 *   const sizeClass = size && size !== "default" ? `${TOP_CLASS}-input-${size}` : undefined;
 *   const disabledClass = disabled ? `${TOP_CLASS}-number-input-disabled` : undefined;
 *
 * @param {string} frontmatter
 * @param {Record<string, string>} renamedProps - renamed props map
 * @returns {Record<string, { raw: string, resolved: string }>}
 */
function parseVariables(frontmatter, renamedProps = {}) {
  const vars = {};

  const lines = frontmatter.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // 跳過 import、interface、Astro.props destructuring、helper function
    if (
      line.startsWith('import ') ||
      line.startsWith('interface ') ||
      line.includes('Astro.props') ||
      line.startsWith('//') ||
      line === '' ||
      line === '{' ||
      line === '}' ||
      /^\[key:/.test(line)
    ) continue;

    // 匹配 const varName = expression
    const match = line.match(/^const\s+(\w+)\s*=\s*(.+?);\s*$/);
    if (match) {
      const [, name, expr] = match;
      // 跳過 helper function 宣告
      if (expr.includes('=>')) {
        // 但保存 helper functions 以供內聯
        continue;
      }
      vars[name] = {
        raw: expr,
        resolved: resolveExpression(expr),
      };
    }
  }

  return vars;
}

/**
 * 解析 helper functions（如 getVariantClass, getSizeClass）
 * @param {string} frontmatter
 * @returns {Record<string, { param: string, body: string }>}
 */
function parseHelpers(frontmatter) {
  const helpers = {};

  // 匹配單行或多行 arrow function: const getName = (p: type) =>\n?    expr;
  const pattern = /const\s+(\w+)\s*=\s*\((\w+)(?::\s*\w+)?\)\s*=>\s*\n?\s*(.+?);\s*$/gm;
  let m;
  while ((m = pattern.exec(frontmatter)) !== null) {
    const [, name, param, body] = m;
    helpers[name] = { param, body: body.trim() };
  }

  return helpers;
}

/**
 * 將 helper function 的形參替換為實際參數
 * @param {string} body - helper body 表達式
 * @param {string} param - 形參名
 * @param {string} arg - 實際參數名
 * @returns {string}
 */
function substituteHelperParam(body, param, arg) {
  return body.replace(new RegExp(`\\b${param}\\b`, 'g'), arg);
}

/**
 * 展開 helper function 呼叫，回傳解析後的表達式
 * @param {string} expr - 如 `getVariantClass(variant)`
 * @param {Record<string, { param: string, body: string }>} helpers
 * @param {Record<string, string>} renamedProps
 * @returns {string|null}
 */
function inlineHelper(expr, helpers, renamedProps) {
  const callMatch = expr.match(/^(\w+)\((\w+)\)$/);
  if (!callMatch) return null;

  const [, funcName, arg] = callMatch;
  const helper = helpers[funcName];
  if (!helper) return null;

  const resolved = substituteHelperParam(helper.body, helper.param, arg);
  return resolveExpression(resolved);
}

/**
 * 將 JS 表達式中的 TOP_CLASS 解析為 "cu"
 * @param {string} expr
 * @param {Record<string, string>} renamedProps
 * @returns {string}
 */
function resolveExpression(expr) {
  // 替換 TOP_CLASS
  let result = expr
    .replace(/\$\{TOP_CLASS\}/g, TOP_CLASS)
    .replace(/TOP_CLASS/g, `"${TOP_CLASS}"`);

  // 解析 template literal 為字串（如果全是靜態）
  const staticTemplate = result.match(/^`([^$`]+)`$/);
  if (staticTemplate) {
    result = `"${staticTemplate[1]}"`;
  }

  return result;
}

/**
 * 完整解析一個 Astro 元件
 * @param {string} source - Astro 原始碼
 * @returns {ParsedComponent}
 */
function parseComponent(source) {
  const { frontmatter, template } = splitComponent(source);
  const { props, renamedProps } = parseProps(frontmatter);
  const variables = parseVariables(frontmatter, renamedProps);
  const helpers = parseHelpers(frontmatter);

  // 解析使用了 helper 的變數
  for (const [name, info] of Object.entries(variables)) {
    const inlined = inlineHelper(info.raw, helpers, renamedProps);
    if (inlined) {
      variables[name].resolved = inlined;
    }
  }

  // 第二遍：解析變數互相引用（如 validationClass 引用 baseClass）
  for (const [name, info] of Object.entries(variables)) {
    let resolved = info.raw;
    // 將 ${otherVar} 替換為該變數的靜態值
    for (const [otherName, otherInfo] of Object.entries(variables)) {
      if (otherName === name) continue;
      // 從 resolved 中提取靜態值（去掉引號）
      const staticVal = otherInfo.resolved.match(/^"([^"]+)"$/);
      if (staticVal) {
        resolved = resolved.replace(
          new RegExp(`\\$\\{${otherName}\\}`, 'g'),
          staticVal[1]
        );
      }
    }
    if (resolved !== info.raw) {
      variables[name].raw = resolved;
      variables[name].resolved = resolveExpression(resolved);
    }
  }

  return {
    frontmatter,
    template,
    props,
    renamedProps,
    variables,
    helpers,
  };
}

module.exports = {
  TOP_CLASS,
  toPhpDefault,
  substituteHelperParam,
  parseComponent,
};
