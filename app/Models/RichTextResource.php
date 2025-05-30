<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RichTextResource extends Model
{
    protected $fillable = [
        'resource_id',
        'content',
        'format',
    ];

    public function resource(): BelongsTo
    {
        return $this->belongsTo(Resource::class);
    }
} 