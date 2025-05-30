<?php

use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\ChapterController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CourseThreadController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileCompletionController;
use App\Http\Controllers\QuizController;
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

Route::get('/contact', function () {
    return view('contact');
})->name('contact');

Route::get('/', [DashboardController::class, 'showHome'])->name('home');
Route::get('/courses', [DashboardController::class, 'showCourses'])->name('courses');
Route::put('/courses', [DashboardController::class, 'showCoursesByFiltre'])->name('courses.showCoursesByFiltre');
Route::get('/publications', [DashboardController::class, 'showPublications'])->name('publications');
Route::get('/about', [DashboardController::class, 'showAbout'])->name('about');
Route::get('/contact', [DashboardController::class, 'showContact'])->name('contact');

Route::prefix('app')->group(function () {
    Route::get('/home', [DashboardController::class, 'editHomeContent'])->name('app.home.edit');
    Route::put('/home', [DashboardController::class, 'updateHomeContent'])->name('app.home.update');
    Route::get('/about', [DashboardController::class, 'editAboutContent'])->name('app.about.edit');
    Route::put('/about', [DashboardController::class, 'updateAboutContent'])->name('app.about.update');
    Route::put('/contact', [DashboardController::class, 'updateContactContent'])->name('app.contact.update');
    Route::get('/', [DashboardController::class, 'editPublicPages'])->name('app.pages.edit');
    Route::post('/publications', [DashboardController::class, 'storePublication'])->name('app.publications.store');
    Route::delete('/publications/{publication}', [DashboardController::class, 'destroy'])->name('app.publications.destroy');
});

// dashbaord controller
Route::middleware(['auth', 'profile.complete'])->group(function () {
    Route::prefix('dashboard')->name('dashboard.')->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('index');

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
    Route::get('courses/join/{inviteToken}', [CourseController::class, 'joinViaLink'])->name('courses.join.link');
    Route::post('courses', [CourseController::class, 'store'])->name('courses.store');
    Route::post('courses/{course}/chapters', [ChapterController::class, 'store'])->name('courses.chapters.store');
    Route::post('courses/{course}/chapters/reorder', [ChapterController::class, 'reorder'])->name('courses.chapters.reorder');

    // Chapters
    Route::put('chapters/{chapter}', [ChapterController::class, 'update'])->name('chapters.update');
    Route::delete('chapters/{chapter}', [ChapterController::class, 'destroy'])->name('chapters.destroy');

    // Resources
    Route::post('resources', [ResourceController::class, 'store'])->name('resources.store');
    Route::delete('resources/{resource}', [ResourceController::class, 'destroy'])->name('resources.destroy');

    // Quiz
    Route::post('quiz/generate', [QuizController::class, 'generateQuiz'])->name('quiz.generate');

    // Announcements
    Route::post('courses/{course}/announcements', [AnnouncementController::class, 'store'])->name('courses.announcements.store');
    Route::delete('announcements/{announcement}', [AnnouncementController::class, 'destroy'])->name('announcements.destroy');
    Route::post('announcements/{announcement}/comments', [AnnouncementController::class, 'storeComment'])->name('announcements.comments.store');
    Route::delete('announcement-comments/{comment}', [AnnouncementController::class, 'destroyComment'])->name('announcement-comments.destroy');

    // Course Threads (Discussions)
    Route::get('courses/{course}/threads', [CourseThreadController::class, 'index'])->name('courses.threads.index');
    Route::get('courses/{course}/threads/{thread}', [CourseThreadController::class, 'show'])->name('courses.threads.show');
    Route::post('courses/{course}/threads', [CourseThreadController::class, 'store'])->name('courses.threads.store');
    Route::delete('courses/{course}/threads/{thread}', [CourseThreadController::class, 'destroy'])->name('courses.threads.destroy');
    Route::post('courses/{course}/threads/{thread}/comments', [CourseThreadController::class, 'storeComment'])->name('courses.threads.comments.store');
    Route::delete('courses/{course}/threads/{thread}/comments/{comment}', [CourseThreadController::class, 'destroyComment'])->name('courses.threads.comments.destroy');
});

// Auth routes that don't require complete profile
Route::middleware(['auth'])->group(function () {
    Route::get("profile/setup", [ProfileCompletionController::class, 'create'])->name('profile.setup');
    Route::post("profile/setup", [ProfileCompletionController::class, 'store'])->name('profile.complete');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
