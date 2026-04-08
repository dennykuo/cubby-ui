@props([
    'level' => 1,
])

@php
$tag = 'h' . $level;
$baseClass = 'cu-h' . $level;
@endphp

<{{ $tag }} {{ $attributes->class([$baseClass]) }}>
    {{ $slot }}
</{{ $tag }}>
