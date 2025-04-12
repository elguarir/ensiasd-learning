<?php

namespace Database\Seeders;

use App\Models\User;
use App\Services\AvatarService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Mohamed EL GUARIR',
            'email' => 'moha@elguarir.com',
            'username' => 'elguarir',
            'password' => Hash::make('moha@elguarir.com'),
            'role' => 'instructor',
            'avatar' => AvatarService::generateDefaultAvatar('Mohamed EL GUARIR'),
            'profile_completed_at' => now(),
        ]);

    }
} 