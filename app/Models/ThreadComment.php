<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class ThreadComment extends Model
{
    protected $fillable = [
        'thread_id',
        'author_id',
        'content',
        'parent_id',
    ];

    public function thread()
    {
        return $this->belongsTo(CourseThread::class, 'thread_id');
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function parentComment()
    {
        return $this->belongsTo(ThreadComment::class, 'parent_id');
    }

    public function replies()
    {
        return $this->hasMany(ThreadComment::class, 'parent_id');
    }
    
    /**
     * Get all attachments for this comment.
     */
    public function attachments(): MorphMany
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }
}
