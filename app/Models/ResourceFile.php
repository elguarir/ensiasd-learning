<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResourceFile extends Model
{
    protected $fillable = [
        'resource_id',
    ];

    public function resource()
    {
        return $this->belongsTo(Resource::class);
    }

    public function file()
    {
        return $this->resource->attachments()
            ->where('collection', 'file_resources')
            ->latest()
            ->first();
    }
}
