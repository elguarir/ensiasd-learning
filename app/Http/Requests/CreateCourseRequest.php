<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateCourseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only allow instructors to create courses
        return $this->user() && $this->user()->role === 'instructor';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|max:255',
            'color' => 'required|string|max:255',
            'image' => 'nullable|file|image|max:10240',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Course title is required',
            'title.max' => 'Course title cannot be longer than 255 characters',
            'description.required' => 'Course description is required',
            'category.required' => 'Course category is required',
            'color.required' => 'Course color is required',
            'image.image' => 'The file must be an image',
            'image.max' => 'The image must not be larger than 10MB',
        ];
    }
} 