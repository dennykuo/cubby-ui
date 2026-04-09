<?php

namespace App\Providers;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;

class CubbyUiServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Load Cubby UI Blade components from node_modules.
        // Usage: <x-cu.button>, <x-cu.card>, <x-cu.card.header>, etc.
        //
        // Default path works for standard npm/yarn/pnpm installs.
        // For monorepos with hoisted deps, override in config/cubby-ui.php:
        //   'components_path' => base_path('../../node_modules/cubby-ui/dist/laravel/components'),
        $path = config(
            'cubby-ui.components_path',
            base_path('node_modules/cubby-ui/dist/laravel/components')
        );

        Blade::anonymousComponentPath($path, 'cu');
    }
}
