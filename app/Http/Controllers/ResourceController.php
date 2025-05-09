<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreResourceRequest;
use App\Models\AttachmentResource;
use App\Models\Chapter;
use App\Models\ExternalResource;
use App\Models\Resource;
use App\Models\RichTextResource;
use App\Models\QuizQuestion;
use App\Models\QuizOption;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ResourceController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreResourceRequest $request): RedirectResponse
    {
        try {
            DB::beginTransaction();

            // Create the base resource
            $resource = Resource::create([
                'chapter_id' => $request->chapter_id,
                'resource_type' => $request->resource_type,
                'title' => $request->title,
                'position' => $this->getNextPosition($request->chapter_id),
            ]);

            // Handle specific resource type data
            switch ($request->resource_type) {
                case 'attachment':
                    $this->createAttachmentResource($resource, $request);
                    break;
                case 'rich_text':
                    $this->createRichTextResource($resource, $request);
                    break;
                case 'quiz':
                    $this->createQuizResource($resource, $request);
                    break;
                case 'external':
                    $this->createExternalResource($resource, $request);
                    break;
            }

            DB::commit();

            return redirect()->back()->with('success', 'Resource added successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Failed to create resource. ' . $e->getMessage()]);
        }
    }

    /**
     * Get the next position for a resource in a chapter
     */
    private function getNextPosition(int $chapterId): int
    {
        $maxPosition = Resource::where('chapter_id', $chapterId)->max('position') ?? 0;
        return $maxPosition + 1;
    }

    /**
     * Create an attachment resource
     */
    private function createAttachmentResource(Resource $resource, StoreResourceRequest $request): void
    {
        // Create the attachment resource
        $attachmentResource = AttachmentResource::create([
            'resource_id' => $resource->id,
        ]);

        // Handle file uploads
        if ($request->hasFile('attachment.files')) {
            foreach ($request->file('attachment.files') as $file) {
                $path = $file->store('resources/attachments', [
                    'disk' => 's3',
                    'visibility' => 'public',
                ]);

                $attachmentResource->attachments()->create([
                    'filename' => $file->getClientOriginalName(),
                    'path' => $path,
                    'size' => $file->getSize(),
                    'mime_type' => $file->getMimeType(),
                    'extension' => $file->getClientOriginalExtension(),
                    'collection' => 'resources',
                    'is_private' => false,
                ]);
            }
        }
    }

    /**
     * Create a rich text resource
     */
    private function createRichTextResource(Resource $resource, StoreResourceRequest $request): void
    {
        RichTextResource::create([
            'resource_id' => $resource->id,
            'content' => $request->input('rich_text.content'),
            'format' => 'html',
        ]);
    }

    /**
     * Create a quiz resource
     */
    private function createQuizResource(Resource $resource, StoreResourceRequest $request): void
    {
        $questions = $request->input('quiz.questions');

        foreach ($questions as $questionData) {
            $question = QuizQuestion::create([
                'resource_id' => $resource->id,
                'question' => $questionData['question'],
            ]);

            foreach ($questionData['options'] as $optionData) {
                QuizOption::create([
                    'quiz_question_id' => $question->id,
                    'text' => $optionData['text'],
                    'is_correct' => $optionData['is_correct'],
                ]);
            }
        }
    }

    /**
     * Create an external resource
     */
    private function createExternalResource(Resource $resource, StoreResourceRequest $request): void
    {
        ExternalResource::create([
            'resource_id' => $resource->id,
            'external_url' => $request->input('external.external_url'),
            'link_title' => $request->input('external.link_title'),
            'link_description' => $request->input('external.link_description'),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Resource $resource): RedirectResponse
    {
        try {
            DB::beginTransaction();

            // Check if resource exists
            if (!$resource) {
                return redirect()->back()->withErrors(['error' => 'Resource not found']);
            }

            // Handle resource type specific cleanup
            switch ($resource->resource_type) {
                case 'attachment':
                    // Delete attachment files from storage
                    if ($resource->attachmentResource) {
                        foreach ($resource->attachmentResource->attachments as $attachment) {
                            if ($attachment->path) {
                                Storage::disk('s3')->delete($attachment->path);
                            }
                        }
                    }
                    break;
            }

            // Delete the resource (cascade will handle related records)
            $resource->delete();

            DB::commit();
            return redirect()->back()->with('success', 'Resource deleted successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Failed to delete resource: ' . $e->getMessage()]);
        }
    }
}
