<?php

namespace Database\Seeders;

use App\Models\User;
use App\Services\AvatarService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Prism;
use Prism\Prism\Schema\ObjectSchema;
use Prism\Prism\Schema\StringSchema;
use Prism\Prism\Schema\ArraySchema;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create the instructor using Prism for realistic data
        $instructor = $this->createInstructor();
        
        // Create 10 students using Prism for realistic data
        $this->createStudents(10);
    }

    private function createInstructor(): User
    {
        try {
            $schema = new ObjectSchema(
                name: 'instructor_data',
                description: 'Data for creating a realistic instructor profile',
                properties: [
                    new StringSchema('name', 'A realistic full name for an instructor'),
                    new StringSchema('username', 'A simple username based on the name (lowercase, no spaces)'),
                    new StringSchema('email', 'A professional email address'),
                ],
                requiredFields: ['name', 'username', 'email']
            );

            $response = Prism::structured()
                ->using(Provider::Mistral, 'mistral-large-latest')
                ->withSchema($schema)
                ->withPrompt("Generate realistic data for a university instructor. The username should be simple and professional.")
                ->asStructured();

            $data = $response->structured;
            
            return User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'username' => $data['username'],
                'password' => Hash::make('password'),
                'role' => 'instructor',
                'avatar' => AvatarService::generateDefaultAvatar($data['name']),
                'profile_completed_at' => now(),
            ]);
        } catch (\Exception $e) {
            // Fallback if AI generation fails
            return User::create([
                'name' => 'Dr. Sarah Johnson',
                'email' => 'sarah.johnson@university.edu',
                'username' => 'sarah_johnson',
                'password' => Hash::make('password'),
                'role' => 'instructor',
                'avatar' => AvatarService::generateDefaultAvatar('Dr. Sarah Johnson'),
                'profile_completed_at' => now(),
            ]);
        }
    }

    private function createStudents(int $count): void
    {
        try {
            $schema = new ObjectSchema(
                name: 'students_data',
                description: 'Data for creating realistic student profiles',
                properties: [
                    new ArraySchema(
                        name: 'students',
                        description: 'List of student data',
                        items: new ObjectSchema(
                            name: 'student',
                            description: 'Individual student data',
                            properties: [
                                new StringSchema('name', 'A realistic full name for a student'),
                                new StringSchema('username', 'A simple username based on the name (lowercase, no spaces)'),
                                new StringSchema('email', 'A student email address'),
                            ],
                            requiredFields: ['name', 'username', 'email']
                        )
                    ),
                ],
                requiredFields: ['students']
            );

            $response = Prism::structured()
                ->using(Provider::Mistral, 'mistral-large-latest')
                ->withSchema($schema)
                ->withPrompt("Generate realistic data for {$count} university students. Each should have a unique name, username, and email. Make the usernames simple and professional.")
                ->asStructured();

            $studentsData = $response->structured['students'];
            
            foreach ($studentsData as $studentData) {
                User::create([
                    'name' => $studentData['name'],
                    'email' => $studentData['email'],
                    'username' => $studentData['username'],
                    'password' => Hash::make('password'),
                    'role' => 'student',
                    'avatar' => AvatarService::generateDefaultAvatar($studentData['name']),
                    'profile_completed_at' => now(),
                ]);
            }
        } catch (\Exception $e) {
            // Fallback if AI generation fails
            for ($i = 1; $i <= $count; $i++) {
                User::create([
                    'name' => "Student {$i}",
                    'email' => "student{$i}@university.edu",
                    'username' => "student{$i}",
                    'password' => Hash::make('password'),
                    'role' => 'student',
                    'avatar' => AvatarService::generateDefaultAvatar("Student {$i}"),
                    'profile_completed_at' => now(),
                ]);
            }
        }
    }
} 