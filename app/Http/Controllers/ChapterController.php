<?php

namespace App\Http\Controllers;

use App\Models\Chapter;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class ChapterController extends Controller
{
    /**
     * Store a newly created chapter in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Course  $course
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, Course $course)
    {
        // Check if user can manage the course
        Gate::authorize('manage-course', $course);
        
        $validated = $request->validate([
            'title' => 'required|string|min:3|max:100',
            'description' => 'nullable|string|max:500',
        ]);

        // Get the highest position to place the new chapter at the end
        $position = $course->chapters()->max('position') + 1;

        $chapter = $course->chapters()->create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'position' => $position,
        ]);

        return redirect()->back()->with('success', 'Chapter created successfully.');
    }

    /**
     * Update the specified chapter in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Chapter  $chapter
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Chapter $chapter)
    {
        // Load the course if not already loaded
        if (!$chapter->relationLoaded('course')) {
            $chapter->load('course');
        }
        
        // Check if user can manage the course
        Gate::authorize('manage-course', $chapter->course);
        
        $validated = $request->validate([
            'title' => 'required|string|min:3|max:100',
            'description' => 'nullable|string|max:500',
        ]);

        $chapter->update($validated);

        return redirect()->back()->with('success', 'Chapter updated successfully.');
    }

    /**
     * Remove the specified chapter from storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Chapter  $chapter
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Chapter $chapter)
    {
        // Load the course if not already loaded
        if (!$chapter->relationLoaded('course')) {
            $chapter->load('course');
        }
        
        // Check if user can manage the course
        Gate::authorize('manage-course', $chapter->course);
        
        $chapter->delete();

        return redirect()->back()->with('success', 'Chapter deleted successfully.');
    }

    /**
     * Reorder chapters.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Course  $course
     * @return \Illuminate\Http\Response
     */
    public function reorder(Request $request, Course $course)
    {
        // Check if user can manage the course
        Gate::authorize('manage-course', $course);
        
        // Validate the request
        $request->validate([
            'positions' => 'required|array',
            'positions.*.id' => 'required|integer|exists:chapters,id',
            'positions.*.position' => 'required|integer|min:0',
        ]);

        // Check if all chapters belong to the course
        $chapterIds = array_map(function ($position) {
            return $position['id'];
        }, $request->positions);

        $chaptersCount = Chapter::whereIn('id', $chapterIds)
            ->where('course_id', $course->id)
            ->count();

        if ($chaptersCount !== count($chapterIds)) {
            return redirect()->back()->with('error', 'Invalid chapter IDs.');
        }

        // Update positions in a transaction
        try {
            DB::beginTransaction();

            foreach ($request->positions as $position) {
                Chapter::where('id', $position['id'])->update([
                    'position' => $position['position'],
                ]);
            }

            DB::commit();
            return redirect()->back()->with('success', 'Chapters reordered successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to reorder chapters.');
        }
    }
}
