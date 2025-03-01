<?php

namespace App\Traits;

use App\Models\Attachment;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

trait HasAttachments
{
    /**
     * Get all attachments for this model.
     */
    public function attachments(): MorphMany
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }

    /**
     * Get attachments for a specific collection.
     */
    public function getAttachments(string $collection = 'default')
    {
        return $this->attachments()->where('collection', $collection)->get();
    }

    /**
     * Attach a file to this model.
     */
    public function attachFile(UploadedFile $file, array $options = [])
    {
        $disk = $options['disk'] ?? config('filesystems.default');
        $collection = $options['collection'] ?? 'uploads';
        $directory = $options['directory'] ?? $this->getAttachmentDirectory();
        $originalFilename = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();

        $filename = Str::uuid() . ($extension ? '.' . $extension : '');
        $path = $file->storeAs($directory, $filename, ['disk' => $disk]);

        if (!$path) {
            throw new \Exception('File upload failed');
        }

        return $this->attachments()->create([
            'original_filename' => $originalFilename,
            'disk' => $disk,
            'path' => $path,
            'filename' => $filename,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'extension' => $extension,
            'collection' => $collection,
        ]);
    }

    /**
     * Get the directory for storing attachments.
     */
    protected function getAttachmentDirectory(): string
    {
        // Default pattern: attachments/model_name/model_id
        $className = Str::snake(class_basename($this));
        return "attachments/{$className}/{$this->getKey()}";
    }

    /**
     * Delete all attachments for this model.
     */
    public function deleteAttachments(string $collection = null)
    {
        $query = $this->attachments();

        if ($collection) {
            $query->where('collection', $collection);
        }

        $attachments = $query->get();

        foreach ($attachments as $attachment) {
            $attachment->delete();
        }
    }
}
