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
 * prop 的取樣值依 Astro 原始碼 `interface Props` 的型別決定（Blade 檔首行註解記錄了來源檔名，
 * 型別別名如 FeedbackVariant 由 src/types.ts 解析）。每個元件渲染以下變體：
 *   - defaults：不帶任何 prop
 *   - 逐值：字面量聯集（`size?: "sm" | "default" | "lg"`、`level?: 1 | 2 | 3`）的每個值、
 *     boolean 的 true / false，各單獨渲染一次。同一個 prop 的不同值渲染結果相同時視為失敗
 *     （該值的分支在轉換時遺失，例如 `variant === "lead" ? … : ""` 的 class 被丟掉）
 *   - all-props：所有 prop 同時給非預設值（聯集 → 第一個非預設成員、boolean → 預設值的反面、
 *     number → 3、陣列如 ColorPicker 的 `swatches?: string[]` → 兩個元素，讓 @foreach 實際執行、
 *     其餘 → 'x'）。只有一個 prop 而與某個逐值變體相同時省略
 *
 * 每次渲染都帶 class="smoke-extra" id="smoke-id" style="--smoke-style: 1"，並以 DOMDocument 解析輸出
 * （與瀏覽器相同，重複屬性只保留第一個）確認：
 *   - 使用者的 class 確實生效（未因同一元素有兩個 class 屬性而被丟棄）
 *   - 使用者的 style 確實生效（未因元件自身的 style 屬性在前而被丟棄）
 *   - 使用者的 id 只出現在一個元素上（$attributes 沒有被渲染到多個元素）
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
// 用來查 prop 型別的 Astro 原始碼目錄（Blade 檔首行註解記錄了來源檔名）與共用型別別名
$astroDir = __DIR__ . '/../../src/components/ui';
$typesPath = __DIR__ . '/../../src/types.ts';

if ($componentsPath === false || !is_dir($componentsPath . '/cu')) {
    fwrite(STDERR, "找不到元件目錄：" . ($argv[1] ?? '(未指定)') . "\n");
    exit(2);
}

// 與 Laravel HandleExceptions 相同：除 deprecation 與以 @ 抑制的錯誤外，一律轉為 ErrorException
error_reporting(E_ALL);
set_error_handler(function (int $level, string $message, string $file = '', int $line = 0) {
    if (in_array($level, [E_DEPRECATED, E_USER_DEPRECATED], true) || !(error_reporting() & $level)) {
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
 * 解析 TypeScript 的 `type Name = ...;` 別名（如 src/types.ts 的 FeedbackVariant）
 *
 * @return array<string, string>
 */
function parseTypeAliases(string $source): array
{
    preg_match_all('/^\s*(?:export\s+)?type\s+(\w+)\s*=\s*(.+?);/ms', $source, $matches, PREG_SET_ORDER);

    $aliases = [];
    foreach ($matches as [, $name, $type]) {
        $aliases[$name] = $type;
    }
    return $aliases;
}

/**
 * 由 Blade 檔首行的 `Auto-generated from Xxx.astro` 找到 Astro 原始檔，
 * 回傳 interface Props 各 prop 的型別字串（名稱 → 型別；跨行的聯集會合併成一行）
 *
 * @return array<string, string>
 */
function propTypesOf(string $bladeSource, string $astroDir): array
{
    if (!preg_match('/Auto-generated from (\w+\.astro)/', $bladeSource, $m)) {
        return [];
    }
    $astroPath = $astroDir . '/' . $m[1];
    if (!is_file($astroPath)) {
        return [];
    }
    // 也涵蓋 `interface Props extends Omit<HTMLAttributes<"input">, "size">` 這類寫法
    if (!preg_match('/interface Props\b[^{]*\{(.*?)\n\}/s', file_get_contents($astroPath), $interface)) {
        return [];
    }

    $body = preg_replace(['#/\*.*?\*/#s', '#//[^\n]*#'], '', $interface[1]);
    $types = [];
    foreach (explode(';', $body) as $member) {
        // `[key: string]: any` 等索引簽章不以名稱開頭，自然略過
        if (preg_match('/^\s*(\w+)\??\s*:\s*(.+?)\s*$/s', $member, $mm)) {
            $types[$mm[1]] = preg_replace('/\s+/', ' ', $mm[2]);
        }
    }
    return $types;
}

/**
 * 把型別字串分類為取樣規則：
 *   - ['kind' => 'array', 'element' => 'string']  T[] / Array<T>
 *   - ['kind' => 'literals', 'values' => [...]]   字串或數字字面量的聯集（含型別別名）
 *   - ['kind' => 'boolean'] / ['kind' => 'number']
 *   - ['kind' => 'other']                          string 及其他無法列舉的型別
 *
 * @param array<string, string> $aliases
 * @return array{kind: string, element?: string, values?: list<string|int|float>}
 */
function sampleSpec(string $type, array $aliases): array
{
    $type = trim($type);
    if (isset($aliases[$type])) {
        return sampleSpec($aliases[$type], array_diff_key($aliases, [$type => true]));
    }
    if (preg_match('/^(?:(\w+)\[\]|Array<(\w+)>)$/', $type, $m)) {
        return ['kind' => 'array', 'element' => ($m[1] ?? '') !== '' ? $m[1] : $m[2]];
    }
    if ($type === 'boolean' || $type === 'number') {
        return ['kind' => $type];
    }

    $values = [];
    foreach (explode('|', ltrim($type, '| ')) as $member) {
        $member = trim($member);
        if (preg_match('/^(["\'])(.*)\1$/', $member, $m)) {
            $values[] = $m[2];
        } elseif (is_numeric($member)) {
            $values[] = $member + 0;
        } else {
            return ['kind' => 'other'];
        }
    }
    return ['kind' => 'literals', 'values' => $values];
}

/**
 * 把 @props 的預設值字面量轉成 PHP 值（只處理 Blade 產物會出現的 null / bool / 數字 / 單引號字串）
 */
function defaultValue(string $literal): mixed
{
    if (in_array($literal, ['null', 'true', 'false'], true)) {
        return json_decode($literal);
    }
    if (is_numeric($literal)) {
        return $literal + 0;
    }
    return preg_match("/^'(.*)'$/s", $literal, $m) ? stripslashes($m[1]) : $literal;
}

/**
 * 產生元件標籤上的單一屬性：字串值為一般屬性，其餘以 `:attr` 傳 PHP 值
 */
function attribute(string $name, mixed $value): string
{
    $attr = strtolower(preg_replace('/([a-z0-9])([A-Z])/', '$1-$2', $name));
    if (is_string($value)) {
        return $attr . '="' . htmlspecialchars($value, ENT_QUOTES) . '"';
    }
    // Blade 不會解碼 :attr 內的 HTML entity，PHP 字面量原樣放入（phpLiteral 只產生單引號字串）
    return ':' . $attr . '="' . phpLiteral($value) . '"';
}

function phpLiteral(mixed $value): string
{
    if (is_array($value)) {
        return '[' . implode(', ', array_map('phpLiteral', $value)) . ']';
    }
    return var_export($value, true);
}

/**
 * all-props 變體中某個 prop 的取樣值：盡量與預設值不同，以走過非預設的分支
 *   - 字面量聯集 → 第一個不等於預設值的成員（Button 的 size → 'sm'）
 *   - boolean → 預設值的反面（未宣告預設值時為 true）
 *   - number → 3；陣列 → 兩個元素（讓 @foreach 實際執行）；其他 → 'x'
 *   - Astro 型別查不到時依 @props 預設值推斷（boolean → true、數字 → 3、其餘 → 'x'）
 *
 * @param array{kind: string, element?: string, values?: list<string|int|float>}|null $spec
 */
function nonDefaultSample(?array $spec, mixed $default): mixed
{
    switch ($spec['kind'] ?? null) {
        case 'literals':
            foreach ($spec['values'] as $value) {
                if ($value !== $default) {
                    return $value;
                }
            }
            return $spec['values'][0];
        case 'boolean':
            return $default !== true;
        case 'number':
            return 3;
        case 'array':
            return $spec['element'] === 'number' ? [1, 2] : ['x', 'y'];
        case 'other':
            return 'x';
    }
    if (is_bool($default)) {
        return true;
    }
    return is_int($default) || is_float($default) ? 3 : 'x';
}

/**
 * 以 HTML parser 檢查使用者屬性是否正確落地，回傳問題描述（無問題回傳 null）
 */
function checkUserAttributes(string $html): ?string
{
    $dom = new DOMDocument;
    $previous = libxml_use_internal_errors(true);
    $dom->loadHTML('<!DOCTYPE html><html><body>' . $html . '</body></html>');
    libxml_clear_errors();
    libxml_use_internal_errors($previous);

    $xpath = new DOMXPath($dom);
    $withClass = $xpath->query("//*[contains(concat(' ', normalize-space(@class), ' '), ' smoke-extra ')]")->length;
    $withStyle = $xpath->query("//*[contains(@style, '--smoke-style: 1')]")->length;
    $withId = $xpath->query("//*[@id='smoke-id']")->length;

    if ($withClass === 0) {
        return '使用者傳入的 class 未生效（同一元素可能有兩個 class 屬性）';
    }
    if ($withStyle === 0) {
        return '使用者傳入的 style 未生效（同一元素可能有兩個 style 屬性）';
    }
    if ($withId !== 1) {
        return "使用者傳入的 id 出現在 {$withId} 個元素上（預期 1 個）";
    }
    return null;
}

$bladeFiles = [];
$iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($componentsPath . '/cu'));
foreach ($iterator as $file) {
    if ($file->isFile() && str_ends_with($file->getFilename(), '.blade.php')) {
        $bladeFiles[] = $file->getPathname();
    }
}
sort($bladeFiles);

$typeAliases = parseTypeAliases(file_get_contents($typesPath));
$failures = 0;
$renders = 0;

foreach ($bladeFiles as $path) {
    // cu/card/index.blade.php → card、cu/card/header.blade.php → card.header
    $relative = substr($path, strlen($componentsPath . '/cu/'), -strlen('.blade.php'));
    $relative = preg_replace('#/index$#', '', $relative);
    $tag = 'x-cu.' . str_replace('/', '.', $relative);

    $source = file_get_contents($path);
    $props = parseProps($source);
    $types = propTypesOf($source, $astroDir);

    // 變體：label => [屬性字串, 列舉的 prop 名稱（僅逐值變體）]
    $variants = ['defaults' => ['', null]];
    $allProps = [];
    foreach ($props as $name => $literal) {
        $spec = isset($types[$name]) ? sampleSpec($types[$name], $typeAliases) : null;
        $default = defaultValue($literal);
        $allProps[] = attribute($name, nonDefaultSample($spec, $default));

        $values = match ($spec['kind'] ?? null) {
            'literals' => $spec['values'],
            'boolean' => [true, false],
            default => [],
        };
        foreach ($values as $value) {
            $variants[$name . '=' . var_export($value, true)] = [' ' . attribute($name, $value), $name];
        }
    }
    // 只有一個 prop 時 all-props 可能與某個逐值變體相同，不重複渲染
    if ($allProps && !in_array(' ' . implode(' ', $allProps), array_column($variants, 0), true)) {
        $variants['all-props'] = [' ' . implode(' ', $allProps), null];
    }

    $outputs = [];
    foreach ($variants as $label => [$attributes, $enumerated]) {
        $template = "<{$tag}{$attributes} class=\"smoke-extra\" id=\"smoke-id\" style=\"--smoke-style: 1\">Slot content</{$tag}>";
        $renders++;
        try {
            $html = Blade::render($template, deleteCachedView: true);
            if ($enumerated !== null) {
                $outputs[$enumerated][$label] = $html;
            }
            if ($problem = checkUserAttributes($html)) {
                $failures++;
                echo "  ✗ {$relative} [{$label}]: {$problem}\n";
            } elseif ($verbose) {
                echo "  ✓ {$relative} [{$label}]\n";
            }
        } catch (Throwable $e) {
            $failures++;
            $message = preg_replace('/\s*\(View: .*\)$/s', '', $e->getMessage());
            echo "  ✗ {$relative} [{$label}]: " . get_class($e) . ": {$message}\n";
        }
    }

    // 同一個 prop 的不同值應渲染出不同結果；相同代表該值的分支在轉換時遺失（例如 class 條件被丟掉）
    foreach ($outputs as $name => $byValue) {
        $seen = [];
        foreach ($byValue as $label => $html) {
            if (isset($seen[$html])) {
                $failures++;
                echo "  ✗ {$relative} [{$label}]: 與 [{$seen[$html]}] 渲染結果相同（prop {$name} 的這個值沒有作用）\n";
            } else {
                $seen[$html] = $label;
            }
        }
    }
}

$files->deleteDirectory($cachePath);

echo "  " . count($bladeFiles) . " 個元件 / {$renders} 次渲染，{$failures} 個失敗\n";
exit($failures > 0 ? 1 : 0);
