<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\AnnouncementComment;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class AnnouncementController extends Controller
{
    /**
     * Store a newly created announcement.
     */
    public function store(Request $request, Course $course)
    {
        // Check if user can manage the course
        Gate::authorize('manage-course', $course);

        $validated = $request->validate([
            'content' => 'required|string|min:1',
            'attachments.*' => 'nullable|file|max:5120', // 5MB max per file
        ]);

        $announcement = $course->announcements()->create([
            'user_id' => $request->user()->id,
            'content' => $validated['content'],
        ]);

        // Handle file attachments
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('announcement-attachments', 'public');

                $announcement->attachments()->create([
                    'filename' => $file->getClientOriginalName(),
                    'path' => $path,
                    'mime_type' => $file->getMimeType(),
                    'size' => $file->getSize(),
                    'extension' => $file->getClientOriginalExtension(),
                    'collection' => 'announcement-attachments',
                    'is_private' => false,
                ]);
            }
        }

        return redirect()->back()->with('success', 'Announcement posted successfully.');
    }

    /**
     * Store a comment on an announcement.
     */
    public function storeComment(Request $request, Announcement $announcement)
    {
        // Load the course if not already loaded
        if (!$announcement->relationLoaded('course')) {
            $announcement->load('course');
        }

        $course = $announcement->course;

        // Check if user is enrolled in the course or is the instructor
        $user = $request->user();
        $isInstructor = $user->id === $course->instructor_id;
        $isEnrolled = $user->courses()->where('course_id', $course->id)->exists();

        if (!$isInstructor && !$isEnrolled) {
            return redirect()->back()->with('error', 'You are not authorized to comment on this announcement');
        }

        $validated = $request->validate([
            'content' => 'required|string|min:1|max:1000',
            'attachments.*' => 'nullable|file|max:5120', // 5MB max per file
        ]);

        $comment = $announcement->comments()->create([
            'user_id' => $request->user()->id,
            'content' => $validated['content'],
        ]);

        // Handle file attachments
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('announcement-comment-attachments', 'public');

                $comment->attachments()->create([
                    'filename' => $file->getClientOriginalName(),
                    'path' => $path,
                    'mime_type' => $file->getMimeType(),
                    'size' => $file->getSize(),
                    'extension' => $file->getClientOriginalExtension(),
                    'collection' => 'announcement-comment-attachments',
                    'is_private' => false,
                ]);
            }
        }

        return redirect()->back()->with('success', 'Comment added successfully');
    }

    /**
     * Delete an announcement.
     */
    public function destroy(Announcement $announcement)
    {
        // Load the course if not already loaded
        if (!$announcement->relationLoaded('course')) {
            $announcement->load('course');
        }

        // Check if user can manage the course
        Gate::authorize('manage-course', $announcement->course);

        // Delete all attached files
        foreach ($announcement->attachments as $attachment) {
            if (Storage::exists($attachment->path)) {
                Storage::delete($attachment->path);
            }
            $attachment->delete();
        }
        
        $announcement->delete();

        return redirect()->back()->with('success', 'Announcement deleted successfully.');
    }

    /**
     * Delete a comment.
     */
    public function destroyComment(AnnouncementComment $comment)
    {
        // Load the announcement and course if not already loaded
        if (!$comment->relationLoaded('announcement')) {
            $comment->load(['announcement.course']);
        }

        $course = $comment->announcement->course;
        $user = request()->user();

        // Users can delete their own comments, instructors can delete any comment
        if ($user->id !== $comment->user_id && $user->id !== $course->instructor_id) {
            return redirect()->back()->with('error', 'You are not authorized to delete this comment');
        }

        // Delete all attached files
        foreach ($comment->attachments as $attachment) {
            if (Storage::exists($attachment->path)) {
                Storage::delete($attachment->path);
            }
            $attachment->delete();
        }
        
        $comment->delete();

        return redirect()->back()->with('success', 'Comment deleted successfully');
    }
} 