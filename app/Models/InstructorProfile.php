<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InstructorProfile extends Model
{
    protected $fillable = [
        'user_id',
        'bio',
        'expertise_areas',
        'social_links',
        'profile_picture',
    ];

    protected $casts = [
        'expertise_areas' => 'array',
        'social_links' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

