<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExternalResource extends Model
{
    protected $fillable = [
        'resource_id',
        'external_url',
        'link_title',
        'link_description',
        'favicon_url',
        'og_image_url',
    ];

    public function resource(): BelongsTo
    {
        return $this->belongsTo(Resource::class);
    }
} 