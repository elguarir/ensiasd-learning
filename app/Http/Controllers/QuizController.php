<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Prism\Prism\Prism;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Schema\ObjectSchema;
use Prism\Prism\Schema\StringSchema;
use Prism\Prism\Schema\ArraySchema;
use Prism\Prism\ValueObjects\Messages\UserMessage;
use Prism\Prism\ValueObjects\Messages\Support\Document;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

class QuizController extends Controller
{
    /**
     * Generate a quiz for a resource using PrismPHP and MistralAI
     * @param Request $request
     * @return JsonResponse
     */
    public function generateQuiz(Request $request)
    {
        $attachmentIds = $request->input('attachments');
        $numberOfQuestions = $request->input('numberOfQuestions', 10);
        $difficulty = $request->input('difficulty', 'medium');
        $additionalInstructions = $request->input('additionalInstructions', '');

        $attachments = Resource::whereIn('id', $attachmentIds)->limit(5)->get();

        if ($attachments->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No valid documents found',
            ], 400);
        }

        try {
            // Define the quiz question schema
            $optionSchema = new ObjectSchema(
                name: 'option',
                description: 'A quiz option',
                properties: [
                    new StringSchema('text', 'The text of the option'),
                    new StringSchema('is_correct', 'Whether this option is correct (true/false)'),
                ],
                requiredFields: ['text', 'is_correct']
            );

            $questionSchema = new ObjectSchema(
                name: 'question',
                description: 'A quiz question with options',
                properties: [
                    new StringSchema('question', 'The question text'),
                    new ArraySchema('options', 'Array of options', $optionSchema),
                ],
                requiredFields: ['question', 'options']
            );

            $quizSchema = new ArraySchema(
                name: 'quiz',
                description: 'An array of quiz questions',
                items: $questionSchema
            );

            // Prepare documents for Prism using public URLs
            $docs = [];
            foreach ($attachments as $attachment) {
                $filePath = $attachment->file_path;
                if (strtolower(pathinfo($filePath, PATHINFO_EXTENSION)) === 'pdf') {
                    // Generate a public URL for the file
                    $fileUrl = Storage::url($filePath);
                    $fullUrl = url($fileUrl);
                    
                    // Add document with full URL
                    $docs[] = Document::fromUrl($fullUrl);
                }
            }

            if (empty($docs)) {
                return response()->json([
                    'success' => false, 
                    'message' => 'No valid PDF documents found'
                ], 400);
            }

            $prompt = "Create a multiple-choice quiz based on the content of the provided PDF documents. " .
                "Each question should have 4 options with exactly one correct answer. " .
                "Generate $numberOfQuestions questions that test understanding of key concepts from the documents. " .
                "Ensure the questions cover different topics from the documents. " .
                "The difficulty level of the questions should be $difficulty. " .
                ($additionalInstructions ? "Additional instructions: $additionalInstructions" : "");

            // Generate the quiz using Prism structured output
            $response = Prism::structured()
                ->using(Provider::Mistral, 'mistral-large-latest')
                ->withPrompt($prompt)
                ->withSchema($quizSchema)
                ->withMessages([
                    new UserMessage(
                        content: $prompt,
                        additionalContent: $docs
                    )
                ])
                ->withClientOptions(['timeout' => 300])
                ->asStructured();

            // Create a flash data for Inertia to access in the frontend
            $quizResponse = [
                'success' => true,
                'questions' => $response->structured,
            ];
            
            return back()->with('quiz_response', $quizResponse);
        } catch (\Exception $e) {
            Log::error('Quiz generation failed: ' . $e->getMessage());
            
            return back()->with('quiz_response', [
                'success' => false,
                'message' => 'Failed to generate quiz: ' . $e->getMessage()
            ]);
        }
    }
}
