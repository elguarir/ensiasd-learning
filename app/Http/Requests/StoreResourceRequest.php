<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreResourceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Add proper authorization logic later if needed
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $rules = [
            'chapter_id' => 'required|exists:chapters,id',
            'title' => 'required|string|max:255',
            'resource_type' => 'required|in:attachment,rich_text,quiz,external',
        ];

        // Add conditional validation rules based on resource type
        switch ($this->resource_type) {
            case 'attachment':
                $rules['attachment.files'] = 'required|array';
                $rules['attachment.files.*'] = 'file|max:20480|mimes:jpeg,png,jpg,gif,pdf,doc,docx,ppt,pptx,txt,zip,csv';
                break;

            case 'rich_text':
                $rules['rich_text.content'] = 'required|string';
                break;

            case 'quiz':
                $rules['quiz.questions'] = 'required|array|min:1';
                $rules['quiz.questions.*.question'] = 'required|string';
                $rules['quiz.questions.*.options'] = 'required|array|min:2';
                $rules['quiz.questions.*.options.*.text'] = 'required|string';
                $rules['quiz.questions.*.options.*.is_correct'] = 'required|boolean';
                break;

            case 'external':
                $rules['external.external_url'] = 'required|url|max:2048';
                $rules['external.link_title'] = 'nullable|string|max:255';
                $rules['external.link_description'] = 'nullable|string';
                break;
        }

        return $rules;
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'title.required' => 'The title is required.',
            'title.max' => 'The title may not be longer than 255 characters.',
            'chapter_id.required' => 'The chapter is required.',
            'chapter_id.exists' => 'The selected chapter does not exist.',
            'resource_type.required' => 'The resource type is required.',
            'resource_type.in' => 'The selected resource type is invalid.',
            'attachment.files.required' => 'Please upload at least one file.',
            'attachment.files.*.max' => 'The file size must not exceed 20MB.',
            'attachment.files.*.mimes' => 'The file must be a valid file type.',
            'rich_text.content.required' => 'The content is required.',
            'quiz.questions.required' => 'At least one question is required.',
            'quiz.questions.min' => 'At least one question is required.',
            'quiz.questions.*.question.required' => 'The question text is required.',
            'quiz.questions.*.options.min' => 'Each question must have at least two options.',
            'quiz.questions.*.options.*.text.required' => 'The option text is required.',
            'external.external_url.required' => 'The external URL is required.',
            'external.external_url.url' => 'Please enter a valid URL.',
            'external.external_url.max' => 'The URL may not be longer than 2048 characters.',
        ];
    }
} 