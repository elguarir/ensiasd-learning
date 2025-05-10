<?php

namespace Database\Factories;

use App\Models\Course;
use Illuminate\Database\Eloquent\Factories\Factory;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Prism;
use Prism\Prism\Schema\ObjectSchema;
use Prism\Prism\Schema\StringSchema;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Chapter>
 */
class ChapterFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Create a schema for chapter data
        $schema = new ObjectSchema(
            name: 'chapter_data',
            description: 'Educational chapter information for a course',
            properties: [
                new StringSchema('title', 'A clear, specific chapter title'),
                new StringSchema('description', 'A short description (2-3 sentences) explaining the chapter objectives and content'),
            ],
            requiredFields: ['title', 'description']
        );

        try {
            // Get a course to determine the context for chapter generation
            $course = Course::inRandomOrder()->first();
            $courseContext = $course ? "Course Title: {$course->title}\nCategory: {$course->category}\n" : "";
            
            // Generate chapter data using Mistral AI
            $response = Prism::structured()
                ->using(Provider::Mistral, 'mistral-large-latest')
                ->withSchema($schema)
                ->withPrompt("Create a realistic chapter for a course. {$courseContext}The chapter should be educational and focused.")
                ->asStructured();
            
            $chapterData = $response->structured;
            $title = $chapterData['title'];
            $description = $chapterData['description'];
        } catch (\Exception $e) {
            // Fallback to faker if AI generation fails
            $title = fake()->sentence(rand(2, 5));
            $description = fake()->paragraph(rand(2, 3));
        }

        return [
            'course_id' => Course::factory(),
            'title' => $title,
            'description' => $description,
            'position' => fake()->numberBetween(1, 10),
        ];
    }
} 