<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\User;
use Illuminate\Database\Seeder;

class CourseEnrollmentSeeder extends Seeder
{
    public function run(): void
    {
        $students = User::where('role', 'student')->get();
        $courses = Course::all();

        if ($students->isEmpty()) {
            $this->command->error('No students found. Please run UserSeeder first.');
            return;
        }

        if ($courses->isEmpty()) {
            $this->command->error('No courses found. Please run CourseSeeder first.');
            return;
        }

        // Enroll all students in all courses
        foreach ($students as $student) {
            foreach ($courses as $course) {
                CourseEnrollment::create([
                    'user_id' => $student->id,
                    'course_id' => $course->id,
                    'enrolled_at' => now()->subDays(rand(1, 7)), // Enrolled 1-7 days ago
                ]);
            }
        }

        $this->command->info("Enrolled {$students->count()} students in {$courses->count()} courses.");
    }
} 