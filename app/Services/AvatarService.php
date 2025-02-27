<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

class AvatarService
{
    /**
     * Generate a default avatar URL for a user name
     *
     * @param string $name
     * @return string
     */
    public function generateDefaultAvatar(string $name): string
    {
        return sprintf(
            'https://api.dicebear.com/9.x/initials/svg?seed=%s&backgroundColor=00acc1,5e35b1,d81b60&backgroundRotation=135,225&scale=70',
            urlencode($name)
        );
    }
    
    /**
     * Get the URL for an avatar
     *
     * @param string|null $avatar
     * @return string|null
     */
    public function getAvatarUrl(?string $avatar): ?string
    {
        if (!$avatar) {
            return null;
        }
        
        if (filter_var($avatar, FILTER_VALIDATE_URL)) {
            return $avatar;
        }
        
        return Storage::disk('avatars')->url($avatar);
    }
}
