<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\Course;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    public function run(): void
    {
        $courses = Course::all();

        foreach ($courses as $course) {
            // Each course has 3-5 announcements
            $numAnnouncements = rand(3, 5);
            
            for ($i = 1; $i <= $numAnnouncements; $i++) {
                Announcement::create([
                    'course_id' => $course->id,
                    'title' => "Important Announcement {$i}",
                    'content' => "This is an important announcement regarding {$course->title}. Please read carefully as it contains important information about upcoming events, deadlines, or course changes.",
                    'is_published' => true,
                    'published_at' => now()->subDays(rand(0, 30)),
                ]);
            }
        }
    }
} 