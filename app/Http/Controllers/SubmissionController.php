<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\Course;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class SubmissionController extends Controller
{
    public function store(Request $request, Course $course, Assignment $assignment)
    {
        Gate::authorize('view-course', $course);

        // Check if assignment is available
        if (!$assignment->isAvailable()) {
            return back()->withErrors(['error' => 'Assignment is not available']);
        }

        // Check for existing submission
        $submission = Auth::user()->submissions()
            ->where('assignment_id', $assignment->id)
            ->first();

        if ($submission && $submission->status === 'submitted') {
            return back()->withErrors(['error' => 'You have already submitted this assignment']);
        }

        DB::beginTransaction();

        try {
            // Create or update submission
            $submission = $submission ?? new Submission();
            $submission->assignment_id = $assignment->id;
            $submission->user_id = Auth::id();
            $submission->submitted_at = now();
            $submission->status = 'submitted';
            $submission->is_late = $assignment->due_date && now()->gt($assignment->due_date);
            $submission->save();

            if ($assignment->type === 'file') {
                // Handle file submissions
                if ($request->hasFile('files')) {
                    foreach ($request->file('files') as $file) {
                        $path = $file->store('submissions', 's3');

                        $submission->attachments()->create([
                            'filename' => $file->getClientOriginalName(),
                            'path' => $path,
                            'mime_type' => $file->getMimeType(),
                            'size' => $file->getSize(),
                            'extension' => $file->getClientOriginalExtension(),
                            'collection' => 'submissions',
                            'is_private' => true,
                        ]);
                    }
                }
            } else {
                // Handle quiz submissions
                if ($request->has('answers')) {
                    foreach ($request->answers as $questionId => $optionId) {
                        $submission->quizAnswers()->create([
                            'quiz_question_id' => $questionId,
                            'quiz_option_id' => $optionId,
                        ]);
                    }

                    // Auto-grade quiz
                    $this->gradeQuizSubmission($submission);
                }
            }

            DB::commit();

            return redirect()->route('courses.assignments.show', [$course, $assignment])
                ->with('success', 'Assignment submitted successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to submit assignment']);
        }
    }

    private function gradeQuizSubmission(Submission $submission)
    {
        $totalPoints = 0;
        $earnedPoints = 0;

        foreach ($submission->quizAnswers as $answer) {
            $question = $answer->question;
            $totalPoints += $question->points;

            if ($answer->selectedOption && $answer->selectedOption->is_correct) {
                $earnedPoints += $question->points;
            }
        }

        $percentage = $totalPoints > 0 ? ($earnedPoints / $totalPoints) * 100 : 0;

        $submission->update([
            'grade' => round($percentage, 2),
            'status' => 'graded',
        ]);
    }
}
