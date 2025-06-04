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
        $this->command->info('🎓 Starting to seed the educational platform...');
        
        $this->call([
            // Core data - Users (1 instructor + 10 students)
            UserSeeder::class,
            
            // Courses (2 courses)
            CourseSeeder::class,
            
            // Enroll all students in all courses
            CourseEnrollmentSeeder::class,
            
            // Course structure (5 chapters per course)
            ChapterSeeder::class,
            
            // Educational content (4-6 resources per chapter)
            ResourceSeeder::class,
            
            // Course activities
            AssignmentSeeder::class,    // 1-3 assignments per course (future due dates)
            AnnouncementSeeder::class,  // 1-4 announcements per course
            CourseThreadSeeder::class,  // 1-3 discussion threads per course
            
            // Optional: Additional content
            // ThreadCommentSeeder::class,  // Comments on discussion threads
            // QuizSeeder::class,           // Quiz questions for quiz assignments
            // SubmissionSeeder::class,     // Student submissions
        ]);

        $this->command->info('✅ Database seeding completed successfully!');
        $this->command->info('');
        $this->command->info('📊 Summary:');
        $this->command->info('• 1 Instructor + 10 Students created');
        $this->command->info('• 2 Courses created (all students enrolled)');
        $this->command->info('• 5 Chapters per course (10 total)');
        $this->command->info('• 4-6 Resources per chapter (40-60 total)');
        $this->command->info('• 1-3 Assignments per course (future due dates)');
        $this->command->info('• 1-4 Announcements per course');
        $this->command->info('• 1-3 Discussion threads per course');
        $this->command->info('');
        $this->command->info('🔑 Default password for all users: password');
    }
}
