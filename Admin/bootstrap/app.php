<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Disable all session and auth middleware
        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
        
        // Remove all session and auth middleware
        $middleware->web(remove: [
            'Illuminate\Session\Middleware\StartSession',
            'Illuminate\View\Middleware\ShareErrorsFromSession',
            'Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse',
            'Illuminate\Cookie\Middleware\EncryptCookies',
            'Illuminate\Foundation\Http\Middleware\ValidateCsrfToken',
            'Illuminate\Foundation\Http\Middleware\PreventRequestsDuringMaintenance',
            'Illuminate\Http\Middleware\HandleCors',
            'Illuminate\Http\Middleware\TrustProxies',
            'Illuminate\Foundation\Http\Middleware\InvokeDeferredCallbacks',
            'Illuminate\Http\Middleware\ValidatePathEncoding',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
