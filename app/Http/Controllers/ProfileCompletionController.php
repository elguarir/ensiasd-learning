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
        if (Auth::user()->profile_completed_at && Auth::user()->role) {
            return redirect()->route('dashboard.index');
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
            
            $userData = [
                'name' => $validated['name'],
                'username' => $validated['username'],
                'role' => 'student',
                'profile_completed_at' => now(),
            ];

            if ($request->hasFile('avatar')) {
                $avatarPath = $request->file('avatar')->store('avatars', [
                    'disk' => 's3',
                    'visibility' => 'public',
                ]);

                $avatarUrl = Storage::url($avatarPath);

                if ($user->avatar) {
                    $oldAvatarPath = parse_url($user->avatar, PHP_URL_PATH);
                    Storage::delete(ltrim($oldAvatarPath, '/'));
                }

                $userData['avatar'] = $avatarUrl;
            }

            $user->update($userData);

            DB::commit();

            return redirect()->route('dashboard.index')->with('success', 'Profile setup completed successfully!');
        } catch (\Exception $e) {
            dd($e);
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to complete profile setup. Please try again.']);
        }
    }
}
