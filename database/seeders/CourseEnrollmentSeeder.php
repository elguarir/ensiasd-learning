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

        foreach ($students as $student) {
            // Each student enrolls in 2-4 random courses
            $numEnrollments = rand(2, 4);
            $randomCourses = $courses->random($numEnrollments);

            foreach ($randomCourses as $course) {
                CourseEnrollment::create([
                    'user_id' => $student->id,
                    'course_id' => $course->id,
                    'enrolled_at' => now()->subDays(rand(0, 30)),
                ]);
            }
        }
    }
} 