<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateCourseRequest;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
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

    public function join(Request $request)
    {
        $request->validate([
            'code' => 'required|string|max:255',
        ], [
            'code.required' => 'Course code is required',
            'code.string' => 'Course code must be a string',
            'code.max' => 'Course code must be less than 255 characters',
        ]);

        $course = Course::where('code', $request->code)->first();
        if (!$course) {
            return redirect()->back()->withErrors('Invalid course code');
        }

        $request->user()->courses()->attach($course->id);
        return redirect()->back()->with('success', 'Course joined successfully');
    }

    /**
     * Store a newly created course in storage.
     */
    public function store(CreateCourseRequest $request)
    {
        // Get validated data
        $validated = $request->validated();
        
        $code = strtoupper(Str::random(8));
        
        // Ensure code uniqueness
        while (Course::where('code', $code)->exists()) {
            $code = strtoupper(Str::random(8));
        }
        
        // Handle image upload to S3
        $imageUrl = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('courses', [
                'disk' => 's3',
                'visibility' => 'public',
            ]);
            dd($imagePath);
            
            // Generate the S3 URL for the uploaded image
            $imageUrl = Storage::disk('s3')->url($imagePath);
        }

        // Create the course
        $course = Course::create([
            'instructor_id' => $request->user()->id,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'code' => $code,
            'image' => $imageUrl,
            'category' => $validated['category'],
            'status' => 'draft',
        ]);

        return redirect()->route('dashboard.courses')->with('success', 'Course created successfully');
    }
}
