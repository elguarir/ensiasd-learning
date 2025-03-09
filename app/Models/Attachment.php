<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Attachment extends Model
{
    use SoftDeletes;

    protected $disk;

    protected $fillable = [
        'original_filename',
        'path',
        'filename',
        'mime_type',
        'size',
        'extension',
        'attachable_id',
        'attachable_type',
        'collection',
        'is_private',
        'metadata',
    ];

    protected $casts = [
        'is_private' => 'boolean',
        'metadata' => 'array',
        'size' => 'integer',
    ];

    /**
     * Create a new model instance.
     */
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->disk = config('filesystems.default');
    }

    /**
     * Get the parent attachable model.
     */
    public function attachable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Get the URL to the file.
     */
    public function getUrlAttribute()
    {
        return Storage::disk($this->disk)->get($this->path);
    }

    /**
     * Get the full storage path to the file.
     */
    public function getStoragePathAttribute()
    {
        return Storage::disk($this->disk)->path($this->path);
    }

    /**
     * Determine if the file exists.
     */
    public function exists()
    {
        return Storage::disk($this->disk)->exists($this->path);
    }

    /**
     * Delete the file from storage.
     */
    public function deleteFile()
    {
        if ($this->exists()) {
            return Storage::disk($this->disk)->delete($this->path);
        }

        return false;
    }

    /**
     * Override the delete method to also remove the file.
     */
    public function delete()
    {
        $this->deleteFile();
        return parent::delete();
    }

    /**
     * Override the forceDelete method to also remove the file.
     */
    public function forceDelete()
    {
        $this->deleteFile();
        return parent::forceDelete();
    }
}
