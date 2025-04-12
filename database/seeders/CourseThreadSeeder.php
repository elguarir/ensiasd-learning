<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\CourseThread;
use App\Models\User;
use Illuminate\Database\Seeder;

class CourseThreadSeeder extends Seeder
{
    public function run(): void
    {
        $courses = Course::all();
        $students = User::where('role', 'student')->get();

        foreach ($courses as $course) {
            // Each course has 5-10 discussion threads
            $numThreads = rand(5, 10);
            
            for ($i = 1; $i <= $numThreads; $i++) {
                $student = $students->random();
                
                CourseThread::create([
                    'course_id' => $course->id,
                    'user_id' => $student->id,
                    'title' => "Discussion Thread {$i}: Question about {$course->title}",
                    'content' => "I have a question about the course material. Can someone help me understand this concept better?",
                    'is_pinned' => rand(0, 1) === 1,
                    'is_locked' => false,
                    'created_at' => now()->subDays(rand(0, 30)),
                ]);
            }
        }
    }
} 