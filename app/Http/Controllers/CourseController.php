<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseController extends Controller
{

    public function view(Request $request)
    {
        $role = $request->user()->role;
        if ($role == "instructor") {
            return Inertia::render('dashboard/courses/instructors/index');
        } else {
            $courses = $request->user()->courses;
            return Inertia::render('dashboard/courses/students/index', [
                'courses' => $courses,
            ]);
        }
    }
}
