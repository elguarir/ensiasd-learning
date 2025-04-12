<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            // CourseSeeder::class,
            // CourseEnrollmentSeeder::class,
            // ChapterSeeder::class,
            // ResourceSeeder::class,
            // AnnouncementSeeder::class,
            // CourseThreadSeeder::class,
            // ThreadCommentSeeder::class,
            // AssignmentSeeder::class,
            // QuizSeeder::class,
            // SubmissionSeeder::class,
            // AttachmentSeeder::class,
        ]);
    }
}
