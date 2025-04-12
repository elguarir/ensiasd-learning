<?php

namespace App\Http\Requests\Settings;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'avatar' => [
                'nullable',
                'image',
                'mimes:jpeg,png,jpg',
                'max:10240', // 10MB max size
            ],
            'username' => [
                'required',
                'string',
                'max:255',
                'lowercase:all',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Please enter your name.',
            'name.string' => 'Name must be text.',
            'name.max' => 'Your name cannot be longer than 255 characters.',

            'email.required' => 'Please enter your email address.',
            'email.string' => 'Email must be text.',
            'email.lowercase' => 'Email must be lowercase.',
            'email.email' => 'Please enter a valid email address.',
            'email.max' => 'Email cannot be longer than 255 characters.',
            'email.unique' => 'This email is already registered.',

            'avatar.mimes' => 'The profile picture must be a JPEG, PNG or JPG file.',
            'avatar.max' => 'The profile picture must not be larger than 10MB.',

            'username.required' => 'Please choose a username.',
            'username.string' => 'Username must be text.',
            'username.max' => 'Your username cannot be longer than 255 characters.',
            'username.lowercase' => 'Username must be lowercase.',
            'username.unique' => 'This username is already taken.',
        ];
    }
}
