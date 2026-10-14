<?php

/**
 * Blade 元件 render smoke test
 *
 * 以 illuminate/view 實際渲染 dist/laravel/components/cu/ 下每個元件，
 * 註冊方式與 stubs/laravel/CubbyUiServiceProvider.php 相同
 * （Blade::anonymousComponentPath($path, 'cu')，以 <x-cu.*> 使用）。
 * 比照 Laravel 的 HandleExceptions，PHP warning / notice 一律轉為例外，
 * 因此 `Undefined variable` 等錯誤會讓測試失敗。
 *
 * 每個元件渲染兩次：
 *   - defaults：不帶任何 prop
 *   - all-props：每個 prop 都給 truthy 值（boolean → true、數字 → 3、其餘 → 'x'），
 *     以走過條件分支
 *
 * 用法：php tests/blade-render/render.php <dist/laravel/components> [--verbose]
 * 通常經由 `npm run test:blade` 呼叫（scripts/blade/render-smoke.cjs 會先 composer install）。
 */

require __DIR__ . '/vendor/autoload.php';

use Illuminate\Config\Repository as Config;
use Illuminate\Container\Container;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory as FactoryContract;
use Illuminate\Events\Dispatcher;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Facade;
use Illuminate\View\Compilers\BladeCompiler;
use Illuminate\View\Engines\CompilerEngine;
use Illuminate\View\Engines\EngineResolver;
use Illuminate\View\Engines\PhpEngine;
use Illuminate\View\Factory;
use Illuminate\View\FileViewFinder;

$componentsPath = realpath($argv[1] ?? '');
$verbose = in_array('--verbose', $argv, true);

if ($componentsPath === false || !is_dir($componentsPath . '/cu')) {
    fwrite(STDERR, "找不到元件目錄：" . ($argv[1] ?? '(未指定)') . "\n");
    exit(2);
}

// 與 Laravel HandleExceptions 相同：除 deprecation 外的錯誤一律轉為 ErrorException
error_reporting(E_ALL);
set_error_handler(function (int $level, string $message, string $file = '', int $line = 0) {
    if (in_array($level, [E_DEPRECATED, E_USER_DEPRECATED], true)) {
        return true;
    }
    throw new ErrorException($message, 0, $level, $file, $line);
});

// ── 最小 Laravel view 環境 ─────────────────────────────

$cachePath = sys_get_temp_dir() . '/cubby-ui-blade-render-' . getmypid();
$files = new Filesystem;
$files->ensureDirectoryExists($cachePath);

$app = new Container;
Container::setInstance($app);
Facade::setFacadeApplication($app);

$events = new Dispatcher($app);
$compiler = new BladeCompiler($files, $cachePath);

$resolver = new EngineResolver;
$resolver->register('blade', fn () => new CompilerEngine($compiler, $files));
$resolver->register('php', fn () => new PhpEngine($files));

$factory = new Factory($resolver, new FileViewFinder($files, [$cachePath]), $events);
$factory->setContainer($app);

$app->instance('files', $files);
$app->instance('events', $events);
$app->instance('config', new Config(['view.compiled' => $cachePath]));
$app->instance('blade.compiler', $compiler);
$app->instance(BladeCompiler::class, $compiler);
$app->instance('view', $factory);
$app->instance(FactoryContract::class, $factory);
// ComponentTagCompiler 猜測 class-based 元件時需要 Application::getNamespace()
$app->instance(Application::class, new class {
    public function getNamespace(): string
    {
        return 'App\\';
    }
});

Blade::anonymousComponentPath($componentsPath, 'cu');

// ── 測試案例 ───────────────────────────────────────────

/**
 * 解析 @props([...]) 的 prop 名稱與預設值字面量
 *
 * @return array<string, string>
 */
function parseProps(string $source): array
{
    if (!preg_match('/@props\(\[(.*?)\]\)/s', $source, $m)) {
        return [];
    }
    preg_match_all("/'(\\w+)'\\s*=>\\s*([^,\\n]+)/", $m[1], $matches, PREG_SET_ORDER);

    $props = [];
    foreach ($matches as [, $name, $default]) {
        $props[$name] = trim($default);
    }
    return $props;
}

/**
 * 依預設值型別產生 truthy 的屬性字串
 */
function truthyAttributes(array $props): string
{
    $attrs = [];
    foreach ($props as $name => $default) {
        $attr = strtolower(preg_replace('/([a-z0-9])([A-Z])/', '$1-$2', $name));
        if ($default === 'true' || $default === 'false') {
            $attrs[] = ":{$attr}=\"true\"";
        } elseif (is_numeric($default)) {
            $attrs[] = ":{$attr}=\"3\"";
        } else {
            $attrs[] = "{$attr}=\"x\"";
        }
    }
    return implode(' ', $attrs);
}

$bladeFiles = [];
$iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($componentsPath . '/cu'));
foreach ($iterator as $file) {
    if ($file->isFile() && str_ends_with($file->getFilename(), '.blade.php')) {
        $bladeFiles[] = $file->getPathname();
    }
}
sort($bladeFiles);

$failures = 0;
$renders = 0;

foreach ($bladeFiles as $path) {
    // cu/card/index.blade.php → card、cu/card/header.blade.php → card.header
    $relative = substr($path, strlen($componentsPath . '/cu/'), -strlen('.blade.php'));
    $relative = preg_replace('#/index$#', '', $relative);
    $tag = 'x-cu.' . str_replace('/', '.', $relative);

    $variants = ['defaults' => ''];
    $props = parseProps(file_get_contents($path));
    if ($props) {
        $variants['all-props'] = ' ' . truthyAttributes($props);
    }

    foreach ($variants as $label => $attributes) {
        $template = "<{$tag}{$attributes} class=\"smoke-extra\" id=\"smoke-id\">Slot content</{$tag}>";
        $renders++;
        try {
            Blade::render($template, deleteCachedView: true);
            if ($verbose) {
                echo "  ✓ {$relative} [{$label}]\n";
            }
        } catch (Throwable $e) {
            $failures++;
            $message = preg_replace('/\s*\(View: .*\)$/s', '', $e->getMessage());
            echo "  ✗ {$relative} [{$label}]: " . get_class($e) . ": {$message}\n";
        }
    }
}

$files->deleteDirectory($cachePath);

echo "  " . count($bladeFiles) . " 個元件 / {$renders} 次渲染，{$failures} 個失敗\n";
exit($failures > 0 ? 1 : 0);
