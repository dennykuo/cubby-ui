/**
 * Template Transformers
 *
 * 將 Astro template HTML 轉換為 Laravel Blade 語法。
 * 按順序執行多個轉換 pass。
 */

const { TOP_CLASS, substituteHelperParam } = require('./parser.cjs');
const { resolveClassItem, buildBladeClassString, propToPhp, templateLiteralToPhp } = require('./class-resolver.cjs');

/** HTML boolean 屬性（attr={attr} 時輸出為條件存在） */
const BOOLEAN_ATTRS = new Set([
  'disabled', 'hidden', 'readonly', 'required', 'checked',
  'multiple', 'selected', 'autofocus', 'autoplay', 'controls',
  'loop', 'muted', 'open', 'novalidate', 'inert',
]);

/**
 * 主轉換函式：將整個 Astro template 轉為 Blade
 *
 * @param {string} template - Astro template HTML
 * @param {import('./parser').ParsedComponent} parsed - 解析後的元件資料
 * @returns {string} Blade template
 */
function transformTemplate(template, parsed) {
  let result = template;

  // Pass 1: 處理條件元素渲染 {href ? <a>...</a> : <button>...</button>}
  result = transformConditionalElements(result, parsed);

  // Pass 2: 處理 class:list + {...rest} (root 元素)
  result = transformClassListWithSpread(result, parsed);

  // Pass 3: 處理剩餘的 class:list（無 {...rest} 的情況）
  result = transformClassListOnly(result, parsed);

  // Pass 4: 處理 class={expr}（內部元素的靜態 class）
  result = transformClassExpr(result, parsed);

  // Pass 5: 處理 <slot /> 和 <slot name="x" />
  result = transformSlots(result);

  // Pass 6: 處理 {condition && (<markup>)} 條件渲染
  result = transformConditionalBlocks(result, parsed);

  // Pass 7: 處理屬性表達式 attr={expr}
  result = transformAttributeExpressions(result, parsed);

  // Pass 8: 處理 {...rest} 在非 root 元素上
  result = transformInnerSpread(result);

  // Pass 9: 處理文字插值 {varName}
  result = transformTextInterpolation(result, parsed);

  // Pass 10: 清理
  result = cleanup(result);

  return result;
}

/**
 * Pass 1: 條件元素渲染
 * {href ? (<a ...>...</a>) : (<button ...>...</button>)}
 */
function transformConditionalElements(template, parsed) {
  // 匹配 {prop ? (\n<tag1>...\n) : (\n<tag2>...\n)}
  const pattern = /\{(\w+)\s*\?\s*\(\s*\n?([\s\S]*?)\)\s*:\s*\(\s*\n?([\s\S]*?)\)\s*\}/g;

  return template.replace(pattern, (match, prop, trueBlock, falseBlock) => {
    const phpProp = propToPhp(prop, parsed.renamedProps);
    const trimTrue = trueBlock.trim();
    const trimFalse = falseBlock.trim();
    return `@if(${phpProp})\n${trimTrue}\n@else\n${trimFalse}\n@endif`;
  });
}

/**
 * Pass 2: class:list={[...]} + {...rest} → {{ $attributes->class([...]) }}
 *
 * 處理根元素上同時有 class:list 和 {...rest} 的情況
 */
function transformClassListWithSpread(template, parsed) {
  // 匹配 class:list={[...]} {...rest}（可能跨多行）
  const pattern = /class:list=\{(\[[\s\S]*?\])\}\s*\{\.\.\.rest\}/g;

  return template.replace(pattern, (match, classListContent) => {
    const items = parseClassListArray(classListContent, parsed);
    return buildBladeClassString(items, true);
  });
}

/**
 * Pass 3: 處理剩餘的 class:list（不帶 {...rest}）
 */
function transformClassListOnly(template, parsed) {
  const pattern = /class:list=\{(\[[\s\S]*?\])\}/g;

  return template.replace(pattern, (match, classListContent) => {
    const items = parseClassListArray(classListContent, parsed);
    return buildBladeClassString(items, false);
  });
}

/**
 * 解析 class:list 陣列字串為結構化項目
 */
function parseClassListArray(arrayStr, parsed) {
  // 移除外層 []
  let inner = arrayStr.trim();
  if (inner.startsWith('[')) inner = inner.slice(1);
  if (inner.endsWith(']')) inner = inner.slice(0, -1);

  // 智慧拆分（考慮嵌套 template literal 和 ternary）
  const rawItems = smartSplit(inner);
  const items = [];

  for (const raw of rawItems) {
    const trimmed = raw.trim();
    if (!trimmed) continue;

    const resolved = resolveClassItem(
      trimmed,
      parsed.variables,
      parsed.renamedProps,
      parsed.helpers
    );

    if (resolved) {
      items.push(resolved);
    }
  }

  return items;
}

/**
 * 智慧分割 class:list 陣列內容（處理嵌套反引號和 ternary）
 */
function smartSplit(str) {
  const items = [];
  let depth = 0;  // 追蹤 template literal
  let ternaryDepth = 0;
  let current = '';

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];

    if (ch === '`') {
      depth = depth === 0 ? 1 : 0;
      current += ch;
    } else if (ch === '?' && depth === 0) {
      ternaryDepth++;
      current += ch;
    } else if (ch === ':' && ternaryDepth > 0 && depth === 0) {
      ternaryDepth--;
      current += ch;
    } else if (ch === ',' && depth === 0 && ternaryDepth === 0) {
      items.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }

  if (current.trim()) {
    items.push(current.trim());
  }

  return items;
}

/**
 * Pass 4: class={expr} → class="resolved"
 * 處理內部元素的 class 屬性（非 class:list）
 */
function transformClassExpr(template, parsed) {
  // class={`cu-xxx`} — 靜態 template literal
  let result = template.replace(
    /class=\{`([^`]+)`\}/g,
    (match, content) => {
      const resolved = content.replace(/\$\{TOP_CLASS\}/g, TOP_CLASS);
      if (resolved.includes('${')) {
        // 有動態部分
        return `class="{{ ${templateLiteralToPhp(resolved, parsed.renamedProps)} }}"`;
      }
      return `class="${resolved}"`;
    }
  );

  // class={funcCall(arg)} — helper function 呼叫
  result = result.replace(
    /class=\{(\w+)\((\w+)\)\}/g,
    (match, funcName, arg) => {
      if (parsed.helpers[funcName]) {
        return resolveHelperClassAttr(funcName, arg, parsed);
      }
      return `class="{{ ${propToPhp(arg, parsed.renamedProps)} }}"`;
    }
  );

  // class={varName} — 變數引用
  result = result.replace(
    /class=\{(\w+)\}/g,
    (match, varName) => {
      const v = parsed.variables[varName];
      if (v) {
        // 解析靜態值
        const staticMatch = v.raw.match(/^`([^$`]+)`$/) || v.raw.match(/^["']([^"']+)["']$/);
        if (staticMatch) {
          return `class="${staticMatch[1].replace(/\$\{TOP_CLASS\}/g, TOP_CLASS)}"`;
        }
        // 如果是 helper 呼叫結果（如 Toggle 的 getSizeClass）
        const callMatch = v.raw.match(/^(\w+)\((\w+)\)$/);
        if (callMatch && parsed.helpers[callMatch[1]]) {
          return resolveHelperClassAttr(callMatch[1], callMatch[2], parsed);
        }
      }
      return `class="{{ ${propToPhp(varName, parsed.renamedProps)} }}"`;
    }
  );

  return result;
}

/**
 * 處理 helper function 在 class= 上的使用（如 Toggle 的 getSizeClass）
 */
function resolveHelperClassAttr(funcName, arg, parsed) {
  const helper = parsed.helpers[funcName];
  if (!helper) return `class="{{ $${arg} }}"`;

  const body = substituteHelperParam(helper.body, helper.param, arg);

  // 解析 ternary: s === "default" ? `cu-toggle` : `cu-toggle cu-toggle-${s}`
  const ternary = body.match(
    /^(\w+)\s*===?\s*["'](\w+)["']\s*\?\s*`([^`]+)`\s*:\s*`([^`]+)`$/
  );
  if (ternary) {
    const [, prop, val, trueExpr, falseExpr] = ternary;
    const phpProp = propToPhp(prop, parsed.renamedProps);
    const trueResolved = trueExpr.replace(/\$\{TOP_CLASS\}/g, TOP_CLASS).replace(/\$\{\w+\}/g, '');
    const falseResolved = falseExpr.replace(/\$\{TOP_CLASS\}/g, TOP_CLASS);
    // 轉為 PHP ternary
    if (falseResolved.includes('${')) {
      const phpFalse = templateLiteralToPhp(
        falseExpr.replace(/\$\{TOP_CLASS\}/g, TOP_CLASS),
        parsed.renamedProps
      );
      return `class="{{ ${phpProp} === '${val}' ? '${trueResolved}' : ${phpFalse} }}"`;
    }
    return `class="{{ ${phpProp} === '${val}' ? '${trueResolved}' : '${falseResolved}' }}"`;
  }

  return `class="{{ $${arg} }}"`;
}

/**
 * Pass 5: 轉換 slot
 */
function transformSlots(template) {
  // <slot name="xxx" /> → {{ $xxx ?? '' }}
  let result = template.replace(
    /<slot\s+name=["'](\w+)["']\s*\/?>/g,
    '{{ $$$1 ?? \'\' }}'
  );

  // <slot /> → {{ $slot }}
  result = result.replace(/<slot\s*\/?>/g, '{{ $slot }}');

  return result;
}

/**
 * Pass 6: 條件渲染 {condition && (<markup>)}
 */
function transformConditionalBlocks(template, parsed) {
  // 匹配 {prop && (\n<markup>\n)}
  const multiLine = /\{(\w+)\s*&&\s*\(\s*\n([\s\S]*?)\s*\)\}/g;
  let result = template.replace(multiLine, (match, prop, markup) => {
    const phpProp = propToPhp(prop, parsed.renamedProps);
    return `@if(${phpProp})\n${markup.trim()}\n@endif`;
  });

  // 單行版本：{prop && (<markup />)}
  const singleLine = /\{(\w+)\s*&&\s*\(\s*(<[^)]+>)\s*\)\}/g;
  result = result.replace(singleLine, (match, prop, markup) => {
    const phpProp = propToPhp(prop, parsed.renamedProps);
    return `@if(${phpProp})\n${markup.trim()}\n@endif`;
  });

  return result;
}

/**
 * Pass 7: 屬性表達式 attr={expr}
 */
function transformAttributeExpressions(template, parsed) {
  let result = template;

  // aria-label={`${value} out of ${max} stars`} → aria-label="{{ $value }} out of {{ $max }} stars"
  result = result.replace(
    /(\w[\w-]*)=\{`([^`]+)`\}/g,
    (match, attr, content) => {
      const resolved = content
        .replace(/\$\{TOP_CLASS\}/g, TOP_CLASS)
        .replace(/\$\{(\w+)\}/g, (m, name) => `{{ ${propToPhp(name, parsed.renamedProps)} }}`);
      return `${attr}="${resolved}"`;
    }
  );

  // attr={varName} → attr="{{ $varName }}" (非 boolean 屬性)
  result = result.replace(
    /(\w[\w-]*)=\{(\w+)\}/g,
    (match, attr, value) => {
      // boolean 值的 HTML 屬性（disabled, hidden 等）
      if (attr === value && BOOLEAN_ATTRS.has(attr)) {
        return `{{ ${propToPhp(value, parsed.renamedProps)} ? '${attr}' : '' }}`;
      }

      // data-cu-xxx={type} 等
      const phpVar = propToPhp(value, parsed.renamedProps);
      return `${attr}="{{ ${phpVar} }}"`;
    }
  );

  // attr={condition ? "value" : undefined} → @if($condition) attr="value" @endif
  result = result.replace(
    /(\w[\w-]*)=\{(\w+)\s*\?\s*["']([^"']+)["']\s*:\s*undefined\}/g,
    (match, attr, cond, value) => {
      const phpCond = propToPhp(cond, parsed.renamedProps);
      return `@if(${phpCond}) ${attr}="${value}" @endif`;
    }
  );

  // attr={prop || undefined} → @if($prop) attr="true" @endif
  result = result.replace(
    /(\w[\w-]*)=\{(\w+)\s*\|\|\s*undefined\}/g,
    (match, attr, cond) => {
      const phpCond = propToPhp(cond, parsed.renamedProps);
      return `@if(${phpCond}) ${attr}="true" @endif`;
    }
  );

  // attr={prop || "fallback"} → attr="{{ $prop ?: 'fallback' }}"
  // 用 ?: （Elvis）對應 JS falsy 短路語意，而非 ??（只 catch null）
  result = result.replace(
    /(\w[\w-]*)=\{(\w+)\s*\|\|\s*["']([^"']*)["']\}/g,
    (match, attr, prop, fallback) => {
      const phpProp = propToPhp(prop, parsed.renamedProps);
      return `${attr}="{{ ${phpProp} ?: '${fallback}' }}"`;
    }
  );

  return result;
}

/**
 * Pass 8: 處理內部元素上的 {...rest}
 * 如果 root 元素已處理 $attributes->class()，內部的 {...rest} 用 {{ $attributes->except('class') }}
 */
function transformInnerSpread(template) {
  // 如果已有 $attributes->class（代表 root 已處理），剩餘的 {...rest} 用 except
  if (template.includes('$attributes->class(')) {
    return template.replace(/\{\.\.\.rest\}/g, "{{ $attributes->except('class') }}");
  }
  // 否則直接用 $attributes
  return template.replace(/\{\.\.\.rest\}/g, '{{ $attributes }}');
}

/**
 * Pass 9: 文字插值 {varName} → {{ $varName }}
 * 只處理在 HTML 內容位置的插值（不在屬性中）
 */
function transformTextInterpolation(template, parsed) {
  // 匹配 >{text}< 中間的 {prop}
  return template.replace(
    />(\s*)\{(\w+)\}(\s*)</g,
    (match, before, name, after) => {
      // 跳過已轉換的
      if (name === 'slot') return match;
      const phpVar = propToPhp(name, parsed.renamedProps);
      return `>${before}{{ ${phpVar} }}${after}<`;
    }
  );
}

/**
 * Pass 10: 清理殘留
 */
function cleanup(template) {
  let result = template;

  // 移除空的 class 合併
  result = result.replace(/\s*class=""\s*/g, ' ');

  // 修正 >  {{ $slot }}\n</tag> → >\n    {{ $slot }}\n</tag>
  result = result.replace(/>(\s+)\{\{ \$slot \}\}\s*\n/g, '>\n    {{ $slot }}\n');

  // 修正 $attributes->class 後面的多餘空格 ]) }}>  text → ]) }}>
  result = result.replace(/\]\) \}\}>(\s+)/g, ']) }}>\n');

  // 修正多行 $attributes->class 的縮排（壓縮的空格問題）
  result = result.replace(
    /\$attributes->class\(\[\s{2,}/g,
    '$attributes->class(['
  );
  // 清除 class 項之間的多餘空格
  result = result.replace(/,\s{2,}'/g, ", '");
  result = result.replace(/,\s{2,}\$/g, ', $');

  // 確保 @if/@endif 前後有合理的換行
  result = result.replace(/@endif\s*@if/g, '@endif\n@if');

  // 移除尾部多餘空行
  result = result.replace(/\n{3,}/g, '\n\n');

  return result.trim() + '\n';
}

module.exports = {
  transformTemplate,
};
