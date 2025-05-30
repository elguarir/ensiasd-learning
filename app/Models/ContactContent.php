<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactContent extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_name',
        'address',
        'phone',
        'email',
        'office_hours',
        'map_embed_code',
        'contact_image'
    ];
}