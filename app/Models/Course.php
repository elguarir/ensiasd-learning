<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = [
        'instructor_id',
        'title',
        'description',
        'image',
        'code',
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

    public function isPublished()
    {
        return $this->status === 'published';
    }
}
