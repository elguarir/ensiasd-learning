<?php

namespace App\Providers;

use App\Models\Course;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // Define a gate to check if a user is the instructor of a course
        Gate::define('manage-course', function ($user, Course $course) {
            return $user->id === $course->instructor_id;
        });
    }
} 