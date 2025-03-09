<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CourseController extends Controller
{

    public function view(Request $request)
    {
        return Inertia::render('dashboard/courses/index');
    }
}
