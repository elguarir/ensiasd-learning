<?php

namespace Database\Seeders;

use App\Models\CourseThread;
use App\Models\ThreadComment;
use App\Models\User;
use Illuminate\Database\Seeder;

class ThreadCommentSeeder extends Seeder
{
    public function run(): void
    {
        $threads = CourseThread::all();
        $students = User::where('role', 'student')->get();
        $instructors = User::where('role', 'instructor')->get();

        foreach ($threads as $thread) {
            // Each thread has 3-8 comments
            $numComments = rand(3, 8);
            
            for ($i = 1; $i <= $numComments; $i++) {
                // Mix of student and instructor comments
                $user = ($i === 1) ? $instructors->random() : $students->random();
                
                ThreadComment::create([
                    'thread_id' => $thread->id,
                    'user_id' => $user->id,
                    'content' => $this->getCommentContent($user->role, $i),
                    'created_at' => $thread->created_at->addDays(rand(0, 7)),
                ]);
            }
        }
    }

    private function getCommentContent(string $role, int $commentNumber): string
    {
        if ($role === 'instructor') {
            return "Thank you for your question. Let me help clarify this concept. The key points to understand are...";
        }

        $responses = [
            "I had the same question! Thanks for asking.",
            "I think I understand this differently. Here's my perspective...",
            "Great question! I was wondering about this too.",
            "I found this resource helpful when I was learning this concept: [resource link]",
            "Can someone provide more examples to help understand this better?",
            "I think I understand now. Let me try to explain it in my own words...",
        ];

        return $responses[array_rand($responses)];
    }
} 