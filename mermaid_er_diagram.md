```mermaid
erDiagram
    users {
        int id PK
        string name
        string username
        string email
        string avatar
        string role
        datetime profile_completed_at
        datetime created_at
        datetime updated_at
    }

    instructor_profiles {
        int id PK
        int user_id FK
        text bio
        string expertise_areas
        string social_links
        datetime created_at
        datetime updated_at
    }

    courses {
        int id PK
        int instructor_id FK
        string title
        text description
        string image
        string code
        string invite_token
        string color
        string category
        string status
        datetime published_at
        datetime created_at
        datetime updated_at
    }

    chapters {
        int id PK
        int course_id FK
        string title
        text description
        int position
        datetime created_at
        datetime updated_at
    }

    resources {
        int id PK
        int chapter_id FK
        string title
        string resource_type
        int position
        string metadata "JSON"
        datetime created_at
        datetime updated_at
    }

    rich_text_resources {
        int id PK
        int resource_id FK
        text content
        string format
        datetime created_at
        datetime updated_at
    }

    attachment_resources {
        int id PK
        int resource_id FK
        datetime created_at
        datetime updated_at
    }

    external_resources {
        int id PK
        int resource_id FK
        string external_url
        string link_title
        datetime created_at
        datetime updated_at
    }

    course_enrollments {
        int id PK
        int user_id FK
        int course_id FK
        datetime enrolled_at
        datetime completed_at
        datetime created_at
        datetime updated_at
    }

    assignments {
        int id PK
        int course_id FK
        string title
        text description
        string type
        datetime due_date
        int points_possible
        bool published
        datetime created_at
        datetime updated_at
    }

    submissions {
        int id PK
        int assignment_id FK
        int user_id FK
        datetime submitted_at
        bool is_late
        string status
        decimal grade
        text feedback
        datetime created_at
        datetime updated_at
    }

    attachments {
        int id PK
        string attachable_type "Polymorphic: e.g., Assignment, Submission"
        int attachable_id "Polymorphic ID"
        string filename
        string path
        string mime_type
        int size
        datetime created_at
        datetime updated_at
    }

    quiz_questions {
        int id PK
        int assignment_id FK "Nullable"
        int resource_id FK "Nullable"
        text question
        int position
        int points
        datetime created_at
        datetime updated_at
    }

    quiz_options {
        int id PK
        int quiz_question_id FK
        text option_text
        bool is_correct
        datetime created_at
        datetime updated_at
    }

    quiz_answers {
        int id PK
        int submission_id FK
        int quiz_question_id FK
        int quiz_option_id FK "Nullable"
        text answer_text "Nullable"
        datetime created_at
        datetime updated_at
    }

    announcements {
        int id PK
        int course_id FK
        int user_id FK
        text content
        datetime created_at
        datetime updated_at
    }

    announcement_comments {
        int id PK
        int announcement_id FK
        int user_id FK
        text content
        datetime created_at
        datetime updated_at
    }

    course_threads {
        int id PK
        int course_id FK
        int author_id FK
        string title
        text content
        bool is_pinned
        datetime created_at
        datetime updated_at
    }

    thread_comments {
        int id PK
        int thread_id FK
        int author_id FK
        text content
        int parent_id FK "Nullable, self-referencing"
        datetime created_at
        datetime updated_at
    }

    home_content {
        int id PK
        string title
        text content
        string background_image
        string image
        string link1
        string link2
        datetime created_at
        datetime updated_at
    }

    about_content {
        int id PK
        string hero_title
        text mission_content "etc."
        datetime created_at
        datetime updated_at
    }

    contact_content {
        int id PK
        string school_name
        string address
        string phone
        string email
        datetime created_at
        datetime updated_at
    }

    users ||--|| instructor_profiles : "has"
    users |o--o{ courses : "enrolls (student)"
    users ||--o{ course_enrollments : "has"
    courses ||--o{ course_enrollments : "has"
    users ||--o{ courses : "creates (instructor)"
    users ||--o{ course_threads : "authors"
    users ||--o{ thread_comments : "authors"
    users ||--o{ submissions : "submits"
    users ||--o{ announcements : "creates_author"
    users ||--o{ announcement_comments : "creates_author_comment"

    courses ||--o{ chapters : "has"
    courses ||--o{ course_threads : "contains"
    courses ||--o{ announcements : "has_course_announcements"
    courses ||--o{ assignments : "contains_assignments"

    chapters ||--o{ resources : "contains_resources"

    resources ||--|| rich_text_resources : "is_rich_text"
    resources ||--|| attachment_resources : "is_attachment_collection"
    resources ||--|| external_resources : "is_external_link"
    resources ||--o{ quiz_questions : "contains_quiz_questions_resource"

    attachment_resources |o--o{ attachments : "has_files" // Polymorphic: AttachmentResource can have many attachments

    assignments ||--o{ submissions : "has_submissions"
    assignments |o--o{ attachments : "has_instruction_files" // Polymorphic: Assignment can have many attachments
    assignments ||--o{ quiz_questions : "is_quiz_assignment"

    submissions |o--o{ attachments : "has_submission_files" // Polymorphic: Submission can have many attachments
    submissions ||--o{ quiz_answers : "contains_quiz_answers"

    quiz_questions ||--o{ quiz_options : "has_options"
    quiz_questions ||--o{ quiz_answers : "has_answers_to_question"
    quiz_options |o--o| quiz_answers : "is_selected_option_for"

    announcements ||--o{ announcement_comments : "has_comments"
    announcements |o--o{ attachments : "has_announcement_attachments" // Polymorphic

    announcement_comments |o--o{ attachments : "has_comment_attachments" // Polymorphic

    course_threads ||--o{ thread_comments : "has_thread_comments"
    course_threads |o--o{ attachments : "has_thread_attachments" // Polymorphic

    thread_comments |o--o{ attachments : "has_comment_attachments_thread" // Polymorphic
    thread_comments }o--o| thread_comments : "replies_to"

```
