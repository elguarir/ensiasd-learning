<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuizAnswer extends Model
{
    protected $fillable = [
        'submission_id',
        'quiz_question_id',
        'quiz_option_id',
    ];

    public function submission()
    {
        return $this->belongsTo(Submission::class);
    }

    public function question()
    {
        return $this->belongsTo(QuizQuestion::class, 'quiz_question_id');
    }

    public function selectedOption()
    {
        return $this->belongsTo(QuizOption::class, 'quiz_option_id');
    }
} 