<?php

namespace Database\Factories;

use App\Models\Resource;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AttachmentResource>
 */
class AttachmentResourceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'resource_id' => Resource::factory()->attachment()->create()->id,
        ];
    }
    
    /**
     * Configure the model factory to add attachments.
     *
     * @return $this
     */
    public function withAttachments(int $count = 1): static
    {
        return $this->afterCreating(function ($attachmentResource) use ($count) {
            for ($i = 0; $i < $count; $i++) {
                $attachmentResource->attachments()->create([
                    'filename' => fake()->word() . '.' . fake()->randomElement(['pdf', 'docx', 'pptx', 'xlsx', 'zip']),
                    'original_filename' => fake()->sentence(3) . '.' . fake()->randomElement(['pdf', 'docx', 'pptx', 'xlsx', 'zip']),
                    'mime_type' => fake()->randomElement([
                        'application/pdf', 
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        'application/zip'
                    ]),
                    'size' => fake()->numberBetween(10000, 10000000),
                    'path' => 'attachments/' . fake()->uuid() . '.' . fake()->randomElement(['pdf', 'docx', 'pptx', 'xlsx', 'zip']),
                ]);
            }
        });
    }
} 