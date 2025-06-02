### Student Submits Assignment

```mermaid
sequenceDiagram
    actor Student
    participant Browser
    participant LaravelApp as "Web Server (Laravel)"
    participant SubmissionController
    participant AttachmentModel
    participant FileStorageService
    participant SubmissionModel
    participant Database

    Student->>Browser: Views assignment, fills form (text, uploads files), clicks Submit
    activate Browser
    Browser->>LaravelApp: HTTP POST /courses/{id}/assignments/{assign_id}/submit
    activate LaravelApp
    LaravelApp->>SubmissionController: store(request, course, assignment)
    activate SubmissionController
    SubmissionController->>LaravelApp: Validate request data
    LaravelApp-->>SubmissionController: Validation passes
    opt Files uploaded
        SubmissionController->>AttachmentModel: Create attachment records
        activate AttachmentModel
        AttachmentModel->>FileStorageService: Store files (e.g., S3)
        activate FileStorageService
        FileStorageService-->>AttachmentModel: File paths
        deactivate FileStorageService
        AttachmentModel->>Database: Save attachment metadata (path, type, etc.)
        activate Database
        Database-->>AttachmentModel: Attachment records saved
        deactivate Database
        AttachmentModel-->>SubmissionController: Attachment info
        deactivate AttachmentModel
    end
    SubmissionController->>SubmissionModel: Create submission record (text, user_id, assignment_id, attachment_ids if any)
    activate SubmissionModel
    SubmissionModel->>Database: Save submission data
    activate Database
    Database-->>SubmissionModel: Submission record saved
    deactivate Database
    SubmissionModel-->>SubmissionController: Submission created
    deactivate SubmissionModel
    SubmissionController-->>LaravelApp: Submission successful response
    deactivate SubmissionController
    LaravelApp-->>Browser: HTTP 200 OK (Success with Inertia redirect/data)
    deactivate LaravelApp
    Browser-->>Student: Displays success message and updated UI
    deactivate Browser
```

### Instructor Grades Submission

```mermaid
sequenceDiagram
    actor Instructor
    participant Browser
    participant LaravelApp as "Web Server (Laravel)"
    participant AssignmentController
    participant SubmissionModel
    participant Database
    participant NotificationService opt "Optional"

    Instructor->>Browser: Views submission, enters grade & feedback, clicks Save
    activate Browser
    Browser->>LaravelApp: HTTP PUT /courses/{id}/assignments/{assign_id}/submissions/{sub_id}
    activate LaravelApp
    LaravelApp->>AssignmentController: gradeSubmission(request, course, assignment, submission)
    activate AssignmentController
    AssignmentController->>LaravelApp: Validate request data (grade, feedback)
    LaravelApp-->>AssignmentController: Validation passes
    AssignmentController->>SubmissionModel: Update submission (grade, feedback)
    activate SubmissionModel
    SubmissionModel->>Database: Update submission record
    activate Database
    Database-->>SubmissionModel: Submission updated
    deactivate Database
    SubmissionModel-->>AssignmentController: Updated submission
    deactivate SubmissionModel
    opt Send Notification
        AssignmentController->>NotificationService: Notify student of grading
        activate NotificationService
        NotificationService-->>AssignmentController: Notification queued/sent
        deactivate NotificationService
    end
    AssignmentController-->>LaravelApp: Grading successful response
    deactivate AssignmentController
    LaravelApp-->>Browser: HTTP 200 OK (Success with Inertia redirect/data)
    deactivate LaravelApp
    Browser-->>Instructor: Displays success message and updated UI
    deactivate Browser
```

### User Authentication (Login)

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant LaravelApp as "Web Server (Laravel)"
    participant LoginController
    participant UserModel
    participant SessionService
    participant Database

    User->>Browser: Enters email and password, clicks Login
    activate Browser
    Browser->>LaravelApp: HTTP POST /login
    activate LaravelApp
    LaravelApp->>LoginController: store(request)
    activate LoginController
    LoginController->>LaravelApp: Validate credentials format
    LaravelApp-->>LoginController: Validation passes
    LoginController->>Database: Attempt to authenticate user (check credentials against UserModel)
    activate Database
    Database-->>LoginController: Authentication success/failure
    deactivate Database
    alt Authentication Successful
        LoginController->>SessionService: Start/Regenerate session
        activate SessionService
        SessionService-->>LoginController: Session started
        deactivate SessionService
        LoginController-->>LaravelApp: Authentication successful, redirect to dashboard
        LaravelApp-->>Browser: HTTP 302 Redirect (to dashboard) with session cookie
        deactivate LoginController
        deactivate LaravelApp
        Browser->>LaravelApp: HTTP GET /dashboard (following redirect)
        activate LaravelApp
        LaravelApp-->>Browser: HTTP 200 OK (Dashboard page via Inertia)
        deactivate LaravelApp
        Browser-->>User: Displays Dashboard
    else Authentication Failed
        LoginController-->>LaravelApp: Authentication failed
        deactivate LoginController
        LaravelApp-->>Browser: HTTP 200 OK (Login page with error messages via Inertia)
        deactivate LaravelApp
        Browser-->>User: Displays login error message
    end
    deactivate Browser
```
