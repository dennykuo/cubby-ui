@props([
    'language' => null,
    'filename' => null,
    'theme' => null,
    'variant' => null,
])

{{-- CodeBlock.astro 的 frontmatter 以計算變數決定主題（theme ?? variant ?? "dark"）、header 與 language-xxx class，
     轉換器無法自動轉為 PHP，因此手寫 override --}}
@php
    $codeTheme = $theme ?? $variant ?? 'dark';
    $langClass = $language ? 'language-' . strtolower($language) : null;
@endphp

<div {{ $attributes->class(['cu-code-block', 'cu-code-block-light' => $codeTheme === 'light']) }} data-cu-code-block>
    @if($filename || $language)
        <div class="cu-code-block-header">
            <span>{{ $filename ?: $language }}</span>
            <button type="button" class="cu-code-block-copy" data-cu-code-block-copy>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                <span data-cu-code-block-label>Copy</span>
            </button>
        </div>
    @else
        <button type="button" class="cu-code-block-copy" data-cu-code-block-copy>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            <span data-cu-code-block-label>Copy</span>
        </button>
    @endif
    <pre class="cu-code-block-pre"><code @if($langClass) class="{{ $langClass }}" @endif>{{ $slot }}</code></pre>
</div>
