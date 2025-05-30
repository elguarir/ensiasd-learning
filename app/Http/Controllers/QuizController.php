<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use App\Models\AttachmentResource;
use App\Models\Attachment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Prism\Prism\Prism;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Schema\ObjectSchema;
use Prism\Prism\Schema\StringSchema;
use Prism\Prism\Schema\ArraySchema;
use Prism\Prism\Schema\BooleanSchema;
use Prism\Prism\ValueObjects\Messages\UserMessage;
use Prism\Prism\ValueObjects\Messages\Support\Document;
use Illuminate\Support\Facades\Storage;

class QuizController extends Controller
{
    /**
     * Generate a quiz for a resource using PrismPHP and MistralAI
     * @param Request $request
     * @return JsonResponse
     */


    public function __construct()
    {
        set_time_limit(900);
    }

    public function generateQuiz(Request $request)
    {
        $resourceIds = $request->input('attachments');
        $numberOfQuestions = $request->input('numberOfQuestions', 10);
        $difficulty = $request->input('difficulty', 'medium');
        $additionalInstructions = $request->input('additionalInstructions', '');

        // Get the resources of type 'attachment' and their related attachments
        $resources = Resource::whereIn('id', $resourceIds)
            ->where('resource_type', 'attachment')
            ->with('attachmentResource.attachments')
            ->limit(5)
            ->get();

        if ($resources->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No valid documents found',
            ], 400);
        }

        try {
            // Define the quiz question schema as a single structure
            $quizSchema = new ObjectSchema(
                name: 'quiz',
                description: 'A quiz containing multiple questions',
                properties: [
                    new ArraySchema(
                        name: 'questions',
                        description: 'An array of quiz questions',
                        items: new ObjectSchema(
                            name: 'question',
                            description: 'A quiz question with options',
                            properties: [
                                new StringSchema('question', 'The question text'),
                                new ArraySchema(
                                    name: 'options',
                                    description: 'Array of options',
                                    items: new ObjectSchema(
                                        name: 'option',
                                        description: 'A quiz option',
                                        properties: [
                                            new StringSchema('text', 'The text of the option'),
                                            new BooleanSchema('is_correct', 'Whether this option is correct'),
                                        ],
                                        requiredFields: ['text', 'is_correct']
                                    )
                                ),
                            ],
                            requiredFields: ['question', 'options']
                        ),
                    )
                ],
                requiredFields: ['questions']
            );

            // Prepare documents for Prism using public URLs
            $docs = [];
            foreach ($resources as $resource) {
                if ($resource->attachmentResource) {
                    foreach ($resource->attachmentResource->attachments as $attachment) {
                        if (strtolower(pathinfo($attachment->filename, PATHINFO_EXTENSION)) === 'pdf') {
                            // Generate a public URL for the file
                            $fileUrl = Storage::url($attachment->path);
                            $fullUrl = url($fileUrl);

                            // Add document with full URL
                            $docs[] = Document::fromUrl($fullUrl);
                        }
                    }
                }
            }

            if (empty($docs)) {
                return back()->with([
                    'success' => false,
                    'message' => 'No valid PDF documents found'
                ], 400);
            }

            $systemPrompt = "You are a quiz generator. You are given a list of PDF documents and a number of questions to generate. ";
            $prompt = "Create a multiple-choice quiz based on the content of the provided PDF documents. " .
                "Each question should have 4 options with exactly one correct answer. make sure to randomize the options. so the correct answer is not always on the same position. " .
                "Generate $numberOfQuestions questions that test understanding of key concepts from the documents. " .
                "Ensure the questions cover different topics from the documents. " .
                "The difficulty level of the questions should be $difficulty. " .
                ($additionalInstructions ? "Additional instructions: $additionalInstructions" : "");

            // Generate the quiz using Prism structured output
            $response = Prism::structured()
                ->using(Provider::Mistral, 'mistral-medium-latest')
                ->withSystemPrompt($systemPrompt)
                ->withSchema($quizSchema)
                ->withMessages([
                    new UserMessage(
                        content: $prompt,
                        additionalContent: $docs
                    )
                ])
                ->withClientOptions(['timeout' => 900])
                ->asStructured();

            $quizResponse = [
                'success' => true,
                'questions' => $response->structured['questions']
            ];
            return response()->json($quizResponse);
        } catch (\Exception $e) {
            return back()->with('quiz_response', [
                'success' => false,
                'message' => 'Failed to generate quiz: ' . $e->getMessage()
            ]);
        }
    }
}
