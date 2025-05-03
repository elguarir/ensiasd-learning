<?php

namespace Database\Seeders;

use App\Models\User;
use App\Services\AvatarService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Hassan EL GUARIR',
            'email' => 'hassan@elguarir.com',
            'username' => 'hassan',
            'password' => Hash::make('hassan@elguarir.com'),
            'role' => 'student',
            'avatar' => AvatarService::generateDefaultAvatar('Hassan EL GUARIR'),
            'profile_completed_at' => now(),
        ]);

        User::create([
            'name' => 'Mohamed EL GUARIR',
            'email' => 'moha@elguarir.com',
            'username' => 'moha',
            'password' => Hash::make('moha@elguarir.com'),
            'role' => 'student',
            'avatar' => AvatarService::generateDefaultAvatar('Mohamed EL GUARIR'),
            'profile_completed_at' => now(),
        ]);

        User::create([
            'name' => 'John Doe',
            'email' => 'moha@elguarir.dev',
            'username' => 'mohaa',
            'password' => Hash::make('moha@elguarir.dev'),
            'role' => 'instructor',
            'avatar' => AvatarService::generateDefaultAvatar('John Doe'),
            'profile_completed_at' => now(),
        ]);



    }
} 