<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileSetupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'name' => [
                'required',
                'max:255',
            ],
            'username' => [
                'required',
                'max:255',
                Rule::unique('users', 'username')->ignore($this->user()->id)
            ],
            'avatar' => [
                'nullable',
                'image',
                'mimes:jpeg,png,jpg',
                'max:2048',
            ],
            'accountType' => [
                'required',
                Rule::in(['student', 'instructor'])
            ],
        ];

        // Add instructor-specific validation rules when account type is instructor
        if ($this->input('accountType') === 'instructor') {
            $rules['bio'] = ['required', 'string', 'min:100', 'max:1000'];
            $rules['expertise_areas'] = [
                'required',
                'array',
                'min:1',
                'max:5'
            ];
            $rules['expertise_areas.*'] = ['required', 'string', 'max:50'];
            $rules['social_links'] = ['required', 'array'];
            $rules['social_links.linkedin'] = ['nullable', 'url'];
            $rules['social_links.twitter'] = ['nullable', 'url'];
            $rules['social_links.github'] = ['nullable', 'url'];
            $rules['social_links.website'] = ['nullable', 'url'];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'accountType.in' => 'The account type must be either student or instructor.',
            'avatar.max' => 'The profile picture must not be larger than 2MB.',
            'bio.required' => 'A bio is required for instructor accounts.',
            'bio.min' => 'Your bio should be at least 100 characters.',
            'expertise_areas.required' => 'Please specify at least one area of expertise.',
            'expertise_areas.max' => 'You can specify up to 5 areas of expertise.',
            'social_links.*.url' => 'Please provide valid URLs for social links.',
        ];
    }
}
