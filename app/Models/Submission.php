<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Submission extends Model
{
    protected $fillable = [
        'assignment_id',
        'user_id',
        'submitted_at',
        'is_late',
        'status', // 'draft', 'submitted', 'graded'
        'grade',
        'feedback',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'is_late' => 'boolean',
    ];

    // Relationships
    public function assignment()
    {
        return $this->belongsTo(Assignment::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function attachments(): MorphMany
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }

    public function quizAnswers()
    {
        return $this->hasMany(QuizAnswer::class);
    }

    public function isLate()
    {
        return $this->is_late;
    }

    public function isSubmitted()
    {
        return $this->status === 'submitted';
    }

    public function isDraft()
    {
        return $this->status === 'draft';
    }

    public function isGraded()
    {
        return $this->status === 'graded';
    }
}
