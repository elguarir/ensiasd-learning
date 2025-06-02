## Demo Screens (Mockups/Screenshots)

This section provides textual descriptions of key screens and user interface elements of the ENSIASD Taroudant E-Learning Platform. These descriptions are based on the analyzed codebase and aim to illustrate what a user would typically see and interact with.

### 1. Public Pages

These pages are accessible to all visitors and are primarily rendered using Laravel Blade views, with dynamic content fetched from the database. The course listing page might be enhanced with React/Inertia for dynamic filtering and display.

*   **Homepage (`home.blade.php`):**
    *   **Layout:** A clean and modern design featuring a prominent header and a comprehensive footer.
        *   *Header:* Contains the ENSIASD logo, navigation links (Home, Courses, Publications, About, Contact), and buttons for "Login" and "Register".
        *   *Footer:* Includes copyright information, links to social media, and possibly quick links to important sections.
    *   **Content Sections:**
        *   *Hero Section:* A full-width banner with a captivating background image (dynamically set from `HomeContent`). Overlayed text includes a welcoming title (e.g., "Empowering Education Through Technology") and a brief description of the platform, both dynamic. Two prominent call-to-action buttons like "Explore Courses" (linking to the course listing) and "Learn More" (linking to the About page).
        *   *Popular Courses:* A section titled "Browse Our Popular Courses". Displays 3-4 course cards in a grid. Each card features a course image, category, title, a short description, the instructor's name and avatar, and a "View Course" link.
        *   *Platform Features ("Why Choose Us"):* A section highlighting key benefits, presented as a grid of feature cards. Each card has an icon (e.g., `fas fa-laptop-code` for Interactive Learning), a feature title, and a short explanatory text. Examples: "Interactive Learning," "Expert Instructors," "Flexible Schedule," "Certification."
        *   *Call to Action (CTA):* A visually distinct section encouraging user registration, with a title like "Ready to Start Learning?" and buttons for "Register Now" and "Contact Us."

*   **Course Listing Page (`courses.blade.php`, potentially with React/Inertia):**
    *   **Layout:** Standard header and footer. The main content area is dedicated to displaying courses.
    *   **Content:**
        *   *Search and Filters:* A search bar at the top allows users to search for courses by title, description, or category. Filter dropdowns or sidebar options might be available for filtering by "Category."
        *   *Course Grid/List:* Courses are displayed in a responsive grid or list format. Each course card prominently shows its image, title, category, the instructor's name, and possibly the number of enrolled students or a rating. A button or link on each card leads to the detailed course view (if public) or prompts login.
        *   *Pagination:* If there are many courses, pagination controls are visible at the bottom.
        *   *No Results Message:* A user-friendly message and illustration (e.g., `nothing-found.svg`) appear if no courses match the search/filter criteria.

*   **About Page (`about.blade.php`):**
    *   **Layout:** Standard header and footer.
    *   **Content (Dynamically loaded from `AboutContent` model):**
        *   *Hero Section:* Similar to the homepage hero, with a title like "About Our Platform" and relevant imagery.
        *   *Mission/Vision:* Dedicated sections with text describing the platform's mission and vision, possibly accompanied by images.
        *   *Platform Features:* Detailed descriptions of platform features (e.g., "Virtual Classes," "Centralized Resources," "Assignment Management").
        *   *Statistics:* A visually engaging display of platform statistics (e.g., "Active Courses," "Teachers," "Students," "Satisfaction Rate").
        *   *Benefits:* Sections detailing benefits for teachers and students, presented as bullet points or featurettes.

*   **Contact Page (`contact.blade.php`):**
    *   **Layout:** Standard header and footer.
    *   **Content (Dynamically loaded from `ContactContent` model):**
        *   *Contact Information:* Clearly displayed school name, address, phone number, and email address.
        *   *Office Hours:* Information on when users can expect support or contact the institution.
        *   *Contact Form (Implied or possible):* A form for users to send inquiries directly.
        *   *Embedded Map:* An interactive map (e.g., Google Maps iframe) showing the institution's location.
        *   *Contact Image:* A relevant image for the contact page.

*   **Publications Page (`publications.blade.php`):**
    *   **Layout:** Standard header and footer.
    *   **Content:** A list or grid of articles, news, or general announcements (from the `Announcement` model, possibly filtered for site-wide items or a specific "Publications" category).
        *   Each item displays a title, a snippet of the content or a summary, the publication date, author (if applicable), and potentially an associated course.
        *   Clicking an item would lead to a detailed view of that publication/announcement.

### 2. Authenticated User Dashboard & Internal Pages (React/Inertia)

These pages are part of the SPA experience after a user logs in, built with React and Inertia.js. They feature a consistent application shell.

*   **Main Dashboard Layout (`AppLayout.tsx`):**
    *   **Application Shell:**
        *   *Sidebar (`AppSidebar.tsx`):* Collapsible navigation menu on the left. Links include "Dashboard," "My Courses," "All Courses," "Assignments," "Grades" (student), "Discussions," "Settings," and "Logout." The ENSIASD logo is displayed at the top.
        *   *Header (`AppHeader.tsx`):* Top bar containing breadcrumbs for navigation, a global search bar, a theme switcher (light/dark mode via `ThemeSwitcher.tsx`), and a user menu dropdown (avatar, links to Profile, Settings, Logout - `UserMenuContent.tsx`).
    *   **Main Content Area:** The central area where specific page content is rendered.

*   **Dashboard View (`dashboard.tsx`):**
    *   **Instructor View:**
        *   *Statistics Cards:* Prominent display of key metrics (e.g., "Total Students," "Total Courses," "Active Students This Month," "Student Growth %") using `StatCard` components. Sparkline charts might be embedded within these cards.
        *   *Charts/Graphs:* Larger charts visualizing "Enrollment Trends" (line chart over months) and "Resource Type Distribution" (bar or pie chart).
        *   *Quick Actions:* Buttons or links to "Create New Course" or "Post New Announcement."
        *   *Recent Activity Feed (Speculative):* List of recent submissions, new enrollments, or discussion posts.
    *   **Student View:**
        *   *My Courses:* A grid or list of course cards for courses the student is enrolled in. Each card shows course title, instructor, and possibly a progress bar.
        *   *Upcoming Deadlines:* A list of assignments or quizzes with approaching due dates.
        *   *Recent Grades/Feedback:* Notifications or links to recently graded assignments.
        *   *Recent Announcements:* A feed of the latest announcements from enrolled courses.

*   **Course View Page (e.g., `dashboard/courses/students/content.tsx` or instructor equivalent):**
    *   **Layout:** Uses the main dashboard shell. Breadcrumbs would show "Dashboard > Courses > [Course Title]".
    *   **Header Area:** Displays the course title, description, and potentially the main course image.
    *   **Tabbed Navigation or Sections:**
        *   *Overview/Chapters:* Default view. Lists course chapters. Clicking a chapter expands it to show its resources (text snippets, links to files with icons indicating type, links to quizzes). Resources are ordered by position.
        *   *Assignments:* A list of all assignments for the course. Each item shows title, due date, status (e.g., "Open," "Submitted," "Graded"). Students see a "View/Submit" button. Instructors see "View Submissions" or "Edit."
        *   *Announcements:* A chronological list of announcements posted by the instructor for this course. Each announcement shows title, content snippet, and post date.
        *   *Discussions:* Lists discussion threads within the course. Each thread shows title, author, number of replies, and last activity. A "Start New Thread" button is available.
        *   *Students (Instructor Only):* A table listing all enrolled students, their enrollment date, and status (e.g., "Active," "Completed"). Options to remove or manage individual students.
        *   *Settings (Instructor Only):* Forms to edit course details (title, description, image, category, color, status, invite code).

*   **Assignment Detail Page:**
    *   **Layout:** Dashboard shell. Breadcrumbs: "Dashboard > Courses > [Course Title] > Assignments > [Assignment Title]".
    *   **Content:** Full assignment title, detailed description/instructions, due date, points possible, and any attached instruction files (downloadable).
    *   **Student View (`dashboard/courses/students/assignments.tsx` showing a specific assignment, or a submission form):**
        *   If not submitted: A rich text editor (Tiptap) for text-based submissions, a file upload area (`react-dropzone`) for attachments. "Submit Assignment" button.
        *   If submitted: Read-only view of their submission, submission date, status, grade, and feedback (if graded). Option to resubmit if allowed.
    *   **Instructor View (`dashboard/courses/instructors/assignments.tsx` focused on managing/viewing submissions):**
        *   A table listing all students, their submission status (Submitted, Not Submitted, Late), submission date, and grade (if graded). Links to "View/Grade" each submission.
        *   Overall assignment statistics (e.g., number submitted, average grade).

*   **Submission Grading Page/Modal (Instructor):**
    *   **Layout:** Could be a dedicated page or a modal dialog overlaying the assignment submissions list.
    *   **Content:**
        *   Student's name and submission details (date, lateness).
        *   Direct view of the student's submitted text content (if applicable).
        *   Links to download any submitted files.
        *   A numeric input field for the "Grade."
        *   A rich text editor for providing "Feedback."
        *   Buttons like "Save Grade," "Save Draft Feedback," or "Publish Grade & Notify Student."

*   **Quiz Interface:**
    *   **Student Taking Quiz (Frontend component, possibly `QuizGenerator.tsx` or similar):**
        *   Clean interface displaying one question at a time or a scrollable list.
        *   Question text, followed by multiple-choice options (radio buttons or checkboxes), true/false selections, etc.
        *   Navigation buttons ("Next Question," "Previous Question," "Submit Quiz").
        *   Timer displayed if the quiz is time-limited.
        *   Progress indicator (e.g., "Question 5 of 20").
    *   **Instructor Quiz Setup (Part of Resource creation or Assignment creation for 'quiz' type):**
        *   An interface (`QuizBuilder.tsx` or similar) to add/edit questions.
        *   For each question: input for question text, select question type, input fields for options, checkbox to mark correct answer(s), points for the question.
        *   Drag-and-drop reordering of questions. Settings for the quiz (e.g., time limit, shuffle questions).

*   **Profile Page (`dashboard/settings/profile.tsx` or similar):**
    *   **Layout:** Dashboard shell. Tabs for different settings categories (Profile, Account, Notifications).
    *   **Content (Profile Tab):**
        *   Form fields to edit name, username, email (email might be read-only or require re-verification).
        *   Avatar upload component.
        *   For Instructors: additional fields for bio, expertise areas (possibly as a tag input), social media links from `InstructorProfile`.
        *   "Update Profile" button.
    *   **Content (Account Tab):**
        *   Password change form (current password, new password, confirm new password).

### 3. Administrator Content Management Views

These views are likely part of the main dashboard layout but accessible only to users with the 'Administrator' role. They would involve forms tailored to the specific content models.

*   **Example: Edit Homepage Content (associated with `DashboardController::updateHomeContent`):**
    *   **Layout:** Dashboard shell.
    *   **Content:** A form with fields corresponding to `HomeContent` model attributes:
        *   Text input for "Hero Title."
        *   Textarea (possibly a rich text editor) for "Hero Content."
        *   File upload input for "Background Image" and "Hero Image" (with previews of current images).
        *   Text inputs for "Link 1 URL" and "Link 2 URL."
        *   "Save Changes" button.
    *   Similar forms would exist for editing the About Page (`AboutContent`) and Contact Page (`ContactContent`), with fields matching their respective model attributes (e.g., multiple textareas for mission, vision, feature descriptions on the About page; fields for address, phone, map embed code on the Contact page).

*   **Manage Publications (if distinct from course announcements):**
    *   **Layout:** Dashboard shell.
    *   **Content:** A table listing existing publications with columns for title, author, date, and actions (Edit, Delete).
    *   A "Create New Publication" button leading to a form with fields for title, content (rich text editor), and potentially category or audience.

These descriptions should provide a good textual basis for imagining the user experience and visual layout of the ENSIASD E-Learning Platform.I have successfully drafted the "Demo Screens (Mockups/Screenshots)" section and saved it to `demo_screens.md`. This file provides textual descriptions of key screens for public pages, authenticated user dashboards (student and instructor views), and administrator content management interfaces, based on the codebase analysis.

All requirements for this subtask have been met. I will now submit the report.
