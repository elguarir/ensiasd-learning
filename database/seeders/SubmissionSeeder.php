<?php

namespace Database\Seeders;

use App\Models\Assignment;
use App\Models\CourseEnrollment;
use App\Models\QuizAnswer;
use App\Models\QuizQuestion;
use App\Models\Submission;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class SubmissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Make sure we have assignments and enrollments before creating submissions
        if (Assignment::count() === 0 || CourseEnrollment::count() === 0) {
            $this->command->info('Please run AssignmentSeeder and ensure there are course enrollments first');
            return;
        }

        // Get published assignments
        $assignments = Assignment::where('published', true)->get();

        if ($assignments->isEmpty()) {
            $this->command->info('No published assignments found');
            return;
        }

        foreach ($assignments as $assignment) {
            // Get students enrolled in this course
            $enrollments = CourseEnrollment::where('course_id', $assignment->course_id)->get();

            if ($enrollments->isEmpty()) {
                continue; // Skip if no enrollments for this course
            }

            // For each enrollment, determine if the student will submit this assignment
            foreach ($enrollments as $enrollment) {
                // 70% chance a student submits an assignment
                if (rand(1, 10) <= 7) {
                    $this->createSubmission($assignment, $enrollment->user_id);
                }
            }
        }

        $this->command->info('Submissions seeded successfully!');
    }

    private function createSubmission(Assignment $assignment, int $userId): void
    {
        // Determine submission status
        // 70% chance it's graded, 20% just submitted, 10% still a draft
        $statusRoll = rand(1, 10);
        if ($statusRoll <= 7) {
            $status = 'graded';
        } elseif ($statusRoll <= 9) {
            $status = 'submitted';
        } else {
            $status = 'draft';
        }

        // Generate submission date
        $submittedAt = null;
        $isLate = false;

        if ($status !== 'draft') {
            if ($assignment->due_date) {
                $dueDate = Carbon::parse($assignment->due_date);
                // 20% chance of late submission
                $isLate = (rand(1, 10) <= 2);

                if ($isLate) {
                    // 1-3 days late
                    $submittedAt = $dueDate->copy()->addDays(rand(1, 3));
                } else {
                    // 0-5 days early
                    $submittedAt = $dueDate->copy()->subDays(rand(0, 5));
                }
            } else {
                // If no due date, just pick a recent date
                $submittedAt = now()->subDays(rand(1, 14));
            }
        }

        // Generate grade if graded
        $grade = null;
        $feedback = null;

        if ($status === 'graded') {
            $grade = rand(60, 100); // Random grade between 60-100
            $feedback = $this->getFeedback($grade);
        }

        // Create the submission
        $submission = Submission::create([
            'assignment_id' => $assignment->id,
            'user_id' => $userId,
            'submitted_at' => $submittedAt,
            'is_late' => $isLate,
            'status' => $status,
            'grade' => $grade,
            'feedback' => $feedback,
        ]);

        // If it's a quiz submission, create answers
        if ($assignment->type === 'quiz' && $status !== 'draft') {
            $this->createQuizAnswers($submission);
        }
    }

    private function createQuizAnswers(Submission $submission): void
    {
        // Get questions for this quiz
        $questions = QuizQuestion::where('assignment_id', $submission->assignment_id)->get();

        if ($questions->isEmpty()) {
            return;
        }

        foreach ($questions as $question) {
            // Get options for this question
            $options = $question->options;

            if ($options->isEmpty()) {
                continue;
            }

            // Select a random option
            $selectedOption = $options->random();

            // Create the answer
            QuizAnswer::create([
                'submission_id' => $submission->id,
                'quiz_question_id' => $question->id,
                'quiz_option_id' => $selectedOption->id,
            ]);
        }
    }

    private function getFeedback(int $grade): string
    {
        if ($grade >= 90) {
            $feedback = [
                "Excellent work! Your understanding of the material is exceptional.",
                "Outstanding submission. You've demonstrated mastery of the concepts.",
                "Great job! Your work shows thorough comprehension of the topic.",
                "Excellent performance. You've clearly put significant effort into this assignment.",
            ];
        } elseif ($grade >= 80) {
            $feedback = [
                "Good work. You've shown solid understanding of the key concepts.",
                "Well done. Your submission demonstrates good comprehension with a few minor issues.",
                "Good job. You've grasped most of the important points.",
                "Solid work overall. There are a few areas that could use more attention.",
            ];
        } elseif ($grade >= 70) {
            $feedback = [
                "Satisfactory work. You've understood the basics but missed some important details.",
                "Adequate submission. Consider reviewing the course materials to strengthen your understanding.",
                "You've demonstrated basic understanding. More attention to detail would improve your work.",
                "Your work meets the basic requirements. Review the feedback to improve future submissions.",
            ];
        } else {
            $feedback = [
                "You've missed several key concepts. Please review the material and consider resubmitting.",
                "Your submission needs improvement. Focus on the core concepts covered in the lectures.",
                "There are significant gaps in your understanding. Please schedule office hours if you need help.",
                "Your work doesn't meet all the requirements. Review the rubric and course materials.",
            ];
        }

        return $feedback[array_rand($feedback)];
    }
}
