<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAssignmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->role === 'instructor';
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'instructions' => 'nullable|string',
            'type' => 'required|in:file,quiz',
            'due_date' => 'nullable|date',
            'points_possible' => 'required|integer|min:0',
            'allow_late_submissions' => 'boolean',
            'late_penalty_percentage' => 'required_if:allow_late_submissions,true|integer|min:0|max:100',
            'published' => 'boolean',
            'questions' => 'required_if:type,quiz|array',
            'questions.*.question' => 'required_if:type,quiz|string',
            'questions.*.points' => 'required_if:type,quiz|integer|min:1',
            'questions.*.options' => 'required_if:type,quiz|array|min:2',
            'questions.*.options.*.text' => 'required_if:type,quiz|string',
            'questions.*.options.*.is_correct' => 'required_if:type,quiz|boolean',
        ];
    }
    
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->type === 'quiz' && $this->has('questions')) {
                foreach ($this->questions as $index => $question) {
                    $correctCount = collect($question['options'] ?? [])
                        ->filter(fn($option) => $option['is_correct'] ?? false)
                        ->count();
                        
                    if ($correctCount !== 1) {
                        $validator->errors()->add(
                            "questions.{$index}.options",
                            'Each question must have exactly one correct answer'
                        );
                    }
                }
            }
        });
    }
}
