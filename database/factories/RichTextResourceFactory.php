<?php

namespace Database\Factories;

use App\Models\Resource;
use Illuminate\Database\Eloquent\Factories\Factory;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Prism;
use Prism\Prism\Schema\ObjectSchema;
use Prism\Prism\Schema\StringSchema;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\RichTextResource>
 */
class RichTextResourceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        try {
            // First, get the resource to provide context
            $resource = Resource::factory()->richText()->create();

            // Create schema for rich text content
            $schema = new ObjectSchema(
                name: 'rich_text_content',
                description: 'Educational rich text content',
                properties: [
                    new StringSchema('content', 'Educational content in rich text format, including appropriate html formatting like headings, paragraphs, lists, or emphasis etc...'),
                ],
                requiredFields: ['content']
            );

            // Generate rich text content using Mistral AI
            $response = Prism::structured()
                ->using(Provider::Mistral, 'mistral-large-latest')
                ->withSchema($schema)
                ->withPrompt("Generate educational content for a resource titled '{$resource->title}'. The content should be informative, concise, and well-structured with appropriate formatting.")
                ->asStructured();

            $content = $response->structured['content'];
        } catch (\Exception $e) {
            // Fallback to faker if AI generation fails
            $content = fake()->paragraphs(rand(3, 6), true);
        }

        return [
            'resource_id' => $resource->id ?? Resource::factory()->richText()->create()->id,
            'content' => $content,
            'format' => 'html',
        ];
    }
}
