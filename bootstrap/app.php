<?php

use App\Http\Middleware\EnsureInstructorOwnership;
use App\Http\Middleware\EnsureProfileIsComplete;
use App\Http\Middleware\HandleInertiaRequests;
use App\Providers\AuthServiceProvider;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
        $middleware->alias([
            'profile.complete' => EnsureProfileIsComplete::class,
            'instructor.ownership' => EnsureInstructorOwnership::class
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })
    ->withProviders([
        AuthServiceProvider::class,
    ])
    ->create();
