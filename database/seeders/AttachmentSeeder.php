<?php

namespace Database\Seeders;

use App\Models\Assignment;
use App\Models\Attachment;
use App\Models\Course;
use App\Models\Resource;
use App\Models\Submission;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AttachmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Make sure we have required entities before attaching files
        if (Assignment::count() === 0 || Resource::count() === 0 || Submission::count() === 0) {
            $this->command->info('Please run the entity seeders first (AssignmentSeeder, ResourceSeeder, etc.)');
            return;
        }

        // Clear existing attachments
        DB::table('attachments')->truncate();

        // Assignment attachments (instructions, assignment files)
        $assignments = Assignment::all();
        foreach ($assignments as $index => $assignment) {
            // Add assignment instruction files
            $this->createAssignmentAttachment($assignment, $index);
        }

        // Resource attachments (lecture slides, documents)
        $resources = Resource::all();
        foreach ($resources as $index => $resource) {
            // Only attach files to certain resource types
            if ($resource->resource_type == 'file' || $resource->resource_type == 'document') {
                $this->createResourceAttachment($resource, $index);
            }
        }

        // Submission attachments (student submissions)
        $submissions = Submission::where('status', '!=', 'draft')->get();
        foreach ($submissions as $index => $submission) {
            // Only add attachments to file-type assignment submissions
            if ($submission->assignment->type === 'file') {
                $this->createSubmissionAttachment($submission, $index);
            }
        }

        $this->command->info('Attachments seeded successfully!');
    }

    private function createAssignmentAttachment(Assignment $assignment, int $index): void
    {
        // Sample assignment materials
        $fileTypes = [
            [
                'name' => 'Assignment Instructions.pdf',
                'path' => 'assignments/instructions_' . $assignment->id . '.pdf',
                'mime' => 'application/pdf',
                'ext' => 'pdf',
                'size' => rand(500000, 2000000),
            ],
            [
                'name' => 'Assignment Rubric.docx',
                'path' => 'assignments/rubric_' . $assignment->id . '.docx',
                'mime' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'ext' => 'docx',
                'size' => rand(100000, 500000),
            ],
        ];

        // Add 1-2 attachments per assignment
        $count = min(count($fileTypes), rand(1, 2));
        for ($i = 0; $i < $count; $i++) {
            $fileType = $fileTypes[$i];
            
            Attachment::create([
                'original_filename' => $fileType['name'],
                'path' => $fileType['path'],
                'filename' => basename($fileType['path']),
                'mime_type' => $fileType['mime'],
                'size' => $fileType['size'],
                'extension' => $fileType['ext'],
                'attachable_id' => $assignment->id,
                'attachable_type' => Assignment::class,
                'collection' => 'assignment_materials',
                'is_private' => false,
                'metadata' => ['note' => 'Sample assignment file for seeding'],
            ]);
        }
    }

    private function createResourceAttachment(Resource $resource, int $index): void
    {
        // Sample resource materials
        $fileTypes = [
            [
                'name' => 'Lecture Slides.pptx',
                'path' => 'resources/lecture_' . $resource->id . '.pptx',
                'mime' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'ext' => 'pptx',
                'size' => rand(1000000, 5000000),
            ],
            [
                'name' => 'Reading Material.pdf',
                'path' => 'resources/reading_' . $resource->id . '.pdf',
                'mime' => 'application/pdf',
                'ext' => 'pdf',
                'size' => rand(500000, 3000000),
            ],
            [
                'name' => 'Sample Code.zip',
                'path' => 'resources/code_' . $resource->id . '.zip',
                'mime' => 'application/zip',
                'ext' => 'zip',
                'size' => rand(2000000, 10000000),
            ],
        ];

        // Pick a random file type
        $fileType = $fileTypes[rand(0, count($fileTypes) - 1)];
        
        Attachment::create([
            'original_filename' => $fileType['name'],
            'path' => $fileType['path'],
            'filename' => basename($fileType['path']),
            'mime_type' => $fileType['mime'],
            'size' => $fileType['size'],
            'extension' => $fileType['ext'],
            'attachable_id' => $resource->id,
            'attachable_type' => Resource::class,
            'collection' => 'learning_materials',
            'is_private' => false,
            'metadata' => ['note' => 'Sample learning resource for seeding'],
        ]);
    }

    private function createSubmissionAttachment(Submission $submission, int $index): void
    {
        // Sample submission files
        $fileTypes = [
            [
                'name' => 'Student Submission.pdf',
                'path' => 'submissions/submission_' . $submission->id . '.pdf',
                'mime' => 'application/pdf',
                'ext' => 'pdf',
                'size' => rand(200000, 1500000),
            ],
            [
                'name' => 'Project Report.docx',
                'path' => 'submissions/report_' . $submission->id . '.docx',
                'mime' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'ext' => 'docx',
                'size' => rand(100000, 800000),
            ],
            [
                'name' => 'Assignment Files.zip',
                'path' => 'submissions/files_' . $submission->id . '.zip',
                'mime' => 'application/zip',
                'ext' => 'zip',
                'size' => rand(500000, 5000000),
            ],
        ];

        // Add 1-2 attachments per submission
        $count = min(count($fileTypes), rand(1, 2));
        $selected = array_rand($fileTypes, $count);
        
        if (!is_array($selected)) {
            $selected = [$selected];
        }
        
        foreach ($selected as $idx) {
            $fileType = $fileTypes[$idx];
            
            Attachment::create([
                'original_filename' => $fileType['name'],
                'path' => $fileType['path'],
                'filename' => basename($fileType['path']),
                'mime_type' => $fileType['mime'],
                'size' => $fileType['size'],
                'extension' => $fileType['ext'],
                'attachable_id' => $submission->id,
                'attachable_type' => Submission::class,
                'collection' => 'student_submissions',
                'is_private' => true,
                'metadata' => [
                    'note' => 'Sample student submission for seeding',
                    'graded' => $submission->status === 'graded'
                ],
            ]);
        }
    }
} 