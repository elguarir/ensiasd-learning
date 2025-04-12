<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'avatar',
        'role',
        'profile_completed_at',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function instructorProfile()
    {
        return $this->hasOne(InstructorProfile::class);
    }

    public function courseEnrollments()
    {
        return $this->hasMany(CourseEnrollment::class);
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'course_enrollments');
    }

    public function createdCourses()
    {
        return $this->hasMany(Course::class, 'instructor_id');
    }

    public function courseThreads()
    {
        return $this->hasMany(CourseThread::class, 'author_id');
    }

    public function threadComments()
    {
        return $this->hasMany(ThreadComment::class, 'author_id');
    }

    // Assignment relationships
    public function createdAssignments()
    {
        return $this->hasManyThrough(
            Assignment::class,
            Course::class,
            'instructor_id', // Foreign key on courses table
            'course_id', // Foreign key on assignments table
            'id', // Local key on users table
            'id' // Local key on courses table
        );
    }

    // Submission relationships
    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }

    // Quiz answers
    public function quizAnswers()
    {
        return $this->hasManyThrough(
            QuizAnswer::class,
            Submission::class,
            'user_id', // Foreign key on submissions table
            'submission_id', // Foreign key on quiz_answers table
            'id', // Local key on users table
            'id' // Local key on submissions table
        );
    }

    // Submission attachments
    public function submissionAttachments()
    {
        return $this->hasManyThrough(
            Attachment::class,
            Submission::class,
            'user_id', // Foreign key on submissions table
            'attachable_id', // Foreign key on attachments table
            'id', // Local key on users table
            'id' // Local key on submissions table
        )->where('attachable_type', Submission::class);
    }

    // Helper methods for assignments
    public function hasSubmittedAssignment($assignmentId)
    {
        return $this->submissions()
            ->where('assignment_id', $assignmentId)
            ->where('status', '!=', 'draft')
            ->exists();
    }

    public function getAssignmentSubmission($assignmentId)
    {
        return $this->submissions()
            ->where('assignment_id', $assignmentId)
            ->first();
    }
}
