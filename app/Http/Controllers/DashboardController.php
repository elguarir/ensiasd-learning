<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Announcement;
use App\Models\HomeContent;

use App\Models\AboutContent;
use App\Models\ContactContent;
use App\Models\CourseEnrollment;
use App\Models\Resource;
use App\Models\Assignment;
use App\Models\Submission;
use App\Models\User;
use Carbon\Carbon;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{ 
    public function index()
    {
        $user = Auth::user();
        
        if ($user->role === 'instructor') {
            // Get instructor stats
            $stats = $this->getInstructorStats($user->id);
            
            return Inertia::render('dashboard', [
                'stats' => $stats
            ]);
        }
        
        // For students or admin, we can add different stats later
        return Inertia::render('dashboard');
    }
    
    /**
     * Get statistics for instructor dashboard
     */
    private function getInstructorStats($userId)
    {
        // Get courses taught by the instructor
        $courses = Course::where('instructor_id', $userId)->get();
        $courseIds = $courses->pluck('id')->toArray();
        
        // Total students across all courses
        $totalStudents = CourseEnrollment::whereIn('course_id', $courseIds)
            ->distinct('user_id')
            ->count('user_id');
            
        // Total course count
        $totalCourses = $courses->count();
        
        // Active students this month
        $activeStudentsThisMonth = CourseEnrollment::whereIn('course_id', $courseIds)
            ->where('created_at', '>=', Carbon::now()->startOfMonth())
            ->distinct('user_id')
            ->count('user_id');
            
        // Historical data for student enrollment sparkline (last 8 months)
        $studentHistory = [];
        for ($i = 7; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $count = CourseEnrollment::whereIn('course_id', $courseIds)
                ->where('created_at', '<=', $month->endOfMonth())
                ->distinct('user_id')
                ->count('user_id');
            $studentHistory[] = ['value' => $count];
        }
        
        // Historical data for courses created sparkline (last 8 months)
        $courseHistory = [];
        for ($i = 7; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $count = Course::where('instructor_id', $userId)
                ->where('created_at', '<=', $month->endOfMonth())
                ->count();
            $courseHistory[] = ['value' => $count];
        }
        
        // Historical data for active students sparkline (last 8 months)
        $activeStudentsHistory = [];
        for ($i = 7; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $prevMonth = $month->copy()->subMonth();
            $count = CourseEnrollment::whereIn('course_id', $courseIds)
                ->whereBetween('created_at', [$prevMonth->startOfMonth(), $month->endOfMonth()])
                ->distinct('user_id')
                ->count('user_id');
            $activeStudentsHistory[] = ['value' => $count];
        }
        
        // Calculate growth percentages
        $prevMonthStudents = $studentHistory[6]['value'] > 0 ? $studentHistory[6]['value'] : 1; // Avoid division by zero
        $studentGrowth = round((($studentHistory[7]['value'] - $prevMonthStudents) / $prevMonthStudents) * 100);
        
        $prevMonthCourses = $courseHistory[6]['value'] > 0 ? $courseHistory[6]['value'] : 1;
        $courseGrowth = round((($courseHistory[7]['value'] - $prevMonthCourses) / $prevMonthCourses) * 100);
        
        $prevMonthActive = $activeStudentsHistory[6]['value'] > 0 ? $activeStudentsHistory[6]['value'] : 1;
        $activeGrowth = round((($activeStudentsHistory[7]['value'] - $prevMonthActive) / $prevMonthActive) * 100);
            
        // New enrollments in the last 6 months (for chart)
        $enrollmentTrend = CourseEnrollment::whereIn('course_id', $courseIds)
            ->where('created_at', '>=', Carbon::now()->subMonths(6))
            ->select(DB::raw('strftime("%Y-%m", created_at) as month'), DB::raw('COUNT(*) as count'))
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                $date = Carbon::createFromFormat('Y-m', $item->month);
                return [
                    'month' => $date->format('M'), // Abbreviated month name
                    'enrollments' => $item->count,
                ];
            });
            
        // Fill in missing months with zero values
        $months = collect();
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $months->put($month->format('M'), 0);
        }
        
        $enrollmentTrend->each(function ($item) use ($months) {
            $months->put($item['month'], $item['enrollments']);
        });
        
        $enrollmentChartData = $months->map(function ($count, $month) {
            return [
                'month' => $month,
                'enrollments' => $count,
            ];
        })->values()->toArray();
        
        // Resource type distribution (for bar chart)
        $resourceStats = Resource::whereHas('chapter', function ($query) use ($courseIds) {
            $query->whereIn('course_id', $courseIds);
        })
        ->select('resource_type', DB::raw('count(*) as count'))
        ->groupBy('resource_type')
        ->get()
        ->map(function ($item) {
            return [
                'type' =>  $item->resource_type,
                'count' => $item->count,
            ];
        })->toArray();
        
        return [
            'cards' => [
                'totalStudents' => $totalStudents,
                'totalCourses' => $totalCourses,
                'activeStudentsThisMonth' => $activeStudentsThisMonth,
                'studentGrowth' => $studentGrowth,
                'courseGrowth' => $courseGrowth,
                'activeGrowth' => $activeGrowth,
                'studentHistory' => $studentHistory,
                'courseHistory' => $courseHistory,
                'activeStudentsHistory' => $activeStudentsHistory,
            ],
            'enrollmentTrend' => $enrollmentChartData,
            'resourceStats' => $resourceStats,
        ];
    }

    #<!--============================Home=================================================================-->
    public function showHome()
    {
        $homeContent = HomeContent::first(); 
        
        if (!$homeContent) {
            $homeContent = new \stdClass();
            $homeContent->title = 'Ensiasd E-Learning Platform';
            $homeContent->content = 'Welcome to the Ensiasd E-Learning Platform, your gateway to quality education and skill development. Our platform is designed to provide you with a comprehensive and interactive learning experience, tailored to meet your educational needs and career aspirations.';
            $homeContent->link1 = '/courses';
            $homeContent->link2 = '/about';
        }

        $courses = Course::with('instructor')->take(3)->get();
        return view('home', compact('homeContent', 'courses'));
    }


    public function editHomeContent()
    {
        $homeContent = HomeContent::first();
        $publications = Announcement::with('user')->get();
        $contactContent = ContactContent::first();
        return view('dashboard.home', compact('homeContent', 'publications', 'contactContent'));
    }
    

    public function updateHomeContent(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'background_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'link1' => 'nullable|string|max:255',
            'link2' => 'nullable|string|max:255',
        ]);

        $homeContent = HomeContent::first();
        if (!$homeContent) {
            $homeContent = new HomeContent();
        }


        $homeContent->title = $request->title;
        $homeContent->content = $request->content;
        $homeContent->link1 = $request->link1;
        $homeContent->link2 = $request->link2;

        
        if ($request->hasFile('background_image')) {
            if ($homeContent->background_image && Storage::exists('public/' . $homeContent->background_image)) {
                Storage::delete('public/' . $homeContent->background_image);
            }

            $homeContent->background_image = $request->file('background_image')->store('images', 'public');
        }

        if ($request->hasFile('image')) {
            if ($homeContent->image && Storage::exists('public/' . $homeContent->image)) {
                Storage::delete('public/' . $homeContent->image);
            }

            $homeContent->image = $request->file('image')->store('images', 'public');
        }
        
        $homeContent->save();

        return redirect()->route('app.home.edit')->with('success', 'Le contenu de la page d\'accueil a été mis à jour avec succès.');
    }


    #<!--============================Courses=================================================================-->
    public function showCourses()
    {
        $courses = Course::all();
        $categories = Course::select('category')->distinct()->pluck('category');

        return view('courses', compact('courses', 'categories'));
    }

    public function showCoursesByFiltre(Request $request)
    {
        $query = Course::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', '%' . $search . '%')
                ->orWhere('description', 'like', '%' . $search . '%')
                ->orWhere('category', 'like', '%' . $search . '%');
            });
        }

        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        $courses = $query->get();

        $categories = Course::select('category')->distinct()->pluck('category');

        return view('courses', compact('courses', 'categories'));
    }

    
    #<!--============================Publications=================================================================-->
    public function showPublications()
    {
        $publications = Announcement::with('user', 'course', 'attachments')->get(); 
        return view('publications', compact('publications'));
    }

    public function storePublication(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'course_id' => 'required|exists:courses,id',
            'attachments.*' => 'nullable|file|max:5120', // 5MB max per file
        ]);

        $announcement = Announcement::create([
            'course_id' => $validated['course_id'],
            'user_id' => $request->user()->id,
            'content' => $validated['content'],
        ]);

        // Handle file attachments
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('announcement-attachments', 'public');

                $announcement->attachments()->create([
                    'filename' => $file->getClientOriginalName(),
                    'path' => $path,
                    'mime_type' => $file->getMimeType(),
                    'size' => $file->getSize(),
                    'extension' => $file->getClientOriginalExtension(),
                    'collection' => 'announcement-attachments',
                    'is_private' => false,
                ]);
            }
        }

        return redirect()->route('publications')->with('success', 'Announcement created successfully!');
    }

    public function destroy($id)
    {
        $publication = Announcement::findOrFail($id);

        // Delete all attachments
        foreach ($publication->attachments as $attachment) {
            if (Storage::exists('public/' . $attachment->path)) {
                Storage::delete('public/' . $attachment->path);
            }
            $attachment->delete();
        }

        $publication->delete();

        return redirect()->back()->with('success', 'Publication deleted successfully.');
    }

    ####################################About########################################
    public function showAbout()
    {
        $aboutContent = AboutContent::first();
        
        if (!$aboutContent) {
            $aboutContent = $this->getDefaultAboutContent();
        }

        return view('about', compact('aboutContent'));
    }

    private function getDefaultAboutContent()
    {
        return (object)[
            'hero_title' => 'About Our Platform',
            'hero_content' => 'Welcome to our e-learning platform dedicated to students and teachers.',
            'hero_image' => null,

            // Mission Section
            'mission_title' => 'Our Mission',
            'mission_content' => 'Facilitate online education with innovative tools.',
            'mission_image' => null,
            'value1_title' => 'Collaboration',
            'value2_title' => 'Innovation', 
            'value3_title' => 'Excellence',

            // Features Section
            'features_title' => 'Our Features',
            'features_subtitle' => 'Discover what we offer',

            // Features 1-6
            'feature1_title' => 'Virtual Classes',
            'feature1_content' => 'Access interactive online classrooms',
            'feature2_title' => 'Resources',
            'feature2_content' => 'Centralized course documents and materials',
            'feature3_title' => 'Assignments',
            'feature3_content' => 'Complete assignment management system',
            'feature4_title' => 'Tracking',
            'feature4_content' => 'Detailed progress analytics',
            'feature5_title' => 'Discussion',
            'feature5_content' => 'Integrated discussion forums',
            'feature6_title' => 'Security',
            'feature6_content' => 'User data protection',

            // Stats Section
            'stat1_number' => 150,
            'stat1_label' => 'Active Courses',
            'stat2_number' => 75,
            'stat2_label' => 'Teachers',
            'stat3_number' => 2500,
            'stat3_label' => 'Students',
            'stat4_number' => 98,
            'stat4_label' => 'Satisfaction',

            // Vision Section
            'vision_title' => 'Our Vision',
            'vision_content' => 'Transform education through technology',
            'vision_quote' => 'Education is the most powerful weapon which you can use to change the world',
            'vision_author' => 'Nelson Mandela',
            'vision_image' => null,

            // Benefits Section
            'benefits_title' => 'Benefits',
            'benefits_subtitle' => 'For teachers and students',
            'benefits_image' => null,

            // Teacher Benefits
            'teacher_benefit1' => 'Simplified course management',
            'teacher_benefit2' => 'Student tracking',
            'teacher_benefit3' => 'Assessment tools',
            'teacher_benefit4' => 'Shareable resources',
            'teacher_benefit5' => 'Centralized communication',

            // Student Benefits
            'student_benefit1' => '24/7 Access',
            'student_benefit2' => 'Organized resources',
            'student_benefit3' => 'Immediate feedback',
            'student_benefit4' => 'Visible progress',
            'student_benefit5' => 'Facilitated collaboration'
        ];
    }

    public function editAboutContent()
    {
        $aboutContent = AboutContent::first();
        if (!$aboutContent) {
            $aboutContent = new AboutContent();
        }
        
        return view('dashboard.about', compact('aboutContent'));
    }

    public function updateAboutContent(Request $request)
    {
        $validated = $request->validate([
            // Hero Section
            'hero_title' => 'required|string|max:255',
            'hero_content' => 'required|string',
            'hero_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            
            // Mission Section
            'mission_title' => 'required|string|max:255',
            'mission_content' => 'required|string',
            'mission_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'value1_title' => 'required|string|max:255',
            'value2_title' => 'required|string|max:255',
            'value3_title' => 'required|string|max:255',
            
            // Features Section
            'features_title' => 'required|string|max:255',
            'features_subtitle' => 'required|string|max:255',
            
            // Features 1-6
            'feature1_title' => 'required|string|max:255',
            'feature1_content' => 'required|string',
            'feature2_title' => 'required|string|max:255',
            'feature2_content' => 'required|string',
            'feature3_title' => 'required|string|max:255',
            'feature3_content' => 'required|string',
            'feature4_title' => 'required|string|max:255',
            'feature4_content' => 'required|string',
            'feature5_title' => 'required|string|max:255',
            'feature5_content' => 'required|string',
            'feature6_title' => 'required|string|max:255',
            'feature6_content' => 'required|string',
            
            // Stats Section
            'stat1_number' => 'required|integer',
            'stat1_label' => 'required|string|max:255',
            'stat2_number' => 'required|integer',
            'stat2_label' => 'required|string|max:255',
            'stat3_number' => 'required|integer',
            'stat3_label' => 'required|string|max:255',
            'stat4_number' => 'required|integer',
            'stat4_label' => 'required|string|max:255',
            
            // Vision Section
            'vision_title' => 'required|string|max:255',
            'vision_content' => 'required|string',
            'vision_quote' => 'required|string',
            'vision_author' => 'required|string|max:255',
            'vision_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            
            // Benefits Section
            'benefits_title' => 'required|string|max:255',
            'benefits_subtitle' => 'required|string|max:255',
            'benefits_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            
            // Teacher Benefits
            'teacher_benefit1' => 'required|string|max:255',
            'teacher_benefit2' => 'required|string|max:255',
            'teacher_benefit3' => 'required|string|max:255',
            'teacher_benefit4' => 'required|string|max:255',
            'teacher_benefit5' => 'required|string|max:255',
            
            // Student Benefits
            'student_benefit1' => 'required|string|max:255',
            'student_benefit2' => 'required|string|max:255',
            'student_benefit3' => 'required|string|max:255',
            'student_benefit4' => 'required|string|max:255',
            'student_benefit5' => 'required|string|max:255'
        ]);

        $aboutContent = AboutContent::firstOrNew();
        
        // Handle image uploads
        foreach (['hero_image', 'mission_image', 'vision_image', 'benefits_image'] as $imageField) {
            if ($request->hasFile($imageField)) {
                if ($aboutContent->$imageField && Storage::exists('public/' . $aboutContent->$imageField)) {
                    Storage::delete('public/' . $aboutContent->$imageField);
                }
                $validated[$imageField] = $request->file($imageField)->store('images', 'public');
            } elseif (!isset($validated[$imageField])) {
                // Keep existing image if no new one was uploaded
                $validated[$imageField] = $aboutContent->$imageField;
            }
        }

        $aboutContent->fill($validated);
        $aboutContent->save();

        return back()->with('about_success', 'About page updated successfully');
    }

    ####################################Contact######################################
    public function showContact()
    {
        $contactContent = ContactContent::first();
        
        if (!$contactContent) {
            $contactContent = new \stdClass();
            $contactContent->school_name = 'ENSIASD Learning';
            $contactContent->address = 'Taroudant.................................'; 
            $contactContent->phone = '0000000000000000';
            $contactContent->email = 'contact@..........';
            $contactContent->office_hours = '...................';
            $contactContent->map_embed_code = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5337.801396860847!2d-8.869371599999998!3d30.490213699999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdb173001472dcc1%3A0x3f2507f09223083!2sEcole%20Nationale%20Sup%C3%A9rieure%20de%20l\'Intelligence%20Artificielle%20et%20Sciences%20des%20Donn%C3%A9es!5e0!3m2!1sfr!2sma!4v1715942550134!5m2!1sfr!2sma" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
        }

        return view('contact', compact('contactContent'));
    }

    public function editContactContent()
    {
        $contactContent = ContactContent::first();
        return view('dashboard.contact', compact('contactContent'));
    }

    public function editPublicPages()
    {
        $homeContent = HomeContent::first();
        $contactContent = ContactContent::first();
        
        return view('dashboard.home', compact('homeContent', 'contactContent'));
    }

    public function updateContactContent(Request $request)
    {
        $request->validate([
            'school_name' => 'required|string|max:255',
            'address' => 'required|string',
            'phone' => 'required|string|max:50',
            'email' => 'required|email|max:255',
            'office_hours' => 'required|string|max:255',
            'map_embed_code' => 'required|string',
            'contact_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $contactContent = ContactContent::firstOrNew();
        
        // Update fields
        $contactContent->fill($request->except('contact_image'));

        // Handle image upload
        if ($request->hasFile('contact_image')) {
            // Delete old image if exists
            if ($contactContent->contact_image) {
                Storage::delete('public/' . $contactContent->contact_image);
            }
            $contactContent->contact_image = $request->file('contact_image')->store('images', 'public');
        }

        $contactContent->save();

        return redirect()->back()->with([
            'contact_success' => 'Contact page updated successfully',
            'contactContent' => $contactContent,
        ]);

    }

}

