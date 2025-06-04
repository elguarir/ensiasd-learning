<?php

namespace Database\Seeders;

use App\Models\Chapter;
use App\Models\Course;
use Illuminate\Database\Seeder;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Prism;
use Prism\Prism\Schema\ObjectSchema;
use Prism\Prism\Schema\StringSchema;
use Prism\Prism\Schema\ArraySchema;

class ChapterSeeder extends Seeder
{
    public function run(): void
    {
        $courses = Course::all();

        if ($courses->isEmpty()) {
            $this->command->error('No courses found. Please run CourseSeeder first.');
            return;
        }

        foreach ($courses as $course) {
            $this->createChaptersForCourse($course, 5);
        }
    }

    private function createChaptersForCourse(Course $course, int $count): void
    {
        try {
            $schema = new ObjectSchema(
                name: 'chapters_data',
                description: 'Data for creating realistic course chapters',
                properties: [
                    new ArraySchema(
                        name: 'chapters',
                        description: 'List of chapter data for the course',
                        items: new ObjectSchema(
                            name: 'chapter',
                            description: 'Individual chapter data',
                            properties: [
                                new StringSchema('title', 'A clear, specific chapter title that builds upon previous chapters'),
                                new StringSchema('description', 'A detailed description explaining what students will learn in this chapter and how it connects to the course objectives'),
                            ],
                            requiredFields: ['title', 'description']
                        )
                    ),
                ],
                requiredFields: ['chapters']
            );

            $response = Prism::structured()
                ->using(Provider::Mistral, 'mistral-large-latest')
                ->withSchema($schema)
                ->withPrompt("Create {$count} progressive chapters for the course '{$course->title}'. 

Course Description: {$course->description}
Course Category: {$course->category}

The chapters should:
1. Build logically from basic to advanced concepts
2. Each have a clear learning objective
3. Cover the key topics students need to master in this subject
4. Be appropriate for university-level learning
5. Progress in a logical sequence that makes sense for the subject matter

Make each chapter title specific and descriptive, and each description should clearly explain what students will learn.")
                ->asStructured();

            $chaptersData = $response->structured['chapters'];
            
            foreach ($chaptersData as $index => $chapterData) {
                Chapter::create([
                    'course_id' => $course->id,
                    'title' => $chapterData['title'],
                    'description' => $chapterData['description'],
                    'position' => $index + 1,
                ]);
            }

            $this->command->info("Created {$count} chapters for course: {$course->title}");
        } catch (\Exception $e) {
            // Fallback if AI generation fails
            for ($i = 1; $i <= $count; $i++) {
                Chapter::create([
                    'course_id' => $course->id,
                    'title' => "Chapter {$i}: Introduction to Topic {$i}",
                    'description' => "This chapter covers fundamental concepts related to {$course->title}. Students will learn key principles and practical applications relevant to {$course->category}.",
                    'position' => $i,
                ]);
            }

            $this->command->info("Created {$count} fallback chapters for course: {$course->title}");
        }
    }
} 