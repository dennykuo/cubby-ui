@props([
    'min' => null,
    'max' => null,
])

<div
    {{ $attributes->class(['cu-calendar']) }}
    data-cu-calendar
    @if($min) data-cu-calendar-min="{{ $min }}" @endif
    @if($max) data-cu-calendar-max="{{ $max }}" @endif
>
    <div class="cu-calendar-header">
        <button type="button" class="cu-calendar-nav" data-cu-calendar-prev aria-label="Previous month">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <span class="cu-calendar-title" data-cu-calendar-title></span>
        <button type="button" class="cu-calendar-nav" data-cu-calendar-next aria-label="Next month">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
    </div>
    <div class="cu-calendar-weekdays">
        @foreach(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as $day)
            <span class="cu-calendar-weekday">{{ $day }}</span>
        @endforeach
    </div>
    <div class="cu-calendar-grid" data-cu-calendar-grid></div>
</div>
