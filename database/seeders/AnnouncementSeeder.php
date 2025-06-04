<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\Course;
use App\Models\User;
use Illuminate\Database\Seeder;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Prism;
use Prism\Prism\Schema\ObjectSchema;
use Prism\Prism\Schema\StringSchema;
use Prism\Prism\Schema\ArraySchema;

class AnnouncementSeeder extends Seeder
{
    public function run(): void
    {
        $courses = Course::all();
        $instructor = User::where('role', 'instructor')->first();

        if ($courses->isEmpty()) {
            $this->command->error('No courses found. Please run CourseSeeder first.');
            return;
        }

        if (!$instructor) {
            $this->command->error('No instructor found. Please run UserSeeder first.');
            return;
        }

        foreach ($courses as $course) {
            $announcementCount = rand(1, 4);
            $this->createAnnouncementsForCourse($course, $instructor, $announcementCount);
        }
    }

    private function createAnnouncementsForCourse(Course $course, User $instructor, int $count): void
    {
        try {
            $schema = new ObjectSchema(
                name: 'announcements_data',
                description: 'Data for creating course announcements',
                properties: [
                    new ArraySchema(
                        name: 'announcements',
                        description: 'List of announcement data',
                        items: new ObjectSchema(
                            name: 'announcement',
                            description: 'Individual announcement data',
                            properties: [
                                new StringSchema('content', 'A realistic announcement message from an instructor to students about course-related information, updates, reminders, or important notices'),
                            ],
                            requiredFields: ['content']
                        )
                    ),
                ],
                requiredFields: ['announcements']
            );

            $response = Prism::structured()
                ->using(Provider::Mistral, 'mistral-large-latest')
                ->withSchema($schema)
                ->withPrompt("Create {$count} realistic course announcements for:

Course: {$course->title}
Course Description: {$course->description}
Course Category: {$course->category}
Instructor: {$instructor->name}

Create diverse announcements that might include:
- Welcome messages or course updates
- Assignment reminders or clarifications
- Schedule changes or important dates
- Study tips or exam preparation guidance
- Resource sharing or additional materials
- Class participation encouragement
- Technical instructions or platform updates

Each announcement should sound natural and professional, like a real instructor communicating with their students.")
                ->asStructured();

            $announcementsData = $response->structured['announcements'];
            
            foreach ($announcementsData as $index => $announcementData) {
                Announcement::create([
                    'course_id' => $course->id,
                    'user_id' => $instructor->id,
                    'content' => $announcementData['content'],
                    'created_at' => now()->subDays(rand(0, 14)), // Posted within the last 2 weeks
                ]);
            }

            $this->command->info("Created {$count} announcements for course: {$course->title}");
        } catch (\Exception $e) {
            // Fallback if AI generation fails
            $fallbackAnnouncements = [
                "Welcome to {$course->title}! I'm excited to have you all in class this semester. Please make sure to review the syllabus and upcoming assignment schedule.",
                "Reminder: The first assignment for {$course->title} is due next week. Please don't hesitate to reach out if you have any questions about the requirements.",
                "Great job on the recent discussions, everyone! I'm seeing excellent engagement with the course material. Keep up the excellent work in {$course->title}.",
                "Important update: Office hours this week will be moved to Thursday 2-4 PM. I'm here to help with any questions about {$course->title} content or assignments.",
            ];

            for ($i = 0; $i < $count; $i++) {
                $content = $fallbackAnnouncements[$i % count($fallbackAnnouncements)];
                
                Announcement::create([
                    'course_id' => $course->id,
                    'user_id' => $instructor->id,
                    'content' => $content,
                    'created_at' => now()->subDays(rand(0, 14)),
                ]);
            }

        }
    }
} 