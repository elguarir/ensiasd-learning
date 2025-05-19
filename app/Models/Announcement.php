<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Announcement extends Model
{
    protected $fillable = [
        'course_id',
        'user_id',
        'content',
    ];

    /**
     * Get the course that owns the announcement.
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Get the user who created the announcement.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the comments for the announcement.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(AnnouncementComment::class);
    }
    
    /**
     * Get all attachments for this announcement.
     */
    public function attachments(): MorphMany
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }
}
