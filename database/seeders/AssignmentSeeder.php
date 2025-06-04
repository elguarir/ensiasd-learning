<?php

namespace Database\Seeders;

use App\Models\Assignment;
use App\Models\Course;
use Illuminate\Database\Seeder;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Prism;
use Prism\Prism\Schema\ObjectSchema;
use Prism\Prism\Schema\StringSchema;
use Prism\Prism\Schema\ArraySchema;

class AssignmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $courses = Course::all();

        if ($courses->isEmpty()) {
            $this->command->error('No courses found. Please run CourseSeeder first.');
            return;
        }

        foreach ($courses as $course) {
            $assignmentCount = rand(1, 3);
            $this->createAssignmentsForCourse($course, $assignmentCount);
        }
    }

    private function createAssignmentsForCourse(Course $course, int $count): void
    {
        try {
            $schema = new ObjectSchema(
                name: 'assignments_data',
                description: 'Data for creating course assignments',
                properties: [
                    new ArraySchema(
                        name: 'assignments',
                        description: 'List of assignment data',
                        items: new ObjectSchema(
                            name: 'assignment',
                            description: 'Individual assignment data',
                            properties: [
                                new StringSchema('title', 'A clear, specific assignment title'),
                                new StringSchema('description', 'A detailed description of what students need to do for this assignment'),
                                new StringSchema('instructions', 'Specific step-by-step instructions for completing the assignment'),
                                new StringSchema('type', 'Assignment type: either "file" for file submissions or "quiz" for quiz assignments'),
                            ],
                            requiredFields: ['title', 'description', 'instructions', 'type']
                        )
                    ),
                ],
                requiredFields: ['assignments']
            );

            $response = Prism::structured()
                ->using(Provider::Mistral, 'mistral-large-latest')
                ->withSchema($schema)
                ->withPrompt("Create {$count} realistic assignments for this course:

Course: {$course->title}
Course Description: {$course->description}
Course Category: {$course->category}

Create assignments that:
1. Are appropriate for university-level students
2. Test understanding of course material
3. Include both 'file' and 'quiz' types if creating multiple assignments
4. Have clear, actionable instructions
5. Are relevant to the course subject matter

For 'file' assignments, focus on projects, essays, reports, or practical work.
For 'quiz' assignments, focus on knowledge assessment and comprehension testing.")
                ->asStructured();

            $assignmentsData = $response->structured['assignments'];
            
            foreach ($assignmentsData as $index => $assignmentData) {
                // Generate future due date (7 to 30 days from now)
                $dueDate = now()->addDays(rand(7, 30));
                
                Assignment::create([
                    'course_id' => $course->id,
                    'title' => $assignmentData['title'],
                    'description' => $assignmentData['description'],
                    'instructions' => $assignmentData['instructions'],
                    'type' => $assignmentData['type'],
                    'due_date' => $dueDate,
                    'points_possible' => rand(50, 100),
                    'published' => true,
                    'allow_late_submissions' => rand(0, 1) === 1,
                    'late_penalty_percentage' => rand(0, 1) === 1 ? rand(5, 20) : 0,
                ]);
            }

            $this->command->info("Created {$count} assignments for course: {$course->title}");
        } catch (\Exception $e) {
            // Fallback if AI generation fails
            for ($i = 0; $i < $count; $i++) {
                $types = ['file', 'quiz'];
                $type = $types[$i % 2];
                $dueDate = now()->addDays(rand(7, 30));
                
                Assignment::create([
                    'course_id' => $course->id,
                    'title' => $this->getFallbackTitle($type, $i + 1, $course),
                    'description' => $this->getFallbackDescription($type, $course),
                    'instructions' => $this->getFallbackInstructions($type),
                    'type' => $type,
                    'due_date' => $dueDate,
                    'points_possible' => rand(50, 100),
                    'published' => true,
                    'allow_late_submissions' => rand(0, 1) === 1,
                    'late_penalty_percentage' => rand(0, 1) === 1 ? rand(5, 20) : 0,
                ]);
            }

            $this->command->info("Created {$count} fallback assignments for course: {$course->title}");
        }
    }

    private function getFallbackTitle(string $type, int $number, Course $course): string
    {
        if ($type === 'file') {
            return "Assignment {$number}: {$course->category} Project";
        } else {
            return "Quiz {$number}: {$course->category} Knowledge Check";
        }
    }

    private function getFallbackDescription(string $type, Course $course): string
    {
        if ($type === 'file') {
            return "This assignment requires you to demonstrate your understanding of key concepts from {$course->title}. You will create a comprehensive project that showcases your learning and applies course materials to real-world scenarios.";
        } else {
            return "This quiz tests your comprehension of the material covered in {$course->title}. It includes multiple-choice questions designed to assess your understanding of core concepts and principles.";
        }
    }

    private function getFallbackInstructions(string $type): string
    {
        if ($type === 'file') {
            return "1. Review all course materials and readings\n2. Choose a topic that interests you from the course content\n3. Create a well-structured document (minimum 1500 words)\n4. Include proper citations and references\n5. Submit your work as a PDF file\n6. Ensure your submission is original and follows academic integrity guidelines";
        } else {
            return "1. Read each question carefully\n2. Select the best answer for multiple-choice questions\n3. You have one attempt to complete this quiz\n4. Time limit: 60 minutes\n5. Make sure you have a stable internet connection\n6. Submit your answers before the due date";
        }
    }
} 