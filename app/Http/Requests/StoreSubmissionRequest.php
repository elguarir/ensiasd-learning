<?php

namespace App\Http\Requests\Student;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\QuizOption;

class StoreSubmissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        // TODO
    }

    public function rules(): array
    {
    //    TODO
    }
}
