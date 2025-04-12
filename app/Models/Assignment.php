<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Assignment extends Model
{
    protected $fillable = [
        'course_id',
        'chapter_id', // Optional - to associate with specific chapters
        'title',
        'description',
        'type', // 'file' or 'quiz'
        'due_date',
        'points_possible',
        'published',
    ];

    protected $casts = [
        'due_date' => 'datetime',
        'published' => 'boolean',
    ];

    // Relationships
    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function chapter()
    {
        return $this->belongsTo(Chapter::class);
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }

    public function quizQuestions()
    {
        return $this->hasMany(QuizQuestion::class);
    }

    /**
     * Get all attachments for this assignment (instructions, materials, etc.)
     */
    public function attachments(): MorphMany
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }

    // Helper methods
    public function isQuiz()
    {
        return $this->type === 'quiz';
    }

    public function isFileSubmission()
    {
        return $this->type === 'file';
    }
}
