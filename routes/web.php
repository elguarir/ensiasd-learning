<?php

use App\Http\Controllers\CourseController;
use App\Http\Controllers\ProfileCompletionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'profile.complete'])->group(function () {
    Route::prefix('dashboard')->name('dashboard.')->group(function () {

        Route::get('/', function () {
            return Inertia::render('dashboard');
        })->name('index');

        Route::get('courses', [CourseController::class, 'view'])->name('courses');
    });
});

// Auth routes that don't require complete profile
Route::middleware(['auth'])->group(function () {
    Route::get("profile/setup", [ProfileCompletionController::class, 'create'])->name('profile.setup');
    Route::post("profile/setup", [ProfileCompletionController::class, 'store'])->name('profile.complete');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
