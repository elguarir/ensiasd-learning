<?php

namespace Database\Seeders;

use App\Models\Chapter;
use App\Models\Resource;
use Illuminate\Database\Seeder;

class ResourceSeeder extends Seeder
{
    public function run(): void
    {
        $chapters = Chapter::all();

        foreach ($chapters as $chapter) {
            // Each chapter has 2-4 resources
            $numResources = rand(2, 4);
            
            for ($i = 1; $i <= $numResources; $i++) {
                $resourceTypes = ['video', 'document', 'link', 'quiz'];
                $type = $resourceTypes[array_rand($resourceTypes)];
                
                Resource::create([
                    'chapter_id' => $chapter->id,
                    'title' => "Resource {$i} for {$chapter->title}",
                    'description' => "This resource provides additional information about the topic covered in this chapter.",
                    'type' => $type,
                    'content' => $this->getContentForType($type),
                    'order' => $i,
                    'is_published' => true,
                    'published_at' => now()->subDays(rand(0, 30)),
                ]);
            }
        }
    }

    private function getContentForType(string $type): string
    {
        return match($type) {
            'video' => 'https://example.com/video-' . rand(1000, 9999),
            'document' => 'https://example.com/document-' . rand(1000, 9999),
            'link' => 'https://example.com/resource-' . rand(1000, 9999),
            'quiz' => 'Quiz content for assessment',
            default => '',
        };
    }
} 