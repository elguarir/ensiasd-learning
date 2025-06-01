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
use App\Models\CourseEnrollment;
use App\Traits\CourseAccessControl;

class CourseController extends Controller
{
    use CourseAccessControl;

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
                        'invite_token' => $course->invite_token,
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
        // Check access
        $accessResult = $this->checkCourseAccess($course);
        if ($accessResult !== true) {
            return $accessResult;
        }

        // Load the course with its instructor
        $course = $this->loadCourseWithInstructor($course);

        // Load chapters with their resources
        $chapters = $course->chapters()
            ->with([
                'resources' => function ($query) {
                    $query->orderBy('position');
                },
                'resources.attachmentResource.attachments',
                'resources.richTextResource',
                'resources.externalResource',
                'resources.quizQuestions.options'
            ])
            ->orderBy('position')
            ->get();

        // Transform resources data for frontend
        $chapters->each(function ($chapter) {
            if ($chapter->resources) {
                $chapter->resources->each(function ($resource) {
                    // Add metadata based on resource type
                    switch ($resource->resource_type) {
                        case 'attachment':
                            if ($resource->attachmentResource) {
                                $fileCount = $resource->attachmentResource->attachments->count();
                                $totalSize = $resource->attachmentResource->attachments->sum('size');

                                $resource->metadata = [
                                    'file_count' => $fileCount,
                                    'total_size' => $totalSize,
                                    'files' => $resource->attachmentResource->attachments->map(function ($attachment) {
                                        return [
                                            'id' => $attachment->id,
                                            'name' => $attachment->filename,
                                            'size' => $attachment->size,
                                            'mime_type' => $attachment->mime_type,
                                            'path' => Storage::url($attachment->path),
                                        ];
                                    })->toArray(),
                                ];
                            }
                            unset($resource->attachmentResource);
                            break;

                        case 'rich_text':
                            if ($resource->richTextResource) {
                                $resource->metadata = [
                                    'format' => $resource->richTextResource->format,
                                    'content' => $resource->richTextResource->content,
                                    'excerpt' => substr(strip_tags($resource->richTextResource->content), 0, 100) . '...',
                                ];
                            }
                            unset($resource->richTextResource);
                            break;

                        case 'external':
                            if ($resource->externalResource) {
                                $resource->metadata = [
                                    'external_url' => $resource->externalResource->external_url,
                                    'link_title' => $resource->externalResource->link_title,
                                    'link_description' => $resource->externalResource->link_description,
                                    'favicon_url' => $resource->externalResource->favicon_url,
                                ];
                            }
                            unset($resource->externalResource);
                            break;

                        case 'quiz':
                            if ($resource->quizQuestions) {
                                $resource->metadata = [
                                    'question_count' => $resource->quizQuestions->count(),
                                    'total_points' => $resource->quizQuestions->sum('points'),
                                    'questions' => $resource->quizQuestions->map(function ($question) {
                                        return [
                                            'id' => $question->id,
                                            'question' => $question->question,
                                            'options' => $question->options->map(function ($option) {
                                                return [
                                                    'text' => $option->text,
                                                    'is_correct' => $option->is_correct,
                                                ];
                                            })->toArray(),
                                        ];
                                    })->toArray(),
                                ];
                            }
                            unset($resource->quizQuestions);
                            break;
                    }

                    if ($resource->resource_type !== 'rich_text') {
                        unset($resource->richTextResource);
                    }
                    if ($resource->resource_type !== 'attachment') {
                        unset($resource->attachmentResource);
                    }
                    if ($resource->resource_type !== 'external') {
                        unset($resource->externalResource);
                    }
                    if ($resource->resource_type !== 'quiz') {
                        unset($resource->quizQuestions);
                    }
                });
            }
        });

        // Load published assignments for the content tab
        $assignments = $course->assignments()
            ->where('published', true)
            ->with([
                'submissions' => function ($query) {
                    $query->where('user_id', request()->user()->id);
                },
                'attachments',
            ])
            ->orderBy('due_date')
            ->get();

        // Get header data
        $headerData = $this->getCourseHeaderData($course);

        return Inertia::render('dashboard/courses/students/content', [
            'course' => $course,
            'chapters' => $chapters,
            'assignments' => $assignments,
            ...$headerData,
        ]);
    }

    /**
     * Update the course status (publish/unpublish/archive/restore).
     */
    public function updateStatus(Request $request, Course $course)
    {
        // Check if user is the course instructor
        if ($request->user()->id !== $course->instructor_id) {
            return redirect()->route('dashboard.courses')->with('error', 'You are not authorized to update this course');
        }

        $request->validate([
            'status' => 'required|string|in:draft,published,archived',
        ]);

        $oldStatus = $course->status;
        $newStatus = $request->status;

        // Update published_at timestamp if publishing for the first time
        if ($newStatus === 'published' && $oldStatus !== 'published') {
            $course->published_at = now();
        }

        $course->status = $newStatus;
        $course->save();

        $statusMap = [
            'draft' => 'unpublished',
            'published' => 'published',
            'archived' => 'archived'
        ];

        $message = "Course has been " . $statusMap[$newStatus];
        return redirect()->back()->with('success', $message);
    }

    /**
     * Show the course students management page.
     */
    public function students(Course $course)
    {
        // Check if user is the course instructor
        $user = request()->user();
        if ($user->id !== $course->instructor_id) {
            return redirect()->route('dashboard.courses')->with('error', 'You are not authorized to manage this course');
        }

        // Get all enrolled students with their enrollment date
        $students = $course->enrollments()
            ->with('user')
            ->orderBy('enrolled_at', 'desc')
            ->get()
            ->map(function ($enrollment) {
                $student = $enrollment->user;
                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'email' => $student->email,
                    'avatar' => $student->avatar,
                    'username' => $student->username,
                    'enrolled_at' => $enrollment->enrolled_at,
                    'enrollment_id' => $enrollment->id,
                ];
            });

        return Inertia::render('dashboard/courses/instructors/students', [
            'course' => $course,
            'students' => $students,
        ]);
    }

    /**
     * Remove the specified course from storage.
     */
    public function destroy(Course $course)
    {
        // Check if user is the course instructor
        $user = request()->user();
        if ($user->id !== $course->instructor_id) {
            return redirect()->route('dashboard.courses')->with('error', 'You are not authorized to delete this course');
        }

        // Delete course image from S3 if it exists
        if ($course->image) {
            Storage::disk('s3')->delete($course->image);
        }

        $course->delete();

        return redirect()->route('dashboard.courses')->with('success', 'Course deleted successfully');
    }

    public function join(Request $request)
    {
        $request->validate([
            'code' => 'required|string|max:6',
        ], [
            'code.required' => 'Course code is required',
            'code.string' => 'Course code must be a string',
            'code.max' => 'Course code must be less than 6 characters',
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
     * Join a course via invite link
     */
    public function joinViaLink($inviteToken)
    {
        $course = Course::where('invite_token', $inviteToken)->first();

        if (!$course) {
            return redirect()->route('dashboard.courses')->with('error', 'Invalid invite link');
        }

        // Check if course is published
        if (!$course->isPublished()) {
            return redirect()->route('dashboard.courses')->with('error', 'This course is not available for enrollment');
        }

        $user = request()->user();

        // Check if user is already enrolled in the course
        if ($user->courses()->where('course_id', $course->id)->exists()) {
            return redirect()->route('dashboard.courses.show', $course->id)->with('success', 'You are already enrolled in this course');
        }

        // Check if user is the instructor
        if ($user->id === $course->instructor_id) {
            return redirect()->route('dashboard.courses.show', $course->id)->with('info', 'You are the instructor of this course');
        }

        // Enroll the user
        $user->courses()->attach($course->id);

        return redirect()->route('dashboard.courses.show', $course->id)->with('success', 'Successfully joined the course!');
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

        // Generate unique invite token
        $inviteToken = Str::random(32);
        while (Course::where('invite_token', $inviteToken)->exists()) {
            $inviteToken = Str::random(32);
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
            'invite_token' => $inviteToken,
            'color' => $validated['color'],
            'image' => $imageUrl,
            'category' => $validated['category'],
            'status' => 'draft',
        ]);

        return redirect()->back()->with('success', 'Course created successfully!');
    }

    /**
     * Remove a student from the course.
     */
    public function removeStudent(Course $course, CourseEnrollment $enrollment)
    {
        // Check if user is the course instructor
        $user = request()->user();
        if ($user->id !== $course->instructor_id) {
            return redirect()->back()->with('error', 'You are not authorized to manage this course');
        }

        // Make sure the enrollment belongs to this course
        if ($enrollment->course_id !== $course->id) {
            return redirect()->back()->with('error', 'The enrollment does not belong to this course');
        }

        $enrollment->delete();

        return redirect()->back()->with('success', 'Student removed successfully');
    }

    /**
     * Update a student's enrollment status in the course.
     */
    public function updateStudentStatus(Request $request, Course $course, CourseEnrollment $enrollment)
    {
        // Check if user is the course instructor
        $user = request()->user();
        if ($user->id !== $course->instructor_id) {
            return redirect()->back()->with('error', 'You are not authorized to manage this course');
        }

        // Make sure the enrollment belongs to this course
        if ($enrollment->course_id !== $course->id) {
            return redirect()->back()->with('error', 'The enrollment does not belong to this course');
        }

        $request->validate([
            'completed' => 'boolean',
        ]);

        if ($request->has('completed')) {
            $enrollment->completed_at = $request->completed ? now() : null;
            $enrollment->save();
        }

        return redirect()->back()->with('success', 'Student status updated successfully');
    }

    /**
     * Show the course assignments page.
     */
    public function assignments(Course $course)
    {
        // Check access
        $accessResult = $this->checkCourseAccess($course);
        if ($accessResult !== true) {
            return $accessResult;
        }

        // Load the course with its instructor
        $course = $this->loadCourseWithInstructor($course);

        // Check if user is instructor
        $isInstructor = request()->user()->id === $course->instructor_id;

        if ($isInstructor) {
            // For instructors: load all assignments with all submissions for statistics
            $assignments = $course->assignments()
                ->with([
                    'submissions' => function ($query) {
                        $query->with(['user' => function ($userQuery) {
                            $userQuery->select('id', 'name', 'email', 'avatar');
                        }]);
                    },
                    'attachments'
                ])
                ->orderBy('due_date')
                ->get();
        } else {
            // For students: load published assignments with their own submissions
            $assignments = $course->assignments()
                ->where('published', true)
                ->with([
                    'submissions' => function ($query) {
                        $query->where('user_id', request()->user()->id);
                    },
                    'attachments',
                ])
                ->orderBy('due_date')
                ->get();
        }

        // Get header data
        $headerData = $this->getCourseHeaderData($course);

        return Inertia::render('dashboard/courses/students/assignments', [
            'course' => $course,
            'assignments' => $assignments,
            ...$headerData,
        ]);
    }

    /**
     * Show the course announcements page.
     */
    public function announcements(Course $course)
    {
        // Check access
        $accessResult = $this->checkCourseAccess($course);
        if ($accessResult !== true) {
            return $accessResult;
        }

        // Load the course with its instructor
        $course = $this->loadCourseWithInstructor($course);

        // Load announcements with comments, their authors and attachments
        $announcements = $course->announcements()
            ->with(['user' => function ($query) {
                $query->select('id', 'name', 'username', 'avatar');
            }, 'comments' => function ($query) {
                $query->orderBy('created_at');
            }, 'comments.user' => function ($query) {
                $query->select('id', 'name', 'username', 'avatar');
            }, 'attachments'])
            ->latest()
            ->get();

        // Get header data
        $headerData = $this->getCourseHeaderData($course);

        return Inertia::render('dashboard/courses/students/announcements', [
            'course' => $course,
            'announcements' => $announcements,
            ...$headerData,
        ]);
    }

    /**
     * Show the course discussion page.
     */
    public function discussion(Course $course)
    {
        // Check access
        $accessResult = $this->checkCourseAccess($course);
        if ($accessResult !== true) {
            return $accessResult;
        }

        // Load the course with its instructor
        $course = $this->loadCourseWithInstructor($course);

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

        // Get header data
        $headerData = $this->getCourseHeaderData($course);

        return Inertia::render('dashboard/courses/students/discussion', [
            'course' => $course,
            'threads' => $threads,
            ...$headerData,
        ]);
    }
}
