<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourseThread extends Model
{
    protected $fillable = [
        'course_id',
        'author_id',
        'title',
        'description',
        'image',
        'category',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function comments()
    {
        return $this->hasMany(ThreadComment::class, 'thread_id');
    }
}
