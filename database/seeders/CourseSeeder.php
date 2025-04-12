<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        $instructors = User::where('role', 'instructor')->get();
        $categories = ['Programming', 'Mathematics', 'Science', 'Business', 'Arts'];

        foreach ($instructors as $instructor) {
            // Each instructor creates 2-3 courses
            $numCourses = rand(2, 3);
            
            for ($i = 1; $i <= $numCourses; $i++) {
                $category = $categories[array_rand($categories)];
                $title = "{$category} Course {$i}";
                $code = Str::slug($title) . '-' . rand(1000, 9999);
                $status = ['draft', 'published', 'archived'][rand(0, 1)]; // Mostly draft or published
                
                Course::create([
                    'instructor_id' => $instructor->id,
                    'code' => $code,
                    'title' => $title,
                    'description' => "This is a sample {$category} course description. It covers fundamental concepts and advanced topics in the field.",
                    'image' => 'https://via.placeholder.com/640x480.png/'.substr(md5($title), 0, 6).'?text='.$title,
                    'category' => $category,
                    'status' => $status,
                    'published_at' => $status === 'published' ? now() : null,
                ]);
            }
        }
    }
} 