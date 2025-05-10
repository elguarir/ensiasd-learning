<?php

namespace Database\Factories;

use App\Models\Chapter;
use Illuminate\Database\Eloquent\Factories\Factory;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Prism;
use Prism\Prism\Schema\ObjectSchema;
use Prism\Prism\Schema\StringSchema;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Resource>
 */
class ResourceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $resourceTypes = ['attachment', 'rich_text', 'external'];
        $resourceType = fake()->randomElement($resourceTypes);

        // Create a schema for resource data
        $schema = new ObjectSchema(
            name: 'resource_data',
            description: 'Educational resource information',
            properties: [
                new StringSchema('title', 'A clear, specific resource title'),
                new StringSchema('description', 'A brief description (1-2 sentences) of the resource and its purpose'),
            ],
            requiredFields: ['title', 'description']
        );

        try {
            // Get a chapter to determine the context for resource generation
            $chapter = Chapter::inRandomOrder()->first();
            $chapterContext = $chapter ? "Chapter Title: {$chapter->title}\n" : "";
            
            // Generate resource data using Mistral AI
            $response = Prism::structured()
                ->using(Provider::Mistral, 'mistral-large-latest')
                ->withSchema($schema)
                ->withPrompt("Create a title and description for a {$resourceType} resource in an educational course. {$chapterContext}The resource should be useful and relevant for learning.")
                ->asStructured();
            
            $resourceData = $response->structured;
            $title = $resourceData['title'];
            $description = $resourceData['description'];
        } catch (\Exception $e) {
            // Fallback to faker if AI generation fails
            $title = fake()->sentence(rand(2, 5));
            $description = fake()->paragraph(1);
        }

        return [
            'chapter_id' => Chapter::factory(),
            'title' => $title,
            'description' => $description,
            'resource_type' => $resourceType,
            'position' => fake()->numberBetween(1, 10),
            'metadata' => null,
        ];
    }

    /**
     * Configure the resource as a rich text resource.
     */
    public function richText(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'resource_type' => 'rich_text',
            ];
        });
    }

    /**
     * Configure the resource as an attachment resource.
     */
    public function attachment(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'resource_type' => 'attachment',
            ];
        });
    }

    /**
     * Configure the resource as an external resource.
     */
    public function external(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'resource_type' => 'external',
            ];
        });
    }
} 