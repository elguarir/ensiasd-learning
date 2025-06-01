<?php

namespace App\Traits;

use App\Models\Course;
use App\Models\User;
use Illuminate\Http\RedirectResponse;

trait CourseAccessControl
{
    /**
     * Check if the user has access to the course.
     *
     * @param Course $course
     * @param User|null $user
     * @return bool|RedirectResponse
     */
    protected function checkCourseAccess(Course $course, ?User $user = null)
    {
        $user = $user ?? request()->user();
        
        $isInstructor = $user->id === $course->instructor_id;
        $isEnrolled = $user->courses()->where('course_id', $course->id)->exists();

        if (!$isInstructor && !$isEnrolled) {
            return redirect()->route('dashboard.courses')->with('error', 'You are not enrolled in this course');
        }

        return true;
    }

    /**
     * Get common course data for headers.
     *
     * @param Course $course
     * @return array
     */
    protected function getCourseHeaderData(Course $course): array
    {
        return [
            'enrollmentCount' => $course->enrollments()->count(),
            'chaptersCount' => $course->chapters()->count(),
            'assignmentsCount' => $course->assignments()->where('published', true)->count(),
        ];
    }

    /**
     * Load course with instructor data.
     *
     * @param Course $course
     * @return Course
     */
    protected function loadCourseWithInstructor(Course $course): Course
    {
        return $course->load(['instructor' => function ($query) {
            $query->select('id', 'name', 'username', 'email', 'avatar');
        }]);
    }
} 