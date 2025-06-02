## Non-Technical Specifications

This section outlines the E-Learning Platform's functionalities from a user perspective, detailing user roles and the core features available to them.

### 1. User Roles

The platform defines three primary user roles, each with specific capabilities:

*   **Student:**
    *   **Course Interaction:** Enrolls in available courses using course codes or invite links. Accesses all published course materials, including chapters, uploaded resources (documents, videos, links), and embedded rich text content.
    *   **Assignments & Quizzes:** Submits assignments as per instructor requirements (potentially including text and file uploads). Takes quizzes designed to assess understanding of course content.
    *   **Communication:** Participates in course-specific discussion forums by creating new threads or commenting on existing ones. Views course announcements made by instructors and can comment on them.
    *   **Progress & Profile:** Tracks their progress and grades for assignments and quizzes (implied by submission and grading features). Manages their personal profile information (name, avatar, etc.).

*   **Instructor:**
    *   **Course Management:** Creates new courses, providing details such as title, description, image, category, and a unique color theme. Organizes courses into reorderable chapters. Adds and manages diverse learning resources within chapters (rich text, file attachments, external web links). Controls course status (draft, published, archived).
    *   **Assessment Management:** Creates, edits, and manages assignments with detailed instructions, due dates, and optional attachments. Develops and administers quizzes with various question types and options.
    *   **Student Interaction & Grading:** Views student submissions for assignments. Provides grades and textual feedback on submissions.
    *   **Communication & Engagement:** Posts course-specific announcements to students, which can include content and attachments. Manages and participates in course discussion forums.
    *   **Enrollment Management:** Manages student enrollments within their courses, including the ability to remove students if necessary.
    *   **Dashboard & Analytics:** Accesses a dedicated dashboard providing statistics on their courses, such as total student numbers, active student counts, enrollment trends over time, and distribution of resource types used.
    *   **Profile Management:** Manages their personal and professional profile information.

*   **Administrator (Inferred):**
    *   **Public Website Content Management:** Manages the content of the public-facing website pages, including the Home page (e.g., hero section text, images, links), About page (mission, vision, features, stats), Contact page (contact details, map), and Publications/Announcements page. This is managed through a dedicated interface in the backend.
    *   **System Oversight (Potential):** While not explicitly detailed in the reviewed files, an administrator role typically includes managing user accounts (students, instructors), system-wide settings, categories, and overall platform health and maintenance.

### 2. Core Features

The platform offers a comprehensive suite of features designed to facilitate online learning and teaching:

*   **User Authentication & Authorization:**
    *   Secure user registration and login mechanisms.
    *   Password management (e.g., reset functionality).
    *   Role-based access control, ensuring users only access features relevant to their role.
    *   A profile completion step for new users to ensure necessary information is provided.

*   **Course Creation & Management:**
    *   Instructors can create courses with comprehensive details: title, description, cover image, category, display color, and status (draft, published, archived).
    *   Automatic generation of unique course codes and shareable invite tokens for easy student enrollment.
    *   Courses can be structured into logical chapters, which instructors can reorder as needed.
    *   A variety of resource types can be added to chapters:
        *   **Rich Text:** For creating formatted textual content directly on the platform.
        *   **Attachments:** For uploading files (documents, presentations, media).
        *   **External Links:** For linking to external web resources.

*   **Assignment Management:**
    *   Instructors can create assignments with titles, detailed instructions, specific due dates, and attach relevant files.
    *   Control over assignment visibility through a publish/unpublish mechanism.

*   **Submission System:**
    *   Students can submit their work for assignments, typically involving text input and/or file uploads.
    *   Instructors have an interface to view all submissions for an assignment, access submitted files, and assign grades and provide written feedback.

*   **Quiz System:**
    *   Includes functionality for generating quizzes (`QuizController::generateQuiz`).
    *   Supports the creation of quiz questions, multiple-choice options (or other question types), and tracks student answers. This allows for automated or instructor-led assessment of learning.

*   **Announcement System:**
    *   Instructors can create and post announcements visible to all students within a specific course.
    *   Announcements can contain formatted text and include file attachments.
    *   A commenting feature allows for interaction and clarification on announcements.

*   **Discussion Forum:**
    *   Each course has its own dedicated discussion forum.
    *   Students and instructors can create new discussion threads on relevant topics.
    *   Users can post comments within threads, fostering a collaborative learning environment.

*   **Instructor Dashboard:**
    *   A personalized dashboard for instructors provides key statistics and insights into their courses and student engagement. This includes:
        *   Aggregate counts: total students, number of courses.
        *   Activity metrics: currently active students.
        *   Growth indicators: percentage changes in student numbers and course creation.
        *   Visualizations: Charts displaying enrollment trends over time and a breakdown of resource types used across courses.

*   **Public Website & Content Management:**
    *   The platform includes a public-facing website with several key pages:
        *   **Home:** Landing page with introductory content, featured courses, and platform highlights.
        *   **About:** Information about ENSIASD Taroudant and the e-learning platform's mission and features.
        *   **Courses:** A public listing of available courses, potentially with search and filtering capabilities by category.
        *   **Publications:** A section for general announcements, news, or articles from the institution.
        *   **Contact:** Contact information and a contact form or map.
    *   The content for these public pages is dynamically manageable by an Administrator via a backend interface, allowing updates to text, images, and other elements without code changes.

*   **Profile Management:**
    *   All users (Students, Instructors, Administrators) can manage their personal profile information, including name, email, password, and avatar.

*   **Notifications (Implied):**
    *   The User model includes the `Notifiable` trait, suggesting a system for sending notifications to users. This would typically be used for events such as new course announcements, assignment grades being released, new discussion posts, or submission confirmations. (While the specific notification flows were not detailed in the reviewed files, this is a standard and crucial feature for LMS platforms).
