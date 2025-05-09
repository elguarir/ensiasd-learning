<?php

use App\Http\Controllers\ChapterController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\ProfileCompletionController;
use App\Http\Controllers\ResourceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return view('home');
})->name('home');

Route::get('/about', function () {
    return view('about');
})->name('about');

Route::get('/publications', function () {
    return view('publications');
})->name('publications');

Route::get('/courses', function () {
    return view('courses');
})->name('courses');

Route::get('/contact', function () {
    return view('contact');
})->name('contact');


Route::middleware(['auth', 'profile.complete'])->group(function () {
    Route::prefix('dashboard')->name('dashboard.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('dashboard');
        })->name('index');

        Route::get('courses', [CourseController::class, 'view'])->name('courses');
        Route::get('courses/{course}', [CourseController::class, 'show'])->name('courses.show');

        Route::get('courses/{course}/students', [CourseController::class, 'students'])->name('courses.students');
        Route::delete('courses/{course}/students/{enrollment}', [CourseController::class, 'removeStudent'])->name('courses.students.remove');
        Route::put('courses/{course}/students/{enrollment}', [CourseController::class, 'updateStudentStatus'])->name('courses.students.update');
        Route::put('courses/{course}/status', [CourseController::class, 'updateStatus'])->name('courses.status');
        Route::delete('courses/{course}', [CourseController::class, 'destroy'])->name('courses.destroy');
    });

    // Courses
    Route::post('courses/join', [CourseController::class, 'join'])->name('courses.join');
    Route::post('courses', [CourseController::class, 'store'])->name('courses.store');
    Route::post('courses/{course}/chapters', [ChapterController::class, 'store'])->name('courses.chapters.store');
    Route::post('courses/{course}/chapters/reorder', [ChapterController::class, 'reorder'])->name('courses.chapters.reorder');

    // Chapters
    Route::put('chapters/{chapter}', [ChapterController::class, 'update'])->name('chapters.update');
    Route::delete('chapters/{chapter}', [ChapterController::class, 'destroy'])->name('chapters.destroy');

    // Resources
    Route::post('resources', [ResourceController::class, 'store'])->name('resources.store');
    Route::delete('resources/{resource}', [ResourceController::class, 'destroy'])->name('resources.destroy');
});

// Auth routes that don't require complete profile
Route::middleware(['auth'])->group(function () {
    Route::get("profile/setup", [ProfileCompletionController::class, 'create'])->name('profile.setup');
    Route::post("profile/setup", [ProfileCompletionController::class, 'store'])->name('profile.complete');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
