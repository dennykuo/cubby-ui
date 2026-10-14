/**
 * Template Transformers
 *
 * 將 Astro template HTML 轉換為 Laravel Blade 語法。
 * 按順序執行多個轉換 pass。
 */

const { TOP_CLASS, substituteHelperParam, createIdentResolver } = require("./parser.cjs");
const {
  resolveClassItem,
  buildBladeClassString,
  propToPhp,
  staticVariable,
  templateLiteralToPhp,
} = require("./class-resolver.cjs");
const { jsToPhp } = require("./js-expr.cjs");

/** HTML boolean 屬性（attr={attr} 時輸出為條件存在） */
const BOOLEAN_ATTRS = new Set([
  "disabled",
  "hidden",
  "readonly",
  "required",
  "checked",
  "multiple",
  "selected",
  "autofocus",
  "autoplay",
  "controls",
  "loop",
  "muted",
  "open",
  "novalidate",
  "inert",
]);

/**
 * 將 JS 表達式轉為 PHP（識別字依 prop / frontmatter const 解析）
 * @param {string} expr
 * @param {import('./parser').ParsedComponent} parsed
 * @returns {string}
 */
function exprToPhp(expr, parsed) {
  try {
    return jsToPhp(expr, createIdentResolver(parsed)).code;
  } catch (err) {
    throw new Error(`無法轉換表達式 {${expr.trim()}}：${err.message}（可改用 scripts/blade/overrides/）`);
  }
}

/**
 * 主轉換函式：將整個 Astro template 轉為 Blade
 *
 * @param {string} template - Astro template HTML
 * @param {import('./parser').ParsedComponent} parsed - 解析後的元件資料
 * @param {{ componentTag?: (componentName: string) => string }} [options]
 *   componentTag: 將引入的 Astro 元件檔名（如 Calendar）轉為 Blade 元件 tag（如 x-cu.calendar）
 * @returns {string} Blade template
 */
function transformTemplate(template, parsed, options = {}) {
  let result = template;

  // Pass 0: 引入的 Astro 元件 <Calendar min={min} /> → <x-cu.calendar :min="$min" />
  result = transformComponentTags(result, parsed, options.componentTag);

  // Pass 1: 處理條件元素渲染 {href ? <a>...</a> : <button>...</button>}
  result = transformConditionalElements(result, parsed);

  // 判斷使用者 class 與 {...rest} 各落在哪個標籤（供 Pass 2 / 3 決定 class 合併位置）
  const routing = analyzeClassRouting(result, parsed);

  // Pass 2: 處理同一個開頭標籤上的 class:list + {...rest}（中間可夾其他屬性）
  result = transformClassListWithSpread(result, parsed, routing);

  // Pass 3: 處理剩餘的 class:list（無 {...rest} 的情況）
  result = transformClassListOnly(result, parsed, routing);

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

  // Pass 9b: 動態 tag <Tag> → <{{ $Tag }}>（Tag 為 frontmatter const）
  // 須在 class / spread 處理之後：Pass 2 以 <[A-Za-z] 辨識開頭標籤，提早轉換會讓 class:list 與 {...rest} 無法合併
  result = transformDynamicTags(result, parsed);

  // Pass 10: 清理
  result = cleanup(result);

  return result;
}

/**
 * Pass 9b: 動態 tag
 * const Tag = type === "decimal" ? "ol" : "ul";  <Tag ...>...</Tag>
 *   → <{{ $Tag }} ...>...</{{ $Tag }}>（$Tag 由 @php 區塊宣告）
 */
function transformDynamicTags(template, parsed) {
  let result = template;
  for (const name of Object.keys(parsed.variables)) {
    if (!/^[A-Z]/.test(name) || parsed.componentImports[name]) continue;
    result = result
      .replace(new RegExp(`<${name}(?=[\\s>/])`, "g"), `<{{ $${name} }}`)
      .replace(new RegExp(`</${name}>`, "g"), `</{{ $${name} }}>`);
  }
  return result;
}

/**
 * Pass 0: 引入的 Astro 元件 → Blade 元件 tag
 * <Calendar min={min} max={max} /> → <x-cu.calendar :min="$min" :max="$max" />
 */
function transformComponentTags(template, parsed, componentTag) {
  let result = template;
  for (const [localName, componentName] of Object.entries(parsed.componentImports)) {
    if (!componentTag) {
      throw new Error(`template 引用了元件 <${localName}>，但未提供 componentTag 對應`);
    }
    const tag = componentTag(componentName);

    result = result.replace(new RegExp(`<${localName}\\b([^>]*?)(\\/?)>`, "g"), (match, attrs, selfClose) => {
      const bladeAttrs = attrs.replace(
        /([\w-]+)=\{([^{}]+)\}/g,
        (m, attr, expr) => `:${toKebabAttr(attr)}="${exprToPhp(expr, parsed)}"`,
      );
      return `<${tag}${bladeAttrs}${selfClose}>`;
    });
    result = result.replace(new RegExp(`</${localName}>`, "g"), `</${tag}>`);
  }
  return result;
}

/** camelCase prop 名 → Blade 元件屬性的 kebab-case */
function toKebabAttr(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

/**
 * Pass 1: 條件元素渲染
 * {href ? (<a ...>...</a>) : (<button ...>...</button>)}
 * {direction === "up" ? (<svg>...</svg>) : (<svg>...</svg>)}
 */
function transformConditionalElements(template, parsed) {
  // 匹配 {cond ? (\n<tag1>...\n) : (\n<tag2>...\n)}；cond 可為 prop 或簡單比較表達式
  const pattern = /\{([^{}()<>?]+?)\s*\?\s*\(\s*\n?([\s\S]*?)\)\s*:\s*\(\s*\n?([\s\S]*?)\)\s*\}/g;

  return template.replace(pattern, (match, cond, trueBlock, falseBlock) => {
    const phpCond = exprToPhp(cond, parsed);
    const trimTrue = trueBlock.trim();
    const trimFalse = falseBlock.trim();
    return `@if(${phpCond})\n${trimTrue}\n@else\n${trimFalse}\n@endif`;
  });
}

const CLASS_LIST_PATTERN = /class:list=\{(\[[\s\S]*?\])\}/;
const REST_SPREAD = "{...rest}";

/**
 * 找出開頭標籤結尾 `>` 的位置。略過屬性值引號與 JSX `{...}` 表達式內的字元，
 * 避免把 `=>`、比較運算子裡的 `>` 誤判為標籤結尾。
 *
 * @param {string} template
 * @param {number} start - 標籤 `<` 的位置
 * @returns {number} `>` 的位置；找不到時回傳 -1
 */
function findOpeningTagEnd(template, start) {
  let depth = 0;
  let quote = null;

  for (let i = start + 1; i < template.length; i++) {
    const ch = template[i];
    if (quote) {
      if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'" || (ch === "`" && depth > 0)) {
      quote = ch;
    } else if (ch === "{") {
      depth++;
    } else if (ch === "}") {
      depth--;
    } else if (ch === ">" && depth === 0) {
      return i;
    }
  }

  return -1;
}

/**
 * 逐一處理 template 中的開頭標籤；fn 回傳不同字串時即替換該標籤
 *
 * @param {string} template
 * @param {(tag: string) => string} fn
 * @returns {string}
 */
function mapOpeningTags(template, fn) {
  const tagStart = /<[A-Za-z]/g;
  let out = "";
  let last = 0;
  let m;

  while ((m = tagStart.exec(template)) !== null) {
    const end = findOpeningTagEnd(template, m.index);
    if (end === -1) continue;

    const tag = template.slice(m.index, end + 1);
    const next = fn(tag);
    if (next !== tag) {
      out += template.slice(last, m.index) + next;
      last = end + 1;
    }
    tagStart.lastIndex = end + 1;
  }

  return out + template.slice(last);
}

/**
 * class:list 陣列是否含使用者傳入的 class（`class: className` 解構出的變數）
 */
function classListHasUserClass(arrayStr, parsed) {
  const userClass = parsed.renamedProps.class || "className";
  const inner = arrayStr.trim().replace(/^\[/, "").replace(/\]$/, "");
  return smartSplit(inner).some((item) => item.trim() === userClass);
}

/**
 * 分析使用者 class 與 {...rest} 的落點
 *
 * - userClassOwned：某個標籤的 class:list 收下使用者 class（Astro 的 className）
 * - restOnClassedTag：{...rest} 落在「自己已有 class，但不收使用者 class」的標籤上
 *   （如 Select：wrapper 收 className、內層 <select class="cu-select" {...rest}>）。
 *   此時 {{ $attributes }} 會讓使用者 class 變成第二個 class 屬性，
 *   需改由收 className 的標籤 merge，{...rest} 則排除 class。
 *
 * @returns {{ userClassOwned: boolean, restOnClassedTag: boolean }}
 */
function analyzeClassRouting(template, parsed) {
  const routing = { userClassOwned: false, restOnClassedTag: false };

  mapOpeningTags(template, (tag) => {
    const classList = tag.match(CLASS_LIST_PATTERN);
    const hasUserClass = !!classList && classListHasUserClass(classList[1], parsed);
    const hasOwnClass = !!classList || /\sclass=/.test(tag);

    if (hasUserClass) routing.userClassOwned = true;
    if (tag.includes(REST_SPREAD) && hasOwnClass && !hasUserClass) routing.restOnClassedTag = true;
    return tag;
  });

  return routing;
}

/**
 * Pass 2: 同一個開頭標籤上的 class:list={[...]} + {...rest} → {{ $attributes->class([...]) }}
 *
 * 兩者之間可夾其他屬性（如 `<div class:list={[...]} data-cu-dropdown {...rest}>`）。
 * 合併後的 class 輸出在原 {...rest} 的位置並移除 class:list，
 * 使用者其他屬性的相對順序與 Astro 輸出一致，且不會再多出第二個 class 屬性。
 */
function transformClassListWithSpread(template, parsed, routing) {
  return mapOpeningTags(template, (tag) => {
    const classList = tag.match(CLASS_LIST_PATTERN);
    if (!classList || !tag.includes(REST_SPREAD)) return tag;

    // 使用者 class 由其他標籤收下時，此標籤留給 Pass 3（@class）+ Pass 8（except('class')）
    if (routing.userClassOwned && !classListHasUserClass(classList[1], parsed)) return tag;

    const merged = buildBladeClassString(parseClassListArray(classList[1], parsed), true);
    return tag.replace(/\s*class:list=\{\[[\s\S]*?\]\}/, "").replace(REST_SPREAD, () => merged);
  });
}

/**
 * Pass 3: 處理剩餘的 class:list（不帶 {...rest}）
 *
 * 收 className 的標籤若因 restOnClassedTag 需要承接使用者 class，
 * 輸出 {{ $attributes->only('class')->class([...]) }}（只合併 class，其餘屬性留給 {...rest}）。
 */
function transformClassListOnly(template, parsed, routing) {
  const pattern = new RegExp(CLASS_LIST_PATTERN.source, "g");

  return template.replace(pattern, (match, classListContent) => {
    const items = parseClassListArray(classListContent, parsed);
    if (routing.restOnClassedTag && classListHasUserClass(classListContent, parsed)) {
      return buildBladeClassString(items, true, "$attributes->only('class')");
    }
    return buildBladeClassString(items, false);
  });
}

/**
 * 解析 class:list 陣列字串為結構化項目
 */
function parseClassListArray(arrayStr, parsed) {
  // 移除外層 []
  let inner = arrayStr.trim();
  if (inner.startsWith("[")) inner = inner.slice(1);
  if (inner.endsWith("]")) inner = inner.slice(0, -1);

  // 智慧拆分（考慮嵌套 template literal 和 ternary）
  const rawItems = smartSplit(inner);
  const items = [];

  for (const raw of rawItems) {
    const trimmed = raw.trim();
    if (!trimmed) continue;

    const resolved = resolveClassItem(trimmed, parsed.variables, parsed.renamedProps, parsed.helpers);

    if (Array.isArray(resolved)) {
      items.push(...resolved);
    } else if (resolved) {
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
  let depth = 0; // 追蹤 template literal
  let bracketDepth = 0; // 追蹤 {} [] ()（object 語法、函式呼叫內的逗號不拆分）
  let ternaryDepth = 0;
  let current = "";

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];

    if (ch === "`") {
      depth = depth === 0 ? 1 : 0;
      current += ch;
    } else if (depth === 0 && "{[(".includes(ch)) {
      bracketDepth++;
      current += ch;
    } else if (depth === 0 && "}])".includes(ch)) {
      bracketDepth--;
      current += ch;
    } else if (bracketDepth > 0) {
      current += ch;
    } else if (ch === "?" && depth === 0) {
      ternaryDepth++;
      current += ch;
    } else if (ch === ":" && ternaryDepth > 0 && depth === 0) {
      ternaryDepth--;
      current += ch;
    } else if (ch === "," && depth === 0 && ternaryDepth === 0) {
      items.push(current.trim());
      current = "";
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
  let result = template.replace(/class=\{`([^`]+)`\}/g, (match, content) => {
    const resolved = content
      .replace(/\$\{TOP_CLASS\}/g, TOP_CLASS)
      .replace(/\$\{(\w+)\}/g, (m, name) => staticVariable(parsed.variables, name) ?? m);
    if (resolved.includes("${")) {
      // 有動態部分
      return `class="{{ ${templateLiteralToPhp(resolved, parsed.renamedProps)} }}"`;
    }
    return `class="${resolved}"`;
  });

  // class={funcCall(arg)} — helper function 呼叫
  result = result.replace(/class=\{(\w+)\((\w+)\)\}/g, (match, funcName, arg) => {
    if (parsed.helpers[funcName]) {
      return resolveHelperClassAttr(funcName, arg, parsed);
    }
    return `class="{{ ${propToPhp(arg, parsed.renamedProps)} }}"`;
  });

  // class={varName} — 變數引用
  result = result.replace(/class=\{(\w+)\}/g, (match, varName) => {
    const v = parsed.variables[varName];
    if (v) {
      // 解析靜態值（含 `${TOP_CLASS}-xxx` 這類可靜態求值的 const）
      const staticValue = staticVariable(parsed.variables, varName);
      if (staticValue !== undefined) {
        return `class="${staticValue}"`;
      }
      // 如果是 helper 呼叫結果（如 Toggle 的 getSizeClass）
      const callMatch = v.raw.match(/^(\w+)\((\w+)\)$/);
      if (callMatch && parsed.helpers[callMatch[1]]) {
        return resolveHelperClassAttr(callMatch[1], callMatch[2], parsed);
      }
    }
    return `class="{{ ${propToPhp(varName, parsed.renamedProps)} }}"`;
  });

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
  const ternary = body.match(/^(\w+)\s*===?\s*["'](\w+)["']\s*\?\s*`([^`]+)`\s*:\s*`([^`]+)`$/);
  if (ternary) {
    const [, prop, val, trueExpr, falseExpr] = ternary;
    const phpProp = propToPhp(prop, parsed.renamedProps);
    const trueResolved = trueExpr.replace(/\$\{TOP_CLASS\}/g, TOP_CLASS).replace(/\$\{\w+\}/g, "");
    const falseResolved = falseExpr.replace(/\$\{TOP_CLASS\}/g, TOP_CLASS);
    // 轉為 PHP ternary
    if (falseResolved.includes("${")) {
      const phpFalse = templateLiteralToPhp(falseExpr.replace(/\$\{TOP_CLASS\}/g, TOP_CLASS), parsed.renamedProps);
      return `class="{{ ${phpProp} === '${val}' ? '${trueResolved}' : ${phpFalse} }}"`;
    }
    return `class="{{ ${phpProp} === '${val}' ? '${trueResolved}' : '${falseResolved}' }}"`;
  }

  return `class="{{ $${arg} }}"`;
}

/**
 * Pass 5: 轉換 slot
 *
 * 處理順序很關鍵：必須先處理「帶 fallback 內容」的版本，
 * 因為 `<slot>` 開頭標籤會被自閉合 regex `/<slot\s*\/?>/` 誤匹配，
 * 造成 fallback 內容與 `</slot>` 結尾被遺留。
 */
function transformSlots(template) {
  let result = template;

  // <slot name="xxx">fallback</slot> — named slot with fallback content
  result = result.replace(
    /<slot\s+name=["'](\w+)["']\s*>([\s\S]*?)<\/slot>/g,
    (_m, name, fallback) =>
      `@if(! isset($${name}) || $${name}->isEmpty())\n${fallback.trim()}\n@else\n{{ $${name} }}\n@endif`,
  );

  // <slot name="xxx" /> — self-closing named slot
  result = result.replace(/<slot\s+name=["'](\w+)["']\s*\/?>/g, "{{ $$$1 ?? '' }}");

  // <slot>fallback</slot> — default slot with fallback content
  result = result.replace(
    /<slot\s*>([\s\S]*?)<\/slot>/g,
    (_m, fallback) => `@if($slot->isEmpty())\n${fallback.trim()}\n@else\n{{ $slot }}\n@endif`,
  );

  // <slot /> or bare <slot> — default slot
  result = result.replace(/<slot\s*\/?>/g, "{{ $slot }}");

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

  // 無括號版本（獨佔一行）：{cond && <tag ...>...</tag>} / {cond && <tag ... />}
  const bare = /^([ \t]*)\{([^{}()<>]+?)\s*&&\s*(<([\w-]+)\b[\s\S]*?<\/\4>|<[\w-]+\b[^>]*\/>)\s*\}[ \t]*$/gm;
  result = result.replace(bare, (match, indent, cond, markup) => {
    const phpCond = exprToPhp(cond, parsed);
    return `${indent}@if(${phpCond})\n${indent}    ${markup.trim()}\n${indent}@endif`;
  });

  return result;
}

/**
 * Pass 7: 屬性表達式 attr={expr}
 */
function transformAttributeExpressions(template, parsed) {
  let result = template;

  // aria-label={`${value} out of ${max} stars`} → aria-label="{{ $value }} out of {{ $max }} stars"
  result = result.replace(/(\w[\w-]*)=\{`([^`]+)`\}/g, (match, attr, content) => {
    const resolved = content
      .replace(/\$\{TOP_CLASS\}/g, TOP_CLASS)
      .replace(
        /\$\{(\w+)\}/g,
        (m, name) => staticVariable(parsed.variables, name) ?? `{{ ${propToPhp(name, parsed.renamedProps)} }}`,
      );
    return `${attr}="${resolved}"`;
  });

  // attr={varName} → attr="{{ $varName }}" (非 boolean 屬性)
  result = result.replace(/(\w[\w-]*)=\{(\w+)\}/g, (match, attr, value) => {
    // boolean 值的 HTML 屬性（disabled, hidden 等）
    if (attr === value && BOOLEAN_ATTRS.has(attr)) {
      return `{{ ${propToPhp(value, parsed.renamedProps)} ? '${attr}' : '' }}`;
    }

    // data-cu-xxx={type} 等
    const phpVar = propToPhp(value, parsed.renamedProps);
    return `${attr}="{{ ${phpVar} }}"`;
  });

  // attr={condition ? "value" : undefined} → @if($condition) attr="value" @endif
  result = result.replace(
    /(\w[\w-]*)=\{(\w+)\s*\?\s*["']([^"']+)["']\s*:\s*undefined\}/g,
    (match, attr, cond, value) => {
      const phpCond = propToPhp(cond, parsed.renamedProps);
      return `@if(${phpCond}) ${attr}="${value}" @endif`;
    },
  );

  // attr={prop || undefined} → @if($prop) attr="true" @endif
  result = result.replace(/(\w[\w-]*)=\{(\w+)\s*\|\|\s*undefined\}/g, (match, attr, cond) => {
    const phpCond = propToPhp(cond, parsed.renamedProps);
    return `@if(${phpCond}) ${attr}="true" @endif`;
  });

  // attr={prop || "fallback"} → attr="{{ $prop ?: 'fallback' }}"
  // 用 ?: （Elvis）對應 JS falsy 短路語意，而非 ??（只 catch null）
  result = result.replace(/(\w[\w-]*)=\{(\w+)\s*\|\|\s*["']([^"']*)["']\}/g, (match, attr, prop, fallback) => {
    const phpProp = propToPhp(prop, parsed.renamedProps);
    return `${attr}="{{ ${phpProp} ?: '${fallback}' }}"`;
  });

  // 其餘表達式：aria-pressed={active ? "true" : "false"} → aria-pressed="{{ $active ? 'true' : 'false' }}"
  result = result.replace(
    /(\w[\w-]*)=\{(?!\.\.\.)([^{}]+)\}/g,
    (match, attr, expr) => `${attr}="{{ ${exprToPhp(expr, parsed)} }}"`,
  );

  return result;
}

/**
 * Pass 8: 處理內部元素上的 {...rest}
 * 如果使用者 class 已由某個標籤的 $attributes->class() 或 $attributes->only('class')->class() 輸出，
 * 剩餘的 {...rest} 用 {{ $attributes->except('class') }}
 */
function transformInnerSpread(template) {
  if (/\$attributes(?:->only\('class'\))?->class\(/.test(template)) {
    return template.replace(/\{\.\.\.rest\}/g, "{{ $attributes->except('class') }}");
  }
  // 否則直接用 $attributes
  return template.replace(/\{\.\.\.rest\}/g, "{{ $attributes }}");
}

/**
 * Pass 9: 文字插值 {varName} → {{ $varName }}
 * 只處理在 HTML 內容位置的插值（不在屬性中）
 */
function transformTextInterpolation(template, parsed) {
  // 匹配 >{text}< 中間的 {prop}
  let result = template.replace(/>(\s*)\{(\w+)\}(\s*)</g, (match, before, name, after) => {
    // 跳過已轉換的
    if (name === "slot") return match;
    const phpVar = propToPhp(name, parsed.renamedProps);
    return `>${before}{{ ${phpVar} }}${after}<`;
  });

  // {a || b || "fallback"} → {{ $a ?: $b ?: 'fallback' }}
  // 用 ?: （Elvis）對應 JS falsy 短路語意（與屬性的 {prop || "fallback"} 一致）；PHP 的 ?: 左結合，鏈式結果與 JS 相同
  const operand = String.raw`(?:\w+|"[^"\\]*"|'[^'\\]*')`;
  result = result.replace(
    new RegExp(String.raw`>(\s*)\{\s*(\w+(?:\s*\|\|\s*${operand})+)\s*\}(\s*)<`, "g"),
    (match, before, expr, after) => {
      const php = expr
        .split("||")
        .map((s) => s.trim())
        .map((s) => (/^\w+$/.test(s) ? propToPhp(s, parsed.renamedProps) : `'${s.slice(1, -1).replace(/'/g, "\\'")}'`))
        .join(" ?: ");
      return `>${before}{{ ${php} }}${after}<`;
    },
  );

  // 其餘表達式：>{direction === "up" ? "a" : "b"}< 等 → 交由 js-expr 轉為 PHP
  result = result.replace(
    />(\s*)\{(?![{.])([^{}<>]+)\}(\s*)</g,
    (match, before, expr, after) => `>${before}{{ ${exprToPhp(expr, parsed)} }}${after}<`,
  );

  return result;
}

/**
 * Pass 10: 清理殘留
 */
function cleanup(template) {
  let result = template;

  // 移除空的 class 合併
  result = result.replace(/\s*class=""\s*/g, " ");

  // 修正 >  {{ $slot }}\n</tag> → >\n    {{ $slot }}\n</tag>
  result = result.replace(/>(\s+)\{\{ \$slot \}\}\s*\n/g, ">\n    {{ $slot }}\n");

  // 修正 $attributes->class 後面的多餘空格 ]) }}>  text → ]) }}>
  result = result.replace(/\]\) \}\}>(\s+)/g, "]) }}>\n");

  // 修正多行 $attributes->class 的縮排（壓縮的空格問題）
  result = result.replace(/(\$attributes(?:->only\('class'\))?->class)\(\[\s{2,}/g, "$1([");
  // 清除 class 項之間的多餘空格
  result = result.replace(/,\s{2,}'/g, ", '");
  result = result.replace(/,\s{2,}\$/g, ", $");

  // 確保 @if/@endif 前後有合理的換行
  result = result.replace(/@endif\s*@if/g, "@endif\n@if");

  // 移除尾部多餘空行
  result = result.replace(/\n{3,}/g, "\n\n");

  return result.trim() + "\n";
}

module.exports = {
  transformTemplate,
};
