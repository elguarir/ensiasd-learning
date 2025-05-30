<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'instructor_id',
        'title',
        'description',
        'image',
        'code',
        'invite_token',
        'color',
        'category',
        'status', // draft, published, archived
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'status' => 'string',
    ];

    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function chapters()
    {
        return $this->hasMany(Chapter::class)->orderBy('position');
    }

    public function enrollments()
    {
        return $this->hasMany(CourseEnrollment::class);
    }

    public function students()
    {
        return $this->belongsToMany(User::class, 'course_enrollments');
    }

    public function threads()
    {
        return $this->hasMany(CourseThread::class);
    }

    public function announcements()
    {
        return $this->hasMany(Announcement::class);
    }

    public function isPublished()
    {
        return $this->status === 'published';
    }

    /**
     * Get the invite link for this course
     */
    public function getInviteLink()
    {
        return url("/courses/join/{$this->invite_token}");
    }
}
