<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

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

    public function isResourceType($type)
    {
        return $this->resource_type === $type;
    }

    public function attachmentResource(): HasOne
    {
        return $this->hasOne(AttachmentResource::class);
    }

    public function embedResource(): HasOne
    {
        return $this->hasOne(EmbedResource::class);
    }

    public function richTextResource(): HasOne
    {
        return $this->hasOne(RichTextResource::class);
    }

    public function externalResource(): HasOne
    {
        return $this->hasOne(ExternalResource::class);
    }

    // You can add similar methods for other resource types
    // public function embedResource() {...}
    // public function richTextResource() {...}
    // public function externalResource() {...}
}
