@props([
    'length' => 4,
    'type' => 'numeric',
    'disabled' => false,
    'error' => false,
    'size' => 'default',
])

<div
    {{ $attributes->class([
        'cu-pin-input',
        'cu-pin-input-sm' => $size === 'sm',
        'cu-pin-input-lg' => $size === 'lg',
        'cu-pin-input-error' => $error,
    ]) }}
    data-cu-pin-input
    data-cu-pin-input-type="{{ $type }}"
>
    @for($i = 0; $i < $length; $i++)
        <input
            class="cu-pin-input-field"
            type="text"
            maxlength="1"
            inputmode="{{ $type === 'numeric' ? 'numeric' : 'text' }}"
            autocomplete="one-time-code"
            @if($disabled) disabled @endif
        />
    @endfor
</div>
