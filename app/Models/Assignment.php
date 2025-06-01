<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Factories\HasFactory; // Add this

class Assignment extends Model
{
    use HasFactory; // Add this

    protected $fillable = [
        'course_id',
        'title',
        'description',
        'type',
        'due_date',
        'points_possible',
        'published',
        'instructions',
        'allow_late_submissions',
        'late_penalty_percentage',
        'settings',
    ];

    protected $casts = [
        'due_date' => 'datetime',
        'published' => 'boolean',
        'points_possible' => 'integer',
        'allow_late_submissions' => 'boolean',
        'late_penalty_percentage' => 'integer',
        'settings' => 'array',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
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

    public function getStatusForUser($userId)
    {
        $submission = $this->submissions()->where('user_id', $userId)->first();

        if (!$submission) {
            return 'not_started';
        }

        return $submission->status;
    }

    public function isAvailable()
    {
        return $this->published;
    }

    public function getFormattedType()
    {
        return $this->type === 'quiz' ? 'Quiz' : 'File Submission';
    }
}
