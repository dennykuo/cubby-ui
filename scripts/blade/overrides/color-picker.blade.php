@props([
    'value' => '#ff0000',
    'swatches' => null,
])

<div
	{{ $attributes->class(['cu-color-picker']) }}
	data-cu-color-picker
	data-cu-color-picker-value="{{ $value }}"
>
	<div class="cu-color-picker-saturation" data-cu-color-picker-saturation>
		<div class="cu-color-picker-saturation-pointer" data-cu-color-picker-saturation-pointer></div>
	</div>

	<div class="cu-color-picker-hue" data-cu-color-picker-hue>
		<div class="cu-color-picker-hue-pointer" data-cu-color-picker-hue-pointer></div>
	</div>

	<div class="cu-color-picker-controls">
		<div class="cu-color-picker-preview" data-cu-color-picker-preview></div>
		<input
			type="text"
			class="cu-color-picker-input"
			data-cu-color-picker-input
			value="{{ $value }}"
			maxlength="7"
			spellcheck="false"
			autocomplete="off"
		/>
	</div>

	<input type="hidden" data-cu-color-picker-hidden value="{{ $value }}" />

	@if(is_iterable($swatches) && ! empty($swatches))
		<div class="cu-color-picker-swatches">
			@foreach($swatches as $color)
				<button
					type="button"
					class="cu-color-picker-swatch"
					data-cu-color-picker-swatch="{{ $color }}"
					style="background-color: {{ $color }};"
					aria-label="Select {{ $color }}"
				></button>
			@endforeach
		</div>
	@endif
</div>
