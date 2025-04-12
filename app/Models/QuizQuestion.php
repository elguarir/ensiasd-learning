<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuizQuestion extends Model
{
    protected $fillable = [
        'assignment_id',
        'question_text',
        'position',
        'points',
    ];

    public function assignment()
    {
        return $this->belongsTo(Assignment::class);
    }

    public function options()
    {
        return $this->hasMany(QuizOption::class);
    }

    public function answers()
    {
        return $this->hasMany(QuizAnswer::class);
    }
} 