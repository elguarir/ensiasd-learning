<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileSetupRequest;
use App\Models\InstructorProfile;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProfileCompletionController extends Controller
{
    public function create()
    {
        if(Auth::user()->profile_completed_at && Auth::user()->role) {
            return redirect()->route('dashboard');
        }
        return Inertia::render('profile/profile-setup');
    }

    public function store(ProfileSetupRequest $request)
    {
        // Start a database transaction
        DB::beginTransaction();

        try {
            $user = $request->user();
            $validated = $request->validated();

            // Prepare user data
            $userData = [
                'name' => $validated['name'],
                'username' => $validated['username'],
                'role' => $validated['accountType'],
                'profile_completed_at' => now(),
            ];

            if ($request->hasFile('avatar')) {
                $avatarPath = $request->file('avatar')->store('avatars', [
                    'disk' => 's3',
                    'visibility' => 'public',
                ]);

                $avatarUrl = Storage::disk('s3')->url($avatarPath);

                if ($user->avatar) {
                    $oldAvatarPath = parse_url($user->avatar, PHP_URL_PATH);
                    Storage::disk('s3')->delete(ltrim($oldAvatarPath, '/'));
                }

                $userData['avatar'] = $avatarUrl;
            }

            $user->update($userData);

            if ($validated['accountType'] === 'instructor') {
                InstructorProfile::updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'bio' => $validated['bio'],
                        'expertise_areas' => $validated['expertise_areas'],
                        'social_links' => $validated['social_links'],
                    ]
                );
            }


            DB::commit();

            return redirect()->route('dashboard')->with('success', 'Profile setup completed successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to complete profile setup. Please try again.']);
        }
    }
}
