<?php

namespace Database\Seeders;

use App\Models\Chapter;
use App\Models\Course;
use Illuminate\Database\Seeder;

class ChapterSeeder extends Seeder
{
    public function run(): void
    {
        $courses = Course::all();

        foreach ($courses as $course) {
            // Each course has 5-8 chapters
            $numChapters = rand(5, 8);
            
            for ($i = 1; $i <= $numChapters; $i++) {
                Chapter::create([
                    'course_id' => $course->id,
                    'title' => "Chapter {$i}: Introduction to Topic {$i}",
                    'description' => "This chapter covers the fundamental concepts of topic {$i}. Students will learn about key principles and practical applications.",
                    'order' => $i,
                    'is_published' => true,
                    'published_at' => now()->subDays(rand(0, 30)),
                ]);
            }
        }
    }
} 