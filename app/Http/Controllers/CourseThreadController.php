<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseThread;
use App\Models\ThreadComment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseThreadController extends Controller
{
    /**
     * Display a listing of the threads.
     */
    public function index(Course $course)
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

        // Load threads with their authors and comments
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

        return Inertia::render('dashboard/courses/students/threads', [
            'course' => $course,
            'threads' => $threads,
        ]);
    }

    /**
     * Display the specified thread.
     */
    public function show(Course $course, CourseThread $thread)
    {
        // Check if the user is enrolled in the course or is the instructor
        $user = request()->user();
        $isInstructor = $user->id === $course->instructor_id;
        $isEnrolled = $user->courses()->where('course_id', $course->id)->exists();

        if (!$isInstructor && !$isEnrolled) {
            return redirect()->route('dashboard.courses')->with('error', 'You are not enrolled in this course');
        }

        // Load the thread with its author, comments, and attachments
        $thread->load([
            'author' => function ($query) {
                $query->select('id', 'name', 'username', 'avatar');
            },
            'comments' => function ($query) {
                $query->orderBy('created_at');
            },
            'comments.author' => function ($query) {
                $query->select('id', 'name', 'username', 'avatar');
            },
            'comments.attachments',
            'attachments',
        ]);

        return Inertia::render('dashboard/courses/students/thread', [
            'course' => $course,
            'thread' => $thread,
        ]);
    }

    /**
     * Store a newly created thread.
     */
    public function store(Request $request, Course $course)
    {
        // Check if the user is enrolled in the course or is the instructor
        $user = $request->user();
        $isInstructor = $user->id === $course->instructor_id;
        $isEnrolled = $user->courses()->where('course_id', $course->id)->exists();

        if (!$isInstructor && !$isEnrolled) {
            return redirect()->route('dashboard.courses')->with('error', 'You are not enrolled in this course');
        }

        $validated = $request->validate([
            'title' => 'required|string|min:3|max:255',
            'body' => 'required|string|min:1',
            'attachments.*' => 'nullable|file|max:5120', // 5MB max per file
        ]);

        $thread = $course->threads()->create([
            'author_id' => $user->id,
            'title' => $validated['title'],
            'content' => $validated['body'],
        ]);

        // Handle file attachments
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('thread-attachments', 'public');

                $thread->attachments()->create([
                    'filename' => $file->getClientOriginalName(),
                    'path' => $path,
                    'mime_type' => $file->getMimeType(),
                    'size' => $file->getSize(),
                    'extension' => $file->getClientOriginalExtension(),
                    'collection' => 'thread-attachments',
                    'is_private' => false,
                ]);
            }
        }

        return redirect()->route('courses.threads.show', ['course' => $course->id, 'thread' => $thread->id])
            ->with('success', 'Thread created successfully.');
    }

    /**
     * Store a comment on a thread.
     */
    public function storeComment(Request $request, Course $course, CourseThread $thread)
    {
        // Check if the user is enrolled in the course or is the instructor
        $user = $request->user();
        $isInstructor = $user->id === $course->instructor_id;
        $isEnrolled = $user->courses()->where('course_id', $course->id)->exists();

        if (!$isInstructor && !$isEnrolled) {
            return response()->json(['error' => 'You are not authorized to comment on this thread'], 403);
        }

        $validated = $request->validate([
            'content' => 'required|string|min:1|max:5000',
            'parent_id' => 'nullable|exists:thread_comments,id',
            'attachments.*' => 'nullable|file|max:5120', // 5MB max per file
        ]);

        $comment = $thread->comments()->create([
            'author_id' => $user->id,
            'content' => $validated['content'],
            'parent_id' => $validated['parent_id'] ?? null,
        ]);

        // Handle file attachments
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('comment-attachments', 'public');

                $comment->attachments()->create([
                    'filename' => $file->getClientOriginalName(),
                    'path' => $path,
                    'mime_type' => $file->getMimeType(),
                    'size' => $file->getSize(),
                    'extension' => $file->getClientOriginalExtension(),
                    'collection' => 'comment-attachments',
                    'is_private' => false,
                ]);
            }
        }

        // Return the comment with the user information for frontend
        $comment->load([
            'author' => function ($query) {
                $query->select('id', 'name', 'username', 'avatar');
            },
            'attachments'
        ]);

        return back()->with('success', 'Comment added successfully.');
    }

    /**
     * Delete a thread.
     */
    public function destroy(Course $course, CourseThread $thread)
    {
        $user = request()->user();

        // Only the author or instructor can delete a thread
        if ($user->id !== $thread->author_id && $user->id !== $course->instructor_id) {
            return redirect()->back()->with('error', 'You are not authorized to delete this thread');
        }

        $thread->delete();

        return redirect()->route('courses.threads.index', $course->id)
            ->with('success', 'Thread deleted successfully.');
    }

    /**
     * Delete a comment.
     */
    public function destroyComment(Course $course, CourseThread $thread, ThreadComment $comment)
    {
        $user = request()->user();

        // Only the author or instructor can delete a comment
        if ($user->id !== $comment->author_id && $user->id !== $course->instructor_id) {
            return back()->with('error', 'You are not authorized to delete this comment');
        }

        // Optional: Verify that the comment belongs to the thread
        if ($comment->thread_id !== $thread->id) {
            return back()->with('error', 'Comment does not belong to this thread');
        }

        $comment->delete();

        return back()->with('success', 'Comment deleted successfully');
    }
}
