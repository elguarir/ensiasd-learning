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
                'max:10240',
            ],
        ];
        return $rules;
    }

    public function messages(): array
    {
        return [
            'avatar.max' => 'The profile picture must not be larger than 10MB.',
            'name.required' => 'Please enter your name.',
            'name.max' => 'Your name cannot be longer than 255 characters.',
            'username.required' => 'Please choose a username.',
            'username.max' => 'Your username cannot be longer than 255 characters.',
            'username.unique' => 'This username is already taken.',
            'avatar.image' => 'The profile picture must be an image.',
            'avatar.mimes' => 'The profile picture must be a JPEG, PNG or JPG file.'
        ];
    }
}
