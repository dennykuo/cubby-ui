@props([
    'defaultSize' => 50,
    'minSize' => null,
    'maxSize' => null,
])

<div
    {{ $attributes->class(['cu-resizable-panel']) }}
    data-cu-resizable-panel
    style="flex-grow: {{ $defaultSize }}"
    @if(! is_null($minSize)) data-cu-min-size="{{ $minSize }}" @endif
    @if(! is_null($maxSize)) data-cu-max-size="{{ $maxSize }}" @endif
    {{ $attributes->except('class') }}
>
    {{ $slot }}
</div>
