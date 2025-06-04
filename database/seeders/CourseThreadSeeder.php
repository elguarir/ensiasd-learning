<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\CourseThread;
use App\Models\User;
use Illuminate\Database\Seeder;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Prism;
use Prism\Prism\Schema\ObjectSchema;
use Prism\Prism\Schema\StringSchema;
use Prism\Prism\Schema\ArraySchema;

class CourseThreadSeeder extends Seeder
{
    public function run(): void
    {
        $courses = Course::all();

        if ($courses->isEmpty()) {
            $this->command->error('No courses found. Please run CourseSeeder first.');
            return;
        }

        foreach ($courses as $course) {
            $enrolledStudents = $course->students; // Get enrolled students

            if ($enrolledStudents->isEmpty()) {
                $this->command->info("No enrolled students found for course: {$course->title}");
                continue;
            }

            $threadCount = rand(1, 3);
            $this->createThreadsForCourse($course, $enrolledStudents, $threadCount);
        }
    }

    private function createThreadsForCourse(Course $course, $enrolledStudents, int $count): void
    {
        try {
            $schema = new ObjectSchema(
                name: 'discussion_threads_data',
                description: 'Data for creating course discussion threads',
                properties: [
                    new ArraySchema(
                        name: 'threads',
                        description: 'List of discussion thread data',
                        items: new ObjectSchema(
                            name: 'thread',
                            description: 'Individual discussion thread data',
                            properties: [
                                new StringSchema('title', 'A realistic discussion thread title that a student might post'),
                                new StringSchema('content', 'The initial post content that explains the question or topic the student wants to discuss'),
                            ],
                            requiredFields: ['title', 'content']
                        )
                    ),
                ],
                requiredFields: ['threads']
            );

            $response = Prism::structured()
                ->using(Provider::Mistral, 'mistral-large-latest')
                ->withSchema($schema)
                ->withPrompt("Create {$count} realistic discussion threads that students might post for:

Course: {$course->title}
Course Description: {$course->description}
Course Category: {$course->category}

Create discussion threads that sound like real student questions or topics such as:
- Questions about course material or concepts
- Requests for clarification on assignments
- Study group formation or collaboration requests
- Sharing of helpful resources or tips
- Discussion of real-world applications
- Technical questions or troubleshooting help
- General course-related discussions

Each thread should have a clear, specific title and detailed content that shows genuine student engagement.")
                ->asStructured();

            $threadsData = $response->structured['threads'];
            
            foreach ($threadsData as $index => $threadData) {
                // Randomly select a student from enrolled students
                $student = $enrolledStudents->random();
                
                CourseThread::create([
                    'course_id' => $course->id,
                    'author_id' => $student->id,
                    'title' => $threadData['title'],
                    'content' => $threadData['content'],
                    'is_pinned' => false, // Students can't pin threads
                    'created_at' => now()->subDays(rand(1, 10)), // Posted within the last 10 days
                ]);
            }

            $this->command->info("Created {$count} discussion threads for course: {$course->title}");
        } catch (\Exception $e) {
            // Fallback if AI generation fails
            $fallbackThreads = [
                [
                    'title' => "Question about Assignment Requirements",
                    'content' => "Hi everyone! I'm working on the upcoming assignment and wanted to clarify a few requirements. Could someone help explain the specific format we should use for citations? Thanks!"
                ],
                [
                    'title' => "Study Group for Upcoming Quiz",
                    'content' => "Hey classmates! I'm organizing a study group for the upcoming quiz. Would anyone be interested in meeting this weekend to review the material together? Let me know if you'd like to join!"
                ],
                [
                    'title' => "Helpful Resource I Found",
                    'content' => "I came across this really helpful resource that explains some of the concepts we've been covering in class. Thought I'd share it with everyone in case it's useful for your studies too."
                ],
            ];

            for ($i = 0; $i < $count; $i++) {
                $threadData = $fallbackThreads[$i % count($fallbackThreads)];
                $student = $enrolledStudents->random();
                
                CourseThread::create([
                    'course_id' => $course->id,
                    'author_id' => $student->id,
                    'title' => $threadData['title'],
                    'content' => $threadData['content'],
                    'is_pinned' => false,
                    'created_at' => now()->subDays(rand(1, 10)),
                ]);
            }

            $this->command->info("Created {$count} fallback discussion threads for course: {$course->title}");
        }
    }
} 