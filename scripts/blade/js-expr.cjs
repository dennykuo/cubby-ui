/**
 * JS Expression → PHP Translator
 *
 * 將 Astro frontmatter / template 中常見的 JS 表達式子集轉為 PHP 表達式，
 * 供 @php 指派、屬性值、文字插值、@if 條件共用。
 *
 * 支援：
 * - 字面量：字串、數字、true / false / null / undefined、template literal
 * - 識別字：交由呼叫端的 resolveIdent() 決定（prop → $prop、靜態 const → 字串）
 * - 運算子：`? :`、`??`、`||`（→ `?:`，保留 JS 回傳運算元的語意）、`&&`、
 *   `===` / `!==` / `==` / `!=`、`<` / `>` / `<=` / `>=`、`+ - * / %`、`!`、一元 `-`
 * - 呼叫：Math.min / max / round / floor / ceil / abs、
 *   .toLowerCase() / .toUpperCase() / .trim()
 * - TypeScript `expr as Type`（直接忽略型別）
 *
 * 不支援的語法（陣列 / 物件字面量、arrow function、.map() 等）會拋出
 * UnsupportedExpressionError，呼叫端應改用 scripts/blade/overrides/。
 */

class UnsupportedExpressionError extends Error {}

const PUNCTUATORS = [
  "===",
  "!==",
  "??",
  "||",
  "&&",
  "==",
  "!=",
  "<=",
  ">=",
  "?",
  ":",
  "(",
  ")",
  ",",
  ".",
  "!",
  "<",
  ">",
  "+",
  "-",
  "*",
  "/",
  "%",
];

/**
 * @param {string} src
 * @returns {Array<{ type: string, value: any }>}
 */
function tokenize(src) {
  const tokens = [];
  let i = 0;

  while (i < src.length) {
    const ch = src[i];

    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    if (/[A-Za-z_$]/.test(ch)) {
      let j = i + 1;
      while (j < src.length && /[\w$]/.test(src[j])) j++;
      tokens.push({ type: "ident", value: src.slice(i, j) });
      i = j;
      continue;
    }

    if (/\d/.test(ch)) {
      let j = i + 1;
      while (j < src.length && /[\d.]/.test(src[j])) j++;
      tokens.push({ type: "num", value: src.slice(i, j) });
      i = j;
      continue;
    }

    if (ch === '"' || ch === "'") {
      let j = i + 1;
      let value = "";
      while (j < src.length && src[j] !== ch) {
        if (src[j] === "\\") {
          value += src[j + 1];
          j += 2;
        } else {
          value += src[j++];
        }
      }
      if (j >= src.length) throw new UnsupportedExpressionError(`未閉合的字串：${src}`);
      tokens.push({ type: "str", value });
      i = j + 1;
      continue;
    }

    if (ch === "`") {
      const { parts, end } = readTemplateLiteral(src, i);
      tokens.push({ type: "tpl", value: parts });
      i = end;
      continue;
    }

    const punct = PUNCTUATORS.find((p) => src.startsWith(p, i));
    if (punct) {
      tokens.push({ type: "op", value: punct });
      i += punct.length;
      continue;
    }

    throw new UnsupportedExpressionError(`無法解析的字元 "${ch}"：${src}`);
  }

  return tokens;
}

/**
 * 讀取 template literal，回傳 parts（字串 or 內嵌表達式原始碼）
 */
function readTemplateLiteral(src, start) {
  const parts = [];
  let text = "";
  let i = start + 1;

  while (i < src.length && src[i] !== "`") {
    if (src[i] === "\\") {
      text += src[i + 1];
      i += 2;
    } else if (src[i] === "$" && src[i + 1] === "{") {
      if (text) parts.push(text);
      text = "";
      let depth = 1;
      let j = i + 2;
      while (j < src.length && depth > 0) {
        if (src[j] === "{") depth++;
        else if (src[j] === "}") depth--;
        if (depth > 0) j++;
      }
      parts.push({ expr: src.slice(i + 2, j) });
      i = j + 1;
    } else {
      text += src[i++];
    }
  }

  if (i >= src.length) throw new UnsupportedExpressionError(`未閉合的 template literal：${src}`);
  if (text) parts.push(text);
  return { parts, end: i + 1 };
}

// ── Parser（precedence climbing）─────────────────────────

const BINARY_PRECEDENCE = {
  "??": 1,
  "||": 2,
  "&&": 3,
  "===": 4,
  "!==": 4,
  "==": 4,
  "!=": 4,
  "<": 5,
  ">": 5,
  "<=": 5,
  ">=": 5,
  "+": 6,
  "-": 6,
  "*": 7,
  "/": 7,
  "%": 7,
};

function parse(src) {
  const tokens = tokenize(src);
  let pos = 0;

  const peek = () => tokens[pos];
  const isOp = (v) => peek() && peek().type === "op" && peek().value === v;
  const expectOp = (v) => {
    if (!isOp(v)) throw new UnsupportedExpressionError(`預期 "${v}"：${src}`);
    pos++;
  };

  function parseConditional() {
    const test = parseBinary(1);
    if (isOp("?")) {
      pos++;
      const consequent = parseConditional();
      expectOp(":");
      const alternate = parseConditional();
      return { type: "cond", test, consequent, alternate };
    }
    return test;
  }

  function parseBinary(minPrec) {
    let left = parseUnary();
    while (peek() && peek().type === "op" && BINARY_PRECEDENCE[peek().value] >= minPrec) {
      const op = tokens[pos++].value;
      const right = parseBinary(BINARY_PRECEDENCE[op] + 1);
      left = { type: "bin", op, left, right };
    }
    return left;
  }

  function parseUnary() {
    if (isOp("!") || isOp("-")) {
      const op = tokens[pos++].value;
      return { type: "unary", op, arg: parseUnary() };
    }
    return parsePostfix(parsePrimary());
  }

  function parsePostfix(node) {
    for (;;) {
      if (isOp(".")) {
        pos++;
        const t = tokens[pos++];
        if (!t || t.type !== "ident") throw new UnsupportedExpressionError(`無效的成員存取：${src}`);
        node = { type: "member", object: node, property: t.value };
      } else if (isOp("(")) {
        pos++;
        const args = [];
        while (!isOp(")")) {
          args.push(parseConditional());
          if (isOp(",")) pos++;
          else break;
        }
        expectOp(")");
        node = { type: "call", callee: node, args };
      } else if (peek() && peek().type === "ident" && peek().value === "as") {
        // TypeScript `expr as Type` — 型別斷言不影響值
        pos += 2;
      } else {
        return node;
      }
    }
  }

  function parsePrimary() {
    const t = tokens[pos++];
    if (!t) throw new UnsupportedExpressionError(`表達式不完整：${src}`);

    if (t.type === "num") return { type: "lit", value: Number(t.value) };
    if (t.type === "str") return { type: "lit", value: t.value };
    if (t.type === "tpl") {
      return {
        type: "tpl",
        parts: t.value.map((p) => (typeof p === "string" ? p : parse(p.expr))),
      };
    }
    if (t.type === "ident") {
      if (t.value === "true") return { type: "lit", value: true };
      if (t.value === "false") return { type: "lit", value: false };
      if (t.value === "null" || t.value === "undefined") return { type: "lit", value: null };
      return { type: "ident", name: t.value };
    }
    if (t.type === "op" && t.value === "(") {
      const inner = parseConditional();
      expectOp(")");
      return inner;
    }

    throw new UnsupportedExpressionError(`不支援的語法 "${t.value}"：${src}`);
  }

  const ast = parseConditional();
  if (pos < tokens.length) {
    throw new UnsupportedExpressionError(`不支援的語法 "${tokens[pos].value}"：${src}`);
  }
  return ast;
}

// ── PHP 輸出 ─────────────────────────────────────────

const PHP_BINARY_OP = { "||": "?:" };

/** PHP 運算子優先序（數字越大越緊密；PHP 8 起 `.` 低於 `+ -`） */
const PHP_PRECEDENCE = {
  "*": 10,
  "/": 10,
  "%": 10,
  "+": 9,
  "-": 9,
  ".": 8,
  "<": 7,
  ">": 7,
  "<=": 7,
  ">=": 7,
  "===": 6,
  "!==": 6,
  "==": 6,
  "!=": 6,
  "&&": 5,
  "??": 3,
  "?:": 2,
  "?": 2,
};

/**
 * 左運算元與父運算子同優先序時可省略括號的運算子（左結合；`??` 分組不影響語意；
 * `?:` 純串接在 PHP 8 仍合法）。比較運算子在 PHP 為非結合，不列入。
 */
const LEFT_CHAINABLE = new Set(["??", "?:", "&&", ".", "+", "-", "*", "/", "%"]);

const MATH_FUNCTIONS = new Set(["min", "max", "round", "floor", "ceil", "abs"]);
const STRING_METHODS = { toLowerCase: "strtolower", toUpperCase: "strtoupper", trim: "trim" };

/**
 * PHP 單引號字串
 */
function phpString(value) {
  return `'${String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
}

function isStringNode(node) {
  return node.type === "tpl" || (node.type === "lit" && typeof node.value === "string");
}

/**
 * @param {object} node - AST
 * @param {(name: string) => { php: string } | { value: string }} resolveIdent
 * @returns {{ code: string, op?: string, staticValue?: string }}
 */
function emit(node, resolveIdent) {
  switch (node.type) {
    case "lit": {
      if (node.value === null) return { code: "null" };
      if (typeof node.value === "boolean") return { code: String(node.value) };
      if (typeof node.value === "number") return { code: String(node.value) };
      return { code: phpString(node.value), staticValue: node.value };
    }

    case "ident": {
      const resolved = resolveIdent(node.name);
      if ("value" in resolved) return { code: phpString(resolved.value), staticValue: resolved.value };
      return { code: resolved.php };
    }

    case "tpl": {
      // 合併相鄰靜態片段（含已解析為靜態值的識別字）
      const segments = [];
      for (const part of node.parts) {
        const seg = typeof part === "string" ? { staticValue: part } : emit(part, resolveIdent);
        const last = segments[segments.length - 1];
        if (seg.staticValue !== undefined && last && last.staticValue !== undefined) {
          last.staticValue += seg.staticValue;
        } else {
          segments.push({ ...seg });
        }
      }
      if (segments.length === 0) return { code: "''", staticValue: "" };
      if (segments.length === 1 && segments[0].staticValue !== undefined) {
        return { code: phpString(segments[0].staticValue), staticValue: segments[0].staticValue };
      }
      const code = segments
        .map((s) => (s.staticValue !== undefined ? phpString(s.staticValue) : wrap(s, ".", "left")))
        .join(" . ");
      return { code, op: "." };
    }

    case "unary": {
      const arg = emit(node.arg, resolveIdent);
      const code = arg.op && arg.op !== "unary" ? `(${arg.code})` : arg.code;
      return { code: `${node.op}${code}`, op: "unary" };
    }

    case "bin": {
      let op = PHP_BINARY_OP[node.op] || node.op;
      if (op === "+" && (isStringNode(node.left) || isStringNode(node.right))) op = ".";
      const left = emit(node.left, resolveIdent);
      const right = emit(node.right, resolveIdent);
      return { code: `${wrap(left, op, "left")} ${op} ${wrap(right, op, "right")}`, op };
    }

    case "cond": {
      const test = emit(node.test, resolveIdent);
      const consequent = emit(node.consequent, resolveIdent);
      const alternate = emit(node.alternate, resolveIdent);
      return {
        code: `${wrap(test, "?")} ? ${wrap(consequent, "?")} : ${wrap(alternate, "?")}`,
        op: "?",
      };
    }

    case "call":
      return emitCall(node, resolveIdent);

    default:
      throw new UnsupportedExpressionError(`不支援的成員存取 .${node.property}`);
  }
}

function emitCall(node, resolveIdent) {
  const { callee } = node;
  if (callee.type !== "member") {
    throw new UnsupportedExpressionError("不支援的函式呼叫");
  }

  const args = node.args.map((a) => emit(a, resolveIdent).code);

  if (callee.object.type === "ident" && callee.object.name === "Math" && MATH_FUNCTIONS.has(callee.property)) {
    return { code: `${callee.property}(${args.join(", ")})` };
  }

  if (STRING_METHODS[callee.property] && node.args.length === 0) {
    return { code: `${STRING_METHODS[callee.property]}(${emit(callee.object, resolveIdent).code})` };
  }

  throw new UnsupportedExpressionError(`不支援的方法呼叫 .${callee.property}()`);
}

/**
 * 依 PHP 優先序決定子表達式是否需要括號
 * @param {{ code: string, op?: string }} child
 * @param {string} parentOp
 * @param {'left' | 'right'} [side]
 */
function wrap(child, parentOp, side) {
  if (!child.op || child.op === "unary") return child.code;
  const childPrec = PHP_PRECEDENCE[child.op];
  const parentPrec = PHP_PRECEDENCE[parentOp];
  if (childPrec > parentPrec) return child.code;
  if (side === "left" && childPrec === parentPrec && LEFT_CHAINABLE.has(parentOp) && LEFT_CHAINABLE.has(child.op)) {
    return child.code;
  }
  return `(${child.code})`;
}

/**
 * 將 JS 表達式轉為 PHP 表達式
 *
 * @param {string} src - JS 表達式原始碼
 * @param {(name: string) => { php: string } | { value: string }} resolveIdent
 *   識別字解析：回傳 { php: '$var' } 或靜態值 { value: 'cu-foo' }；未知識別字應拋錯
 * @returns {{ code: string, staticValue?: string }}
 *   code: PHP 表達式；staticValue: 若結果為靜態字串則提供其值
 */
function jsToPhp(src, resolveIdent) {
  const result = emit(parse(src.trim()), resolveIdent);
  return { code: result.code, staticValue: result.staticValue };
}

module.exports = {
  jsToPhp,
  phpString,
  UnsupportedExpressionError,
};
