import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * 範例標記來源（供 examples.spec.ts 使用）
 * ---------------------------------------------------------------------------
 * 從「教使用者 / AI 寫標記」的三個地方擷取 HTML 範例：
 *   - components.json   每個元件的 `example`
 *   - llms.txt          「## Components Reference」內每個 **元件名** 底下的 ```html 區塊
 *   - docs/             `npm run build:docs` 產出的元件頁，ComponentPreview 的
 *                       `data-cu-preview-code`（即文檔頁 Code 分頁、使用者實際複製的字串）
 */
export const ROOT = resolve(fileURLToPath(new URL(".", import.meta.url)), "../..");
export const DOCS = resolve(ROOT, "docs");

export type ExampleSource = "components.json" | "llms.txt" | "docs";

export interface Example {
  source: ExampleSource;
  /** 元件名（components.json / llms.txt 為顯示名，docs 為頁面 slug） */
  component: string;
  /** 同一元件內的序號（1 起算），用於錯誤訊息定位 */
  index: number;
  html: string;
}

const read = (rel: string) => readFileSync(resolve(ROOT, rel), "utf8");

export function componentsJsonExamples(): Example[] {
  const cj = JSON.parse(read("components.json")) as { components: Array<{ name: string; example?: string }> };
  return cj.components
    .filter((c) => typeof c.example === "string" && c.example.trim() !== "")
    .map((c) => ({ source: "components.json" as const, component: c.name, index: 1, html: c.example as string }));
}

export function llmsExamples(): Example[] {
  const text = read("llms.txt");
  const start = text.indexOf("## Components Reference");
  const end = text.indexOf("\n## ", start + 1);
  const section = text.slice(start, end === -1 ? undefined : end);
  const out: Example[] = [];
  let component = "";
  let index = 0;
  let block: string[] | null = null;
  for (const line of section.split("\n")) {
    if (block) {
      if (line.startsWith("```")) {
        out.push({ source: "llms.txt", component, index, html: block.join("\n") });
        block = null;
      } else {
        block.push(line);
      }
      continue;
    }
    const heading = line.match(/^\*\*([^*]+?)\*\*/);
    if (heading) {
      component = heading[1].trim();
      index = 0;
    } else if (line.startsWith("```html") && component) {
      index++;
      block = [];
    }
  }
  return out;
}

const ENTITIES: Record<string, string> = { quot: '"', amp: "&", lt: "<", gt: ">", apos: "'" };
function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|quot|amp|lt|gt|apos);/gi, (_m, e: string) => {
    if (e[0] === "#") return String.fromCodePoint(e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    return ENTITIES[e.toLowerCase()];
  });
}

/** 文檔頁範例；docs/ 未建置時回傳空陣列（由呼叫端 skip） */
export function docsExamples(): Example[] {
  const dir = join(DOCS, "components");
  if (!existsSync(dir)) return [];
  const out: Example[] = [];
  for (const slug of readdirSync(dir).sort()) {
    const file = join(dir, slug, "index.html");
    if (!existsSync(file)) continue;
    let index = 0;
    for (const m of readFileSync(file, "utf8").matchAll(/data-cu-preview-code="([^"]*)"/g)) {
      index++;
      out.push({ source: "docs", component: slug, index, html: decodeEntities(m[1]) });
    }
  }
  return out;
}

/**
 * Cubby UI 實際會用到的 data-cu-* 屬性：d.ts 的 DATA_ATTRS、打包產物裡以 `dataset.cuXxx`
 * 存取（正則掃不到，如 data-cu-min-size）的屬性，以及 CSS 選擇器 / attr() 使用的屬性（如 data-cu-tooltip）。
 */
export function knownDataAttrs(): string[] {
  const dts = read("dist/core/cubby-ui.d.ts");
  const block = dts.slice(dts.indexOf("export declare const DATA_ATTRS"));
  const attrs = new Set([...block.matchAll(/readonly\s+[A-Z0-9_]+:\s*["'](data-cu-[a-z0-9-]+)["']/g)].map((m) => m[1]));
  for (const m of read("dist/core/cubby-ui.js").matchAll(/dataset\.cu([A-Z][A-Za-z0-9]*)/g)) {
    attrs.add("data-cu-" + m[1].replace(/[A-Z]/g, (c, i: number) => (i === 0 ? "" : "-") + c.toLowerCase()));
  }
  for (const m of read("dist/core/cubby-ui.css").matchAll(/data-cu-[a-z0-9-]+/g)) attrs.add(m[0]);
  return [...attrs].sort();
}

/**
 * 範例自帶的 <script> 若重新查詢 data-cu-* 元件並綁定事件，就是在重新實作 cubby-ui.js：
 * 與自動初始化同時執行時會重複綁定（例如 toggle 兩次 = 沒開）。只允許掛 cu:* 事件等使用端程式碼。
 */
export function rawScriptProblems(html: string): string[] {
  const problems: string[] = [];
  for (const m of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) {
    // 典型的重新實作：document.querySelectorAll("[data-cu-xxx]").forEach(...)（逐一初始化元件）
    const selector = m[1].match(/querySelectorAll\(\s*["'`](\[data-cu-[a-z0-9-]+[^"'`]*)["'`]\s*\)\s*\.forEach/);
    if (selector) {
      problems.push(`範例的 <script> 重新查詢 ${selector[1]} 並綁定事件，與自動初始化的 cubby-ui.js 重複（移除這段 script，交給 cubby-ui.js）`);
    }
  }
  return problems;
}

/**
 * 原始字串層級的巢狀互動元素檢查。HTML parser 遇到 `<button>` 內的 `<button>`、`<a>` 內的 `<a>`
 * 會自動提前關閉外層，DOM 上看不到巢狀，但結構已經被拆散，因此必須在解析前檢查。
 */
export function rawNestingProblems(html: string): string[] {
  const src = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|textarea)\b[^>]*>[\s\S]*?<\/\1>/gi, "");
  const problems: string[] = [];
  const stack: Array<{ tag: string; interactive: boolean }> = [];
  for (const m of src.matchAll(/<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b([^>]*)>/g)) {
    const tag = m[2].toLowerCase();
    if (tag !== "button" && tag !== "a") continue;
    if (m[1] === "/") {
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].tag === tag) { stack.splice(i, 1); break; }
      }
      continue;
    }
    const interactive = tag === "button" || /\shref\s*=/.test(m[3]);
    const outer = [...stack].reverse().find((e) => e.interactive);
    if (interactive && outer) problems.push(`<${tag}> 寫在 <${outer.tag}> 內（巢狀互動元素，HTML parser 會提前關閉外層）`);
    stack.push({ tag, interactive });
  }
  return problems;
}
