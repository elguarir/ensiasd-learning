<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Prism;
use Prism\Prism\Schema\ObjectSchema;
use Prism\Prism\Schema\StringSchema;
use Prism\Prism\Schema\ArraySchema;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        // Get the instructor
        $instructor = User::where('role', 'instructor')->first();
        
        if (!$instructor) {
            $this->command->error('No instructor found. Please run UserSeeder first.');
            return;
        }

        // Create 2 courses using Prism for realistic data
        $this->createCourses($instructor, 2);
    }

    private function createCourses(User $instructor, int $count): void
    {
        try {
            $schema = new ObjectSchema(
                name: 'courses_data',
                description: 'Data for creating realistic university courses',
                properties: [
                    new ArraySchema(
                        name: 'courses',
                        description: 'List of course data',
                        items: new ObjectSchema(
                            name: 'course',
                            description: 'Individual course data',
                            properties: [
                                new StringSchema('title', 'A realistic course title for a university subject'),
                                new StringSchema('description', 'A comprehensive course description explaining what students will learn'),
                                new StringSchema('category', 'Course category (e.g., Programming, Design, Business, Marketing, Science, Math, Language, Other)'),
                                new StringSchema('color', 'A hex color code for the course theme'),
                            ],
                            requiredFields: ['title', 'description', 'category', 'color']
                        )
                    ),
                ],
                requiredFields: ['courses']
            );

            $response = Prism::structured()
                ->using(Provider::Mistral, 'mistral-large-latest')
                ->withSchema($schema)
                ->withPrompt("Generate {$count} realistic university courses. Each should have a compelling title, detailed description, appropriate category, and a nice hex color. Make them diverse subjects that would be interesting for students.")
                ->asStructured();

            $coursesData = $response->structured['courses'];
            
            foreach ($coursesData as $courseData) {
                Course::create([
                    'instructor_id' => $instructor->id,
                    'title' => $courseData['title'],
                    'description' => $courseData['description'],
                    'image' => 'https://picsum.photos/seed/' . Str::random(10) . '/800/800',
                    'code' => $this->generateUniqueCode(),
                    'invite_token' => $this->generateUniqueInviteToken(),
                    'color' => $courseData['color'],
                    'category' => $courseData['category'],
                    'status' => 'published',
                    'published_at' => now(),
                ]);
            }
        } catch (\Exception $e) {
            // Fallback if AI generation fails
            $fallbackCourses = [
                [
                    'title' => 'Introduction to Computer Science',
                    'description' => 'This course provides a comprehensive introduction to computer science fundamentals, including programming concepts, algorithms, and data structures.',
                    'category' => 'Programming',
                    'color' => '#3B82F6',
                ],
                [
                    'title' => 'Digital Marketing Strategies',
                    'description' => 'Learn modern digital marketing techniques including social media marketing, SEO, content marketing, and analytics.',
                    'category' => 'Marketing', 
                    'color' => '#EF4444',
                ]
            ];

            foreach ($fallbackCourses as $courseData) {
                Course::create([
                    'instructor_id' => $instructor->id,
                    'title' => $courseData['title'],
                    'description' => $courseData['description'],
                    'image' => 'https://picsum.photos/seed/' . Str::random(10) . '/800/800',
                    'code' => $this->generateUniqueCode(),
                    'invite_token' => $this->generateUniqueInviteToken(),
                    'color' => $courseData['color'],
                    'category' => $courseData['category'],
                    'status' => 'published',
                    'published_at' => now(),
                ]);
            }
        }
    }

    private function generateUniqueCode(): string
    {
        do {
            $code = strtoupper(Str::random(6));
        } while (Course::where('code', $code)->exists());
        
        return $code;
    }

    private function generateUniqueInviteToken(): string
    {
        do {
            $token = Str::random(32);
        } while (Course::where('invite_token', $token)->exists());
        
        return $token;
    }
}
