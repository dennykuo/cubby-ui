@props([
    'id' => null,
    'label' => 'Navigation menu',
    'clone' => false,
])

@php
    $panelId = $id . '-panel';
@endphp

<div
    id="{{ $id }}"
    {{ $attributes->class(['cu-header-mobile-backdrop']) }}
    data-cu-mobile-nav
></div>
<nav
    id="{{ $panelId }}"
    class="cu-header-mobile-nav"
    data-cu-mobile-nav-panel="{{ $id }}"
    @if($clone) data-cu-mobile-nav-clone @endif
    role="dialog"
    aria-modal="true"
    aria-label="{{ $label }}"
    {{ $attributes->except('class') }}
>
    <div class="cu-header-mobile-header">
        @if(! isset($header) || $header->isEmpty())
            <span class="text-base font-semibold tracking-tight">{{ $brand ?? '' }}</span>
        @else
            {{ $header }}
        @endif
        <button data-cu-mobile-nav-close class="cu-header-mobile-close" aria-label="Close menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            <span class="sr-only">Close</span>
        </button>
    </div>
    <div class="cu-header-mobile-content">
        {{ $slot }}
    </div>
</nav>
