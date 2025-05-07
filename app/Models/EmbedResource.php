<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmbedResource extends Model
{
    protected $fillable = [
        'resource_id',
        'embed_url',
        'provider',
    ];

    public function resource(): BelongsTo
    {
        return $this->belongsTo(Resource::class);
    }
} 