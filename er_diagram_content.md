## ER Diagram Content (Modelisation)

This section details the key entities (database tables/Eloquent models), their significant attributes, and the relationships between them, forming the basis for an Entity-Relationship Diagram.

1.  **User (`users` table):**
    *   **Attributes:** `id` (PK), `name`, `username`, `email` (unique), `avatar`, `role` (e.g., student, instructor, admin), `profile_completed_at` (timestamp), `password`, `email_verified_at` (timestamp), `remember_token`, `created_at`, `updated_at`.
    *   **Relationships:**
        *   `InstructorProfile`: One-to-One (User has one InstructorProfile). Foreign Key: `instructor_profiles.user_id`.
        *   `CourseEnrollment`: One-to-Many (User has many CourseEnrollments). Foreign Key: `course_enrollments.user_id`.
        *   `Course` (as instructor): One-to-Many (User (instructor) has many Courses). Foreign Key: `courses.instructor_id`.
        *   `CourseThread` (as author): One-to-Many (User has many CourseThreads). Foreign Key: `course_threads.author_id`.
        *   `ThreadComment` (as author): One-to-Many (User has many ThreadComments). Foreign Key: `thread_comments.author_id`.
        *   `Submission`: One-to-Many (User has many Submissions). Foreign Key: `submissions.user_id`.
        *   `Announcement` (as author): One-to-Many (User has many Announcements). Foreign Key: `announcements.user_id`.
        *   `AnnouncementComment` (as author): One-to-Many (User has many AnnouncementComments). Foreign Key: `announcement_comments.user_id`.
        *   `courses` (as student): Many-to-Many via `CourseEnrollment` (User belongs to many Courses).

2.  **InstructorProfile (`instructor_profiles` table):**
    *   **Attributes:** `id` (PK), `user_id` (FK to `users.id`), `bio`, `expertise_areas` (array/JSON), `social_links` (array/JSON), `created_at`, `updated_at`.
    *   **Relationships:**
        *   `User`: One-to-One (InstructorProfile belongs to one User).

3.  **Course (`courses` table):**
    *   **Attributes:** `id` (PK), `instructor_id` (FK to `users.id`), `title`, `description`, `image` (path/URL), `code` (unique course code), `invite_token` (unique for link-based enrollment), `color`, `category`, `status` (enum: draft, published, archived), `published_at` (timestamp), `created_at`, `updated_at`.
    *   **Relationships:**
        *   `User` (instructor): Many-to-One (Course belongs to one User (instructor)).
        *   `Chapter`: One-to-Many (Course has many Chapters). Foreign Key: `chapters.course_id`.
        *   `CourseEnrollment`: One-to-Many (Course has many CourseEnrollments). Foreign Key: `course_enrollments.course_id`.
        *   `CourseThread`: One-to-Many (Course has many CourseThreads). Foreign Key: `course_threads.course_id`.
        *   `Announcement`: One-to-Many (Course has many Announcements). Foreign Key: `announcements.course_id`.
        *   `Assignment`: One-to-Many (Course has many Assignments). Foreign Key: `assignments.course_id`.
        *   `students` (Users): Many-to-Many via `CourseEnrollment` (Course has many Students).

4.  **Chapter (`chapters` table):**
    *   **Attributes:** `id` (PK), `course_id` (FK to `courses.id`), `title`, `description`, `position` (integer for ordering), `created_at`, `updated_at`.
    *   **Relationships:**
        *   `Course`: Many-to-One (Chapter belongs to one Course).
        *   `Resource`: One-to-Many (Chapter has many Resources). Foreign Key: `resources.chapter_id`.

5.  **Resource (`resources` table):** (Central table for typed resources)
    *   **Attributes:** `id` (PK), `chapter_id` (FK to `chapters.id`), `title`, `resource_type` (enum: 'rich_text', 'attachment_collection', 'external_link', 'quiz'), `position` (integer for ordering), `metadata` (JSON), `created_at`, `updated_at`.
    *   **Relationships:**
        *   `Chapter`: Many-to-One (Resource belongs to one Chapter).
        *   `RichTextResource`: One-to-One. Foreign Key: `rich_text_resources.resource_id`.
        *   `AttachmentResource`: One-to-One (representing a collection of attachments for this resource). Foreign Key: `attachment_resources.resource_id`.
        *   `ExternalResource`: One-to-One. Foreign Key: `external_resources.resource_id`.
        *   `QuizQuestion`: One-to-Many (A 'quiz' type Resource can have many QuizQuestions). Foreign Key: `quiz_questions.resource_id`.

6.  **RichTextResource (`rich_text_resources` table):**
    *   **Attributes:** `id` (PK), `resource_id` (FK to `resources.id`), `content` (text/HTML), `format` (e.g., 'html', 'markdown'), `created_at`, `updated_at`.
    *   **Relationships:**
        *   `Resource`: One-to-One (RichTextResource belongs to one Resource).

7.  **AttachmentResource (`attachment_resources` table):** (Represents a resource that is a collection of files)
    *   **Attributes:** `id` (PK), `resource_id` (FK to `resources.id`), `created_at`, `updated_at`.
    *   **Relationships:**
        *   `Resource`: One-to-One (AttachmentResource belongs to one Resource).
        *   `Attachment`: Polymorphic One-to-Many (AttachmentResource can have many Attachments). `attachable_id` & `attachable_type` on `attachments` table.

8.  **ExternalResource (`external_resources` table):**
    *   **Attributes:** `id` (PK), `resource_id` (FK to `resources.id`), `external_url`, `link_title`, `link_description`, `favicon_url`, `og_image_url`, `created_at`, `updated_at`.
    *   **Relationships:**
        *   `Resource`: One-to-One (ExternalResource belongs to one Resource).

9.  **CourseEnrollment (`course_enrollments` table):** (Join table for User-Course many-to-many)
    *   **Attributes:** `id` (PK), `user_id` (FK to `users.id`), `course_id` (FK to `courses.id`), `enrolled_at` (timestamp), `completed_at` (nullable timestamp), `created_at`, `updated_at`.
    *   **Relationships:**
        *   `User`: Many-to-One (CourseEnrollment belongs to one User).
        *   `Course`: Many-to-One (CourseEnrollment belongs to one Course).

10. **Assignment (`assignments` table):**
    *   **Attributes:** `id` (PK), `course_id` (FK to `courses.id`), `title`, `description`, `type` (e.g., 'file', 'quiz', 'text'), `due_date` (timestamp), `points_possible` (integer), `published` (boolean), `instructions`, `allow_late_submissions` (boolean), `late_penalty_percentage` (integer), `settings` (JSON), `created_at`, `updated_at`.
    *   **Relationships:**
        *   `Course`: Many-to-One (Assignment belongs to one Course).
        *   `Submission`: One-to-Many (Assignment has many Submissions). Foreign Key: `submissions.assignment_id`.
        *   `QuizQuestion`: One-to-Many (If `type` is 'quiz', Assignment has many QuizQuestions). Foreign Key: `quiz_questions.assignment_id`.
        *   `Attachment`: Polymorphic One-to-Many (Assignment can have many Attachments). `attachable_id` & `attachable_type` on `attachments` table.

11. **Submission (`submissions` table):**
    *   **Attributes:** `id` (PK), `assignment_id` (FK to `assignments.id`), `user_id` (FK to `users.id`), `submitted_at` (timestamp), `is_late` (boolean), `status` (enum: 'draft', 'submitted', 'graded'), `grade` (decimal), `feedback` (text), `created_at`, `updated_at`.
    *   **Relationships:**
        *   `Assignment`: Many-to-One (Submission belongs to one Assignment).
        *   `User`: Many-to-One (Submission belongs to one User).
        *   `Attachment`: Polymorphic One-to-Many (Submission can have many Attachments). `attachable_id` & `attachable_type` on `attachments` table.
        *   `QuizAnswer`: One-to-Many (Submission has many QuizAnswers, if assignment is a quiz). Foreign Key: `quiz_answers.submission_id`.

12. **Attachment (`attachments` table):** (Generic polymorphic attachments)
    *   **Attributes:** `id` (PK), `attachable_type` (string, e.g., 'App\Models\Assignment'), `attachable_id` (unsigned BigInt), `filename`, `path`, `mime_type`, `size` (integer), `extension`, `collection` (nullable string, for grouping attachments), `is_private` (boolean), `metadata` (JSON), `deleted_at` (soft deletes), `created_at`, `updated_at`.
    *   **Relationships:**
        *   `attachable`: Polymorphic Many-to-One (Attachment belongs to an attachable model like Assignment, Submission, Announcement, AnnouncementComment, CourseThread, ThreadComment, AttachmentResource).

13. **QuizQuestion (`quiz_questions` table):**
    *   **Attributes:** `id` (PK), `assignment_id` (nullable FK to `assignments.id`), `resource_id` (nullable FK to `resources.id`), `question` (text), `position` (integer for ordering), `points` (integer), `created_at`, `updated_at`. (A question must belong to either an assignment or a resource quiz).
    *   **Relationships:**
        *   `Assignment`: Many-to-One (QuizQuestion can belong to one Assignment).
        *   `Resource`: Many-to-One (QuizQuestion can belong to one Resource).
        *   `QuizOption`: One-to-Many (QuizQuestion has many QuizOptions). Foreign Key: `quiz_options.quiz_question_id`.
        *   `QuizAnswer`: One-to-Many (QuizQuestion has many QuizAnswers). Foreign Key: `quiz_answers.quiz_question_id`.

14. **QuizOption (`quiz_options` table):**
    *   **Attributes:** `id` (PK), `quiz_question_id` (FK to `quiz_questions.id`), `text`, `is_correct` (boolean), `created_at`, `updated_at`.
    *   **Relationships:**
        *   `QuizQuestion`: Many-to-One (QuizOption belongs to one QuizQuestion).

15. **QuizAnswer (`quiz_answers` table):**
    *   **Attributes:** `id` (PK), `submission_id` (FK to `submissions.id`), `quiz_question_id` (FK to `quiz_questions.id`), `quiz_option_id` (nullable FK to `quiz_options.id` - if multiple choice), `answer_text` (nullable - for free text answers, though not explicitly seen, good for future), `created_at`, `updated_at`.
    *   **Relationships:**
        *   `Submission`: Many-to-One (QuizAnswer belongs to one Submission).
        *   `QuizQuestion`: Many-to-One (QuizAnswer belongs to one QuizQuestion).
        *   `QuizOption` (selectedOption): Many-to-One (QuizAnswer belongs to one QuizOption, if applicable).

16. **Announcement (`announcements` table):**
    *   **Attributes:** `id` (PK), `course_id` (FK to `courses.id`), `user_id` (FK to `users.id` - author), `content` (text), `created_at`, `updated_at`.
    *   **Relationships:**
        *   `Course`: Many-to-One (Announcement belongs to one Course).
        *   `User` (author): Many-to-One (Announcement belongs to one User).
        *   `AnnouncementComment`: One-to-Many (Announcement has many AnnouncementComments). Foreign Key: `announcement_comments.announcement_id`.
        *   `Attachment`: Polymorphic One-to-Many (Announcement can have many Attachments). `attachable_id` & `attachable_type` on `attachments` table.

17. **AnnouncementComment (`announcement_comments` table):**
    *   **Attributes:** `id` (PK), `announcement_id` (FK to `announcements.id`), `user_id` (FK to `users.id` - author), `content` (text), `created_at`, `updated_at`.
    *   **Relationships:**
        *   `Announcement`: Many-to-One (AnnouncementComment belongs to one Announcement).
        *   `User` (author): Many-to-One (AnnouncementComment belongs to one User).
        *   `Attachment`: Polymorphic One-to-Many (AnnouncementComment can have many Attachments). `attachable_id` & `attachable_type` on `attachments` table.

18. **CourseThread (`course_threads` table):** (Discussion threads)
    *   **Attributes:** `id` (PK), `course_id` (FK to `courses.id`), `author_id` (FK to `users.id`), `title`, `content` (text), `is_pinned` (boolean), `created_at`, `updated_at`.
    *   **Relationships:**
        *   `Course`: Many-to-One (CourseThread belongs to one Course).
        *   `User` (author): Many-to-One (CourseThread belongs to one User).
        *   `ThreadComment`: One-to-Many (CourseThread has many ThreadComments). Foreign Key: `thread_comments.thread_id`. (Corrected from `course_thread_id` based on typical naming, assuming `thread_comments.thread_id`).
        *   `Attachment`: Polymorphic One-to-Many (CourseThread can have many Attachments). `attachable_id` & `attachable_type` on `attachments` table.

19. **ThreadComment (`thread_comments` table):**
    *   **Attributes:** `id` (PK), `thread_id` (FK to `course_threads.id`), `author_id` (FK to `users.id`), `content` (text), `parent_id` (nullable FK to `thread_comments.id` for replies), `created_at`, `updated_at`.
    *   **Relationships:**
        *   `CourseThread`: Many-to-One (ThreadComment belongs to one CourseThread).
        *   `User` (author): Many-to-One (ThreadComment belongs to one User).
        *   `ThreadComment` (parentComment): Many-to-One (Reply belongs to one Parent Comment).
        *   `ThreadComment` (replies): One-to-Many (Parent Comment has many Replies). Foreign Key: `thread_comments.parent_id`.
        *   `Attachment`: Polymorphic One-to-Many (ThreadComment can have many Attachments). `attachable_id` & `attachable_type` on `attachments` table.

20. **HomeContent (`home_content` table):** (Singleton table for homepage content)
    *   **Attributes:** `id` (PK), `title`, `content`, `background_image` (path/URL), `image` (path/URL), `link1` (URL), `link2` (URL), `created_at`, `updated_at`.
    *   **Relationships:** None explicitly defined with other models.

21. **AboutContent (`about_contents` table):** (Singleton table for About Us page content)
    *   **Attributes:** `id` (PK), numerous text and image path/URL fields (e.g., `hero_title`, `mission_content`, `feature1_title`, etc.), `created_at`, `updated_at`.
    *   **Relationships:** None explicitly defined with other models.

22. **ContactContent (`contact_contents` table):** (Singleton table for Contact Us page content)
    *   **Attributes:** `id` (PK), `school_name`, `address`, `phone`, `email`, `office_hours`, `map_embed_code` (HTML/text), `contact_image` (path/URL), `created_at`, `updated_at`.
    *   **Relationships:** None explicitly defined with other models.File `er_diagram_content.md` created successfully.
