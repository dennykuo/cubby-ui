/**
 * Blade render smoke test（由 test-blade-syntax.cjs 呼叫）
 *
 * 以 illuminate/view 實際渲染 dist/laravel/components/cu/ 下每個元件，
 * 捕捉靜態檢查抓不到的執行期錯誤（Undefined variable、型別錯誤等）。
 *
 * 依賴安裝於 tests/blade-render/vendor/（已 gitignore）：
 *   - vendor 不存在且有 composer → 自動 `composer install`
 *   - 沒有 composer 或安裝失敗 → 略過（required 時視為失敗）
 */

const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const HARNESS_DIR = path.join(__dirname, '..', '..', 'tests', 'blade-render');

/**
 * @param {{ componentsDir: string, verbose?: boolean, required?: boolean }} options
 * @returns {boolean} 通過（或允許略過）回傳 true
 */
function runRenderSmoke({ componentsDir, verbose = false, required = false }) {
  const skip = (reason) => {
    if (required) {
      console.error(`✗ 無法執行 render smoke test（--require-render）：${reason}`);
      return false;
    }
    console.warn(`⚠  略過 render smoke test：${reason}`);
    return true;
  };

  if (!fs.existsSync(path.join(HARNESS_DIR, 'vendor', 'autoload.php'))) {
    const hasComposer = cp.spawnSync('composer', ['--version'], { encoding: 'utf8' }).status === 0;
    if (!hasComposer) {
      return skip('系統未安裝 composer（可用 --skip-render 隱藏此訊息）');
    }

    console.log('📦 安裝 render smoke test 依賴（tests/blade-render，composer install）…');
    const install = cp.spawnSync(
      'composer',
      ['install', '--no-interaction', '--no-progress', '--quiet'],
      { cwd: HARNESS_DIR, encoding: 'utf8' }
    );
    if (install.status !== 0) {
      if (verbose) console.error(install.stderr || install.stdout);
      return skip('composer install 失敗（需可連線至 Packagist）');
    }
  }

  console.log('🧪 以 illuminate/view 渲染所有元件…');
  const runArgs = [path.join(HARNESS_DIR, 'render.php'), componentsDir];
  if (verbose) runArgs.push('--verbose');
  const run = cp.spawnSync('php', runArgs, { encoding: 'utf8' });
  const output = `${run.stdout || ''}${run.stderr || ''}`.trimEnd();

  if (run.status === 0) {
    if (output) console.log(output);
    console.log('✓ 所有元件皆可由 illuminate/view 渲染（含全部 prop 的變體）');
    return true;
  }

  console.error(`\n✗ render smoke test 失敗：\n${output}`);
  return false;
}

module.exports = { runRenderSmoke };
