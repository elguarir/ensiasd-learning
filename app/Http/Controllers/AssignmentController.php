<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Course;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use App\Http\Requests\StoreAssignmentRequest;
use App\Http\Requests\UpdateAssignmentRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
class AssignmentController extends Controller
{
    public function store(StoreAssignmentRequest $request, Course $course)
    {
        Gate::authorize('manage-course', $course);

        DB::beginTransaction();

        try {
            $assignment = $course->assignments()->create($request->validated());

            // If it's a quiz, create questions
            if ($assignment->type === 'quiz' && $request->has('questions')) {
                foreach ($request->questions as $position => $questionData) {
                    $question = $assignment->quizQuestions()->create([
                        'question' => $questionData['question'],
                        'position' => $position,
                        'points' => $questionData['points'] ?? 1,
                    ]);

                    foreach ($questionData['options'] as $optionData) {
                        $question->options()->create([
                            'text' => $optionData['text'],
                            'is_correct' => $optionData['is_correct'],
                        ]);
                    }
                }
            }

            // Handle attachments for instructions
            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $path = $file->store('assignment-attachments', [
                        'disk' => 's3',
                        'visibility' => 'public',
                    ]);

                    $url = Storage::url($path);

                    $assignment->attachments()->create([
                        'filename' => $file->getClientOriginalName(),
                        'path' => $url,
                        'mime_type' => $file->getMimeType(),
                        'size' => $file->getSize(),
                        'extension' => $file->getClientOriginalExtension(),
                        'collection' => 'assignment-attachments',
                        'is_private' => false,
                    ]);
                }
            }

            DB::commit();

            return redirect()->back()
                ->with('success', 'Assignment created successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create assignment']);
        }
    }

    public function show(Request $request, Course $course, Assignment $assignment)
    {
        $assignment->load(['attachments', 'quizQuestions.options']);

        $submission = $request->user()->submissions()
            ->where('assignment_id', $assignment->id)
            ->with('attachments', 'quizAnswers')
            ->first();

        return Inertia::render('dashboard/courses/assignments/view', [
            'course' => $course,
            'assignment' => $assignment,
            'submission' => $submission,
        ]);
    }

    public function update(UpdateAssignmentRequest $request, Course $course, Assignment $assignment)
    {
        Gate::authorize('manage-course', $course);

        DB::beginTransaction();

        try {
            $assignment->update($request->validated());

            // Update quiz questions if needed
            if ($assignment->type === 'quiz' && $request->has('questions')) {
                // Delete existing questions
                $assignment->quizQuestions()->delete();

                // Create new questions
                foreach ($request->questions as $position => $questionData) {
                    $question = $assignment->quizQuestions()->create([
                        'question' => $questionData['question'],
                        'position' => $position,
                        'points' => $questionData['points'] ?? 1,
                    ]);

                    foreach ($questionData['options'] as $optionData) {
                        $question->options()->create([
                            'text' => $optionData['text'],
                            'is_correct' => $optionData['is_correct'],
                        ]);
                    }
                }
            }

            DB::commit();

            return redirect()->route('courses.assignments.show', [$course, $assignment])
                ->with('success', 'Assignment updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to update assignment']);
        }
    }

    public function destroy(Course $course, Assignment $assignment)
    {
        Gate::authorize('manage-course', $course);

        $assignment->delete();

        return redirect()->back()
            ->with('success', 'Assignment deleted successfully');
    }

    public function togglePublish(Course $course, Assignment $assignment)
    {
        Gate::authorize('manage-course', $course);

        $assignment->update(['published' => !$assignment->published]);

        return back()->with(
            'success',
            $assignment->published ? 'Assignment published' : 'Assignment unpublished'
        );
    }

    public function viewSubmissions(Course $course, Assignment $assignment)
    {
        Gate::authorize('manage-course', $course);
        
        $assignment->load(['submissions' => function ($query) {
            $query->with(['user', 'attachments'])
                ->orderBy('submitted_at', 'desc');
        }]);
        
        // Calculate submission statistics
        $totalStudents = $course->students()->count();
        $submittedCount = $assignment->submissions()->where('status', '!=', 'draft')->count();
        $gradedCount = $assignment->submissions()->where('status', 'graded')->count();
        $averageGrade = $assignment->submissions()->where('status', 'graded')->avg('grade');
        
        return Inertia::render('dashboard/courses/instructors/assignments/submissions', [
            'course' => $course,
            'assignment' => $assignment,
            'stats' => [
                'total_students' => $totalStudents,
                'submitted_count' => $submittedCount,
                'graded_count' => $gradedCount,
                'average_grade' => $averageGrade ? round($averageGrade, 2) : null,
                'submission_rate' => $totalStudents > 0 ? round(($submittedCount / $totalStudents) * 100, 1) : 0,
            ],
        ]);
    }

    public function showGradeSubmissionForm(Course $course, Assignment $assignment, Submission $submission)
    {
        Gate::authorize('manage-course', $course);
        
        // Ensure the submission belongs to the assignment
        if ($submission->assignment_id !== $assignment->id) {
            abort(404);
        }
        
        // Load necessary relationships
        $submission->load(['user', 'attachments']);
        $assignment->load(['attachments']);
        
        if ($assignment->type === 'quiz') {
            $assignment->load(['quizQuestions.options']);
            $submission->load(['quizAnswers']);
        }
        
        return Inertia::render('dashboard/courses/instructors/assignments/grade-submission', [
            'course' => $course,
            'assignment' => $assignment,
            'submission' => $submission,
        ]);
    }

    public function gradeSubmission(Request $request, Course $course, Assignment $assignment, Submission $submission)
    {
        Gate::authorize('manage-course', $course);
        
        // Ensure the submission belongs to the assignment
        if ($submission->assignment_id !== $assignment->id) {
            abort(404);
        }
        
        $validated = $request->validate([
            'grade' => 'required|numeric|min:0|max:' . $assignment->points_possible,
            'feedback' => 'nullable|string',
        ]);
        
        // Apply late penalty if applicable
        $finalGrade = $validated['grade'];
        if ($submission->is_late && $assignment->allow_late_submissions && $assignment->late_penalty_percentage > 0) {
            $penaltyAmount = ($validated['grade'] * $assignment->late_penalty_percentage) / 100;
            $finalGrade = max(0, $validated['grade'] - $penaltyAmount);
        }
        
        $submission->update([
            'grade' => $finalGrade,
            'feedback' => $validated['feedback'],
            'status' => 'graded',
        ]);
        
        return redirect()->route('courses.assignments.submissions', [$course, $assignment])
            ->with('success', 'Submission graded successfully');
    }
}
