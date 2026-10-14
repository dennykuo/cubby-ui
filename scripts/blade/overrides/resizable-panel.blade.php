@props([
    'defaultSize' => 50,
    'minSize' => null,
    'maxSize' => null,
])

<div
    {{ $attributes->class(['cu-resizable-panel'])->merge(['style' => 'flex-grow: ' . $defaultSize . ';']) }}
    data-cu-resizable-panel
    @if(! is_null($minSize)) data-cu-min-size="{{ $minSize }}" @endif
    @if(! is_null($maxSize)) data-cu-max-size="{{ $maxSize }}" @endif
>
    {{ $slot }}
</div>
