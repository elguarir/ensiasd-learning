<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Course>
 */
class CourseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
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
        $statuses = ['draft', 'published', 'archived'];

        return [
            'instructor_id' => User::where('role', 'instructor')->inRandomOrder()->first()?->id ?? User::factory()->create(['role' => 'instructor'])->id,
            'title' => fake()->sentence(rand(3, 8)),
            'description' => fake()->paragraphs(rand(1, 3), true),
            'image' => fake()->imageUrl(640, 480, 'education'),
            'code' => strtoupper(Str::random(6)),
            'color' => fake()->hexColor(),
            'category' => fake()->randomElement($categories),
            'status' => fake()->randomElement($statuses),
            'published_at' => function (array $attributes) {
                return $attributes['status'] === 'published' ? now() : null;
            },
        ];
    }

    /**
     * Indicate that the course is published.
     */
    public function published(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'published',
            'published_at' => now(),
        ]);
    }

    /**
     * Indicate that the course is a draft.
     */
    public function draft(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'draft',
            'published_at' => null,
        ]);
    }
}
