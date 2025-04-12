<?php

namespace Database\Seeders;

use App\Models\Assignment;
use App\Models\Chapter;
use App\Models\Course;
use Illuminate\Database\Seeder;

class AssignmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Make sure we have courses before creating assignments
        if (Course::count() === 0) {
            $this->command->info('Please run CourseSeeder first');
            return;
        }

        $courses = Course::all();

        foreach ($courses as $courseIndex => $course) {
            // Get chapters for this course
            $chapters = $course->chapters;
            
            if ($chapters->isEmpty()) {
                // Skip if no chapters
                continue;
            }

            // Create 2-4 assignments per course
            $assignmentCount = rand(2, 4);
            
            for ($i = 0; $i < $assignmentCount; $i++) {
                // Alternate between file and quiz assignments
                $type = ($i % 2 === 0) ? 'file' : 'quiz';
                
                // Randomly select a chapter or leave null (course-level assignment)
                $chapterId = (rand(0, 10) > 3) ? $chapters->random()->id : null;
                
                // For variety, set some assignments in the past, some in the future
                $dueDate = null;
                if (rand(0, 10) > 2) { // 80% chance of having a due date
                    // Random date between 10 days ago and 20 days from now
                    $dueDate = now()->subDays(10)->addDays(rand(0, 30));
                }
                
                // Create the assignment
                Assignment::create([
                    'course_id' => $course->id,
                    'chapter_id' => $chapterId,
                    'title' => $this->getAssignmentTitle($type, $courseIndex, $i),
                    'description' => $this->getAssignmentDescription($type),
                    'type' => $type,
                    'due_date' => $dueDate,
                    'points_possible' => rand(10, 100),
                    'published' => (rand(0, 10) > 2), // 80% chance of being published
                ]);
            }
        }

        $this->command->info('Assignments seeded successfully!');
    }

    private function getAssignmentTitle(string $type, int $courseIndex, int $index): string
    {
        $fileAssignments = [
            'Research Paper on',
            'Project Submission:',
            'Case Study Analysis:',
            'Lab Report:',
            'Portfolio Assignment:',
        ];

        $quizAssignments = [
            'Quiz on',
            'Test your knowledge:',
            'Chapter Quiz:',
            'Quick Assessment:',
            'Knowledge Check:',
        ];

        $topics = [
            'Introduction to the Subject',
            'Advanced Concepts',
            'Practical Applications',
            'Theoretical Foundations',
            'Current Trends',
            'Historical Perspectives',
            'Core Principles',
            'Future Directions',
        ];

        $prefix = ($type === 'file') 
            ? $fileAssignments[$index % count($fileAssignments)] 
            : $quizAssignments[$index % count($quizAssignments)];
            
        $topic = $topics[($courseIndex + $index) % count($topics)];
        
        return $prefix . ' ' . $topic;
    }

    private function getAssignmentDescription(string $type): string
    {
        if ($type === 'file') {
            return 'Please complete this assignment by uploading your work as a PDF, Word document, or ZIP file. Follow the guidelines in the attached assignment instructions. Your submission will be graded based on the provided rubric.';
        } else {
            return 'This quiz consists of multiple-choice questions to test your understanding of the material. You will have one attempt to complete it. Each question is worth the indicated number of points. Good luck!';
        }
    }
} 