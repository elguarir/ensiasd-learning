<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateCourseRequest;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\Assignment;
use App\Models\Announcement;

class CourseController extends Controller
{

    public function view(Request $request)
    {
        $role = $request->user()->role;

        if ($role == "instructor") {
            // Get courses created by this instructor with counts
            $courses = $request->user()->createdCourses()
                ->withCount('students')
                ->withCount('chapters')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($course) {
                    // Format the course for frontend display
                    return [
                        'id' => $course->id,
                        'instructor_id' => $course->instructor_id,
                        'title' => $course->title,
                        'description' => $course->description,
                        'image' => $course->image,
                        'code' => $course->code,
                        'color' => $course->color,
                        'category' => $course->category,
                        'status' => $course->status,
                        'published_at' => $course->published_at,
                        'created_at' => $course->created_at,
                        'updated_at' => $course->updated_at,
                        'students_count' => $course->students_count,
                        'chapters_count' => $course->chapters_count,
                    ];
                });

            return Inertia::render('dashboard/courses/instructors/index', [
                'courses' => $courses,
            ]);
        } else {
            $courses = $request->user()->courses()->with(['instructor' => function ($query) {
                $query->select('id', 'name', 'avatar', 'username');
            }])
                ->withPivot('enrolled_at')
                ->get()
                ->map(function ($course) {
                    $course->enrollment = $course->pivot;
                    unset($course->pivot);
                    return $course;
                });

            return Inertia::render('dashboard/courses/students/index', [
                'courses' => $courses,
            ]);
        }
    }

    public function show(Course $course)
    {
        // Check if the user is enrolled in the course or is the instructor
        $user = request()->user();
        $isInstructor = $user->id === $course->instructor_id;
        $isEnrolled = $user->courses()->where('course_id', $course->id)->exists();

        if (!$isInstructor && !$isEnrolled) {
            return redirect()->route('dashboard.courses')->with('error', 'You are not enrolled in this course');
        }

        // Load the course with its instructor
        $course->load(['instructor' => function ($query) {
            $query->select('id', 'name', 'username', 'email', 'avatar');
        }]);

        // Load chapters with their resources
        $chapters = $course->chapters()
            ->with(['resources' => function ($query) {
                $query->orderBy('position');
            }])
            ->orderBy('position')
            ->get();

        // Load published assignments
        $assignments = $course->hasMany(Assignment::class)
            ->where('published', true)
            ->orderBy('due_date')
            ->get();

        // Load student's submissions for each assignment if they're a student
        if (!$isInstructor) {
            $submissions = $user->submissions()
                ->whereIn('assignment_id', $assignments->pluck('id'))
                ->get()
                ->keyBy('assignment_id');

            // Add submission data to each assignment
            $assignments->map(function ($assignment) use ($submissions) {
                $assignment->user_submission = $submissions->get($assignment->id);
                return $assignment;
            });
        }

        // Load announcements with comments and their authors
        $announcements = $course->hasMany(Announcement::class)
            ->with(['user' => function ($query) {
                $query->select('id', 'name', 'username', 'avatar');
            }, 'comments' => function ($query) {
                $query->orderBy('created_at');
            }, 'comments.user' => function ($query) {
                $query->select('id', 'name', 'username', 'avatar');
            }])
            ->latest()
            ->get();

        // Load course threads with their authors and comments
        $threads = $course->threads()
            ->with(['author' => function ($query) {
                $query->select('id', 'name', 'username', 'avatar');
            }, 'comments' => function ($query) {
                $query->orderBy('created_at');
            }, 'comments.author' => function ($query) {
                $query->select('id', 'name', 'username', 'avatar');
            }])
            ->latest()
            ->get();

        // Get enrollment data
        $enrollmentCount = $course->enrollments()->count();

        return Inertia::render('dashboard/courses/students/view', [
            'course' => $course,
            'chapters' => $chapters,
            'assignments' => $assignments,
            'announcements' => $announcements,
            'threads' => $threads,
            'enrollmentCount' => $enrollmentCount,
        ]);
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

        // Check if user is already enrolled in the course
        if ($request->user()->courses()->where('course_id', $course->id)->exists()) {
            return redirect()->back()->withErrors('You are already enrolled in this course');
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

        $code = strtoupper(Str::random(6));

        // Ensure code uniqueness
        while (Course::where('code', $code)->exists()) {
            $code = strtoupper(Str::random(6));
        }

        // Handle image upload to S3
        $imageUrl = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('courses', [
                'disk' => 's3',
                'visibility' => 'public',
            ]);

            // Generate the S3 URL for the uploaded image
            $imageUrl = Storage::url($imagePath);
        }

        // Create the course
        $course = Course::create([
            'instructor_id' => $request->user()->id,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'code' => $code,
            'color' => $validated['color'],
            'image' => $imageUrl,
            'category' => $validated['category'],
            'status' => 'draft',
        ]);

        return redirect()->back()->with('success', 'Course created successfully!');
    }
}
