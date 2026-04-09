import type { Locale } from '../index';

export const laravelPage: Record<Locale, {
  title: string;
  heading: string;
  description: string;

  install: {
    heading: string;
  };

  step1: {
    heading: string;
    description: string;
  };

  step2: {
    heading: string;
    description: string;
    benefit: string;
  };

  step3: {
    heading: string;
    description: string;
  };

  update: {
    heading: string;
    description: string;
  };

  usage: {
    heading: string;
    description: string;
    simpleHeading: string;
    compositeHeading: string;
    attributeHeading: string;
    attributeDescription: string;
  };

  theme: {
    heading: string;
    description: string;
  };

  darkMode: {
    heading: string;
    description: string;
  };

  dynamic: {
    heading: string;
    description: string;
  };

  jsApi: {
    heading: string;
    description: string;
  };

  altProvider: {
    heading: string;
    description: string;
    step1: string;
    step2: string;
    monorepoHeading: string;
    monorepoDescription: string;
  };

  cdn: {
    heading: string;
    description: string;
    step1: string;
    step2: string;
    step2Note: string;
  };
}> = {
  en: {
    title: 'Laravel — Cubby UI',
    heading: 'Laravel',
    description: 'How to use Cubby UI in a Laravel project with Blade components and Vite.',

    install: {
      heading: 'Installation',
    },

    step1: {
      heading: 'Install the package',
      description: 'Install via npm (or yarn / pnpm):',
    },

    step2: {
      heading: 'Register Blade components',
      description: 'Add one line to your existing <code class="cu-code">AppServiceProvider</code> to load Cubby UI Blade components directly from <code class="cu-code">node_modules</code>:',
      benefit: 'Components are loaded directly from <code class="cu-code">node_modules</code> — no file copying needed. Running <code class="cu-code">npm update cubby-ui</code> automatically updates all Blade components, CSS, and JS.',
    },

    step3: {
      heading: 'Import CSS / JS via Vite',
      description: 'Add to your <code class="cu-code">resources/js/app.js</code>:',
    },

    update: {
      heading: 'Updating',
      description: 'Since all resources (Blade components, CSS, JS) are loaded from <code class="cu-code">node_modules</code>, a single command updates everything:',
    },

    usage: {
      heading: 'Using components',
      description: 'All components use the <code class="cu-code">&lt;x-cu.*&gt;</code> prefix.',
      simpleHeading: 'Simple component',
      compositeHeading: 'Composite component',
      attributeHeading: 'Attribute pass-through',
      attributeDescription: 'Extra HTML attributes (<code class="cu-code">id</code>, <code class="cu-code">class</code>, <code class="cu-code">data-*</code>, <code class="cu-code">aria-*</code>) are automatically forwarded. Your classes merge with the base <code class="cu-code">cu-*</code> classes.',
    },

    theme: {
      heading: 'Theme customization',
      description: 'Cubby UI uses CSS variables for theming. Override them to customize:',
    },

    darkMode: {
      heading: 'Dark mode',
      description: 'Add the <code class="cu-code">dark</code> class to your root element:',
    },

    dynamic: {
      heading: 'Dynamic content',
      description: 'When loading HTML containing interactive components dynamically (Livewire, AJAX, etc.), re-initialize after the content is inserted:',
    },

    jsApi: {
      heading: 'JavaScript API',
      description: 'Cubby UI exposes a global API for interactive component control:',
    },

    altProvider: {
      heading: 'Alternative: Separate ServiceProvider',
      description: 'If you prefer to keep Cubby UI registration in its own ServiceProvider instead of modifying <code class="cu-code">AppServiceProvider</code>, you can use the pre-built file:',
      step1: 'Copy ServiceProvider to your project',
      step2: 'Register in <code class="cu-code">bootstrap/providers.php</code>:',
      monorepoHeading: 'Monorepo / Custom path',
      monorepoDescription: 'If <code class="cu-code">node_modules</code> is not in the project root (e.g. pnpm workspace, Yarn workspaces), create <code class="cu-code">config/cubby-ui.php</code> to override the path:',
    },

    cdn: {
      heading: 'Alternative: CDN',
      description: 'For quick prototyping without Vite, you can use CDN links directly in your Blade layout. Note: with this approach you need to manually copy Blade component files.',
      step1: 'Add CDN links to your layout',
      step2: 'Copy Blade components manually',
      step2Note: 'To update, run <code class="cu-code">npm update cubby-ui</code> first, then re-copy the Blade components to overwrite the old files. You also need to update the CDN links to the new version.',
    },
  },

  'zh-tw': {
    title: 'Laravel — Cubby UI',
    heading: 'Laravel',
    description: '如何在 Laravel 專案中使用 Cubby UI 的 Blade 元件和 Vite 整合。',

    install: {
      heading: '安裝',
    },

    step1: {
      heading: '安裝套件',
      description: '透過 npm（或 yarn / pnpm）安裝：',
    },

    step2: {
      heading: '註冊 Blade 元件',
      description: '在現有的 <code class="cu-code">AppServiceProvider</code> 加一行，即可從 <code class="cu-code">node_modules</code> 直接載入 Cubby UI Blade 元件：',
      benefit: '元件直接從 <code class="cu-code">node_modules</code> 載入，不需要複製檔案。執行 <code class="cu-code">npm update cubby-ui</code> 即自動更新所有 Blade 元件、CSS 和 JS。',
    },

    step3: {
      heading: '透過 Vite 引入 CSS / JS',
      description: '在 <code class="cu-code">resources/js/app.js</code> 中加入：',
    },

    update: {
      heading: '更新',
      description: '所有資源（Blade 元件、CSS、JS）皆從 <code class="cu-code">node_modules</code> 載入，一個指令即可更新全部：',
    },

    usage: {
      heading: '使用元件',
      description: '所有元件使用 <code class="cu-code">&lt;x-cu.*&gt;</code> 前綴。',
      simpleHeading: '簡單元件',
      compositeHeading: '複合元件',
      attributeHeading: '屬性透傳',
      attributeDescription: '額外的 HTML 屬性（<code class="cu-code">id</code>、<code class="cu-code">class</code>、<code class="cu-code">data-*</code>、<code class="cu-code">aria-*</code>）會自動轉發。你的 class 會與基礎 <code class="cu-code">cu-*</code> class 合併。',
    },

    theme: {
      heading: '主題客製',
      description: 'Cubby UI 使用 CSS 變數定義主題。覆寫即可自訂：',
    },

    darkMode: {
      heading: '深色模式',
      description: '在根元素加上 <code class="cu-code">dark</code> class 即可：',
    },

    dynamic: {
      heading: '動態內容',
      description: '透過 Livewire、AJAX 等方式動態載入含互動元件的 HTML 後，需重新初始化：',
    },

    jsApi: {
      heading: 'JavaScript API',
      description: 'Cubby UI 提供全域 API 控制互動元件：',
    },

    altProvider: {
      heading: '替代方案：獨立 ServiceProvider',
      description: '如果你偏好將 Cubby UI 註冊放在獨立的 ServiceProvider，而非修改 <code class="cu-code">AppServiceProvider</code>，可使用預建的檔案：',
      step1: '複製 ServiceProvider 到專案中',
      step2: '在 <code class="cu-code">bootstrap/providers.php</code> 中註冊：',
      monorepoHeading: 'Monorepo / 自訂路徑',
      monorepoDescription: '如果 <code class="cu-code">node_modules</code> 不在專案根目錄（例如 pnpm workspace、Yarn workspaces），建立 <code class="cu-code">config/cubby-ui.php</code> 覆寫路徑：',
    },

    cdn: {
      heading: '替代方案：CDN',
      description: '不使用 Vite 的快速原型開發，可直接在 Blade layout 中使用 CDN 連結。注意：此方式需要手動複製 Blade 元件檔案。',
      step1: '在 layout 中加入 CDN 連結',
      step2: '手動複製 Blade 元件',
      step2Note: '若要更新，先執行 <code class="cu-code">npm update cubby-ui</code>，再重新複製 Blade 元件以覆蓋舊檔案。同時需要更新 CDN 連結至新版本。',
    },
  },
};
