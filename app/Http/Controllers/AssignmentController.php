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
                    $path = $file->store('assignment-attachments', 's3');

                    $assignment->attachments()->create([
                        'filename' => $file->getClientOriginalName(),
                        'path' => $path,
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

        return redirect()->route('courses.assignments.index', $course)
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
        // TODO
    }

    public function showGradeSubmissionForm(Course $course, Assignment $assignment, Submission $submission)
    {
        // TODO
    }


    public function gradeSubmission(Request $request, Course $course, Assignment $assignment, Submission $submission)
    {
        // TODO
    }
}
