// ESLint flat config — 只檢查互動元件 JS（src/scripts/）的正確性問題。
// 刻意只用 @eslint/js recommended（未定義變數、無法到達的程式碼、重複 key 等），
// 不啟用任何排版 / 風格規則，也不搭配 Prettier：原始碼維持既有 ES5 風格（var / function）。
// 執行：npm run lint（= eslint src/scripts）。cubby-ui.d.ts / globals.d.ts 不是 .js，不在檢查範圍。
import js from "@eslint/js";
import globals from "globals";

export default [
  {
    // 建置產物與自動產生的檔案（即使直接執行 `npx eslint` 也不會掃到）
    ignores: ["dist/", "docs/", ".astro/", "src/pages/zh-tw/"],
  },
  {
    files: ["src/scripts/**/*.js"],
    ...js.configs.recommended,
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
    rules: {
      ...js.configs.recommended.rules,
      // ES5 風格不能省略 catch 參數（optional catch binding 是 ES2019），以 `_` 前綴表示刻意忽略
      "no-unused-vars": ["error", { caughtErrorsIgnorePattern: "^_" }],
      // recommended 之外補幾條純正確性 / 安全性規則（皆非排版風格）
      "array-callback-return": "error",
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-promise-executor-return": "error",
      "no-self-compare": "error",
      "no-template-curly-in-string": "error",
      "no-unmodified-loop-condition": "error",
      "no-unreachable-loop": "error",
    },
  },
  {
    // 文檔站 Playground 頁面專用的 IIFE（以 <script src> 載入，非 ESM 模組，不打包進 cubby-ui.js）
    files: ["src/scripts/playground.js"],
    languageOptions: {
      sourceType: "script",
      globals: {
        // 由 cubby-ui.js（UMD）掛在 window 上；playground 以 typeof 檢查後才呼叫
        CubbyUI: "readonly",
      },
    },
  },
];
