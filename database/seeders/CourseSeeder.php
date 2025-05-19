<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\User;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        // Create instructors if none exist
        if (User::where('role', 'instructor')->count() === 0) {
            User::factory()->count(5)->create(['role' => 'instructor']);
        }

        // Get all instructors
        $instructors = User::where('role', 'instructor')->get();
        $categories = [
            "Programming",
            "Design",
            "Business",
            "Marketing",
            "Science",
            "Math",
            "Language",
            "Other",
        ];

        foreach ($instructors as $instructor) {
            // Create 3 courses for each instructor
            Course::factory()->count(3)->create([
                'instructor_id' => $instructor->id,
                'category' => fake()->randomElement($categories),
            ]);

            // Also create a published course for each instructor
            Course::factory()->published()->create([
                'instructor_id' => $instructor->id,
                'category' => fake()->randomElement($categories),
            ]);
        }
    }
}
