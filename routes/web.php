<?php

use App\Http\Controllers\ProfileCompletionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Routes requiring complete profile
Route::middleware(['auth', 'profile.complete'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    // Add other routes requiring completed profile here
});

// Auth routes that don't require complete profile
Route::middleware(['auth'])->group(function () {
    Route::get("profile/setup", [ProfileCompletionController::class, 'create'])->name('profile.setup');
    Route::post("profile/setup", [ProfileCompletionController::class, 'store'])->name('profile.complete');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
