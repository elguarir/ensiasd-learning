<?php

namespace Database\Factories;

use App\Models\Resource;
use Illuminate\Database\Eloquent\Factories\Factory;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Prism;
use Prism\Prism\Schema\ObjectSchema;
use Prism\Prism\Schema\StringSchema;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ExternalResource>
 */
class ExternalResourceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Common educational websites
        $educationalDomains = [
            'https://www.khanacademy.org/computing/computer-programming',
            'https://www.freecodecamp.org/learn',
            'https://developer.mozilla.org/en-US/docs/Web',
            'https://www.w3schools.com/html',
            'https://www.coursera.org/learn',
            'https://www.udemy.com/course',
            'https://css-tricks.com/snippets',
            'https://reactjs.org/docs/getting-started.html',
            'https://vuejs.org/guide',
            'https://laracasts.com/series',
            'https://www.codecademy.com/learn',
            'https://www.edx.org/course',
            'https://github.com/topics',
        ];
        
        $baseUrl = fake()->randomElement($educationalDomains);
        $path = fake()->slug(3);
        $externalUrl = $baseUrl . '/' . $path;
        
        try {
            // Get the resource to provide context
            $resource = Resource::factory()->external()->create();
            
            // Create schema for external link data
            $schema = new ObjectSchema(
                name: 'external_link_data',
                description: 'Data for an external educational resource link',
                properties: [
                    new StringSchema('link_title', 'A clear, specific title for the external link'),
                    new StringSchema('link_description', 'A brief description of what the external resource contains'),
                ],
                requiredFields: ['link_title', 'link_description']
            );
            
            // Generate external link data using Mistral AI
            $response = Prism::structured()
                ->using(Provider::Mistral, 'mistral-large-latest')
                ->withSchema($schema)
                ->withPrompt("Generate a title and description for an educational external resource titled '{$resource->title}'. The link is '{$externalUrl}'.")
                ->asStructured();
            
            $linkData = $response->structured;
            $linkTitle = $linkData['link_title'];
            $linkDescription = $linkData['link_description'];
        } catch (\Exception $e) {
            // Fallback to faker if AI generation fails
            $linkTitle = fake()->sentence(rand(3, 6));
            $linkDescription = fake()->paragraph(1);
        }

        return [
            'resource_id' => $resource->id ?? Resource::factory()->external()->create()->id,
            'external_url' => $externalUrl,
            'link_title' => $linkTitle,
            'link_description' => $linkDescription,
            'favicon_url' => fake()->imageUrl(16, 16, null, true),
            'og_image_url' => fake()->imageUrl(1200, 630, null, true),
        ];
    }
} 