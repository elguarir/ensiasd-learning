<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureInstructorOwnership
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Get the course from the route parameters
        $course = $request->route('course');

        // Check if the user is the instructor of the course
        if (!$course || $request->user()->id !== $course->instructor_id) {
            return redirect()->route('dashboard.courses')
                ->with('error', 'You are not authorized to modify this course');
        }

        return $next($request);
    }
}
