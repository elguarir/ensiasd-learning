<?php

namespace App\Models;

use App\Traits\HasAttachments;
use Illuminate\Database\Eloquent\Model;

class Resource extends Model
{
    use HasAttachments;

    protected $fillable = [
        'chapter_id',
        'title',
        'resource_type',
        'position',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function chapter()
    {
        return $this->belongsTo(Chapter::class);
    }

    public function fileResource()
    {
        return $this->hasOne(ResourceFile::class);
    }

//    public function embedResource()
//    {
//        return $this->hasOne(EmbedResource::class);
//    }
//
//    public function richTextResource()
//    {
//        return $this->hasOne(RichTextResource::class);
//    }
//
//    public function externalResource()
//    {
//        return $this->hasOne(ExternalResource::class);
//    }
//
}
