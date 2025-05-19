<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class CourseThread extends Model
{
    protected $fillable = [
        'course_id',
        'author_id',
        'title',
        'content',
        'is_pinned',
    ];

    protected $casts = [
        'is_pinned' => 'boolean',
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
    
    /**
     * Get all attachments for this thread.
     */
    public function attachments(): MorphMany
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }
}
