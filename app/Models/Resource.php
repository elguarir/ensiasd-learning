<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Resource extends Model
{

    protected $fillable = [
        'chapter_id',
        'title',
        'description',
        'resource_type',
        'position',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function chapter(): BelongsTo
    {
        return $this->belongsTo(Chapter::class);
    }

    public function attachments(): MorphMany
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }

    public function isResourceType($type)
    {
        return $this->resource_type === $type;
    }

    // You can add similar methods for other resource types
    // public function embedResource() {...}
    // public function richTextResource() {...}
    // public function externalResource() {...}
}
