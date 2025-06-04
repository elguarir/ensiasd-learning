<?php

namespace Database\Seeders;

use App\Models\Chapter;
use App\Models\Resource;
use App\Models\RichTextResource;
use App\Models\AttachmentResource;
use App\Models\ExternalResource;
use Illuminate\Database\Seeder;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Prism;
use Prism\Prism\Schema\ObjectSchema;
use Prism\Prism\Schema\StringSchema;
use Prism\Prism\Schema\ArraySchema;

class ResourceSeeder extends Seeder
{
    public function run(): void
    {
        $chapters = Chapter::all();

        if ($chapters->isEmpty()) {
            $this->command->error('No chapters found. Please run ChapterSeeder first.');
            return;
        }

        foreach ($chapters as $chapter) {
            $resourceCount = rand(4, 6);
            $this->createResourcesForChapter($chapter, $resourceCount);
        }
    }

    private function createResourcesForChapter(Chapter $chapter, int $count): void
    {
        $resourceTypes = ['rich_text', 'attachment', 'external'];
        
        try {
            $schema = new ObjectSchema(
                name: 'resources_data',
                description: 'Data for creating educational resources for a chapter',
                properties: [
                    new ArraySchema(
                        name: 'resources',
                        description: 'List of educational resources',
                        items: new ObjectSchema(
                            name: 'resource',
                            description: 'Individual educational resource',
                            properties: [
                                new StringSchema('title', 'A clear, specific title for the educational resource'),
                                new StringSchema('type', 'Resource type: rich_text (for reading materials/content), attachment (for downloadable files), or external (for external links)'),
                            ],
                            requiredFields: ['title', 'type']
                        )
                    ),
                ],
                requiredFields: ['resources']
            );

            $course = $chapter->course;
            $response = Prism::structured()
                ->using(Provider::Mistral, 'mistral-large-latest')
                ->withSchema($schema)
                ->withPrompt("Create {$count} diverse educational resources for this chapter:

Chapter: {$chapter->title}
Chapter Description: {$chapter->description}
Course: {$course->title}
Course Category: {$course->category}

Create a mix of resource types:
- rich_text: Reading materials, lecture content, explanations
- attachment: Downloadable files like PDFs, worksheets, templates
- external: Links to external websites, videos, tools

Each resource should be relevant to the chapter's learning objectives and provide value to students.")
                ->asStructured();

            $resourcesData = $response->structured['resources'];
            
            foreach ($resourcesData as $index => $resourceData) {
                // Create the main resource
                $resource = Resource::create([
                    'chapter_id' => $chapter->id,
                    'title' => $resourceData['title'],
                    'resource_type' => $resourceData['type'],
                    'position' => $index + 1,
                    'metadata' => null,
                ]);

                // Create the specific resource type data
                $this->createSpecificResourceData($resource, $chapter);
            }

            $this->command->info("Created {$count} resources for chapter: {$chapter->title}");
        } catch (\Exception $e) {
            // Fallback if AI generation fails
            for ($i = 0; $i < $count; $i++) {
                $type = $resourceTypes[$i % count($resourceTypes)];
                
                $resource = Resource::create([
                    'chapter_id' => $chapter->id,
                    'title' => "Resource " . ($i + 1) . " for {$chapter->title}",
                    'resource_type' => $type,
                    'position' => $i + 1,
                    'metadata' => null,
                ]);

                $this->createSpecificResourceData($resource, $chapter);
            }

            $this->command->info("Created {$count} fallback resources for chapter: {$chapter->title}");
        }
    }

    private function createSpecificResourceData(Resource $resource, Chapter $chapter): void
    {
        switch ($resource->resource_type) {
            case 'rich_text':
                $this->createRichTextResource($resource, $chapter);
                break;
            case 'attachment':
                $this->createAttachmentResource($resource);
                break;
            case 'external':
                $this->createExternalResource($resource, $chapter);
                break;
        }
    }

    private function createRichTextResource(Resource $resource, Chapter $chapter): void
    {
        try {
            $schema = new ObjectSchema(
                name: 'rich_text_content',
                description: 'Educational rich text content',
                properties: [
                    new StringSchema('content', 'Educational content in HTML format with appropriate headings, paragraphs, lists, and emphasis'),
                ],
                requiredFields: ['content']
            );

            $course = $chapter->course;
            $response = Prism::structured()
                ->using(Provider::Mistral, 'mistral-large-latest')
                ->withSchema($schema)
                ->withPrompt("Generate comprehensive educational content for:
                
Resource: {$resource->title}
Chapter: {$chapter->title}
Course: {$course->title}

The content should be:
- Well-structured with HTML formatting (h2, h3, p, ul, ol, strong, em tags)
- Educational and informative
- Appropriate for university-level learning
- 3-5 paragraphs with proper formatting
- Include examples or practical applications where relevant")
                ->asStructured();

            RichTextResource::create([
                'resource_id' => $resource->id,
                'content' => $response->structured['content'],
                'format' => 'html',
            ]);
        } catch (\Exception $e) {
            // Fallback content
            RichTextResource::create([
                'resource_id' => $resource->id,
                'content' => "<h2>{$resource->title}</h2><p>This is educational content related to {$chapter->title}. Students will find comprehensive information and examples to help understand the key concepts covered in this chapter.</p><p>The material builds upon previous knowledge and prepares students for upcoming topics in the course.</p>",
                'format' => 'html',
            ]);
        }
    }

    private function createAttachmentResource(Resource $resource): void
    {
        AttachmentResource::create([
            'resource_id' => $resource->id,
        ]);
        
        // Create mock attachments
        $attachmentTypes = [
            ['filename' => 'lecture_notes.pdf', 'mime_type' => 'application/pdf', 'extension' => 'pdf'],
            ['filename' => 'worksheet.docx', 'mime_type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'extension' => 'docx'],
            ['filename' => 'presentation.pptx', 'mime_type' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'extension' => 'pptx'],
            ['filename' => 'template.xlsx', 'mime_type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'extension' => 'xlsx'],
        ];

        $attachmentData = $attachmentTypes[array_rand($attachmentTypes)];
        
        $resource->attachmentResource->attachments()->create([
            'filename' => $attachmentData['filename'],
            'mime_type' => $attachmentData['mime_type'],
            'extension' => $attachmentData['extension'],
            'size' => rand(100000, 5000000),
            'path' => 'attachments/' . uniqid() . '.' . $attachmentData['extension'],
            'collection' => 'resources',
            'is_private' => true,
        ]);
    }

    private function createExternalResource(Resource $resource, Chapter $chapter): void
    {
        try {
            $schema = new ObjectSchema(
                name: 'external_resource_data',
                description: 'Data for external educational resource',
                properties: [
                    new StringSchema('external_url', 'A realistic educational URL (can be example.com based)'),
                    new StringSchema('link_title', 'A descriptive title for the external resource'),
                    new StringSchema('link_description', 'A brief description of what the external resource contains'),
                ],
                requiredFields: ['external_url', 'link_title', 'link_description']
            );

            $course = $chapter->course;
            $response = Prism::structured()
                ->using(Provider::Mistral, 'mistral-large-latest')
                ->withSchema($schema)
                ->withPrompt("Generate external resource data for:
                
Resource: {$resource->title}
Chapter: {$chapter->title}
Course: {$course->title}

Create realistic educational external resource information. The URL can be example-based but should look realistic for the subject matter.")
                ->asStructured();

            ExternalResource::create([
                'resource_id' => $resource->id,
                'external_url' => $response->structured['external_url'],
                'link_title' => $response->structured['link_title'],
                'link_description' => $response->structured['link_description'],
                'favicon_url' => 'https://example.com/favicon.ico',
                'og_image_url' => 'https://picsum.photos/1200/630',
            ]);
        } catch (\Exception $e) {
            // Fallback external resource
            $educationalDomains = [
                'https://www.khanacademy.org/subject',
                'https://www.coursera.org/learn',
                'https://www.edx.org/course',
                'https://developer.mozilla.org/docs',
                'https://www.w3schools.com/tutorial',
            ];

            ExternalResource::create([
                'resource_id' => $resource->id,
                'external_url' => $educationalDomains[array_rand($educationalDomains)] . '/' . strtolower(str_replace(' ', '-', $resource->title)),
                'link_title' => $resource->title . ' - External Resource',
                'link_description' => 'Additional learning material and resources related to ' . $chapter->title,
                'favicon_url' => 'https://example.com/favicon.ico',
                'og_image_url' => 'https://picsum.photos/1200/630',
            ]);
        }
    }
} 