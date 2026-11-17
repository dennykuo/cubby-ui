@props([
    'value' => 0,
    'max' => 5,
    'size' => null,
    'readonly' => false,
    'disabled' => false,
    'name' => null,
    'starText' => null,
])

@if($name)
{{-- 不需 JS 的表單評分（radio 寫法）：選取值以 name 隨表單送出，readonly 不適用（原生 radio 沒有唯讀） --}}
<div
    {{ $attributes->class([
        'cu-rating',
        'cu-rating-' . $size => $size && $size !== 'default',
    ])->merge(['role' => 'radiogroup', 'aria-label' => 'Rating']) }}
>
    @for($i = 1; $i <= $max; $i++)
        @php
            $starLabel = $starText ? str_replace('{value}', (string) $i, $starText) : ($i === 1 ? '1 star' : $i . ' stars');
        @endphp
        <label class="cu-rating-label">
            <input type="radio" class="cu-rating-input" name="{{ $name }}" value="{{ $i }}" aria-label="{{ $starLabel }}" @checked($i === (int) round($value)) @disabled($disabled)>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
        </label>
    @endfor
</div>
@else
<div
    {{ $attributes->class([
        'cu-rating',
        'cu-rating-' . $size => $size && $size !== 'default',
        'cu-rating-readonly' => $readonly,
        'cu-rating-disabled' => $disabled,
    ])->merge(['role' => 'img', 'aria-label' => $value . ' out of ' . $max . ' stars']) }}
>
    @for($i = 0; $i < $max; $i++)
        @php
            $filled = $i < floor($value);
            $half = !$filled && $i < $value;
        @endphp
        <span @class([
            'cu-rating-item',
            'cu-rating-item-active' => $filled,
            'cu-rating-item-half' => $half,
        ])>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            @if($half)
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="clip-path: inset(0 50% 0 0); position: absolute; top: 0; left: 0;">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            @endif
        </span>
    @endfor
</div>
@endif
